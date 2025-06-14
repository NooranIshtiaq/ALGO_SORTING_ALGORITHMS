const n = 50;
const array = [];
let audioCtx = null;

init();

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random(); // Generate random values
  }

  // Sort the array in descending order
  array.sort((a, b) => b - a);

  showBars();
}

function play() {
  const copy = [...array];
  const moves = selectionSort(copy); // Apply selection sort on the sorted array
  animate(moves);
}

function animate(moves) {
  if (moves.length == 0) {
    showBars();
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }
  playNote(200 + array[i] * 500);
  playNote(200 + array[j] * 500);
  showBars(move);

  setTimeout(function () {
    animate(moves);
  }, 100);
}

// Selection Sort Implementation in JavaScript
function selectionSort(array) {
  const moves = [];
  const size = array.length;
  for (let i = 0; i < size - 1; i++) {
    let min_index = i;
    for (let j = i + 1; j < size; j++) {
      if (array[j] < array[min_index]) {
        min_index = j;
      }
    }
    if (min_index !== i) {
      moves.push({ indices: [i, min_index], type: "swap" });
      [array[i], array[min_index]] = [array[min_index], array[i]];
    }
  }
  return moves;
}

function showBars(move) {
  const container = document.getElementById("container");
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
    }

    container.appendChild(bar);
  }
}
