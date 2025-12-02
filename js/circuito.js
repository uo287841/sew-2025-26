"use strict";

class Circuito {
    // Atributos privados
    #soportaAPIFile;
    #inputArchivo;
    
    constructor() {
        this.#soportaAPIFile = false;
        this.#inputArchivo = null;
        
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
            this.#soportaAPIFile = true;
            console.log("Este navegador soporta el API File");
        } else {
            this.#soportaAPIFile = false;
            this.#mostrarMensaje(
                "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!",
                "error"
            );
        }
    }
    
    /**
     * Método privado para mostrar mensajes en el documento
     * @param {string} mensaje - Texto del mensaje a mostrar
     * @param {string} tipo - Tipo de mensaje: 'error', 'exito', 'info'
     */
    #mostrarMensaje(mensaje, tipo = "info") {
        // Crear elemento de párrafo para el mensaje
        const parrafo = document.createElement("p");
        parrafo.textContent = mensaje;
        
        // Añadir atributo class según el tipo de mensaje
        // NO usamos clases CSS como selectores, solo para estilos
        if (tipo === "error") {
            parrafo.setAttribute("class", "error");
        } else if (tipo === "exito") {
            parrafo.setAttribute("class", "exito");
        } else {
            parrafo.setAttribute("class", "info");
        }
        
        // Buscar el h2 como referencia (NO dentro del header)
        const h2 = document.querySelector("body > h2, body > main > h2");
        
        if (h2 && h2.parentNode) {
            // Insertar después del h2
            h2.parentNode.insertBefore(parrafo, h2.nextSibling);
        } else {
            // Si no hay h2, buscar el main
            const main = document.querySelector("body > main");
            if (main && main.firstChild) {
                main.insertBefore(parrafo, main.firstChild);
            } else if (main) {
                main.appendChild(parrafo);
            } else {
                // Si no hay main, insertar antes del footer
                const footer = document.querySelector("body > footer");
                if (footer) {
                    document.body.insertBefore(parrafo, footer);
                } else {
                    document.body.appendChild(parrafo);
                }
            }
        }
    }
    
    /**
     * Crea y configura el input de archivo en el documento
     * Este método debe llamarse después de que el DOM esté cargado
     */
    crearInputArchivo() {
        if (!this.#soportaAPIFile) {
            return; // No crear el input si no hay soporte
        }
        
        // Crear el input de tipo file
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".html");
        
        // Crear label descriptivo
        const label = document.createElement("label");
        label.textContent = "Seleccionar archivo InfoCircuito.html: ";
        label.appendChild(input);
        
        // Crear contenedor section
        const contenedor = document.createElement("section");
        contenedor.appendChild(label);
        
        // Insertar en el documento (NO dentro del header)
        const h2 = document.querySelector("body > h2, body > main > h2");
        const main = document.querySelector("body > main");
        
        if (h2 && h2.parentNode) {
            // Insertar después del h2
            h2.parentNode.insertBefore(contenedor, h2.nextSibling);
        } else if (main && main.firstChild) {
            // Insertar al principio del main
            main.insertBefore(contenedor, main.firstChild);
        } else if (main) {
            // Añadir al main
            main.appendChild(contenedor);
        } else {
            // Si no hay main, insertar antes del footer
            const footer = document.querySelector("body > footer");
            if (footer) {
                document.body.insertBefore(contenedor, footer);
            } else {
                document.body.appendChild(contenedor);
            }
        }
        
        // Guardar referencia al input
        this.#inputArchivo = input;
        
        // Registrar el evento change
        this.#registrarEventos();
    }
    
    /**
     * Método privado para registrar los eventos del input
     */
    #registrarEventos() {
        if (this.#inputArchivo) {
            this.#inputArchivo.addEventListener("change", (evento) => {
                this.#manejarCambioArchivo(evento);
            });
        }
    }
    
    /**
     * Método privado para manejar el evento de cambio en el input file
     * @param {Event} evento - Evento change del input
     */
    #manejarCambioArchivo(evento) {
        const archivos = evento.target.files;
        this.leerArchivoHTML(archivos);
    }
    
    /**
     * Lee el archivo HTML seleccionado por el usuario
     * Procesa el contenido y lo muestra en el documento
     * @param {FileList} files - Lista de archivos seleccionados
     */
    leerArchivoHTML(files) {
        // Verificar que se haya seleccionado un archivo
        if (!files || files.length === 0) {
            this.#mostrarMensaje("No se ha seleccionado ningún archivo", "error");
            return;
        }
        
        const archivo = files[0];
        
        // Verificar que sea un archivo HTML
        if (!archivo.name.toLowerCase().endsWith('.html')) {
            this.#mostrarMensaje("Por favor, selecciona un archivo HTML válido", "error");
            return;
        }
        
        // Crear instancia de FileReader
        const lector = new FileReader();
        
        // Definir qué hacer cuando se complete la lectura
        lector.onload = (evento) => {
            this.#procesarHTML(evento.target.result, archivo.name);
        };
        
        // Definir qué hacer si hay un error
        lector.onerror = () => {
            this.#mostrarMensaje("Error al leer el archivo", "error");
        };
        
        // Leer el archivo como texto
        lector.readAsText(archivo);
    }
    
    /**
     * Método privado para procesar el contenido HTML leído
     * @param {string} contenidoHTML - Contenido del archivo HTML
     * @param {string} nombreArchivo - Nombre del archivo procesado
     */
    #procesarHTML(contenidoHTML, nombreArchivo) {
        try {
            // Crear un parser para convertir el string HTML en un documento DOM
            const parser = new DOMParser();
            const documentoHTML = parser.parseFromString(contenidoHTML, 'text/html');
            
            // IMPORTANTE: Extraer SOLO el contenido del <main>, ignorando el <header>
            const main = documentoHTML.querySelector("main");
            
            if (main && main.children.length > 0) {
                // Mostrar el contenido del main en circuito.html
                this.#mostrarContenido(main);
                this.#mostrarMensaje(
                    `Archivo "${nombreArchivo}" cargado correctamente`,
                    "exito"
                );
            } else {
                this.#mostrarMensaje(
                    "El archivo HTML no contiene un elemento <main> o está vacío",
                    "error"
                );
            }
        } catch (error) {
            this.#mostrarMensaje(
                `Error al procesar el archivo: ${error.message}`,
                "error"
            );
        }
    }
    
    /**
     * Método privado para mostrar el contenido en el documento
     * @param {HTMLElement} contenido - Contenido del <main> a mostrar
     */
    #mostrarContenido(contenido) {
        // Eliminar sección anterior si existe
        // Equivalente jQuery: $("section.contenido-circuito").remove()
        const seccionAnterior = document.querySelector("body > main section:last-of-type");
        if (seccionAnterior && seccionAnterior.hasAttribute("data-cargado-dinamicamente")) {
            seccionAnterior.remove();
        }
        
        // Crear una sección para alojar el contenido
        // Equivalente jQuery: $("<section></section>")
        const seccion = document.createElement("section");
        seccion.setAttribute("data-cargado-dinamicamente", "true");
        
        // Crear un título para la sección
        const titulo = document.createElement("h3");
        titulo.textContent = "Información del Circuito Cargada:";
        titulo.style.color = "#1565c0";
        seccion.appendChild(titulo);
        
        // Copiar todo el contenido del <main> del archivo leído
        // IMPORTANTE: Solo copiamos el contenido de <main>, ignorando <header>
        // Equivalente jQuery: $.each() o .append()
        Array.from(contenido.children).forEach(elemento => {
            // Clonar cada elemento (deep clone) y añadirlo a la sección
            // Equivalente jQuery: $(elemento).clone().appendTo(seccion)
            const elementoClonado = elemento.cloneNode(true);
            seccion.appendChild(elementoClonado);
        });
        
        // Buscar dónde insertar la sección
        // Buscamos el main del documento actual (NO del header)
        const main = document.querySelector("body > main");
        
        if (main) {
            // Insertar al final del main
            main.appendChild(seccion);
        } else {
            // Si no hay main, insertar antes del footer
            const footer = document.querySelector("body > footer");
            if (footer) {
                document.body.insertBefore(seccion, footer);
            } else {
                document.body.appendChild(seccion);
            }
        }
    }
    
    /**
     * Método público para limpiar el contenido mostrado
     * Útil para reiniciar la visualización
     */
    limpiarContenido() {
        const seccion = document.querySelector("section[data-cargado-dinamicamente]");
        if (seccion) {
            seccion.remove();
        }
        
        // Limpiar también los mensajes
        const mensajes = document.querySelectorAll("p[class='error'], p[class='exito'], p[class='info']");
        mensajes.forEach(mensaje => mensaje.remove());
    }
}

/**
 * Función de inicialización que se ejecuta cuando el DOM está listo
 */
function inicializar() {
    // Crear instancia de la clase Circuito
    const circuito = new Circuito();
    
    // Crear el input para seleccionar archivo
    circuito.crearInputArchivo();
}

// Registrar el evento DOMContentLoaded para inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializar);