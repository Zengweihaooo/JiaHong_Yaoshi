<template>
  <div class="records-page">
    <header class="records-topbar">
      <Button class="back-button" variant="neutral" size="md" icon @click="router.push('/')">
        <img :src="assetUrl('assets/figma-consult/back.svg')" alt="" />
        <span>返回首页</span>
      </Button>
      <div class="records-topbar__right">
        <Button variant="primary" size="md">在线客服</Button>
        <span class="records-topbar__divider" />
        <span class="records-topbar__store">好药师大药房（九州通大厦店）</span>
      </div>
    </header>

    <nav class="records-nav" aria-label="主导航">
      <button type="button" @click="router.push('/')">首页</button>
      <button type="button">问诊医生</button>
      <button type="button">审方药师</button>
      <button class="is-active" type="button">问诊记录</button>
      <button type="button">预开方订单</button>
      <button type="button">处方药登记</button>
      <button type="button" @click="router.push('/new-product')">新品登记</button>
      <button type="button">咨询视频</button>
      <button type="button">优医专区</button>
      <button type="button">医生招聘</button>
    </nav>

    <main class="records-main">
      <section class="records-filter-card" aria-label="问诊记录筛选">
        <div class="filter-form">
          <label class="filter-field filter-field--date">
            <span class="filter-label">问诊时间</span>
            <button
              class="date-range-control"
              :class="{ 'is-active': datePickerOpen }"
              type="button"
              @click="datePickerOpen = !datePickerOpen"
            >
              <span :class="{ 'has-value': selectedStartDate }">{{ selectedStartLabel }}</span>
              <b>-</b>
              <span :class="{ 'has-value': selectedEndDate }">{{ selectedEndLabel }}</span>
              <span class="calendar-icon" aria-hidden="true">□</span>
            </button>
            <div v-if="datePickerOpen" class="date-picker-popover">
              <section v-for="calendar in calendars" :key="calendar.key" class="date-picker-calendar">
                <header class="date-picker-calendar__header">
                  <button class="date-select" type="button">{{ calendar.monthLabel }}<span>⌄</span></button>
                  <button class="date-select" type="button">{{ calendar.year }}<span>⌄</span></button>
                  <div class="date-controller">
                    <button type="button" @click.stop="shiftCalendar(-1)">‹</button>
                    <button type="button" @click.stop="resetCalendar">○</button>
                    <button type="button" @click.stop="shiftCalendar(1)">›</button>
                  </div>
                </header>
                <div class="date-picker-week">
                  <span v-for="label in weekLabels" :key="label">{{ label }}</span>
                </div>
                <div class="date-picker-grid">
                  <button
                    v-for="cell in calendar.days"
                    :key="cell.key"
                    class="date-cell"
                    :class="dateCellClass(cell)"
                    type="button"
                    @click.stop="selectDate(cell)"
                  >
                    <span>{{ cell.day }}</span>
                  </button>
                </div>
              </section>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">问诊类型</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'consultType' }"
              type="button"
              @click.prevent="toggleSelect('consultType')"
            >
              {{ selectValues.consultType }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'consultType'" class="select-popover">
              <button
                v-for="option in selectOptions.consultType"
                :key="option"
                :class="{ 'is-selected': selectValues.consultType === option }"
                type="button"
                @click.prevent="chooseSelect('consultType', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">问诊状态</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'consultStatus' }"
              type="button"
              @click.prevent="toggleSelect('consultStatus')"
            >
              {{ selectValues.consultStatus }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'consultStatus'" class="select-popover">
              <button
                v-for="option in selectOptions.consultStatus"
                :key="option"
                :class="{ 'is-selected': selectValues.consultStatus === option }"
                type="button"
                @click.prevent="chooseSelect('consultStatus', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">支付状态</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'paymentStatus' }"
              type="button"
              @click.prevent="toggleSelect('paymentStatus')"
            >
              {{ selectValues.paymentStatus }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'paymentStatus'" class="select-popover">
              <button
                v-for="option in selectOptions.paymentStatus"
                :key="option"
                :class="{ 'is-selected': selectValues.paymentStatus === option }"
                type="button"
                @click.prevent="chooseSelect('paymentStatus', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">审方状态</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'auditStatus' }"
              type="button"
              @click.prevent="toggleSelect('auditStatus')"
            >
              {{ selectValues.auditStatus }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'auditStatus'" class="select-popover select-popover--tall">
              <button
                v-for="option in selectOptions.auditStatus"
                :key="option"
                :class="{ 'is-selected': selectValues.auditStatus === option }"
                type="button"
                @click.prevent="chooseSelect('auditStatus', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">药品实名</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'realName' }"
              type="button"
              @click.prevent="toggleSelect('realName')"
            >
              {{ selectValues.realName }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'realName'" class="select-popover">
              <button
                v-for="option in selectOptions.realName"
                :key="option"
                :class="{ 'is-selected': selectValues.realName === option }"
                type="button"
                @click.prevent="chooseSelect('realName', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">患者姓名</span>
            <input type="text" placeholder="请输入患者名称" />
          </label>

          <label class="filter-field">
            <span class="filter-label">诊断名称</span>
            <input type="text" placeholder="请输入诊断名称" />
          </label>

          <label class="filter-field">
            <span class="filter-label">药品名称</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'medicineName' }"
              type="button"
              @click.prevent="toggleSelect('medicineName')"
            >
              {{ selectValues.medicineName }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'medicineName'" class="select-popover">
              <button
                v-for="option in selectOptions.medicineName"
                :key="option"
                :class="{ 'is-selected': selectValues.medicineName === option }"
                type="button"
                @click.prevent="chooseSelect('medicineName', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <label class="filter-field">
            <span class="filter-label">问诊号</span>
            <button
              class="select-control"
              :class="{ 'is-active': openSelectKey === 'consultNo' }"
              type="button"
              @click.prevent="toggleSelect('consultNo')"
            >
              {{ selectValues.consultNo }}<span>⌄</span>
            </button>
            <div v-if="openSelectKey === 'consultNo'" class="select-popover">
              <button
                v-for="option in selectOptions.consultNo"
                :key="option"
                :class="{ 'is-selected': selectValues.consultNo === option }"
                type="button"
                @click.prevent="chooseSelect('consultNo', option)"
              >
                {{ option }}
              </button>
            </div>
          </label>

          <div class="filter-actions">
            <Button variant="primary" size="md">查询</Button>
            <Button variant="neutral" size="md">重置</Button>
          </div>
        </div>

        <div class="batch-actions">
          <div class="batch-actions__left">
            <button class="ghost-action" type="button">导出<span>⌄</span></button>
            <Button variant="primary" size="md">批量下载</Button>
            <Button variant="primary" size="md">批量打印</Button>
            <Button variant="primary" size="md">批量下载药品实名问诊</Button>
          </div>
          <div class="history-wrap">
            <button class="history-action" type="button">历史记录<span>?</span></button>
            <div class="history-tooltip">2023年1月1日之前的历史记录请在此查询</div>
          </div>
        </div>
      </section>

      <section class="records-table-card" aria-label="问诊记录列表">
        <div class="records-table-wrap">
          <table class="records-table">
            <colgroup>
              <col class="col-check" />
              <col class="col-consult-no" />
              <col class="col-patient" />
              <col class="col-age" />
              <col class="col-doctor" />
              <col class="col-clerk" />
              <col class="col-type" />
              <col class="col-status" />
              <col class="col-time" />
              <col class="col-time" />
              <col class="col-payment" />
              <col class="col-audit" />
              <col class="col-realname" />
              <col class="col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th><span class="fake-checkbox" /></th>
                <th>问诊号</th>
                <th>患者姓名</th>
                <th>年龄</th>
                <th>问诊医生</th>
                <th>店员</th>
                <th>问诊类型</th>
                <th>问诊状态</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>支付状态</th>
                <th>审方状态</th>
                <th>药品实名</th>
                <th class="operations-title">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in records" :key="record.id">
                <td><span class="fake-checkbox" /></td>
                <td>{{ record.no }}</td>
                <td>{{ record.patient }}</td>
                <td>{{ record.age }}</td>
                <td>{{ record.doctor }}</td>
                <td>{{ record.clerk }}</td>
                <td>
                  <span class="consult-type" :class="`consult-type--${record.typeTone}`">
                    {{ record.type }}
                  </span>
                </td>
                <td>
                  <span class="consult-status">
                    <i :class="`status-dot status-dot--${record.statusTone}`" />
                    {{ record.status }}
                  </span>
                </td>
                <td>{{ record.start }}</td>
                <td>{{ record.end }}</td>
                <td>{{ record.payment }}</td>
                <td>
                  <span
                    v-if="record.audit !== '-'"
                    class="audit-pill"
                    :class="`audit-pill--${record.auditTone}`"
                  >
                    <i>{{ record.auditIcon }}</i>
                    {{ record.audit }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>{{ record.realName }}</td>
                <td class="operations">
                  <button type="button">查看</button>
                  <button v-if="record.printable" type="button">打印</button>
                  <button v-if="record.more" type="button">更多<span>⌄</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="records-pagination">
          <button class="page-size" type="button">20 条/页<span>⌄</span></button>
          <button class="page-nav" type="button">‹</button>
          <button class="page-number is-current" type="button">1</button>
          <button class="page-number" type="button">2</button>
          <button class="page-number" type="button">3</button>
          <button class="page-number" type="button">4</button>
          <button class="page-number" type="button">5</button>
          <span class="page-ellipsis">...</span>
          <button class="page-number" type="button">11</button>
          <button class="page-nav" type="button">›</button>
          <span class="page-jump">跳至 <input type="text" value="11" aria-label="页码" /> /20 页</span>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Button, assetUrl } from "@jiahong/ui";
import { useRouter } from "vue-router";

const router = useRouter();
const datePickerOpen = ref(false);
const calendarStartMonth = ref(new Date(2026, 5, 1));
const selectedStartDate = ref(null);
const selectedEndDate = ref(null);
const openSelectKey = ref("");
const selectValues = ref({
  consultType: "全部",
  consultStatus: "全部",
  paymentStatus: "全部",
  auditStatus: "全部",
  realName: "全部",
  medicineName: "全部",
  consultNo: "全部"
});
const selectOptions = {
  consultType: ["全部", "图文问诊", "视频问诊"],
  consultStatus: ["全部", "完成问诊", "取消问诊"],
  paymentStatus: ["全部", "无", "未支付", "已支付"],
  auditStatus: ["全部", "未申请", "待修改", "未审核", "未签名", "已完成", "已作废"],
  realName: ["全部", "是", "否"],
  medicineName: ["全部", "草酸艾司西酞普兰片", "感冒片", "感冒灵胶囊"],
  consultNo: ["全部", "XXXXXX"]
};

const weekLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const calendars = computed(() => {
  const first = monthStart(calendarStartMonth.value);
  const second = addMonths(first, 1);
  return [first, second].map((month) => ({
    key: `${month.getFullYear()}-${month.getMonth()}`,
    year: month.getFullYear(),
    monthLabel: monthLabels[month.getMonth()],
    days: buildCalendarDays(month)
  }));
});

const selectedStartLabel = computed(() => selectedStartDate.value ? formatDateLabel(selectedStartDate.value) : "开始日期时间");
const selectedEndLabel = computed(() => selectedEndDate.value ? formatDateLabel(selectedEndDate.value) : "结束日期时间");

function monthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date, amount) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date) {
  return dateKey(date);
}

function buildCalendarDays(month) {
  const firstDay = monthStart(month);
  const firstGridDay = addDays(firstDay, -firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(firstGridDay, index);
    return {
      key: dateKey(date),
      day: date.getDate(),
      date,
      time: date.getTime(),
      isCurrentMonth: date.getMonth() === month.getMonth()
    };
  });
}

function isSameDate(a, b) {
  return Boolean(a && b && dateKey(a) === dateKey(b));
}

function normalizedRange() {
  if (!selectedStartDate.value || !selectedEndDate.value) return null;
  const start = selectedStartDate.value.getTime() <= selectedEndDate.value.getTime()
    ? selectedStartDate.value
    : selectedEndDate.value;
  const end = start === selectedStartDate.value ? selectedEndDate.value : selectedStartDate.value;
  return { start, end };
}

function selectDate(cell) {
  const date = new Date(cell.date);
  if (!selectedStartDate.value || selectedEndDate.value) {
    selectedStartDate.value = date;
    selectedEndDate.value = null;
    return;
  }
  if (date.getTime() < selectedStartDate.value.getTime()) {
    selectedEndDate.value = selectedStartDate.value;
    selectedStartDate.value = date;
  } else {
    selectedEndDate.value = date;
  }
}

function dateCellClass(cell) {
  const range = normalizedRange();
  const isStart = isSameDate(cell.date, selectedStartDate.value);
  const isEnd = isSameDate(cell.date, selectedEndDate.value);
  const isInRange = range && cell.time > range.start.getTime() && cell.time < range.end.getTime();
  return {
    "is-muted": !cell.isCurrentMonth,
    "is-picked": isStart || isEnd,
    "is-range-start": isStart && selectedEndDate.value,
    "is-range-end": isEnd,
    "is-in-range": isInRange
  };
}

function shiftCalendar(amount) {
  calendarStartMonth.value = addMonths(calendarStartMonth.value, amount);
}

function resetCalendar() {
  calendarStartMonth.value = new Date(2026, 5, 1);
}

function toggleSelect(key) {
  openSelectKey.value = openSelectKey.value === key ? "" : key;
}

function chooseSelect(key, option) {
  selectValues.value[key] = option;
  openSelectKey.value = "";
}

const records = [
  {
    id: 1,
    no: "XXXXXX",
    patient: "童童",
    age: "3岁",
    doctor: "XXX",
    clerk: "-",
    type: "图文问诊",
    typeTone: "text",
    status: "完成问诊",
    statusTone: "done",
    start: "18：05：30",
    end: "18：05：30",
    payment: "无",
    audit: "已完成",
    auditTone: "done",
    auditIcon: "✓",
    realName: "否",
    printable: true,
    more: true
  },
  {
    id: 2,
    no: "XXXXXX",
    patient: "-",
    age: "XXX",
    doctor: "XXX",
    clerk: "-",
    type: "视频问诊",
    typeTone: "video",
    status: "完成问诊",
    statusTone: "done",
    start: "18：05：30",
    end: "18：05：30",
    payment: "无",
    audit: "未签名",
    auditTone: "unsigned",
    auditIcon: "−",
    realName: "否",
    printable: true,
    more: true
  },
  {
    id: 3,
    no: "XXXXXX",
    patient: "-",
    age: "XXX",
    doctor: "XXX",
    clerk: "-",
    type: "图文问诊",
    typeTone: "text",
    status: "取消问诊",
    statusTone: "cancelled",
    start: "18：05：30",
    end: "18：05：30",
    payment: "无",
    audit: "-",
    auditTone: "none",
    auditIcon: "",
    realName: "否",
    printable: false,
    more: false
  },
  {
    id: 4,
    no: "XXXXXX",
    patient: "XXX",
    age: "XXX",
    doctor: "XXX",
    clerk: "-",
    type: "图文问诊",
    typeTone: "text",
    status: "完成问诊",
    statusTone: "done",
    start: "18：05：30",
    end: "18：05：30",
    payment: "无",
    audit: "已作废",
    auditTone: "void",
    auditIcon: "×",
    realName: "否",
    printable: true,
    more: true
  },
  {
    id: 5,
    no: "XXXXXX",
    patient: "-",
    age: "XXX",
    doctor: "XXX",
    clerk: "-",
    type: "视频问诊",
    typeTone: "video",
    status: "完成问诊",
    statusTone: "done",
    start: "18：05：30",
    end: "18：05：30",
    payment: "无",
    audit: "未签名",
    auditTone: "unsigned",
    auditIcon: "−",
    realName: "否",
    printable: true,
    more: true
  },
  {
    id: 6,
    no: "XXXXXX",
    patient: "童童",
    age: "3岁",
    doctor: "XXX",
    clerk: "-",
    type: "图文问诊",
    typeTone: "text",
    status: "完成问诊",
    statusTone: "done",
    start: "18：05：30",
    end: "18：05：30",
    payment: "无",
    audit: "已完成",
    auditTone: "done",
    auditIcon: "✓",
    realName: "否",
    printable: true,
    more: false
  }
];
</script>

<style scoped>
.records-page {
  min-height: 100vh;
  min-width: 1440px;
  color: var(--jh-color-text, #1f2933);
  background: var(--jh-color-bg-page, #f5f6f8);
}

.records-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 24px;
  background: var(--jh-color-bg-surface, #fff);
  border-bottom: 1px solid var(--jh-color-border, #e5e8eb);
  box-shadow: 0 4px 14px rgb(31 41 51 / 5%);
}

.back-button img {
  width: 16px;
  height: 16px;
}

.records-topbar__right {
  display: flex;
  align-items: center;
  gap: 24px;
  color: #4a5563;
  font-size: 16px;
}

.records-topbar__divider {
  width: 1px;
  height: 26px;
  background: #dfe3e8;
}

.records-topbar__store {
  white-space: nowrap;
}

.records-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  height: 78px;
  background: #fff;
}

.records-nav button {
  position: relative;
  height: 100%;
  padding: 0;
  border: 0;
  color: #121820;
  font: inherit;
  font-size: 16px;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
}

.records-nav button.is-active::after {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 64px;
  height: 4px;
  border-radius: 999px 999px 0 0;
  background: var(--jh-color-primary, #1478ff);
  content: "";
  transform: translateX(-50%);
}

.records-main {
  width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.records-filter-card,
.records-table-card {
  width: 100%;
  background: #fff;
  border-radius: 14px;
}

.records-filter-card {
  padding: 22px 24px 20px;
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.filter-field {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.filter-field--date {
  grid-column: span 2;
}

.filter-label {
  flex: 0 0 72px;
  color: #121820;
  font-size: 16px;
  line-height: 44px;
  white-space: nowrap;
}

.filter-field input,
.select-control,
.date-range-control {
  display: flex;
  align-items: center;
  width: 157px;
  flex: 0 0 157px;
  height: 44px;
  border: 1px solid #d8dde1;
  border-radius: 5px;
  color: #111820;
  font: inherit;
  font-size: 16px;
  background: #fff;
  outline: none;
}

.filter-field input {
  min-width: 0;
  padding: 0 16px;
}

.filter-field--date .date-range-control {
  width: 405px;
  flex-basis: 405px;
}

.filter-field input::placeholder,
.date-range-control span:first-child,
.date-range-control span:nth-child(3) {
  color: #9aa3ad;
}

.date-range-control span.has-value {
  color: #111820;
}

.select-control {
  position: relative;
  justify-content: space-between;
  padding: 0 16px;
  cursor: pointer;
}

.select-control.is-active {
  border-color: #1478ff;
  box-shadow: 0 0 0 1px rgb(20 120 255 / 12%);
}

.select-control:hover,
.filter-field input:hover,
.date-range-control:hover {
  border-color: #111820;
}

.filter-field input:focus,
.date-range-control.is-active {
  border-color: #1478ff;
  box-shadow: 0 0 0 1px rgb(20 120 255 / 14%);
}

.select-control span,
.ghost-action span {
  display: inline-block;
  margin-left: 10px;
  color: #0f1720;
  font-size: 18px;
  transition: transform 0.16s ease;
}

.select-control.is-active span {
  transform: rotate(180deg);
}

.select-popover {
  position: absolute;
  top: 50px;
  left: 84px;
  z-index: 7;
  width: 157px;
  padding: 12px 0;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 10px 22px rgb(15 23 42 / 12%);
}

.select-popover--tall {
  padding: 12px 0 14px;
}

.select-popover button {
  display: block;
  width: 100%;
  height: 42px;
  padding: 0 22px;
  border: 0;
  color: #606872;
  font: inherit;
  font-size: 16px;
  line-height: 42px;
  text-align: left;
  background: #fff;
  cursor: pointer;
}

.select-popover button:hover,
.select-popover button.is-selected {
  color: #1478ff;
}

.date-range-control {
  justify-content: space-between;
  padding: 0 16px;
  cursor: pointer;
}

.date-range-control:disabled,
.select-control:disabled,
.filter-field input:disabled {
  color: #b9c0c8;
  cursor: not-allowed;
  background: #f6f7f8;
  border-color: #e5e8eb;
}

.date-range-control b {
  color: #9aa3ad;
  font-weight: 400;
}

.calendar-icon {
  width: 18px;
  height: 18px;
  border: 2px solid #9aa3ad;
  border-top-width: 4px;
  border-radius: 2px;
  color: transparent;
}

.date-picker-popover {
  position: absolute;
  top: 52px;
  left: 84px;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  width: 490px;
  padding: 18px 26px 18px;
  border: 1px solid #e1e6eb;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 22px 46px rgb(15 23 42 / 26%), 0 6px 16px rgb(15 23 42 / 12%);
}

.date-picker-calendar {
  width: 193px;
  flex: 0 0 193px;
}

.date-picker-calendar + .date-picker-calendar {
  margin-left: 52px;
}

.date-picker-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.date-picker-popover button {
  border: 0;
  font: inherit;
  background: transparent;
  cursor: pointer;
}

.date-select {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 86px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #e5e8eb !important;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 12.6px;
  line-height: 20px;
}

.date-select span {
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 10.8px;
}

.date-controller {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.date-controller button {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 12.6px;
  line-height: 18px;
}

.date-controller button:hover {
  background: #f2f5f8;
}

.date-picker-week {
  display: grid;
  grid-template-columns: repeat(7, 26px);
  justify-content: space-between;
  column-gap: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12.6px;
  line-height: 18px;
  text-align: center;
}

.date-picker-grid {
  display: grid;
  grid-template-columns: repeat(7, 26px);
  justify-content: space-between;
  column-gap: 0;
  row-gap: 8px;
  padding: 12px 0 0;
}

.date-cell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 24px;
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.9);
  font-size: 12.6px;
  line-height: 18px;
}

.date-cell span {
  position: relative;
  z-index: 2;
}

.date-cell::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -5px;
  right: -5px;
  background: transparent;
  content: "";
}

.date-cell:hover span {
  color: #006ef9;
}

.date-cell.is-muted {
  color: #99a4b1;
}

.date-cell.is-in-range::before,
.date-cell.is-range-start::before,
.date-cell.is-range-end::before {
  background: #d1e5fe;
}

.date-cell.is-range-start::before {
  left: 0;
  border-radius: 3px 0 0 3px;
}

.date-cell.is-range-end::before {
  right: 0;
  border-radius: 0 3px 3px 0;
}

.date-cell.is-picked span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 24px;
  border-radius: 3px;
  color: #fff;
  background: #006ef9;
}

.filter-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.batch-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
}

.batch-actions__left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.ghost-action,
.history-action {
  height: 44px;
  border: 1px solid #d8dde1;
  border-radius: 5px;
  color: #1478ff;
  font: inherit;
  font-size: 16px;
  background: #fff;
  cursor: pointer;
}

.ghost-action {
  min-width: 110px;
}

.history-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 126px;
  color: #606872;
}

.history-action:hover {
  border-color: #1478ff;
  color: #1478ff;
}

.history-action:hover span {
  background: #1478ff;
}

.history-action span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 8px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  background: #6b7178;
}

.history-wrap {
  position: relative;
}

.history-tooltip {
  position: absolute;
  right: 0;
  bottom: 54px;
  z-index: 8;
  display: none;
  width: 224px;
  padding: 20px 22px;
  border-radius: 2px;
  color: #3c4449;
  font-size: 16px;
  line-height: 1.7;
  text-align: left;
  background: #fff;
  box-shadow: 0 10px 26px rgb(15 23 42 / 12%);
}

.history-wrap:hover .history-tooltip {
  display: block;
}

.records-table-card {
  margin-top: 24px;
  overflow: hidden;
}

.records-table-wrap {
  width: 100%;
  overflow: hidden;
}

.records-table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
}

.records-table th,
.records-table td {
  height: 56px;
  padding: 0 8px;
  border-bottom: 1px solid #edf0f2;
  color: #111820;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.records-table th {
  font-weight: 500;
  background: #fff;
}

.records-table tbody tr:nth-child(even) td {
  background: #fcfcfc;
}

.records-table .operations {
  border-left: 4px solid #e5e8eb;
  text-align: left;
  padding-left: 24px;
}

.records-table .operations-title {
  border-left: 4px solid #e5e8eb;
  text-align: center;
  padding-left: 8px;
}

.fake-checkbox {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid #d8dde1;
  border-radius: 4px;
  background: #fff;
  vertical-align: middle;
}

.consult-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 14px;
}

.consult-type--text {
  color: #009080;
  background: #d1f0ec;
}

.consult-type--video {
  color: #4d72e8;
  background: #eef4ff;
}

.consult-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot--done {
  background: #29cc6a;
}

.status-dot--cancelled {
  background: #9aa6b6;
}

.audit-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 80px;
  height: 30px;
  justify-content: center;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 14px;
}

.audit-pill i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
  font-style: normal;
  font-size: 12px;
  line-height: 1;
}

.audit-pill--done {
  color: #009080;
  background: #e3f9e9;
}

.audit-pill--done i {
  background: #009080;
}

.audit-pill--unsigned {
  color: #e37318;
  background: #fff4e6;
}

.audit-pill--unsigned i {
  background: #e37318;
}

.audit-pill--void {
  color: #606872;
  background: #f4f4f4;
}

.audit-pill--void i {
  background: #9aa6b6;
}

.operations button {
  margin-right: 30px;
  padding: 0;
  border: 0;
  color: #1478ff;
  font: inherit;
  font-size: 14px;
  background: transparent;
  cursor: pointer;
}

.operations button span {
  margin-left: 6px;
}

.records-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  height: 88px;
  padding: 0 24px;
  color: #666f7a;
  font-size: 16px;
}

.page-size,
.page-number,
.page-nav {
  height: 38px;
  border: 1px solid #d8dde1;
  border-radius: 4px;
  color: #59636e;
  font: inherit;
  background: #fff;
  cursor: pointer;
}

.page-size {
  width: 126px;
  margin-right: 18px;
}

.page-size span {
  margin-left: 16px;
}

.page-number,
.page-nav {
  min-width: 38px;
}

.page-number.is-current {
  border-color: #1478ff;
  color: #fff;
  background: #1478ff;
}

.page-nav {
  border-color: transparent;
  color: #98a2ad;
  font-size: 24px;
}

.page-ellipsis {
  padding: 0 8px;
  color: #222;
}

.page-jump {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  padding: 0 12px;
  height: 38px;
  border-radius: 4px;
  background: #f1f2f4;
}

.page-jump input {
  width: 58px;
  height: 30px;
  border: 1px solid #d8dde1;
  border-radius: 3px;
  color: #59636e;
  font: inherit;
  text-align: center;
  background: #fff;
}

.col-check {
  width: 40px;
}

.col-consult-no {
  width: 92px;
}

.col-patient {
  width: 88px;
}

.col-age {
  width: 62px;
}

.col-doctor {
  width: 86px;
}

.col-clerk {
  width: 60px;
}

.col-type {
  width: 104px;
}

.col-status {
  width: 114px;
}

.col-time {
  width: 104px;
}

.col-payment {
  width: 86px;
}

.col-audit {
  width: 112px;
}

.col-realname {
  width: 86px;
}

.col-actions {
  width: 190px;
}
</style>
