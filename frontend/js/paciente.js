// Lógica de las pantallas de la rama PACIENTE de DesPreocúpate+ (Persona 2).
// Cada página indica cuál es con <body data-pagina="...">.
// De momento todo es una maqueta: los datos están escritos aquí y se guardan
// en el navegador. Cuando exista el backend, se sustituirán por llamadas a la API.

// ---------- Datos de ejemplo (los del diseño de Figma) ----------
var CATEGORIAS = {
    entrenadores: {
        titulo: "Entrenadores",
        especialidad: "Entrenamiento",
        servicio: "Sesión de entrenamiento",
        profesionales: [
            { nombre: "Laura Márquez", detalle: "entrenamiento aeróbico", nota: "4.8", precio: 50 },
            { nombre: "Pedro Pérez", detalle: "entrenamiento en fuerza", nota: "4.9", precio: 65 },
            { nombre: "Ricardo Martín", detalle: "entrenamiento en resistencia", nota: "4.7", precio: 35 },
            { nombre: "Paula Lomano", detalle: "ganancia de peso y fuerza", nota: "4.6", precio: 55 }
        ]
    },
    nutricionistas: {
        titulo: "Nutricionistas",
        especialidad: "Nutrición",
        servicio: "Consulta de nutrición",
        profesionales: [
            { nombre: "Laura Márquez", detalle: "Especialista en Diabetes", nota: "4.8", precio: 50 },
            { nombre: "Pedro Pérez", detalle: "Especialista en desórdenes alimenticios", nota: "4.9", precio: 65 },
            { nombre: "Ricardo Martín", detalle: "Máster en Nutrición y salud", nota: "4.7", precio: 35 },
            { nombre: "Paula Lomano", detalle: "Especialista en obesidad", nota: "4.6", precio: 55 }
        ]
    },
    psicologos: {
        titulo: "Psicólogos",
        especialidad: "Psicoterapia",
        servicio: "Sesión psicoterapéutica",
        profesionales: [
            { nombre: "Laura Márquez", detalle: "Ansiedad y estrés", nota: "4.8", precio: 50 },
            { nombre: "Pedro Pérez", detalle: "Trauma", nota: "4.9", precio: 65 },
            { nombre: "Ricardo Martín", detalle: "ERMD", nota: "4.7", precio: 35 },
            { nombre: "Paula Lomano", detalle: "Ansiedad y estrés", nota: "4.6", precio: 55 }
        ]
    },
    fisioterapeutas: {
        titulo: "Fisioterapeutas",
        especialidad: "Fisioterapia",
        servicio: "Sesión de fisioterapia",
        profesionales: [
            { nombre: "Laura Márquez", detalle: "fisioterapia deportiva", nota: "4.8", precio: 50 },
            { nombre: "Pedro Pérez", detalle: "rehabilitación", nota: "4.9", precio: 65 },
            { nombre: "Ricardo Martín", detalle: "fisioterapia ortopédica", nota: "4.7", precio: 35 },
            { nombre: "Paula Lomano", detalle: "rehabilitación", nota: "4.6", precio: 55 }
        ]
    }
};

var NOMBRES_DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
var ABREV_DIA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
var NOMBRES_MES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Franjas de ejemplo; "ocupada" simula una hora que ya no está libre.
var HORAS = [
    { texto: "5:00 PM", ocupada: true },
    { texto: "10:00 PM", ocupada: false },
    { texto: "11:30 PM", ocupada: false }
];

// Cita que se enseña si el paciente todavía no ha reservado ninguna (es la del Figma).
var CITA_DEMO = {
    nombre: "Laura Márquez",
    detalle: "Ansiedad y estrés",
    nota: "4.8",
    precio: 50,
    servicio: "Sesión psicoterapéutica",
    especialidad: "Psicoterapia",
    tipo: "Online",
    anio: 2026, mes: 9, dia: 5,
    hora: "10:00 PM",
    estado: "Confirmada"
};

// ---------- Utilidades ----------
function guardar(almacen, clave, valor) {
    try { almacen.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
}

function leer(almacen, clave) {
    try {
        var texto = almacen.getItem(clave);
        return texto ? JSON.parse(texto) : null;
    } catch (e) {
        return null;
    }
}

function borrar(almacen, clave) {
    try { almacen.removeItem(clave); } catch (e) { /* sin almacenamiento */ }
}

function obtenerCita() {
    return leer(localStorage, "despreocupate_cita") || CITA_DEMO;
}

function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) { el.className = clase; }
    if (texto !== undefined) { el.textContent = texto; }
    return el;
}

function iniciales(nombre) {
    return nombre.split(" ").slice(0, 2).map(function (p) { return p.charAt(0); }).join("");
}

function fechaLarga(anio, mes, dia) {
    var d = new Date(anio, mes, dia);
    return NOMBRES_DIA[d.getDay()] + " " + dia + " de " + NOMBRES_MES[mes];
}

function conMayuscula(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function tarjetaProfesional(p, esBoton) {
    var tarjeta = crear(esBoton ? "button" : "div", "profesional");
    if (esBoton) { tarjeta.type = "button"; }

    // Aquí iría <img> con la foto del profesional cuando se exporte desde Figma.
    tarjeta.appendChild(crear("div", "foto", iniciales(p.nombre)));

    var info = crear("div", "info");
    info.appendChild(crear("b", "", p.nombre));
    info.appendChild(crear("small", "", p.detalle));

    var puntos = crear("div", "puntos");
    var nota = crear("span");
    nota.appendChild(crear("span", "estrella", "★ "));
    nota.appendChild(document.createTextNode(p.nota));
    puntos.appendChild(nota);
    puntos.appendChild(crear("span", "", p.precio + " €/h"));
    info.appendChild(puntos);

    tarjeta.appendChild(info);
    return tarjeta;
}

function ponerTexto(id, texto) {
    var el = document.getElementById(id);
    if (el) { el.textContent = texto; }
}

// ---------- Inicio ----------
function paginaInicio() {
    var cita = obtenerCita();
    ponerTexto("cita-titulo", cita.especialidad + " con " + cita.nombre);
    ponerTexto("cita-fecha", ABREV_DIA[new Date(cita.anio, cita.mes, cita.dia).getDay()] + ", " +
        cita.dia + " " + NOMBRES_MES[cita.mes].slice(0, 3) + ". | " + cita.hora);
}

// ---------- Reserva (profesional, día y hora) ----------
function paginaReserva() {
    var clave = new URLSearchParams(window.location.search).get("categoria");
    var categoria = CATEGORIAS[clave];
    if (!categoria) {
        window.location.href = "buscador.html";
        return;
    }

    document.title = categoria.titulo;
    ponerTexto("titulo-pagina", categoria.titulo);

    var elegido = { profesional: null, dia: null, hora: null };

    // 1. Profesionales
    var rejilla = document.getElementById("lista-profesionales");
    categoria.profesionales.forEach(function (p) {
        var tarjeta = tarjetaProfesional(p, true);
        tarjeta.addEventListener("click", function () {
            rejilla.querySelectorAll(".profesional").forEach(function (t) { t.classList.remove("seleccionado"); });
            tarjeta.classList.add("seleccionado");
            elegido.profesional = p;
        });
        rejilla.appendChild(tarjeta);
    });

    // 2. Días (octubre de 2026, el miércoles 7 está ocupado como en el diseño)
    var listaDias = document.getElementById("lista-dias");
    for (var n = 5; n <= 11; n++) {
        (function (numero) {
            var fecha = new Date(2026, 9, numero);
            var boton = crear("button", "dia");
            boton.type = "button";
            boton.appendChild(document.createTextNode(ABREV_DIA[fecha.getDay()]));
            boton.appendChild(document.createElement("br"));
            boton.appendChild(document.createTextNode(String(numero)));
            boton.appendChild(document.createElement("br"));
            boton.appendChild(document.createTextNode("oct"));
            if (numero === 7) { boton.disabled = true; }
            boton.addEventListener("click", function () {
                listaDias.querySelectorAll(".dia").forEach(function (d) { d.classList.remove("seleccionado"); });
                boton.classList.add("seleccionado");
                elegido.dia = numero;
            });
            listaDias.appendChild(boton);
        })(n);
    }

    document.getElementById("dias-izq").addEventListener("click", function () { listaDias.scrollLeft -= 120; });
    document.getElementById("dias-der").addEventListener("click", function () { listaDias.scrollLeft += 120; });

    // 3. Horas
    var listaHoras = document.getElementById("lista-horas");
    HORAS.forEach(function (h) {
        var boton = crear("button", "hora", h.ocupada ? h.texto + " ocupado" : h.texto);
        boton.type = "button";
        if (h.ocupada) { boton.disabled = true; }
        boton.addEventListener("click", function () {
            listaHoras.querySelectorAll(".hora").forEach(function (x) { x.classList.remove("seleccionado"); });
            boton.classList.add("seleccionado");
            elegido.hora = h.texto;
        });
        listaHoras.appendChild(boton);
    });

    // Continuar
    document.getElementById("continuar").addEventListener("click", function () {
        var aviso = document.getElementById("aviso");
        if (!elegido.profesional || !elegido.dia || !elegido.hora) {
            aviso.textContent = "Selecciona un profesional, un día y una hora.";
            return;
        }
        guardar(sessionStorage, "despreocupate_reserva", {
            nombre: elegido.profesional.nombre,
            detalle: elegido.profesional.detalle,
            nota: elegido.profesional.nota,
            precio: elegido.profesional.precio,
            servicio: categoria.servicio,
            especialidad: categoria.especialidad,
            tipo: "Online",
            anio: 2026, mes: 9, dia: elegido.dia,
            hora: elegido.hora,
            estado: "Confirmada"
        });
        window.location.href = "pago.html";
    });
}

// ---------- Pago ----------
function paginaPago() {
    var reserva = leer(sessionStorage, "despreocupate_reserva");
    if (!reserva) {
        window.location.href = "buscador.html";
        return;
    }

    ponerTexto("pago-servicio", "Servicio: " + reserva.servicio);
    ponerTexto("pago-fecha", "Fecha: " + fechaLarga(reserva.anio, reserva.mes, reserva.dia));
    ponerTexto("pago-hora", "Hora: " + reserva.hora);
    document.getElementById("pago-profesional").appendChild(tarjetaProfesional(reserva, false));

    // Formato cómodo de la tarjeta: grupos de 4 dígitos y MM/AA
    var numero = document.getElementById("numero");
    numero.addEventListener("input", function () {
        var digitos = numero.value.replace(/\D/g, "").slice(0, 16);
        numero.value = digitos.replace(/(\d{4})(?=\d)/g, "$1 ");
    });

    var caducidad = document.getElementById("caducidad");
    caducidad.addEventListener("input", function () {
        var digitos = caducidad.value.replace(/\D/g, "").slice(0, 4);
        caducidad.value = digitos.length > 2 ? digitos.slice(0, 2) + "/" + digitos.slice(2) : digitos;
    });

    document.getElementById("formulario-pago").addEventListener("submit", function (evento) {
        evento.preventDefault();
        var aviso = document.getElementById("aviso");
        var mesTarjeta = parseInt(caducidad.value.slice(0, 2), 10);

        if (document.getElementById("titular").value.trim().length < 3) {
            aviso.textContent = "Escribe el nombre del titular.";
        } else if (numero.value.replace(/\s/g, "").length !== 16) {
            aviso.textContent = "El número de tarjeta debe tener 16 dígitos.";
        } else if (!/^\d{2}\/\d{2}$/.test(caducidad.value) || mesTarjeta < 1 || mesTarjeta > 12) {
            aviso.textContent = "La caducidad debe tener el formato MM/AA.";
        } else if (!/^\d{3}$/.test(document.getElementById("cvc").value)) {
            aviso.textContent = "El CVC debe tener 3 dígitos.";
        } else {
            // IMPORTANTE: no se guarda ningún dato de la tarjeta. Esto es solo una maqueta;
            // el cobro real lo hará el backend con Stripe.
            guardar(localStorage, "despreocupate_cita", reserva);
            borrar(sessionStorage, "despreocupate_reserva");
            window.location.href = "pago-exitoso.html";
        }
    });
}

// ---------- Confirmación del pago ----------
function paginaPagoExitoso() {
    var cita = obtenerCita();
    ponerTexto("exito-texto", "Tu cita con " + cita.nombre + " para " + cita.servicio + " ha sido confirmada");
    document.getElementById("exito-profesional").appendChild(tarjetaProfesional(cita, false));
    ponerTexto("exito-fecha", fechaLarga(cita.anio, cita.mes, cita.dia) + ", " + cita.hora);
}

// ---------- Agenda ----------
function paginaAgenda() {
    var cita = obtenerCita();
    var anio = cita.anio;
    var mes = cita.mes;

    function dibujarCalendario() {
        ponerTexto("mes-actual", conMayuscula(NOMBRES_MES[mes]) + " " + anio);
        var cuerpo = document.getElementById("cuerpo-calendario");
        cuerpo.textContent = "";

        var primero = new Date(anio, mes, 1).getDay();      // 0 = domingo
        var huecos = (primero + 6) % 7;                       // la semana empieza en lunes
        var totalDias = new Date(anio, mes + 1, 0).getDate();
        var dia = 1 - huecos;

        while (dia <= totalDias) {
            var fila = document.createElement("tr");
            for (var c = 0; c < 7; c++, dia++) {
                var celda = document.createElement("td");
                if (dia >= 1 && dia <= totalDias) {
                    var marca = crear("span", "marca-dia", String(dia));
                    if (cita.anio === anio && cita.mes === mes && cita.dia === dia) {
                        marca.classList.add("con-cita");
                    }
                    celda.appendChild(marca);
                }
                fila.appendChild(celda);
            }
            cuerpo.appendChild(fila);
        }
    }

    document.getElementById("mes-anterior").addEventListener("click", function () {
        mes--;
        if (mes < 0) { mes = 11; anio--; }
        dibujarCalendario();
    });
    document.getElementById("mes-siguiente").addEventListener("click", function () {
        mes++;
        if (mes > 11) { mes = 0; anio++; }
        dibujarCalendario();
    });
    dibujarCalendario();

    ponerTexto("agenda-nombre", cita.nombre);
    ponerTexto("agenda-detalle", cita.detalle);
    ponerTexto("agenda-fecha", fechaLarga(cita.anio, cita.mes, cita.dia) + ", " + cita.hora);
    ponerTexto("agenda-estado", cita.estado);
    document.getElementById("agenda-foto").textContent = iniciales(cita.nombre);
}

// ---------- Detalles de la cita ----------
function paginaDetalles() {
    var cita = obtenerCita();
    var correo = cita.nombre.normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/\s+/g, "") + "@email.com";

    document.getElementById("detalle-foto").textContent = iniciales(cita.nombre);
    ponerTexto("detalle-nombre", cita.nombre);
    ponerTexto("detalle-especialidad-titulo", cita.especialidad);
    ponerTexto("detalle-correo", correo);
    ponerTexto("detalle-fecha", conMayuscula(fechaLarga(cita.anio, cita.mes, cita.dia)));
    ponerTexto("detalle-hora", cita.hora);
    ponerTexto("detalle-especialidad", cita.especialidad);
    ponerTexto("detalle-tipo", cita.tipo);
    ponerTexto("detalle-estado", cita.estado);

    document.getElementById("cancelar").addEventListener("click", function () {
        if (confirm("¿Seguro que quieres cancelar esta cita?")) {
            borrar(localStorage, "despreocupate_cita");
            window.location.href = "agenda.html";
        }
    });
}

// ---------- Historial ----------
function descargarHistorial(evento) {
    evento.preventDefault();
    alert("La descarga del PDF estará disponible cuando esté conectado el backend.");
}

// ---------- Arranque ----------
document.addEventListener("DOMContentLoaded", function () {
    var pagina = document.body.dataset.pagina;
    var paginas = {
        inicio: paginaInicio,
        reserva: paginaReserva,
        pago: paginaPago,
        "pago-exitoso": paginaPagoExitoso,
        agenda: paginaAgenda,
        detalles: paginaDetalles
    };
    if (paginas[pagina]) { paginas[pagina](); }
});
