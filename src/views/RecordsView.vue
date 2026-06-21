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
            <button class="date-input" type="button">
              <span>开始日期时间</span><i>-</i><span>结束日期时间</span><b class="calendar">▣</b>
            </button>
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
            <button class="primary small" type="button">查询</button>
            <button class="secondary small" type="button" @click="resetFilters">重置</button>
          </div>
        </div>

        <div class="batch-bar">
          <div class="batch-actions">
            <button class="secondary export" type="button">导出 <span>⌄</span></button>
            <button class="primary" type="button">批量下载</button>
            <button class="primary" type="button">批量打印</button>
            <button class="primary wide" type="button">批量下载药品实名问诊</button>
          </div>
          <button class="secondary history" type="button">历史记录 <span>?</span></button>
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
              <tr v-for="record in records" :key="record.id">
                <td class="check"><input v-model="selected" type="checkbox" :value="record.id" /></td>
                <td>{{ record.no }}</td><td>{{ record.patient }}</td><td>{{ record.age }}</td><td>{{ record.doctor }}</td><td>{{ record.clerk }}</td>
                <td><span class="type-tag" :class="record.type === '视频问诊' ? 'video' : 'text'">{{ record.type }}</span></td>
                <td><span class="consult-status"><i :class="record.status === '完成问诊' ? 'green' : 'gray'"></i>{{ record.status }}</span></td>
                <td>{{ record.start }}</td><td>{{ record.end }}</td><td>{{ record.payment }}</td>
                <td><span v-if="record.audit !== '-'" class="audit-tag" :class="record.auditTone"><i>{{ record.auditIcon }}</i>{{ record.audit }}</span><span v-else>-</span></td>
                <td>{{ record.realName }}</td>
                <td class="operations">
                  <button type="button">查看</button>
                  <button v-if="record.printable" type="button">打印</button>
                  <button v-if="record.more" type="button">更多 <span>⌄</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="pagination">
          <span>共 XX 条</span>
          <button class="page-size" type="button">20 条/页 <span>⌄</span></button>
          <button class="arrow disabled" type="button">‹</button>
          <button class="page active" type="button">1</button><button class="page" type="button">2</button><button class="page" type="button">3</button><button class="page" type="button">4</button><button class="page" type="button">5</button>
          <span class="ellipsis">···</span><button class="page" type="button">11</button><button class="arrow" type="button">›</button>
          <span class="jump">跳至 <input value="11" /> /20 页</span>
        </footer>
      </section>
    </main>
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
function resetFilters() { Object.assign(filters, defaultFilters); }

const FilterSelect = defineComponent({
  props: { label: String, modelValue: String }, emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () => h("label", { class: "field" }, [
      h("span", props.label),
      h("select", { value: props.modelValue, onChange: (event) => emit("update:modelValue", event.target.value) }, [
        h("option", "全部"), h("option", "是"), h("option", "否")
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
.field { display: flex; align-items: center; gap: 12px; height: 32px; min-width: 0; }
.field > span { flex: 0 0 auto; white-space: nowrap; }
.field input, .field select, .date-input { flex: 1; min-width: 0; height: 32px; padding: 0 12px; border: 1px solid #e5e8eb; border-radius: 6px; outline: 0; color: rgba(0, 0, 0, .9); font: inherit; background: #fff; }
.field input::placeholder { color: rgba(0, 0, 0, .4); }
.field select { appearance: auto; }
.field-date { grid-column: 1; }
.date-input { display: flex; align-items: center; gap: 8px; color: rgba(0, 0, 0, .4); text-align: left; }
.date-input span { flex: 1; }.date-input i { font-style: normal; }.calendar { color: #999; font-size: 15px; }
.filter-grid > :nth-child(2) { grid-column: 2; grid-row: 1; }.filter-grid > :nth-child(3) { grid-column: 3; grid-row: 1; }.filter-grid > :nth-child(4) { grid-column: 4; grid-row: 1; }
.filter-grid > :nth-child(5) { grid-column: 1; grid-row: 2; width: 248px; }.filter-grid > :nth-child(6) { grid-column: 1; grid-row: 2; margin-left: 272px; width: 250px; }
.filter-grid > :nth-child(7) { grid-column: 2; grid-row: 2; }.filter-grid > :nth-child(8) { grid-column: 3; grid-row: 2; }.filter-grid > :nth-child(9) { grid-column: 4; grid-row: 2; }
.filter-grid > :nth-child(10) { grid-column: 1; grid-row: 3; width: 248px; }.query-actions { grid-column: 1; grid-row: 3; display: flex; gap: 16px; margin-left: 274px; }
button { font-family: inherit; }.primary, .secondary { height: 32px; padding: 0 16px; border-radius: 6px; font-size: 14px; cursor: pointer; }
.primary { border: 1px solid #006ef9; color: #fff; background: #2f82f6; }.secondary { border: 1px solid #d6dbe1; color: rgba(0, 0, 0, .65); background: #fff; }.small { min-width: 60px; }
.batch-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }.batch-actions { display: flex; gap: 16px; }.export { width: 80px; color: #006ef9; }.wide { min-width: 172px; }.history { min-width: 108px; }.history span { display: inline-flex; align-items: center; justify-content: center; width: 14px; height: 14px; margin-left: 6px; border-radius: 50%; color: #fff; font-size: 11px; background: #777; }
.table-card { height: 502px; margin-top: 24px; }.table-scroll { overflow-x: auto; }.table-scroll table { width: 100%; min-width: 1368px; border-collapse: collapse; table-layout: fixed; }
th, td { height: 60px; padding: 0 10px; border-bottom: 1px solid #f0f1f2; font-weight: 400; text-align: left; white-space: nowrap; }
thead th { height: 52px; border-color: #e5e8eb; }.check { width: 38px; text-align: center; }.check input { appearance: none; width: 16px; height: 16px; margin: 0; border: 1px solid #d8dee5; border-radius: 4px; background: #fff; }.check input:checked { border-color: #006ef9; background: #006ef9; box-shadow: inset 0 0 0 3px #fff; }
th:nth-child(2) { width: 102px; } th:nth-child(3) { width: 88px; } th:nth-child(4) { width: 88px; } th:nth-child(5) { width: 80px; } th:nth-child(6) { width: 50px; } th:nth-child(7) { width: 100px; } th:nth-child(8) { width: 100px; } th:nth-child(9), th:nth-child(10) { width: 100px; } th:nth-child(11) { width: 80px; } th:nth-child(12) { width: 112px; } th:nth-child(13) { width: 80px; } th:nth-child(14) { width: 274px; }
.operations-head, .operations { border-left: 4px solid #e5e8eb; }.operations { display: flex; align-items: center; gap: 32px; }.operations button { padding: 0; border: 0; color: #006ef9; font-size: 14px; background: none; cursor: pointer; }.operations span { margin-left: 6px; }
.type-tag { display: inline-flex; align-items: center; height: 32px; padding: 0 12px; border-radius: 3px; }.type-tag.text { color: #009080; background: #d1f0ec; }.type-tag.video { color: #5c82e6; background: #edf2ff; }
.consult-status { display: flex; align-items: center; gap: 8px; }.consult-status i { width: 12px; height: 12px; border-radius: 50%; }.consult-status .green { background: #2dcc70; }.consult-status .gray { background: #9aa7ba; }
.audit-tag { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px; border-radius: 3px; }.audit-tag i { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; color: #fff; font-size: 11px; font-style: normal; }.audit-tag.done { color: #009080; background: #e3f9e9; }.audit-tag.done i { background: #009d8c; }.audit-tag.unsigned { color: #e87a1b; background: #fff7ed; }.audit-tag.unsigned i { background: #ed7417; }.audit-tag.void { color: #555; background: #f3f4f5; }.audit-tag.void i { background: #9aa7ba; }
.pagination { display: flex; align-items: center; justify-content: flex-end; gap: 8px; height: 89px; padding: 0 24px; color: rgba(0, 0, 0, .65); }.pagination button { height: 32px; border: 1px solid #d9dee4; border-radius: 3px; color: rgba(0, 0, 0, .65); background: #fff; }.page-size { width: 112px; margin-right: 16px; }.page-size span { margin-left: 12px; }.page, .arrow { width: 32px; }.page.active { border-color: #006ef9; color: #fff; background: #006ef9; }.arrow { border-color: transparent !important; font-size: 22px; }.arrow.disabled { color: #c4c9cf; }.ellipsis { width: 32px; text-align: center; }.jump { display: flex; align-items: center; height: 32px; margin-left: 16px; padding: 0 8px; background: #f5f5f5; }.jump input { width: 54px; height: 24px; margin: 0 8px; border: 1px solid #d8dde3; border-radius: 3px; text-align: center; background: #fff; }
@media (max-width: 1300px) { .records-nav { gap: 10px; padding-inline: 40px; }.records-content { padding: 20px; }.filter-grid { grid-template-columns: 500px 230px 230px 230px; gap-inline: 16px; } }
</style>
