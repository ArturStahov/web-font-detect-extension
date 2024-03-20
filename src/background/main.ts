import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  //sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})


onMessage('activate-extension-event', (data) => {
  console.log('EVENT FROM POPUP > CONTENT_SCRIPT ACTIVATED', data)
})

onMessage('get-fonts-details', async(data: any) => {
  console.log('EVENT FROM CONTENT SCRIPT > GET-FONT-DETAILS', data);
  let tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  const currentTabId = tabs[0]?.id || 0;
  
  await sendMessage('font-details', { activate: 'HELLOW!' }, { context: 'content-script', tabId: currentTabId  });
})

