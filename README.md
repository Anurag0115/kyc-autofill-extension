# 🔐 KYC Autofill Chrome Extension

A Chrome extension that **automatically fills Aadhaar KYC details** on websites after verifying the user via **face recognition**.  

It supports both **text-based Aadhaar PDFs** and **scanned Aadhaar images** using OCR (`Tesseract.js`) as a fallback.  

---

## 🚀 Features
- 🪪 **Aadhaar Autofill** – Automatically fill user’s Aadhaar details into web forms  
- 🧑‍💻 **Face Verification** – Verify user identity with `face-api.js` before autofill  
- 📄 **OCR Support** – Extract details from scanned Aadhaar PDFs using `Tesseract.js`  
- 🔒 **Secure Data Handling** – Uses `chrome.storage.local` (not `localStorage`) for safer data access across popup, background, and content scripts  
- 🌐 **Seamless Autofill** – Works directly in web forms via content scripts  

---

