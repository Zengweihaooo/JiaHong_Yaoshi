<template>
  <div class="records-page">
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
            <button class="date-input" :class="{ active: dateOpen, filled: dateStart }" type="button" @click="dateOpen = !dateOpen">
              <span>{{ dateStart || '开始日期时间' }}</span><i>-</i><span>{{ dateEnd || '结束日期时间' }}</span><b class="calendar">▣</b>
            </button>
            <div v-if="dateOpen" class="date-popover">
              <label>开始时间<input v-model="draftStart" type="datetime-local" /></label>
              <label>结束时间<input v-model="draftEnd" type="datetime-local" /></label>
              <div><button type="button" @click="clearDate">清空</button><button class="primary" type="button" @click="applyDate">确定</button></div>
            </div>
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
            <div class="menu-wrap"><button class="secondary export" type="button" @click="exportOpen = !exportOpen">导出 <span>{{ exportOpen ? '⌃' : '⌄' }}</span></button><div v-if="exportOpen" class="action-menu export-menu"><button type="button" @click="perform('导出当前页')">导出当前页</button><button type="button" @click="perform('导出全部记录')">导出全部记录</button><button type="button" @click="settingsOpen = true; exportOpen = false">浏览设置</button></div></div>
            <button class="primary" type="button" @click="batchAction('批量下载')">批量下载</button>
            <button class="primary" type="button" @click="batchAction('批量打印')">批量打印</button>
            <button class="primary wide" type="button" @click="batchAction('批量下载药品实名问诊')">批量下载药品实名问诊</button>
          </div>
          <button class="secondary history" type="button" @click="historyOpen = true">历史记录 <span>?</span></button>
        </div>
      </section>

      <section class="table-card" aria-label="问诊记录列表">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th class="check"><input type="checkbox" :checked="allSelected" @change="toggleAll" /></th>
                <th>问诊号</th><th>患者姓名</th><th>年龄</th><th>问诊医生</th><th>店员</th><th>问诊类型</th><th>问诊状态</th><th>开始时间</th><th>结束时间</th><th>支付状态</th><th>审方状态</th><th>药品实名</th><th class="operations-head">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in visibleRecords" :key="record.id">
                <td class="check"><input v-model="selected" type="checkbox" :value="record.id" /></td>
                <td>{{ record.no }}</td><td>{{ record.patient }}</td><td>{{ record.age }}</td><td>{{ record.doctor }}</td><td>{{ record.clerk }}</td>
                <td><span class="type-tag" :class="record.type === '视频问诊' ? 'video' : 'text'">{{ record.type }}</span></td>
                <td><span class="consult-status"><i :class="record.status === '完成问诊' ? 'green' : 'gray'"></i>{{ record.status }}</span></td>
                <td>{{ record.start }}</td><td>{{ record.end }}</td><td>{{ record.payment }}</td>
                <td><span v-if="record.audit !== '-'" class="audit-tag" :class="record.auditTone"><i>{{ record.auditIcon }}</i>{{ record.audit }}</span><span v-else>-</span></td>
                <td>{{ record.realName }}</td>
                <td class="operations">
                  <button type="button" @click="viewRecord(record)">查看</button>
                  <button v-if="record.printable" type="button" @click="perform(`打印问诊记录 ${record.no}`)">打印</button>
                  <div v-if="record.more" class="menu-wrap more-wrap"><button type="button" @click="toggleMore(record.id)">更多 <span>{{ moreId === record.id ? '⌃' : '⌄' }}</span></button><div v-if="moreId === record.id" class="action-menu more-menu"><button type="button" @click="perform('下载')">下载</button><button type="button" @click="perform('重开处方')">重开处方</button><button type="button" @click="perform('作废')">作废</button></div></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="pagination">
          <span>共 XX 条</span>
          <button class="page-size" type="button">20 条/页 <span>⌄</span></button>
          <button class="arrow disabled" type="button">‹</button>
          <button v-for="page in [1,2,3,4,5]" :key="page" class="page" :class="{ active: currentPage === page }" type="button" @click="currentPage = page">{{ page }}</button>
          <span class="ellipsis">···</span><button class="page" :class="{ active: currentPage === 11 }" type="button" @click="currentPage = 11">11</button><button class="arrow" type="button" @click="currentPage = Math.min(20, currentPage + 1)">›</button>
          <span class="jump">跳至 <input v-model.number="jumpPage" min="1" max="20" type="number" @keyup.enter="jumpToPage" /> /20 页</span>
        </footer>
      </section>
    </main>

    <div v-if="settingsOpen" class="modal-mask" @click.self="settingsOpen = false"><section class="settings-dialog"><header>浏览设置 <button type="button" @click="settingsOpen = false">×</button></header><label>颜色编码 <button class="switch" :class="{ on: colorCoding }" type="button" @click="colorCoding = !colorCoding"><i></i></button></label></section></div>
    <div v-if="historyOpen" class="modal-mask" @click.self="historyOpen = false"><section class="record-dialog"><header>历史记录 <button type="button" @click="historyOpen = false">×</button></header><p>2023年1月1日之前的历史记录请在此查询。</p><button class="primary" type="button" @click="perform('查询历史记录'); historyOpen = false">前往查询</button></section></div>
    <div v-if="detailRecord" class="modal-mask" @click.self="detailRecord = null"><section class="record-dialog"><header>问诊记录详情 <button type="button" @click="detailRecord = null">×</button></header><dl><dt>问诊号</dt><dd>{{ detailRecord.no }}</dd><dt>患者姓名</dt><dd>{{ detailRecord.patient }}</dd><dt>问诊类型</dt><dd>{{ detailRecord.type }}</dd><dt>问诊状态</dt><dd>{{ detailRecord.status }}</dd><dt>审方状态</dt><dd>{{ detailRecord.audit }}</dd></dl></section></div>
    <Transition name="toast"><div v-if="toast" class="records-toast">{{ toast }}</div></Transition>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, reactive, ref } from "vue";
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
const optionMap = { "问诊类型": ["全部", "图文问诊", "视频问诊"], "问诊状态": ["全部", "完成问诊", "取消问诊"], "支付状态": ["全部", "已支付", "未支付", "无"], "审方状态": ["全部", "已完成", "未签名", "未审核", "待修改", "未申请", "已作废"], "药品实名": ["全部", "是", "否"], "药品名称": ["全部", "草酸艾司西酞普兰片", "感冒片"], "问诊号": ["全部", "XXXXXX"] };
function resetFilters() { Object.assign(filters, defaultFilters); Object.assign(appliedFilters, defaultFilters); clearDate(); perform("筛选条件已重置"); }
function runQuery() { Object.assign(appliedFilters, filters); perform("查询完成"); }

const FilterSelect = defineComponent({
  props: { label: String, modelValue: String }, emits: ["update:modelValue"],
  setup(props, { emit }) {
    const open = ref(false);
    const choose = (value) => { emit("update:modelValue", value); open.value = false; };
    return () => h("label", { class: "field" }, [
      h("span", props.label),
      h("div", { class: "custom-select" }, [
        h("button", { type: "button", class: { open: open.value }, onClick: () => open.value = !open.value }, [props.modelValue, h("i", open.value ? "⌃" : "⌄")]),
        open.value ? h("div", { class: "select-menu" }, (optionMap[props.label] || ["全部"]).map((option) => h("button", { type: "button", class: { selected: option === props.modelValue }, onClick: () => choose(option) }, option))) : null
      ])
    ]);
  }
});

const records = [
  { id: 1, no: "XXXXXX", patient: "童童", age: "3岁", doctor: "XXX", clerk: "-", type: "图文问诊", status: "完成问诊", start: "18：05：30", end: "18：05：30", payment: "无", audit: "已完成", auditTone: "done", auditIcon: "✓", realName: "否", printable: true, more: true },
  { id: 2, no: "XXXXXX", patient: "-", age: "-", doctor: "XXX", clerk: "-", type: "视频问诊", status: "完成问诊", start: "18：05：30", end: "18：05：30", payment: "无", audit: "未签名", auditTone: "unsigned", auditIcon: "−", realName: "否", printable: true, more: true },
  { id: 3, no: "XXXXXX", patient: "-", age: "-", doctor: "XXX", clerk: "-", type: "图文问诊", status: "取消问诊", start: "18：05：30", end: "18：05：30", payment: "无", audit: "-", realName: "否", printable: false, more: false },
  { id: 4, no: "XXXXXX", patient: "XXX", age: "XXX", doctor: "XXX", clerk: "-", type: "图文问诊", status: "完成问诊", start: "18：05：30", end: "18：05：30", payment: "无", audit: "已作废", auditTone: "void", auditIcon: "×", realName: "否", printable: true, more: true },
  { id: 5, no: "XXXXXX", patient: "-", age: "-", doctor: "XXX", clerk: "-", type: "视频问诊", status: "完成问诊", start: "18：05：30", end: "18：05：30", payment: "无", audit: "未签名", auditTone: "unsigned", auditIcon: "−", realName: "否", printable: true, more: true },
  { id: 6, no: "XXXXXX", patient: "黄黄", age: "22岁", doctor: "XXX", clerk: "-", type: "图文问诊", status: "完成问诊", start: "18：05：30", end: "18：05：30", payment: "无", audit: "已完成", auditTone: "done", auditIcon: "✓", realName: "否", printable: true, more: true }
];
const selected = ref([]);
const allSelected = computed(() => selected.value.length === records.length);
function toggleAll(event) { selected.value = event.target.checked ? records.map((item) => item.id) : []; }
const visibleRecords = computed(() => records.filter((record) => {
  if (appliedFilters.type !== "全部" && record.type !== appliedFilters.type) return false;
  if (appliedFilters.status !== "全部" && record.status !== appliedFilters.status) return false;
  if (appliedFilters.audit !== "全部" && record.audit !== appliedFilters.audit) return false;
  if (appliedFilters.realName !== "全部" && record.realName !== appliedFilters.realName) return false;
  if (appliedFilters.patient && !record.patient.includes(appliedFilters.patient)) return false;
  return true;
}));

const dateOpen = ref(false), dateStart = ref(""), dateEnd = ref(""), draftStart = ref(""), draftEnd = ref("");
function applyDate() { dateStart.value = draftStart.value.replace("T", " "); dateEnd.value = draftEnd.value.replace("T", " "); dateOpen.value = false; }
function clearDate() { dateStart.value = ""; dateEnd.value = ""; draftStart.value = ""; draftEnd.value = ""; dateOpen.value = false; }
const exportOpen = ref(false), settingsOpen = ref(false), historyOpen = ref(false), colorCoding = ref(true), moreId = ref(null), detailRecord = ref(null);
const currentPage = ref(1), jumpPage = ref(11), toast = ref("");
let toastTimer;
function perform(message) { toast.value = message; window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.value = "", 1800); exportOpen.value = false; moreId.value = null; }
function batchAction(action) { if (!selected.value.length) return perform("请先选择问诊记录"); perform(`${action}：已选择 ${selected.value.length} 条`); }
function toggleMore(id) { moreId.value = moreId.value === id ? null : id; }
function viewRecord(record) { detailRecord.value = record; moreId.value = null; }
function jumpToPage() { currentPage.value = Math.max(1, Math.min(20, Number(jumpPage.value) || 1)); }
</script>

<style>
* { box-sizing: border-box; }
.records-page { min-width: 1200px; min-height: 100vh; color: rgba(0, 0, 0, .9); font-family: "Microsoft YaHei UI", "Microsoft YaHei", sans-serif; font-size: 14px; background: #f5f5f5; }
.records-nav { display: flex; align-items: flex-end; justify-content: center; gap: 23px; height: 64px; padding: 8px 116px 0; background: #fff; }
.records-nav button { position: relative; width: 100px; height: 56px; padding: 0 0 17px; border: 0; color: rgba(0, 0, 0, .9); font: inherit; font-size: 16px; line-height: 24px; white-space: nowrap; background: transparent; cursor: pointer; }
.records-nav button::after { position: absolute; bottom: 0; left: 18px; width: 64px; height: 4px; background: transparent; content: ""; }
.records-nav button.active::after { background: #006ef9; }
.records-content { padding: 24px; }
.filter-card, .table-card { width: 100%; overflow: hidden; border-radius: 12px; background: #fff; }
.filter-card { height: 208px; padding: 16px 24px; }
.filter-grid { display: grid; grid-template-columns: 522px 250px 250px 250px; grid-template-rows: 32px 32px 32px; gap: 16px 24px; align-items: center; }
.field { position: relative; display: flex; align-items: center; gap: 12px; height: 32px; min-width: 0; }
.field > span { flex: 0 0 auto; white-space: nowrap; }
.field input, .date-input { flex: 1; min-width: 0; height: 32px; padding: 0 12px; border: 1px solid #e5e8eb; border-radius: 6px; outline: 0; color: rgba(0, 0, 0, .9); font: inherit; background: #fff; }
.field input::placeholder { color: rgba(0, 0, 0, .4); }
.custom-select { position: relative; flex: 1; min-width: 0; }.custom-select > button { display: flex; align-items: center; justify-content: space-between; width: 100%; height: 32px; padding: 0 12px; border: 1px solid #e5e8eb; border-radius: 6px; color: rgba(0,0,0,.9); font-size: 14px; text-align: left; background: #fff; }.custom-select > button.open { border-color: #006ef9; }.custom-select i { font-style: normal; }.select-menu { position: absolute; z-index: 20; top: 36px; right: 0; left: 0; max-height: 220px; overflow-y: auto; padding: 4px; border: 1px solid #e5e8eb; border-radius: 6px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.12); }.select-menu button { display: block; width: 100%; height: 32px; padding: 0 10px; border: 0; border-radius: 3px; color: rgba(0,0,0,.9); text-align: left; background: #fff; }.select-menu button:hover, .select-menu button.selected { color: #006ef9; background: #edf5ff; }
.field-date { grid-column: 1; }
.date-input { display: flex; align-items: center; gap: 8px; color: rgba(0, 0, 0, .4); text-align: left; }.date-input.active { border-color: #006ef9; box-shadow: 0 0 0 1px rgba(0,110,249,.08); }.date-input.filled { color: rgba(0,0,0,.9); }.date-popover { position: absolute; z-index: 30; top: 38px; left: 68px; width: 454px; padding: 16px; border: 1px solid #e5e8eb; border-radius: 8px; background: #fff; box-shadow: 0 12px 32px rgba(0,0,0,.14); }.date-popover label { display: grid; grid-template-columns: 70px 1fr; align-items: center; gap: 8px; margin-bottom: 12px; }.date-popover label input { width: 100%; }.date-popover > div { display: flex; justify-content: flex-end; gap: 8px; }.date-popover > div button { height: 30px; padding: 0 14px; border: 1px solid #d8dde3; border-radius: 4px; background: #fff; }.date-popover > div .primary { border-color: #006ef9; color: #fff; background: #006ef9; }
.date-input span { flex: 1; }.date-input i { font-style: normal; }.calendar { color: #999; font-size: 15px; }
.filter-grid > :nth-child(2) { grid-column: 2; grid-row: 1; }.filter-grid > :nth-child(3) { grid-column: 3; grid-row: 1; }.filter-grid > :nth-child(4) { grid-column: 4; grid-row: 1; }
.filter-grid > :nth-child(5) { grid-column: 1; grid-row: 2; width: 248px; }.filter-grid > :nth-child(6) { grid-column: 1; grid-row: 2; margin-left: 272px; width: 250px; }
.filter-grid > :nth-child(7) { grid-column: 2; grid-row: 2; }.filter-grid > :nth-child(8) { grid-column: 3; grid-row: 2; }.filter-grid > :nth-child(9) { grid-column: 4; grid-row: 2; }
.filter-grid > :nth-child(10) { grid-column: 1; grid-row: 3; width: 248px; }.query-actions { grid-column: 1; grid-row: 3; display: flex; gap: 16px; margin-left: 274px; }
button { font-family: inherit; }.primary, .secondary { height: 32px; padding: 0 16px; border-radius: 6px; font-size: 14px; cursor: pointer; }
.primary { border: 1px solid #006ef9; color: #fff; background: #2f82f6; }.secondary { border: 1px solid #d6dbe1; color: rgba(0, 0, 0, .65); background: #fff; }.small { min-width: 60px; }
.batch-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }.batch-actions { display: flex; gap: 16px; }.export { width: 80px; color: #006ef9; }.wide { min-width: 172px; }.history { min-width: 108px; }.history span { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-left: 6px; border-radius: 50%; color: #fff; font-size: 11px; background: #777; }.menu-wrap { position: relative; }.action-menu { position: absolute; z-index: 40; top: 36px; overflow: hidden; padding: 4px; border: 1px solid #e5e8eb; border-radius: 6px; background: #fff; box-shadow: 0 5px 12px rgba(0,0,0,.18); }.action-menu button { display: block; width: 100%; height: 32px; padding: 0 10px; border: 0; color: rgba(0,0,0,.9); text-align: left; background: #fff; }.action-menu button:hover { color: #006ef9; background: #edf5ff; }.export-menu { left: 0; width: 142px; }
.table-card { height: 502px; margin-top: 24px; }.table-scroll { overflow-x: auto; }.table-scroll table { width: 100%; min-width: 1368px; border-collapse: collapse; table-layout: fixed; }
th, td { height: 60px; padding: 0 10px; border-bottom: 1px solid #f0f1f2; font-weight: 400; text-align: left; white-space: nowrap; }
thead th { height: 52px; border-color: #e5e8eb; }.check { width: 38px; text-align: center; }.check input { appearance: none; width: 16px; height: 16px; margin: 0; border: 1px solid #d8dee5; border-radius: 4px; background: #fff; }.check input:checked { border-color: #006ef9; background: #006ef9; box-shadow: inset 0 0 0 3px #fff; }
th:nth-child(2) { width: 102px; } th:nth-child(3) { width: 88px; } th:nth-child(4) { width: 88px; } th:nth-child(5) { width: 80px; } th:nth-child(6) { width: 50px; } th:nth-child(7) { width: 100px; } th:nth-child(8) { width: 100px; } th:nth-child(9), th:nth-child(10) { width: 100px; } th:nth-child(11) { width: 80px; } th:nth-child(12) { width: 112px; } th:nth-child(13) { width: 80px; } th:nth-child(14) { width: 274px; }
.operations-head, .operations { border-left: 4px solid #e5e8eb; }.operations { display: flex; align-items: center; gap: 32px; }.operations button { padding: 0; border: 0; color: #006ef9; font-size: 14px; background: none; cursor: pointer; }.operations span { margin-left: 6px; }.more-wrap { height: 60px; display: flex; align-items: center; }.more-menu { top: 48px; right: -8px; width: 72px; }.more-menu button { color: rgba(0,0,0,.9); }
.type-tag { display: inline-flex; align-items: center; height: 32px; padding: 0 12px; border-radius: 3px; }.type-tag.text { color: #009080; background: #d1f0ec; }.type-tag.video { color: #5c82e6; background: #edf2ff; }
.consult-status { display: flex; align-items: center; gap: 8px; }.consult-status i { width: 12px; height: 12px; border-radius: 50%; }.consult-status .green { background: #2dcc70; }.consult-status .gray { background: #9aa7ba; }
.audit-tag { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px; border-radius: 3px; }.audit-tag i { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; color: #fff; font-size: 11px; font-style: normal; }.audit-tag.done { color: #009080; background: #e3f9e9; }.audit-tag.done i { background: #009d8c; }.audit-tag.unsigned { color: #e87a1b; background: #fff7ed; }.audit-tag.unsigned i { background: #ed7417; }.audit-tag.void { color: #555; background: #f3f4f5; }.audit-tag.void i { background: #9aa7ba; }
.pagination { display: flex; align-items: center; justify-content: flex-end; gap: 8px; height: 89px; padding: 0 24px; color: rgba(0, 0, 0, .65); }.pagination button { height: 32px; border: 1px solid #d9dee4; border-radius: 3px; color: rgba(0, 0, 0, .65); background: #fff; }.page-size { width: 112px; margin-right: 16px; }.page-size span { margin-left: 12px; }.page, .arrow { width: 32px; }.page.active { border-color: #006ef9; color: #fff; background: #006ef9; }.arrow { border-color: transparent !important; font-size: 22px; }.arrow.disabled { color: #c4c9cf; }.ellipsis { width: 32px; text-align: center; }.jump { display: flex; align-items: center; height: 32px; margin-left: 16px; padding: 0 8px; background: #f5f5f5; }.jump input { width: 54px; height: 24px; margin: 0 8px; border: 1px solid #d8dde3; border-radius: 3px; text-align: center; background: #fff; }
.modal-mask { position: fixed; z-index: 100; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.35); }.settings-dialog, .record-dialog { width: 360px; padding: 20px; border-radius: 10px; background: #fff; box-shadow: 0 16px 48px rgba(0,0,0,.22); }.settings-dialog { width: 240px; }.settings-dialog header, .record-dialog header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; font-size: 18px; }.settings-dialog header button, .record-dialog header button { border: 0; font-size: 22px; background: transparent; }.settings-dialog label { display: flex; align-items: center; justify-content: space-between; }.switch { position: relative; width: 36px; height: 20px; padding: 0; border: 0; border-radius: 10px; background: #d8dde3; }.switch i { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .2s; }.switch.on { background: #1684ff; }.switch.on i { transform: translateX(16px); }.record-dialog p { margin: 0 0 20px; color: rgba(0,0,0,.65); }.record-dialog dl { display: grid; grid-template-columns: 90px 1fr; gap: 12px; margin: 0; }.record-dialog dt { color: rgba(0,0,0,.45); }.record-dialog dd { margin: 0; }.records-toast { position: fixed; z-index: 150; top: 82px; left: 50%; padding: 10px 20px; border-radius: 6px; color: #fff; background: rgba(0,0,0,.78); transform: translateX(-50%); box-shadow: 0 8px 24px rgba(0,0,0,.2); }.toast-enter-active,.toast-leave-active { transition: opacity .2s, transform .2s; }.toast-enter-from,.toast-leave-to { opacity: 0; transform: translate(-50%,-8px); }
@media (max-width: 1300px) { .records-nav { gap: 10px; padding-inline: 40px; }.records-content { padding: 20px; }.filter-grid { grid-template-columns: 500px 230px 230px 230px; gap-inline: 16px; } }
</style>
