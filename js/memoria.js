"use strict";

/**
 * Clase que representa el juego de memoria con cartas
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Memoria {
    /**
     * Constructor de la clase Memoria
     * No recibe parámetros
     */
    constructor() {
        this.cartasVolteadas = [];
        this.parejasEncontradas = 0;

        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;
        
        // Inicializar el juego cuando se cree la instancia
        this.barajarCartas();
    }

    /**
     * Método que baraja las cartas del juego de forma aleatoria
     */
    barajarCartas() {
        // Obtener el elemento main que contiene las cartas
        const main = document.querySelector('main');
        
        // Obtener todas las cartas (elementos article)
        const cartas = main.children;
        
        // Calcular el número de cartas (children incluye el h2, por eso restamos 1)
        const numeroCartas = cartas.length - 1;
        
        // Barajar las cartas usando el algoritmo de Fisher-Yates
        for (let i = numeroCartas; i >= 2; i--) {
            // Generar un índice aleatorio entre 1 e i (saltamos el h2 que está en posición 0)
            const j = Math.floor(Math.random() * i) + 1;
            
            // Mover la carta en posición j al final
            main.appendChild(cartas[j]);
        }
    }

    /**
     * Método que reinicia los atributos a sus valores iniciales
     */
    reiniciarAtributos() {
        this.tablero_bloqueado = false;
        this.primera_carta = null;
        this.segunda_carta = null;
    }

    /**
     * Método que pone bocabajo las cartas cuando no forman pareja
     */
    cubrirCartas() {
        // Bloquear el tablero para evitar nuevas pulsaciones
        this.tablero_bloqueado = true;
        
        // Ejecutar las acciones con un retardo de 1.5 segundos
        setTimeout(() => {
            // Quitar el atributo data-estado de las cartas volteadas
            this.primera_carta.removeAttribute('data-estado');
            this.segunda_carta.removeAttribute('data-estado');
            
            // Reiniciar los atributos
            this.reiniciarAtributos();
        }, 1500);
    }

    /**
     * Método que comprueba si las dos cartas volteadas forman pareja
     */
    comprobarPareja() {
        // Obtener las imágenes de ambas cartas
        const imgPrimeraCarta = this.primera_carta.children[1];
        const imgSegundaCarta = this.segunda_carta.children[1];
        
        // Obtener el atributo src de las imágenes
        const srcPrimeraCarta = imgPrimeraCarta.getAttribute('src');
        const srcSegundaCarta = imgSegundaCarta.getAttribute('src');
        
        // Comprobar si las cartas son iguales y actuar en consecuencia
        srcPrimeraCarta === srcSegundaCarta ? this.deshabilitarCartas() : this.cubrirCartas();
    }

    /**
     * Método que comprueba si el juego ha terminado
     */
    comprobarJuego() {
        // Obtener todas las cartas del juego
        const todasLasCartas = document.querySelectorAll('main article');
        
        // Obtener todas las cartas con estado 'revelada'
        const cartasReveladas = document.querySelectorAll('main article[data-estado="revelada"]');
        
        // Comprobar si todas las cartas están reveladas
        if (todasLasCartas.length === cartasReveladas.length) {
            // El juego ha terminado
            alert('¡Felicidades! Has completado el juego de memoria.');
        }
    }

    /**
     * Método que deshabilita las cartas que han formado una pareja
     */
    deshabilitarCartas() {
        // Cambiar el estado de las cartas emparejadas a 'revelada'
        this.primera_carta.dataset.estado = 'revelada';
        this.segunda_carta.dataset.estado = 'revelada';
        
        // Comprobar si el juego ha terminado
        this.comprobarJuego();
        
        // Reiniciar los atributos
        this.reiniciarAtributos();
    }

    /**
     * Método que voltea una carta cuando el usuario hace clic en ella
     * @param {HTMLElement} carta - Elemento article que representa la carta
     */
    voltearCarta(carta) {
        // Comprobaciones previas antes de voltear la carta
        
        // 1. Comprobar que la carta no está deshabilitada (revelada)
        if (carta.dataset.estado === 'revelada') {
            return;
        }
        
        // 2. Comprobar que la carta no está ya volteada
        if (carta.dataset.estado === 'volteada') {
            return;
        }
        
        // 3. Comprobar que el tablero no está bloqueado
        if (this.tablero_bloqueado) {
            return;
        }
        
        // Si pasa todas las comprobaciones, voltear la carta
        carta.dataset.estado = "volteada";
        
        // Caso a) Primera carta que se voltea en esta jugada
        if (this.primera_carta == null) {
            this.primera_carta = carta;
            return;
        }
        
        // Caso b) Segunda carta que se voltea en esta jugada
        if (this.segunda_carta == null) {
            this.segunda_carta = carta;
            this.comprobarPareja();
        }
    }
}