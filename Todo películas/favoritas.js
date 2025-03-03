//Selectores del DOM

const templateFilmFavorita = document.querySelector("#template-film-favorita"
).content;
const favoritasContainer = document.querySelector(".favoritas-container");

const fragmentFavorito = document.createDocumentFragment();

//Array de favoritas
const favoriteFilms = JSON.parse(localStorage.getItem("favoriteFilms")) || [];

// Funciones

function crearPeliculaFavorita({ title, poster_path, overview, release_date, original_language, primerosActores, director, genres, runtime, budget, revenue,id }) {
  const cloneFilmFavorita = templateFilmFavorita.cloneNode(true);
  const filmFavorita = cloneFilmFavorita.querySelector(".film");
  const tituloFavorita = filmFavorita.querySelector(".title");
  const imgFavorita = filmFavorita.querySelector(".img");
  const sinopsisFavorita = filmFavorita.querySelector(".sinopsis");
  const fechaFavorita = filmFavorita.querySelector(".fecha");
  const idiomaFavorita = filmFavorita.querySelector(".idioma");
  const actoresFavorita = filmFavorita.querySelector(".lista-actores");
  const directorFavorita = filmFavorita.querySelector(".director");
  const generosFavorita = filmFavorita.querySelector(".generos");
  const duracionFavorita = filmFavorita.querySelector(".duracion");
  const presupuestoFavorita = filmFavorita.querySelector(".presupuesto");
  const recaudacionFavorita = filmFavorita.querySelector(".recaudacion");

  tituloFavorita.textContent = title;
  imgFavorita.src = `https://image.tmdb.org/t/p/w200/${poster_path}`;
  imgFavorita.alt = title;
  sinopsisFavorita.textContent = overview;
  fechaFavorita.textContent = release_date;
  idiomaFavorita.textContent = original_language;
  primerosActores.forEach(actor => {
    const li = document.createElement("li");
    li.textContent = actor;
    actoresFavorita.append(li);
  })
  directorFavorita.textContent = director;
  generosFavorita.textContent = genres;
  duracionFavorita.textContent = runtime;
  presupuestoFavorita.textContent = budget;
  recaudacionFavorita.textContent = revenue;
  filmFavorita.id = id;
  
  return filmFavorita;
}

function crearElementoPeliculaFavorita() {
  favoriteFilms.forEach((pelicula) => {
    const filmFavorita = crearPeliculaFavorita(pelicula);
    fragmentFavorito.append(filmFavorita);
    expandirSinopsis(filmFavorita);
    verMasDatos(filmFavorita);
    redirigirTMDB(filmFavorita);
  });
  favoritasContainer.append(fragmentFavorito);
}

function actualizarFavoritas() {
  const filmContainers = document.querySelectorAll(".film");
  filmContainers.forEach((container) => {
    const checkbox = container.querySelector('input[name="favorita"]');
    checkbox.addEventListener("click", () => {
      let titulo = container.querySelector(".title").textContent;
      let indice = favoriteFilms.findIndex((pelicula) => pelicula.title === titulo);
      if (indice !== -1) {
        favoriteFilms.splice(indice, 1);
      }
      container.remove();
      localStorage.setItem("favoriteFilms", JSON.stringify(favoriteFilms));
    });
  });
}

function expandirSinopsis(film) {
  const sinopsisContainer = film.querySelector(".sinopsis-container");
  sinopsisContainer.addEventListener("click", () => {
    sinopsisContainer.classList.toggle("expanded");
  });
}

function verMasDatos(film) {
  const button = film.querySelector("button.datos");
  const container = film.querySelector(".datosExtra-container");
  button.addEventListener("click", () => {
    container.toggleAttribute("hidden");
  })
}

function redirigirTMDB(film) {
  const img = film.querySelector("img");
  const url = `https://www.themoviedb.org/movie/${film.id}`;
  img.addEventListener("click", () => {
    window.open(url, "_blank");
  });
}


crearElementoPeliculaFavorita();
actualizarFavoritas();