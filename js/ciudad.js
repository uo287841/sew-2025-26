class Ciudad {
  constructor(nombre, pais, gentilicio) {
    this.nombre = nombre;
    this.pais = pais;
    this.gentilicio = gentilicio;
    this.poblacion = null;
    this.coordenadas = null;
  }

  inicializarDatos(poblacion, coordenadas) {
    this.poblacion = poblacion;
    this.coordenadas = coordenadas;
  }

  getNombreCiudad() {
    return "Ciudad: " + this.nombre;
  }

  getNombrePais() {
    return "País: " + this.pais;
  }

  getInfoSecundaria() {
    return `
      <ul>
        <li>Gentilicio: ${this.gentilicio}</li>
        <li>Población: ${this.poblacion ?? "No disponible"}</li>
      </ul>
    `;
  }

  escribirCoordenadas() {
    const coords = document.createElement("p");
    if (this.coordenadas) {
      coords.textContent =
        "Coordenadas: Latitud " +
        this.coordenadas.lat +
        ", Longitud " +
        this.coordenadas.lng;
    } else {
      coords.textContent = "Coordenadas no disponibles";
    }

    const contenedor = document.getElementById("infoCiudad");
    contenedor.appendChild(coords);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const misano = new Ciudad("Misano Adriatico", "Italia", "misaneses");
  misano.inicializarDatos(12000, { lat: 43.9817, lng: 12.6986 });

  const contenedor = document.getElementById("infoCiudad");

  const nombreCiudad = document.createElement("p");
  nombreCiudad.textContent = misano.getNombreCiudad();

  const nombrePais = document.createElement("p");
  nombrePais.textContent = misano.getNombrePais();

  const infoSecundaria = document.createElement("div");
  infoSecundaria.innerHTML = misano.getInfoSecundaria();

  contenedor.appendChild(nombreCiudad);
  contenedor.appendChild(nombrePais);
  contenedor.appendChild(infoSecundaria);

  misano.escribirCoordenadas();
});
