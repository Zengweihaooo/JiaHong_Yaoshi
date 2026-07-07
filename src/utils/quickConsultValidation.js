import { isValidIdCardNumber, isValidMainlandPhone } from "@/utils/idCard";

export function createFieldIssue(message = "", type = "") {
  return { message, type };
}

export function createEmptyFormErrors() {
  return {
    patientName: createFieldIssue(),
    age: createFieldIssue(),
    phone: createFieldIssue(),
    idCard: createFieldIssue(),
    guardianName: createFieldIssue(),
    guardianIdCard: createFieldIssue(),
    proof: createFieldIssue(),
    allergyDetail: createFieldIssue(),
    liverDetail: createFieldIssue(),
    kidneyDetail: createFieldIssue(),
    diagnoses: createFieldIssue(),
    medicines: createFieldIssue()
  };
}

export function validateAge(value, { unit = "year" } = {}) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return createFieldIssue("请输入年龄", "error");
  }
  if (!/^(0|[1-9]\d*)$/.test(raw)) {
    return createFieldIssue("请输入正确的年龄", "warning");
  }
  const age = Number(raw);
  if (unit === "month") {
    if (age < 1 || age > 11) {
      return createFieldIssue("请输入1-11个月龄", "warning");
    }
    return createFieldIssue();
  }
  if (age < 0 || age > 120) {
    return createFieldIssue("请输入正确的年龄", "warning");
  }
  return createFieldIssue();
}

export function validatePhone(value, { required = false } = {}) {
  const phone = String(value || "").trim();
  if (!phone) {
    return required ? createFieldIssue("请输入手机号码", "error") : createFieldIssue();
  }
  if (!isValidMainlandPhone(phone)) {
    return createFieldIssue("请输入正确的11位手机号", "warning");
  }
  return createFieldIssue();
}

export function validateIdCard(value, { required = false } = {}) {
  const idCard = String(value || "").trim();
  if (!idCard) {
    return required ? createFieldIssue("请输入身份证号码", "error") : createFieldIssue();
  }
  if (!isValidIdCardNumber(idCard)) {
    return createFieldIssue("请输入正确的身份证号码", "warning");
  }
  return createFieldIssue();
}

export function validateQuickConsultForm({
  form,
  proofVoice,
  proofImages,
  isChildUnderSix,
  canEditMedicine,
  skipDiagnosesValidation = false
}) {
  const errors = createEmptyFormErrors();

  if (!form.patientName.trim()) {
    errors.patientName = createFieldIssue("请输入姓名", "error");
  }

  errors.age = validateAge(form.age, { unit: form.ageUnit });
  errors.phone = validatePhone(form.phone, { required: true });
  errors.idCard = validateIdCard(form.idCard, { required: true });

  if (isChildUnderSix) {
    if (!form.guardianName.trim()) {
      errors.guardianName = createFieldIssue("请输入姓名", "error");
    }
    errors.guardianIdCard = validateIdCard(form.guardianIdCard, { required: true });
  }

  if (!proofVoice && !proofImages.length) {
    errors.proof = createFieldIssue("请上传凭证", "error");
  }

  if (form.allergy === "yes" && !form.allergyDetail.trim()) {
    errors.allergyDetail = createFieldIssue("请填写过敏史", "error");
  }
  if (form.liverAbnormal === "yes" && !form.liverDetail.trim()) {
    errors.liverDetail = createFieldIssue("请输入肝功能异常", "error");
  }
  if (form.kidneyAbnormal === "yes" && !form.kidneyDetail.trim()) {
    errors.kidneyDetail = createFieldIssue("请填写肾功能异常", "error");
  }

  if (!skipDiagnosesValidation && !form.diagnoses.length) {
    errors.diagnoses = createFieldIssue("请输入线下已确诊的疾病名称", "error");
  }

  if (canEditMedicine && !form.medicines.length) {
    errors.medicines = createFieldIssue("请您至少录入一条药品信息", "error");
  }

  const valid = !Object.values(errors).some((issue) => issue.message);
  return { valid, errors };
}
