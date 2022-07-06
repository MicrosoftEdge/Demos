let audioBlobs = [];
let mediaRecorder = null;
let stream = null;

let start = 0;

export async function startRecordingAudio() {
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    console.log('mediaDevices API or getUserMedia method is not supported in this browser.');
    return false;
  }

  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioBlobs = [];

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", event => {
    audioBlobs.push(event.data);
  });

  start = Date.now();
  mediaRecorder.start();

  return true;
}

export function stopRecordingAudio() {
  return new Promise(resolve => {
    const mimeType = mediaRecorder.mimeType;

    mediaRecorder.addEventListener("stop", () => {
      const duration = (Date.now() - start) / 1000;
      const audioBlob = new Blob(audioBlobs, { type: mimeType });
      resolve({ blob: audioBlob, duration });
    });

    mediaRecorder.stop();
    stream.getTracks().forEach(track => track.stop());
    mediaRecorder = null;
    stream = null;
  });
}
