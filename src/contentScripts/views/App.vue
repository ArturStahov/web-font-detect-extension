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
      class="bg-white text-gray-800 rounded-lg shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      <h1 class="text-lg">
        Fontio
      </h1>
      <SharedSubtitle />
    </div>
    <!-- <button
      class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
     
    </button> -->
  </div>
</template>
