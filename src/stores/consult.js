import { defineStore } from "pinia";

const VISIT_INFO_KEY = "jiahong_visit_info";

function readVisitInfo() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(VISIT_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeVisitInfo(info) {
  if (typeof window === "undefined") return;
  try {
    if (info) {
      window.sessionStorage.setItem(VISIT_INFO_KEY, JSON.stringify(info));
    } else {
      window.sessionStorage.removeItem(VISIT_INFO_KEY);
    }
  } catch {
    // Ignore storage failures; Pinia state still carries the data during navigation.
  }
}

export const useConsultStore = defineStore("consult", {
  state: () => ({
    consultType: "western",
    consultSource: "text",
    visitInfo: readVisitInfo()
  }),
  actions: {
    setConsultType(type) {
      this.consultType = type === "tcm" ? "tcm" : "western";
    },
    setConsultSource(source) {
      this.consultSource = source === "convenient" ? "convenient" : "text";
    },
    setVisitInfo(info) {
      this.visitInfo = info;
      writeVisitInfo(info);
    },
    clearVisitInfo() {
      this.visitInfo = null;
      writeVisitInfo(null);
    }
  }
});
