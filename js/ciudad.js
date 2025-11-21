"use strict";

class Ciudad {
    #nombre;
    #pais;
    #gentilicio;
    #poblacion;
    #latitud;
    #longitud;

    constructor(nombre, pais, gentilicio) {
        this.#nombre = nombre;
        this.#pais = pais;
        this.#gentilicio = gentilicio;
        this.#poblacion = null;
        this.#latitud = null;
        this.#longitud = null;
    }

    rellenarAtributos() {
        this.#poblacion = 12000; 
        this.#latitud = 43.9789;   // Misano Adriatico
        this.#longitud = 12.6833;
    }

    // --- Método para procesar el JSON ---
    procesarJSONCarrera(data) {
        const main = document.querySelector("main");
        if (!main) return;

        // --- Datos diarios ---
        const h3Daily = document.createElement("h3");
        h3Daily.textContent = "Datos diarios";
        main.appendChild(h3Daily);

        const dlDaily = document.createElement("dl");

        const dtSunrise = document.createElement("dt");
        dtSunrise.textContent = "Salida del sol";
        const ddSunrise = document.createElement("dd");
        ddSunrise.textContent = data.daily.sunrise[0];

        const dtSunset = document.createElement("dt");
        dtSunset.textContent = "Puesta del sol";
        const ddSunset = document.createElement("dd");
        ddSunset.textContent = data.daily.sunset[0];

        dlDaily.appendChild(dtSunrise);
        dlDaily.appendChild(ddSunrise);
        dlDaily.appendChild(dtSunset);
        dlDaily.appendChild(ddSunset);
        main.appendChild(dlDaily);

        // --- Datos horarios ---
        const h3Hourly = document.createElement("h3");
        h3Hourly.textContent = "Datos horarios";
        main.appendChild(h3Hourly);

        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        ["Hora", "Temp (°C)", "Sensación (°C)", "Lluvia (mm)", "Humedad (%)", "Viento (km/h)", "Dirección (°)"]
            .forEach(text => {
                const th = document.createElement("th");
                th.textContent = text;
                headerRow.appendChild(th);
            });
        table.appendChild(headerRow);

        for (let i = 0; i < data.hourly.time.length; i++) {
            const row = document.createElement("tr");

            const tdHora = document.createElement("td");
            tdHora.textContent = data.hourly.time[i];
            row.appendChild(tdHora);

            const tdTemp = document.createElement("td");
            tdTemp.textContent = data.hourly.temperature_2m[i];
            row.appendChild(tdTemp);

            const tdApp = document.createElement("td");
            tdApp.textContent = data.hourly.apparent_temperature[i];
            row.appendChild(tdApp);

            const tdRain = document.createElement("td");
            tdRain.textContent = data.hourly.precipitation[i];
            row.appendChild(tdRain);

            const tdHum = document.createElement("td");
            tdHum.textContent = data.hourly.relative_humidity_2m[i];
            row.appendChild(tdHum);

            const tdWind = document.createElement("td");
            tdWind.textContent = data.hourly.windspeed_10m[i];
            row.appendChild(tdWind);

            const tdDir = document.createElement("td");
            tdDir.textContent = data.hourly.winddirection_10m[i];
            row.appendChild(tdDir);

            table.appendChild(row);
        }

        main.appendChild(table);
    }

    // --- Método para obtener datos de la carrera ---
    getMeteorologiaCarrera(fechaCarrera) {
        const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${this.#latitud}&longitude=${this.#longitud}&start_date=${fechaCarrera}&end_date=${fechaCarrera}&hourly=temperature_2m,apparent_temperature,precipitation,relative_humidity_2m,windspeed_10m,winddirection_10m&daily=sunrise,sunset&timezone=Europe/Rome`;

        $.ajax({
            url: url,
            dataType: "json",
            success: (data) => {
                console.log("Respuesta Open-Meteo:", data);
                this.procesarJSONCarrera(data); // procesar JSON
            },
            error: (xhr, status, error) => {
                console.error("Error en la llamada AJAX:", error);
            }
        });
    }
}

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
    const ciudad = new Ciudad("Misano Adriatico", "Italia", "misanés/misanesa");
    ciudad.rellenarAtributos();
    ciudad.escribirInfoCompleta();
    ciudad.getMeteorologiaCarrera("2023-09-10");
});
