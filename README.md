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
## ⚙️ Installation (Developer Mode)
1. Download & unzip the project (or clone repo).  
2. Open **Google Chrome** and go to:
chrome://extensions/

pgsql
Copy code
3. Enable **Developer mode** (top-right).  
4. Click **Load unpacked** and select the project folder.  
5. The extension will now appear in your Chrome toolbar.  

---

## 🔑 Usage
1. Open the extension popup and **Enroll Aadhaar**:  
- Upload Aadhaar (text-based PDF or scanned image)  
- The extension will extract & securely store details in `chrome.storage.local`  

2. Perform **Face Verification**:  
- Uses `face-api.js` for real-time verification via webcam  
- On success, the extension will allow autofill  

3. Go to a KYC form → Autofill will be triggered automatically with stored Aadhaar details.  

---

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript  
- **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/)  
- **Face Recognition**: [face-api.js](https://github.com/justadudewhohacks/face-api.js)  
- **Storage**: `chrome.storage.local`  

---

## 🛡️ Security
- ✅ Aadhaar data stored only in browser (`chrome.storage.local`)  
- ✅ Autofill only after successful **face verification**  
- ✅ No external servers or third-party storage involved  

---

## 📌 Roadmap
- 🔄 Support for multiple document types (PAN, Passport, etc.)  
- 📱 Mobile browser extension support  
- ☁️ Optional encrypted cloud sync  

---

## 📝 License
MIT License – free to use and modify.
