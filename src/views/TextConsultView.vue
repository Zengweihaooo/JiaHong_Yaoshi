<template>
  <div class="text-consult-page">
    <header class="page-topbar">
      <Button class="page-topbar__back" variant="neutral" size="md" icon @click="router.push('/')">
        <el-icon class="page-topbar__back-icon" aria-hidden="true">
          <ArrowLeft />
        </el-icon>
        <span>返回首页</span>
      </Button>
      <div class="page-topbar__right">
        <Button variant="primary" size="md">在线客服</Button>
        <span class="page-topbar__divider" />
        <span class="page-topbar__store">好药师大药房（九州通大厦店）</span>
      </div>
    </header>

    <main class="text-consult-main">
      <section class="tc-shell" aria-label="图文问诊">
        <header class="tc-shell__header">
          <div class="tc-shell__title">
            <h1>武汉市好药师大药房南岸店</h1>
            <span>快速问诊</span>
          </div>
          <Button class="tc-cancel-consult-btn" variant="outline-secondary" size="sm" @click="router.push('/')">
            <img :src="cancelConsultIcon" alt="" />
            取消问诊
          </Button>
        </header>

        <div class="tc-shell__body">
          <section
            class="tc-chat"
            :class="{
              'tc-chat--decision': showDoctorFollowUp && !prescriptionReady && !consultCancelled,
              'tc-chat--ready': prescriptionReady,
              'tc-chat--cancelled': consultCancelled
            }"
            aria-label="问诊对话"
          >
            <!-- 对话消息按发送顺序自然排列，新增内容只滚动消息区，不改变输入区位置。 -->
            <div ref="chatScrollRef" class="tc-chat-scroll">
              <p class="tc-chat-time">2026-01-13 16:38:21</p>

              <article class="tc-doctor-message">
                <div class="tc-doctor-avatar" aria-hidden="true">
                  <img v-if="doctorAvatar" :src="doctorAvatar" alt="" />
                  <span v-else>蒲</span>
                </div>
                <div class="tc-doctor-message__content">
                  <span class="tc-doctor-name">蒲测试</span>
                  <div class="tc-doctor-bubble">
                    您好，我是蒲测试医生，很高兴为您提供在线问诊及用药咨询服务。我将根据您的病情进一步提供诊疗意见，感谢您的配合。
                  </div>
                </div>
              </article>

              <article class="tc-visit-card" :style="{ '--visit-card-bg': `url(${visitCardBg})` }" aria-label="就诊信息">
                <div class="tc-visit-card__content">
                  <header class="tc-visit-card__title">
                    <img class="tc-visit-card__icon" :src="prescriptionIcon" alt="" />
                    <strong>就诊信息</strong>
                  </header>
                  <dl>
                    <dt>患者信息</dt>
                    <dd>{{ patientSummary }}</dd>
                    <dt>咨询药品</dt>
                    <template v-if="medicineLines.length">
                      <dd v-for="line in medicineLines" :key="line">{{ line }}</dd>
                    </template>
                    <dd v-else>暂无</dd>
                    <dt>是否有过敏史</dt>
                    <dd>{{ allergySummary }}</dd>
                  </dl>
                </div>
                <span class="tc-visit-card__badge">W</span>
              </article>

              <article v-if="showDoctorFollowUp" class="tc-doctor-message tc-doctor-message--follow">
                <div class="tc-doctor-avatar" aria-hidden="true">
                  <img v-if="doctorAvatar" :src="doctorAvatar" alt="" />
                  <span v-else>蒲</span>
                </div>
                <div class="tc-doctor-message__content">
                  <span class="tc-doctor-name">蒲测试</span>
                  <div class="tc-doctor-bubble">
                    您已确诊过此疾病并使用过该药品，且无相关禁忌症和不良反应。请问您是否还有信息需要补充?如无，我将依据病情为您开具处方。
                  </div>
                </div>
              </article>

              <div v-if="showDoctorFollowUp && !prescriptionReady && !consultCancelled" class="tc-decision">
                <div class="tc-decision__label">请选择</div>
                <div class="tc-decision__actions">
                  <button class="tc-decision-btn tc-decision-btn--ghost" type="button" @click="showCancelDialog = true">
                    信息有误，取消开方
                  </button>
                  <button class="tc-decision-btn tc-decision-btn--primary" type="button" @click="confirmPrescription">无需补充，立即开方</button>
                </div>
              </div>

              <article v-if="consultCancelled" class="tc-patient-message">
                <div class="tc-patient-bubble">信息有误，取消开方</div>
                <span class="tc-patient-avatar">W</span>
              </article>

              <article v-if="prescriptionReady" class="tc-patient-message">
                <div class="tc-patient-bubble">无需补充，立即开方</div>
                <span class="tc-patient-avatar">W</span>
              </article>

              <article v-if="prescriptionReady" class="tc-doctor-message tc-doctor-message--final">
                <div class="tc-doctor-avatar" aria-hidden="true">
                  <img v-if="doctorAvatar" :src="doctorAvatar" alt="" />
                  <span v-else>蒲</span>
                </div>
                <div class="tc-doctor-message__content">
                  <span class="tc-doctor-name">蒲测试</span>
                  <div class="tc-doctor-bubble">您的处方已开出，本次诊疗已结束，请移步收款台购药。</div>
                </div>
              </article>

              <button v-if="prescriptionReady" class="tc-print-card" type="button">
                <span class="tc-print-card__text">
                  <strong>打印处方</strong>
                  <em>问诊完成，点击打印</em>
                </span>
                <span class="tc-print-card__icon" aria-hidden="true">
                  <img :src="printPrescriptionIcon" alt="" />
                </span>
              </button>
            </div>

            <!-- 医生要求二选一时隐藏自由输入，完成选择后恢复聊天输入框。 -->
            <footer v-if="!showDoctorFollowUp || prescriptionReady || consultCancelled" class="tc-reply">
              <textarea placeholder="输入回复内容"></textarea>
              <div class="tc-reply__actions">
                <button class="tc-image-action" type="button" aria-label="上传图片"></button>
                <button class="tc-quick-reply" type="button">快捷回复</button>
                <button class="tc-send-btn" type="button">发送</button>
              </div>
            </footer>
          </section>

          <aside v-if="isConvenientConsult" class="tc-video-sidebar" aria-label="视频问诊">
            <img :src="convenientVideoImage" alt="视频问诊医生画面" />
          </aside>

          <aside v-else class="tc-reminder" aria-label="用药提醒">
            <section class="tc-reminder__intro">
              <h2>用药提醒</h2>
              <p>
                以下内容仅用于帮助您了解用药注意事项，具体是否适合使用、如何使用，请以互联网医生问诊和处方为准。
              </p>
            </section>

            <MedicationReminder
              title="草酸艾司西酞普兰片"
              risk-label="高风险"
              risk-type="high"
              description="该药为精神心理相关处方药，通常用于抑郁、惊恐等相关疾病的治疗。"
              :warnings="mentalWarnings"
              :safety="mentalSafety"
            />

            <MedicationReminder
              title="感冒灵胶囊"
              risk-label="低风险"
              risk-type="low"
              description="常用于缓解感冒引起的发热、头痛、鼻塞、流涕、咽痛等症状。"
              :warnings="coldWarnings"
              :safety="coldSafety"
            />
          </aside>
        </div>
      </section>
    </main>

    <div v-if="consultCancelled" class="tc-status-toast" role="status">取消问诊成功，当前问诊已结束。</div>

    <div v-if="showCancelDialog" class="tc-cancel-overlay" role="presentation">
      <section class="tc-cancel-dialog" role="dialog" aria-modal="true" aria-labelledby="tc-cancel-title">
        <header class="tc-cancel-dialog__header">
          <h2 id="tc-cancel-title">取消问诊</h2>
          <button class="tc-cancel-dialog__close" type="button" aria-label="关闭" @click="showCancelDialog = false">
            <img :src="cancelDialogCloseIcon" alt="" />
          </button>
        </header>
        <div class="tc-cancel-dialog__body">是否确定取消问诊?</div>
        <footer class="tc-cancel-dialog__footer">
          <button class="tc-cancel-dialog__confirm" type="button" @click="confirmCancelConsult">确定</button>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { Button } from "@jiahong/ui";
import cancelDialogCloseIcon from "@/assets/figma-text-consult/cancel-dialog-close.svg";
import cancelConsultIcon from "@/assets/figma-text-consult/cancel-consult.svg";
import doctorAvatarAsset from "@/assets/figma-text-consult/doctor-avatar.png";
import prescriptionIcon from "@/assets/figma-text-consult/prescription.svg";
import printPrescriptionIcon from "@/assets/figma-text-consult/print-prescription-messages.svg";
import visitCardBg from "@/assets/figma-text-consult/visit-card-bg.png";
import tipsCheckIcon from "@/assets/figma-text-consult/tips-check-circle-fill.svg";
import tipsWarnIcon from "@/assets/figma-text-consult/tips-exclamation-circle-fill.svg";
import { useConsultStore } from "@/stores/consult";

const router = useRouter();
const route = useRoute();
const consultStore = useConsultStore();
const showDoctorFollowUp = ref(false);
const prescriptionReady = ref(false);
const showCancelDialog = ref(false);
const consultCancelled = ref(false);
const chatScrollRef = ref(null);
let followTimer;

const doctorAvatar = doctorAvatarAsset;
const convenientVideoImage = "https://www.figma.com/api/mcp/asset/eaa8174d-5163-4383-8063-943885643861";

const mentalWarnings = [
  "近期出现情绪明显低落、焦虑加重、惊恐发作、失眠或异常兴奋",
  "曾出现自伤、自杀想法，或近期情绪、行为有明显异常变化",
  "正在服用其他抗抑郁药、抗焦虑药、安眠药、止痛药或其他精神类药物"
];

const mentalSafety = [
  "请勿自行开始服用、加量、减量或突然停药",
  "用药期间如出现情绪明显恶化、异常兴奋、严重失眠、心悸、晕厥、发热出汗、震颤、意识混乱、自伤想法或其他明显不适，请及时联系医生或就医"
];

const coldWarnings = [
  "对感冒药或退热止痛药过敏",
  "肝功能或肾功能异常",
  "正在服用其他感冒药、退热止痛药",
  "处于备孕、怀孕或哺乳期"
];

const coldSafety = [
  "请勿与成分类似的其他感冒药同时使用",
  "服药期间请避免饮酒或含酒精饮料"
];

const visitInfo = computed(() => consultStore.visitInfo || {});
const hasVisitInfo = computed(() => Boolean(consultStore.visitInfo));
const isConvenientConsult = computed(() => {
  return route.query.source === "convenient" || visitInfo.value.source === "convenient" || consultStore.consultSource === "convenient";
});

const patientSummary = computed(() => {
  const info = visitInfo.value;
  const name = info.patientName || "黄黄";
  const gender = info.genderLabel || (info.gender === "male" ? "男" : "女");
  const age = info.age ? `${info.age}岁` : "23岁";
  return `${name}，${gender}，${age}`;
});

const medicineLines = computed(() => {
  const medicines = Array.isArray(visitInfo.value.medicines) ? visitInfo.value.medicines : [];
  if (!medicines.length && !hasVisitInfo.value) {
    return ["草酸艾司西酞普兰片，10mg*7片，2盒", "感冒片，0.5g*24片，1盒"];
  }
  return medicines.map((item) => {
    const spec = item.spec ? `，${item.spec}` : "";
    const qty = item.qty && item.unit ? `，${item.qty}${item.unit}` : "";
    return `${item.name || "未命名药品"}${spec}${qty}`;
  });
});

const allergySummary = computed(() => {
  const info = visitInfo.value;
  if (info.allergy === "yes") {
    return info.allergyDetail || "有";
  }
  return "无";
});

const MedicationReminder = defineComponent({
  name: "MedicationReminder",
  props: {
    title: { type: String, required: true },
    riskLabel: { type: String, required: true },
    riskType: { type: String, default: "low" },
    description: { type: String, default: "" },
    warnings: { type: Array, default: () => [] },
    safety: { type: Array, default: () => [] }
  },
  setup(props) {
    return () =>
      h("article", { class: "tc-medicine" }, [
        h("header", { class: "tc-medicine__header" }, [
          h("strong", props.title),
          h("span", { class: ["tc-risk-pill", `tc-risk-pill--${props.riskType}`] }, props.riskLabel)
        ]),
        h("p", { class: "tc-medicine__desc" }, props.description),
        h("section", { class: "tc-medicine__section" }, [
          h("h3", { class: "tc-medicine__warn-title" }, "以下情况请告知医生"),
          ...props.warnings.map((item) =>
            h("p", { class: "tc-reminder-item tc-reminder-item--warn", key: `warn-${item}` }, [
              h("img", { src: tipsWarnIcon, alt: "", "aria-hidden": "true" }),
              h("span", { class: "tc-reminder-item__text" }, item)
            ])
          )
        ]),
        h("section", { class: "tc-medicine__section" }, [
          h("h3", { class: "tc-medicine__safe-title" }, "安全提醒"),
          ...props.safety.map((item) =>
            h("p", { class: "tc-reminder-item tc-reminder-item--safe", key: `safe-${item}` }, [
              h("img", { src: tipsCheckIcon, alt: "", "aria-hidden": "true" }),
              h("span", { class: "tc-reminder-item__text" }, item)
            ])
          )
        ])
      ]);
  }
});

function scrollChatToBottom() {
  nextTick(() => {
    const el = chatScrollRef.value;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  });
}

function confirmPrescription() {
  prescriptionReady.value = true;
  scrollChatToBottom();
}

function confirmCancelConsult() {
  showCancelDialog.value = false;
  consultCancelled.value = true;
  scrollChatToBottom();
}

onMounted(() => {
  followTimer = window.setTimeout(() => {
    showDoctorFollowUp.value = true;
    scrollChatToBottom();
  }, 5000);
});

onBeforeUnmount(() => {
  window.clearTimeout(followTimer);
});
</script>

<style scoped>
.text-consult-page {
  min-width: 1440px;
  min-height: 900px;
  color: #1f2329;
  background: #f4f5f6;
}

.page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 56px;
  padding: 0 24px;
  border-bottom: 1px solid #eceef0;
  background: #fff;
}

.page-topbar :deep(.jh-btn) {
  height: 32px;
  padding: 5px 16px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
}

.page-topbar :deep(.page-topbar__back) {
  width: 112px;
  border: 0;
  color: rgba(0, 0, 0, 0.6);
  background: #f3f4f6;
}

.page-topbar__back-icon {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
}

.page-topbar__right {
  display: flex;
  align-items: center;
  gap: 24px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.page-topbar__divider {
  width: 1px;
  height: 28px;
  background: #e5e6eb;
}

.text-consult-main {
  box-sizing: border-box;
  width: 1440px;
  height: 844px;
  margin: 0 auto;
  padding: 15px 24px 33px;
}

.tc-shell {
  width: 1392px;
  height: 796px;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 11.2px rgba(0, 0, 0, 0.15);
}

.tc-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 56px;
  padding: 0 48px;
  border-bottom: 0;
  background: #fcfcfc;
  box-shadow: 0 6px 16px -8px rgba(16, 42, 67, 0.08), 0 1px 3px rgba(16, 42, 67, 0.05);
}

.tc-shell__title {
  display: flex;
  align-items: center;
  gap: 24px;
}

.tc-shell__title h1 {
  margin: 0;
  color: rgba(0, 0, 0, 0.9);
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
}

.tc-shell__title span {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 5px 12px;
  border-radius: 4px;
  color: #006ef9;
  font-size: 14px;
  line-height: 22px;
  background: #dbeafe;
}

.tc-shell__header :deep(.jh-btn) {
  height: 32px;
  padding: 5px 16px;
  border: 1px solid #d8dde1;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  background: #fff;
}

.tc-cancel-consult-btn img {
  flex: 0 0 12.67px;
  width: 12.67px;
  height: 12.67px;
}

.tc-shell__body {
  display: grid;
  grid-template-columns: 937px 455px;
  height: 740px;
  min-height: 0;
}

.tc-chat {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 176px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #f8f8f9;
}

.tc-chat--decision {
  grid-template-rows: minmax(0, 1fr);
}

.tc-chat--ready {
  grid-template-rows: minmax(0, 1fr) 176px;
}

.tc-chat--cancelled {
  grid-template-rows: minmax(0, 1fr) 176px;
}

.tc-chat-scroll {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  box-sizing: border-box;
  height: 100%;
  padding: 22px 39px 28px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.tc-chat-time {
  margin: 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}

.tc-doctor-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 472px;
}

.tc-chat-scroll > .tc-doctor-message:not(.tc-doctor-message--follow):not(.tc-doctor-message--final) {
  margin-top: -4px;
}

.tc-doctor-message--follow {
  margin-top: 0;
}

.tc-doctor-message--final {
  margin-top: 0;
}

.tc-doctor-avatar {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
  background: linear-gradient(180deg, #e8f1ff 0%, #227dff 100%);
}

.tc-doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tc-doctor-message__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.tc-doctor-name {
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  line-height: 22px;
}

.tc-doctor-bubble {
  max-width: 420px;
  padding: 14px 18px;
  border-radius: 14px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  line-height: 22px;
  background: #fff;
}

.tc-visit-card {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 384px;
  height: 226px;
  min-height: 226px;
  margin: 0;
  /* 我方头像位于卡片右侧，不能被卡片边界裁切。 */
  overflow: visible;
  border: 1px solid #d1e5fe;
  border-radius: 6px;
  background-image:
    linear-gradient(158.27deg, rgba(0, 111, 255, 0.032) 6.11%, rgba(0, 111, 255, 0) 28.73%),
    linear-gradient(155.2deg, #fff 3.39%, rgba(255, 255, 255, 0.7) 96.62%),
    var(--visit-card-bg);
  background-position: center, center, -1px -8px;
  background-size: 100% 100%, 100% 100%, 114.13% 108.91%;
  background-repeat: no-repeat;
  box-shadow: 0 6px 16px -8px rgba(16, 42, 67, 0.08), 0 1px 3px rgba(16, 42, 67, 0.05);
}

.tc-chat-scroll > .tc-visit-card {
  flex: 0 0 auto;
  align-self: flex-end;
  margin-right: 52px;
}

.tc-visit-card::before,
.tc-visit-card::after {
  display: none;
  content: none;
}

.tc-visit-card__content {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 21px 26px;
}

.tc-visit-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tc-visit-card__icon {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
}

.tc-visit-card__title strong {
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.tc-visit-card dl {
  margin: 0;
}

.tc-visit-card dt {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
}

.tc-visit-card dd {
  margin: 0;
  color: rgba(0, 0, 0, 0.9);
  font-size: 12px;
  line-height: 20px;
}

.tc-visit-card__badge {
  position: absolute;
  top: 0;
  right: -52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  background: #1476ff;
}

.tc-decision {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  min-height: 158px;
  margin: 0;
}

.tc-chat-scroll > .tc-decision {
  flex: 0 0 auto;
}

.tc-decision__label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0;
  color: #7f7f7f;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}

.tc-decision__label::before,
.tc-decision__label::after {
  display: block;
  height: 1px;
  background: #d8dde1;
  content: "";
}

.tc-decision__label::before {
  flex: 1;
}

.tc-decision__label::after {
  flex: 1;
}

.tc-decision__label {
  gap: 12px;
}

.tc-decision__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tc-decision-btn {
  width: 204px;
  height: 56px;
  border-radius: 8px;
  font: inherit;
  font-size: 17.28px;
  line-height: 27.16px;
  cursor: pointer;
}

.tc-decision-btn--ghost {
  border: 1.235px solid #d8dde1;
  color: rgba(0, 0, 0, 0.6);
  background: #fff;
}

.tc-decision-btn--primary {
  width: 201px;
  border: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
}

.tc-patient-message {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 12px;
  align-self: flex-end;
  margin: 0;
}

.tc-patient-bubble {
  max-width: 420px;
  padding: 14px 18px;
  border-radius: 14px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  line-height: 22px;
  background: #ebf3ff;
}

.tc-patient-avatar {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  color: #fff;
  font-size: 20px;
  line-height: 28px;
  background: #006ef9;
}

.tc-print-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  flex: 0 0 auto;
  width: 384px;
  height: 126px;
  /* 与医生消息正文左侧对齐：40px 头像 + 12px 消息间距。 */
  margin: 0 0 0 52px;
  padding: 18px 32px 22px;
  border: 1px solid #b2d4fd;
  border-radius: 14px;
  text-align: left;
  background:
    linear-gradient(180deg, rgba(199, 231, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 70%),
    linear-gradient(90deg, #fff 0%, #fff 100%);
  box-shadow: 0 6px 8px rgba(16, 42, 67, 0.08), 0 1px 1.5px rgba(16, 42, 67, 0.05);
  cursor: pointer;
}

.tc-print-card__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  white-space: nowrap;
}

.tc-print-card__text strong {
  color: #344054;
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 1.2px;
}

.tc-print-card__text em {
  color: rgba(52, 64, 84, 0.56);
  font-size: 14px;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.7px;
}

.tc-print-card__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 85px;
  height: 86px;
}

.tc-print-card__icon img {
  display: block;
  width: 85px;
  height: 86px;
}

.tc-reply {
  position: relative;
  z-index: 2;
  align-self: end;
  height: 128px;
  margin: 0 38px 24px;
  border: 1px solid #d5dbe3;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 -12px 18px rgba(250, 250, 250, 0.95);
}

.tc-chat--ready .tc-reply {
  height: 120px;
  margin: 0 39px 24px;
}

.tc-chat--ready .tc-reply textarea {
  height: 50px;
  padding: 11px 14px 0;
}

.tc-chat--ready .tc-reply__actions {
  gap: 12px;
  padding: 15px 14px;
}

.tc-chat--ready .tc-image-action {
  width: 28px;
  height: 28px;
  border-width: 1.077px;
}

.tc-chat--ready .tc-quick-reply {
  width: 72px;
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 20px;
}

.tc-chat--ready .tc-send-btn {
  min-width: 80px;
  height: 40px;
  border-radius: 8px;
}

.tc-reply textarea {
  display: block;
  width: 100%;
  height: 58px;
  padding: 14px 16px 0;
  border: 0;
  color: rgba(0, 0, 0, 0.88);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  outline: none;
  resize: none;
}

.tc-reply textarea::placeholder {
  color: rgba(0, 0, 0, 0.26);
}

.tc-reply__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.tc-image-action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1.5px solid #d8dde1;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.tc-image-action::before {
  position: absolute;
  width: 14px;
  height: 12px;
  border: 2px solid #697383;
  border-radius: 2px;
  content: "";
}

.tc-image-action::after {
  position: absolute;
  width: 10px;
  height: 6px;
  border-left: 2px solid #697383;
  border-bottom: 2px solid #697383;
  transform: translateY(3px) rotate(135deg) skew(8deg, 8deg);
  content: "";
}

.tc-image-action:hover {
  border-color: #c8d0d9;
}

.tc-image-action span,
.tc-image-action i {
  display: none;
}

.tc-quick-reply {
  min-width: 84px;
  height: 32px;
  padding: 0 14px;
  border: 1px solid #1476ff;
  border-radius: 7px;
  color: #1476ff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  background: #fff;
  cursor: pointer;
}

.tc-send-btn {
  min-width: 86px;
  height: 44px;
  margin-left: auto;
  border: 0;
  border-radius: 9px;
  color: #fff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  background: #1476ff;
  cursor: pointer;
}

.tc-reminder {
  min-width: 0;
  padding: 24px 34px;
  overflow: auto;
  border-left: 1px solid #e5e6eb;
  background: #fcfcfc;
}

.tc-video-sidebar {
  min-width: 0;
  overflow: hidden;
  border-left: 1px solid #e5e6eb;
  background: #f8f8fa;
}

.tc-video-sidebar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tc-reminder__intro h2 {
  position: relative;
  margin: 0 0 12px;
  padding-left: 8px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.tc-reminder__intro h2::before {
  position: absolute;
  left: 0;
  top: 4px;
  width: 4px;
  height: 16px;
  border-radius: 1px;
  background: #006ef9;
  content: "";
}

.tc-reminder__intro p {
  margin: 0 0 12px;
  padding: 6px 12px;
  border-radius: 6px;
  color: #fe8125;
  font-size: 14px;
  line-height: 24px;
  background: #fff2e2;
}

.tc-medicine {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  padding: 16px 24px;
  border: 1px solid #eceef0;
  border-radius: 6px;
  background: linear-gradient(270deg, #fcfcfc 0%, #f8f8f9 100%);
}

.tc-medicine__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}

.tc-medicine__header strong {
  color: #000;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.tc-risk-pill {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 2px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.tc-risk-pill--high {
  color: #cb2c2c;
  background: #f7dedd;
}

.tc-risk-pill--low {
  color: #2ba471;
  background: #d9efe5;
}

.tc-medicine__desc {
  margin: -4px 0 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 22px;
}

.tc-medicine__section {
  display: grid;
  gap: 8px;
  margin-top: 0;
}

.tc-medicine__section h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
}

.tc-medicine__warn-title {
  color: #e37318 !important;
}

.tc-medicine__safe-title {
  color: #2ba471 !important;
}

.tc-reminder-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  color: rgba(0, 0, 0, 0.56);
  font-size: 14px;
  line-height: 22px;
}

.tc-reminder-item img {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-top: 3px;
}

.tc-reminder-item__text {
  flex: 1 1 auto;
  min-width: 0;
}

.tc-medicine :deep(.tc-medicine__header) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
}

.tc-medicine :deep(.tc-medicine__header strong) {
  color: #000;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.tc-medicine :deep(.tc-risk-pill) {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 2px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.tc-medicine :deep(.tc-risk-pill--high) {
  color: #cb2c2c;
  background: #f7dedd;
}

.tc-medicine :deep(.tc-risk-pill--low) {
  color: #2ba471;
  background: #d9efe5;
}

.tc-medicine :deep(.tc-medicine__desc) {
  margin: -4px 0 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 22px;
}

.tc-medicine :deep(.tc-medicine__section) {
  display: grid;
  gap: 8px;
  margin-top: 0;
}

.tc-medicine :deep(.tc-medicine__section h3) {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
}

.tc-medicine :deep(.tc-medicine__warn-title) {
  color: #e37318;
}

.tc-medicine :deep(.tc-medicine__safe-title) {
  color: #2ba471;
}

.tc-medicine :deep(.tc-reminder-item) {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
}

.tc-medicine :deep(.tc-reminder-item img) {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-top: 3px;
}

.tc-medicine :deep(.tc-reminder-item__text) {
  flex: 1 1 auto;
  min-width: 0;
}

.tc-status-toast {
  position: fixed;
  top: 78px;
  left: 50%;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 16px;
  border: 1px solid #ccebdc;
  border-radius: 6px;
  color: #2ba471;
  font-size: 13px;
  background: #f0faf5;
  box-shadow: 0 6px 16px rgba(30, 41, 59, 0.08);
  transform: translateX(-50%);
}

.tc-cancel-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
}

.tc-cancel-dialog {
  width: 640px;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 84px 64px -20px rgba(16, 42, 67, 0.18), 0 8px 16px -4px rgba(16, 42, 67, 0.1);
}

.tc-cancel-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  box-sizing: border-box;
  padding: 12px 16px 12.67px;
  border-bottom: 0.667px solid rgba(229, 231, 235, 0.5);
  border-radius: 8px 8px 0 0;
  background: #f2f3f4;
  box-shadow: 0 1px 2px rgba(16, 42, 67, 0.04);
}

.tc-cancel-dialog__header h2 {
  margin: 0;
  color: #1e2939;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.tc-cancel-dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.tc-cancel-dialog__close img {
  display: block;
  width: 20px;
  height: 20px;
}

.tc-cancel-dialog__close:hover {
  opacity: 0.82;
}

.tc-cancel-dialog__body {
  box-sizing: border-box;
  min-height: 72px;
  padding: 24px;
  color: #1e2939;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.tc-cancel-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  height: 72px;
  padding: 16px 24px 16px 10px;
  overflow: hidden;
}

.tc-cancel-dialog__confirm {
  width: 80px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
  cursor: pointer;
}

@media (max-width: 1280px) {
  .tc-shell__body {
    grid-template-columns: minmax(0, 1fr) 400px;
  }

  .tc-reminder {
    padding: 22px 20px;
  }

  .tc-video-sidebar img {
    object-position: center top;
  }

  .tc-visit-card {
    width: 384px;
    margin-right: 50px;
  }
}

@media (max-width: 760px) {
  .tc-shell {
    height: auto;
    min-height: 0;
  }

  .tc-shell__body {
    grid-template-columns: 1fr;
  }

  .tc-chat {
    min-height: 760px;
  }

  .tc-reminder {
    border-left: 0;
    border-top: 1px solid #e5e6eb;
  }

  .tc-video-sidebar {
    min-height: 520px;
    border-left: 0;
    border-top: 1px solid #e5e6eb;
  }
}
</style>
