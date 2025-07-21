// background.js

// Log when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ KYC Autofill Extension installed.");
});

// Handle verification signal from verify.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'verified') {
    // Relay the verified status to the content script on active tab
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'verified' });
      }
    });
  }
});
