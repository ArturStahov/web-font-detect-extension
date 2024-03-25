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

onMessage('activate-extension-event', (data) => {
  //console.log('EVENT FROM POPUP > CONTENT_SCRIPT ACTIVATED', data)
})

onMessage('get-fonts-details', async(data: any) => {
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
    await sendMessage('font-details', { status: 'error' }, { context: 'content-script', tabId: currentTabId });
  }
})

