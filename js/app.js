// Variables
let carrito = [];
let ordenAscendente = true;
let ordenPrecioAscendente = true;
let listaJuegos = [];
let juegosFiltrados = [];

const validacionMayor = document.getElementById("btnMayorEdad");
const validacionMenor = document.getElementById("btnMenorEdad");
const catalogo = document.getElementById("catalogo");
const carritoContainer = document.getElementById("carrito-container");
const hideContainer = document.getElementById("hide-container");
const ordenarAlfabeticamente = document.getElementById("alfabetico");
const ordenarPrecio = document.getElementById("precio");
let filtroMenor = [];

// Funciones

// Actualiza el catálogo completo en la página
function catalogoCompleto(array) {
    catalogo.innerHTML = array.map((juego) => `
    <div class="col-12 my-2">
      <div id="${juego.id}" class="row">
        <div class="col-3">
          <img class="img-juego" style="height: 200px;" src="img/${juego.imagen}" alt="${juego.titulo}">
        </div>
        <div class="col-9">
          <h2>${juego.titulo}</h2>
          <p class="${juego.precio}">Precio: ${juego.precio} USD</p>
          <button id="agregarBtn${juego.id}" class="btn-comprar">Agregar al carrito</button>
        </div>
      </div>
    </div>
  `).join("");

    array.forEach((juego) => {
        const agregarBtn = document.getElementById(`agregarBtn${juego.id}`);
        agregarBtn.addEventListener("click", () => agregarJuego(juego));
    });
}

// Agrega un juego al carrito según la validación de edad
function agregarJuego(juego) {
    if (carrito.some((juegoCarrito) => juegoCarrito.id === juego.id)) {
        Swal.fire({
            title: "Juego ya agregado",
            text: "Este juego ya está en el carrito.",
            icon: "info",
            confirmButtonText: "OK",
        });
        return;
    }

    carrito.push(juego);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoHTML();

    Swal.fire({
        title: "Juego agregado",
        text: "El juego se ha agregado al carrito correctamente.",
        icon: "success",
        confirmButtonText: "OK",
    });
}

// Elimina un juego del carrito
function eliminarJuego(juegoID) {
    const juegoIndex = carrito.findIndex((juego) => juego.id === juegoID);

    if (juegoIndex === -1) {
        console.log("No se encontró ningún juego con ese ID en el carrito.");
        return;
    }

    const juegoAEliminar = carrito[juegoIndex];

    Swal.fire({
        title: `¿Eliminar ${juegoAEliminar.titulo} del carrito?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.splice(juegoIndex, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarCarritoHTML();

            Swal.fire({
                title: "Juego eliminado",
                text: `${juegoAEliminar.titulo} se ha eliminado del carrito correctamente.`,
                icon: "success",
                confirmButtonText: "OK",
            });
        }
    });
}

// Filtra los juegos según la edad y actualiza el catálogo
function filtrarJuegos(mayorDeEdad) {
    if (mayorDeEdad) {
        catalogoCompleto(listaJuegos);
    } else {
        juegosFiltrados = listaJuegos.filter(juego => juego.menorEdad === true);
        catalogoCompleto(juegosFiltrados);
    }
}

// Muestra el menú de la tienda según la validación de edad
function menuTienda(edad) {
    filtrarJuegos(edad);

    // Mostrar el catálogo y el contenedor del carrito
    catalogo.style.display = "block";
    carritoContainer.style.display = "block";
    hideContainer.style.display = "block";
}

// Cargar el carrito almacenado en localStorage
const carritoStorage = localStorage.getItem("carrito");
if (carritoStorage) {
    carrito = JSON.parse(carritoStorage);
}

// Función para calcular la suma total de los precios de los juegos en el carrito
function calcularTotal() {
    return carrito.reduce((total, juego) => total + juego.precio, 0);
}

// Función para finalizar la compra
async function finalizarCompra() {
    const confirmResult = await Swal.fire({
        title: "¿Finalizar compra?",
        text: "¿Estás seguro de que deseas finalizar la compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, finalizar",
        cancelButtonText: "Cancelar",
    });

    if (confirmResult.isConfirmed) {
        Swal.fire({
            title: "Procesando pago...",
            html: "Por favor, espera un momento.<br><i class='fa fa-spinner fa-spin'></i>",
            showConfirmButton: false,
            allowOutsideClick: false,
        });

        // Simulación de procesamiento de pago (por ejemplo, esperar 2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        Swal.fire({
            title: "¡Compra finalizada!",
            text: "Gracias por tu compra.",
            icon: "success",
        });

        // Luego, podemos limpiar el carrito ya que la compra ha sido realizada.
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarritoHTML();
    }
}

// Actualiza el carrito en el HTML
function actualizarCarritoHTML() {
    carritoContainer.innerHTML = carrito.length === 0
        ? "<p>No tienes ningún juego en el carrito de compras.</p>"
        : carrito.map((juego) => `
      <div id="${juego.id}" class="row">
        <div class="col-3">
          <img class="img-juego" style="height: 100px;" src="img/${juego.imagen}" alt="${juego.titulo}">
        </div>
        <div class="col-6">
          <h4>${juego.titulo}</h4>
          <p class="${juego.precio}">Precio: ${juego.precio} USD</p>
        </div>
        <div class="col-3">
          <button class="btn-eliminar" id="eliminarBtn${juego.id}">Eliminar</button>
        </div>
      </div>
    `).join("");

    // Mostrar la suma total de los precios
    const totalContainer = document.createElement("div");
    totalContainer.innerHTML = `<p class="total">Total: ${calcularTotal()} USD</p>`;
    carritoContainer.appendChild(totalContainer);

    // Agregar el botón de "Finalizar compra"
    const finalizarBtn = document.createElement("button");
    finalizarBtn.innerText = "Finalizar compra";
    finalizarBtn.classList.add("btn-finalizar");
    finalizarBtn.addEventListener("click", finalizarCompra);
    carritoContainer.appendChild(finalizarBtn);

    // Configurar eventos click para los botones "Eliminar" en el carrito
    carrito.forEach((juego) => {
        const eliminarBtn = document.getElementById(`eliminarBtn${juego.id}`);
        eliminarBtn.addEventListener("click", () => eliminarJuego(juego.id));
    });
}

// Listeners
validacionMayor.addEventListener("click", () => {
    document.getElementById("container-edad").hidden = true;
    menuTienda(true);
    localStorage.setItem("mayorDeEdad", true);
});

validacionMenor.addEventListener("click", () => {
    document.getElementById("container-edad").hidden = true;
    menuTienda(false);
    localStorage.setItem("mayorDeEdad", false);
    filtrarJuegos(false);
});

// Cargar los juegos desde el archivo JSON al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    cargarJuegos();
});

ordenarAlfabeticamente.addEventListener("click", (e) => {
    e.preventDefault();
    actualizarCatalogoOrdenado();
});

ordenarPrecio.addEventListener("click", (e) => {
    e.preventDefault();
    actualizarCatalogoOrdenadoPorPrecio();
});

const fullCatalogo = localStorage.getItem("mayorDeEdad");

if (fullCatalogo === "true") {
    document.getElementById("container-edad").hidden = true;
    menuTienda(true);
} else if (fullCatalogo === "false") {
    document.getElementById("container-edad").hidden = true;
    menuTienda(false);
} else {
    document.getElementById("container-edad").hidden = false;
    carritoContainer.style.display = "none";
}

// Función para ordenar los juegos alfabéticamente por título
function ordenarJuegosAlfabeticamente() {
    if (ordenAscendente) {
        listaJuegos.sort((juego1, juego2) => juego1.titulo.localeCompare(juego2.titulo));
    } else {
        listaJuegos.sort((juego1, juego2) => juego2.titulo.localeCompare(juego1.titulo));
    }

    // Verificar si se han filtrado juegos para menores de edad
    if (juegosFiltrados.length > 0) {
        juegosFiltrados.sort((juego1, juego2) => ordenAscendente
            ? juego1.titulo.localeCompare(juego2.titulo)
            : juego2.titulo.localeCompare(juego1.titulo));
    }

    // Cambiar el estado del ordenamiento en cada llamada
    ordenAscendente = !ordenAscendente;

    // Actualizar el catálogo según los juegos filtrados si es necesario
    const fullCatalogo = localStorage.getItem("mayorDeEdad");
    catalogoCompleto(fullCatalogo === "true" ? listaJuegos : juegosFiltrados);
}

// Función para actualizar el catálogo en el HTML con los juegos ordenados
function actualizarCatalogoOrdenado() {
    ordenarJuegosAlfabeticamente();
    const fullCatalogo = localStorage.getItem("mayorDeEdad");
    const juegosMostrados = fullCatalogo === "true" ? listaJuegos : juegosFiltrados;
    catalogoCompleto(juegosMostrados);
}

// Función para ordenar los juegos por precio
function ordenarJuegosPorPrecio() {
    if (ordenPrecioAscendente) {
        listaJuegos.sort((juego1, juego2) => juego1.precio - juego2.precio);
    } else {
        listaJuegos.sort((juego1, juego2) => juego2.precio - juego1.precio);
    }

    if (juegosFiltrados.length > 0) {
        juegosFiltrados.sort((juego1, juego2) => ordenPrecioAscendente
            ? juego1.precio - juego2.precio
            : juego2.precio - juego1.precio);
    }

    ordenPrecioAscendente = !ordenPrecioAscendente;

    const fullCatalogo = localStorage.getItem("mayorDeEdad");
    catalogoCompleto(fullCatalogo === "true" ? listaJuegos : juegosFiltrados);
}

// Función para actualizar el catálogo en el HTML con los juegos ordenados por precio
function actualizarCatalogoOrdenadoPorPrecio() {
    ordenarJuegosPorPrecio();
    const fullCatalogo = localStorage.getItem("mayorDeEdad");
    const juegosMostrados = fullCatalogo === "true" ? listaJuegos : juegosFiltrados;
    catalogoCompleto(juegosMostrados);
}

// Función para cargar los juegos desde el archivo JSON
async function cargarJuegos() {
    try {
        const response = await fetch("./juegos.json");
        if (!response.ok) {
            throw new Error("Error al cargar los juegos.");
        }
        const data = await response.json();
        listaJuegos = data;

        const fullCatalogo = localStorage.getItem("mayorDeEdad");
        if (fullCatalogo === "true") {
            document.getElementById("container-edad").hidden = true;
            menuTienda(true);
        } else if (fullCatalogo === "false") {
            document.getElementById("container-edad").hidden = true;
            menuTienda(false);
        } else {
            document.getElementById("container-edad").hidden = false;
            carritoContainer.style.display = "none";
        }

        // Filtrar los juegos para menores de edad si es necesario
        if (!fullCatalogo || fullCatalogo === "false") {
            juegosFiltrados = listaJuegos.filter(juego => juego.menorEdad === true);
        }

        // Mostrar el catálogo completo al cargar la página
        catalogoCompleto(fullCatalogo === "true" ? listaJuegos : juegosFiltrados);
    } catch (error) {
        console.error("Error al cargar los juegos:", error);
    }
}