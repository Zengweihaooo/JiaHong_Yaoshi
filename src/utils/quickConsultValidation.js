import { isValidIdCardNumber, isValidMainlandPhone } from "@/utils/idCard";

export function createEmptyFormErrors() {
  return {
    patientName: "",
    age: "",
    phone: "",
    idCard: "",
    guardianName: "",
    guardianIdCard: "",
    proof: "",
    allergyDetail: "",
    liverDetail: "",
    kidneyDetail: "",
    diagnoses: "",
    medicines: ""
  };
}

export function validateAge(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return "请输入年龄（0-120）";
  }
  if (!/^(0|[1-9]\d*)$/.test(raw)) {
    return "年龄须为0-120之间的整数";
  }
  const age = Number(raw);
  if (age < 0 || age > 120) {
    return "请输入年龄（0-120）";
  }
  return "";
}

export function validatePhone(value, { required = false } = {}) {
  const phone = String(value || "").trim();
  if (!phone) {
    return required ? "请输入正确的11位手机号" : "";
  }
  if (!isValidMainlandPhone(phone)) {
    return "请输入正确的11位手机号";
  }
  return "";
}

export function validateIdCard(value, { required = false } = {}) {
  const idCard = String(value || "").trim();
  if (!idCard) {
    return required ? "请输入正确的18位身份证号" : "";
  }
  if (!isValidIdCardNumber(idCard)) {
    return "请输入正确的18位身份证号";
  }
  return "";
}

export function validateQuickConsultForm({
  form,
  proofVoice,
  proofImages,
  isChildUnderSix,
  canEditMedicine
}) {
  const errors = createEmptyFormErrors();

  if (!form.patientName.trim()) {
    errors.patientName = "请输入姓名";
  }

  errors.age = validateAge(form.age);

  errors.phone = validatePhone(form.phone, { required: true });
  errors.idCard = validateIdCard(form.idCard, { required: true });

  if (isChildUnderSix) {
    if (!form.guardianName.trim()) {
      errors.guardianName = "请输入姓名";
    }
    errors.guardianIdCard = validateIdCard(form.guardianIdCard, { required: true });
  }

  if (!proofVoice && !proofImages.length) {
    errors.proof = "请上传凭证";
  }

  if (form.allergy === "yes" && !form.allergyDetail.trim()) {
    errors.allergyDetail = "请填写过敏史";
  }
  if (form.liverAbnormal === "yes" && !form.liverDetail.trim()) {
    errors.liverDetail = "请填写肝功能异常";
  }
  if (form.kidneyAbnormal === "yes" && !form.kidneyDetail.trim()) {
    errors.kidneyDetail = "请填写肾功能异常";
  }

  if (!form.diagnoses.length) {
    errors.diagnoses = "请输入线下已确诊的疾病名称";
  }

  if (canEditMedicine && !form.medicines.length) {
    errors.medicines = "请您至少录入一条药品信息";
  }

  const valid = !Object.values(errors).some(Boolean);
  return { valid, errors };
}
