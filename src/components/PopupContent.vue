<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, reactive, defineEmits, defineProps, watch, toRefs, computed } from 'vue';
import { createStyleString, parseRgb } from '~/services/content-service';

const emit = defineEmits<{
  (e: 'close',): void,
  (e: 'get-font-details',): void,
  (e: 'hide-popup-to-button',): void
}>();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  ping: {
    type: Boolean,
  },
  elementInfo: {
    type: Object,
    default() {
      return null
    }
  },
  hidePopup: {
    type: Boolean,
    default: false
  },
});

const { ping, elementInfo, hidePopup } = toRefs(props);

const details = ref<any>({});

const isLoading = ref<boolean>(false)

function getHexColor(rgb: string) {
  return parseRgb(rgb)
}
function close() {
  emit('close');
}

const isDetails = ref(false);

watch(ping, (newX) => {
  console.log(`PING  ${newX}`)
  isDetails.value = true;
  isLoading.value = true;
  details.value = { ...elementInfo.value };

  const loadingTimer = setTimeout(() => {
    isLoading.value = false;
    clearTimeout(loadingTimer)
  }, 600);
})

function onClear() {
  isDetails.value = false;
}

async function getStyleObject() {
  const styleEl = createStyleString(details.value);
  await copyValue(styleEl);
}

function hidePopupToShortButton() {
  emit('hide-popup-to-button');
}

function getFontDetails() {
  // TODO send in webworker info about font
  emit('get-font-details');
}

async function copyValue(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    console.log('copied')
  } catch (error) {
    console.log('failed to copy to clipboard. error=' + error);
  }
}

onMounted(() => {
})

</script>

<template>
  <div class="popup-content text-gray-800 shadow w-max h-min" p="x-2 y-2" m="y-auto r-2" v-show="show && !hidePopup">
    <div class="header">
      <button v-if="isDetails" class="button-default flex w-4 h-4 shadow cursor-pointer border-none"
        bg="teal-600 hover:teal-700" @click="onClear">
        CLEAR
      </button>
      <button @click="hidePopupToShortButton" class="icon-button flex rounded-full shadow cursor-pointer border-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#0d9488"
            d="m12.05 19l2.85-2.825l-2.85-2.825L11 14.4l1.075 1.075q-.7.025-1.362-.225t-1.188-.775q-.5-.5-.763-1.15t-.262-1.3q0-.425.113-.85t.312-.825l-1.1-1.1q-.425.625-.625 1.325T7 12q0 .95.375 1.875t1.1 1.65q.725.725 1.625 1.088t1.85.387l-.95.95zm4.125-4.25q.425-.625.625-1.325T17 12q0-.95-.363-1.888T15.55 8.45q-.725-.725-1.638-1.075t-1.862-.35L13 6.05L11.95 5L9.1 7.825l2.85 2.825L13 9.6l-1.1-1.1q.675 0 1.375.263t1.2.762q.5.5.763 1.15t.262 1.3q0 .425-.112.85t-.313.825zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22" />
        </svg>
      </button>
      <button class="popup-button-close flex w-4 h-4 rounded-full shadow cursor-pointer border-none"
        bg="teal-600 hover:teal-700" @click="close">
        X
      </button>
    </div>
    <div v-if="isDetails && !isLoading" class="popup-main">
      <div class="wrapper-information">
        <ul class="font-list">
          <li class="font-family-row">
            <span class="text font-family-name">
              {{ ` ${details['render-font-family'] || ''};` }}
            </span>
            <span class="text font-family-style">
              {{ ` ${details['render-font-style'] || ''};` }}
            </span>
          </li>
          <li>
            <svg class="icon-font-size" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
              <path fill="#ffffff" d="M6.1 2.75h3.09V4h1.25V1.5H.5V4h1.25V2.75h3.1v10.5H2.7v1.25h5.55v-1.25H6.1z">
              </path>
              <path fill="#ffffff"
                d="M12.4 6.75H8.06v2.5h1.25V8h1.84v5.25H9.63v1.25h4.3v-1.25H12.4V8h1.85v1.25h1.25v-2.5z">
              </path>
            </svg>
            <span class="text">
              {{ ` ${details['font-size'] || ''};` }}
            </span>
          </li>
          <li>
            <svg class="icon-line-height" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem"
              viewBox="0 0 24 24">
              <path fill="#ffffff"
                d="M16 11h-3V5.41l.79.8a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-2.5 2.5a1 1 0 0 0 1.42 1.42l.79-.8V11H8a1 1 0 0 0 0 2h3v5.59l-.79-.8a1 1 0 0 0-1.42 1.42l2.5 2.5a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l2.5-2.5a1 1 0 0 0-1.42-1.42l-.79.8V13h3a1 1 0 0 0 0-2" />
            </svg>
            <span class="text">
              {{ ` ${details['line-height'] || ''};` }}
            </span>
          </li>
          <li>
            <svg class="icon-font-weight" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem"
              viewBox="0 0 24 24">
              <path fill="#ffffff"
                d="M5.725 18.275Q5 17.55 5 16.5t.725-1.775l9-9Q15.45 5 16.5 5t1.775.725Q19 6.45 19 7.5t-.725 1.775l-9 9Q8.55 19 7.5 19t-1.775-.725" />
            </svg>
            <span class="text">
              {{ ` ${details['font-weight'] || ''}` }}
            </span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 56 56">
              <path fill="#ffffff" fill-rule="evenodd"
                d="M46.172 30.014H9.828l3.758 3.757a2 2 0 0 1-2.829 2.829l-7.07-7.071a2.036 2.036 0 0 1-.05-.052A1.995 1.995 0 0 1 3 28.014c0-.493.178-.945.474-1.293c.063-.088.134-.171.212-.25l7.071-7.07a2 2 0 1 1 2.829 2.828L9.8 26.014h36.398l-3.785-3.785a2 2 0 1 1 2.829-2.829l7.07 7.071c.08.079.15.162.213.25c.296.348.474.8.474 1.293c0 .578-.245 1.098-.637 1.463a2.036 2.036 0 0 1-.05.052l-7.07 7.07a2 2 0 1 1-2.829-2.828z" />
            </svg>
            <span class="text">
              {{ ` ${details['letter-spacing'] || ''};` }}
            </span>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 15 15">
              <path fill="#ffffff" fill-rule="evenodd"
                d="M5.675 3.5a.45.45 0 0 1 .45-.45h4.5a.45.45 0 1 1 0 .9h-1.62l-1.774 7.1h1.644a.45.45 0 0 1 0 .9h-4.5a.45.45 0 1 1 0-.9h1.619l1.775-7.1H6.125a.45.45 0 0 1-.45-.45"
                clip-rule="evenodd" />
            </svg>
            <span class="text">
              {{ ` ${details['font-style'] || ''};` }}
            </span>
          </li>
          <li class="wrapper-li">
            <span class="text">
              {{ `color: ${details['color'] || ''};` }}
            </span>
            <button class="icon-button flex rounded-full shadow cursor-pointer border-none"
              @click="() => copyValue(details['color'])">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path fill="#0d9488"
                  d="M6 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zM4 6a2 2 0 0 1 1-1.732V14.5A2.5 2.5 0 0 0 7.5 17h6.232A2 2 0 0 1 12 18H7.5A3.5 3.5 0 0 1 4 14.5z" />
              </svg>
            </button>
          </li>
          <li class="wrapper-li">
            <span class="text">
              {{ `Hex: ${details['color'] && getHexColor(details['color']) || ''};` }}
            </span>
            <button class="icon-button flex rounded-full shadow cursor-pointer border-none"
              @click="() => copyValue(details['color'] && getHexColor(details['color']) || '')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                <path fill="#0d9488"
                  d="M6 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2zM4 6a2 2 0 0 1 1-1.732V14.5A2.5 2.5 0 0 0 7.5 17h6.232A2 2 0 0 1 12 18H7.5A3.5 3.5 0 0 1 4 14.5z" />
              </svg>
            </button>
          </li>
        </ul>
        <div class="action-panels">
          <button class="button-default copy-style-button shadow cursor-pointer border-none" @click="getStyleObject"
            bg="teal-600 hover:teal-700">
            copy style
          </button>
          <button class="button-default  shadow cursor-pointer border-none" @click="getFontDetails"
            bg="teal-600 hover:teal-700">
            font details
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="loader">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <circle cx="12" cy="2" r="0" fill="#ffd060">
          <animate attributeName="r" begin="0" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(45 12 12)">
          <animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(90 12 12)">
          <animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(135 12 12)">
          <animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(180 12 12)">
          <animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(225 12 12)">
          <animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(270 12 12)">
          <animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
        <circle cx="12" cy="2" r="0" fill="#ffd060" transform="rotate(315 12 12)">
          <animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
        </circle>
      </svg>
    </div>
    <div v-if="!isLoading && !isDetails" class="start-screen">
      <span class="start-screen-title text">Select text</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
        <g fill="#ffd060">
          <path
            d="M8.55 10.55a1 1 0 1 1-2 0a1 1 0 0 1 2 0m2 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m3 0a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
          <path fill-rule="evenodd"
            d="M16.207 4.893a8.001 8.001 0 0 1 .662 10.565c.016.013.03.027.045.042l4.243 4.243a1 1 0 0 1-1.414 1.414L15.5 16.914a.933.933 0 0 1-.042-.045A8.001 8.001 0 0 1 4.893 4.893a8 8 0 0 1 11.314 0m-9.9 9.9a6 6 0 1 0 8.486-8.485a6 6 0 0 0-8.485 8.485"
            clip-rule="evenodd" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style>
.popup-content {
  pointer-events: all !important;
  position: fixed;
  top: 5px;
  right: 5px;
  width: 225px;
  height: 300px;
  background-color: #363636;
  -webkit-box-shadow: 1px 1px 5px 1px #ffffff57;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  border: none;
  border-radius: 5px;
  opacity: 0.95;
  z-index: 2147483645;
}

.popup-content .header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-button-close {
  margin-left: auto;
  pointer-events: all !important;
  justify-content: center;
  align-items: center;
}

.popup-content .text {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  font-style: normal;
}

.popup-content .wrapper-information {
  width: 100%;
}

.popup-content .wrapper-information .font-list {
  padding: 0;
  width: 100%;
  list-style: none;
  text-decoration: none;
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
  margin-bottom: 10px;
}

.popup-content .wrapper-information .font-list li {
  text-decoration: none;
  list-style: none;
  width: 100%;
  margin-bottom: 5px;
}

.popup-content .wrapper-information .font-list li svg {
  margin-right: 10px;
}

.font-family-row {
  margin-bottom: 10px;
}

.popup-content .wrapper-information .font-family-name {
  color: #ffd060;
  font-weight: 700;
  margin-right: 5px;
}

.loader {
  width: 50px;
  height: 50px;
  position: absolute;
  left: 53%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.6;
}

.start-screen {
  width: 71px;
  height: 50px;
  position: absolute;
  left: 53%;
  top: 45%;
  transform: translate(-50%, -50%);
  opacity: .6;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.start-screen-title {
  margin-bottom: 5px;
}

.wrapper-li {
  display: flex;
  align-items: center;
  width: 100%;
}

.button-default {
  display: flex;
  width: auto !important;
  pointer-events: all !important;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  color: #0a0a0a;
  font-size: 12px;
}

.icon-button {
  margin-left: auto;
  width: max-content;
  height: auto;
  background: none;
}

.action-panels {
  display: flex;
}

.action-panels .copy-style-button {
  margin-right: 10px;
}

</style>
