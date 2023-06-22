import { listFilms } from "./peliculas.js";

//Selectores
const template = document.querySelector("template").content;
const btnHome = document.querySelector("#inicio");
const btnShowFilms = document.querySelector("#mostrar");
const btnAddFilms = document.querySelector("#anadir");
const btnSearchFilms = document.querySelector("#buscar");
const form = document.querySelector(".form");
const botonAnadirPelicula = document.querySelector("#btn-add");
const buttonLookFor = document.querySelector(".btn-lookFor");
const inicio = document.querySelector(".inicio-container");
const containerFilms = document.querySelector(".peliculas-container");
const containerForm = document.querySelector(".form-container");
const containerSearch = document.querySelector(".busqueda-container");
const sectionListFilms = document.querySelector("#mostrar-peliculas");

const fragment = document.createDocumentFragment();

//Variables
let filmsShown = false; //para que solo se muestren una vez las peliculas, y no se copien dos veces
let foundFilm = null; //para cuando encuentre la pelicula y la muestre
let favoriteFilms = JSON.parse(localStorage.getItem("favoriteFilms")) || [];

//Eventos

//Para que se muestre o se oculte el inicio
btnHome.addEventListener("click", (event) => {
  inicio.classList.toggle("hide");
});

btnShowFilms.addEventListener("click", (event) => {
  hideContainer(containerFilms);
  const storedFilms = localStorage.getItem("films");
  if (storedFilms) {
    let newArr = JSON.parse(storedFilms);
    for (let film of newArr) {
      if (!listFilms.some((pelicula) => pelicula.id === film.id)) {
        listFilms.push(film);
      }
    }
    showFilms();
  } else {
    showFilms();
    localStorage.setItem("films", JSON.stringify(listFilms));
  }
});
btnAddFilms.addEventListener("click", (event) => {
  hideContainer(containerForm);
  botonAnadirPelicula.addEventListener("click", addFilms);
});
btnSearchFilms.addEventListener("click", (event) => {
  hideContainer(containerSearch);
  buttonLookFor.addEventListener("click", lookForFilms);
});

//Funciones

function createFilm({ title, img, year, starring, directedBy }) {
  //Selectores del template
  const clone = template.cloneNode(true);
  const film = clone.querySelector("#film");
  const imagen = film.querySelector("img");
  const list = film.querySelector(".list");
  const titleFilm = film.querySelector(".title");
  const yearFilm = film.querySelector(".year");
  const directorFilm = film.querySelector(".director");

  titleFilm.textContent = title;
  imagen.src = img;
  imagen.alt = title;
  imagen.width = 170;
  imagen.height = 240;
  yearFilm.textContent += year;
  starring.forEach((actor) => {
    const li = document.createElement("li");
    li.textContent = actor;
    list.append(li);
  });
  const directors = directedBy.join(", ");
  directorFilm.textContent += directors;
  return film;
}

function createFilmElement(pelicula) {
  const film = createFilm(pelicula);
  const btnFavorite = film.querySelector(".favorita");

  film.querySelector("h2").addEventListener("click", function () {
    window.open(pelicula.url, "_blank");
  });
  btnFavorite.addEventListener("change", function () {
    isFavorite(btnFavorite);
  });
  return film;
}

function showFilms() {
  if (!filmsShown) {
    listFilms.forEach((pelicula) => {
      const film = createFilmElement(pelicula);
      fragment.append(film);
    });
    sectionListFilms.append(fragment);
    filmsShown = true;
    markFavorites();
  }
}

function addFilms() {
  const title = document.querySelector("#fTitulo");
  const url = document.querySelector("#fUrl");
  const img = document.querySelector("#fImg");
  const starring = document.querySelector("#fActores").value;
  const starringArr = starring.split(", ");
  const director = document.querySelector("#fDirector").value;
  const directorArr = director.split(", ");
  const year = document.querySelector("#fAge");
  const newFilm = {
    id: listFilms.length + 1,
    title: title.value,
    url: url.value,
    img: img.value,
    year: year.value,
    starring: starringArr,
    directedBy: directorArr,
  };

  listFilms.push(newFilm);
  localStorage.setItem("films", JSON.stringify(listFilms));
  const newFilmElement = createFilm(newFilm);
  fragment.append(newFilmElement);
  sectionListFilms.append(fragment);

  form.reset();
}

function lookForFilms() {
  const peliculaNoEncontrada = document.querySelector(
    ".pelicula-no-encontrada"
  );

  const tituloBuscar = document.querySelector(".titulo-busqueda");
  const nombre = tituloBuscar.value;

  if (foundFilm) {
    foundFilm.remove();
    foundFilm = null;
  }

  const storedFilms = localStorage.getItem("films");
  const peliculaEncontrada = JSON.parse(storedFilms).find(
    (pelicula) => pelicula.title == nombre
  );
  peliculaNoEncontrada.innerHTML = ""; // Eliminar el contenido anterior
  
  const span = document.createElement("span");
  if (!peliculaEncontrada) {
    span.textContent = `No se ha encontrado la película: ${nombre}.`;
    peliculaNoEncontrada.append(span);
  } else {
    const film = createFilm(peliculaEncontrada);
    foundFilm = film;
    fragment.append(film);
    const anadir = document.querySelector(".pelicula-encontrada");
    anadir.append(fragment);
  }
  nombre.value = "";
}

function hideContainer(container) {
  container.hasAttribute("hidden")
    ? container.removeAttribute("hidden")
    : container.setAttribute("hidden", true);
}

function isFavorite(favoriteInput) {
  const filmContainer = favoriteInput.closest("#film");
  const film = listFilms.find(
    (pelicula) =>
      pelicula.title == filmContainer.querySelector("h2").textContent
  );

  if (favoriteInput.checked) {
    filmContainer.style.backgroundColor = "#F5B041";
    favoriteFilms.push(film);
    localStorage.setItem("favoriteFilms", JSON.stringify(favoriteFilms));
  } else {
    filmContainer.style.backgroundColor = "";
    const index = favoriteFilms.findIndex(
      (pelicula) => pelicula.id === film.id
    );
    if (index !== -1) {
      favoriteFilms.splice(index, 1);
      localStorage.setItem("favoriteFilms", JSON.stringify(favoriteFilms));
    }
  }
}

function markFavorites() {
  let favoriteFilms = JSON.parse(localStorage.getItem("favoriteFilms")) || [];
  favoriteFilms.forEach((film) => {
    let filmContainer = document.querySelectorAll(`#film`);
    filmContainer.forEach((container) => {
      if (film.title == container.querySelector("h2").textContent) {
        let favoriteInput = container.querySelector(".favorita");
        favoriteInput.checked = true;
        container.style.backgroundColor = "#F5B041";
      }
    });
  });
}
