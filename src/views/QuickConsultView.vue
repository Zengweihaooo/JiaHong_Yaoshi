<template>
  <div class="quick-consult-page">
    <header class="quick-consult-page__topbar">
      <Button variant="neutral" size="md" icon @click="router.push('/')">
        <img :src="assetUrl('assets/figma-consult/back.svg')" alt="" />
        <span>返回首页</span>
      </Button>
      <div class="quick-consult-page__topbar-right">
        <Button variant="primary" size="md">在线客服</Button>
        <span class="quick-consult-page__store">好药师大药房（九州通大厦店）</span>
      </div>
    </header>

    <main class="quick-consult-page__main">
      <section class="quick-consult-card" aria-label="快速问诊表单">
        <header class="quick-consult-card__header">
          <div class="quick-consult-card__title-row">
            <h1>武汉市好药师大药房南岸店</h1>
            <span class="quick-consult-card__type">快速问诊</span>
          </div>
          <Button variant="outline-secondary" size="sm" @click="router.push('/')">取消问诊</Button>
        </header>

        <div class="quick-consult-card__body">
          <!-- 左栏：用药人信息 + 病史信息 -->
          <div class="quick-consult-card__col">
            <section class="form-section">
              <h2 class="form-section__title">用药人信息</h2>
              <div class="form-grid form-grid--patient">
                <div class="patient-info-fields">
                  <div class="form-field">
                    <span class="form-field__label"><em>*</em>用药人姓名</span>
                    <div
                      :class="['patient-name-control', { 'is-active': patientNameFocused }]"
                      @focusin="patientNameFocused = true"
                      @focusout="handlePatientNameFocusout"
                    >
                      <div class="patient-name-inputbox">
                        <input
                          ref="patientNameInput"
                          v-model="form.patientName"
                          class="patient-name-input"
                          type="text"
                          placeholder="请输入姓名"
                        />
                        <button
                          v-if="form.patientName"
                          class="patient-name-clear"
                          type="button"
                          aria-label="清空姓名"
                          @mousedown.prevent
                          @click="clearPatientName"
                        >
                          ×
                        </button>
                      </div>
                      <button
                        v-if="patientNameFocused"
                        class="patient-name-dot"
                        type="button"
                        aria-label="插入姓名间隔点"
                        @mousedown.prevent
                        @click="insertPatientNameDot"
                      >
                        ·
                      </button>
                    </div>
                  </div>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>性别</span>
                    <div class="form-field__inline">
                      <label class="form-radio"><input v-model="form.gender" type="radio" value="male" /> 男</label>
                      <label class="form-radio"><input v-model="form.gender" type="radio" value="female" /> 女</label>
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>年龄</span>
                    <input v-model="form.age" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入年龄（0-120）" />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label">体重</span>
                    <div class="form-field__suffix">
                      <input v-model="form.weight" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入体重" />
                      <span>kg</span>
                    </div>
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em v-if="requiresIdentityInfo">*</em>手机号码</span>
                    <input
                      v-model="form.phone"
                      class="jh-input-field jh-input-field--sm"
                      type="text"
                      placeholder="请输入手机号码"
                      :aria-required="requiresIdentityInfo"
                    />
                  </label>
                  <label class="form-field">
                    <span class="form-field__label"><em v-if="requiresIdentityInfo">*</em>用药人身份证</span>
                    <input
                      v-model="form.idCard"
                      class="jh-input-field jh-input-field--sm"
                      type="text"
                      placeholder="请输入身份证号码"
                      :aria-required="requiresIdentityInfo"
                    />
                  </label>
                  <label v-if="isChildUnderSix" class="form-field">
                    <span class="form-field__label"><em>*</em>监护人姓名</span>
                    <input v-model="form.guardianName" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入姓名" />
                  </label>
                  <label v-if="isChildUnderSix" class="form-field">
                    <span class="form-field__label"><em>*</em>监护人身份证</span>
                    <input v-model="form.guardianIdCard" class="jh-input-field jh-input-field--sm" type="text" placeholder="请输入身份证号码" />
                  </label>
                </div>
                <div class="patient-proof-fields">
                  <label class="form-field">
                    <span class="form-field__label"><em>*</em>就诊方式</span>
                    <input class="jh-input-field jh-input-field--sm visit-method-field" type="text" value="复诊" disabled />
                  </label>
                  <div class="form-field form-field--upload">
                    <span class="form-field__label"><em v-if="hasMedicines">*</em>复诊凭证</span>
                    <div class="upload-panel">
                      <p class="upload-panel__hint">
                        支持上传线下就诊的历史处方、病历或相关证明，最多 5 张，单张不超过 5MB
                        <a href="#" @click.prevent>示例图片</a>
                      </p>
                      <button class="upload-panel__box" type="button" aria-label="上传复诊凭证">
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="form-section">
              <h2 class="form-section__title">病史信息</h2>
              <div class="form-grid form-grid--history">
                <div class="form-field form-field--toggle">
                  <span class="form-field__label"><em>*</em>过敏史</span>
                  <ToggleField v-model="form.allergy" v-model:detail="form.allergyDetail" />
                </div>
                <div class="form-field form-field--toggle">
                  <span class="form-field__label"><em>*</em>肝功能异常</span>
                  <ToggleField v-model="form.liverAbnormal" v-model:detail="form.liverDetail" />
                </div>
                <div class="form-field form-field--toggle">
                  <span class="form-field__label"><em>*</em>肾功能异常</span>
                  <ToggleField v-model="form.kidneyAbnormal" v-model:detail="form.kidneyDetail" />
                </div>
                <div v-if="showPregnancyOptions" class="form-field form-field--pregnancy">
                  <span class="form-field__label"><em>*</em>妊娠哺乳</span>
                  <div class="pregnancy-options">
                    <button
                      v-for="option in pregnancyOptions"
                      :key="option.value"
                      :class="[
                        'jh-btn',
                        'jh-btn--sm',
                        form.pregnancy === option.value ? 'jh-btn--primary' : 'jh-btn--outline-secondary'
                      ]"
                      type="button"
                      @click="form.pregnancy = option.value"
                    >
                      {{ option.label }}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- 右栏：诊断 + 药品 + 备注 -->
          <div class="quick-consult-card__col">
            <section class="form-section diagnosis-section">
              <h2 class="form-section__title"><em>*</em>线下已确诊疾病</h2>
              <div class="right-field-control diagnosis-picker">
                <input
                  v-model="form.diagnosisKeyword"
                  class="jh-input-field jh-input-field--sm diagnosis-picker__input"
                  type="text"
                  placeholder="请输入线下已确诊的疾病名称"
                  @focus="showDiagnosisDropdown = true"
                  @click="showDiagnosisDropdown = true"
                />
                <div v-if="displayDiagnosisTags.length" class="selected-diagnosis-tags">
                  <DiseaseOption
                    v-for="tag in displayDiagnosisTags"
                    :key="tag.label"
                    :label="tag.label"
                    :disabled="tag.disabled"
                    class="selected-diagnosis-option"
                    @click="removeDiagnosis(tag.label)"
                  />
                </div>
                <div v-if="showDiagnosisDropdown" class="diagnosis-dropdown">
                  <h3>常见疾病</h3>
                  <div class="diagnosis-tags">
                    <DiseaseOption
                      v-for="tag in commonDiagnoses"
                      :key="tag"
                      :label="tag"
                      :selected="form.diagnoses.includes(tag)"
                      :disabled="isDiagnosisDisabled(tag)"
                      @mousedown.prevent
                      @click="toggleDiagnosis(tag)"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section :class="['form-section', 'medicine-section', { 'is-disabled': !canEditMedicine }]">
              <div class="form-section__title-row">
                <h2 class="form-section__title"><em>*</em>所需药品</h2>
                <span class="form-section__note">乙类OTC不需开具处方，请勿录入</span>
              </div>
              <div :class="['right-field-control', 'medicine-search', { 'is-active': medicineFocused, 'is-disabled': !canEditMedicine }]">
                <input
                  v-model="form.medicineKeyword"
                  class="medicine-search__input"
                  type="text"
                  :disabled="!canEditMedicine"
                  :placeholder="medicinePlaceholder"
                  @focus="openMedicineDropdown"
                  @click="openMedicineDropdown"
                />
                <div v-if="showMedicineDropdown" class="medicine-dropdown">
                  <button
                    v-for="option in filteredMedicineOptions"
                    :key="option.id"
                    class="medicine-dropdown__item"
                    type="button"
                    @mousedown.prevent
                    @click="addMedicine(option)"
                  >
                    <span class="medicine-dropdown__type">[{{ medicineTypeLabel(option.type) }}]</span>
                    <span class="medicine-dropdown__name">{{ option.name }}</span>
                    <span class="medicine-dropdown__spec">{{ option.spec }}</span>
                    <span class="medicine-dropdown__unit">{{ option.unit }}</span>
                  </button>
                  <div v-if="!filteredMedicineOptions.length" class="medicine-not-found">
                    <button class="medicine-not-found__action" type="button" @mousedown.prevent @click="registerNewMedicine">
                      <span class="medicine-not-found__icon" aria-hidden="true"></span>
                      新品登记
                    </button>
                    <span>未找到该药品，点击登记</span>
                  </div>
                </div>
              </div>
              <div v-if="canEditMedicine" class="medicine-list">
                <article v-for="item in form.medicines" :key="item.id" class="medicine-row">
                  <span :class="['medicine-type-tag', `medicine-type-tag--${item.type}`]">
                    {{ medicineTypeLabel(item.type) }}
                  </span>
                  <div class="medicine-row__info">
                    <strong>{{ item.name }}</strong>
                  </div>
                  <span class="medicine-row__spec">{{ item.spec }}</span>
                  <div class="medicine-row__qty">
                    <button class="qty-btn" type="button" :disabled="!canEditMedicine" @click="changeQty(item, -1)">−</button>
                    <span class="qty-value">{{ item.qty }}</span>
                    <button class="qty-btn" type="button" :disabled="!canEditMedicine" @click="changeQty(item, 1)">+</button>
                  </div>
                  <div class="medicine-unit" @focusout="handleUnitFocusout($event, item)">
                    <button
                      class="medicine-row__unit"
                      type="button"
                      :disabled="!canEditMedicine"
                      @click="toggleUnitDropdown(item)"
                    >
                      <span>{{ item.unit }}</span>
                      <span class="medicine-row__unit-arrow">⌄</span>
                    </button>
                    <div v-if="activeUnitMedicineId === item.id" class="medicine-unit-menu">
                      <button
                        v-for="unit in medicineUnits"
                        :key="unit"
                        :class="['medicine-unit-menu__item', { 'is-active': item.unit === unit }]"
                        type="button"
                        @mousedown.prevent
                        @click="selectMedicineUnit(item, unit)"
                      >
                        {{ unit }}
                      </button>
                    </div>
                  </div>
                  <button class="medicine-row__remove" type="button" aria-label="删除药品" :disabled="!canEditMedicine" @click="removeMedicine(item.id)">×</button>
                </article>
              </div>
            </section>

            <section class="form-section remark-section">
              <h2 class="form-section__title">备注</h2>
              <div class="right-field-control">
                <input
                  v-model="form.remark"
                  class="jh-input-field jh-input-field--sm"
                  type="text"
                  maxlength="30"
                  placeholder="请输入备注信息，最多30字"
                />
              </div>
            </section>
          </div>
        </div>

        <footer class="quick-consult-card__footer">
          <label class="consent-check">
            <input v-model="form.agreed" type="checkbox" />
            <span class="consent-check__box" aria-hidden="true"></span>
            <span class="consent-check__text">我已阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a></span>
          </label>
          <Button variant="primary" size="md" @click="handleSubmit">提交</Button>
        </footer>
      </section>
    </main>

    <Teleport to="body">
      <div v-if="showConsentDialog" class="consent-confirm-overlay" @click.self="closeConsentDialog">
        <section class="consent-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="consent-confirm-title">
          <header class="consent-confirm-dialog__header">
            <h2 id="consent-confirm-title">互联网问诊知情同意书</h2>
            <button class="consent-confirm-dialog__close" type="button" aria-label="关闭" @click="closeConsentDialog">×</button>
          </header>
          <div class="consent-confirm-dialog__body">
            请确认您是否已经阅读并同意 <a href="#" @click.prevent>《互联网问诊知情同意书》</a>
          </div>
          <footer class="consent-confirm-dialog__footer">
            <Button variant="outline-secondary" size="md" @click="closeConsentDialog">取消</Button>
            <Button variant="primary" size="md" @click="agreeAndSubmit">同意</Button>
          </footer>
        </section>
      </div>

      <div v-if="showConfirmDialog" class="submit-confirm-overlay" @click.self="closeConfirmDialog">
        <section class="submit-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="submit-confirm-title">
          <header class="submit-confirm-dialog__header">
            <h2 id="submit-confirm-title">疾病信息确认</h2>
            <button class="submit-confirm-dialog__close" type="button" aria-label="关闭" @click="closeConfirmDialog">×</button>
          </header>

          <div class="submit-confirm-dialog__warning">
            您选择的药品与线下已确诊疾病不匹配，请重新确认用药人病情。
          </div>

          <div class="submit-confirm-dialog__body">
            <p class="submit-confirm-dialog__tip">
              <span class="submit-confirm-dialog__tip-icon" aria-hidden="true">!</span>
              每个或每组药品至少选择一个疾病信息
            </p>

            <div class="submit-confirm-groups">
              <section v-for="group in diagnosisConfirmGroups" :key="group.id" class="submit-confirm-group">
                <h3>{{ group.medicineName }}</h3>
                <div class="submit-confirm-tags">
                  <DiseaseOption
                    v-for="option in group.options"
                    :key="`${group.id}-${option.label}`"
                    :label="option.label"
                    :selected="isConfirmDiagnosisSelected(group.id, option.label)"
                    :disabled="option.disabled"
                    @click="toggleConfirmDiagnosis(group.id, option.label)"
                  />
                </div>
              </section>
            </div>

            <div v-if="diagnosisConfirmGroups.length === 0" class="submit-confirm-empty">
              已选择的药品和疾病信息匹配，可以继续提交。
            </div>
          </div>

          <footer class="submit-confirm-dialog__footer">
            <Button variant="primary" size="sm" :disabled="!canConfirmDiagnoses" @click="confirmDiagnosesAndSubmit">确定</Button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Button, DiseaseOption, assetUrl } from "@jiahong/ui";
import ToggleField from "@/components/quick-consult/ToggleField.vue";
import { useConsultStore } from "@/stores/consult";

const router = useRouter();
const route = useRoute();
const consultStore = useConsultStore();
const showConfirmDialog = ref(false);
const showConsentDialog = ref(false);
const showDiagnosisDropdown = ref(false);
const showMedicineDropdown = ref(false);
const medicineFocused = ref(false);
const activeUnitMedicineId = ref(null);
const patientNameFocused = ref(false);
const patientNameInput = ref(null);
const confirmDiagnosisSelections = reactive({});

const consultType = computed(() => route.query.type || consultStore.consultType || "western");
const consultSource = computed(() => route.query.source || consultStore.consultSource || "text");
const medicinePlaceholder = computed(() =>
  !canEditMedicine.value
    ? "请将基本信息填写完整后再进行录药"
    : "请输入药品名称或首字母做模糊查询"
);

const pregnancyOptions = [
  { label: "无", value: "none" },
  { label: "备孕中", value: "planning" },
  { label: "怀孕中", value: "pregnant" },
  { label: "哺乳期", value: "lactating" }
];

const commonDiagnoses = [
  "认知障碍",
  "卒中后抑郁",
  "抑郁发作",
  "高血压",
  "急性支气管炎",
  "冠状动脉粥样硬化性心脏病（冠心病）",
  "2型糖尿病",
  "化脓性牙龈炎",
  "类风湿性关节炎",
  "急性扁桃体炎",
  "急性肠炎",
  "细菌性结膜炎",
  "骨关节病",
  "幽门螺旋杆菌感染",
  "高脂血症",
  "急性咽喉炎",
  "泌尿道感染",
  "男性勃起障碍",
  "急性鼻咽炎【感冒】",
  "过敏性鼻炎[变应性鼻炎]",
  "偏头痛",
  "支气管哮喘",
  "手皮肤感染"
];

const medicineOptions = [
  { id: "m-1", type: "western", name: "感冒灵胶囊", spec: "0.5g*24片", unit: "盒" },
  { id: "m-2", type: "tcm", name: "感冒灵颗粒", spec: "10g*7袋", unit: "盒" },
  { id: "m-3", type: "western", name: "草酸艾司西酞普兰片", spec: "10mg*7片", unit: "盒" },
  { id: "m-4", type: "western", name: "阿奇霉素分散片", spec: "0.125g*6片", unit: "盒" },
  { id: "m-5", type: "compound", name: "复方氨酚烷胺胶囊", spec: "10粒", unit: "盒" },
  { id: "m-6", type: "tcm", name: "参苏丸", spec: "6g*10袋", unit: "盒" }
];

const psychMedicineNames = ["草酸艾司西酞普兰片"];
const medicineDiagnosisRules = [
  {
    id: "psych",
    match: (name) => name.includes("草酸艾司西酞普兰片"),
    medicineName: "草酸艾司西酞普兰片",
    options: ["认知障碍", "卒中后抑郁", "抑郁发作"],
    disabledOptions: ["抑郁发作"]
  },
  {
    id: "cold",
    match: (name) => name.includes("感冒"),
    medicineName: "感冒灵胶囊",
    options: ["急性鼻咽炎【感冒】"],
    disabledOptions: []
  }
];
const medicineUnits = ["盒", "瓶", "支", "袋", "板", "片"];

const form = reactive({
  patientName: "",
  gender: "male",
  age: "",
  weight: "",
  phone: "",
  idCard: "",
  guardianName: "",
  guardianIdCard: "",
  allergy: "no",
  allergyDetail: "",
  liverAbnormal: "no",
  liverDetail: "",
  kidneyAbnormal: "no",
  kidneyDetail: "",
  pregnancy: "none",
  diagnosisKeyword: "",
  diagnoses: [],
  medicineKeyword: "",
  medicines: [],
  remark: "",
  agreed: false
});

const parsedAge = computed(() => {
  const age = Number.parseFloat(String(form.age).trim());
  return Number.isFinite(age) ? age : null;
});

const isChildUnderSix = computed(() => parsedAge.value !== null && parsedAge.value < 6);

const patientBaseComplete = computed(() => {
  return Boolean(form.patientName.trim() && form.gender && parsedAge.value !== null);
});

const guardianComplete = computed(() => {
  if (!isChildUnderSix.value) return true;
  return Boolean(form.guardianName.trim() && form.guardianIdCard.trim());
});

const canEditMedicine = computed(() => patientBaseComplete.value && guardianComplete.value);
const hasMedicines = computed(() => canEditMedicine.value && form.medicines.length > 0);
const showPregnancyOptions = computed(() => form.gender === "female");
const requiresIdentityInfo = computed(() => {
  const keyword = form.medicineKeyword.trim();
  return [...form.medicines.map((item) => item.name), keyword].filter(Boolean).some((name) => {
    return psychMedicineNames.some((medicineName) => name.includes(medicineName) || medicineName.includes(name));
  });
});
const confirmedDiagnoses = computed(() => (form.diagnoses.length ? form.diagnoses : ["认知障碍", "卒中后抑郁", "抑郁发作"]));
const confirmedMedicines = computed(() => form.medicines.map((item) => item.name));
const displayDiagnosisTags = computed(() => {
  const tags = form.diagnoses.map((label) => ({
    label,
    disabled: isDiagnosisDisabled(label)
  }));

  if (requiresIdentityInfo.value && !form.diagnoses.includes("抑郁发作")) {
    tags.push({ label: "抑郁发作", disabled: true });
  }

  return tags;
});
const diagnosisConfirmGroups = computed(() => {
  return form.medicines
    .map((medicine) => {
      const rule = medicineDiagnosisRules.find((item) => item.match(medicine.name));
      if (!rule) return null;
      const hasMatchedDiagnosis = rule.options.some((option) => form.diagnoses.includes(option));
      if (hasMatchedDiagnosis) return null;
      return {
        id: `${rule.id}-${medicine.id}`,
        ruleId: rule.id,
        medicineName: medicine.name,
        options: rule.options.map((label) => ({
          label,
          disabled: rule.disabledOptions.includes(label) || isDiagnosisDisabled(label)
        }))
      };
    })
    .filter(Boolean);
});
const canConfirmDiagnoses = computed(() => {
  if (diagnosisConfirmGroups.value.length === 0) return true;
  return diagnosisConfirmGroups.value.every((group) => Boolean(confirmDiagnosisSelections[group.id]));
});
const filteredMedicineOptions = computed(() => {
  const keyword = form.medicineKeyword.trim().toLowerCase();
  if (!keyword) return medicineOptions;
  return medicineOptions.filter((item) => {
    return [item.name, item.spec, medicineTypeLabel(item.type)].some((value) => value.toLowerCase().includes(keyword));
  });
});

function toggleDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  if (form.diagnoses.includes(tag)) {
    removeDiagnosis(tag);
  } else {
    addDiagnosis(tag);
  }
}

function addDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  if (!form.diagnoses.includes(tag)) {
    form.diagnoses.push(tag);
  }
  form.diagnosisKeyword = "";
}

function removeDiagnosis(tag) {
  if (isDiagnosisDisabled(tag)) return;
  form.diagnoses = form.diagnoses.filter((item) => item !== tag);
}

function isDiagnosisDisabled(tag) {
  return requiresIdentityInfo.value && tag === "抑郁发作";
}

function resetConfirmDiagnosisSelections() {
  Object.keys(confirmDiagnosisSelections).forEach((key) => {
    delete confirmDiagnosisSelections[key];
  });
}

function isConfirmDiagnosisSelected(groupId, label) {
  return confirmDiagnosisSelections[groupId] === label;
}

function toggleConfirmDiagnosis(groupId, label) {
  const group = diagnosisConfirmGroups.value.find((item) => item.id === groupId);
  const option = group?.options.find((item) => item.label === label);
  if (!group || option?.disabled) return;
  if (confirmDiagnosisSelections[groupId] === label) {
    delete confirmDiagnosisSelections[groupId];
  } else {
    confirmDiagnosisSelections[groupId] = label;
  }
}

function closeDiagnosisDropdown(event) {
  if (!event.target.closest(".diagnosis-section")) {
    showDiagnosisDropdown.value = false;
  }
  if (!event.target.closest(".medicine-section")) {
    showMedicineDropdown.value = false;
    medicineFocused.value = false;
    activeUnitMedicineId.value = null;
  }
}

function changeQty(item, delta) {
  item.qty = Math.max(1, (item.qty || 1) + delta);
}

function removeMedicine(id) {
  form.medicines = form.medicines.filter((item) => item.id !== id);
}

function medicineTypeLabel(type) {
  if (type === "tcm") return "中成药";
  if (type === "compound") return "复方";
  return "西药";
}

function openMedicineDropdown() {
  if (!canEditMedicine.value) return;
  showMedicineDropdown.value = true;
  medicineFocused.value = true;
}

function addMedicine(option) {
  const duplicate = form.medicines.some((item) => item.name === option.name && item.spec === option.spec);
  if (!duplicate) {
    form.medicines.push({
      id: Date.now(),
      type: option.type,
      name: option.name,
      spec: option.spec,
      qty: 1,
      unit: option.unit
    });
  }
  form.medicineKeyword = "";
  showMedicineDropdown.value = false;
  medicineFocused.value = false;
}

function registerNewMedicine() {
  if (!canEditMedicine.value) return;
  router.push({ name: "new-product", query: form.medicineKeyword.trim() ? { keyword: form.medicineKeyword.trim() } : {} });
}

function toggleUnitDropdown(item) {
  activeUnitMedicineId.value = activeUnitMedicineId.value === item.id ? null : item.id;
}

function selectMedicineUnit(item, unit) {
  item.unit = unit;
  activeUnitMedicineId.value = null;
}

function handleUnitFocusout(event, item) {
  if (!event.currentTarget.contains(event.relatedTarget) && activeUnitMedicineId.value === item.id) {
    activeUnitMedicineId.value = null;
  }
}

function handlePatientNameFocusout(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    patientNameFocused.value = false;
  }
}

function focusPatientNameInput() {
  requestAnimationFrame(() => {
    patientNameInput.value?.focus();
  });
}

function insertPatientNameDot() {
  const input = patientNameInput.value;
  if (!input) return;
  const start = input.selectionStart ?? form.patientName.length;
  const end = input.selectionEnd ?? start;
  form.patientName = `${form.patientName.slice(0, start)}·${form.patientName.slice(end)}`;
  focusPatientNameInput();
  requestAnimationFrame(() => {
    input.setSelectionRange(start + 1, start + 1);
  });
}

function clearPatientName() {
  form.patientName = "";
  focusPatientNameInput();
}

function handleSubmit() {
  if (!form.agreed) {
    showConsentDialog.value = true;
    return;
  }
  if (diagnosisConfirmGroups.value.length > 0) {
    resetConfirmDiagnosisSelections();
    showConfirmDialog.value = true;
    return;
  }
  goTextConsult();
}

function agreeAndSubmit() {
  form.agreed = true;
  showConsentDialog.value = false;
  if (diagnosisConfirmGroups.value.length > 0) {
    resetConfirmDiagnosisSelections();
    showConfirmDialog.value = true;
    return;
  }
  goTextConsult();
}

function closeConsentDialog() {
  showConsentDialog.value = false;
}

function closeConfirmDialog() {
  showConfirmDialog.value = false;
}

function confirmDiagnosesAndSubmit() {
  if (!canConfirmDiagnoses.value) return;
  Object.values(confirmDiagnosisSelections).forEach((label) => {
    addDiagnosis(label);
  });
  resetConfirmDiagnosisSelections();
  goTextConsult();
}

function genderLabel(gender) {
  return gender === "female" ? "女" : "男";
}

function goTextConsult() {
  showConfirmDialog.value = false;
  consultStore.setVisitInfo({
    patientName: form.patientName.trim(),
    gender: form.gender,
    genderLabel: genderLabel(form.gender),
    age: String(form.age).trim(),
    weight: String(form.weight).trim(),
    phone: form.phone.trim(),
    idCard: form.idCard.trim(),
    guardianName: form.guardianName.trim(),
    guardianIdCard: form.guardianIdCard.trim(),
    diagnoses: [...form.diagnoses],
    medicines: form.medicines.map((item) => ({
      id: item.id,
      type: item.type,
      typeLabel: medicineTypeLabel(item.type),
      name: item.name,
      spec: item.spec,
      qty: item.qty,
      unit: item.unit
    })),
    allergy: form.allergy,
    allergyDetail: form.allergyDetail.trim(),
    liverAbnormal: form.liverAbnormal,
    liverDetail: form.liverDetail.trim(),
    kidneyAbnormal: form.kidneyAbnormal,
    kidneyDetail: form.kidneyDetail.trim(),
    pregnancy: form.pregnancy,
    remark: form.remark.trim(),
    source: consultSource.value === "convenient" ? "convenient" : "text"
  });
  router.push({ name: "text-consult", query: { source: consultSource.value === "convenient" ? "convenient" : "text" } });
}

watch(
  () => form.gender,
  (gender) => {
    if (gender === "male") {
      form.pregnancy = "none";
    }
  }
);

onMounted(() => {
  document.addEventListener("mousedown", closeDiagnosisDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", closeDiagnosisDropdown);
});
</script>

<style scoped>
.quick-consult-page {
  min-height: var(--jh-viewport-height, 100vh);
  background: #f5f5f5;
}

.quick-consult-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 24px;
  background: var(--jh-color-bg-surface);
  border-bottom: 1px solid var(--jh-color-border);
}

.quick-consult-page__topbar :deep(.jh-btn) {
  height: 26px;
  padding: 3px 12px;
  border-radius: var(--jh-radius-sm);
  font-size: 12px;
}

.quick-consult-page__topbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.quick-consult-page__store {
  color: var(--jh-color-text);
  font-size: 12px;
}

.quick-consult-page__main {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 28px clamp(24px, 3vw, 56px);
}

.quick-consult-card {
  width: 100%;
  min-height: 720px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-lg);
  background: var(--jh-color-bg-surface);
  box-shadow: var(--jh-shadow-soft);
  overflow: hidden;
}

.quick-consult-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 44px;
  border-bottom: 1px solid var(--jh-color-border);
}

.quick-consult-card__title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-consult-card__title-row h1 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.quick-consult-card__type {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-primary);
  font-size: 14px;
  background: color-mix(in srgb, var(--jh-color-primary) 12%, var(--jh-color-bg-surface));
}

.quick-consult-card__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0;
  min-height: 580px;
}

.quick-consult-card__col {
  padding: 38px 44px 20px;
}

.quick-consult-card__col + .quick-consult-card__col {
  border-left: 1px solid var(--jh-color-border);
}

.form-section + .form-section {
  margin-top: 28px;
}

.form-section__title {
  position: relative;
  margin: 0 0 18px;
  padding-left: 10px;
  color: var(--jh-color-text);
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.form-section__title::before {
  position: absolute;
  top: 6px;
  left: 0;
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background: var(--jh-color-primary);
  content: "";
}

.form-section__title em {
  margin-right: 4px;
  color: var(--jh-color-danger);
  font-style: normal;
}

.form-section__title-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 14px;
}

.form-section__title-row .form-section__title {
  margin-bottom: 0;
}

.form-section__note {
  color: var(--jh-color-muted);
  font-size: 14px;
  line-height: 26px;
}

.form-grid {
  display: grid;
  gap: 14px 18px;
}

.form-grid--patient {
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
  align-items: start;
}

.patient-info-fields,
.patient-proof-fields {
  display: grid;
  gap: 14px;
}

.form-grid--history {
  grid-template-columns: 1fr;
}

.form-field {
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 40px;
}

.form-field--upload {
  align-items: start;
}

.form-field--upload .form-field__label {
  padding-top: 0;
  line-height: 32px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field__label {
  color: var(--jh-color-text);
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  white-space: nowrap;
}

.form-field__label em {
  margin-right: 2px;
  color: var(--jh-color-danger);
  font-style: normal;
}

.form-field__inline {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 40px;
}

.form-radio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--jh-color-text);
  font-size: 16px;
  cursor: pointer;
}

.form-radio input {
  accent-color: var(--jh-color-primary);
}

.patient-name-control {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.patient-name-inputbox {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  background: var(--jh-color-bg-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.patient-name-inputbox:hover {
  border-color: #1f2933;
}

.patient-name-control.is-active .patient-name-inputbox {
  border-color: var(--jh-color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--jh-color-primary) 18%, transparent);
}

.patient-name-input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 38px 0 12px;
  border: 0;
  border-radius: inherit;
  color: var(--jh-color-text);
  font: inherit;
  font-size: 16px;
  line-height: 40px;
  background: transparent;
  outline: none;
}

.patient-name-input::placeholder {
  color: var(--jh-color-placeholder, #b8bec8);
}

.quick-consult-card input::placeholder {
  color: var(--jh-color-placeholder, #b8bec8);
}

.patient-name-clear {
  position: absolute;
  top: 50%;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  background: #b7c0cc;
  cursor: pointer;
  transform: translateY(-50%);
}

.patient-name-dot {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-primary);
  font-size: 18px;
  line-height: 1;
  background: var(--jh-color-bg-surface);
  cursor: pointer;
}

.patient-name-dot:hover {
  border-color: var(--jh-color-primary);
}

.form-field__suffix {
  display: flex;
  align-items: center;
  gap: 0;
}

.form-field__suffix span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: -1px;
  border: 1px solid var(--jh-color-border);
  border-radius: 0 var(--jh-radius-sm) var(--jh-radius-sm) 0;
  color: var(--jh-color-muted);
  font-size: 14px;
  background: var(--jh-color-bg-page);
}

.form-field__suffix .jh-input-field {
  border-radius: var(--jh-radius-sm) 0 0 var(--jh-radius-sm);
}

.visit-method-field {
  cursor: not-allowed;
}

.upload-panel__hint {
  margin: 0 0 8px;
  color: var(--jh-color-muted);
  font-size: 16px;
  line-height: 26px;
}

.upload-panel__hint a {
  margin-left: 8px;
  color: var(--jh-color-primary);
}

.upload-panel__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border: 1px dashed var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-muted);
  font-size: 28px;
  background: var(--jh-color-bg-page);
  cursor: pointer;
}

.pregnancy-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pregnancy-options .jh-btn {
  height: 34px;
  padding: 5px 16px;
  font-size: 16px;
}

.quick-consult-card .diagnosis-section,
.quick-consult-card .medicine-section {
  display: block;
  gap: normal;
  padding: 0;
}

.right-field-control {
  box-sizing: border-box;
  width: 100%;
}

.right-field-control .jh-input-field {
  box-sizing: border-box;
  width: 100%;
}

.diagnosis-picker {
  position: relative;
}

.diagnosis-picker__input {
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 8px 14px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-text);
  font-family: var(--jh-font-family);
  font-size: 16px;
  line-height: 22px;
  background: var(--jh-color-bg-surface);
  box-shadow: none;
  outline: 0;
  appearance: none;
  -webkit-appearance: none;
}

.diagnosis-picker__input:hover {
  border-color: #1f2933;
}

.diagnosis-picker__input:focus,
.diagnosis-picker__input:focus-visible {
  border-color: var(--jh-color-primary);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--jh-color-primary) 18%, transparent);
  outline: 0;
}

.selected-diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.selected-diagnosis-option {
  cursor: default;
}

.selected-diagnosis-option:hover {
  border-color: #d8dde1;
  color: var(--jh-color-text);
  background: var(--jh-color-bg-surface);
}

.diagnosis-dropdown {
  position: absolute;
  z-index: 20;
  box-sizing: border-box;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  width: 100%;
  max-height: 270px;
  padding: 10px 14px 14px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  background: var(--jh-color-bg-surface);
  box-shadow: var(--jh-shadow-soft);
  overflow-y: auto;
}

.diagnosis-dropdown::-webkit-scrollbar {
  width: 8px;
}

.diagnosis-dropdown::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #d8dde1;
}

.diagnosis-dropdown h3 {
  margin: 0 0 18px;
  padding-left: 0;
  color: var(--jh-color-muted);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.diagnosis-dropdown h3::before {
  display: none;
  content: none;
}

.diagnosis-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 10px;
}

.medicine-section.is-disabled .form-section__note {
  color: var(--jh-color-muted);
}

.medicine-search {
  position: relative;
}

.medicine-search__input {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  padding: 5px 12px;
  border: 1px solid #e5e8eb;
  border-radius: 6px;
  color: var(--jh-color-text);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.medicine-search__input:hover {
  border-color: #338bfa;
}

.medicine-search.is-active .medicine-search__input {
  border-color: #005ed4;
}

.medicine-search.is-disabled .medicine-search__input {
  border-color: #e5e8eb;
  color: var(--jh-color-muted);
  background: #f8f8f9;
  cursor: not-allowed;
}

.medicine-dropdown {
  position: absolute;
  z-index: 18;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  max-height: 236px;
  padding: 4px 0;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(19, 29, 43, 0.12);
  overflow-y: auto;
}

.medicine-dropdown__item {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 96px 38px;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 5px 12px;
  border: 0;
  color: #697383;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  background: #fff;
  cursor: pointer;
}

.medicine-dropdown__item:hover {
  background: #f5f9ff;
}

.medicine-dropdown__type {
  color: #697383;
}

.medicine-dropdown__name,
.medicine-dropdown__spec {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-not-found {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 8px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.medicine-not-found__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 28px;
  padding: 4px 12px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
  cursor: pointer;
}

.medicine-not-found__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.medicine-not-found__icon::before,
.medicine-not-found__icon::after {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 11px;
  height: 2px;
  border-radius: 2px;
  background: #fff;
  content: "";
  transform: translate(-50%, -50%);
}

.medicine-not-found__icon::after {
  width: 2px;
  height: 11px;
}

.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 8px;
}

.medicine-row {
  display: grid;
  grid-template-columns: 65px minmax(120px, 1fr) 114px 102px 56px 28px;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 10px;
  border: 0;
  border-bottom: 4px solid #fff;
  border-radius: 0;
  background: #f5f9ff;
}

.medicine-type-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 24px;
  padding: 2px 12px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}

.medicine-type-tag--western {
  border-color: #2ba471;
  color: #2ba471;
  background: #eef8f4;
}

.medicine-type-tag--tcm {
  border-color: #e37318;
  color: #e37318;
  background: #fdf4ed;
}

.medicine-type-tag--compound {
  border-color: #006ef9;
  color: #006ef9;
  background: #f5f9ff;
}

.medicine-row__info {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 40px;
  padding: 0 8px;
}

.medicine-row__info strong {
  color: #697383;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-row__spec {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  border-radius: 6px;
  color: #697383;
  font-size: 14px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medicine-row__qty {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 102px;
  padding: 2px;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  background: #fff;
}

.qty-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  color: #3c4449;
  font-size: 16px;
  line-height: 1;
  background: #fff;
  cursor: pointer;
}

.medicine-row__qty:hover,
.medicine-row__qty:focus-within {
  border-color: #006ef9;
}

.medicine-row__qty:hover .qty-btn,
.medicine-row__qty:focus-within .qty-btn {
  background: #f3f5f6;
}

.qty-btn:disabled,
.medicine-row__unit:disabled,
.medicine-row__remove:disabled {
  color: var(--jh-color-muted);
  cursor: not-allowed;
  opacity: 0.5;
}

.qty-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
  text-align: center;
}

.medicine-unit {
  position: relative;
  width: 56px;
}

.medicine-row__unit {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  width: 56px;
  padding: 0 8px 0 12px;
  border: 1px solid #d0d5d9;
  border-radius: 4px;
  color: #3c4449;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  cursor: pointer;
}

.medicine-row__unit:hover,
.medicine-row__unit:focus-visible {
  border-color: #006ef9;
  outline: none;
}

.medicine-row__unit-arrow {
  color: #848f9a;
  font-size: 12px;
  line-height: 1;
}

.medicine-unit-menu {
  position: absolute;
  z-index: 16;
  top: calc(100% + 6px);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 66px;
  padding: 8px;
  border: 1px solid #d8dde1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 16px 40px -16px rgba(16, 42, 67, 0.14), 0 4px 8px -2px rgba(16, 42, 67, 0.08);
}

.medicine-unit-menu__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  min-height: 24px;
  padding: 2px 8px;
  border: 0;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.6);
  font: inherit;
  font-size: 12px;
  line-height: 20px;
  background: transparent;
  cursor: pointer;
}

.medicine-unit-menu__item.is-active {
  color: #fff;
  background: #006ef9;
}

.medicine-row__remove {
  width: 28px;
  height: 32px;
  border: 0;
  color: var(--jh-color-danger);
  font-size: 22px;
  background: transparent;
  cursor: pointer;
}

.quick-consult-card__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  min-height: 84px;
  padding: 0 44px 28px;
}

.consent-check {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--jh-color-text);
  font-size: 16px;
  cursor: pointer;
}

.consent-check input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.consent-check__box {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border: 1.925px solid #e5e8eb;
  border-radius: 4px;
  background: #fff;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.consent-check:hover .consent-check__box {
  border-color: #3b92ff;
}

.consent-check input:checked + .consent-check__box {
  border-color: transparent;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
}

.consent-check input:checked + .consent-check__box::after {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 13px;
  height: 8px;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #fff;
  border-radius: 1px;
  content: "";
  transform: translate(-50%, -62%) rotate(-45deg);
}

.consent-check__text {
  color: var(--jh-color-muted);
}

.consent-check a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.jh-input-field {
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 8px 14px;
  font-size: 16px;
}

.jh-input-field:disabled {
  color: var(--jh-color-muted);
  background: #f8f9fb;
  cursor: not-allowed;
}

.quick-consult-card :deep(.jh-btn--sm) {
  min-width: 0;
}

.quick-consult-card__footer :deep(.jh-btn) {
  width: 122px;
  height: 44px;
  font-size: 18px;
}

.consent-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.48);
}

.consent-confirm-dialog {
  width: min(720px, calc(100vw - 48px));
  border-radius: var(--jh-radius-md);
  background: var(--jh-color-bg-surface);
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.2);
}

.consent-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 34px 36px 20px;
}

.consent-confirm-dialog__header h2 {
  margin: 0;
  color: var(--jh-color-text);
  font-size: 26px;
  font-weight: 400;
  line-height: 36px;
}

.consent-confirm-dialog__close {
  width: 32px;
  height: 32px;
  border: 0;
  color: var(--jh-color-muted);
  font-size: 32px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.consent-confirm-dialog__body {
  padding: 28px 36px 40px;
  color: var(--jh-color-text);
  font-size: 22px;
  line-height: 34px;
}

.consent-confirm-dialog__body a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.consent-confirm-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  padding: 0 36px 36px;
}

.consent-confirm-dialog__footer :deep(.jh-btn) {
  width: 96px;
  height: 46px;
  font-size: 20px;
}

.submit-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(19, 29, 43, 0.45);
}

.submit-confirm-dialog {
  width: min(778px, calc(100vw - 48px));
  border-radius: 8px;
  background: var(--jh-color-bg-surface);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(19, 29, 43, 0.22);
}

.submit-confirm-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e8eb;
  background: #fff;
}

.submit-confirm-dialog__header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
}

.submit-confirm-dialog__close {
  width: 32px;
  height: 32px;
  border: 0;
  color: #8b98a7;
  font-size: 34px;
  line-height: 1;
  background: transparent;
  cursor: pointer;
}

.submit-confirm-dialog__close:hover {
  background: var(--jh-color-bg-page);
}

.submit-confirm-dialog__warning {
  padding: 10px 22px;
  color: #ff6b1a;
  font-size: 16px;
  line-height: 24px;
  background: #fff2df;
}

.submit-confirm-dialog__body {
  display: grid;
  gap: 14px;
  padding: 18px 30px 18px;
  background: #fff;
}

.submit-confirm-dialog__tip {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  color: #ff6b1a;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.submit-confirm-dialog__tip-icon {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  background: #ee7417;
}

.submit-confirm-groups {
  display: grid;
  gap: 10px;
}

.submit-confirm-group {
  min-height: 96px;
  padding: 14px 18px;
  border-radius: 4px;
  background: #f3f7fd;
}

.submit-confirm-group h3 {
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.48);
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}

.submit-confirm-group :deep(.jh-disease-option) {
  min-height: 34px;
  padding: 4px 16px;
  font-size: 16px;
  line-height: 24px;
}

.submit-confirm-empty {
  padding: 32px 18px;
  border-radius: 4px;
  color: var(--jh-color-muted);
  font-size: 16px;
  text-align: center;
  background: #f3f7fd;
}

.submit-confirm-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: start;
  gap: 12px;
}

.submit-confirm-row__label {
  color: var(--jh-color-text);
  font-size: 13px;
  line-height: 28px;
  text-align: right;
}

.submit-confirm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.submit-confirm-tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid var(--jh-color-border);
  border-radius: var(--jh-radius-sm);
  color: var(--jh-color-muted);
  font-size: 13px;
  background: #fff;
}

.submit-confirm-dialog__footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 30px 24px;
  background: #fff;
}

.submit-confirm-dialog__footer :deep(.jh-btn) {
  width: 96px;
  height: 56px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 700;
}

@media (max-width: 960px) {
  .quick-consult-card__body {
    grid-template-columns: 1fr;
  }

  .quick-consult-card__col + .quick-consult-card__col {
    border-top: 1px solid var(--jh-color-border);
    border-left: 0;
  }

  .form-grid--patient {
    grid-template-columns: 1fr;
  }

  .patient-info-fields,
  .patient-proof-fields {
    gap: 12px;
  }

  .form-field {
    grid-template-columns: 128px minmax(0, 1fr);
  }

  .medicine-row {
    grid-template-columns: 1fr;
  }

  .quick-consult-card__footer {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
</style>
