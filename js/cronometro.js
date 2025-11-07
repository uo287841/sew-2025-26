"use strict";

class Cronometro {
  constructor() {
    this.tiempo = 0;       // tiempo transcurrido en milisegundos
    this.inicio = null;    // instante de inicio
    this.corriendo = null; // identificador del intervalo
  }

  arrancar() {
    try {
      this.inicio = Temporal.Now.instant();
    } catch (error) {
      this.inicio = new Date();
     }

    // Ejecutar actualizar cada décima de segundo (100 ms)
    this.corriendo = setInterval(this.actualizar.bind(this), 100);
  }

  actualizar() {
    let ahora;
    try {
      ahora = Temporal.Now.instant();
      this.tiempo = ahora.since(this.inicio).total({ unit: "milliseconds" });
    } catch (error) {
      ahora = new Date();
      this.tiempo = ahora - this.inicio; // diferencia en milisegundos
    }

    // Mostrar el tiempo en el documento
    this.mostrar();
  }

  /**
   * Método que muestra el tiempo en formato mm:ss.s dentro del primer <p> de <main>
   */
  mostrar() {
    const totalSegundos = Math.floor(this.tiempo / 1000);
    const minutos = parseInt(totalSegundos / 60);
    const segundos = parseInt(totalSegundos % 60);
    const decimas = parseInt((this.tiempo % 1000) / 100);

    // Formatear con ceros a la izquierda
    const minutosStr = String(minutos).padStart(2, "0");
    const segundosStr = String(segundos).padStart(2, "0");

    const cadena = `${minutosStr}:${segundosStr}.${decimas}`;

    // Buscar el primer párrafo dentro de <main>
    const parrafo = document.querySelector("main p");
    if (parrafo) {
      parrafo.textContent = cadena;
    } else {
      // Si no existe, lo creamos
      const nuevoParrafo = document.createElement("p");
      nuevoParrafo.textContent = cadena;
      document.querySelector("main").appendChild(nuevoParrafo);
    }
  }

  /**
   * Método que detiene el cronómetro
   */
  parar() {
    clearInterval(this.corriendo);
    this.corriendo = null;
  }

  /**
   * Método que reinicia el cronómetro
   */
  reiniciar() {
    clearInterval(this.corriendo);
    this.corriendo = null;
    this.tiempo = 0;
    this.mostrar();
  }
}
