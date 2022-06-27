let audio = new Audio(
);
const audioContext = new AudioContext();
console.log(audioContext);

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let audioSource;
let analyser;

container.addEventListener("click", function () {
  audio.play();
  audioSource = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uinit8Array(bufferLength);

  const barWidth = canvas.width / bufferLength;
  let barHeight;

  function animate() {
    let x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = "white";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }

  animate();
});