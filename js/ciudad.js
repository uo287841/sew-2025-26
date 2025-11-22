"use strict";

/**
 * Clase que representa información sobre una ciudad
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Ciudad {
    // Atributos privados
    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #latitud;
    #longitud;

    /**
     * Constructor de la clase Ciudad
     * @param {string} nombre - Nombre de la ciudad
     * @param {string} pais - País de la ciudad
     * @param {string} gentilicio - Gentilicio de los habitantes
     */
    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = null;
        this.#latitud = null;
        this.#longitud = null;
    }

    /**
     * Método público para rellenar los atributos de la ciudad
     */
    rellenarAtributos() {
        this.#poblacion = 12000;
        this.#latitud = 43.9789;
        this.#longitud = 12.6833;
    }

    /**
     * Método público que obtiene el nombre de la ciudad
     * @returns {string} Nombre de la ciudad
     */
    getNombre() {
        return this.#nombre;
    }

    /**
     * Método público que obtiene el país
     * @returns {string} País de la ciudad
     */
    getPais() {
        return this.#pais;
    }

    /**
     * Método privado que crea un elemento <dl> con información secundaria
     * @returns {HTMLElement} Elemento dl con la información
     */
    #crearInformacionSecundaria() {
        const dl = document.createElement('dl');
        
        // Gentilicio
        const dtGentilicio = document.createElement('dt');
        dtGentilicio.textContent = 'Gentilicio';
        const ddGentilicio = document.createElement('dd');
        ddGentilicio.textContent = this.#gentilicio;
        
        // Población
        const dtPoblacion = document.createElement('dt');
        dtPoblacion.textContent = 'Población';
        const ddPoblacion = document.createElement('dd');
        ddPoblacion.textContent = this.#poblacion + ' habitantes';
        
        dl.appendChild(dtGentilicio);
        dl.appendChild(ddGentilicio);
        dl.appendChild(dtPoblacion);
        dl.appendChild(ddPoblacion);
        
        return dl;
    }

    /**
     * Método privado que escribe las coordenadas en el documento
     */
    #writeCoordenadas() {
        const main = document.querySelector('main');
        if (main) {
            const dl = document.createElement('dl');
            
            const dt = document.createElement('dt');
            dt.textContent = 'Coordenadas';
            
            const dd = document.createElement('dd');
            dd.textContent = 'Latitud ' + this.#latitud + '°, Longitud ' + this.#longitud + '°';
            
            dl.appendChild(dt);
            dl.appendChild(dd);
            main.appendChild(dl);
        }
    }

    /**
     * Método público que escribe toda la información completa en el documento
     */
    escribirInfoCompleta() {
        const main = document.querySelector('main');
        
        if (main) {
            // Título: Información Principal
            const h3Principal = document.createElement('h3');
            h3Principal.textContent = 'Información Principal';
            main.appendChild(h3Principal);
            
            // Lista de definiciones para información básica
            const dlBasica = document.createElement('dl');
            
            // Ciudad
            const dtCiudad = document.createElement('dt');
            dtCiudad.textContent = 'Ciudad';
            const ddCiudad = document.createElement('dd');
            ddCiudad.textContent = this.getNombre();
            dlBasica.appendChild(dtCiudad);
            dlBasica.appendChild(ddCiudad);
            
            // País
            const dtPais = document.createElement('dt');
            dtPais.textContent = 'País';
            const ddPais = document.createElement('dd');
            ddPais.textContent = this.getPais();
            dlBasica.appendChild(dtPais);
            dlBasica.appendChild(ddPais);
            
            main.appendChild(dlBasica);
            
            // Título: Información Adicional
            const h3Secundario = document.createElement('h3');
            h3Secundario.textContent = 'Información Adicional';
            main.appendChild(h3Secundario);
            
            // Sección con información secundaria
            const section = document.createElement('section');
            const infoSecundaria = this.#crearInformacionSecundaria();
            section.appendChild(infoSecundaria);
            main.appendChild(section);
            
            // Coordenadas
            this.#writeCoordenadas();
        }
    }
}

// Ejecución automática cuando el script se carga
const ciudad = new Ciudad("Misano Adriatico", "Italia", "misanés/misanesa");
ciudad.rellenarAtributos();
ciudad.escribirInfoCompleta();