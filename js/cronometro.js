"use strict";

class Cronometro {
    #tiempo;
    #intervalo;
    #activo;

    constructor() {
        this.#tiempo = 0; 
        this.#intervalo = null; 
        this.#activo = false; 
    }

    iniciar() {
        if (!this.#activo) {
            this.#activo = true;
            const tiempoInicio = this.#obtenerTiempoActual();
            const tiempoBase = this.#tiempo;
            
            this.#intervalo = setInterval(() => {
                const tiempoTranscurrido = this.#calcularTiempoTranscurrido(tiempoInicio);
                this.#tiempo = tiempoBase + tiempoTranscurrido;
                this.mostrar();
            }, 100);
        }
    }

    arrancar() { this.iniciar(); }

    parar() {
        if (this.#activo) {
            this.#activo = false;
            if (this.#intervalo) {
                clearInterval(this.#intervalo);
                this.#intervalo = null;
            }
        }
    }

    reset() {
        if (this.#intervalo) {
            clearInterval(this.#intervalo);
            this.#intervalo = null;
        }
        this.#activo = false;
        this.#tiempo = 0;
        this.mostrar();
    }
    
    reiniciar() { this.reset(); }

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

    #calcularTiempoTranscurrido(tiempoInicio) {
        const tiempoActual = this.#obtenerTiempoActual();
        const milisegundos = tiempoActual - tiempoInicio;
        return Math.floor(milisegundos / 100);
    }

    #obtenerMinutos() { return Math.floor(this.#tiempo / 600); }
    #obtenerSegundos() { return Math.floor((this.#tiempo % 600) / 10); }
    #obtenerDecimas() { return this.#tiempo % 10; }

    #formatear(numero, digitos = 2) {
        return numero.toString().padStart(digitos, '0');
    }

    obtenerTiempoFormateado() {
        const minutos = this.#formatear(this.#obtenerMinutos());
        const segundos = this.#formatear(this.#obtenerSegundos());
        const decimas = this.#obtenerDecimas();
        return `${minutos}:${segundos}.${decimas}`;
    }

    mostrar() {
        const display = document.querySelector('main p');
        if (display) {
            display.textContent = this.obtenerTiempoFormateado();
        }
    }

    inicializarEventos() {
        const botones = document.querySelectorAll('main button');
        botones.forEach(boton => {
            const textoBoton = boton.textContent.toLowerCase();
            if (textoBoton.includes('arrancar') || textoBoton.includes('iniciar')) {
                boton.addEventListener('click', () => this.arrancar());
            } else if (textoBoton.includes('parar') || textoBoton.includes('detener')) {
                boton.addEventListener('click', () => this.parar());
            } else if (textoBoton.includes('reiniciar') || textoBoton.includes('reset')) {
                boton.addEventListener('click', () => this.reiniciar());
            }
        });
    }
}
