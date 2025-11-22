"use strict";

/**
 * Clase Cronometro para medir tiempo en minutos, segundos y décimas
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Cronometro {
    // Atributos privados
    #tiempo;
    #intervalo;
    #activo;

    /**
     * Constructor de la clase Cronometro
     * Inicializa el tiempo a cero
     */
    constructor() {
        this.#tiempo = 0;
        this.#intervalo = null;
        this.#activo = false;
    }

    /**
     * Método público que inicia el cronómetro
     */
    iniciar() {
        if (!this.#activo) {
            this.#activo = true;
            const tiempoInicio = this.#obtenerTiempoActual();
            const tiempoBase = this.#tiempo;
            
            this.#intervalo = setInterval(() => {
                const tiempoTranscurrido = this.#calcularTiempoTranscurrido(tiempoInicio);
                this.#tiempo = tiempoBase + tiempoTranscurrido;
                this.#mostrar();
            }, 100);
        }
    }

    /**
     * Alias público para iniciar
     */
    arrancar() {
        this.iniciar();
    }

    /**
     * Método público que detiene el cronómetro
     */
    parar() {
        if (this.#activo) {
            this.#activo = false;
            if (this.#intervalo) {
                clearInterval(this.#intervalo);
                this.#intervalo = null;
            }
        }
    }

    /**
     * Método público que reinicia el cronómetro a cero
     */
    reset() {
        this.parar();
        this.#tiempo = 0;
        this.#mostrar();
    }

    /**
     * Alias público para reset
     */
    reiniciar() {
        this.reset();
    }

    /**
     * Método privado que obtiene el tiempo actual
     * @returns {number} Tiempo actual en milisegundos
     */
    #obtenerTiempoActual() {
        if (typeof Temporal !== 'undefined' && Temporal.Now) {
            try {
                return Temporal.Now.instant().epochMilliseconds;
            } catch (e) {
                return Date.now();
            }
        }
        return Date.now();
    }

    /**
     * Método privado que calcula el tiempo transcurrido
     * @param {number} tiempoInicio - Tiempo inicial en milisegundos
     * @returns {number} Tiempo transcurrido en décimas de segundo
     */
    #calcularTiempoTranscurrido(tiempoInicio) {
        const tiempoActual = this.#obtenerTiempoActual();
        const milisegundos = tiempoActual - tiempoInicio;
        return Math.floor(milisegundos / 100);
    }

    /**
     * Método privado que obtiene los minutos
     * @returns {number} Minutos
     */
    #obtenerMinutos() {
        return Math.floor(this.#tiempo / 600);
    }

    /**
     * Método privado que obtiene los segundos
     * @returns {number} Segundos (0-59)
     */
    #obtenerSegundos() {
        return Math.floor((this.#tiempo % 600) / 10);
    }

    /**
     * Método privado que obtiene las décimas
     * @returns {number} Décimas (0-9)
     */
    #obtenerDecimas() {
        return this.#tiempo % 10;
    }

    /**
     * Método privado que formatea un número con ceros a la izquierda
     * @param {number} numero - Número a formatear
     * @param {number} digitos - Cantidad de dígitos totales
     * @returns {string} Número formateado
     */
    #formatear(numero, digitos = 2) {
        return numero.toString().padStart(digitos, '0');
    }

    /**
     * Método público que obtiene el tiempo formateado
     * @returns {string} Tiempo en formato MM:SS.D
     */
    obtenerTiempoFormateado() {
        const minutos = this.#formatear(this.#obtenerMinutos());
        const segundos = this.#formatear(this.#obtenerSegundos());
        const decimas = this.#obtenerDecimas();
        return `${minutos}:${segundos}.${decimas}`;
    }

    /**
     * Método privado que muestra el cronómetro en el documento
     */
    #mostrar() {
        const display = document.querySelector('main p');
        if (display) {
            display.textContent = this.obtenerTiempoFormateado();
        }
    }
}