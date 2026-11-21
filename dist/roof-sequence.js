const sequence = document.querySelector(".roof-sequence");
const frames = [...sequence.querySelectorAll(".sequence-frame")];
const controls = sequence.querySelector(".sequence-controls");
const buttons = [...controls.querySelectorAll("button")];
const play = sequence.querySelector("[data-play]");
let active = 0;
let timer;

function showFrame(index) {
  active = index;
  frames.forEach((frame, i) => {
    frame.classList.toggle("active", i === index);
    frame.setAttribute("aria-hidden", String(i !== index));
    buttons[i].setAttribute("aria-pressed", String(i === index));
  });
}

function stopPlayback() {
  clearInterval(timer);
  timer = undefined;
  play.textContent = active === frames.length - 1 ? "Replay sequence" : "Play sequence";
}

buttons.forEach((button, i) => button.addEventListener("click", () => {
  showFrame(i);
  stopPlayback();
}));

play.addEventListener("click", () => {
  if (timer !== undefined) {
    stopPlayback();
    return;
  }
  if (active === frames.length - 1) showFrame(0);
  play.textContent = "Pause sequence";
  timer = setInterval(() => {
    showFrame(active + 1);
    if (active === frames.length - 1) stopPlayback();
  }, 3500);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopPlayback();
});
window.addEventListener("pagehide", stopPlayback);
showFrame(0);
sequence.classList.add("ready");
controls.hidden = false;
play.hidden = false;
