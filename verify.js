async function loadModels() {
  const MODEL_URL = './models';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  document.getElementById('status').innerText = "✅ Models loaded. Ready to verify.";
  startVideo();
}

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('video').srcObject = stream;
  } catch (err) {
    document.getElementById('status').innerText = "❌ Camera error: " + err.message;
  }
}

document.getElementById("verify").addEventListener("click", async () => {
  const stored = localStorage.getItem("faceDescriptor");
  if (!stored) {
    document.getElementById("status").innerText = "❌ No face enrolled.";
    return;
  }

  const descriptor = new Float32Array(JSON.parse(stored));
  const labeledDescriptor = new faceapi.LabeledFaceDescriptors("User", [descriptor]);
  const faceMatcher = new faceapi.FaceMatcher([labeledDescriptor], 0.6);

  const video = document.getElementById("video");

  try {
    const result = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) {
      document.getElementById("status").innerText = "❌ Face not detected. Try again.";
      return;
    }

    const match = faceMatcher.findBestMatch(result.descriptor);

    if (match.label === "User" && match.distance < 0.6) {
      document.getElementById("status").innerText = "✅ Face matched! Autofilling...";

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"]
        }, () => {
          console.log("✅ content.js injected for autofill.");
        });
      });

    } else {
      document.getElementById("status").innerText = "❌ Face does not match enrolled data.";
    }
  } catch (err) {
    console.error("Face verification failed:", err);
    document.getElementById("status").innerText = "❌ Error during face verification.";
  }
});

loadModels();
