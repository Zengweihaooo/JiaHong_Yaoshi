import { onBeforeUnmount, ref } from "vue";

const NOTICE_LIFETIME_MS = 3000;

export const FIELD_NOTICE_ORDER = [
  "phone",
  "idCard",
  "guardianName",
  "guardianIdCard",
  "patientName",
  "age",
  "proof",
  "allergyDetail",
  "liverDetail",
  "kidneyDetail",
  "diagnoses",
  "medicines"
];

export function useTopFormNotices() {
  const notices = ref([]);
  const timers = new Map();

  function removeNotice(id) {
    notices.value = notices.value.filter((item) => item.id !== id);
    const timer = timers.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.delete(id);
    }
  }

  function pushNotice(message, variant = "error") {
    if (!message) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    notices.value = [...notices.value, { id, message, variant }];
    timers.set(
      id,
      window.setTimeout(() => {
        removeNotice(id);
      }, NOTICE_LIFETIME_MS)
    );
  }

  function pushNotices(items = []) {
    items.forEach((item, index) => {
      window.setTimeout(() => {
        pushNotice(item.message, item.variant || "error");
      }, index * 80);
    });
  }

  function clearNotices() {
    notices.value.forEach((item) => removeNotice(item.id));
    notices.value = [];
  }

  onBeforeUnmount(() => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers.clear();
  });

  return {
    notices,
    pushNotice,
    pushNotices,
    clearNotices
  };
}

export function collectFieldNotices(formErrors, shouldInclude) {
  return FIELD_NOTICE_ORDER.map((key) => {
    const issue = formErrors[key];
    if (!issue?.message || !shouldInclude(key)) return null;
    return {
      message: issue.message,
      variant: issue.type === "warning" ? "warning" : "error"
    };
  }).filter(Boolean);
}
