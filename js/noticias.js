"use strict";

/**
 * Clase para obtener y mostrar noticias de MotoGP usando TheNewsApi
 * @author UO287841 - Luis Salvador Ferrero Carneiro
 */
class Noticias {
    // Atributos privados
    #busqueda;
    #url;
    #apiKey;
    #noticias;

    /**
     * Constructor de la clase Noticias
     */
    constructor() {
        this.#busqueda = "MotoGP";
        this.#url = "https://api.thenewsapi.com/v1/news/all";
        this.#apiKey = "WtwjqtDjCjQMxPgOuXXLGfkSI0CetXHwI0aO7BMe";
        this.#noticias = [];
    }

    /**
     * Método público que busca noticias usando fetch()
     */
    buscar() {
        const parametros = new URLSearchParams({
            api_token: this.#apiKey,
            search: this.#busqueda,
            language: "es",
            limit: 5
        });
        
        const urlCompleta = `${this.#url}?${parametros.toString()}`;
        
        return fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(datos => {
                this.#procesarInformacion(datos);
                return datos;
            })
            .catch(error => {
                console.error("Error al obtener noticias:", error);
                const main = document.querySelector("main");
                if (main) {
                    const p = document.createElement("p");
                    p.textContent = "Error al cargar las noticias de MotoGP.";
                    main.appendChild(p);
                }
                throw error;
            });
    }

    /**
     * Método privado que procesa el JSON de noticias
     */
    #procesarInformacion(datos) {
        if (!datos.data || datos.data.length === 0) {
            console.error("No se encontraron noticias");
            return;
        }

        this.#noticias = datos.data.map(noticia => ({
            titulo: noticia.title,
            descripcion: noticia.description,
            url: noticia.url,
            imagen: noticia.image_url,
            fecha: new Date(noticia.published_at).toLocaleDateString("es-ES"),
            fuente: noticia.source
        }));

        this.#mostrarNoticias();
    }

    /**
     * Método privado que muestra las noticias con jQuery
     */
    #mostrarNoticias() {
        const $main = $("main");
        if ($main.length === 0) return;

        const $section = $("<section></section>");
        const $h3 = $("<h3></h3>").text("Últimas noticias de MotoGP");
        $section.append($h3);

        this.#noticias.forEach(noticia => {
            const $article = $("<article></article>");
            
            const $h4 = $("<h4></h4>");
            const $enlace = $("<a></a>")
                .attr("href", noticia.url)
                .attr("target", "_blank")
                .attr("rel", "noopener noreferrer")
                .text(noticia.titulo);
            $h4.append($enlace);
            $article.append($h4);

            if (noticia.imagen) {
                const $img = $("<img>")
                    .attr("src", noticia.imagen)
                    .attr("alt", noticia.titulo);
                $article.append($img);
            }

            if (noticia.descripcion) {
                const $p = $("<p></p>").text(noticia.descripcion);
                $article.append($p);
            }

            const $footer = $("<footer></footer>");
            const $pInfo = $("<p></p>")
                .text(`Publicado el ${noticia.fecha} - Fuente: ${noticia.fuente}`);
            $footer.append($pInfo);
            $article.append($footer);

            $section.append($article);
        });

        $main.append($section);
    }
}