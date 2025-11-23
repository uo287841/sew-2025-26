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

    /**
     * Tarea 3 (Ejercicio 3): Método público que obtiene datos meteorológicos del día de la carrera
     * Realiza una llamada AJAX a Open-Meteo para obtener información meteorológica histórica
     */
    getMeteorologiaCarrera() {
        // Verificar que las coordenadas estén establecidas
        if (this.#latitud === null || this.#longitud === null) {
            console.error("Las coordenadas no han sido establecidas. Llama a rellenarAtributos() primero.");
            return;
        }

        // Fecha de la carrera de MotoGP en Misano (ejemplo: 8 de septiembre de 2024)
        // Cambia esta fecha según el calendario real
        const fechaCarrera = "2024-09-08";
        
        // URL de la API de Open-Meteo (Historical Weather API)
        const url = "https://archive-api.open-meteo.com/v1/archive";
        
        // Parámetros de la petición
        const parametros = {
            latitude: this.#latitud,
            longitude: this.#longitud,
            start_date: fechaCarrera,
            end_date: fechaCarrera,
            // Datos horarios (hourly)
            hourly: [
                "temperature_2m",           // Temperatura a 2m
                "apparent_temperature",     // Sensación térmica
                "rain",                     // Lluvia
                "relative_humidity_2m",     // Humedad relativa
                "wind_speed_10m",           // Velocidad del viento
                "wind_direction_10m"        // Dirección del viento
            ].join(","),
            // Datos diarios (daily)
            daily: [
                "sunrise",                  // Hora de salida del sol
                "sunset"                    // Hora de puesta del sol
            ].join(","),
            timezone: "Europe/Rome"         // Zona horaria de Italia
        };
        
        // Realizar la llamada AJAX con jQuery
        $.ajax({
            url: url,
            data: parametros,
            method: "GET",
            dataType: "json",
            success: (datos) => {
                // Tarea 4: Procesar el JSON recibido
                this.#procesarJSONCarrera(datos);
            },
            error: (error) => {
                console.error("Error al obtener datos meteorológicos:", error);
                $("main").append($("<p></p>").text("Error al cargar los datos meteorológicos."));
            }
        });
    }

    /**
     * Tarea 4 (Ejercicio 3): Método privado que procesa el objeto JSON de meteorología
     * Extrae la información del objeto JSON devuelto por Open-Meteo
     * @param {Object} datos - Objeto JSON con datos meteorológicos
     */
    #procesarJSONCarrera(datos) {
        // Verificar que el JSON tenga la estructura esperada
        if (!datos.hourly || !datos.daily) {
            console.error("Formato de datos meteorológicos incorrecto");
            return;
        }

        // Extraer datos DIARIOS (daily) del JSON
        // Estos datos son valores únicos para todo el día
        const salidaSol = datos.daily.sunrise[0];
        const puestaSol = datos.daily.sunset[0];

        // Extraer datos HORARIOS (hourly) del JSON
        // Estos datos son arrays con un valor por cada hora del día
        const horaCarrera = 14; // 14:00 horas
        const indice = datos.hourly.time.findIndex(t => new Date(t).getHours() === horaCarrera);

        // Crear objeto con la información procesada
        const datosMeteorologicos = {
            // Datos diarios
            salidaSol: new Date(salidaSol).toLocaleTimeString("es-ES"),
            puestaSol: new Date(puestaSol).toLocaleTimeString("es-ES"),
            // Datos horarios (a la hora de la carrera)
            horaCarrera: horaCarrera,
            temperatura: indice !== -1 ? datos.hourly.temperature_2m[indice] : null,
            sensacionTermica: indice !== -1 ? datos.hourly.apparent_temperature[indice] : null,
            lluvia: indice !== -1 ? datos.hourly.rain[indice] : null,
            humedadRelativa: indice !== -1 ? datos.hourly.relative_humidity_2m[indice] : null,
            velocidadViento: indice !== -1 ? datos.hourly.wind_speed_10m[indice] : null,
            direccionViento: indice !== -1 ? datos.hourly.wind_direction_10m[indice] : null
        };

        // Tarea 5: Añadir la información al documento HTML
        this.#mostrarDatosMeteorologicos(datosMeteorologicos);
    }

    /**
     * Tarea 5 (Ejercicio 3): Método privado que añade los datos meteorológicos al documento
     * Crea elementos HTML con jQuery y los inserta en el DOM
     * @param {Object} datos - Objeto con los datos meteorológicos procesados
     */
    #mostrarDatosMeteorologicos(datos) {
        // Crear sección para mostrar los datos usando jQuery
        const $section = $("<section></section>");
        
        // Título principal
        const $h3 = $("<h3></h3>").text("Datos meteorológicos del día de la carrera");
        $section.append($h3);

        // ========== DATOS DIARIOS (daily) ==========
        const $h4Diario = $("<h4></h4>").text("Información del día");
        $section.append($h4Diario);
        
        const $dlDiario = $("<dl></dl>");
        $dlDiario.append($("<dt></dt>").text("Salida del sol"));
        $dlDiario.append($("<dd></dd>").text(datos.salidaSol));
        $dlDiario.append($("<dt></dt>").text("Puesta del sol"));
        $dlDiario.append($("<dd></dd>").text(datos.puestaSol));
        $section.append($dlDiario);

        // ========== DATOS HORARIOS (hourly) ==========
        if (datos.temperatura !== null) {
            const $h4Horario = $("<h4></h4>").text(`Condiciones a las ${datos.horaCarrera}:00 (hora de la carrera)`);
            $section.append($h4Horario);
            
            const $dlHorario = $("<dl></dl>");
            
            $dlHorario.append($("<dt></dt>").text("Temperatura"));
            $dlHorario.append($("<dd></dd>").text(datos.temperatura + " °C"));
            
            $dlHorario.append($("<dt></dt>").text("Sensación térmica"));
            $dlHorario.append($("<dd></dd>").text(datos.sensacionTermica + " °C"));
            
            $dlHorario.append($("<dt></dt>").text("Lluvia"));
            $dlHorario.append($("<dd></dd>").text(datos.lluvia + " mm"));
            
            $dlHorario.append($("<dt></dt>").text("Humedad relativa"));
            $dlHorario.append($("<dd></dd>").text(datos.humedadRelativa + " %"));
            
            $dlHorario.append($("<dt></dt>").text("Velocidad del viento"));
            $dlHorario.append($("<dd></dd>").text(datos.velocidadViento + " km/h"));
            
            $dlHorario.append($("<dt></dt>").text("Dirección del viento"));
            $dlHorario.append($("<dd></dd>").text(datos.direccionViento + " °"));
            
            $section.append($dlHorario);
        }

        // Añadir la sección al main del documento
        $("main").append($section);
    }

    /**
     * Tarea 6 (Ejercicio 3): Método público que obtiene datos meteorológicos de los entrenamientos
     * Realiza una llamada AJAX a Open-Meteo para obtener información de los 3 días previos a la carrera
     */
    getMeteorologiaEntrenos() {
        // Verificar que las coordenadas estén establecidas
        if (this.#latitud === null || this.#longitud === null) {
            console.error("Las coordenadas no han sido establecidas. Llama a rellenarAtributos() primero.");
            return;
        }

        // Fechas de entrenamientos (3 días antes de la carrera)
        // Si la carrera es el 8 de septiembre, los entrenamientos son 5, 6 y 7 de septiembre
        const fechaInicio = "2024-09-05";  // Primer día de entrenamientos
        const fechaFin = "2024-09-07";     // Último día de entrenamientos
        
        // URL de la API de Open-Meteo (Historical Weather API)
        const url = "https://archive-api.open-meteo.com/v1/archive";
        
        // Parámetros de la petición
        const parametros = {
            latitude: this.#latitud,
            longitude: this.#longitud,
            start_date: fechaInicio,
            end_date: fechaFin,
            // Datos horarios (hourly) - Solo los necesarios para entrenamientos
            hourly: [
                "temperature_2m",           // Temperatura a 2m
                "rain",                     // Lluvia
                "wind_speed_10m",           // Velocidad del viento
                "relative_humidity_2m"      // Humedad relativa
            ].join(","),
            timezone: "Europe/Rome"
        };
        
        // Realizar la llamada AJAX con jQuery
        $.ajax({
            url: url,
            data: parametros,
            method: "GET",
            dataType: "json",
            success: (datos) => {
                // Tarea 7: Procesar el JSON de entrenamientos
                this.#procesarJSONEntrenos(datos);
            },
            error: (error) => {
                console.error("Error al obtener datos de entrenamientos:", error);
                $("main").append($("<p></p>").text("Error al cargar los datos de entrenamientos."));
            }
        });
    }

    /**
     * Tarea 7 (Ejercicio 3): Método privado que procesa el JSON de entrenamientos
     * Extrae la información y calcula la media de cada dato para cada día
     * @param {Object} datos - Objeto JSON con datos meteorológicos de los 3 días
     */
    #procesarJSONEntrenos(datos) {
        // Verificar que el JSON tenga la estructura esperada
        if (!datos.hourly) {
            console.error("Formato de datos meteorológicos incorrecto");
            return;
        }

        // Array para almacenar las medias de cada día
        const mediasEntrenos = [];

        // Obtener las fechas únicas de los datos
        const fechas = [...new Set(datos.hourly.time.map(t => t.split('T')[0]))];

        // Procesar cada día de entrenamientos
        fechas.forEach(fecha => {
            // Filtrar los índices de esta fecha específica
            const indicesDia = datos.hourly.time
                .map((t, i) => t.startsWith(fecha) ? i : -1)
                .filter(i => i !== -1);

            // Calcular medias para este día
            const temperaturas = indicesDia.map(i => datos.hourly.temperature_2m[i]);
            const lluvias = indicesDia.map(i => datos.hourly.rain[i]);
            const velocidadesViento = indicesDia.map(i => datos.hourly.wind_speed_10m[i]);
            const humedades = indicesDia.map(i => datos.hourly.relative_humidity_2m[i]);

            // Calcular media y redondear a 2 decimales
            const mediaTemperatura = this.#calcularMedia(temperaturas);
            const mediaLluvia = this.#calcularMedia(lluvias);
            const mediaVelocidadViento = this.#calcularMedia(velocidadesViento);
            const mediaHumedad = this.#calcularMedia(humedades);

            // Guardar las medias de este día
            mediasEntrenos.push({
                fecha: new Date(fecha).toLocaleDateString("es-ES"),
                temperaturaMedia: mediaTemperatura,
                lluviaMedia: mediaLluvia,
                velocidadVientoMedia: mediaVelocidadViento,
                humedadMedia: mediaHumedad
            });
        });

        // Mostrar los datos procesados en el documento
        this.#mostrarDatosEntrenos(mediasEntrenos);
    }

    /**
     * Método privado auxiliar que calcula la media de un array de números
     * @param {number[]} valores - Array de valores numéricos
     * @returns {number} Media redondeada a 2 decimales
     */
    #calcularMedia(valores) {
        if (valores.length === 0) return 0;
        const suma = valores.reduce((acc, val) => acc + val, 0);
        const media = suma / valores.length;
        return Math.round(media * 100) / 100; // Redondear a 2 decimales
    }

    /**
     * Método privado que muestra los datos de entrenamientos en el documento
     * @param {Object[]} mediasEntrenos - Array con las medias de cada día
     */
    #mostrarDatosEntrenos(mediasEntrenos) {
        // Crear sección para mostrar los datos
        const $section = $("<section></section>");
        
        // Título principal
        const $h3 = $("<h3></h3>").text("Datos meteorológicos de los entrenamientos");
        $section.append($h3);

        // Procesar cada día de entrenamientos
        mediasEntrenos.forEach((dia, index) => {
            // Título del día
            const $h4 = $("<h4></h4>").text(`Día ${index + 1} - ${dia.fecha}`);
            $section.append($h4);

            // Lista de definiciones con las medias
            const $dl = $("<dl></dl>");
            
            $dl.append($("<dt></dt>").text("Temperatura media"));
            $dl.append($("<dd></dd>").text(dia.temperaturaMedia + " °C"));
            
            $dl.append($("<dt></dt>").text("Lluvia media"));
            $dl.append($("<dd></dd>").text(dia.lluviaMedia + " mm"));
            
            $dl.append($("<dt></dt>").text("Velocidad del viento media"));
            $dl.append($("<dd></dd>").text(dia.velocidadVientoMedia + " km/h"));
            
            $dl.append($("<dt></dt>").text("Humedad relativa media"));
            $dl.append($("<dd></dd>").text(dia.humedadMedia + " %"));
            
            $section.append($dl);
        });

        // Añadir la sección al main
        $("main").append($section);
    }
}