
const vistaInicial = document.getElementById('vistaInicial');
const tablero = document.getElementById('tablero');
const dificultad = document.getElementById('dificultad');
const botonMezclar = document.getElementById('mezclar');
const mensajeVictoria = document.getElementById('mensajeVictoria');

let lado =  Number(dificultad.value);
let fichas = [];
let resuelto = false;

function crearTablero() {
    fichas = [];

    for (let i = 1; i < lado * lado; i++) {
        fichas.push(i);
    }
    fichas.push(0);

    document.documentElement.style.setProperty('--lado', lado);
    mostrarTablero();
}

function mostrarTablero() {

    tablero.innerHTML = '';
    const tamFicha = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--ficha')
    );

    fichas.forEach((numero, posicion) => {
        const ficha = document.createElement('button');
        ficha.classList.add('ficha');

        if (numero === 0) {
            ficha.classList.add('vacia');
        } else {
            const fila = Math.floor((numero - 1) / lado);
            const columna = (numero - 1) % lado;

            ficha.style.backgroundSize = `${lado * tamFicha}px ${lado * tamFicha}px`;
            ficha.style.backgroundPosition = `${columna * -tamFicha}px ${fila * -tamFicha}px`;
        }

        ficha.addEventListener('click', () => moverFicha(posicion));
        tablero.appendChild(ficha);
    });
}

function moverFicha(posicion) {

    if (resuelto) {
        return;
    }

    const vacia = fichas.indexOf(0);
    const fila = Math.floor(posicion / lado);
    const columna = posicion % lado;
    const filaVacia = Math.floor(vacia / lado);
    const columnaVacia = vacia % lado;

    if (
        (Math.abs(fila - filaVacia) === 1 && columna === columnaVacia) ||
        (Math.abs(columna - columnaVacia) === 1 && fila === filaVacia)
    ){
        [fichas[posicion], fichas[vacia]] = 
            [fichas[vacia], fichas[posicion]];

        mostrarTablero();
        comprobarVictoria();
    }
}

function mezclar() {

    resuelto = false;
    mensajeVictoria.textContent = '';
    const movimientos = lado * lado * 20;

    for (let i = 0; i < movimientos; i++) {
        const vacia = fichas.indexOf(0);
        const movimientosPosibles = [];

        if (vacia >= lado) {movimientosPosibles.push(vacia - lado);
        }

        if (vacia < lado * (lado - 1)) {
            movimientosPosibles.push(vacia + lado);
        }

        if (vacia % lado !== 0) {
            movimientosPosibles.push(vacia - 1);
        }

        if (vacia % lado !== lado - 1) {
            movimientosPosibles.push(vacia + 1);
        }

        const posicion = movimientosPosibles[
            Math.floor(Math.random() * movimientosPosibles.length)
        ];

        [fichas[posicion], fichas[vacia]] =
            [fichas[vacia], fichas[posicion]];
    }

    mostrarTablero();
}

function comprobarVictoria() {
    for (let i = 0; i < fichas.length - 1; i++) {
        if (fichas[i] !== i + 1) {
            return;
        }
    }

    if (fichas[fichas.length - 1] === 0) {
        resuelto = true;
        mensajeVictoria.textContent = '¡Felicidades! Has resuelto el rompecabezas.';
        mensajeVictoria.style.display = 'block';
    }
}

botonMezclar.addEventListener('click', () => {
    vistaInicial.style.display = 'none';
    tablero.style.display = 'grid';
    mezclar();
});

dificultad.addEventListener('change', () => {
    lado = Number(dificultad.value);
    mensajeVictoria.textContent = '';

    crearTablero();
    tablero.style.display = 'none';
    vistaInicial.style.display = 'block';
});

crearTablero();
tablero.style.display = 'none';
vistaInicial.style.display = 'block';
