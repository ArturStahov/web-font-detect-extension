<script setup lang="ts">
import 'uno.css'
import { ref, onMounted, reactive, defineEmits, defineProps, watch, toRefs } from 'vue';

const emit = defineEmits<{
  (e: 'close',): void
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
});

const { ping, elementInfo } = toRefs(props);

function close() {
  emit('close');
}

watch(ping, (newX) => {
  console.log(`PING  ${newX}`)
})

onMounted(() => {
  
})

</script>

<template>
  <div class="popup-content text-gray-800 shadow w-max h-min" p="x-4 y-2" m="y-auto r-2" v-if="show">
    <button class="popup-button-close flex w-4 h-4 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700" @click="close">
      X
    </button>
    <h1 class="text text-lg">
      Fontio
    </h1>
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
  z-index: 10000;
}

.popup-button-close {
  pointer-events: all !important;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
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
</style>
