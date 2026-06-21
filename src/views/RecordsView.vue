<template>
  <div class="records-page">
    <header class="account-bar" aria-label="账号状态">
      <div class="account-expire"><span class="speaker">●</span>您的账号将于 <em>2027-05-26</em> 到期，剩余 <em>350</em> 天（单体）</div>
      <div class="account-actions">
        <button class="service-btn" type="button">☁ 在线客服</button>
        <button class="bar-link" type="button"><i>▣</i> 下载 APP 问诊</button>
        <button class="bar-link" type="button">任务中心 <b class="chevron mini"></b></button>
        <button class="bar-link" type="button">大王测试药店01 <b class="chevron mini"></b></button>
      </div>
    </header>
    <nav class="records-nav" aria-label="主导航">
      <button v-for="item in navItems" :key="item.label" :class="{ active: item.label === '问诊记录' }" type="button" @click="navigate(item.path)">
        {{ item.label }}
      </button>
    </nav>

    <main class="records-content">
      <section class="filter-card" aria-label="问诊记录筛选">
        <div class="filter-grid">
          <label class="field field-date">
            <span>问诊类型</span>
            <t-date-range-picker
              v-model="dateRange"
              class="records-date-range"
              clearable
              format="YYYY-MM-DD"
              :placeholder="['开始日期时间', '结束日期时间']"
              @click.stop
            />
          </label>
          <FilterSelect label="问诊类型" v-model="filters.type" />
          <FilterSelect label="问诊状态" v-model="filters.status" />
          <FilterSelect label="支付状态" v-model="filters.payment" />
          <FilterSelect label="审方状态" v-model="filters.audit" />
          <FilterSelect label="药品实名" v-model="filters.realName" />
          <label class="field"><span>患者姓名</span><input v-model="filters.patient" placeholder="请输入患者名称" /></label>
          <label class="field"><span>诊断名称</span><input v-model="filters.diagnosis" placeholder="请输入诊断名称" /></label>
          <FilterSelect label="药品名称" v-model="filters.medicine" />
          <FilterSelect label="问诊号" v-model="filters.number" />
          <div class="query-actions">
            <button class="primary small" type="button" @click="runQuery">查询</button>
            <button class="secondary small" type="button" @click="resetFilters">重置</button>
          </div>
        </div>

        <div class="batch-bar">
          <div class="batch-actions">
            <div class="menu-wrap"><button class="secondary export" type="button" @click.stop="exportOpen = !exportOpen">导出 <i class="chevron" :class="{ up: exportOpen }"></i></button><div v-if="exportOpen" class="action-menu export-menu"><button type="button" @click="perform('导出当前页')">导出当前页</button><button type="button" @click="perform('导出全部记录')">导出全部记录</button><button type="button" @click="settingsOpen = true; exportOpen = false">浏览设置</button></div></div>
            <button class="primary" type="button" @click="batchAction('批量下载')">批量下载</button>
            <button class="primary" type="button" @click="batchAction('批量打印')">批量打印</button>
            <button class="primary wide" type="button" @click="batchAction('批量下载药品实名问诊')">批量下载药品实名问诊</button>
          </div>
          <div class="history-wrap">
            <button class="secondary history" :class="{ active: historyTipOpen }" type="button" @click="historyOpen = true">历史记录 <span @click.stop="toggleHistoryTip">?</span></button>
            <div v-if="historyTipOpen" class="history-tip">2023年1月1日之前的<br />历史记录请在此查询</div>
          </div>
        </div>
      </section>

      <section class="table-card" aria-label="问诊记录列表">
        <div class="table-scroll">
          <table>
            <colgroup><col class="col-check" /><col class="col-no" /><col class="col-patient" /><col class="col-age" /><col class="col-doctor" /><col class="col-clerk" /><col class="col-type" /><col class="col-status" /><col class="col-time" /><col class="col-time" /><col class="col-payment" /><col class="col-audit" /><col class="col-realname" /><col class="col-operations" /></colgroup>
            <thead>
              <tr>
                <th class="check"><input type="checkbox" :checked="allSelected" :indeterminate.prop="someSelected" @change="toggleAll" /></th>
                <th>问诊号</th><th>患者姓名</th><th>年龄</th><th>问诊医生</th><th>店员</th><th>问诊类型</th><th>问诊状态</th><th>开始时间</th><th>结束时间</th><th>支付状态</th><th>审方状态</th><th>药品实名</th><th class="operations-head">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in pagedRecords" :key="record.id">
                <td class="check"><input v-model="selected" type="checkbox" :value="record.id" /></td>
                <td>{{ record.no }}</td><td>{{ record.patient }}</td><td>{{ record.age }}</td><td>{{ record.doctor }}</td><td>{{ record.clerk }}</td>
                <td><span class="type-tag" :class="record.type === '视频问诊' ? 'video' : 'text'">{{ record.type }}</span></td>
                <td><span class="consult-status"><i :class="record.status === '完成问诊' ? 'green' : 'gray'"></i>{{ record.status }}</span></td>
                <td>{{ record.start }}</td><td>{{ record.end }}</td><td>{{ record.payment }}</td>
                <td><span v-if="record.audit !== '-'" class="audit-tag" :class="record.auditTone"><i>{{ record.auditIcon }}</i>{{ record.audit }}</span><span v-else>-</span></td>
                <td>{{ record.realName }}</td>
                <td class="operations">
                  <div class="operation-actions"><button type="button" @click="viewRecord(record)">查看</button><button v-if="record.printable" type="button" @click="perform(`打印问诊记录 ${record.no}`)">打印</button><div v-if="record.more" class="menu-wrap more-wrap"><button type="button" @click.stop="toggleMore(record.id, $event)">更多 <i class="chevron" :class="{ up: moreId === record.id }"></i></button></div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="pagination">
          <span>共 {{ filteredRecords.length }} 条</span>
          <div class="page-size-wrap"><button class="page-size" type="button" @click.stop="togglePageSize">{{ pageSize }} 条/页 <i class="chevron" :class="{ up: pageSizeOpen }"></i></button><div v-if="pageSizeOpen" class="action-menu page-size-menu"><button v-for="size in pageSizeOptions" :key="size" :class="{ selected: size === pageSize }" type="button" @click="changePageSize(size)">{{ size }} 条/页</button></div></div>
          <button class="arrow" :disabled="currentPage === 1" type="button" @click="changePage(currentPage - 1)">‹</button>
          <template v-for="item in visiblePageItems" :key="item.key">
            <span v-if="item.type === 'ellipsis'" class="ellipsis">···</span>
            <button v-else class="page" :class="{ active: currentPage === item.page }" type="button" @click="changePage(item.page)">{{ item.page }}</button>
          </template>
          <button class="arrow" :disabled="currentPage === totalPages" type="button" @click="changePage(currentPage + 1)">›</button>
          <span class="jump">跳至 <input v-model.number="jumpPage" min="1" :max="totalPages" type="number" @keyup.enter="jumpToPage" /> /{{ totalPages }} 页</span>
        </footer>
      </section>
    </main>

    <Teleport to="body"><div v-if="moreId" class="action-menu more-menu more-menu--floating" :style="moreMenuStyle"><button type="button" @click="perform('下载')">下载</button><button type="button" @click="perform('重开处方')">重开处方</button><button class="danger" type="button" @click="perform('作废')">作废</button></div></Teleport>

    <div v-if="settingsOpen" class="modal-mask" @click.self="settingsOpen = false"><section class="settings-dialog"><header>浏览设置 <button type="button" @click="settingsOpen = false">×</button></header><label>颜色编码 <button class="switch" :class="{ on: colorCoding }" type="button" @click="colorCoding = !colorCoding"><i></i></button></label></section></div>
    <div v-if="historyOpen" class="modal-mask" @click.self="historyOpen = false"><section class="record-dialog"><header>历史记录 <button type="button" @click="historyOpen = false">×</button></header><p>2023年1月1日之前的历史记录请在此查询。</p><button class="primary" type="button" @click="perform('查询历史记录'); historyOpen = false">前往查询</button></section></div>
    <div v-if="detailRecord" class="modal-mask" @click.self="detailRecord = null"><section class="record-dialog"><header>问诊记录详情 <button type="button" @click="detailRecord = null">×</button></header><dl><dt>问诊号</dt><dd>{{ detailRecord.no }}</dd><dt>患者姓名</dt><dd>{{ detailRecord.patient }}</dd><dt>问诊类型</dt><dd>{{ detailRecord.type }}</dd><dt>问诊状态</dt><dd>{{ detailRecord.status }}</dd><dt>审方状态</dt><dd>{{ detailRecord.audit }}</dd></dl></section></div>
    <Transition name="toast"><div v-if="toast" class="records-toast">{{ toast }}</div></Transition>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const navItems = [
  { label: "首页", path: "/" }, { label: "问诊医生" }, { label: "审方药师" }, { label: "问诊记录", path: "/records" },
  { label: "预开方订单" }, { label: "处方药登记" }, { label: "新品登记", path: "/new-product" }, { label: "咨询视频" }, { label: "优医专区" }, { label: "医生招聘" }
];
function navigate(path) { if (path) router.push(path); }

const defaultFilters = { type: "全部", status: "全部", payment: "全部", audit: "全部", realName: "全部", patient: "", diagnosis: "", medicine: "全部", number: "全部" };
const filters = reactive({ ...defaultFilters });
const appliedFilters = reactive({ ...defaultFilters });
const medicineOptions = ["全部", "草酸艾司西酞普兰片", "感冒片", "感冒灵胶囊", "奥美拉唑肠溶胶囊", "阿莫西林胶囊", "布洛芬缓释胶囊", "盐酸二甲双胍片", "缬沙坦胶囊", "孟鲁司特钠片", "氯雷他定片"];
const optionMap = { "问诊类型": ["全部", "图文问诊", "视频问诊"], "问诊状态": ["全部", "完成问诊", "取消问诊"], "支付状态": ["全部", "无", "未支付", "已支付"], "审方状态": ["全部", "未申请", "待修改", "未审核", "未签名", "已完成", "已作废"], "药品实名": ["全部", "是", "否"], "药品名称": medicineOptions, "问诊号": ["全部", "WZ001", "WZ002", "WZ003"] };
function resetFilters() { Object.assign(filters, defaultFilters); Object.assign(appliedFilters, defaultFilters); clearDate(); selected.value = []; changePage(1); perform("筛选条件已重置"); }
function runQuery() { Object.assign(appliedFilters, filters); selected.value = []; changePage(1); perform("查询完成"); }

const FilterSelect = defineComponent({
  props: { label: String, modelValue: String }, emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isOpen = computed(() => openSelectKey.value === props.label);
    const choose = (value) => { emit("update:modelValue", value); openSelectKey.value = ""; };
    return () => h("label", { class: "field" }, [
      h("span", props.label),
      h("div", { class: "custom-select" }, [
        h("button", { type: "button", class: { open: isOpen.value }, onClick: (event) => { event.stopPropagation(); openSelectKey.value = isOpen.value ? "" : props.label; } }, [h("span", props.modelValue), h("i", { class: { chevron: true, up: isOpen.value } })]),
        isOpen.value ? h("div", { class: "select-menu", onClick: (event) => event.stopPropagation() }, (optionMap[props.label] || ["全部"]).map((option) => h("button", { type: "button", class: { selected: option === props.modelValue }, onClick: () => choose(option) }, option))) : null
      ])
    ]);
  }
});

const seedRecords = [
  { type: "图文问诊", status: "完成问诊", payment: "无", audit: "已完成", diagnosis: "抑郁症", medicine: "草酸艾司西酞普兰片" },
  { type: "视频问诊", status: "完成问诊", payment: "无", audit: "未签名", diagnosis: "感冒", medicine: "感冒片" },
  { type: "图文问诊", status: "取消问诊", payment: "无", audit: "-", diagnosis: "感冒", medicine: "感冒灵胶囊" },
  { type: "图文问诊", status: "完成问诊", payment: "无", audit: "已作废", diagnosis: "胃炎", medicine: "奥美拉唑肠溶胶囊" },
  { type: "视频问诊", status: "完成问诊", payment: "未支付", audit: "未审核", diagnosis: "咽炎", medicine: "阿莫西林胶囊" },
  { type: "图文问诊", status: "完成问诊", payment: "已支付", audit: "待修改", diagnosis: "发热", medicine: "布洛芬缓释胶囊" },
  { type: "视频问诊", status: "完成问诊", payment: "已支付", audit: "未申请", diagnosis: "糖尿病", medicine: "盐酸二甲双胍片" },
  { type: "图文问诊", status: "完成问诊", payment: "已支付", audit: "已完成", diagnosis: "高血压", medicine: "缬沙坦胶囊" },
  { type: "视频问诊", status: "完成问诊", payment: "无", audit: "未签名", diagnosis: "鼻炎", medicine: "孟鲁司特钠片" },
  { type: "图文问诊", status: "完成问诊", payment: "已支付", audit: "未审核", diagnosis: "过敏", medicine: "氯雷他定片" }
];
const patientNames = ["童童", "林林", "阿明", "王悦", "赵宁", "小米", "陈晨", "黄黄", "李想", "周周", "安安", "乐乐", "江南", "苏苏"];
const ageValues = ["3岁", "8岁", "19岁", "22岁", "28岁", "31岁", "36岁", "42岁", "45岁", "53岁", "61岁", "68岁"];
const doctorNames = ["李医生", "王医生", "陈医生", "赵医生", "周医生", "林医生", "黄医生", "许医生"];
const clerkNames = ["小李", "小王", "小陈", "小赵", "小周", "小林", "小许", "小黄"];
const auditMeta = {
  "已完成": { auditTone: "done", auditIcon: "✓" },
  "未签名": { auditTone: "unsigned", auditIcon: "−" },
  "未审核": { auditTone: "unsigned", auditIcon: "−" },
  "待修改": { auditTone: "unsigned", auditIcon: "−" },
  "未申请": { auditTone: "unsigned", auditIcon: "−" },
  "已作废": { auditTone: "void", auditIcon: "×" },
  "-": { auditTone: "none", auditIcon: "" }
};
const records = Array.from({ length: 137 }, (_, index) => {
  const seed = seedRecords[index % seedRecords.length];
  const hour = String(8 + (index % 12)).padStart(2, "0");
  const minute = String((index * 7) % 60).padStart(2, "0");
  const second = String((index * 11) % 60).padStart(2, "0");
  const meta = auditMeta[seed.audit] || auditMeta["-"];
  return {
    id: index + 1,
    no: "WZ" + String(index + 1).padStart(3, "0"),
    patient: patientNames[index % patientNames.length],
    age: ageValues[index % ageValues.length],
    doctor: doctorNames[index % doctorNames.length],
    clerk: clerkNames[index % clerkNames.length],
    type: seed.type,
    status: seed.status,
    start: hour + "：" + minute + "：" + second,
    end: hour + "：" + String((Number(minute) + 5) % 60).padStart(2, "0") + "：" + second,
    payment: seed.payment,
    audit: seed.audit,
    auditTone: meta.auditTone,
    auditIcon: meta.auditIcon,
    realName: index % 9 === 0 ? "是" : "否",
    diagnosis: seed.diagnosis,
    medicine: seed.medicine,
    printable: seed.status !== "取消问诊",
    more: seed.status !== "取消问诊"
  };
});
const selected = ref([]);
const pageSizeOptions = [20, 50, 100];
const filteredRecords = computed(() => records.filter((record) => {
  if (appliedFilters.type !== "全部" && record.type !== appliedFilters.type) return false;
  if (appliedFilters.status !== "全部" && record.status !== appliedFilters.status) return false;
  if (appliedFilters.audit !== "全部" && record.audit !== appliedFilters.audit) return false;
  if (appliedFilters.realName !== "全部" && record.realName !== appliedFilters.realName) return false;
  if (appliedFilters.payment !== "全部" && record.payment !== appliedFilters.payment) return false;
  if (appliedFilters.medicine !== "全部" && record.medicine !== appliedFilters.medicine) return false;
  if (appliedFilters.number !== "全部" && record.no !== appliedFilters.number) return false;
  if (appliedFilters.patient && !record.patient.includes(appliedFilters.patient)) return false;
  if (appliedFilters.diagnosis && !record.diagnosis.includes(appliedFilters.diagnosis)) return false;
  return true;
}));
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / pageSize.value)));
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredRecords.value.slice(start, start + pageSize.value);
});
const allSelected = computed(() => pagedRecords.value.length > 0 && pagedRecords.value.every((item) => selected.value.includes(item.id)));
const someSelected = computed(() => pagedRecords.value.some((item) => selected.value.includes(item.id)) && !allSelected.value);
function toggleAll(event) {
  const pageIds = pagedRecords.value.map((item) => item.id);
  selected.value = event.target.checked
    ? Array.from(new Set([...selected.value, ...pageIds]))
    : selected.value.filter((id) => !pageIds.includes(id));
}

const openSelectKey = ref("");
const dateRange = ref([]);
function clearDate() { dateRange.value = []; }
const exportOpen = ref(false), settingsOpen = ref(false), historyOpen = ref(false), historyTipOpen = ref(false), colorCoding = ref(true), moreId = ref(null), moreMenuStyle = ref({}), detailRecord = ref(null), pageSizeOpen = ref(false);
const currentPage = ref(1), pageSize = ref(20), jumpPage = ref(1), toast = ref("");
let toastTimer;
function perform(message) { toast.value = message; window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.value = "", 1800); exportOpen.value = false; moreId.value = null; }
function batchAction(action) { if (!selected.value.length) return perform("请先选择问诊记录"); perform(`${action}：已选择 ${selected.value.length} 条`); }
function toggleMore(id, event) { pageSizeOpen.value = false; exportOpen.value = false; historyTipOpen.value = false; openSelectKey.value = ""; if (moreId.value === id) { moreId.value = null; return; } const cell = event.currentTarget.closest("td"); const button = event.currentTarget.getBoundingClientRect(); const anchor = cell?.getBoundingClientRect() || button; moreMenuStyle.value = { left: `${Math.round(button.left - 16)}px`, top: `${Math.round(anchor.top + 48)}px` }; moreId.value = id; }
function viewRecord(record) { detailRecord.value = record; moreId.value = null; }
const visiblePageItems = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  if (total <= 7) {
    for (let page = 1; page <= total; page += 1) pages.push(page);
  } else if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "ellipsis-right", total);
  } else if (current >= total - 3) {
    pages.push(1, "ellipsis-left", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "ellipsis-left", current - 1, current, current + 1, "ellipsis-right", total);
  }
  return pages.map((item) => typeof item === "number" ? { key: "page-" + item, type: "page", page: item } : { key: item, type: "ellipsis" });
});
function changePage(page) { currentPage.value = Math.min(totalPages.value, Math.max(1, page)); jumpPage.value = currentPage.value; closeMoreMenu(); }
function jumpToPage() { changePage(Number(jumpPage.value) || 1); }
function toggleHistoryTip() { historyTipOpen.value = !historyTipOpen.value; exportOpen.value = false; moreId.value = null; pageSizeOpen.value = false; openSelectKey.value = ""; }
function togglePageSize() { pageSizeOpen.value = !pageSizeOpen.value; historyTipOpen.value = false; moreId.value = null; exportOpen.value = false; openSelectKey.value = ""; }
function changePageSize(size) { pageSize.value = size; pageSizeOpen.value = false; selected.value = []; changePage(1); }
watch(totalPages, (total) => {
  if (currentPage.value > total) changePage(total);
});
function closeMoreMenu() { moreId.value = null; }
function closePopovers() { openSelectKey.value = ""; exportOpen.value = false; historyTipOpen.value = false; closeMoreMenu(); pageSizeOpen.value = false; }
onMounted(() => { document.addEventListener("click", closePopovers); window.addEventListener("scroll", closeMoreMenu, true); window.addEventListener("resize", closeMoreMenu); });
onBeforeUnmount(() => { document.removeEventListener("click", closePopovers); window.removeEventListener("scroll", closeMoreMenu, true); window.removeEventListener("resize", closeMoreMenu); });
</script>

<style>
* { box-sizing: border-box; }
.records-page { min-width: 1200px; min-height: 100vh; color: rgba(0, 0, 0, .9); font-family: "Microsoft YaHei UI", "Microsoft YaHei", sans-serif; font-size: 14px; background: #f5f5f5; }
.account-bar { display: flex; align-items: center; justify-content: space-between; height: 36px; padding: 0 28px; border-top: 1px solid #8c8c8c; border-bottom: 1px solid #dfe2e6; color: #666; font-size: 14px; background: #f6f7f9; }
.account-expire { display: flex; align-items: center; gap: 4px; white-space: nowrap; }.account-expire .speaker { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-right: 6px; border-radius: 50%; color: #fff; font-size: 0; background: #1989ff; }.account-expire .speaker::before { color: #fff; font-size: 10px; content: "▸"; }.account-expire em { color: #ff4d4f; font-style: normal; }
.account-actions { display: flex; align-items: center; gap: 16px; height: 100%; }.account-actions button { height: 28px; border: 0; color: #666; font-size: 14px; background: transparent; cursor: pointer; }.account-actions button:hover { color: #006ef9; }.service-btn { min-width: 156px; border-radius: 8px !important; color: #fff !important; font-weight: 600; background: #2f63f6 !important; }.service-btn:hover { background: #1f57ee !important; }.bar-link { display: inline-flex; align-items: center; gap: 6px; padding: 0; }.bar-link i { color: #bfc4cc; font-style: normal; }.chevron.mini { width: 7px; height: 7px; margin: 0 0 3px 3px; border-width: 1.5px; color: #666; }
.records-nav { display: flex; align-items: flex-end; justify-content: center; gap: 23px; height: 64px; padding: 8px 116px 0; background: #fff; }
.records-nav button { position: relative; width: 100px; height: 56px; padding: 0 0 17px; border: 0; color: rgba(0, 0, 0, .9); font: inherit; font-size: 16px; line-height: 24px; white-space: nowrap; background: transparent; cursor: pointer; }
.records-nav button::after { position: absolute; bottom: 0; left: 18px; width: 64px; height: 4px; background: transparent; content: ""; }
.records-nav button.active::after { background: #006ef9; }
.records-content { display: flex; flex-direction: column; height: calc(100vh - 100px); padding: 24px 24px 0; overflow: hidden; }
.filter-card, .table-card { width: 100%; border-radius: 12px; background: #fff; }
.filter-card { position: relative; z-index: 20; flex: 0 0 208px; height: 208px; padding: 16px 24px; overflow: visible; }
.table-card { position: relative; z-index: 1; overflow: hidden; }
.filter-grid { display: grid; width: 100%; grid-template-columns: minmax(440px, 1fr) repeat(3, minmax(200px, 250px)); grid-template-rows: 32px 32px 32px; gap: 16px 24px; align-items: center; }
.field { position: relative; display: flex; align-items: center; gap: 12px; height: 32px; min-width: 0; }
.field > span { flex: 0 0 68px; width: 68px; white-space: nowrap; }
.field input { flex: 1; min-width: 0; height: 32px; padding: 0 12px; border: 1px solid #e5e8eb; border-radius: 6px; outline: 0; color: rgba(0, 0, 0, .9); font: inherit; background: #fff; }
.field input::placeholder { color: rgba(0, 0, 0, .4); }.field input { transition: border-color .16s, box-shadow .16s, background .16s; }.field input:hover { border-color: #b8c2cc; background: #fafcff; }.field input:focus { border-color: #006ef9; background: #fff; box-shadow: 0 0 0 1px rgba(0,110,249,.08); }
.custom-select { position: relative; z-index: 2; flex: 1; min-width: 0; }.custom-select:has(> button.open) { z-index: 50; }.custom-select > button { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 32px; padding: 0 12px; border: 1px solid #e5e8eb; border-radius: 6px; color: rgba(0,0,0,.9); font-size: 14px; text-align: left; background: #fff; transition: border-color .16s, box-shadow .16s, background .16s; }.custom-select > button:hover { border-color: #b8c2cc; background: #fafcff; }.custom-select > button.open { border-color: #006ef9; box-shadow: 0 0 0 1px rgba(0,110,249,.08); }.chevron { display: inline-block; flex: 0 0 auto; width: 8px; height: 8px; margin: 0 1px 3px 10px; border-right: 1.5px solid currentColor; border-bottom: 1.5px solid currentColor; vertical-align: middle; transform: rotate(45deg); transform-origin: 60% 60%; transition: transform .16s, margin .16s; }.chevron.up { margin-top: 4px; margin-bottom: 0; transform: rotate(225deg); }.select-menu { position: absolute; z-index: 100; top: 36px; right: 0; left: 0; max-height: 184px; overflow-y: scroll; scrollbar-gutter: stable; padding: 4px 2px 4px 4px; border: 1px solid #e5e8eb; border-radius: 6px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.12); }.select-menu::-webkit-scrollbar { width: 8px; }.select-menu::-webkit-scrollbar-track { margin: 4px 0; border-radius: 4px; background: #f2f4f6; }.select-menu::-webkit-scrollbar-thumb { border: 2px solid #f2f4f6; border-radius: 4px; background: #b8c2cc; }.select-menu::-webkit-scrollbar-thumb:hover { background: #8b98a5; }.select-menu button { display: block; width: 100%; height: 36px; padding: 0 12px; border: 0; border-radius: 3px; color: rgba(0,0,0,.9); text-align: left; background: #fff; transition: color .15s, background .15s; }.select-menu button:hover { color: #006ef9; background: #f3f7fc; }.select-menu button.selected { color: #006ef9; background: #eaf3ff; }
.field-date { grid-column: 1; }
.records-date-range { flex: 1; min-width: 0; width: 100%; height: 32px; }
.records-date-range.t-date-range-picker { display: flex; }
.records-date-range .t-range-input { width: 100%; height: 32px; border-color: #e5e8eb; border-radius: 6px; box-shadow: none; transition: border-color .16s, box-shadow .16s, background .16s; }
.records-date-range .t-range-input:hover { border-color: #b8c2cc; background: #fafcff; }
.records-date-range .t-is-focused { border-color: #006ef9; box-shadow: 0 0 0 1px rgba(0,110,249,.08); }
.records-date-range .t-range-input__inner { font: inherit; font-size: 14px; }
.records-date-range .t-range-input__inner::placeholder { color: rgba(0, 0, 0, .4); }
.t-date-picker__panel-container { z-index: 3000; }
.filter-grid > :nth-child(2) { grid-column: 2; grid-row: 1; }.filter-grid > :nth-child(3) { grid-column: 3; grid-row: 1; }.filter-grid > :nth-child(4) { grid-column: 4; grid-row: 1; }
.filter-grid > :nth-child(5) { grid-column: 1; grid-row: 2; width: calc((100% - 24px) / 2); }.filter-grid > :nth-child(6) { grid-column: 1; grid-row: 2; width: calc((100% - 24px) / 2); margin-left: calc((100% + 24px) / 2); }
.filter-grid > :nth-child(7) { grid-column: 2; grid-row: 2; }.filter-grid > :nth-child(8) { grid-column: 3; grid-row: 2; }.filter-grid > :nth-child(9) { grid-column: 4; grid-row: 2; }
.filter-grid > :nth-child(10) { grid-column: 1; grid-row: 3; width: calc((100% - 24px) / 2); }.query-actions { grid-column: 1; grid-row: 3; display: flex; gap: 16px; margin-left: calc((100% + 24px) / 2 + 2px); }
button { font-family: inherit; }.primary, .secondary { height: 32px; padding: 0 16px; border-radius: 6px; font-size: 14px; cursor: pointer; transition: color .16s, border-color .16s, background .16s, box-shadow .16s; }
.primary { border: 1px solid #006ef9; color: #fff; background: #2f82f6; }.primary:hover { border-color: #005fd9; background: #006ef9; box-shadow: 0 2px 7px rgba(0,110,249,.22); }.primary:active { background: #005bcc; box-shadow: none; }.secondary { border: 1px solid #d6dbe1; color: rgba(0, 0, 0, .65); background: #fff; }.secondary:hover { border-color: #9aa7b3; color: #006ef9; background: #f8fbff; }.secondary:active { background: #edf5ff; }.small { min-width: 60px; }
.batch-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }.batch-actions { display: flex; gap: 16px; }.export { display: inline-flex; align-items: center; justify-content: center; width: 80px; padding: 0 10px; color: #006ef9; white-space: nowrap; }.wide { min-width: 172px; }.history-wrap { position: relative; }.history { min-width: 108px; }.history:focus { outline: none; }.history.active,.history.active:hover { border-color: #338bfa; color: #338bfa; background: #fff; box-shadow: 0 0 0 1px rgba(0,110,249,.08); }.history span { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-left: 6px; border-radius: 50%; color: #fff; font-size: 11px; background: #777; }.history:hover span,.history.active span { background: #1684ff; }.history-tip { position: absolute; right: 0; bottom: 44px; z-index: 80; width: 180px; padding: 18px 20px; border-radius: 4px; color: rgba(0,0,0,.85); font-size: 16px; line-height: 1.6; background: #fff; box-shadow: 0 10px 24px rgba(0,0,0,.12); }.history-tip::after { position: absolute; right: 54px; bottom: -7px; width: 14px; height: 14px; background: #fff; transform: rotate(45deg); content: ""; }.menu-wrap { position: relative; }.action-menu { position: absolute; z-index: 40; top: 36px; overflow: hidden; padding: 4px; border: 1px solid #e5e8eb; border-radius: 6px; background: #fff; box-shadow: 0 5px 12px rgba(0,0,0,.18); }.action-menu button { display: block; width: 100%; height: 32px; padding: 0 10px; border: 0; color: rgba(0,0,0,.9); text-align: left; background: #fff; transition: color .15s, background .15s; }.action-menu button:hover { color: #006ef9; background: #edf5ff; }.action-menu button.danger:hover { color: #d54941; background: #fff1f0; }.export-menu { left: 0; width: 142px; }
.table-card { display: flex; flex: 1 1 auto; flex-direction: column; min-height: 0; margin-top: 24px; }.table-scroll { flex: 1 1 auto; min-height: 0; overflow: scroll; scrollbar-gutter: stable; }.table-scroll::-webkit-scrollbar,.select-menu::-webkit-scrollbar { width: 8px; height: 8px; }.table-scroll::-webkit-scrollbar-track,.select-menu::-webkit-scrollbar-track { border-radius: 4px; background: #f2f4f6; }.table-scroll::-webkit-scrollbar-thumb,.select-menu::-webkit-scrollbar-thumb { border: 2px solid #f2f4f6; border-radius: 4px; background: #b8c2cc; }.table-scroll::-webkit-scrollbar-thumb:hover,.select-menu::-webkit-scrollbar-thumb:hover { background: #8b98a5; }.table-scroll table { width: 100%; min-width: 1376px; border-collapse: collapse; table-layout: fixed; }.col-check{width:38px}.col-no{width:82px}.col-patient{width:92px}.col-age{width:62px}.col-doctor{width:86px}.col-clerk{width:70px}.col-type{width:100px}.col-status{width:100px}.col-time{width:100px}.col-payment{width:80px}.col-audit{width:112px}.col-realname{width:80px}.col-operations{width:274px}
th, td { height: 60px; padding: 0 10px; overflow: hidden; border-bottom: 1px solid #f0f1f2; font-weight: 400; text-align: left; text-overflow: ellipsis; vertical-align: middle; white-space: nowrap; }
thead th { position: sticky; top: 0; z-index: 3; height: 52px; border-color: #e5e8eb; background: #fff; }.check { text-align: center; }.check input { appearance: none; width: 16px; height: 16px; margin: 0; border: 1px solid #d8dee5; border-radius: 4px; background-color: #fff; background-position: center; background-repeat: no-repeat; cursor: pointer; }.check input:hover { border-color: #006ef9; }.check input:checked { border-color: #006ef9; background-color: #006ef9; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2.2 6.1 4.7 8.5 9.8 3.4' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }.check input:indeterminate { border-color: #006ef9; background-color: #006ef9; background-image: linear-gradient(#fff,#fff); background-size: 8px 1.5px; }
tbody tr { transition: background .15s; }tbody tr:hover td { background: #f7faff; }.operations-head, .operations { border-left: 4px solid #e5e8eb; }.operations-head { z-index: 4; }.operation-actions { display: flex; align-items: center; gap: 0; height: 60px; }.operation-actions > button { justify-content: center; width: 60px; height: 60px; padding: 0 8px; border-bottom: 1px solid #e5e8eb; }.operations button { display: inline-flex; align-items: center; border: 0; color: #006ef9; font-size: 14px; background: #fff; cursor: pointer; transition: color .15s, background .15s; }.operations button:hover { color: #338bfa; background: #f8f8f9; }.operations button:active { color: #005ed4; background: #f8f8f9; }.more-wrap { display: flex; align-items: center; justify-content: center; width: 80px; height: 60px; }.more-wrap > button { justify-content: center; width: 80px; height: 60px; gap: 10px; border-bottom: 1px solid #e5e8eb; }.more-wrap > button .chevron { margin-left: 0; }.more-menu--floating { position: fixed; z-index: 1000; top: auto; right: auto; display: flex; flex-direction: column; width: 80px; padding: 0; overflow: hidden; border: 0; border-radius: 8px; filter: drop-shadow(0 3px 3px rgba(0,0,0,.25)); }.more-menu--floating button { display: flex; align-items: center; width: 80px; height: 34px; padding: 0 12px; border: 0; border-bottom: 1px solid #e7e7e7; color: rgba(0,0,0,.8); font-size: 14px; text-align: left; background: #fff; }.more-menu--floating button:last-child { border-bottom: 0; }.more-menu--floating button:hover { color: #338bfa; background: #f8f8f9; }.more-menu--floating button.danger:hover { color: #d54941; background: #fff1f0; }
.type-tag { display: inline-flex; align-items: center; height: 32px; padding: 0 12px; border-radius: 3px; }.type-tag.text { color: #009080; background: #d1f0ec; }.type-tag.video { color: #5c82e6; background: #edf2ff; }
.consult-status { display: flex; align-items: center; gap: 8px; }.consult-status i { width: 12px; height: 12px; border-radius: 50%; }.consult-status .green { background: #2dcc70; }.consult-status .gray { background: #9aa7ba; }
.audit-tag { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px; border-radius: 3px; }.audit-tag i { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; color: #fff; font-size: 11px; font-style: normal; }.audit-tag.done { color: #009080; background: #e3f9e9; }.audit-tag.done i { background: #009d8c; }.audit-tag.unsigned { color: #e87a1b; background: #fff7ed; }.audit-tag.unsigned i { background: #ed7417; }.audit-tag.void { color: #555; background: #f3f4f5; }.audit-tag.void i { background: #9aa7ba; }
.pagination { position: sticky; bottom: 0; z-index: 5; display: flex; flex: 0 0 89px; align-items: center; justify-content: flex-end; gap: 8px; height: 89px; padding: 0 24px; border-top: 1px solid #f0f1f2; color: rgba(0, 0, 0, .65); white-space: nowrap; background: #fff; }.pagination > span:first-child { display: inline-flex; align-items: center; height: 32px; margin-right: 8px; }.pagination button { display: inline-flex; align-items: center; justify-content: center; height: 32px; border: 1px solid #d9dee4; border-radius: 3px; color: rgba(0, 0, 0, .65); background: #fff; transition: color .15s,border-color .15s,background .15s; }.pagination button:hover:not(:disabled) { border-color: #006ef9; color: #006ef9; background: #f7faff; }.page-size-wrap { position: relative; display: flex; align-items: center; height: 32px; margin-right: 24px; }.page-size { display: flex; align-items: center; justify-content: space-between; width: 112px; padding: 0 12px; }.page-size-menu { top: auto; right: 0; bottom: 36px; width: 112px; padding: 0; overflow: hidden; border: 0; border-radius: 8px; filter: drop-shadow(0 3px 3px rgba(0,0,0,.25)); }.page-size-menu button { justify-content: flex-start; height: 34px; padding: 0 12px; border: 0; border-bottom: 1px solid #e7e7e7; color: rgba(0,0,0,.8); background: #fff; }.page-size-menu button:last-child { border-bottom: 0; }.page-size-menu button:hover { color: #338bfa; background: #f8f8f9; }.page-size-menu button.selected,.page-size-menu button.selected:hover { color: #005ed4; background: #f8f8f9; }.page, .arrow { width: 32px; }.page.active,.page.active:hover { border-color: #006ef9; color: #fff; background: #006ef9; }.arrow { border-color: transparent !important; font-size: 22px; }.arrow:disabled { color: #c4c9cf; cursor: not-allowed; }.ellipsis { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; text-align: center; }.jump { display: flex; align-items: center; height: 32px; margin-left: 16px; padding: 0 8px; background: #f5f5f5; }.jump input { width: 54px; height: 24px; margin: 0 8px; border: 1px solid #d8dde3; border-radius: 3px; text-align: center; background: #fff; }.jump input:hover { border-color: #9aa7b3; }.jump input:focus { border-color: #006ef9; outline: none; box-shadow: 0 0 0 1px rgba(0,110,249,.08); }
.modal-mask { position: fixed; z-index: 100; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.35); }.settings-dialog, .record-dialog { width: 360px; padding: 20px; border-radius: 10px; background: #fff; box-shadow: 0 16px 48px rgba(0,0,0,.22); }.settings-dialog { width: 240px; }.settings-dialog header, .record-dialog header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; font-size: 18px; }.settings-dialog header button, .record-dialog header button { border: 0; font-size: 22px; background: transparent; }.settings-dialog label { display: flex; align-items: center; justify-content: space-between; }.switch { position: relative; width: 36px; height: 20px; padding: 0; border: 0; border-radius: 10px; background: #d8dde3; }.switch i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .2s; }.switch.on { background: #1684ff; }.switch.on i { transform: translateX(16px); }.record-dialog p { margin: 0 0 20px; color: rgba(0,0,0,.65); }.record-dialog dl { display: grid; grid-template-columns: 90px 1fr; gap: 12px; margin: 0; }.record-dialog dt { color: rgba(0,0,0,.45); }.record-dialog dd { margin: 0; }.records-toast { position: fixed; z-index: 150; top: 82px; left: 50%; padding: 10px 20px; border-radius: 6px; color: #fff; background: rgba(0,0,0,.78); transform: translateX(-50%); box-shadow: 0 8px 24px rgba(0,0,0,.2); }.toast-enter-active,.toast-leave-active { transition: opacity .2s, transform .2s; }.toast-enter-from,.toast-leave-to { opacity: 0; transform: translate(-50%,-8px); }
@media (max-width: 1300px) { .account-bar { padding-inline: 20px; }.account-actions { gap: 12px; }.service-btn { min-width: 128px; }.records-nav { gap: 10px; padding-inline: 40px; }.records-content { padding: 20px 20px 0; }.filter-grid { gap-inline: 16px; } }
</style>
