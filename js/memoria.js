"use strict";

class Memoria {
  constructor() {
    
  }

  /**
   * Método que voltea una carta cuando el usuario hace clic en ella
   * @param {HTMLElement} carta - La carta sobre la que se ha hecho clic
   */
  voltearCarta(carta) {
    // Cambiamos el atributo data-estado de la carta a "volteada"
    carta.dataset.estado = "volteada";
  }
}

// Creamos una instancia global de la clase para poder usarla desde el HTML
const juego = new Memoria();
