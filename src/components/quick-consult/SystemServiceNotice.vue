<template>
  <Teleport to="body">
    <Transition name="system-service-notice">
      <article v-if="message" class="system-service-notice" role="alert">
        <span class="system-service-notice__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="#E37318" />
            <path d="M8 4.5V8.5M8 11H8.01" stroke="#fff" stroke-width="1.4" stroke-linecap="round" />
          </svg>
        </span>
        <p class="system-service-notice__text">{{ message }}</p>
      </article>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ""
  }
});
</script>

<style scoped>
.system-service-notice {
  position: fixed;
  top: 64px;
  left: 50%;
  z-index: 3150;
  display: flex;
  gap: 8px;
  align-items: center;
  max-width: min(420px, calc(100vw - 48px));
  padding: 10px 16px;
  border-radius: 2px;
  background: #fff;
  box-shadow:
    0 16px 40px -16px rgba(16, 42, 67, 0.24),
    0 4px 8px -2px rgba(16, 42, 67, 0.08);
  transform: translateX(-50%);
}

.system-service-notice__icon {
  display: inline-flex;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
}

.system-service-notice__icon svg {
  display: block;
  width: 16px;
  height: 16px;
}

.system-service-notice__text {
  margin: 0;
  color: #e37318;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.system-service-notice-enter-active,
.system-service-notice-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.system-service-notice-enter-from,
.system-service-notice-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
