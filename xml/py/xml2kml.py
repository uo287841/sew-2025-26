import sys
import xml.etree.ElementTree as ET
from datetime import datetime


def q(name, ns):
    """Helper: construye nombre con namespace para ElementTree si se prefiere."""
    return f"{{{ns}}}{name}"


def main(argv):
    if len(argv) < 2:
        in_xml = "circuitoEsquema.xml"
        out_kml = "circuito.kml"
    elif len(argv) == 2:
        in_xml = argv[1]
        out_kml = "circuito.kml"
    else:
        in_xml = argv[1]
        out_kml = argv[2]

    # Parse XML
    tree = ET.parse(in_xml)
    root = tree.getroot()

    # Detectar namespace del documento (esperado: http://www.uniovi.es/circuito)
    # root.tag tiene la forma '{namespace}schema' o '{namespace}circuito' dependiendo del archivo
    # Buscamos el namespace declarado en el documento (target)
    nsmap = {}
    # Reutilizamos el namespace tal cual que indica root (si aplica)
    if root.tag.startswith("{"):
        # extraer texto entre { and }
        doc_ns = root.tag.split("}")[0].strip("{")
    else:
        doc_ns = "http://www.uniovi.es/circuito"

    # namespace prefix que usaremos en las búsquedas XPath
    nsmap["c"] = doc_ns

    # Extraer el elemento 'origen' (si existe)
    origen = root.find(".//c:geografia//c:origen", namespaces=nsmap)
    coords = []
    if origen is not None:
        lon_e = origen.find("c:longitud", namespaces=nsmap)
        lat_e = origen.find("c:latitud", namespaces=nsmap)
        alt_e = origen.find("c:altitud", namespaces=nsmap)
        if lon_e is not None and lat_e is not None:
            try:
                lon = lon_e.text.strip()
                lat = lat_e.text.strip()
                alt = alt_e.text.strip() if alt_e is not None and alt_e.text else "0"
                coords.append((lon, lat, alt))
            except Exception:
                pass

    # Extraer todas las coordenadas de los tramos en orden (usar XPath y ns)
    tramos = root.findall(".//c:tramos//c:tramo", namespaces=nsmap)
    # Para cada tramo coger puntoFinal/longitud, latitud, altitud
    for tramo in tramos:
        punto = tramo.find(".//c:puntoFinal", namespaces=nsmap)
        if punto is None:
            continue
        lon_e = punto.find("c:longitud", namespaces=nsmap)
        lat_e = punto.find("c:latitud", namespaces=nsmap)
        alt_e = punto.find("c:altitud", namespaces=nsmap)
        if lon_e is not None and lat_e is not None:
            lon = lon_e.text.strip()
            lat = lat_e.text.strip()
            alt = alt_e.text.strip() if alt_e is not None and alt_e.text else "0"
            coords.append((lon, lat, alt))

    if not coords:
        print(
            "No se han podido extraer coordenadas del XML. Comprueba los nombres y namespaces."
        )
        sys.exit(1)

    # Construir la sección KML para coordenadas: lon,lat,alt separadas por comas y saltos de línea
    coords_text = "\n".join([f"{c[0]},{c[1]},{c[2]}" for c in coords])

    # Metadata para descripción
    nombre = root.find(".//c:nombre", namespaces=nsmap)
    nombre_text = (
        nombre.text.strip() if nombre is not None and nombre.text else "Circuito"
    )

    fecha = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%SZ")

    # Plantilla KML (básica)
    kml_template = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{nombre_text} - Planimetría</name>
    <description>Generado desde {in_xml} el {fecha} (xml2kml.py)</description>

    <!-- Style for the circuit line -->
    <Style id="circuitLineStyle">
      <LineStyle>
        <color>ff0000ff</color> <!-- AABBGGRR: aquí rojo (FF0000FF) -->
        <width>4</width>
      </LineStyle>
    </Style>

    <!-- Origin marker -->
    <Placemark>
      <name>Origen</name>
      <description>Origen definido en geografía</description>
      <Point>
        <coordinates>{coords[0][0]},{coords[0][1]},{coords[0][2]}</coordinates>
      </Point>
    </Placemark>

    <!-- Full circuit as LineString -->
    <Placemark>
      <name>{nombre_text} - Track</name>
      <styleUrl>#circuitLineStyle</styleUrl>
      <LineString>
        <tessellate>1</tessellate>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>
{coords_text}
        </coordinates>
      </LineString>
    </Placemark>

    <!-- Optional: placemarks per tramo -->
"""

    # Añadir placemarks por tramo (coordenadas puntuales)
    # Usamos XPath para extraer número de sector y distancia para la descripción
    for i, tramo in enumerate(tramos, start=1):
        punto = tramo.find(".//c:puntoFinal", namespaces=nsmap)
        lon_e = punto.find("c:longitud", namespaces=nsmap)
        lat_e = punto.find("c:latitud", namespaces=nsmap)
        alt_e = punto.find("c:altitud", namespaces=nsmap)
        sector = tramo.find("c:sector", namespaces=nsmap)
        distancia = tramo.find("c:distancia", namespaces=nsmap)

        if lon_e is None or lat_e is None:
            continue
        lon = lon_e.text.strip()
        lat = lat_e.text.strip()
        alt = alt_e.text.strip() if alt_e is not None and alt_e.text else "0"
        desc_parts = []
        if sector is not None and sector.text:
            desc_parts.append(f"Sector: {sector.text.strip()}")
        if distancia is not None and distancia.text:
            desc_parts.append(f"Distancia: {distancia.text.strip()} m")
        desc = " | ".join(desc_parts) if desc_parts else f"Tramo {i}"
        placemark = f"""
    <Placemark>
      <name>Tramo {i}</name>
      <description>{desc}</description>
      <Point>
        <coordinates>{lon},{lat},{alt}</coordinates>
      </Point>
    </Placemark>
"""
        kml_template += placemark

    # Cierre
    kml_template += """
  </Document>
</kml>
"""

    # Escribir fichero KML
    with open(out_kml, "w", encoding="utf-8") as f:
        f.write(kml_template)

    print(f"Generado {out_kml} con {len(coords)} puntos (incluido origen).")
    print("Abrir en Google Earth: Archivo -> Abrir archivo KML local.")
    print(
        "Para crear planimetria.pdf: ajustar vista y 'Imprimir' -> Guardar como PDF en Google Earth o usar navegador/visor de KML."
    )


if __name__ == "__main__":
    main(sys.argv)
