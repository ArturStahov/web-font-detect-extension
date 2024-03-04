<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted } from 'vue'
import { detectTagConfig, getStyles, styleOptions } from '~/services/content-service';
import { debounce } from '~/services/utils-service';
//import { onMessage  } from 'webext-bridge/content-script'
//import { storageDemo } from '~/logic/storage'

const [show, showPopup] = useToggle(false);

// onMessage('activate-extension-event', (data) => {
//   console.log('ACTIVATE EXTENSION!!!!!!!!!', data)
//   toggle();
// })

onMounted(() => {
  document.addEventListener('mousemove', debounce(handlerMousePosition) );
  showPopup();
})

async function handlerMousePosition(event: any) {
  const x = event.clientX;
  const y = event.clientY;

  const element = document.elementFromPoint(x, y);
  if (!element) return;

  const style = await getElementStyle(element);
  if (style) {
    console.log(style);
  }
}

async function getElementStyle(element: Element): Promise<{ [key: string]: string } | null> {
  const tagName = element.tagName.toLowerCase();
  const isElementWithTextContent = detectTagConfig.includes(tagName);
  if (isElementWithTextContent) {
    return getStyles(element, styleOptions);
  }
  return Promise.resolve(null);
}

</script>

<template>
  <div class="fixed right-0 top-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
    <div
      class="popup-content text-gray-800 shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      <h1 class="text text-lg">
        Fontio
      </h1>
  
    </div>
    <!-- <button
      class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
     
    </button> -->
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.popup-content {
  width: 225px;
  height: 300px;
  background-color: #363636;
  border: none;
  border-radius: 5px;
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
