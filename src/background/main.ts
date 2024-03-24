import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'
import { getFontsByFamily } from '~/services/api-service'

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
  let tabs = await browser?.tabs?.query({
    active: true,
    currentWindow: true
  });
  const currentTabId = tabs[0]?.id || 0;

  const fontName = data && data.data['render-font-family'] || '';
  try {
    const response = await getFontsByFamily(fontName);
    const fontItem = response.items[0];
    if (!fontItem) {
      throw new Error('not found');
    }
    
    const details = {
      font: fontItem.family,
      category: fontItem.category,
      files: fontItem.files,
      status: 'success'
    }
    await sendMessage('font-details', details, { context: 'content-script', tabId: currentTabId });
  } catch (error: any) {
    console.log(`Error: get font details for font ${fontName}, ${error.message}`);
    await sendMessage('font-details', { status: 'error' }, { context: 'content-script', tabId: currentTabId });
  }
})

