<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, reactive, defineProps } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    default() {
      return {left: 0, top: 0}
    }
  },
  visible: {
    type: String,
    default: 'none'
  },
  controlButton: {
    type: String,
    default: ''
  },
  elementInfo: {
    type: Object,
    default() {
      return null
    }
  },
});

// const { visible, elementInfo } = toRefs(props);

</script>

<template>
  <div class="tooltip-fontio" :style="`display: ${visible};left: ${position.left}px; top: ${position.top}px`">
    <p class='font-info'> {{ `${elementInfo && elementInfo['render-font-family']}` }} </p>
    <div class="tooltip-wrapper-information">
      <svg class="icon-font-size" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
        <path fill="currentColor" d="M6.1 2.75h3.09V4h1.25V1.5H.5V4h1.25V2.75h3.1v10.5H2.7v1.25h5.55v-1.25H6.1z">
        </path>
        <path fill="currentColor"
          d="M12.4 6.75H8.06v2.5h1.25V8h1.84v5.25H9.63v1.25h4.3v-1.25H12.4V8h1.85v1.25h1.25v-2.5z"></path>
      </svg>
      <span>
        {{ ` ${elementInfo && elementInfo['font-size']};` }}
      </span>
      <svg class="icon-line-height" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M16 11h-3V5.41l.79.8a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-2.5 2.5a1 1 0 0 0 1.42 1.42l.79-.8V11H8a1 1 0 0 0 0 2h3v5.59l-.79-.8a1 1 0 0 0-1.42 1.42l2.5 2.5a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l2.5-2.5a1 1 0 0 0-1.42-1.42l-.79.8V13h3a1 1 0 0 0 0-2" />
      </svg>
      <span>
        {{ ` ${elementInfo && elementInfo['line-height']};` }}
      </span>
      <svg class="icon-font-weight" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
        <path fill="currentColor"
          d="M5.725 18.275Q5 17.55 5 16.5t.725-1.775l9-9Q15.45 5 16.5 5t1.775.725Q19 6.45 19 7.5t-.725 1.775l-9 9Q8.55 19 7.5 19t-1.775-.725" />
      </svg>
      <span>
        {{ ` ${elementInfo && elementInfo['font-weight']}` }}
      </span>
    </div>
    <p class='system-info'> {{ `click button ${controlButton} to inspect` }} </p>
  </div>
</template>

<style>
.tooltip-fontio {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  position: absolute;
  width: 250px;
  color: #ffffff;
  font-size: 14px;
  background-color: #363636;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 5px 1px #ffffff57;
  z-index: 10000;
}

.tooltip-fontio p {
  margin: 0;
  line-height: 1.2;
}

.tooltip-wrapper-information {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-bottom: 5px;
}

.tooltip-wrapper-information span {
  margin-right: 5px;
}

p.font-info {
  width: 100%;
  color: #ffd060;
  font-weight: 700;
  text-align: center;
  margin-bottom: 5px;
}

.system-info {
  align-self: flex-end;
  width: 100%;
  font-size: 12px;
  color: #adadad;
  text-align: center;
}
</style>
