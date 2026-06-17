<template>
  <div class="new-product-page">
    <header class="new-product-topbar">
      <div class="new-product-topbar__inner">
        <span class="account-tip">🔊 您的账号将于<span>2027-05-26</span>到期，剩余<span>351</span>天（单体）</span>
        <div class="topbar-actions">
          <Button variant="primary" size="md">在线客服</Button>
          <span>下载 APP 问诊</span>
          <span>任务中心<i class="chevron-down" aria-hidden="true"></i></span>
          <span>大王测试药店01<i class="chevron-down" aria-hidden="true"></i></span>
        </div>
      </div>
    </header>

    <nav class="new-product-nav" aria-label="主导航">
      <button type="button" @click="router.push('/')">首页</button>
      <button type="button">问诊医生</button>
      <button type="button">审方药师</button>
      <button type="button" @click="router.push('/records')">问诊记录</button>
      <button type="button">预开方订单</button>
      <button type="button">处方药登记</button>
      <button class="is-active" type="button">新品登记</button>
      <button type="button">咨询视频</button>
      <button type="button">优医专区</button>
      <button type="button">医生招聘</button>
    </nav>

    <main class="new-product-main">
      <section class="query-panel">
        <div class="query-tabs">
          <button class="is-active" type="button">新品登记</button>
          <button type="button">药品信息查询</button>
        </div>
        <div class="query-form">
          <label>
            <span>提交日期</span>
            <input type="text" placeholder="请选择日期" />
          </label>
          <label>
            <span>药品名称</span>
            <input type="text" placeholder="输入药品名称查询" />
          </label>
          <label>
            <span>药品规格</span>
            <input type="text" placeholder="输入药品规格查询" />
          </label>
          <Button variant="primary" size="md">查询</Button>
          <Button variant="primary" size="md">新增</Button>
        </div>
      </section>

      <section class="product-table-panel">
        <table class="product-table">
          <thead>
            <tr>
              <th>药品名称</th>
              <th>药品规格</th>
              <th>生产厂家</th>
              <th>批准文号</th>
              <th>外包装</th>
              <th>说明书</th>
              <th>提交时间</th>
              <th>入库状态</th>
              <th>审核意见</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>测试</td>
              <td>100mg*8袋</td>
              <td>测试</td>
              <td>-</td>
              <td><a href="#" @click.prevent>查看</a></td>
              <td>-</td>
              <td>2024-01-03</td>
              <td>合格</td>
              <td>测试专用，无效</td>
              <td><a href="#" @click.prevent>删除</a></td>
            </tr>
          </tbody>
        </table>
        <footer class="table-pagination">
          <span>共 1 条</span>
          <button type="button">‹</button>
          <button class="is-current" type="button">1</button>
          <button type="button">›</button>
        </footer>
      </section>
    </main>
  </div>
</template>

<script setup>
import { Button } from "@jiahong/ui";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped>
.new-product-page {
  min-height: var(--jh-viewport-height, 100vh);
  color: var(--jh-color-text);
  background: var(--jh-color-bg-page);
}

.new-product-topbar {
  height: 44px;
  background: #f3f5f6;
}

.new-product-topbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 48px;
  color: #697383;
  font-size: 14px;
}

.account-tip span {
  color: #e23d3d;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.topbar-actions .chevron-down {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-left: 6px;
  border-right: 1.4px solid currentColor;
  border-bottom: 1.4px solid currentColor;
  transform: translateY(-2px) rotate(45deg);
}

.new-product-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 42px;
  height: 92px;
  background: #fff;
}

.new-product-nav button {
  position: relative;
  height: 100%;
  border: 0;
  color: #1f2933;
  font: inherit;
  font-size: 16px;
  background: transparent;
  cursor: pointer;
}

.new-product-nav button.is-active::after {
  position: absolute;
  left: 50%;
  bottom: 22px;
  width: 56px;
  height: 4px;
  background: var(--jh-color-primary);
  content: "";
  transform: translateX(-50%);
}

.new-product-main {
  background: #f5f7fa;
}

.query-panel {
  background: #fff;
  border-bottom: 1px solid #e5e8eb;
}

.query-tabs {
  display: flex;
  max-width: 1440px;
  margin: 0 auto;
  padding-top: 28px;
}

.query-tabs button {
  min-width: 126px;
  height: 48px;
  border: 1px solid #d8dde1;
  border-bottom: 0;
  color: #3c4449;
  font: inherit;
  font-size: 16px;
  background: #fff;
  cursor: pointer;
}

.query-tabs button + button {
  margin-left: -1px;
}

.query-tabs button.is-active {
  background: #fff;
}

.query-tabs button:not(.is-active) {
  background: #f8f9fb;
}

.query-form {
  display: flex;
  align-items: center;
  gap: 30px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 0 44px;
  border-top: 1px solid #e5e8eb;
}

.query-form label {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3c4449;
  font-size: 16px;
  white-space: nowrap;
}

.query-form label span {
  flex: 0 0 auto;
}

.query-form input {
  width: 220px;
  flex: 0 0 auto;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #d8dde1;
  border-radius: 2px;
  color: #3c4449;
  font: inherit;
  font-size: 14px;
  outline: none;
}

.query-form input::placeholder {
  color: #b6bec2;
}

.product-table-panel {
  max-width: 1440px;
  margin: 0 auto;
  padding: 34px 0;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.product-table th,
.product-table td {
  padding: 22px 14px;
  color: #1f2933;
  font-size: 15px;
  line-height: 22px;
  text-align: left;
}

.product-table th {
  font-weight: 400;
  background: #f3f5f6;
}

.product-table td {
  border-bottom: 1px solid #e5e8eb;
}

.product-table a {
  color: var(--jh-color-primary);
  text-decoration: none;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 18px 8px 0;
  color: #3c4449;
  font-size: 14px;
}

.table-pagination button {
  border: 0;
  color: #b6bec2;
  background: transparent;
  cursor: pointer;
}

.table-pagination button.is-current {
  color: var(--jh-color-primary);
}
</style>
