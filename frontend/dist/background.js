chrome.action.onClicked.addListener((tab) => {
  if (chrome.sidePanel) {
    chrome.sidePanel.open({ windowId: tab.windowId })
  }
})
