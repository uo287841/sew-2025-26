"use strict";

class Circuito {
    
    constructor() {
        // Comprobar soporte del API File al crear la instancia
        this.comprobarApiFile();
    }
    
    /**
     * Verifica si el navegador soporta el API File de HTML5
     * Muestra un mensaje de error si no es compatible
     */
    comprobarApiFile() {
        // Verificar si el navegador soporta File API
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // El navegador soporta File API
            console.log("Este navegador soporta el API File");
        } else {
            // El navegador NO soporta File API
            this.#mostrarError("¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!");
        }
    }
    
    /**
     * Método privado para mostrar mensajes de error en el documento
     * @param {string} mensaje - Texto del mensaje de error a mostrar
     */
    #mostrarError(mensaje) {
        // Crear elemento de párrafo para el mensaje
        const parrafo = document.createElement("p");
        parrafo.textContent = mensaje;
        
        // Insertar el mensaje en el body después del h2
        const h2 = document.querySelector("h2");
        if (h2 && h2.parentNode) {
            h2.parentNode.insertBefore(parrafo, h2.nextSibling);
        } else {
            document.body.appendChild(parrafo);
        }
    }
    
    /**
     * Lee el archivo HTML seleccionado por el usuario
     * Procesa el contenido y lo muestra en el documento
     */
    leerArchivoHTML(files) {
        // Verificar que se haya seleccionado un archivo
        if (files.length === 0) {
            this.#mostrarError("No se ha seleccionado ningún archivo");
            return;
        }
        
        const archivo = files[0];
        
        // Verificar que sea un archivo HTML
        if (!archivo.name.endsWith('.html')) {
            this.#mostrarError("Por favor, selecciona un archivo HTML válido");
            return;
        }
        
        // Crear instancia de FileReader
        const lector = new FileReader();
        
        // Definir qué hacer cuando se complete la lectura
        lector.onload = (evento) => {
            // El contenido del archivo está en evento.target.result
            this.#procesarHTML(evento.target.result);
        };
        
        // Definir qué hacer si hay un error
        lector.onerror = () => {
            this.#mostrarError("Error al leer el archivo");
        };
        
        // Leer el archivo como texto
        lector.readAsText(archivo);
    }
    
    /**
     * Método privado para procesar el contenido HTML leído
     * @param {string} contenidoHTML - Contenido del archivo HTML
     */
    #procesarHTML(contenidoHTML) {
        // Crear un parser para convertir el string HTML en un documento DOM
        const parser = new DOMParser();
        const documentoHTML = parser.parseFromString(contenidoHTML, 'text/html');
        
        // Extraer el contenido del body del documento parseado
        const contenido = documentoHTML.body;
        
        if (contenido) {
            // Mostrar el contenido en circuito.html
            this.#mostrarContenido(contenido);
        } else {
            this.#mostrarError("No se pudo procesar el contenido del archivo");
        }
    }
    
    /**
     * Método privado para mostrar el contenido en el documento
     * @param {HTMLElement} contenido - Contenido a mostrar
     */
    #mostrarContenido(contenido) {
        // Crear una sección para alojar el contenido
        const seccion = document.createElement("section");
        
        // Copiar todo el contenido del body del archivo leído
        // Iteramos sobre los hijos directos del body
        Array.from(contenido.children).forEach(elemento => {
            // Clonar cada elemento y añadirlo a la sección
            const elementoClonado = elemento.cloneNode(true);
            seccion.appendChild(elementoClonado);
        });
        
        // Buscar dónde insertar la sección
        const h2 = document.querySelector("h2");
        if (h2 && h2.parentNode) {
            // Insertar después del h2 (o después de cualquier mensaje de error previo)
            let siguienteElemento = h2.nextSibling;
            
            // Si ya existe una sección previa, reemplazarla
            const seccionExistente = document.querySelector("section");
            if (seccionExistente) {
                seccionExistente.remove();
            }
            
            h2.parentNode.insertBefore(seccion, siguienteElemento);
        } else {
            document.body.appendChild(seccion);
        }
    }
}