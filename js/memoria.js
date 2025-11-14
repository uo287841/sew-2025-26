
"use strict";

class Memoria {
  constructor() {
    // Ejercicio 2 - Tarea 1: Atributos de la clase
    this.tablero_bloqueado = true;
    this.primera_carta = null;
    this.segunda_carta = null;

    console.log("Juego de memoria inicializado");
  }

  /**
   * Método básico para voltear una carta
   */
  voltearCarta(carta) {
    // No hacer nada si el tablero está bloqueado
    if (this.tablero_bloqueado) {
      return;
    }

    // No voltear cartas que ya están reveladas
    if (carta.dataset.estado === "revelada") {
      return;
    }

    // No voltear la misma carta dos veces
    if (carta === this.primera_carta) {
      return;
    }

    // Voltear la carta
    carta.dataset.estado = "volteada";

    // Asignar la carta a primera_carta o segunda_carta
    if (this.primera_carta === null) {
      this.primera_carta = carta;
    } else {
      this.segunda_carta = carta;
      // Bloquear el tablero mientras se comprueba la pareja
      this.tablero_bloqueado = true;
      // Comprobar si las dos cartas forman pareja
      this.comprobarPareja();
    }
  }

  /**
   * Ejercicio 2 - Tarea 2: Método para barajar las cartas del juego
   */
  barajarCartas() {
    const main = document.querySelector("main");
    const cartas = Array.from(main.querySelectorAll("article"));
    
    // Barajar usando el algoritmo Fisher-Yates modificado
    const cartasBarajadas = cartas.sort(() => Math.random() - 0.5);

    // Reordenar las cartas en el DOM
    cartasBarajadas.forEach(carta => {
      main.appendChild(carta);
    });

    // Desbloquear el tablero para permitir la interacción
    this.tablero_bloqueado = false;
    
    console.log("Cartas barajadas correctamente");
  }

  /**
   * Ejercicio 2 - Tarea 3: Método para reiniciar los atributos a sus valores iniciales
   */
  reiniciarAtributos() {
    this.tablero_bloqueado = false; // Desbloquear para la siguiente jugada
    this.primera_carta = null;
    this.segunda_carta = null;
  }

  /**
   * Ejercicio 2 - Tarea 4: Método para deshabilitar las cartas que forman pareja
   */
  deshabilitarCartas() {
    if (this.primera_carta && this.segunda_carta) {
      // Marcar las cartas como reveladas permanentemente
      this.primera_carta.dataset.estado = "revelada";
      this.segunda_carta.dataset.estado = "revelada";
      
      console.log("¡Pareja encontrada!");
    }
    
    // Comprobar si el juego ha terminado
    this.comprobarJuego();
    
    // Reiniciar los atributos para la siguiente jugada
    this.reiniciarAtributos();
  }

  /**
   * Ejercicio 2 - Tarea 5: Método para comprobar si el juego ha terminado
   */
  comprobarJuego() {
    const main = document.querySelector("main");
    const todasLasCartas = main.querySelectorAll("article");
    const cartasReveladas = main.querySelectorAll("article[data-estado='revelada']");
    
    // Comprobar si todas las cartas están reveladas
    if (todasLasCartas.length === cartasReveladas.length) {
      console.log("¡Juego completado! Todas las parejas han sido encontradas");
      
      // Mostrar mensaje de victoria al usuario
      setTimeout(() => {
        alert("¡Felicidades! Has completado el juego de memoria");
      }, 500);
      
      return true;
    }
    
    return false;
  }

  /**
   * Ejercicio 3 - Tarea 1: Método que pone las cartas bocabajo cuando no coinciden
   */
  cubrirCartas() {
    // Bloquear el tablero mientras se cubren las cartas
    this.tablero_bloqueado = true;

    // Ejecutar con retardo de 1.5 segundos para que el usuario vea las cartas
    setTimeout(() => {
      // Quitar el atributo data-estado de las cartas (ponerlas bocabajo)
      if (this.primera_carta) {
        this.primera_carta.removeAttribute("data-estado");
        // Establecer explícitamente el estado "oculta"
        this.primera_carta.dataset.estado = "oculta";
      }
      if (this.segunda_carta) {
        this.segunda_carta.removeAttribute("data-estado");
        // Establecer explícitamente el estado "oculta"
        this.segunda_carta.dataset.estado = "oculta";
      }

      console.log("Cartas cubiertas - No coinciden");

      // Reiniciar los atributos y desbloquear el tablero
      this.reiniciarAtributos();
    }, 1500);
  }

  /**
   * Ejercicio 3 - Tarea 2: Método que comprueba si las dos cartas volteadas son iguales
   */
  comprobarPareja() {
    // Obtener las imágenes de ambas cartas
    // children[1] es la imagen (children[0] es el h3)
    const imagenPrimera = this.primera_carta.children[1];
    const imagenSegunda = this.segunda_carta.children[1];

    // Obtener el atributo 'src' de ambas imágenes
    const srcPrimera = imagenPrimera.getAttribute("src");
    const srcSegunda = imagenSegunda.getAttribute("src");

    // Comparar las imágenes usando operador ternario
    // Si son iguales, deshabilitar; si no, cubrir
    srcPrimera === srcSegunda 
      ? this.deshabilitarCartas() 
      : this.cubrirCartas();
  }
}

// Instancia global del juego
const juego = new Memoria();

// Inicializar el juego barajando las cartas cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
  juego.barajarCartas();
});