"use strict";

class Memoria {
    // --- Atributos privados ---
    #cartasVolteadas;
    #parejasEncontradas;
    #tableroBloqueado;
    #primeraCarta;
    #segundaCarta;
    #juegoIniciado;
    #cronometro;

    constructor() {
        this.#cartasVolteadas = [];
        this.#parejasEncontradas = 0;

        this.#tableroBloqueado = false;
        this.#primeraCarta = null;
        this.#segundaCarta = null;
        
        this.#juegoIniciado = false;
        this.#cronometro = new Cronometro();
        
        // Inicializar el juego cuando se cree la instancia
        this.#barajarCartas();
    }

    // --- Métodos privados auxiliares ---
    #barajarCartas() {
        const main = document.querySelector('main');
        const cartas = main.children;
        const numeroCartas = cartas.length - 2;

        for (let i = numeroCartas + 1; i >= 3; i--) {
            const j = Math.floor(Math.random() * (i - 2)) + 2;
            main.appendChild(cartas[j]);
        }
    }

    #reiniciarAtributos() {
        this.#tableroBloqueado = false;
        this.#primeraCarta = null;
        this.#segundaCarta = null;
    }

    #cubrirCartas() {
        this.#tableroBloqueado = true;
        setTimeout(() => {
            this.#primeraCarta.removeAttribute('data-estado');
            this.#segundaCarta.removeAttribute('data-estado');
            this.#reiniciarAtributos();
        }, 1500);
    }

    #comprobarPareja() {
        const imgPrimeraCarta = this.#primeraCarta.children[1];
        const imgSegundaCarta = this.#segundaCarta.children[1];
        
        const srcPrimeraCarta = imgPrimeraCarta.getAttribute('src');
        const srcSegundaCarta = imgSegundaCarta.getAttribute('src');
        
        srcPrimeraCarta === srcSegundaCarta ? this.#deshabilitarCartas() : this.#cubrirCartas();
    }

    #comprobarJuego() {
        const todasLasCartas = document.querySelectorAll('main article');
        const cartasReveladas = document.querySelectorAll('main article[data-estado="revelada"]');
        
        if (todasLasCartas.length === cartasReveladas.length) {
            this.#cronometro.parar();
            const tiempoFinal = this.#cronometro.obtenerTiempoFormateado();
            alert(`¡Felicidades! Has completado el juego de memoria en ${tiempoFinal}`);
        }
    }

    #deshabilitarCartas() {
        this.#primeraCarta.dataset.estado = 'revelada';
        this.#segundaCarta.dataset.estado = 'revelada';
        
        this.#comprobarJuego();
        this.#reiniciarAtributos();
    }

    // --- Métodos públicos ---
    voltearCarta(carta) {
        if (!this.#juegoIniciado) {
            this.#cronometro.iniciar();
            this.#juegoIniciado = true;
        }

        if (carta.dataset.estado === 'revelada') return;
        if (carta.dataset.estado === 'volteada') return;
        if (this.#tableroBloqueado) return;

        carta.dataset.estado = "volteada";

        if (this.#primeraCarta == null) {
            this.#primeraCarta = carta;
            return;
        }

        if (this.#segundaCarta == null) {
            this.#segundaCarta = carta;
            this.#comprobarPareja();
        }
    }

    reiniciarJuego() {
        this.#cronometro.reset();
        this.#juegoIniciado = false;
        
        this.#reiniciarAtributos();
        this.#parejasEncontradas = 0;
        
        const todasLasCartas = document.querySelectorAll('main article');
        todasLasCartas.forEach(carta => carta.removeAttribute('data-estado'));
        
        this.#barajarCartas();
    }

    inicializarEventos() {
        const cartas = document.querySelectorAll('main article');
        cartas.forEach(carta => {
            carta.addEventListener('click', () => this.voltearCarta(carta));
        });
    }
}
