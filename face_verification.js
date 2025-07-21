import * as faceapi from 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/+esm';

async function startVideo() {
  const video = document.getElementById('video');
  await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');

  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => video.srcObject = stream);
}

async function verifyUserFace() {
  const labeledDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
  const video = document.getElementById('video');

  const result = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (result) {
    const bestMatch = faceMatcher.findBestMatch(result.descriptor);
    if (bestMatch.label !== 'unknown') {
      chrome.runtime.sendMessage({ type: 'verified' });
      document.getElementById('status').innerText = '✅ Verified!';
    } else {
      document.getElementById('status').innerText = '❌ Not recognized.';
    }
  }
}

document.getElementById('verify').addEventListener('click', verifyUserFace);
startVideo();

function loadLabeledImages() {
  return Promise.resolve([
    new faceapi.LabeledFaceDescriptors('User', [new Float32Array(JSON.parse(localStorage.getItem('faceDescriptor')))])
  ]);
}