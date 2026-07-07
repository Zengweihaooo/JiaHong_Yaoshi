import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const previewUrl = "http://localhost:5174/";
const debugPort = 9223;
const chromeProfile = path.join(process.env.HOME || "", ".cursor", "jiahong-yaoshi-chrome-preview");
const chromeBinary = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

let reloadTimer;
let viteProcess;

async function chromeIsRunning() {
  try {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
    return response.ok;
  } catch {
    return false;
  }
}

async function chromeExists() {
  try {
    await access(chromeBinary);
    return true;
  } catch {
    return false;
  }
}

function openChrome() {
  spawn(
    chromeBinary,
    [
      `--app=${previewUrl}`,
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${chromeProfile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-features=TranslateUI"
    ],
    { detached: true, stdio: "ignore" }
  ).unref();
}

function reloadChrome() {
  reloadViaCdp().catch((error) => {
    console.warn("[preview] Chrome reload skipped:", error.message);
  });
}

async function reloadViaCdp() {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json`);
  if (!response.ok) throw new Error("Chrome debug port unavailable");

  const targets = await response.json();
  const target = targets.find(
    (item) => item.type === "page" && item.url && item.url.includes("localhost:5174")
  );
  if (!target?.webSocketDebuggerUrl) throw new Error("preview tab not found");

  await new Promise((resolve, reject) => {
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    const timeout = setTimeout(() => {
      ws.close();
      resolve();
    }, 1500);

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.reload", params: { ignoreCache: false } }));
    });
    ws.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.id === 1) {
        clearTimeout(timeout);
        ws.close();
        resolve();
      }
    });
    ws.addEventListener("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

function scheduleReload(reason) {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    console.log(`[preview] reload after ${reason}`);
    reloadChrome();
  }, 900);
}

function watchProject() {
  for (const dir of ["src", "public"]) {
    watch(path.join(projectRoot, dir), { recursive: true }, (_event, filename) => {
      if (!filename) return;
      scheduleReload(filename);
    });
  }
}

function startDevServer() {
  viteProcess = spawn("npm", ["run", "dev"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
    env: process.env
  });

  viteProcess.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

async function waitForDevServer(maxAttempts = 40) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) return true;
    } catch {
      // keep waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

async function main() {
  if (!(await chromeExists())) {
    console.error("[preview] Google Chrome not found at:", chromeBinary);
    process.exit(1);
  }

  const devAlreadyRunning = await waitForDevServer(4);
  if (!devAlreadyRunning) {
    console.log("[preview] starting vite dev server...");
    startDevServer();
    const ready = await waitForDevServer();
    if (!ready) {
      console.error("[preview] dev server did not become ready on", previewUrl);
      process.exit(1);
    }
  } else {
    console.log("[preview] using existing dev server at", previewUrl);
  }

  if (await chromeIsRunning()) {
    console.log("[preview] refreshing existing Chrome preview window");
    reloadChrome();
  } else {
    console.log("[preview] opening persistent Chrome preview window");
    openChrome();
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  watchProject();
  console.log("[preview] watching src/ and public/ — page reloads after each compile");
}

process.on("SIGINT", () => {
  if (viteProcess) viteProcess.kill("SIGINT");
  process.exit(0);
});

main().catch((error) => {
  console.error("[preview] failed:", error);
  process.exit(1);
});
