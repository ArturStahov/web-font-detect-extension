<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted, reactive } from 'vue'
import { tagWithContentConfig, getStyles, styleOptions } from '~/services/content-service';
import { getTooltipPosition, isPointOverText } from '~/services/tooltip-service';
import { debounce } from '~/services/utils-service';
//import { onMessage  } from 'webext-bridge/content-script'
//import { storageDemo } from '~/logic/storage'

const [show, togglePopup] = useToggle(false);

const elementInfo = reactive({
  "font-family": "",
  "font-weight": "",
  "font-size": "",
  "line-height": "",
  "letter-spacing": "",
  "font-style": "",
  "color": "",
  "render-font-family": "",
  "render-font-style": ""
})

const tooltipPosition = reactive({
  "left": 0,
  "top": 0,
})

const controlButton = ref({ code: 17, name: 'left CTRL' }); 

const tooltipElement = ref<any>(null);

const isShowTooltip = ref(false); 

const pingSetToPopup = ref(false);

// onMessage('activate-extension-event', (data) => {
//   console.log('ACTIVATE EXTENSION!!!!!!!!!', data)
//   toggle();
// })

const visibleTooltip = () => {
  return isShowTooltip.value ? 'flex': 'none';
}

onMounted(() => {
  document.addEventListener('mousemove', handlerMousePosition );
  window.addEventListener("keydown", handlerControlButton);
  togglePopup();
  //controlButton.value = storeEventButton;
})

function handlerControlButton(event: any) {
  console.log("EVENT>>>", event.keyCode, event.ctrlKey)
  if (!show.value || event.isComposing || event.keyCode === 229) {
    return;
  }
  if (event.keyCode === controlButton.value.code || event.ctrlKey) {
    pingSetToPopup.value = !pingSetToPopup.value;
  }
  
}

async function handlerMousePosition(event: any) {
  isShowTooltip.value = false;
  if (!show.value) {
    return;
  }
  const x = event.clientX;
  const y = event.clientY;

  const element = document.elementFromPoint(x, y);
  if (!element) return;

  const position = getTooltipPosition(x, y, tooltipElement.value);
  position && Object.assign(tooltipPosition, position);
  const information = await getElementInfo(element, event);
  
  if (information?.style) {
    Object.assign(elementInfo, information?.style);
    isShowTooltip.value = true;
  }
  
  console.log(information);
}

async function getElementInfo(element: Element, event: any): Promise<{ [key: string]: string } | null> {
  const tagName = element.tagName.toLowerCase();
  const isElementWithTextContent = tagWithContentConfig.includes(tagName) && element.textContent;
  const information: {tag: string, style: null | any} = {
    tag: tagName,
    style: null,
  }
  const isElementOnTheText = isPointOverText(event);
  if (isElementWithTextContent && isElementOnTheText) {
    information.style = await getStyles(element, styleOptions);
  }
  return Promise.resolve(information);
}

</script>

<template>
  <div class="wrapper-main right-0 top-0 select-none leading-1em">
    <TooltipComponent ref="tooltipElement" :elementInfo="elementInfo" :position="tooltipPosition" :visible="visibleTooltip()"
      :controlButton="controlButton.name" />

    <!-- POPUP -->
    <PopupContent :ping="pingSetToPopup" :elementInfo='elementInfo' :show="show" @close="togglePopup()" />

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
.wrapper-main {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
