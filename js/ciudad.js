"use strict";

/**
 * Clase que representa información sobre una ciudad
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Ciudad {
    constructor(nombre, pais, gentilicio) {
        this.nombre = nombre;
        this.pais = pais;
        this.gentilicio = gentilicio;
        this.poblacion = null;
        this.latitud = null;
        this.longitud = null;
    }

    rellenarAtributos() {
        this.poblacion = 12000; 
        this.latitud = 43.9789;
        this.longitud = 12.6833;
    }

    getNombre() {
        return this.nombre;
    }

    getPais() {
        return this.pais;
    }

    getInformacionSecundaria() {
        return "<ul>" +
               "<li><strong>Gentilicio:</strong> " + this.gentilicio + "</li>" +
               "<li><strong>Población:</strong> " + this.poblacion + " habitantes</li>" +
               "</ul>";
    }

    writeCoordenadas() {
        const main = document.querySelector('main');
        if (main) {
            const parrafo = document.createElement('p');
            parrafo.innerHTML = "<strong>Coordenadas:</strong> Latitud " + this.latitud + "°, Longitud " + this.longitud + "°";
            main.appendChild(parrafo);
        }
    }

    escribirInfoCompleta() {
        const main = document.querySelector('main');
        
        if (main) {
            const parrafoNombre = document.createElement('p');
            parrafoNombre.innerHTML = "<strong>Ciudad:</strong> " + this.getNombre();
            main.appendChild(parrafoNombre);
            
            const parrafoPais = document.createElement('p');
            parrafoPais.innerHTML = "<strong>País:</strong> " + this.getPais();
            main.appendChild(parrafoPais);
            
            const section = document.createElement('section');
            section.innerHTML = this.getInformacionSecundaria();
            main.appendChild(section);
            
            this.writeCoordenadas();
        }
    }
}

// Ejecución automática cuando el script se carga
const ciudad = new Ciudad("Misano Adriatico", "Italia", "misanés/misanesa");
ciudad.rellenarAtributos();
ciudad.escribirInfoCompleta();