"use strict";

class Memoria {
  constructor() {
    this.tablero_bloqueado = true;
    this.primera_carta = null;
    this.segunda_carta = null;

    console.log("Juego de memoria inicializado con atributos de utilidad");
  }

  voltearCarta(carta) {
    carta.dataset.estado = "volteada";
  }

  barajarCartas() {
    const main = document.querySelector("main");
    const cartas = Array.from(main.querySelectorAll("article"));
    const cartasBarajadas = cartas.sort(() => Math.random() - 0.5);

    cartasBarajadas.forEach(carta => {
      main.appendChild(carta);
    });

    this.tablero_bloqueado = false;
  }

  reiniciarAtributos() {
    this.tablero_bloqueado = true;
    this.primera_carta = null;
    this.segunda_carta = null;
  }

  deshabilitarCartas() {
    if (this.primera_carta && this.segunda_carta) {
      this.primera_carta.dataset.estado = "revelada";
      this.segunda_carta.dataset.estado = "revelada";
    }
    this.reiniciarAtributos();
  }
}

// Instancia global
const juego = new Memoria();
