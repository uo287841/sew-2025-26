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
        // Usamos <dl> (definition list) que es semántico y W3C válido
        return "<dl>" +
               "<dt>Gentilicio</dt><dd>" + this.gentilicio + "</dd>" +
               "<dt>Población</dt><dd>" + this.poblacion + " habitantes</dd>" +
               "</dl>";
    }

    writeCoordenadas() {
        const main = document.querySelector('main');
        if (main) {
            // Usamos <dl> para las coordenadas también
            const dl = document.createElement('dl');
            
            const dt = document.createElement('dt');
            dt.textContent = 'Coordenadas';
            
            const dd = document.createElement('dd');
            dd.textContent = 'Latitud ' + this.latitud + '°, Longitud ' + this.longitud + '°';
            
            dl.appendChild(dt);
            dl.appendChild(dd);
            main.appendChild(dl);
        }
    }

    escribirInfoCompleta() {
        const main = document.querySelector('main');
        
        if (main) {
            // Información básica con dl (definition list)
            const dlBasica = document.createElement('dl');

            // Información Principal
            const h3_principal = document.createElement('h3');
            h3_principal.textContent = 'Información Principal';
            main.appendChild(h3_principal);
            
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
            
            // Información secundaria
            const h3_secubdario = document.createElement('h3');
            h3_secubdario.textContent = 'Información Adicional';
            main.appendChild(h3_secubdario);
            
            const section = document.createElement('section');
            section.innerHTML = this.getInformacionSecundaria();
            main.appendChild(section);
            
            // Coordenadas
            this.writeCoordenadas();
        }
    }
}

// Ejecución automática cuando el script se carga
const ciudad = new Ciudad("Misano Adriatico", "Italia", "misanés/misanesa");
ciudad.rellenarAtributos();
ciudad.escribirInfoCompleta();