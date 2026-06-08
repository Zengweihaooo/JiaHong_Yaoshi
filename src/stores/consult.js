import { defineStore } from "pinia";

export const useConsultStore = defineStore("consult", {
  state: () => ({
    consultType: "western"
  }),
  actions: {
    setConsultType(type) {
      this.consultType = type === "tcm" ? "tcm" : "western";
    }
  }
});
