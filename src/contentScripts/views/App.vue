<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import { ref, onMounted } from 'vue'

const [show, toggle] = useToggle(false);

const detectTagConfig = [
  "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "body", "button",
  "canvas", "caption", "cite", "code", "colgroup", "data", "datalist", "dd", "del", "details", "dfn",
  "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3",
  "h4", "h5", "h6", "header", "html", "i", "iframe", "ins", "kbd", "label", "legend", "li", "main",
  "map", "mark", "menu", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output",
  "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small",
  "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot",
  "th", "thead", "time", "tr", "u", "ul", "var", "video", "wbr"
];

onMounted(() => {
  document.addEventListener('mousemove', debounce(handlerMousePosition) );
})

function debounce(func: any, timeout = 300) {
  let timer: any = 0;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function handlerMousePosition(event: any) {
  const x = event.clientX;
  const y = event.clientY;

  const element = document.elementFromPoint(x, y);
  if (!element) return;

  const text = getTextFromElement(element);
  if (text) {
    console.log(text);
  }
}

function getTextFromElement(element: Element): string | null {
  const tagName = element.tagName.toLowerCase();
  const isTextCondition = detectTagConfig.includes(tagName);
  if (isTextCondition) {
    return element.textContent;
  }
  return null;
}

</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
    <div
      class="bg-white text-gray-800 rounded-lg shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0'"
    >
      <h1 class="text-lg">
        Vitesse WebExt
      </h1>
      <SharedSubtitle />
    </div>
    <button
      class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
     
    </button>
  </div>
</template>
