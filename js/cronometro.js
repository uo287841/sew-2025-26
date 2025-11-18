"use strict";

/**
 * Clase Cronometro para medir tiempo en minutos, segundos y décimas
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Cronometro {
    /**
     * Constructor de la clase Cronometro
     * Inicializa el tiempo a cero
     */
    constructor() {
        this.tiempo = 0; // Tiempo en décimas de segundo
        this.intervalo = null; // Referencia al intervalo para poder detenerlo
        this.activo = false; // Estado del cronómetro
    }

    /**
     * Inicia el cronómetro
     */
    iniciar() {
        if (!this.activo) {
            this.activo = true;
            // Usar Temporal si está disponible, sino Date
            const tiempoInicio = this.obtenerTiempoActual();
            const tiempoBase = this.tiempo;
            
            this.intervalo = setInterval(() => {
                const tiempoTranscurrido = this.calcularTiempoTranscurrido(tiempoInicio);
                this.tiempo = tiempoBase + tiempoTranscurrido;
                this.mostrar();
            }, 100); // Actualizar cada décima de segundo (100ms)
        }
    }

    /**
     * Detiene el cronómetro
     */
    parar() {
        if (this.activo) {
            this.activo = false;
            if (this.intervalo) {
                clearInterval(this.intervalo);
                this.intervalo = null;
            }
        }
    }

    /**
     * Reinicia el cronómetro a cero
     */
    reset() {
        this.parar();
        this.tiempo = 0;
        this.mostrar();
    }

    /**
     * Obtiene el tiempo actual usando Temporal o Date
     * @returns {number} Tiempo actual en milisegundos
     */
    obtenerTiempoActual() {
        // Intentar usar Temporal (ECMAScript nuevo)
        if (typeof Temporal !== 'undefined' && Temporal.Now) {
            try {
                return Temporal.Now.instant().epochMilliseconds;
            } catch (e) {
                // Si Temporal falla, usar Date
                return Date.now();
            }
        }
        // Fallback a Date
        return Date.now();
    }

    /**
     * Calcula el tiempo transcurrido desde un momento inicial
     * @param {number} tiempoInicio - Tiempo inicial en milisegundos
     * @returns {number} Tiempo transcurrido en décimas de segundo
     */
    calcularTiempoTranscurrido(tiempoInicio) {
        const tiempoActual = this.obtenerTiempoActual();
        const milisegundos = tiempoActual - tiempoInicio;
        return Math.floor(milisegundos / 100); // Convertir a décimas
    }

    /**
     * Obtiene los minutos del tiempo actual
     * @returns {number} Minutos
     */
    obtenerMinutos() {
        return Math.floor(this.tiempo / 600); // 600 décimas = 1 minuto
    }

    /**
     * Obtiene los segundos del tiempo actual
     * @returns {number} Segundos (0-59)
     */
    obtenerSegundos() {
        return Math.floor((this.tiempo % 600) / 10); // 10 décimas = 1 segundo
    }

    /**
     * Obtiene las décimas del tiempo actual
     * @returns {number} Décimas (0-9)
     */
    obtenerDecimas() {
        return this.tiempo % 10;
    }

    /**
     * Formatea un número con ceros a la izquierda
     * @param {number} numero - Número a formatear
     * @param {number} digitos - Cantidad de dígitos totales
     * @returns {string} Número formateado
     */
    formatear(numero, digitos = 2) {
        return numero.toString().padStart(digitos, '0');
    }

    /**
     * Obtiene el tiempo formateado como string
     * @returns {string} Tiempo en formato MM:SS.D
     */
    obtenerTiempoFormateado() {
        const minutos = this.formatear(this.obtenerMinutos());
        const segundos = this.formatear(this.obtenerSegundos());
        const decimas = this.obtenerDecimas();
        return `${minutos}:${segundos}.${decimas}`;
    }

    /**
     * Muestra el cronómetro en el documento HTML
     */
    mostrar() {
        const display = document.querySelector('main p');
        if (display) {
            display.textContent = this.obtenerTiempoFormateado();
        }
    }
}

// Crear instancia del cronómetro
const cronometro = new Cronometro();