"use strict";

class Cronometro {
  constructor() {
    this.tiempo = 0;       // tiempo transcurrido en milisegundos
    this.inicio = null;    // instante de inicio
    this.corriendo = null; // identificador del intervalo
  }

  /**
   * Método que arranca el cronómetro y guarda el instante de inicio
   */
  arrancar() {
    try {
      this.inicio = Temporal.Now.instant();
      console.log("Cronómetro iniciado con Temporal:", this.inicio.toString());
    } catch (error) {
      this.inicio = new Date();
      console.log("Cronómetro iniciado con Date:", this.inicio.toISOString());
    }

    // Ejecutar actualizar cada décima de segundo (100 ms)
    this.corriendo = setInterval(this.actualizar.bind(this), 100);
  }

  /**
   * Método que actualiza el tiempo transcurrido desde el inicio
   */
  actualizar() {
    let ahora;
    try {
      ahora = Temporal.Now.instant();
      this.tiempo = ahora.since(this.inicio).total({ unit: "milliseconds" });
    } catch (error) {
      ahora = new Date();
      this.tiempo = ahora - this.inicio; // diferencia en milisegundos
    }

    // Mostrar el tiempo en consola (opcional para pruebas)
    const totalSegundos = Math.floor(this.tiempo / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const decimas = Math.floor((this.tiempo % 1000) / 100);

    console.log(
      `Tiempo: ${minutos}m ${segundos}s ${decimas}d`
    );
  }
}
