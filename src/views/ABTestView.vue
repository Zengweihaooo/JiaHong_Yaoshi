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

  <section v-else-if="step === 'guide'" class="ab-guide-stage" aria-label="AB 测试引导">
    <img class="ab-guide-stage__preview" :src="activeGuidePreview" :alt="`${activeGuide.name} A 方案预览`" />
    <div class="ab-guide-stage__dim" aria-hidden="true"></div>

    <header class="ab-guide-float ab-guide-float--header">
      <p class="ab-guide-float__eyebrow">测试项目：{{ activeGuide.name }}</p>
      <h1>
        {{ activeGuide.titleBefore }}<strong>{{ activeGuide.primary }}</strong>{{ activeGuide.titleMiddle }}<strong>{{ activeGuide.secondary }}</strong>{{ activeGuide.titleAfter || "" }}
      </h1>
      <p>{{ activeGuide.desc }}</p>
    </header>

    <div
      v-for="(hotspot, index) in activeHotspots"
      :key="`hotspot-${index}`"
      class="ab-guide-hotspot"
      :style="hotspotStyle(hotspot.anchor)"
    >
      <span class="ab-guide-hotspot__ring" aria-hidden="true"></span>
      <span class="ab-guide-hotspot__tag">{{ hotspot.labelText }}</span>
    </div>

    <button
      v-for="option in activeGuide.options"
      :key="option.key"
      class="ab-guide-float ab-guide-float--option"
      type="button"
      :style="cardStyle(option.card)"
      @click="enterVariant(option.key)"
    >
      <strong>选项 {{ option.label }}</strong>
      <span>{{ option.desc }}</span>
    </button>

    <button class="ab-guide-stage__back" type="button" @click="step = 'landing'">返回测试首页</button>
  </section>

  <ABQuickConsultTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult'"
    :variant="variant"
    @back="step = 'landing'"
    @switch-variant="enterVariant"
  />

  <ABQuickConsultFormTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult-form'"
    :variant="variant"
    @back="step = 'landing'"
    @switch-variant="enterVariant"
  />

  <ABQuickConsultConsentTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult-consent'"
    :variant="variant"
    @back="step = 'landing'"
    @switch-variant="enterVariant"
  />

  <ABQuickConsultNameDotTestView
    v-else-if="step === 'test' && activeTestKey === 'quick-consult-name-dot'"
    :variant="variant"
    @back="step = 'landing'"
    @switch-variant="enterVariant"
  />

  <ABRecordsDatePickerTestView
    v-else-if="step === 'test' && activeTestKey === 'records-date-picker'"
    :variant="variant"
    @back="step = 'landing'"
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

const testItems = [
  { key: "quick-consult", label: "快速问诊页面", ready: true, preview: previewAsset("quick-consult.png") },
  { key: "quick-consult-form", label: "快速问诊表单", ready: true, preview: previewAsset("quick-consult-form.png") },
  { key: "quick-consult-consent", label: "知情同意书确认", ready: true, preview: previewAsset("quick-consult-consent.png") },
  { key: "quick-consult-name-dot", label: "姓名间隔点", ready: true, preview: previewAsset("quick-consult-name-dot.png") },
  { key: "records-date-picker", label: "问诊记录日期", ready: true, preview: previewAsset("records-date-picker.png") }
];

const guideMap = {
  "quick-consult": {
    name: "快速问诊页面",
    titleBefore: "请选择您喜欢的",
    primary: "药品与疾病",
    titleMiddle: "关联",
    secondary: "展示方式",
    desc: "请关注右侧「所需药品」区域：A 平铺展示、B 提交弹窗、C 卡片堆叠并可左右切换。",
    options: [
      {
        key: "a",
        label: "A",
        desc: "在页面中直接展示每个药品对应的疾病选项",
        anchor: { top: 34, left: 51, width: 43, height: 34 },
        card: { top: 20, left: 30 }
      },
      {
        key: "b",
        label: "B",
        desc: "提交时以弹窗形式确认药品与疾病的对应关系",
        anchor: { top: 76, left: 70, width: 16, height: 9 },
        card: { top: 60, left: 48 }
      },
      {
        key: "c",
        label: "C",
        desc: "页面内以卡片展示单个药品病症，右下角可左右切换",
        anchor: { top: 34, left: 51, width: 43, height: 34 },
        card: { top: 52, left: 30 }
      }
    ]
  },
  "quick-consult-form": {
    name: "快速问诊表单",
    titleBefore: "请选择您喜欢的",
    primary: "表单校验",
    titleMiddle: "错误",
    secondary: "提示方式",
    desc: "请关注左侧基本信息区域与页面顶部：A 在字段下方提示，B 统一在顶部堆叠提示。",
    options: [
      {
        key: "a",
        label: "A",
        desc: "可修改字段在下方提示，系统类错误在顶部提示（如暂无医生）",
        anchor: { top: 30, left: 11, width: 24, height: 14 },
        card: { top: 42, left: 2 }
      },
      {
        key: "b",
        label: "B",
        desc: "所有校验错误统一在顶部堆叠提示，约 3 秒渐消上滑消失",
        anchor: { top: 12, left: 24, width: 48, height: 11 },
        card: { top: 30, left: 62 }
      }
    ]
  },
  "quick-consult-consent": {
    name: "知情同意书确认",
    titleBefore: "请选择您喜欢的",
    primary: "知情同意书",
    titleMiddle: "确认按钮",
    secondary: "位置",
    desc: "请关注知情同意书弹窗位置：A 屏幕居中且按钮居中，B 靠近提交按钮右下且按钮右对齐。",
    options: [
      {
        key: "a",
        label: "A",
        desc: "弹窗屏幕居中，取消与同意按钮水平居中",
        anchor: { top: 36, left: 35, width: 30, height: 24 },
        card: { top: 24, left: 6 }
      },
      {
        key: "b",
        label: "B",
        desc: "弹窗靠近提交按钮右下，按钮右对齐",
        anchor: { top: 68, left: 60, width: 30, height: 22 },
        card: { top: 48, left: 6 }
      }
    ]
  },
  "quick-consult-name-dot": {
    name: "姓名间隔点",
    titleBefore: "请选择您喜欢的",
    primary: "少数民族姓名",
    titleMiddle: "间隔点",
    secondary: "输入方式",
    desc: "请关注「用药人姓名」输入框：三种方案对间隔点按钮的展示与输入方式不同。",
    options: [
      {
        key: "a",
        label: "A",
        desc: "间隔点按钮常驻在输入框右侧，随时可点击插入",
        anchor: { top: 20, left: 9, width: 24, height: 9 },
        card: { top: 10, left: 36 }
      },
      {
        key: "b",
        label: "B",
        desc: "输入时输入框内显示间隔点按钮，输入完成后与输入框合并为单框",
        anchor: { top: 20, left: 9, width: 24, height: 9 },
        card: { top: 28, left: 36 }
      },
      {
        key: "c",
        label: "C",
        desc: "无间隔点按钮，输入的非姓名字符自动转换为间隔点",
        anchor: { top: 20, left: 9, width: 24, height: 9 },
        card: { top: 46, left: 36 }
      }
    ]
  },
  "records-date-picker": {
    name: "问诊记录日期",
    titleBefore: "请选择您喜欢的",
    primary: "问诊记录",
    titleMiddle: "日期范围",
    secondary: "选择方式",
    desc: "请关注筛选区第一行日期控件：A 合并为一个范围选择器，B 拆成开始与结束两个选择器。",
    options: [
      {
        key: "a",
        label: "A",
        desc: "合并选择：一个日期范围选择器，可任意顺序点选起止日期",
        anchor: { top: 15, left: 7, width: 30, height: 8 },
        card: { top: 6, left: 40 }
      },
      {
        key: "b",
        label: "B",
        desc: "分开选择：开始日期与结束日期各用一个独立选择器",
        anchor: { top: 15, left: 7, width: 30, height: 8 },
        card: { top: 24, left: 40 }
      }
    ]
  }
};

const activeGuide = computed(() => guideMap[activeTestKey.value]);

const activeGuidePreview = computed(() => {
  return testItems.find((item) => item.key === activeTestKey.value)?.preview || "";
});

const activeHotspots = computed(() => {
  const options = activeGuide.value?.options || [];
  const anchorMap = new Map();

  options.forEach((option) => {
    const key = `${option.anchor.top}-${option.anchor.left}-${option.anchor.width}-${option.anchor.height}`;
    if (!anchorMap.has(key)) {
      anchorMap.set(key, { anchor: option.anchor, labels: [option.label] });
      return;
    }
    anchorMap.get(key).labels.push(option.label);
  });

  return Array.from(anchorMap.values()).map((item) => ({
    anchor: item.anchor,
    labelText: item.labels.length > 1 ? `选项 ${item.labels.join(" / ")}` : `选项 ${item.labels[0]}`
  }));
});

function hotspotStyle(anchor) {
  return {
    top: `${anchor.top}%`,
    left: `${anchor.left}%`,
    width: `${anchor.width}%`,
    height: `${anchor.height}%`
  };
}

function cardStyle(card) {
  return {
    top: `${card.top}%`,
    left: `${card.left}%`
  };
}

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
  overflow: hidden;
  background: #d7dbe1;
}

.ab-guide-stage__preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

.ab-guide-stage__dim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.34);
  pointer-events: none;
}

.ab-guide-float {
  position: absolute;
  z-index: 4;
}

.ab-guide-float--header {
  top: 20px;
  left: 50%;
  width: min(720px, calc(100vw - 48px));
  padding: 18px 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(16, 42, 67, 0.18);
  transform: translateX(-50%);
}

.ab-guide-float__eyebrow {
  margin: 0 0 8px;
  color: #697383;
  font-size: 14px;
  line-height: 22px;
}

.ab-guide-float--header h1 {
  margin: 0 0 8px;
  color: #424751;
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 400;
  line-height: 1.35;
}

.ab-guide-float--header h1 strong {
  font-weight: 700;
}

.ab-guide-float--header p:last-child {
  margin: 0;
  color: #697383;
  font-size: 15px;
  line-height: 24px;
}

.ab-guide-hotspot {
  position: absolute;
  z-index: 2;
}

.ab-guide-hotspot__ring {
  position: absolute;
  inset: 0;
  border: 2px solid #006ef9;
  border-radius: 8px;
  background: rgba(0, 110, 249, 0.08);
  box-shadow: 0 0 0 1px rgba(0, 110, 249, 0.28), 0 0 18px rgba(0, 110, 249, 0.28);
  animation: ab-guide-pulse 2.2s ease-in-out infinite;
}

.ab-guide-hotspot__tag {
  position: absolute;
  top: -11px;
  left: 10px;
  z-index: 1;
  padding: 2px 8px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  background: #006ef9;
}

.ab-guide-float--option {
  display: block;
  width: min(272px, 30vw);
  padding: 16px 18px;
  border: 1px solid #e5e8eb;
  border-radius: 10px;
  background: #ffffff;
  text-align: left;
  box-shadow: 0 12px 32px rgba(16, 42, 67, 0.14);
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
}

.ab-guide-float--option:hover {
  border-color: var(--jh-color-primary, #006ef9);
  background: #f5f9ff;
  transform: translateY(-2px);
}

.ab-guide-float--option strong {
  display: block;
  margin-bottom: 6px;
  color: var(--jh-color-primary, #006ef9);
  font-size: 20px;
  line-height: 26px;
}

.ab-guide-float--option span {
  color: #697383;
  font-size: 14px;
  line-height: 22px;
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

@keyframes ab-guide-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 1px rgba(0, 110, 249, 0.28), 0 0 14px rgba(0, 110, 249, 0.22);
  }

  50% {
    box-shadow: 0 0 0 1px rgba(0, 110, 249, 0.45), 0 0 22px rgba(0, 110, 249, 0.38);
  }
}

@media (max-width: 960px) {
  .ab-guide-float--header {
    top: 12px;
    width: calc(100vw - 24px);
    padding: 14px 16px;
  }

  .ab-guide-float--option {
    width: min(240px, 72vw);
  }
}
</style>
