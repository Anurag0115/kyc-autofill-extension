document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('setKYC').addEventListener('click', () => {
    const aadhaarValue = document.getElementById('aadhaarInput').value;
    const encrypted = btoa(JSON.stringify(aadhaarValue)); // replace with proper encryption if needed
    chrome.storage.local.set({ aadhaar: encrypted }, () => {
      alert('KYC info saved.');
    });
  });
});