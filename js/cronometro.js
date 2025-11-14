"use strict";

class Cronometro {
  constructor() {
    this.tiempo = 0;       // tiempo transcurrido en milisegundos
    this.inicio = null;    // instante de inicio
    this.corriendo = null; // identificador del intervalo
  }

  /**
   * Método que inicia el cronómetro
   */
  arrancar() {
    // Evitar múltiples arranques simultáneos
    if (this.corriendo) return;

    // Establecer el momento de inicio usando Temporal o Date
    try {
      this.inicio = Temporal.Now.instant();
    } catch (error) {
      this.inicio = new Date();
    }

    // Ejecutar actualizar cada décima de segundo (100 ms)
    this.corriendo = setInterval(this.actualizar.bind(this), 100);
  }

  /**
   * Método que actualiza el tiempo transcurrido
   */
  actualizar() {
    let ahora;
    let transcurrido;

    try {
      // Usar Temporal si está disponible
      ahora = Temporal.Now.instant();
      transcurrido = ahora.since(this.inicio).total({ unit: "milliseconds" });
    } catch (error) {
      // Usar Date como alternativa
      ahora = new Date();
      transcurrido = ahora - this.inicio; // diferencia en milisegundos
    }

    // Actualizar el tiempo acumulado
    this.tiempo += transcurrido;
    
    // Actualizar el inicio para el próximo intervalo
    this.inicio = ahora;

    // Mostrar el tiempo actualizado
    this.mostrar();
  }

  /**
   * Método que muestra el tiempo en formato mm:ss.s dentro del primer <p> de <main>
   */
  mostrar() {
    // Convertir milisegundos a minutos, segundos y décimas
    const totalSegundos = Math.floor(this.tiempo / 1000);
    const minutos = parseInt(totalSegundos / 60);
    const segundos = parseInt(totalSegundos % 60);
    const decimas = parseInt((this.tiempo % 1000) / 100);

    // Formatear con ceros a la izquierda usando padStart
    const minutosStr = String(minutos).padStart(2, "0");
    const segundosStr = String(segundos).padStart(2, "0");

    // Crear la cadena en formato mm:ss.s
    const cadena = `${minutosStr}:${segundosStr}.${decimas}`;

    // Buscar el primer párrafo dentro de <main>
    const parrafo = document.querySelector("main p");
    if (parrafo) {
      parrafo.textContent = cadena;
    } else {
      // Si no existe, crearlo
      const nuevoParrafo = document.createElement("p");
      nuevoParrafo.textContent = cadena;
      const main = document.querySelector("main");
      if (main) {
        main.appendChild(nuevoParrafo);
      }
    }
  }

  /**
   * Método que detiene el cronómetro
   */
  parar() {
    if (this.corriendo) {
      clearInterval(this.corriendo);
      this.corriendo = null;
    }
  }

  /**
   * Método que reinicia el cronómetro a cero
   */
  reiniciar() {
    // Limpiar el intervalo
    if (this.corriendo) {
      clearInterval(this.corriendo);
      this.corriendo = null;
    }
    
    // Poner el tiempo a 0
    this.tiempo = 0;
    
    // Reiniciar el inicio
    this.inicio = null;
    
    // Mostrar el cronómetro a cero
    this.mostrar();
  }
}