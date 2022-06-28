const container = document.getElementById("container");
const startButton = document.getElementById("start");
const canvas = document.getElementById("canvas");

const halfWidth = window.innerWidth / 2;
const halfHeight = window.innerHeight / 2;
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioSource;
let analyser;
let base64Song;

const openFile = (event) => {
  let input = event.target;
  let reader = new FileReader();

  reader.onload = () => {
    let base64str = btoa(reader.result);
    base64Song = "data:audio/wav;base64," + base64str;
  };

  reader.readAsBinaryString(input.files[0]);
};

const drawCircle = (ctx, x, y, radius, stroke, strokeWidth, cut) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, cut, 2 * Math.PI, false);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = stroke;
  ctx.stroke();
};

const generateRandomInteger = (max) => Math.floor(Math.random() * max) + 1;

const initMusicVisualizer = () => {
  let audio = new Audio(base64Song);
  const audioContext = new AudioContext();

  audio.play();

  audioSource = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 1024;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let circleRadius;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);

    for (let i = 0; i < bufferLength; i++) {
      circleRadius = dataArray[i];
      drawCircle(ctx, halfWidth, halfHeight, circleRadius, "#e7a167", 0.6, 0);
      drawCircle(ctx, halfWidth, halfHeight, circleRadius + 2, "#000", 0.1, 0);
    }
    requestAnimationFrame(animate);
  };

  animate();
};

startButton.addEventListener("click", initMusicVisualizer);
