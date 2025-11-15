import sys
import xml.etree.ElementTree as ET


class Svg:
    """Clase para generar archivos SVG con perfiles altimétricos"""

    def __init__(self, width=1200, height=600):
        self.width = width
        self.height = height
        self.svg_content = []

    def write_header(self):
        """Escribe el encabezado del archivo SVG"""
        header = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="{self.width}" 
     height="{self.height}" 
     viewBox="0 0 {self.width} {self.height}">
  <title>Perfil Altimétrico del Circuito</title>
  <defs>
    <style>
      .grid {{ stroke: #ccc; stroke-width: 0.5; }}
      .axis {{ stroke: #000; stroke-width: 2; }}
      .profile {{ fill: rgba(70, 130, 180, 0.3); stroke: steelblue; stroke-width: 2; }}
      .text {{ font-family: Arial, sans-serif; font-size: 12px; fill: #333; }}
      .title {{ font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #000; }}
      .label {{ font-family: Arial, sans-serif; font-size: 10px; fill: #666; }}
    </style>
  </defs>
  
  <!-- Fondo blanco -->
  <rect width="{self.width}" height="{self.height}" fill="white"/>
'''
        self.svg_content.append(header)

    def add_polyline(self, points, style_class="profile"):
        """Añade una polilínea al SVG"""
        points_str = " ".join([f"{x},{y}" for x, y in points])
        polyline = f'  <polyline points="{points_str}" class="{style_class}"/>\n'
        self.svg_content.append(polyline)

    def add_line(self, x1, y1, x2, y2, style_class="grid"):
        """Añade una línea al SVG"""
        line = (
            f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" class="{style_class}"/>\n'
        )
        self.svg_content.append(line)

    def add_text(self, x, y, text, style_class="text", text_anchor=None, rotate=None):
        """Añade texto al SVG"""
        anchor_attr = f' text-anchor="{text_anchor}"' if text_anchor else ""
        rotate_attr = f' transform="rotate({rotate})"' if rotate else ""
        text_elem = f'  <text x="{x}" y="{y}" class="{style_class}"{anchor_attr}{rotate_attr}>{text}</text>\n'
        self.svg_content.append(text_elem)

    def write_footer(self):
        """Escribe el cierre del archivo SVG"""
        self.svg_content.append("</svg>\n")

    def save(self, filename):
        """Guarda el contenido SVG en un archivo"""
        with open(filename, "w", encoding="utf-8") as f:
            f.writelines(self.svg_content)


def extract_circuit_data(xml_file):
    """Extrae datos de distancia y altitud del archivo XML usando XPath"""
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Detectar namespace
    if root.tag.startswith("{"):
        doc_ns = root.tag[1 : root.tag.index("}")]
    else:
        doc_ns = "http://www.uniovi.es/circuito"

    nsmap = {"c": doc_ns}

    # Extraer nombre del circuito
    nombre_elem = root.find(".//c:nombre", namespaces=nsmap)
    nombre = nombre_elem.text.strip() if nombre_elem is not None else "Circuito"

    # Extraer origen
    origen = root.find(".//c:geografia//c:origen", namespaces=nsmap)
    distancia_acum = 0
    puntos = []

    if origen is not None:
        alt_elem = origen.find("c:altitud", namespaces=nsmap)
        if alt_elem is not None:
            altitud = float(alt_elem.text.strip())
            puntos.append((distancia_acum, altitud))

    # Extraer tramos usando XPath
    tramos = root.findall(".//c:tramos//c:tramo", namespaces=nsmap)

    for tramo in tramos:
        # Extraer distancia del tramo
        dist_elem = tramo.find(".//c:distancia", namespaces=nsmap)
        if dist_elem is not None:
            distancia = float(dist_elem.text.strip())
            distancia_acum += distancia

        # Extraer altitud del punto final
        punto_final = tramo.find(".//c:puntoFinal", namespaces=nsmap)
        if punto_final is not None:
            alt_elem = punto_final.find("c:altitud", namespaces=nsmap)
            if alt_elem is not None:
                altitud = float(alt_elem.text.strip())
                puntos.append((distancia_acum, altitud))

    return nombre, puntos


def normalize_points(puntos, width, height, margin=80):
    """Normaliza los puntos al espacio SVG con márgenes"""
    if not puntos:
        return []

    # Extraer distancias y altitudes
    distancias = [p[0] for p in puntos]
    altitudes = [p[1] for p in puntos]

    # Calcular rangos
    min_dist = min(distancias)
    max_dist = max(distancias)
    min_alt = min(altitudes)
    max_alt = max(altitudes)

    # Área disponible para el gráfico
    graph_width = width - 2 * margin
    graph_height = height - 2 * margin

    # Normalizar puntos (invertir Y porque en SVG Y crece hacia abajo)
    normalized = []
    for dist, alt in puntos:
        x = margin + (dist - min_dist) / (max_dist - min_dist) * graph_width
        y = height - margin - (alt - min_alt) / (max_alt - min_alt) * graph_height
        normalized.append((x, y))

    return normalized, (min_dist, max_dist, min_alt, max_alt)


def create_altimetry_svg(xml_file, svg_file):
    """Genera el archivo SVG de altimetría a partir del XML"""

    # Extraer datos del circuito
    try:
        nombre, puntos = extract_circuit_data(xml_file)
    except FileNotFoundError:
        print(f"Error: No se encuentra el archivo {xml_file}")
        sys.exit(1)
    except ET.ParseError as e:
        print(f"Error al parsear XML: {e}")
        sys.exit(1)

    if not puntos:
        print("No se pudieron extraer datos de altimetría del archivo XML")
        sys.exit(1)

    print(f"Extraídos {len(puntos)} puntos del circuito")

    # Crear objeto SVG
    svg = Svg(width=1200, height=600)
    svg.write_header()

    # Normalizar puntos
    normalized_points, (min_dist, max_dist, min_alt, max_alt) = normalize_points(
        puntos, svg.width, svg.height
    )

    margin = 80
    graph_height = svg.height - 2 * margin

    # Dibujar título
    svg.add_text(
        svg.width // 2,
        40,
        f"Perfil Altimétrico: {nombre}",
        "title",
        text_anchor="middle",
    )

    # Dibujar grid horizontal (altitudes)
    num_h_lines = 5
    for i in range(num_h_lines + 1):
        y = svg.height - margin - (i / num_h_lines) * graph_height
        svg.add_line(margin, y, svg.width - margin, y, "grid")

        # Etiquetas de altitud
        alt_value = min_alt + (max_alt - min_alt) * i / num_h_lines
        svg.add_text(
            margin - 10, y + 5, f"{alt_value:.1f}m", "label", text_anchor="end"
        )

    # Dibujar grid vertical (distancias)
    num_v_lines = 10
    for i in range(num_v_lines + 1):
        x = margin + (i / num_v_lines) * (svg.width - 2 * margin)
        svg.add_line(x, margin, x, svg.height - margin, "grid")

        # Etiquetas de distancia
        dist_value = min_dist + (max_dist - min_dist) * i / num_v_lines
        svg.add_text(
            x,
            svg.height - margin + 20,
            f"{dist_value:.0f}m",
            "label",
            text_anchor="middle",
        )

    # Dibujar ejes principales
    svg.add_line(margin, margin, margin, svg.height - margin, "axis")
    svg.add_line(
        margin, svg.height - margin, svg.width - margin, svg.height - margin, "axis"
    )

    # Etiquetas de ejes
    svg.add_text(
        svg.width // 2,
        svg.height - 20,
        "Distancia (metros)",
        "text",
        text_anchor="middle",
    )
    svg.add_text(
        20,
        svg.height // 2,
        "Altitud (metros)",
        "text",
        text_anchor="middle",
        rotate=f"-90 20 {svg.height // 2}",
    )

    # Crear polilínea cerrada para efecto de relleno
    closed_points = normalized_points.copy()
    # Cerrar con el eje inferior
    closed_points.append((svg.width - margin, svg.height - margin))
    closed_points.append((margin, svg.height - margin))

    # Dibujar perfil altimétrico
    svg.add_polyline(closed_points, "profile")

    # Añadir puntos destacados (opcional)
    max_alt_point = max(puntos, key=lambda p: p[1])
    min_alt_point = min(puntos, key=lambda p: p[1])

    idx_max = puntos.index(max_alt_point)
    idx_min = puntos.index(min_alt_point)

    x_max, y_max = normalized_points[idx_max]
    x_min, y_min = normalized_points[idx_min]

    # Marcar punto más alto
    svg.svg_content.append(f'  <circle cx="{x_max}" cy="{y_max}" r="5" fill="red"/>\n')
    svg.add_text(
        x_max, y_max - 10, f"Máx: {max_alt_point[1]:.1f}m", "text", text_anchor="middle"
    )

    # Marcar punto más bajo
    svg.svg_content.append(f'  <circle cx="{x_min}" cy="{y_min}" r="5" fill="blue"/>\n')
    svg.add_text(
        x_min, y_min + 20, f"Mín: {min_alt_point[1]:.1f}m", "text", text_anchor="middle"
    )

    # Información adicional
    desnivel = max_alt_point[1] - min_alt_point[1]
    info_text = f"Distancia total: {max_dist:.0f}m | Desnivel: {desnivel:.1f}m"
    svg.add_text(
        svg.width // 2, svg.height - 50, info_text, "label", text_anchor="middle"
    )

    svg.write_footer()
    svg.save(svg_file)

    print(f"Archivo SVG generado: {svg_file}")
    print(f"Distancia total: {max_dist:.0f} metros")
    print(f"Altitud mínima: {min_alt_point[1]:.2f} metros")
    print(f"Altitud máxima: {max_alt_point[1]:.2f} metros")
    print(f"Desnivel: {desnivel:.2f} metros")
    print("\nPara crear altimetria.pdf:")
    print("1. Abre altimetria.svg en el navegador Opera (o Chrome/Firefox)")
    print("2. Ctrl+P (Imprimir)")
    print("3. Selecciona 'Guardar como PDF'")
    print("4. Nombra el archivo como 'altimetria.pdf'")


def main(argv):
    if len(argv) < 2:
        in_xml = "circuitoEsquema.xml"
        out_svg = "altimetria.svg"
    elif len(argv) == 2:
        in_xml = argv[1]
        out_svg = "altimetria.svg"
    else:
        in_xml = argv[1]
        out_svg = argv[2]

    create_altimetry_svg(in_xml, out_svg)


if __name__ == "__main__":
    main(sys.argv)
