<script setup lang="ts">
//import { storageDemo } from '~/logic/storage'
import { onMounted } from 'vue';
import { sendMessage } from 'webext-bridge/popup'

async function activatedExtension() {
  await activateContentScript();
  await closePopup();
}

async function activateContentScript() {
  let tabs = await browser?.tabs?.query({
    active: true,
    currentWindow: true
  });

  const activeTabId = tabs[0]?.id || 0;
  await sendMessage('activate-extension-event', { activate: true }, { context: 'content-script', tabId: activeTabId }); // send to content script
  await sendMessage('activate-extension-event', { activate: true, tabId: activeTabId }, "background"); // send to background script
}

// TODO: INFO: close extension popup
async function closePopup() {
  const window = await browser.windows.getLastFocused();
  browser.extension.getViews({ type: 'popup', windowId: window.id }).forEach(w => w.close());
}

onMounted(async() => {
})
</script>

<template>
  <main class="popup-main px-4 py-5 text-center text-gray-700">
    <Logo />
    <h1 class="text logo">Fontio</h1>

    <p class="text"> Contacts:</p>
    <ul>
      <li class="text">
        - Mail: <a target="_blank" href="mailto:stakhov.artur@gmail.com">send mail</a>;
      </li>
      <li class="text">
        - Linkedin: <a target="_blank" href="https://www.linkedin.com/in/artur-stakhov/">visit</a>;
      </li>
    </ul>

    <button class="start-button btn mt-2" @click="activatedExtension">
      Start
    </button>

  </main>
</template>

<style>
.popup-main {
  width: 400px;
  background-color: #363636;
  border: none;
  border-radius: 5px;
}
.popup-main  p {
  margin-bottom: 5px;
  text-align: left;
}
.popup-main li {
  margin-bottom: 5px;
  text-align: left;
}
.popup-main ul {
  margin-left: 10px;
}

.popup-main a {
  color: #ffd060;
}

.popup-main .start-button {
   margin-top: 20px;
   font-size: 12px;
   width: 100px;
   height: 30px;
}
</style>