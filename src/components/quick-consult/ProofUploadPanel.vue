<template>
  <div class="proof-upload">
    <p class="proof-upload__subtitle">上传补充材料（2选1）</p>
    <FormFieldError v-if="error" class="proof-upload__error" :message="error" />

    <div
      class="proof-upload__btn-wrap"
      @mouseenter="hoverTarget = 'voice'"
      @mouseleave="hoverTarget = null"
    >
      <button
        :class="['proof-upload__btn', { 'is-active': proofVoice }]"
        type="button"
        @click="openVoiceDialog"
      >
        <img class="proof-upload__btn-icon" :src="voiceIcon" alt="" aria-hidden="true" />
        <span>上传 语音凭证</span>
      </button>
      <Transition name="proof-upload-tooltip">
        <div v-if="hoverTarget === 'voice'" class="proof-upload__tooltip" role="tooltip">
          <span class="proof-upload__tooltip-arrow" aria-hidden="true"></span>
          <p>{{ tooltipText }}</p>
        </div>
      </Transition>
    </div>

    <div class="proof-upload__image-group">
      <div
        class="proof-upload__btn-wrap"
        @mouseenter="hoverTarget = 'image'"
        @mouseleave="hoverTarget = null"
      >
        <button
          :class="['proof-upload__btn', { 'is-active': proofImages.length > 0 }]"
          type="button"
          @click="openImagePicker"
        >
          <img class="proof-upload__btn-icon" :src="picIcon" alt="" aria-hidden="true" />
          <span>上传 图片凭证</span>
        </button>
        <Transition name="proof-upload-tooltip">
          <div v-if="hoverTarget === 'image'" class="proof-upload__tooltip" role="tooltip">
            <span class="proof-upload__tooltip-arrow" aria-hidden="true"></span>
            <p>{{ tooltipText }}</p>
          </div>
        </Transition>
      </div>
      <button class="proof-upload__example-link" type="button" @click="showExamplePreview = !showExamplePreview">
        示例图片
      </button>
    </div>

    <div v-if="proofVoice || proofImages.length" class="proof-upload__attachments">
      <div v-if="proofVoice" class="proof-upload__voice-row">
        <div class="proof-upload__voice-chip" aria-label="语音凭证">
          <img class="proof-upload__voice-wave" :src="voiceWaveformMini" alt="" aria-hidden="true" />
          <span class="proof-upload__voice-duration">{{ formatVoiceDuration(proofVoice.duration) }}</span>
        </div>
        <button class="proof-upload__voice-remove" type="button" aria-label="移除语音凭证" @click="emit('remove-voice')">
          <img :src="voiceCloseSmall" alt="" aria-hidden="true" />
        </button>
      </div>

      <div v-if="proofImages.length" class="proof-upload__examples" aria-label="图片凭证">
        <div
          v-for="image in proofImages"
          :key="image.id"
          class="proof-upload__example-cell proof-upload__example-cell--preview"
        >
          <button
            class="proof-upload__example-thumb proof-upload__example-thumb--preview"
            type="button"
            :aria-label="`移除${image.name}`"
            @click="emit('remove-image', image.id)"
          >
            <img :src="image.url" :alt="image.name" />
            <span class="proof-upload__example-remove" aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="showExamplePreview" class="proof-upload__examples proof-upload__examples--demo" aria-label="示例图片">
      <div v-for="index in 5" :key="index" class="proof-upload__example-cell">
        <span class="proof-upload__example-thumb" aria-hidden="true"></span>
      </div>
    </div>

    <VoiceProofDialog :visible="showVoiceDialog" @close="showVoiceDialog = false" @confirm="handleVoiceConfirm" />

    <input ref="imageInputRef" type="file" accept="image/jpeg,image/png" multiple hidden @change="handleImageFiles" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FormFieldError from "@/components/quick-consult/FormFieldError.vue";
import VoiceProofDialog from "@/components/quick-consult/VoiceProofDialog.vue";
import voiceIcon from "@/assets/figma-proof-upload/voice.svg";
import picIcon from "@/assets/figma-proof-upload/pic.svg";
import voiceWaveformMini from "@/assets/figma-proof-upload/voice-waveform-mini.svg";
import voiceCloseSmall from "@/assets/figma-proof-upload/voice-close-small.svg";

const tooltipText =
  "支持上传线下就诊历史处方、门诊病历、出院记录等。最多上传5张；支持jpg、png格式，单张大小不超过5M。";

const props = defineProps({
  proofVoice: {
    type: Object,
    default: null
  },
  proofImages: {
    type: Array,
    default: () => []
  },
  maxImages: {
    type: Number,
    default: 5
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024
  },
  error: {
    type: String,
    default: ""
  }
});

const emit = defineEmits(["select-voice", "select-images", "remove-voice", "remove-image"]);

const imageInputRef = ref(null);
const hoverTarget = ref(null);
const showExamplePreview = ref(false);
const showVoiceDialog = ref(false);

function openVoiceDialog() {
  showVoiceDialog.value = true;
}

function openImagePicker() {
  showExamplePreview.value = false;
  imageInputRef.value?.click();
}

function handleVoiceConfirm(payload) {
  emit("select-voice", payload);
  showVoiceDialog.value = false;
}

function formatVoiceDuration(duration) {
  const seconds = Math.max(1, Math.round(duration || 0));
  return `${seconds}"`;
}

function handleImageFiles(event) {
  const availableCount = props.maxImages - props.proofImages.length;
  const selectedFiles = Array.from(event.target.files || [])
    .filter((file) => ["image/jpeg", "image/png"].includes(file.type) && file.size <= props.maxFileSize)
    .slice(0, availableCount);
  event.target.value = "";
  if (!selectedFiles.length) return;
  emit("select-images", selectedFiles);
}
</script>

<style scoped>
.proof-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: 128px;
}

.proof-upload__subtitle {
  margin: 0;
  width: 100%;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  opacity: 0.8;
}

.proof-upload__error {
  margin-top: -4px;
}

.proof-upload__btn-wrap {
  position: relative;
  align-self: flex-start;
}

.proof-upload__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 4px 12px;
  border: 1px solid #e5e8eb;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.4);
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  background: linear-gradient(270deg, #fcfcfc 0%, #f8f8f9 100%);
  cursor: pointer;
}

.proof-upload__btn.is-active {
  border-color: #006ef9;
  color: rgba(0, 0, 0, 0.6);
  background: #f5f9ff;
}

.proof-upload__btn-icon {
  display: block;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
}

.proof-upload__image-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.proof-upload__example-link {
  padding: 0;
  border: 0;
  color: #006ef9;
  font-family: inherit;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  text-align: left;
  background: transparent;
  cursor: pointer;
}

.proof-upload__attachments {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
}

.proof-upload__voice-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.proof-upload__voice-chip {
  display: flex;
  gap: 9px;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 32px;
  border-radius: 10px;
  background: #f8f8f9;
}

.proof-upload__voice-wave {
  display: block;
  width: 35.293px;
  height: 20px;
}

.proof-upload__voice-duration {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}

.proof-upload__voice-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 7.351px;
  border: 0;
  border-radius: 16px;
  background: #f2f3f4;
  cursor: pointer;
}

.proof-upload__voice-remove img {
  display: block;
  width: 18px;
  height: 18px;
}

.proof-upload__examples {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 128px;
}

.proof-upload__examples--demo {
  grid-template-rows: repeat(2, 1fr);
  height: 84px;
}

.proof-upload__example-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  padding: 6px;
  border-radius: 2.414px;
  background: #f8f8f9;
}

.proof-upload__example-thumb {
  display: block;
  flex: 0 0 auto;
  width: 33.795px;
  height: 33.795px;
  border: 0.644px solid #d8dde1;
  border-radius: 1.207px;
  background: #fcfcfc;
}

.proof-upload__example-thumb--preview {
  position: relative;
  overflow: hidden;
  padding: 0;
  border: 0.644px solid #d8dde1;
  background: #fcfcfc;
  cursor: pointer;
}

.proof-upload__example-remove {
  position: absolute;
  top: 1px;
  right: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  line-height: 1;
  background: rgba(0, 0, 0, 0.55);
}

.proof-upload__example-thumb--preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.proof-upload__tooltip {
  position: absolute;
  z-index: 20;
  top: 50%;
  left: calc(100% + 8px);
  display: flex;
  align-items: center;
  width: 185px;
  filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.05)) drop-shadow(0 8px 5px rgba(0, 0, 0, 0.06))
    drop-shadow(0 5px 2.5px rgba(0, 0, 0, 0.1));
  transform: translateY(-50%);
  pointer-events: none;
}

.proof-upload__tooltip p {
  flex: 1;
  margin: 0;
  padding: 4px 8px;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  background: rgba(0, 0, 0, 0.9);
}

.proof-upload__tooltip-arrow {
  flex: 0 0 6px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 6px solid rgba(0, 0, 0, 0.9);
  border-bottom: 5px solid transparent;
}

.proof-upload-tooltip-enter-active,
.proof-upload-tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.proof-upload-tooltip-enter-from,
.proof-upload-tooltip-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(-4px);
}
</style>
