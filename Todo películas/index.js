//Selectores del DOM
const templateFilm = document.querySelector("#template-film").content;
const templateRecomendadas = document.querySelector(
  "#template-recomendadas"
).content;
const sectionPeliculasCartelera = document.querySelector(
  ".peliculas-cartelera"
);
const sectionBusquedaPeliculas = document.querySelector(".busqueda-container");
const inputTitulo = document.querySelector("input#titulos");
const inputYear = document.querySelector("input#year");
const botonBuscar = document.querySelector("button.buscar");
const botonLupa = document.querySelector(".btn-lupa");

const fragment = document.createDocumentFragment();

//Arrays de películas
let arrayPeliculas = [];
let arrayFavoritas = JSON.parse(localStorage.getItem("favoriteFilms")) || [];
let arrayPendientes = JSON.parse(localStorage.getItem("pendingFilms")) || [];

//Funciones

function crearPelicula({
  pelicula: {
    title,
    poster_path,
    overview,
    release_date,
    original_language,
    id,
    genre_ids,
  },
  actoresDirector: { primerosActores, director },
  datosComplementarios: { presupuesto, recaudacion, duracion, generos },
}) {
  //Selectores del template

  const cloneFilm = templateFilm.cloneNode(true);
  const film = cloneFilm.querySelector(".film");
  const titulo = film.querySelector(".title");
  const img = film.querySelector(".img");
  const sinopsis = film.querySelector(".sinopsis");
  const fecha = film.querySelector(".fecha");
  const idioma = film.querySelector(".idioma");
  const actores = film.querySelector(".lista-actores");
  const directors = film.querySelector(".director");
  const genres = film.querySelector(".generos");
  const runtime = film.querySelector(".duracion");
  const budget = film.querySelector(".presupuesto");
  const revenue = film.querySelector(".recaudacion");

  function cambiarFormatoFecha(fecha) {
    let elementos = fecha.split("-");
    let year = elementos[0];
    let mes = elementos[1];
    let dia = elementos[2];
    return `${dia}-${mes}-${year}`;
  }

  titulo.textContent = title;
  img.src = `https://image.tmdb.org/t/p/w200/${poster_path}`;
  img.alt = title;
  sinopsis.textContent = overview;
  fecha.textContent = cambiarFormatoFecha(release_date);
  idioma.textContent = original_language;
  primerosActores.forEach((actor) => {
    const li = document.createElement("li");
    li.textContent = actor.name;
    actores.append(li);
  });
  directors.textContent = director.name;
  genres.textContent = generos.join(", ");
  runtime.textContent = `${duracion} minutos`;
  presupuesto === 0
    ? (budget.textContent = `Presupuesto no disponible.`)
    : (budget.textContent = `${presupuesto}$`);
  recaudacion === 0
    ? (revenue.textContent = `Recaudación no disponible.`)
    : (revenue.textContent = `${recaudacion}$`);
  film.id = id;
  film.generosID = genre_ids;

  return film;
}

function crearElementoPelicula(pelicula) {
  const film = crearPelicula(pelicula);
  marcarFavoritaPendiente(film);
  expandirSinopsis(film);
  verMasDatos(film);
  redirigirTMDB(film);
  return film;
}

function marcarFavoritaPendiente(film) {
  const favorita = film.querySelector("input.favorita");
  const pendiente = film.querySelector("input.pendiente");

  let titulo = film.querySelector(".title").textContent;
  let src = film.querySelector(".img").src;
  let sinopsis = film.querySelector(".sinopsis").textContent;
  let fecha = film.querySelector(".fecha").textContent;
  let idioma = film.querySelector(".idioma").textContent;
  let listaActores = film.querySelectorAll(".lista-actores li");
  let actores = [...listaActores].map((actor) => actor.textContent);
  let director = film.querySelector(".director").textContent;
  let generos = film.querySelector(".generos").textContent;
  let duracion = film.querySelector(".duracion").textContent;
  let presupuesto = film.querySelector(".presupuesto").textContent;
  let recaudacion = film.querySelector(".recaudacion").textContent;

  const objetoPelicula = {
    title: titulo,
    poster_path: src,
    overview: sinopsis,
    release_date: fecha,
    original_language: idioma,
    primerosActores: actores,
    director: director,
    genres: generos,
    runtime: duracion,
    budget: presupuesto,
    revenue: recaudacion,
    id: film.id,
    genre_ids: film.generosID.join(", "),
  };

  favorita.addEventListener("change", (event) => {
    const checkbox = event.target;
    const container = checkbox.closest(".film");
    if (checkbox.checked) {
      container.style.backgroundColor = "#F1948A";
      arrayFavoritas.push(objetoPelicula);
    } else {
      container.style.backgroundColor = "";
      let index = arrayFavoritas.findIndex(
        (pelicula) => pelicula.title === objetoPelicula.title
      );
      if (index != -1) {
        arrayFavoritas.splice(index, 1);
      }
    }
    localStorage.setItem("favoriteFilms", JSON.stringify(arrayFavoritas));
  });

  pendiente.addEventListener("change", (event) => {
    const checkbox = event.target;
    const container = checkbox.closest(".film");
    if (checkbox.checked) {
      container.style.backgroundColor = "#E59BCB";
      arrayPendientes.push(objetoPelicula);
    } else {
      container.style.backgroundColor = "";
      let index = arrayPendientes.findIndex(
        (pelicula) => pelicula.title === objetoPelicula.title
      );
      if (index != -1) {
        arrayPendientes.splice(index, 1);
      }
    }
    localStorage.setItem("pendingFilms", JSON.stringify(arrayPendientes));
  });
}

function recuperarFavoritasPendientes() {
  let favoriteFilms = JSON.parse(localStorage.getItem("favoriteFilms")) || [];
  let pendingFilms = JSON.parse(localStorage.getItem("pendingFilms")) || [];

  favoriteFilms.forEach((film) => {
    let filmContainer = document.querySelectorAll(`.film`);
    filmContainer.forEach((container) => {
      if (film.title == container.querySelector("h3").textContent) {
        let favoriteInput = container.querySelector("input.favorita");
        favoriteInput.checked = true;
        container.style.backgroundColor = "#F1948A";
      }
    });
  });

  pendingFilms.forEach((film) => {
    let filmContainer = document.querySelectorAll(`.film`);
    filmContainer.forEach((container) => {
      if (film.title == container.querySelector("h3").textContent) {
        let pendingInput = container.querySelector("input.pendiente");
        pendingInput.checked = true;
        container.style.backgroundColor = "#E59BCB";
      }
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
  });
}

function redirigirTMDB(film) {
  const img = film.querySelector("img");
  const url = `https://www.themoviedb.org/movie/${film.id}`;
  img.addEventListener("click", () => {
    window.open(url, "_blank");
  });
}

function desbloquearInputYear() {
  if (inputTitulo.value == "") {
    inputYear.toggleAttribute("disabled");
    if (inputYear.disabled) {
      inputYear.value = "";
    }
  } else {
    inputYear.toggleAttribute("disabled");
  }
}

function mostrarPeliculas() {
  arrayPeliculas.forEach((pelicula) => {
    const film = crearElementoPelicula(pelicula);
    fragment.append(film);
  });
  sectionPeliculasCartelera.append(fragment);
}

function generosFavoritos() {
  let favoriteFilms = JSON.parse(localStorage.getItem("favoriteFilms")) || [];
  const generosFavoritos = {};

  favoriteFilms.forEach((pelicula) => {
    let ids = pelicula.genre_ids.split(", ");
    ids.forEach(
      (id) => (generosFavoritos[id] = (generosFavoritos[id] || 0) + 1)
    );
  });

  let masRepetidos = [];
  for (let id in generosFavoritos) {
    masRepetidos.push({ id: id, contador: generosFavoritos[id] });
  }

  masRepetidos.sort((a, b) => b.contador - a.contador);
  return masRepetidos.slice(0, 2);
}



//Eventos
inputTitulo.addEventListener("change", desbloquearInputYear);
botonLupa.addEventListener("click", () => {
  const buscador = document.querySelector("#buscador");
  buscador.classList.toggle("hidden");
  buscador.scrollIntoView({ behavior: "smooth" });
});

//Funciones asíncronas
async function getPeliculasCartelera() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?api_key=e9b9025b16a080677491c47682019682&language=es"
    );
    // const response = await fetch(
    //   "https://api.themoviedb.org/3/discover/movie?api_key=e9b9025b16a080677491c47682019682&language=es-ES&region=ES&primary_release_date.gte=2023-10-01&primary_release_date.lte=2023-11-30"
    // );
    if (!response.ok) {
      throw new Error(
        "No se ha podido obtener la lista de películas en cartelera."
      );
    }
    const peliculas = await response.json();
    const peliculasConActoresDirector = [];
    for (const pelicula of peliculas.results) {
      const response1 = await fetch(
        `https://api.themoviedb.org/3/movie/${pelicula.id}/credits?api_key=e9b9025b16a080677491c47682019682&language=es`
      );
      const creditos = await response1.json();
      const primerosActores = creditos.cast.slice(0, 3);
      const director = creditos.crew.find(
        (persona) => persona.job === "Director"
      );
      const actoresDirector = { primerosActores, director };

      const response2 = await fetch(
        `https://api.themoviedb.org/3/movie/${pelicula.id}?api_key=e9b9025b16a080677491c47682019682`
      );
      const otrosDatos = await response2.json();
      const presupuesto = otrosDatos.budget;
      const recaudacion = otrosDatos.revenue;
      const duracion = otrosDatos.runtime;
      const generos = otrosDatos.genres.map((genero) => genero.name);
      const datosComplementarios = {
        presupuesto,
        recaudacion,
        duracion,
        generos,
      };

      peliculasConActoresDirector.push({
        pelicula,
        actoresDirector,
        datosComplementarios,
      });
    }
    return peliculasConActoresDirector;
  } catch (error) {
    return console.log(`Error: ${error.message}`);
  }
}

async function buscarPelicula() {
  const titulo = document.querySelector("input#titulos").value;
  const year = document.querySelector("input#year").value;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=e9b9025b16a080677491c47682019682&query=${titulo}&language=es&primary_release_year=${year}`
    );
    if (!response.ok) {
      throw new Error(`No se ha encontrado la película ${titulo}`);
    }
    const pelicula = await response.json();
    if (pelicula.results.length > 0) {
      const response1 = await fetch(
        `https://api.themoviedb.org/3/movie/${pelicula.results[0].id}/credits?api_key=e9b9025b16a080677491c47682019682&language=es`
      );
      const data1 = await response1.json(); //
      const primerosActores = data1.cast.slice(0, 3); //
      const director = data1.crew.find((persona) => persona.job === "Director");
      const actoresDirector = { primerosActores, director };

      const response2 = await fetch(
        `https://api.themoviedb.org/3/movie/${pelicula.results[0].id}?api_key=e9b9025b16a080677491c47682019682`
      );
      const otrosDatos = await response2.json();
      const presupuesto = otrosDatos.budget;
      const recaudacion = otrosDatos.revenue;
      const duracion = otrosDatos.runtime;
      const generos = otrosDatos.genres.map((genero) => genero.name);
      const datosComplementarios = {
        presupuesto,
        recaudacion,
        duracion,
        generos,
      };

      const peliculasConActoresDirector = {
        pelicula: pelicula.results[0],
        actoresDirector: actoresDirector,
        datosComplementarios: datosComplementarios,
      };

      return peliculasConActoresDirector;
    } else {
      throw new Error(`No se ha encontrado la película ${titulo}`);
    }
  } catch (error) {
    sectionBusquedaPeliculas.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = error.message;
    sectionBusquedaPeliculas.append(span);
  }
}

async function peliculasRecomendadas() {
  const genres = generosFavoritos().map((generos) => generos.id);
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=e9b9025b16a080677491c47682019682&language=es&with_genres=${genres}`
    );
    if (!response.ok) {
      throw new Error(`No se han podido recuperar las películas recomendadas.`);
    }
    const pelicula = await response.json();
    return pelicula.results;
  } catch (error) {
    console.error(`Error: ` + error.message);
  }
}

//Manejo funciones asíncronas
getPeliculasCartelera()
  .then((peliculas) => {
    arrayPeliculas = [...peliculas];
    mostrarPeliculas();
    recuperarFavoritasPendientes();
  })
  .catch((error) => console.error(error));

botonBuscar.addEventListener("click", () => {
  buscarPelicula()
    .then((pelicula) => {
      if (pelicula) {
        sectionBusquedaPeliculas.innerHTML = "";
        const film = crearElementoPelicula(pelicula);
        fragment.append(film);
        sectionBusquedaPeliculas.append(fragment);
        recuperarFavoritasPendientes();
      }
    })
    .catch((error) => console.error(error));
});

peliculasRecomendadas()
  .then((peliculas) => {
    generosFavoritos();
    peliculas.forEach((pelicula) => {
      const clone = templateRecomendadas.cloneNode(true);
      const film = clone.querySelector(".film-recomendadas");
      const img = film.querySelector(".img");
      img.src = `https://image.tmdb.org/t/p/w200/${pelicula.poster_path}`;
      img.alt = `Imagen de la película ${pelicula.title}.`;
      film.id = pelicula.id;
      fragment.append(film);
      document.querySelector(".peliculas-recomendadas").append(fragment);
      redirigirTMDB(film);
    });
  })
  .catch((error) => console.error(error));
