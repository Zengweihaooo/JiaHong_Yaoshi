<template>
  <section v-if="step === 'landing'" class="ab-landing">
    <header class="ab-landing__header">
      <span class="ab-logo">嘉虹健康</span>
    </header>
    <main class="ab-landing__main">
      <section class="ab-landing__title">
        <div class="ab-landing__icon">A/B</div>
        <div>
          <h1>嘉虹健康药师端 AB 测试</h1>
          <p>请选择需要查看的 AB 测试页面</p>
        </div>
      </section>

      <section class="ab-test-grid">
        <button
          v-for="(item, index) in testItems"
          :key="item.key"
          :class="['ab-test-card', { 'is-disabled': !item.ready }]"
          type="button"
          @click="openTest(index)"
        >
          <span class="ab-test-card__preview" aria-hidden="true">
            <img
              v-if="item.preview"
              class="ab-test-card__image"
              :src="item.preview"
              :alt="`${item.label} A 方案预览`"
              loading="eager"
              decoding="async"
            />
            <span v-else class="ab-test-card__placeholder">{{ item.label }}</span>
          </span>
          <span class="ab-test-card__foot">
            <span>{{ item.label }}</span>
            <span class="ab-test-card__arrow">›</span>
          </span>
        </button>
      </section>
    </main>

    <button class="ab-back" type="button" @click="router.push({ name: 'home' })">返回药师首页</button>
  </section>

  <section
    v-else-if="step === 'guide'"
    class="ab-guide-stage"
    aria-label="AB 测试引导"
    @click="step = 'select'"
  >
    <img class="ab-guide-stage__image" :src="activeGuideImage" :alt="`${activeGuideName} 引导说明`" />
    <button
      class="ab-guide-stage__back"
      type="button"
      @click.stop="step = 'landing'"
    >
      返回测试首页
    </button>
  </section>

  <section v-else-if="step === 'select'" class="ab-select-stage" aria-label="AB 测试方案选择">
    <img class="ab-select-stage__bg" :src="activeGuideImage" :alt="`${activeGuideName} 引导说明`" />
    <div class="ab-select-stage__dim" aria-hidden="true"></div>

    <div class="ab-select-card">
      <div class="ab-select-card__intro">
        <h1 class="ab-select-card__title">
          <template v-for="(seg, index) in activeSelect.title" :key="`seg-${index}`">
            <strong v-if="seg.bold">{{ seg.text }}</strong>
            <span v-else>{{ seg.text }}</span>
          </template>
        </h1>
        <p class="ab-select-card__subtitle">
          请按照任意顺序体验以下所有页面方案，一个方案操作结束后，在页面左下角切换方案。
        </p>
      </div>

      <div class="ab-select-card__options">
        <button
          v-for="option in activeSelect.options"
          :key="option.key"
          class="ab-select-option"
          type="button"
          @click="enterVariant(option.key)"
        >
          <span class="ab-select-option__label">{{ option.label }}</span>
          <span class="ab-select-option__desc">
            <span v-if="option.dot" class="ab-select-option__dot" aria-hidden="true">·</span>
            <span class="ab-select-option__text">
              {{ option.desc }}<strong v-if="option.strong">{{ option.strong }}</strong>
            </span>
          </span>
        </button>
      </div>
    </div>

    <button class="ab-guide-stage__back" type="button" @click="step = 'landing'">返回测试首页</button>
  </section>

  <ABQuickConsultTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult'"
    :variant="variant"
    @back="step = 'landing'"
    @show-guide="step = 'guide'"
    @switch-variant="enterVariant"
  />

  <ABQuickConsultFormTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult-form'"
    :variant="variant"
    @back="step = 'landing'"
    @show-guide="step = 'guide'"
    @switch-variant="enterVariant"
  />

  <ABQuickConsultConsentTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult-consent'"
    :variant="variant"
    @back="step = 'landing'"
    @show-guide="step = 'guide'"
    @switch-variant="enterVariant"
  />

  <ABQuickConsultNameDotTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult-name-dot'"
    :variant="variant"
    @back="step = 'landing'"
    @show-guide="step = 'guide'"
    @switch-variant="enterVariant"
  />

  <ABRecordsDatePickerTestView
    v-else-if="step === 'test' && activeTestKey === 'records-date-picker'"
    :variant="variant"
    @back="step = 'landing'"
    @show-guide="step = 'guide'"
    @switch-variant="enterVariant"
  />
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import ABQuickConsultTestView from "@/components/ab/ABQuickConsultTestView.vue";
import ABQuickConsultFormTestView from "@/components/ab/ABQuickConsultFormTestView.vue";
import ABQuickConsultConsentTestView from "@/components/ab/ABQuickConsultConsentTestView.vue";
import ABQuickConsultNameDotTestView from "@/components/ab/ABQuickConsultNameDotTestView.vue";
import ABRecordsDatePickerTestView from "@/components/ab/ABRecordsDatePickerTestView.vue";

const router = useRouter();
const route = useRoute();
const step = ref("landing");
const variant = ref("a");
const activeTestKey = ref("quick-consult");

const previewAssetVersion = "2";

function previewAsset(fileName) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}images/ab-test/${fileName}?v=${previewAssetVersion}`;
}

function guideAsset(fileName) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}images/ab-test/guide/${fileName}?v=${previewAssetVersion}`;
}

const testItems = [
  { key: "quick-consult", label: "快速问诊页面", ready: true, preview: previewAsset("quick-consult.png"), guide: guideAsset("quick-consult.jpg") },
  { key: "quick-consult-form", label: "快速问诊表单", ready: true, preview: previewAsset("quick-consult-form.png"), guide: guideAsset("quick-consult-form.jpg") },
  { key: "quick-consult-consent", label: "知情同意书确认", ready: true, preview: previewAsset("quick-consult-consent.png"), guide: guideAsset("quick-consult-consent.jpg") },
  { key: "quick-consult-name-dot", label: "姓名间隔点", ready: true, preview: previewAsset("quick-consult-name-dot.png"), guide: guideAsset("quick-consult-name-dot.jpg") },
  { key: "records-date-picker", label: "问诊记录日期", ready: true, preview: previewAsset("records-date-picker.png"), guide: guideAsset("records-date-picker.jpg") }
];

const activeGuideImage = computed(() => {
  return testItems.find((item) => item.key === activeTestKey.value)?.guide || "";
});

const activeGuideName = computed(() => {
  return testItems.find((item) => item.key === activeTestKey.value)?.label || "";
});

const selectMap = {
  "quick-consult": {
    title: [
      { text: "进入测试方案，任意选择两种或以上药品，然后进行对应症状的匹配。", bold: true }
    ],
    options: [
      { key: "a", label: "方案A", desc: "匹配药品的环节以", strong: "高亮块显示" },
      { key: "b", label: "方案B", desc: "匹配药品的环节以", strong: "提交后的弹窗显示" },
      { key: "c", label: "方案C", desc: "匹配药品的环节以", strong: "高亮翻页卡片显示" }
    ]
  },
  "quick-consult-form": {
    title: [
      { text: "进入测试方案，点击提交，查看不同的报错显示方案。", bold: true }
    ],
    options: [
      { key: "a", label: "方案A", desc: "报错位置高亮且", strong: "报错文字常驻" },
      { key: "b", label: "方案B", desc: "报错位置高亮，", strong: "报错文字弹窗显示" }
    ]
  },
  "quick-consult-consent": {
    title: [
      { text: "进入测试方案，点击提交，查看不同的弹窗位置方案。", bold: true }
    ],
    options: [
      { key: "a", label: "方案A", desc: "弹窗位置居中" },
      { key: "b", label: "方案B", desc: "弹窗位置靠右下" }
    ]
  },
  "quick-consult-name-dot": {
    title: [
      { text: "进入测试方案，任意输入带·的名字", bold: true },
      { text: "（如 依力哈尔·买买提）", bold: false },
      { text: "，查看·的输入方案。", bold: true }
    ],
    options: [
      { key: "a", label: "方案A", desc: "输入器常驻", dot: true },
      { key: "b", label: "方案B", desc: "输入器在输入时出现", dot: true },
      { key: "c", label: "方案C", desc: "输入任意中文特殊字符自动转·" }
    ]
  },
  "records-date-picker": {
    title: [
      { text: "进入测试方案，输入日期范围，查看不同的日期选择方案。", bold: true }
    ],
    options: [
      { key: "a", label: "方案A", desc: "日期范围选择器，开始日期与结束日期一起选择" },
      { key: "b", label: "方案B", desc: "日期选择器，开始日期与结束日分开选择" }
    ]
  }
};

const activeSelect = computed(() => selectMap[activeTestKey.value] || { title: [], options: [] });

function openTest(index) {
  const item = testItems[index];
  if (!item?.ready) {
    ElMessage.info("这个测试项目稍后接入");
    return;
  }
  activeTestKey.value = item.key;
  variant.value = "a";
  step.value = "guide";
}

function enterVariant(nextVariant) {
  variant.value = nextVariant;
  step.value = "test";
}

onMounted(() => {
  const previewKey = typeof route.query.preview === "string" ? route.query.preview : "";
  const previewItem = testItems.find((item) => item.key === previewKey && item.ready);
  if (!previewItem) return;

  activeTestKey.value = previewItem.key;
  variant.value = typeof route.query.variant === "string" ? route.query.variant : "a";
  step.value = "test";
});
</script>

<style scoped>
.ab-landing {
  min-height: var(--jh-viewport-height, 100vh);
  background: #f8f8f9;
}

.ab-landing__header {
  display: flex;
  height: 52px;
  align-items: center;
  padding: 0 24px;
  background: #ffffff;
  box-shadow: 0 1px 1px rgba(16, 42, 67, 0.04);
}

.ab-logo {
  color: var(--jh-color-primary, #006ef9);
  font-size: 18px;
  font-weight: 700;
}

.ab-landing__main {
  width: min(1336px, calc(100vw - 64px));
  margin: 0 auto;
  padding: 55px 0 96px;
}

.ab-landing__title {
  display: flex;
  gap: 22px;
  align-items: flex-start;
}

.ab-landing__icon {
  display: flex;
  width: 55px;
  height: 55px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #eff6ff;
  color: var(--jh-color-primary, #006ef9);
  font-size: 18px;
  font-weight: 700;
}

.ab-landing__title h1 {
  margin: 0;
  color: #1e2939;
  font-size: 33px;
  font-weight: 700;
  line-height: 41px;
}

.ab-landing__title p {
  margin: 5px 0 0;
  color: #99a1af;
  font-size: 19px;
  line-height: 27px;
}

.ab-test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 44px;
}

.ab-test-card {
  display: flex;
  height: 300px;
  flex-direction: column;
  overflow: hidden;
  padding: 1px;
  border: 1px solid #e5e8eb;
  border-radius: 19px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 42, 67, 0.06);
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.ab-test-card:hover:not(.is-disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -14px rgba(16, 42, 67, 0.24), 0 2px 8px rgba(16, 42, 67, 0.08);
}

.ab-test-card.is-disabled {
  opacity: 0.54;
  cursor: not-allowed;
}

.ab-test-card__preview {
  position: relative;
  height: 237px;
  padding: 0;
  overflow: hidden;
  background: #eef1f4;
}

.ab-test-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.ab-test-card__placeholder {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #ffffff;
  color: #99a1af;
  font-size: 16px;
  font-weight: 600;
}

.ab-test-card__foot {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  color: #364153;
  font-size: 19px;
  font-weight: 700;
  line-height: 27px;
}

.ab-test-card__arrow {
  color: #99a1af;
  font-size: 24px;
}

.ab-back {
  position: fixed;
  right: 32px;
  bottom: 28px;
  z-index: 20;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #cfe3ff;
  border-radius: 999px;
  background: #ffffff;
  color: var(--jh-color-primary, #006ef9);
  box-shadow: 0 2px 8px rgba(16, 42, 67, 0.06);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.ab-guide-stage {
  position: fixed;
  inset: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #d7dbe1;
  cursor: pointer;
}

.ab-guide-stage__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

.ab-guide-stage__back {
  position: fixed;
  right: 32px;
  bottom: 28px;
  z-index: 5;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #cfe3ff;
  border-radius: 999px;
  color: var(--jh-color-primary, #006ef9);
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(16, 42, 67, 0.06);
}

.ab-guide-stage__back:hover {
  background: #f5f9ff;
}

.ab-select-stage {
  position: fixed;
  inset: 0;
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow: auto;
  background: #d7dbe1;
}

.ab-select-stage__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
}

.ab-select-stage__dim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(25, 35, 50, 0.48);
  pointer-events: none;
}

.ab-select-card {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: min(835px, calc(100vw - 96px));
  padding: 48px 54px;
  border: 0;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 22px 54px rgba(16, 42, 67, 0.16);
}

.ab-select-card__intro {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ab-select-card__title {
  margin: 0;
  color: #424751;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.496;
  letter-spacing: 0;
}

.ab-select-card__title strong {
  font-weight: 700;
}

.ab-select-card__subtitle {
  margin: 0;
  color: #424751;
  font-size: 16px;
  line-height: 1.496;
  letter-spacing: 0;
}

.ab-select-card__options {
  display: flex;
  flex-wrap: nowrap;
  gap: 46px;
}

.ab-select-option {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 128px;
  padding: 22px;
  border: 1px solid #d8dde1;
  border-radius: 8px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  box-shadow: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.ab-select-option:hover {
  border-color: var(--jh-color-primary, #006ef9);
  box-shadow: 0 14px 30px -14px rgba(0, 110, 249, 0.5);
  transform: translateY(-2px);
}

.ab-select-option__label {
  color: var(--jh-color-primary, #006ef9);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.302;
}

.ab-select-option__desc {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #424751;
  font-size: 18px;
  line-height: 1.4;
  letter-spacing: 0;
}

.ab-select-option__text strong {
  font-weight: 700;
}

.ab-select-option__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border: 0.75px solid #e5e8eb;
  border-radius: 4.5px;
  color: var(--jh-color-primary, #006ef9);
  font-size: 24px;
  line-height: 1;
}

@media (max-width: 720px) {
  .ab-select-card {
    padding: 32px 24px;
  }

  .ab-select-option {
    padding: 18px;
  }

  .ab-select-option__desc {
    font-size: 16px;
  }
}
</style>
