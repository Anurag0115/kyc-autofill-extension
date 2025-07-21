// 🔐 Ensure pdfjsLib is defined safely from window (CSP-safe)
if (typeof pdfjsLib === "undefined" && window.pdfjsLib) {
  var pdfjsLib = window.pdfjsLib;
}

// ✅ SAFELY LOAD WORKER IN EXTENSION CONTEXT (BLOB workaround for Chrome Extensions)
const pdfWorkerBlob = new Blob(
  [`
    importScripts('libs/pdf.worker.min.js');
  `],
  { type: 'application/javascript' }
);
const pdfWorkerUrl = URL.createObjectURL(pdfWorkerBlob);
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// 🧠 Load face recognition models
async function loadModels() {
  const MODEL_URL = './models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  document.getElementById('status').innerText = "✅ Models loaded. Ready to capture.";
  startVideo();
}

// 🎥 Start webcam
async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('video').srcObject = stream;
  } catch (err) {
    document.getElementById('status').innerText = "❌ Camera error: " + err.message;
  }
}

// 📸 Face capture and storage
document.getElementById("capture").addEventListener("click", async () => {
  const video = document.getElementById("video");

  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    document.getElementById("status").innerText = "❌ No face detected. Try again.";
    return;
  }

  const descriptor = Array.from(detection.descriptor);
  localStorage.setItem("faceDescriptor", JSON.stringify(descriptor));
  document.getElementById("status").innerText = "✅ Face enrolled successfully.";
});

// 📎 Aadhaar PDF upload (text or scanned)
document.getElementById("aadhaarPdf").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function () {
    try {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(i => i.str).join(' ');

      // Detect if Aadhaar is scanned or text-based
      if (text.length > 30 && /\d{4} \d{4} \d{4}/.test(text)) {
        console.log("🧾 Aadhaar is text-based.");
        processAadhaarText(text);
      } else {
        console.log("🖼 Aadhaar seems scanned. Using OCR...");

        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const { data: { text: ocrText } } = await Tesseract.recognize(canvas, 'eng');
        processAadhaarText(ocrText);
      }
    } catch (err) {
      console.error("❌ PDF reading/OCR error:", err);
      document.getElementById("pdf-status").innerText = "❌ Failed to read Aadhaar PDF: " + err.message;
    }
  };

  reader.readAsArrayBuffer(file);
});

// 🧠 Parse Aadhaar text and store KYC
function processAadhaarText(text) {
  const nameMatch = text.match(/Name[:\s]*([A-Z][a-zA-Z\s]{3,})/i);
  const aadhaarMatch = text.match(/\d{4}[\s\-]?\d{4}[\s\-]?\d{4}/);
  const dobMatch = text.match(/DOB[:\s]*([\d\/\-]+)/i);
  const genderMatch = text.match(/\b(Male|Female|Other)\b/i);

  const kycData = {
    name: nameMatch?.[1]?.trim() || "",
    aadhaar: aadhaarMatch?.[0]?.replace(/\s|-/g, "") || "",
    dob: dobMatch?.[1]?.trim() || "",
    gender: genderMatch?.[1] || ""
  };

  if (!kycData.name && !kycData.aadhaar) {
    document.getElementById("pdf-status").innerText = "⚠️ Could not extract Aadhaar info. Try another file.";
    return;
  }

  localStorage.setItem("kycData", JSON.stringify(kycData));
  document.getElementById("pdf-status").innerText = "✅ Aadhaar data saved successfully.";
  console.log("✅ Extracted KYC Data:", kycData);
}

loadModels();
