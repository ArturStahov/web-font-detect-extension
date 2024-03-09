<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted, reactive } from 'vue'
import { tagWithContentConfig, getStyles, styleOptions, isPointOverText } from '~/services/content-service';
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

const controlButton = ref('left CTRL'); 

const isShowTooltip = ref(false); 

// onMessage('activate-extension-event', (data) => {
//   console.log('ACTIVATE EXTENSION!!!!!!!!!', data)
//   toggle();
// })

const visibleTooltip = () => {
  return isShowTooltip.value ? 'flex': 'none';
}

onMounted(() => {
  document.addEventListener('mousemove', debounce(handlerMousePosition) );
  togglePopup();
  //controlButton.value = storeEventButton;
})


async function handlerMousePosition(event: any) {
  isShowTooltip.value = false;
  if (!show.value) {
    return;
  }
  const x = event.clientX;
  const y = event.clientY;

  const element = document.elementFromPoint(x, y);
  if (!element) return;

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

    <div class="tooltip-fontio" :style="`display: ${visibleTooltip()};left: ${tooltipPosition.left}px; top: ${tooltipPosition.top}px`">
      <p class='font-info'> {{ `${elementInfo['render-font-family']}` }} </p>
      <div class="tooltip-wrapper-information">
        <svg class="icon-font-size" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
          <path fill="currentColor" d="M6.1 2.75h3.09V4h1.25V1.5H.5V4h1.25V2.75h3.1v10.5H2.7v1.25h5.55v-1.25H6.1z">
          </path>
          <path fill="currentColor"
            d="M12.4 6.75H8.06v2.5h1.25V8h1.84v5.25H9.63v1.25h4.3v-1.25H12.4V8h1.85v1.25h1.25v-2.5z"></path>
        </svg>
        <span>
          {{ ` ${elementInfo['font-size']};` }}
        </span>
        <svg class="icon-line-height" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M16 11h-3V5.41l.79.8a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-2.5-2.5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-2.5 2.5a1 1 0 0 0 1.42 1.42l.79-.8V11H8a1 1 0 0 0 0 2h3v5.59l-.79-.8a1 1 0 0 0-1.42 1.42l2.5 2.5a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l2.5-2.5a1 1 0 0 0-1.42-1.42l-.79.8V13h3a1 1 0 0 0 0-2" />
        </svg>
        <span>
          {{ ` ${elementInfo['line-height']};` }}
        </span>
        <svg class="icon-font-weight" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M5.725 18.275Q5 17.55 5 16.5t.725-1.775l9-9Q15.45 5 16.5 5t1.775.725Q19 6.45 19 7.5t-.725 1.775l-9 9Q8.55 19 7.5 19t-1.775-.725" />
        </svg>
        <span>
          {{ ` ${elementInfo['font-weight']}` }}
        </span>
      </div>
      <p class='system-info'> {{ `click button ${controlButton} to inspect` }} </p>
    </div>

    <!-- POPUP -->
    <div class="popup-content text-gray-800 shadow w-max h-min" p="x-4 y-2" m="y-auto r-2" v-if="show">
      <button class="popup-button-close flex w-4 h-4 rounded-full shadow cursor-pointer border-none"
        bg="teal-600 hover:teal-700" @click="togglePopup()">
        X
      </button>
      <h1 class="text text-lg">
        Fontio
      </h1>
    </div>
    
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
  color:#ffd060;
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
