import { emojiFoods } from "./emoji-foods.js";
import { shuffleArray } from "./utils/shuffleArray.js";


//SELECTORES DEL DOM
const button = document.querySelector("button");
const board = document.querySelector(".board");
const template = document.querySelector("#template-card").content;
const scoreItem = document.querySelector(".score-board__item-score");
const timer = document.querySelector(".score-board__item-time");
const finishDisplay = document.querySelector(".finish-display");
const ul = document.querySelector(".list");

//Variables del juego
const flippedCars = [];
let scoreCounter = 0;
let totalTime = 0;
let timeInterval = null;
let puntuaciones = [];
let initials = "";

const fragment = document.createDocumentFragment();

button.addEventListener("click", initGame);
board.addEventListener("click", flipCard);

function initGame() {
  resetGame();
  createBoard();
  timeInterval = setInterval(updateTime, 1000);
}

function resetGame() {
  board.innerHTML = ""; //Para reiniciar el tablero cada vez que pulsemos el boton de iniciar juego.
  clearInterval(timeInterval);
  totalTime = 0;
  timer.textContent = totalTime;
  scoreCounter = 0;
  scoreItem.textContent = scoreCounter;
  finishDisplay.classList.add("hide");
}

function createBoard() {
  const randomArray = createRandomArrayFromOther(emojiFoods);
  const arrayRandomWithMatches = [...randomArray, ...randomArray];
  const shuffledArray = shuffleArray(arrayRandomWithMatches);

  shuffledArray.forEach((emoji) => {
    const card = createCard(emoji);
    fragment.append(card);
  });
  board.append(fragment);
}

function createRandomArrayFromOther(arrayToCopy, maxLength = 8) {
  const clonedArray = [...arrayToCopy];
  const randomArray = [];

  for (let i = 0; i < maxLength; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    const randomItem = clonedArray[randomIndex];

    randomArray.push(randomItem);
    clonedArray.splice(randomIndex, 1);
  }
  return randomArray;
}

function createCard({ id, emoji }) {
  const card = template.cloneNode(true);
  card.querySelector(".card").dataset.identity = id;
  card.querySelector(".card__back").textContent = emoji;
  return card;
}

function flipCard(event) {
  const card = event.target.closest(".card");
  if (card && flippedCars.length < 2 && !card.classList.contains("flipped")) {
    card.classList.add("flipped");
    flippedCars.push(card);
    if (flippedCars.length === 2) {
      checkIdentityMatch();
      finishGameIfNoMoreMatches();
    }
  }
}

function finishGameIfNoMoreMatches() {
  const numberOfMatches = board.querySelectorAll(".match").length;
  if (numberOfMatches === 16) {
    finishDisplay.classList.remove("hide");
    clearInterval(timeInterval);
    iniciales();
    escribirPuntuaciones();
  }
}

function checkIdentityMatch() {
  const [identity1, identity2] = flippedCars.map(
    (card) => card.dataset.identity
  );
  if (identity1 === identity2) {
    flippedCars.forEach((card) => card.classList.add("match"));
    flippedCars.length = 0;
    updateScore(1);
  } else {
    setTimeout(() => {
      flippedCars.forEach((card) => card.classList.remove("flipped")),
        (flippedCars.length = 0);
    }, 1000);
    updateScore(-1);
  }
}
function updateScore(score) {
  scoreItem.textContent = scoreCounter += score;
}

function updateTime() {
  totalTime++;
  timer.textContent = totalTime;
}

//Para guardar las puntuaciones en localStorage
function iniciales() {
  initials = prompt("Introduce tus iniciales");
  const puntuacion = {
    iniciales: initials,
    puntos: scoreCounter,
    tiempo: totalTime,
  };
  let puntuacionesLocalStorage = localStorage.getItem("puntuaciones");
  let puntuacionesParseadas = JSON.parse(puntuacionesLocalStorage);
  puntuaciones = [...puntuacionesParseadas];
  puntuaciones.push(puntuacion);
  let puntuacionesEnviar = JSON.stringify(puntuaciones);
  localStorage.setItem("puntuaciones", puntuacionesEnviar);
}

function escribirPuntuaciones() {
  let puntuacionesLocalStorage = localStorage.getItem("puntuaciones");
  let puntuacionesParseadas = JSON.parse(puntuacionesLocalStorage);
  console.log(typeof puntuacionesParseadas);

  const listScores = document.querySelector(".list-scores");
  puntuacionesParseadas.forEach(puntuacion => {
    const li = document.createElement("li");
    li.textContent = `Iniciales: ${puntuacion.iniciales}, puntuación: ${puntuacion.puntos} y tiempo: ${puntuacion.tiempo}s.`;
    listScores.append(li);
  })
  const scores = document.querySelector(".scores");
  scores.classList.toggle("hide");
}