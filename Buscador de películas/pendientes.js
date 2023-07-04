//Selectores del DOM

const templateFilmPendiente = document.querySelector("#template-film-pendiente").content;
const pendientesContainer = document.querySelector(".pendientes-container");

const fragmentPendiente = document.createDocumentFragment();

//Array de pendientes
const pendienteFilms = JSON.parse(localStorage.getItem("pendingFilms")) || [];

// Funciones

function crearPeliculaPendiente({ title, poster_path, overview, release_date, original_language, primerosActores, director, genres, runtime, budget, revenue,id }) {
  const cloneFilmPendiente = templateFilmPendiente.cloneNode(true);
  const filmPendiente = cloneFilmPendiente.querySelector(".film");
  const tituloPendiente = filmPendiente.querySelector(".title");
  const imgPendiente = filmPendiente.querySelector(".img");
  const sinopsisPendiente = filmPendiente.querySelector(".sinopsis");
  const fechaPendiente = filmPendiente.querySelector(".fecha");
  const idiomaPendiente = filmPendiente.querySelector(".idioma");
  const actoresPendiente = filmPendiente.querySelector(".lista-actores");
  const directorPendiente = filmPendiente.querySelector(".director");
  const generosPendiente = filmPendiente.querySelector(".generos");
  const duracionPendiente = filmPendiente.querySelector(".duracion");
  const presupuestoPendiente = filmPendiente.querySelector(".presupuesto");
  const recaudacionPendiente = filmPendiente.querySelector(".recaudacion");
  
  tituloPendiente.textContent = title;
  imgPendiente.src = `https://image.tmdb.org/t/p/w200/${poster_path}`;
  imgPendiente.alt = title;
  sinopsisPendiente.textContent = overview;
  fechaPendiente.textContent = release_date;
  idiomaPendiente.textContent = original_language;
  primerosActores.forEach(actor => {
    const li = document.createElement("li");
    li.textContent = actor;
    actoresPendiente.append(li);
  })
  directorPendiente.textContent = director;
  generosPendiente.textContent = genres;
  duracionPendiente.textContent = runtime;
  presupuestoPendiente.textContent = budget;
  recaudacionPendiente.textContent = revenue;
  filmPendiente.id = id;

  return filmPendiente;
}

function crearElementoPeliculaPendiente() {
  pendienteFilms.forEach((pelicula) => {
    const filmPendiente = crearPeliculaPendiente(pelicula);
    fragmentPendiente.append(filmPendiente);
    expandirSinopsis(filmPendiente);
    verMasDatos(filmPendiente);
    redirigirTMDB(filmPendiente);
  });
  pendientesContainer.append(fragmentPendiente);
}

function actualizarPendientes() {
  const filmContainers = document.querySelectorAll(".film");
  filmContainers.forEach((container) => {
    const checkbox = container.querySelector('input[name="pendiente"]');
    checkbox.addEventListener("click", () => {
      let titulo = container.querySelector(".title").textContent;
      let indice = pendienteFilms.findIndex((pelicula) => pelicula.title === titulo);
      if (indice !== -1) {
        pendienteFilms.splice(indice, 1);
      }
      container.remove();
      localStorage.setItem("pendingFilms", JSON.stringify(pendienteFilms));
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

crearElementoPeliculaPendiente();
actualizarPendientes();



