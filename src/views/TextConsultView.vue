<template>
  <div class="text-consult-page">
    <header class="page-topbar">
      <Button variant="neutral" size="md" icon @click="router.push('/')">
        <img :src="assetUrl('assets/figma-consult/back.svg')" alt="" />
        返回首页
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
          <Button variant="outline-secondary" size="sm" @click="router.push('/')">
            <span class="power-icon" aria-hidden="true">⏻</span>
            取消问诊
          </Button>
        </header>

        <div class="tc-shell__body">
          <section class="tc-chat" aria-label="问诊对话">
            <div class="tc-chat-scroll">
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

              <article class="tc-visit-card" aria-label="就诊信息">
                <div class="tc-visit-card__content">
                  <header class="tc-visit-card__title">
                    <span class="tc-visit-card__icon">✚</span>
                    <strong>就诊信息</strong>
                  </header>
                  <dl>
                    <dt>患者信息</dt>
                    <dd>黄黄，女，23岁</dd>
                    <dt>咨询药品</dt>
                    <dd>草酸艾司西酞普兰片，10mg*7片，2盒</dd>
                    <dd>感冒片，0.5g*24片，1盒</dd>
                    <dt>是否有过敏史</dt>
                    <dd>无</dd>
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
                    已收到您的问诊信息。请继续确认当前症状、既往用药情况及是否需要医生开具处方。
                  </div>
                </div>
              </article>

              <div v-if="showDoctorFollowUp" class="tc-decision">
                <button class="tc-decision-btn tc-decision-btn--ghost" type="button">信息有误，取消开方</button>
                <button class="tc-decision-btn tc-decision-btn--primary" type="button">无需补充，立即开方</button>
              </div>
            </div>

            <footer class="tc-reply">
              <textarea placeholder="输入回复内容"></textarea>
              <div class="tc-reply__actions">
                <button class="tc-image-action" type="button" aria-label="上传图片">▧</button>
                <button class="tc-quick-reply" type="button">快捷回复</button>
                <button class="tc-send-btn" type="button">发送</button>
              </div>
            </footer>
          </section>

          <aside class="tc-reminder" aria-label="用药提醒">
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
  </div>
</template>

<script setup>
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Button, assetUrl } from "@jiahong/ui";

const router = useRouter();
const showDoctorFollowUp = ref(false);
let followTimer;

const doctorAvatar = "/images/pu-test.png";

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
            h("p", { class: "tc-reminder-item tc-reminder-item--warn" }, [h("span", { "aria-hidden": "true" }, "!"), item])
          )
        ]),
        h("section", { class: "tc-medicine__section" }, [
          h("h3", { class: "tc-medicine__safe-title" }, "安全提醒"),
          ...props.safety.map((item) =>
            h("p", { class: "tc-reminder-item tc-reminder-item--safe" }, [h("span", { "aria-hidden": "true" }, "✓"), item])
          )
        ])
      ]);
  }
});

onMounted(() => {
  followTimer = window.setTimeout(() => {
    showDoctorFollowUp.value = true;
  }, 5000);
});

onBeforeUnmount(() => {
  window.clearTimeout(followTimer);
});
</script>

<style scoped>
.text-consult-page {
  min-height: 100vh;
  color: #1f2329;
  background: #f5f5f5;
}

.page-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 54px;
  padding: 0 24px;
  border-bottom: 1px solid #eceef0;
  background: #fff;
  box-shadow: 0 4px 12px rgba(24, 39, 75, 0.06);
}

.page-topbar :deep(.jh-btn) {
  height: 34px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 14px;
}

.page-topbar :deep(.jh-btn img) {
  width: 16px;
  height: 16px;
}

.page-topbar__right {
  display: flex;
  align-items: center;
  gap: 18px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
}

.page-topbar__divider {
  width: 1px;
  height: 28px;
  background: #e5e6eb;
}

.text-consult-main {
  padding: 12px 20px 18px;
}

.tc-shell {
  width: 100%;
  height: calc(100vh - 84px);
  min-height: 0;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(30, 41, 59, 0.12);
}

.tc-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 0 34px;
  border-bottom: 1px solid #e5e6eb;
  background: #fff;
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
  font-weight: 500;
  line-height: 28px;
}

.tc-shell__title span {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-radius: 5px;
  color: #1476ff;
  font-size: 14px;
  background: #dbeafe;
}

.tc-shell__header :deep(.jh-btn) {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 14px;
}

.power-icon {
  margin-right: 6px;
  font-size: 14px;
}

.tc-shell__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 450px);
  height: calc(100% - 58px);
  min-height: 0;
}

.tc-chat {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 176px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #fafafa;
}

.tc-chat-scroll {
  position: relative;
  min-height: 0;
  padding: 24px 38px 32px;
  overflow: auto;
}

.tc-chat-time {
  margin: 0 0 14px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 13px;
  line-height: 20px;
  text-align: center;
}

.tc-doctor-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 620px;
}

.tc-doctor-message--follow {
  margin-top: 32px;
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
  gap: 10px;
  align-items: flex-start;
}

.tc-doctor-name {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  line-height: 20px;
}

.tc-doctor-bubble {
  max-width: 520px;
  padding: 14px 18px;
  border-radius: 16px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 15px;
  line-height: 26px;
  background: #fff;
}

.tc-visit-card {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: min(460px, calc(100% - 76px));
  min-height: 252px;
  margin: 22px 52px 0 auto;
  border: 1px solid #cfe0ff;
  border-radius: 8px;
  background:
    radial-gradient(circle at 78% 72%, rgba(220, 245, 255, 0.82) 0, rgba(220, 245, 255, 0.36) 20%, transparent 48%),
    linear-gradient(135deg, #fff 0%, #fbfdff 52%, #eef8ff 100%);
  box-shadow: 0 1px 4px rgba(60, 120, 220, 0.12);
}

.tc-visit-card__content {
  flex: 1;
  padding: 24px 28px;
}

.tc-visit-card__title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.tc-visit-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 24px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  background: #1476ff;
}

.tc-visit-card__title strong {
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.tc-visit-card dl {
  margin: 0;
}

.tc-visit-card dt {
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.35);
  font-size: 13px;
  line-height: 20px;
}

.tc-visit-card dd {
  margin: 4px 0 0;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  line-height: 24px;
}

.tc-visit-card__badge {
  position: absolute;
  top: 0;
  right: -52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  line-height: 1;
  background: #1476ff;
}

.tc-decision {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 32px 0 0;
}

.tc-decision-btn {
  width: 204px;
  height: 56px;
  border-radius: 8px;
  font: inherit;
  font-size: 17px;
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
  background: linear-gradient(270deg, #3b92ff 0%, #006ef9 100%);
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d8dde1;
  border-radius: 50%;
  color: #697383;
  font-size: 18px;
  background: #fff;
  cursor: pointer;
}

.tc-quick-reply {
  height: 32px;
  padding: 0 14px;
  border: 1px solid #1476ff;
  border-radius: 7px;
  color: #1476ff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
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

.tc-reminder__intro h2 {
  position: relative;
  margin: 0 0 12px;
  padding-left: 8px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
}

.tc-reminder__intro h2::before {
  position: absolute;
  left: 0;
  top: 6px;
  width: 4px;
  height: 16px;
  border-radius: 1px;
  background: #006ef9;
  content: "";
}

.tc-reminder__intro p {
  margin: 0 0 16px;
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

.tc-reminder-item span {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
}

.tc-reminder-item--warn span {
  background: #e37318;
}

.tc-reminder-item--safe span {
  background: #2ba471;
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

.tc-medicine :deep(.tc-reminder-item span) {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 16px;
}

.tc-medicine :deep(.tc-reminder-item--warn span) {
  background: #e37318;
}

.tc-medicine :deep(.tc-reminder-item--safe span) {
  background: #2ba471;
}

@media (max-width: 1280px) {
  .tc-shell__body {
    grid-template-columns: minmax(0, 1fr) 400px;
  }

  .tc-reminder {
    padding: 22px 20px;
  }

  .tc-visit-card {
    width: min(420px, calc(100% - 70px));
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
}
</style>
