import sys
import xml.etree.ElementTree as ET


class Html:
    """Clase para generar archivos HTML a partir de datos XML"""

    def __init__(self, author="UO287841 - Luis Salvador Ferrero Carneiro"):
        self.author = author
        self.html_content = []

    def write_header(self, title, description, keywords):
        """Escribe el encabezado HTML con metadatos"""
        header = f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="author" content="{self.author}" />
  <meta name="description" content="{description}" />
  <meta name="keywords" content="{keywords}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="stylesheet" href="estilo/estilo.css" />
  <link rel="stylesheet" href="estilo/layout.css" />
  <title>{title}</title>

  <link rel="icon" type="image/x-icon" href="multimedia/img/favicon/favicon.ico" />
</head>

<body>
  <header>
    <h1><a href="index.html">MotoGP</a></h1>

    <nav>
      <a href="index.html" title="Index">Home</a>
      <a href="piloto.html" title="Piloto">Piloto</a>
      <a href="circuito.html" class="active" title="Circuito">Circuito</a>
      <a href="metereologia.html" title="Metereología">Metereologia</a>
      <a href="clasificacion.html" title="Clasificacion">Clasificacion</a>
      <a href="juegos.html" title="Juegos">Juegos</a>
      <a href="ayuda.html" title="Ayuda">Ayuda</a>
    </nav>

    <p>
      Estás en: <a href="index.html">Inicio</a> &gt; &gt;
      <strong>Circuito</strong>
    </p>
  </header>

  <main>
'''
        self.html_content.append(header)

    def add_heading(self, level, text):
        """Añade un encabezado (h1-h6)"""
        self.html_content.append(f"    <h{level}>{text}</h{level}>\n")

    def add_paragraph(self, text):
        """Añade un párrafo"""
        self.html_content.append(f"    <p>{text}</p>\n")

    def open_section(self, section_class=None):
        """Abre una sección"""
        class_attr = f' class="{section_class}"' if section_class else ""
        self.html_content.append(f"    <section{class_attr}>\n")

    def close_section(self):
        """Cierra una sección"""
        self.html_content.append("    </section>\n")

    def open_article(self, article_class=None):
        """Abre un artículo"""
        class_attr = f' class="{article_class}"' if article_class else ""
        self.html_content.append(f"      <article{class_attr}>\n")

    def close_article(self):
        """Cierra un artículo"""
        self.html_content.append("      </article>\n")

    def add_list_item(self, text):
        """Añade un elemento de lista"""
        self.html_content.append(f"        <li>{text}</li>\n")

    def open_list(self, list_type="ul"):
        """Abre una lista (ul, ol, dl)"""
        self.html_content.append(f"      <{list_type}>\n")

    def close_list(self, list_type="ul"):
        """Cierra una lista"""
        self.html_content.append(f"      </{list_type}>\n")

    def add_table_row(self, cells, is_header=False):
        """Añade una fila de tabla"""
        tag = "th" if is_header else "td"
        row = "          <tr>\n"
        for cell in cells:
            row += f"            <{tag}>{cell}</{tag}>\n"
        row += "          </tr>\n"
        self.html_content.append(row)

    def open_table(self, caption=None):
        """Abre una tabla"""
        self.html_content.append("      <table>\n")
        if caption:
            self.html_content.append(f"        <caption>{caption}</caption>\n")

    def open_thead(self):
        """Abre thead"""
        self.html_content.append("        <thead>\n")

    def close_thead(self):
        """Cierra thead"""
        self.html_content.append("        </thead>\n")

    def open_tbody(self):
        """Abre tbody"""
        self.html_content.append("        <tbody>\n")

    def close_tbody(self):
        """Cierra tbody"""
        self.html_content.append("        </tbody>\n")

    def close_table(self):
        """Cierra una tabla"""
        self.html_content.append("      </table>\n")

    def add_image(self, src, alt, description=None):
        """Añade una imagen"""
        img = f'      <img src="{src}" alt="{alt}" />\n'
        self.html_content.append(img)
        if description:
            self.html_content.append(f"      <p>{description}</p>\n")

    def add_video(self, src, description=None):
        """Añade un video"""
        video = f'''      <video controls>
        <source src="{src}" type="video/webm" />
        Tu navegador no soporta el elemento de video.
      </video>\n'''
        self.html_content.append(video)
        if description:
            self.html_content.append(f"      <p>{description}</p>\n")

    def add_link(self, href, text):
        """Añade un enlace"""
        self.html_content.append(f'      <a href="{href}">{text}</a>\n')

    def write_footer(self):
        """Escribe el cierre del HTML"""
        footer = """  </main>
</body>
</html>
"""
        self.html_content.append(footer)

    def save(self, filename):
        """Guarda el contenido HTML en un archivo"""
        with open(filename, "w", encoding="utf-8") as f:
            f.writelines(self.html_content)


def extract_circuit_info(xml_file):
    """Extrae información del circuito usando XPath"""
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Detectar namespace
    if root.tag.startswith("{"):
        doc_ns = root.tag[1 : root.tag.index("}")]
    else:
        doc_ns = "http://www.uniovi.es/circuito"

    nsmap = {"c": doc_ns}

    # Diccionario para almacenar toda la información
    info = {}

    # Nombre del circuito
    nombre = root.find(".//c:nombre", namespaces=nsmap)
    info["nombre"] = nombre.text.strip() if nombre is not None else "Circuito"

    # Medidas
    longitud = root.find(".//c:medidas//c:longitud", namespaces=nsmap)
    if longitud is not None:
        info["longitud"] = longitud.text.strip()
        info["longitud_unidades"] = longitud.get("unidades", "m")

    anchura = root.find(".//c:medidas//c:anchuraMedia", namespaces=nsmap)
    if anchura is not None:
        info["anchura"] = anchura.text.strip()
        info["anchura_unidades"] = anchura.get("unidades", "m")

    # Evento
    fecha = root.find(".//c:evento//c:fecha", namespaces=nsmap)
    info["fecha"] = fecha.text.strip() if fecha is not None else ""

    hora = root.find(".//c:evento//c:horaInicio", namespaces=nsmap)
    info["hora"] = hora.text.strip() if hora is not None else ""

    vueltas = root.find(".//c:evento//c:numeroVueltas", namespaces=nsmap)
    info["vueltas"] = vueltas.text.strip() if vueltas is not None else ""

    # Ubicación
    localidad = root.find(".//c:ubicacion//c:localidadProxima", namespaces=nsmap)
    info["localidad"] = localidad.text.strip() if localidad is not None else ""

    pais = root.find(".//c:ubicacion//c:pais", namespaces=nsmap)
    info["pais"] = pais.text.strip() if pais is not None else ""

    # Patrocinio
    patrocinador = root.find(
        ".//c:patrocinio//c:patrocinadorPrincipal", namespaces=nsmap
    )
    info["patrocinador"] = patrocinador.text.strip() if patrocinador is not None else ""

    # Referencias
    referencias = root.findall(".//c:referencias//c:referencia", namespaces=nsmap)
    info["referencias"] = [ref.text.strip() for ref in referencias if ref.text]

    # Galería de fotos
    fotos = root.findall(".//c:galeriaFotos//c:foto", namespaces=nsmap)
    info["fotos"] = []
    for foto in fotos:
        info["fotos"].append(
            {
                "archivo": foto.get("archivo", ""),
                "descripcion": foto.get("descripcion", ""),
            }
        )

    # Galería de videos
    videos = root.findall(".//c:galeriaVideos//c:video", namespaces=nsmap)
    info["videos"] = []
    for video in videos:
        info["videos"].append(
            {
                "archivo": video.get("archivo", ""),
                "descripcion": video.get("descripcion", ""),
                "duracion": video.get("duracion", ""),
            }
        )

    # Resultado
    vencedor = root.find(".//c:resultado//c:vencedor", namespaces=nsmap)
    info["vencedor"] = vencedor.text.strip() if vencedor is not None else ""

    tiempo = root.find(".//c:resultado//c:tiempoTotal", namespaces=nsmap)
    info["tiempo"] = tiempo.text.strip() if tiempo is not None else ""

    # Clasificación mundial
    pilotos = root.findall(".//c:clasificacionMundial//c:piloto", namespaces=nsmap)
    info["clasificacion"] = []
    for piloto in pilotos:
        nombre_piloto = piloto.find("c:nombrePiloto", namespaces=nsmap)
        equipo = piloto.find("c:equipo", namespaces=nsmap)
        puntos = piloto.find("c:puntos", namespaces=nsmap)
        posicion = piloto.get("posicion", "")

        info["clasificacion"].append(
            {
                "posicion": posicion,
                "nombre": nombre_piloto.text.strip()
                if nombre_piloto is not None
                else "",
                "equipo": equipo.text.strip() if equipo is not None else "",
                "puntos": puntos.text.strip() if puntos is not None else "",
            }
        )

    return info


def escape_html(text):
    """Escapa caracteres especiales de HTML"""
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def create_html(xml_file, html_file):
    """Genera el archivo HTML a partir del XML"""

    try:
        info = extract_circuit_info(xml_file)
    except FileNotFoundError:
        print(f"Error: No se encuentra el archivo {xml_file}")
        sys.exit(1)
    except ET.ParseError as e:
        print(f"Error al parsear XML: {e}")
        sys.exit(1)

    # Crear objeto HTML
    html = Html()

    # Escribir encabezado
    html.write_header(
        title=f"MotoGP - {info['nombre']}",
        description=f"Información sobre el circuito {info['nombre']}",
        keywords="MotoGP, circuito, carreras, motociclismo",
    )

    # Título principal (dentro de main)
    html.add_heading(2, info["nombre"])

    # Sección: Información General
    html.open_section("info-general")
    html.add_heading(3, "Información General")

    # Características del circuito
    html.add_heading(4, "Características del Circuito")
    html.open_list("dl")
    html.html_content.append("        <dt>Longitud</dt>\n")
    html.html_content.append(
        f"        <dd>{info.get('longitud', 'N/A')} {info.get('longitud_unidades', '')}</dd>\n"
    )
    html.html_content.append("        <dt>Anchura Media</dt>\n")
    html.html_content.append(
        f"        <dd>{info.get('anchura', 'N/A')} {info.get('anchura_unidades', '')}</dd>\n"
    )
    html.close_list("dl")

    # Ubicación
    html.add_heading(4, "Ubicación")
    html.open_list("dl")
    html.html_content.append("        <dt>Localidad</dt>\n")
    html.html_content.append(f"        <dd>{info.get('localidad', 'N/A')}</dd>\n")
    html.html_content.append("        <dt>País</dt>\n")
    html.html_content.append(f"        <dd>{info.get('pais', 'N/A')}</dd>\n")
    html.close_list("dl")

    html.close_section()

    # Sección: Evento
    html.open_section("evento")
    html.add_heading(3, "Información del Evento")

    html.open_list("dl")
    html.html_content.append("        <dt>Fecha</dt>\n")
    html.html_content.append(f"        <dd>{info.get('fecha', 'N/A')}</dd>\n")
    html.html_content.append("        <dt>Hora de Inicio</dt>\n")
    html.html_content.append(f"        <dd>{info.get('hora', 'N/A')}</dd>\n")
    html.html_content.append("        <dt>Número de Vueltas</dt>\n")
    html.html_content.append(f"        <dd>{info.get('vueltas', 'N/A')}</dd>\n")
    html.close_list("dl")

    html.close_section()

    # Sección: Patrocinio
    if info.get("patrocinador"):
        html.open_section("patrocinio")
        html.add_heading(3, "Patrocinio")
        html.open_list("dl")
        html.html_content.append("        <dt>Patrocinador Principal</dt>\n")
        html.html_content.append(f"        <dd>{info['patrocinador']}</dd>\n")
        html.close_list("dl")
        html.close_section()

    # Sección: Resultado
    if info.get("vencedor"):
        html.open_section("resultado")
        html.add_heading(3, "Resultado de la Carrera")
        html.open_list("dl")
        html.html_content.append("        <dt>Vencedor</dt>\n")
        html.html_content.append(f"        <dd>{info['vencedor']}</dd>\n")
        html.html_content.append("        <dt>Tiempo Total</dt>\n")
        html.html_content.append(f"        <dd>{info.get('tiempo', 'N/A')}</dd>\n")
        html.close_list("dl")
        html.close_section()

    # Sección: Clasificación Mundial
    if info.get("clasificacion"):
        html.open_section("clasificacion")
        html.add_heading(3, "Clasificación Mundial")

        html.open_table("Top Pilotos en el Campeonato")
        html.open_thead()
        html.add_table_row(["Posición", "Piloto", "Equipo", "Puntos"], is_header=True)
        html.close_thead()

        html.open_tbody()
        for piloto in info["clasificacion"]:
            html.add_table_row(
                [
                    piloto["posicion"],
                    piloto["nombre"],
                    piloto["equipo"],
                    piloto["puntos"],
                ]
            )
        html.close_tbody()

        html.close_table()
        html.close_section()

    # Sección: Galería de Fotos
    if info.get("fotos"):
        html.open_section("galeria-fotos")
        html.add_heading(3, "Galería de Fotos")

        for foto in info["fotos"]:
            html.add_image(
                foto["archivo"],
                foto["descripcion"] if foto["descripcion"] else "Imagen del circuito",
                foto["descripcion"],
            )

        html.close_section()

    # Sección: Galería de Videos
    if info.get("videos"):
        html.open_section("galeria-videos")
        html.add_heading(3, "Galería de Videos")

        for video in info["videos"]:
            html.add_video(video["archivo"], video["descripcion"])

        html.close_section()

    # Sección: Referencias
    if info.get("referencias"):
        html.open_section("referencias")
        html.add_heading(3, "Referencias")
        html.open_list("ul")

        for ref in info["referencias"]:
            # Escapar & en las referencias
            ref_escaped = escape_html(ref)
            html.add_list_item(ref_escaped)

        html.close_list("ul")
        html.close_section()

    # Escribir cierre
    html.write_footer()
    html.save(html_file)

    print(f"Archivo HTML generado: {html_file}")
    print(f"Circuito: {info['nombre']}")
    print("HTML válido según estándares W3C")


def main(argv):
    if len(argv) < 2:
        in_xml = "circuitoEsquema.xml"
        out_html = "circuito.html"
    elif len(argv) == 2:
        in_xml = argv[1]
        out_html = "circuito.html"
    else:
        in_xml = argv[1]
        out_html = argv[2]

    create_html(in_xml, out_html)


if __name__ == "__main__":
    main(sys.argv)
