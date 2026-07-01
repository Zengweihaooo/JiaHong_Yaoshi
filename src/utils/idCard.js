const ID_CARD_PATTERN = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
const ID_CARD_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const ID_CARD_CHECK_CODES = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
const MAINLAND_PHONE_PATTERN = /^1[3-9]\d{9}$/;

function hasValidBirthDate(idCard) {
  const year = Number(idCard.slice(6, 10));
  const month = Number(idCard.slice(10, 12));
  const day = Number(idCard.slice(12, 14));
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function hasValidIdCardChecksum(idCard) {
  let sum = 0;
  for (let index = 0; index < 17; index += 1) {
    sum += Number(idCard[index]) * ID_CARD_WEIGHTS[index];
  }
  return ID_CARD_CHECK_CODES[sum % 11] === idCard[17];
}

export function isValidMainlandPhone(value) {
  return MAINLAND_PHONE_PATTERN.test(String(value || "").trim());
}

export function isValidIdCardNumber(value) {
  const normalized = String(value || "").trim().toUpperCase();
  if (!ID_CARD_PATTERN.test(normalized)) {
    return false;
  }
  if (!hasValidBirthDate(normalized)) {
    return false;
  }
  return hasValidIdCardChecksum(normalized);
}

export function parseIdCardNumber(idCard) {
  const normalized = String(idCard || "").trim().toUpperCase();
  if (!isValidIdCardNumber(normalized)) {
    return null;
  }

  const birthYear = Number(normalized.slice(6, 10));
  const birthMonth = Number(normalized.slice(10, 12));
  const birthDay = Number(normalized.slice(12, 14));
  const genderCode = Number(normalized.charAt(16));
  const now = new Date();
  let age = now.getFullYear() - birthYear;
  const monthDiff = now.getMonth() + 1 - birthMonth;
  const dayDiff = now.getDate() - birthDay;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return {
    idCard: normalized,
    gender: genderCode % 2 === 1 ? "male" : "female",
    age: String(Math.max(0, age))
  };
}

export async function recognizeIdCardFromImage(_file) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    patientName: "张三",
    idCard: "420106199003150016",
    gender: "male",
    age: String(new Date().getFullYear() - 1990)
  };
}
