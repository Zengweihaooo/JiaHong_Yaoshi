<template>
  <Teleport to="body">
    <div class="top-form-notice-stack" aria-live="polite">
      <TransitionGroup name="top-form-notice" tag="div" class="top-form-notice-stack__list">
        <article
          v-for="notice in notices"
          :key="notice.id"
          :class="['top-form-notice', `top-form-notice--${notice.variant}`]"
          role="alert"
        >
          <span class="top-form-notice__icon" aria-hidden="true">
            <svg v-if="notice.variant === 'warning'" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#E37318" />
              <path d="M8 4.5V8.5M8 11H8.01" stroke="#fff" stroke-width="1.4" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#CB2C2C" />
              <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round" />
            </svg>
          </span>
          <p class="top-form-notice__text">{{ notice.message }}</p>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  notices: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.top-form-notice-stack {
  position: fixed;
  top: 71px;
  left: 50%;
  z-index: 3200;
  width: max-content;
  max-width: min(420px, calc(100vw - 48px));
  transform: translateX(-50%);
  pointer-events: none;
}

.top-form-notice-stack__list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  align-items: center;
}

.top-form-notice {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 40px;
  padding: 10px 16px;
  border-radius: 2px;
  background: #fff;
  box-shadow:
    0 16px 40px -16px rgba(16, 42, 67, 0.24),
    0 4px 8px -2px rgba(16, 42, 67, 0.08);
}

.top-form-notice__icon {
  display: inline-flex;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
}

.top-form-notice__icon svg {
  display: block;
  width: 16px;
  height: 16px;
}

.top-form-notice__text {
  margin: 0;
  overflow: hidden;
  font-size: 12px;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-form-notice--warning .top-form-notice__text {
  color: #e37318;
}

.top-form-notice--error .top-form-notice__text {
  color: #cb2c2c;
}

.top-form-notice-enter-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.top-form-notice-leave-active {
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.top-form-notice-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.top-form-notice-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}

.top-form-notice-move {
  transition: transform 0.28s ease;
}
</style>
