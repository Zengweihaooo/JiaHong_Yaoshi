<template>
  <Teleport to="body">
    <div v-if="visible" class="voice-proof-overlay" @click.self="handleClose">
      <section class="voice-proof-dialog" role="dialog" aria-modal="true" aria-labelledby="voice-proof-title">
        <header class="voice-proof-dialog__header">
          <h2 id="voice-proof-title">患者复诊承诺</h2>
          <button class="voice-proof-dialog__close" type="button" aria-label="关闭" @click="handleClose">
            <img :src="closeIcon" alt="" />
          </button>
        </header>

        <div class="voice-proof-dialog__wave-section">
          <div class="voice-proof-dialog__wave-box">
            <div v-if="!isRecording && !hasRecording" class="voice-proof-dialog__wave-idle">
              <img :src="waveformIdle" alt="" aria-hidden="true" />
            </div>
            <div v-else class="voice-proof-dialog__wave-active" aria-hidden="true">
              <span
                v-for="(height, index) in waveformBars"
                :key="index"
                class="voice-proof-dialog__wave-bar"
                :style="{ height: `${height}px` }"
              ></span>
            </div>
          </div>
          <p class="voice-proof-dialog__hint">
            <span>请点击说话按钮</span>
            <span>用普通话朗读以下内容</span>
          </p>
        </div>

        <div class="voice-proof-dialog__body">
          <p class="voice-proof-dialog__script">
            本人承诺已进行过线下就诊，本次为互联网诊疗复诊，信息真实。
          </p>
          <button
            :class="['voice-proof-dialog__mic', { 'is-recording': isRecording, 'is-done': hasRecording && !isRecording }]"
            type="button"
            :aria-label="isRecording ? '停止录音' : hasRecording ? '重新录音' : '开始录音'"
            @click="toggleRecording"
          >
            <img :src="voiceLargeIcon" alt="" aria-hidden="true" />
          </button>
          <p v-if="isRecording" class="voice-proof-dialog__status">录音中…再次点击麦克风结束并保存</p>
          <p v-else-if="hasRecording" class="voice-proof-dialog__status">录音完成，正在保存…</p>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import closeIcon from "@/assets/figma-proof-upload/dialog-close.svg";
import voiceLargeIcon from "@/assets/figma-proof-upload/voice-large.svg";
import waveformIdle from "@/assets/figma-proof-upload/waveform-idle.png";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "confirm"]);

const isRecording = ref(false);
const hasRecording = ref(false);
const waveformBars = ref(createFlatBars());
const recordedBlob = ref(null);
const recordedDuration = ref(0);

let mediaStream = null;
let mediaRecorder = null;
let audioContext = null;
let analyser = null;
let animationFrameId = null;
let recordedChunks = [];
let recordingStartedAt = 0;
let recorderMimeType = "audio/webm";

function createFlatBars(count = 48) {
  return Array.from({ length: count }, () => 4);
}

function resetRecordingState() {
  stopRecording(false);
  hasRecording.value = false;
  recordedBlob.value = null;
  recordedDuration.value = 0;
  recordingStartedAt = 0;
  waveformBars.value = createFlatBars();
  recordedChunks = [];
}

function handleClose() {
  resetRecordingState();
  emit("close");
}

function confirmRecording() {
  if (!recordedBlob.value) {
    window.alert("未检测到有效录音，请重新录制。");
    return;
  }
  const file = new File([recordedBlob.value], `语音凭证-${Date.now()}.webm`, {
    type: recordedBlob.value.type || recorderMimeType
  });
  emit("confirm", {
    file,
    duration: recordedDuration.value
  });
  resetRecordingState();
}

function getSupportedMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function finalizeRecording() {
  if (!recordedChunks.length) {
    window.alert("录音保存失败，请重新录制。");
    return;
  }
  recordedBlob.value = new Blob(recordedChunks, { type: recorderMimeType });
  recordedDuration.value = Math.max(1, Math.ceil((Date.now() - recordingStartedAt) / 1000));
  hasRecording.value = true;
  waveformBars.value = createFlatBars();
  confirmRecording();
}

async function toggleRecording() {
  if (isRecording.value) {
    stopRecording(true);
    return;
  }

  if (hasRecording.value) {
    resetRecordingState();
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);

    const mimeType = getSupportedMimeType();
    recorderMimeType = mimeType || "audio/webm";
    mediaRecorder = mimeType ? new MediaRecorder(mediaStream, { mimeType }) : new MediaRecorder(mediaStream);
    recordedChunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      mediaRecorder = null;
      finalizeRecording();
    };

    mediaRecorder.start(200);
    recordingStartedAt = Date.now();
    isRecording.value = true;
    updateWaveform();
  } catch {
    window.alert("无法访问麦克风，请检查浏览器权限后重试。");
  }
}

function updateWaveform() {
  if (!analyser || !isRecording.value) return;
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const step = Math.floor(data.length / waveformBars.value.length);
  waveformBars.value = waveformBars.value.map((_, index) => {
    const value = data[index * step] || 0;
    return Math.max(4, Math.round((value / 255) * 44));
  });
  animationFrameId = requestAnimationFrame(updateWaveform);
}

function stopRecording(save) {
  isRecording.value = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    if (save) {
      mediaRecorder.stop();
    } else {
      mediaRecorder.onstop = null;
      mediaRecorder.stop();
      recordedChunks = [];
      mediaRecorder = null;
    }
  }
  mediaStream?.getTracks().forEach((track) => track.stop());
  mediaStream = null;
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  analyser = null;
  if (!save) {
    mediaRecorder = null;
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) resetRecordingState();
  }
);

onBeforeUnmount(() => {
  stopRecording(false);
});
</script>

<style scoped>
.voice-proof-overlay {
  position: fixed;
  inset: 0;
  z-index: 3200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(122, 136, 152, 0.3);
}

.voice-proof-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(622px, calc(100vw - 40px));
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 84px 64px -20px rgba(16, 42, 67, 0.18), 0 8px 16px -4px rgba(16, 42, 67, 0.1);
  overflow: hidden;
}

.voice-proof-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  box-sizing: border-box;
}

.voice-proof-dialog__header h2 {
  margin: 0;
  color: #1e2939;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.voice-proof-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.voice-proof-dialog__close img {
  display: block;
  width: 20px;
  height: 20px;
}

.voice-proof-dialog__wave-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.voice-proof-dialog__wave-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 356px;
  max-width: 100%;
  height: 64px;
  padding: 4px 12px;
  border-radius: 12px;
  background: linear-gradient(270deg, #fcfcfc 0%, #f8f8f9 100%);
}

.voice-proof-dialog__wave-idle img {
  display: block;
  width: 265px;
  max-width: 100%;
  height: 1px;
}

.voice-proof-dialog__wave-active {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 265px;
  max-width: 100%;
  height: 44px;
}

.voice-proof-dialog__wave-bar {
  flex: 0 0 3px;
  width: 3px;
  border-radius: 999px;
  background: #006ef9;
  transition: height 0.08s linear;
}

.voice-proof-dialog__hint {
  display: flex;
  gap: 15px;
  margin: 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
  line-height: 33px;
  white-space: nowrap;
}

.voice-proof-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 36px;
  align-items: center;
  width: 100%;
  padding: 24px 47px 32px;
  box-sizing: border-box;
}

.voice-proof-dialog__script {
  width: min(475px, 100%);
  margin: 0;
  color: #e37318;
  font-size: 28px;
  line-height: normal;
  text-align: center;
}

.voice-proof-dialog__mic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 12.865px;
  border: 0;
  border-radius: 28px;
  background: linear-gradient(270deg, #fcfcfc 0%, #f8f8f9 100%);
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.voice-proof-dialog__mic img {
  display: block;
  width: 30px;
  height: 30px;
}

.voice-proof-dialog__mic.is-recording {
  box-shadow: 0 0 0 4px rgba(0, 110, 249, 0.16);
  transform: scale(1.02);
}

.voice-proof-dialog__mic.is-done {
  box-shadow: 0 0 0 4px rgba(43, 164, 113, 0.16);
}

.voice-proof-dialog__status {
  margin: -20px 0 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 22px;
}

.voice-proof-dialog__footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 0 24px 24px;
  box-sizing: border-box;
}

.voice-proof-dialog__footer :deep(.jh-btn) {
  min-width: 88px;
}
</style>
