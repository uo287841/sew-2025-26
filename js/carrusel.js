"use strict";

/**
 * Clase Carrusel para mostrar imágenes de Flickr
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Carrusel {
    #busqueda;
    #actual;
    #maximo;
    #fotos;
    #imagenCarrusel;

    constructor(busqueda) {
        this.#busqueda = busqueda;
        this.#actual = 0;
        this.#maximo = 5;
        this.#fotos = [];
    }

    getFotografias() {
        const apiKey = "f80e84d3342cfe02b373b4e3d39d9bdc";
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${this.#busqueda}&format=json&nojsoncallback=1&per_page=${this.#maximo}`;
        
        $.ajax({
            url: url,
            dataType: "json",
            success: (data) => {
                if (data.stat === "ok") {
                    this.#fotos = data.photos.photo.map(photo =>
                        `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`
                    );
                    this.#mostrarFotografias();
                }
            },
            error: (xhr, status, error) => {
                console.error("Error en la llamada AJAX:", error);
            }
        });
    }

    #mostrarFotografias() {
        if (this.#fotos.length === 0) return;
        
        const $article = $("<article></article>");
        const $h2 = $("<h2></h2>").text(`Imágenes del circuito de ${this.#busqueda}`);
        const $img = $("<img>")
            .attr("src", this.#fotos[this.#actual])
            .attr("alt", `Foto del circuito ${this.#busqueda}`);
        
        $article.append($h2);
        $article.append($img);
        $("main").append($article);
        
        this.#imagenCarrusel = $img;
        
        setInterval(this.#cambiarFotografia.bind(this), 3000);
    }

    #cambiarFotografia() {
        if (this.#fotos.length === 0) return;
        
        this.#actual = (this.#actual + 1) % this.#maximo;
        this.#imagenCarrusel.attr("src", this.#fotos[this.#actual]);
    }
}