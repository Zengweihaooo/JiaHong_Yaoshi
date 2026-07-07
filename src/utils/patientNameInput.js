export const PATIENT_NAME_SEPARATOR = "·";

const CHINESE_NAME_CHAR_PATTERN = /[\u3400-\u9fff]/;
const DOT_ALIASES = new Set(["·", "•", "・", "．", "﹒", "."]);

export function isPatientNameChar(char) {
  return CHINESE_NAME_CHAR_PATTERN.test(char) || DOT_ALIASES.has(char);
}

export function normalizePatientNameDots(value = "") {
  const normalized = Array.from(value)
    .map((char) => {
      if (CHINESE_NAME_CHAR_PATTERN.test(char)) return char;
      if (DOT_ALIASES.has(char)) return PATIENT_NAME_SEPARATOR;
      return PATIENT_NAME_SEPARATOR;
    })
    .join("");

  return normalized.replace(/·{2,}/g, PATIENT_NAME_SEPARATOR);
}
