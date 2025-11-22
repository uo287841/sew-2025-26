"use strict";

/**
 * Clase que representa el juego de memoria con cartas
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Memoria {
    // Atributos privados
    #cartasVolteadas;
    #parejasEncontradas;
    #tableroBloqueado;
    #primeraCarta;
    #segundaCarta;
    #cronometro;

    /**
     * Constructor de la clase Memoria
     * No recibe parámetros
     */
    constructor() {
        this.#cartasVolteadas = [];
        this.#parejasEncontradas = 0;
        this.#tableroBloqueado = false;
        this.#primeraCarta = null;
        this.#segundaCarta = null;
        
        // Crear objeto de la clase Cronometro
        this.#cronometro = new Cronometro();
        
        // Inicializar el juego cuando se cree la instancia
        this.#barajarCartas();
        
        // Añadir event listeners a las cartas
        this.#añadirEventListeners();
        
        // Arrancar el cronómetro al iniciar el juego
        this.#cronometro.arrancar();
    }

    /**
     * Método privado que añade event listeners a las cartas
     */
    #añadirEventListeners() {
        const cartas = document.querySelectorAll('main article');
        
        cartas.forEach(carta => {
            carta.addEventListener('click', (event) => {
                this.voltearCarta(event.currentTarget);
            });
        });
    }

    /**
     * Método privado que baraja las cartas del juego de forma aleatoria
     */
    #barajarCartas() {
        const main = document.querySelector('main');
        const cartas = main.children;
        const numeroCartas = cartas.length - 2;
        
        for (let i = numeroCartas + 1; i >= 3; i--) {
            const j = Math.floor(Math.random() * (i - 2)) + 2;
            main.appendChild(cartas[j]);
        }
    }

    /**
     * Método privado que reinicia los atributos a sus valores iniciales
     */
    #reiniciarAtributos() {
        this.#tableroBloqueado = false;
        this.#primeraCarta = null;
        this.#segundaCarta = null;
    }

    /**
     * Método privado que pone bocabajo las cartas cuando no forman pareja
     */
    #cubrirCartas() {
        this.#tableroBloqueado = true;
        
        setTimeout(() => {
            this.#primeraCarta.removeAttribute('data-estado');
            this.#segundaCarta.removeAttribute('data-estado');
            this.#reiniciarAtributos();
        }, 1500);
    }

    /**
     * Método privado que comprueba si las dos cartas volteadas forman pareja
     */
    #comprobarPareja() {
        const imgPrimeraCarta = this.#primeraCarta.children[1];
        const imgSegundaCarta = this.#segundaCarta.children[1];
        
        const srcPrimeraCarta = imgPrimeraCarta.getAttribute('src');
        const srcSegundaCarta = imgSegundaCarta.getAttribute('src');
        
        srcPrimeraCarta === srcSegundaCarta ? this.#deshabilitarCartas() : this.#cubrirCartas();
    }

    /**
     * Método privado que comprueba si el juego ha terminado
     */
    #comprobarJuego() {
        const todasLasCartas = document.querySelectorAll('main article');
        const cartasReveladas = document.querySelectorAll('main article[data-estado="revelada"]');
        
        if (todasLasCartas.length === cartasReveladas.length) {
            this.#cronometro.parar();
            const tiempoFinal = this.#cronometro.obtenerTiempoFormateado();
            alert(`¡Felicidades! Has completado el juego de memoria en ${tiempoFinal}`);
        }
    }

    /**
     * Método privado que deshabilita las cartas que han formado una pareja
     */
    #deshabilitarCartas() {
        this.#primeraCarta.dataset.estado = 'revelada';
        this.#segundaCarta.dataset.estado = 'revelada';
        
        this.#comprobarJuego();
        this.#reiniciarAtributos();
    }

    /**
     * Método público que voltea una carta cuando el usuario hace clic en ella
     * @param {HTMLElement} carta - Elemento article que representa la carta
     */
    voltearCarta(carta) {
        // Comprobaciones previas
        if (carta.dataset.estado === 'revelada') {
            return;
        }
        
        if (carta.dataset.estado === 'volteada') {
            return;
        }
        
        if (this.#tableroBloqueado) {
            return;
        }
        
        // Voltear la carta
        carta.dataset.estado = "volteada";
        
        // Primera carta
        if (this.#primeraCarta == null) {
            this.#primeraCarta = carta;
            return;
        }
        
        // Segunda carta
        if (this.#segundaCarta == null) {
            this.#segundaCarta = carta;
            this.#comprobarPareja();
        }
    }

    /**
     * Método público para reiniciar completamente el juego
     */
    reiniciarJuego() {
        this.#cronometro.reset();
        this.#reiniciarAtributos();
        this.#parejasEncontradas = 0;
        
        const todasLasCartas = document.querySelectorAll('main article');
        todasLasCartas.forEach(carta => {
            carta.removeAttribute('data-estado');
        });
        
        this.#barajarCartas();
        this.#añadirEventListeners();
        this.#cronometro.arrancar();
    }
}