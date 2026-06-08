<template>
  <div class="records-page">
    <header class="records-page__topbar">
      <Button variant="neutral" size="md" icon @click="router.push('/')">
        <img :src="assetUrl('assets/figma-consult/back.svg')" alt="" />
        <span>返回首页</span>
      </Button>
      <div class="records-page__topbar-right">
        <Button variant="primary" size="md">在线客服</Button>
        <span class="records-page__store">大王测试药店01</span>
      </div>
    </header>

    <main class="records-page__main">
      <Card title="问诊记录" compact>
        <div class="room-empty">
          <img class="room-empty__icon" :src="assetUrl('assets/room-empty.svg')" alt="" aria-hidden="true" />
          <div class="room-empty__copy">
            <h2>暂无问诊记录</h2>
            <p>完成快速问诊后，记录将显示在这里</p>
          </div>
        </div>
      </Card>
    </main>
  </div>
</template>

<script setup>
import { Button, Card, assetUrl } from "@jiahong/ui";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped>
.records-page {
  min-height: 100vh;
  background: var(--jh-color-bg-page);
}

.records-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--jh-space-lg, 24px);
  background: var(--jh-color-bg-surface);
  border-bottom: 1px solid var(--jh-color-border);
}

.records-page__topbar-right {
  display: flex;
  align-items: center;
  gap: var(--jh-space-md, 16px);
}

.records-page__store {
  color: var(--jh-color-text);
  font-size: 14px;
}

.records-page__main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--jh-space-lg, 24px);
}
</style>
