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
        // Atributos que se pueden añadir para futuras tareas
        this.cartasVolteadas = [];
        this.parejasEncontradas = 0;
    }

    /**
     * Método que voltea una carta cuando el usuario hace clic en ella
     * @param {HTMLElement} carta - Elemento article que representa la carta
     */
    voltearCarta(carta) {
        // Añadir el atributo data-estado con valor "volteada"
        carta.dataset.estado = "volteada";
    }
}

// Crear instancia del juego
const memoriaGame = new Memoria();