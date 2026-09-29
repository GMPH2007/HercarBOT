#!/usr/bin/env python3
"""
Generador de Documento Word (.docx) Profesional
Informe Técnico y Memoria Descriptiva de HercarIA
IESTP "Hermanos Cárcamo" - Paita, Piura
"""

import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

doc = Document()

# Configurar márgenes de página (2.5 cm)
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Paleta de Colores Corporativa
COLOR_NAVY = RGBColor(19, 53, 123)     # #13357b
COLOR_BLUE = RGBColor(37, 99, 235)     # #2563eb
COLOR_GOLD = RGBColor(217, 119, 6)     # #d97706
COLOR_GRAY = RGBColor(100, 116, 139)   # #64748b

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

# ==========================================
# PORTADA FORMAL Y ELEGANTE
# ==========================================
p_inst = doc.add_paragraph()
p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_inst = p_inst.add_run('INSTITUTO DE EDUCACIÓN SUPERIOR TECNOLÓGICO PÚBLICO\n"HERMANOS CÁRCAMO" — PAITA, PIURA')
run_inst.font.name = 'Arial'
run_inst.font.size = Pt(13)
run_inst.font.bold = True
run_inst.font.color.rgb = COLOR_NAVY
p_inst.paragraph_format.space_after = Pt(25)

# Insignia Oficial
if os.path.exists('assets/logo-crest.png'):
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture('assets/logo-crest.png', width=Inches(2.2))
    p_logo_after = doc.paragraphs[-1]
    p_logo_after.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo_after.paragraph_format.space_after = Pt(25)

# Título Principal
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run('INFORME TÉCNICO Y MEMORIA DESCRIPTIVA')
run_title.font.name = 'Arial'
run_title.font.size = Pt(22)
run_title.font.bold = True
run_title.font.color.rgb = COLOR_NAVY
p_title.paragraph_format.space_after = Pt(10)

p_subtitle = doc.add_paragraph()
p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_subtitle.add_run('Desarrollo e Implementación del Asistente Virtual Inteligente\ny Orientador Vocacional "HercarIA"')
run_sub.font.name = 'Arial'
run_sub.font.size = Pt(13.5)
run_sub.font.color.rgb = COLOR_BLUE
p_subtitle.paragraph_format.space_after = Pt(45)

# Bloque de Metadatos
p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

r = p_meta.add_run('Autor / Desarrollador:\n')
r.font.bold = True
r.font.size = Pt(11)
r = p_meta.add_run('Gerson Misael Pintado Huamán (GMPH2007)\n\n')
r.font.size = Pt(12)

r = p_meta.add_run('Repositorio Oficial en GitHub:\n')
r.font.bold = True
r.font.size = Pt(10)
r = p_meta.add_run('https://github.com/GMPH2007/HercarBOT\n\n')
r.font.size = Pt(10)
r.font.color.rgb = COLOR_BLUE

r = p_meta.add_run('Despliegue Web en Vivo (GitHub Pages):\n')
r.font.bold = True
r.font.size = Pt(10)
r = p_meta.add_run('https://gmph2007.github.io/HercarBOT/\n\n')
r.font.size = Pt(10)
r.font.color.rgb = COLOR_BLUE

r = p_meta.add_run('Paita — Piura, Perú\n2026')
r.font.size = Pt(11)
r.font.bold = True
r.font.color.rgb = COLOR_GRAY

doc.add_page_break()

# ==========================================
# FUNCIONES DE CONTENIDO
# ==========================================
def add_h1(text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(6)
    r = h.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = COLOR_NAVY
    return h

def add_h2(text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    r = h.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(12.5)
    r.font.bold = True
    r.font.color.rgb = COLOR_BLUE
    return h

def add_p(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    r = p.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(10.5)
    return p

def add_bullet(bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    r1 = p.add_run(bold_prefix)
    r1.font.name = 'Arial'
    r1.font.bold = True
    r1.font.size = Pt(10.5)
    r2 = p.add_run(text)
    r2.font.name = 'Arial'
    r2.font.size = Pt(10.5)
    return p

# 1. Resumen Ejecutivo
add_h1('1. RESUMEN EJECUTIVO')
add_p('El presente documento técnico describe el diseño, arquitectura, desarrollo y puesta en producción de "HercarIA", el sistema interactivo de inteligencia artificial y orientación vocacional creado para el Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo" de Paita.')
add_p('HercarIA proporciona atención continua y personalizada a postulantes, alumnos regulares y padres de familia a través de una interfaz moderna inspirada en ChatGPT, integrando capacidades de procesamiento de lenguaje natural (NLP), síntesis de voz femenina neural humana (es-ES-ElviraNeural), reconocimiento por micrófono (Speech-to-Text), un algoritmo de test vocacional de 6 reactivos y una base de conocimientos completa que resuelve dudas sobre admisiones, carreras técnicas, gratuidad educativa y registro digital de vouchers.')

# 2. Justificacion
add_h1('2. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN')
add_p('En la provincia de Paita existe una alta demanda de profesionales técnicos calificados para los sectores pesquero, logístico-portuario, comercial y tecnológico. No obstante, los egresados de secundaria enfrentan barreras informativas críticas:')
add_bullet('Indecisión Vocacional: ', 'Falta de un orientador vocacional accesible que guíe las aptitudes del postulante hacia una carrera técnica con inserción laboral real.')
add_bullet('Horarios Restringidos de Atención: ', 'Las consultas presenciales en secretaría solo se realizan en horario diurno de lunes a viernes (8:00 AM a 3:00 PM), dejando sin soporte a quienes estudian o trabajan.')
add_bullet('Confusión con Instituciones Privadas: ', 'Muchos aspirantes desconocen que el IESTP Hermanos Cárcamo es un instituto público estatal donde la enseñanza es 100% gratuita (sin pensiones mensuales privadas), requiriendo únicamente el abono de una tasa administrativa semestral.')
add_bullet('Dificultades en el Registro de Pagos: ', 'El uso de la plataforma digital institucional (pagos.ieshercar.edu.pe) genera dudas sobre el registro de códigos de operación del Banco de la Nación y la descarga de boletas electrónicas.')

# 3. Stack Tecnologico
add_h1('3. STACK TECNOLÓGICO Y ARQUITECTURA')
add_p('Se seleccionó una arquitectura desacoplada de alto rendimiento que no depende de frameworks pesados, garantizando tiempos de carga inferiores a 1 segundo:')

table_tech = doc.add_table(rows=1, cols=3)
table_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = table_tech.rows[0].cells
hdr_cells[0].text = 'Capa'
hdr_cells[1].text = 'Tecnología'
hdr_cells[2].text = 'Función en el Sistema'
for i, c in enumerate(hdr_cells):
    set_cell_background(c, '13357B')
    p = c.paragraphs[0]
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_margins(c, 120, 120, 150, 150)

tech_rows = [
    ('Frontend UI', 'HTML5 Semántico + CSS3 Avanzado', 'Interfaz responsiva en pantalla completa, diseño de portada, modo oscuro y animaciones ripple.'),
    ('Lógica Conversacional', 'Vanilla JavaScript (ES6+)', 'Normalización de texto, motor NLP de intenciones, parsing de Markdown y gestión del DOM.'),
    ('Iconografía', 'Inline SVG Vectors (Phosphor Standard)', 'Iconos vectoriales de trazo uniforme a 2px en lugar de emojis informales.'),
    ('Test Vocacional', 'Algoritmo Polifactorial JS', 'Evaluación de 6 factores psicométricos con cálculo de compatibilidad porcentual.'),
    ('Síntesis de Voz', 'Python edge-tts + Web Speech API', 'Generación de voz femenina neural de alta fidelidad (es-ES-ElviraNeural) y fallback nativo.'),
    ('Reconocimiento Voz', 'Web Speech Recognition API', 'Dictado por micrófono en tiempo real con dialecto peruano (es-PE).'),
    ('Alojamiento Web', 'GitHub Pages (HTTPS CDN)', 'Despliegue global en la nube disponible 24/7 de forma gratuita y segura.')
]

for row in tech_rows:
    r_cells = table_tech.add_row().cells
    for idx, text in enumerate(row):
        r_cells[idx].text = text
        p = r_cells[idx].paragraphs[0]
        p.runs[0].font.name = 'Arial'
        p.runs[0].font.size = Pt(9.5)
        set_cell_margins(r_cells[idx], 100, 100, 120, 120)

doc.add_page_break()

# 4. Carreras
add_h1('4. OFERTA FORMATIVA INSTITUCIONAL')
add_p('Todas las carreras profesionales técnicas tienen una duración de 3 años lectivos (6 semestres académicos), otorgan Título Profesional Técnico a Nombre de la Nación y certificaciones modulares progresivas cada año:')

carreras_data = [
    ('Arquitectura de Plataformas y Servicios TI (APSTI)', 'Desarrollo de software web y móvil, administración de redes, ciberseguridad, servidores e infraestructura cloud.', 'Desarrollador web/móvil, administrador cloud, soporte TI en agencias aduaneras y empresas portuarias.'),
    ('Administración de Negocios Internacionales (ANI)', 'Estrategias comerciales globales, exportación de productos del norte, aduanas, logística de contenedores y transporte marítimo.', 'Agencias marítimas y de aduanas en el Puerto de Paita, almacenes fiscales y empresas exportadoras.'),
    ('Contabilidad', 'Gestión tributaria (SUNAT), formulación de estados financieros, libros electrónicos, auditoría y costos empresariales.', 'Estudios contables, entidades bancarias (Banco de la Nación, Cajas Piura), hospitales, municipios y MYPES.'),
    ('Desarrollo Pesquero y Acuícola (DPA)', 'Cultivo de conchas de abanico y langostinos, faenas de navegación pesquera, procesamiento industrial e inocuidad alimentaria (HACCP).', 'Supervisores QA/QC en plantas congeladoras y conserveras de Paita, criaderos acuícolas e inspectores sanitarios.')
]

table_c = doc.add_table(rows=1, cols=3)
table_c.alignment = WD_TABLE_ALIGNMENT.CENTER
for idx, title in enumerate(['Carrera Profesional', 'Enfoque Formativo', 'Campo Laboral en Paita / Piura']):
    c = table_c.rows[0].cells[idx]
    c.text = title
    set_cell_background(c, '13357B')
    p = c.paragraphs[0]
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_margins(c, 120, 120, 150, 150)

for c_row in carreras_data:
    r_cells = table_c.add_row().cells
    for idx, text in enumerate(c_row):
        r_cells[idx].text = text
        p = r_cells[idx].paragraphs[0]
        p.runs[0].font.name = 'Arial'
        p.runs[0].font.size = Pt(9.5)
        set_cell_margins(r_cells[idx], 100, 100, 120, 120)

# 5. Pagos y Matricula
add_h1('5. PROCEDIMIENTOS DE MATRÍCULA Y REGISTRO DE PAGOS')
add_h2('5.1. Matrícula y Gratuidad de la Enseñanza')
add_p('Por ser una institución pública estatal supervisada por el Ministerio de Educación (MINEDU) y la Dirección Regional de Educación de Piura (DREP), no existen pensiones mensuales. Los estudiantes únicamente abonan una tasa administrativa semestral conforme al TUPA institucional (aproximadamente S/ 150 a S/ 250 por ciclo de 6 meses completo).')

add_h2('5.2. Protocolo de Registro de Vouchers')
add_bullet('Paso 1: ', 'El usuario realiza el depósito en el Banco de la Nación (ventanilla o Agente MultiRed) y conserva el comprobante.')
add_bullet('Paso 2: ', 'Accede a la plataforma oficial: https://pagos.ieshercar.edu.pe/')
add_bullet('Paso 3: ', 'Ingresa su número de DNI para autenticarse en el sistema.')
add_bullet('Paso 4: ', 'Selecciona el concepto (Matrícula, Examen de Admisión o Trámite) y digita el Número de Operación, Fecha y Monto.')
add_bullet('Paso 5: ', 'Adjunta el archivo o foto del voucher legible y confirma el registro.')
add_bullet('Paso 6: ', 'Descarga la boleta electrónica oficial desde: https://sistema.ieshercar.com/Consulta_Boletas/index.php')

# 6. MEMORIA DE DESARROLLO: CÓMO SE HIZO EL SISTEMA
add_h1('6. MEMORIA DE DESARROLLO: CÓMO SE CONSTRUYÓ HERCARTIA')
add_p('El desarrollo de HercarIA se llevó a cabo siguiendo una metodología ágil de ingeniería de software orientada a prototipado rápido, alta fidelidad visual y optimización de rendimiento. A continuación se desglosan las fases de construcción:')

add_h2('Fase 1: Extracción y Estructuración de Conocimiento Institucional')
add_bullet('Recopilación de Fuentes Oficiales: ', 'Se realizó un relevamiento minucioso de la web oficial ieshercar.edu.pe, portales de pago (pagos.ieshercar.edu.pe), sistema de boletas y el TUPA del instituto.')
add_bullet('Categorización Ontológica: ', 'La información se estructuró en js/knowledge.js bajo tópicos bien diferenciados: Identidad histórica y héroes patronos Cárcamo, las 4 carreras técnicas, requisitos de admisión y fechas, estructura de costos públicos (gratuidad de enseñanza) y guía de trámites de Mesa de Partes.')

add_h2('Fase 2: Diseño de Experiencia de Usuario (UI/UX) Estilo ChatGPT')
add_bullet('Estructura Visual: ', 'Se adoptó una maquetación en pantalla completa con barra lateral colapsable, contenedor central conversacional y una portada de bienvenida ("¿Qué deseas consultar hoy?") que contextualiza al visitante.')
add_bullet('Estandarización Iconográfica: ', 'Se reemplazaron emojis heterogéneos por una librería unificada de iconos vectoriales SVG con trazo de 2px, garantizando un aspecto sobrio y corporativo.')
add_bullet('Identidad Visual Institucional: ', 'Se aplicó la paleta cromática oficial: Azul Marino (#13357b), Azul Eléctrico (#2563eb) y Acentos Ámbar (#f59e0b), complementado con soporte de Tema Oscuro (Dark Mode).')

add_h2('Fase 3: Desarrollo del Test Vocacional Interactivo')
add_bullet('Algoritmo de Compatibilidad: ', 'Se implementó en js/test_vocacional.js un cuestionario interactivo de 6 reactivos con opciones múltiples que evalúan afinidad hacia software y redes (APSTI), logística y puertos (ANI), finanzas y tributos (Contabilidad) o recursos marinos y pesquería (DPA).')
add_bullet('Cálculo Dinámico: ', 'Al finalizar las 6 preguntas, el algoritmo calcula el porcentaje de compatibilidad relativa y presenta una tarjeta destacada con trofeo dorado y sugerencias de inserción profesional.')

add_h2('Fase 4: Motor de Voz Femenina Neural Peruana y Dictado por Micrófono')
add_bullet('Voz Neural Camila (Perú): ', 'Se adoptó como estándar principal es-PE-CamilaNeural a través de Microsoft Edge TTS, garantizando una entonación dulce, natural y con fonética propia del Perú para la comunidad de Paita y Piura.')
add_bullet('Normalización Fonética Especializada: ', 'Se incorporó un preprocesador que traduce siglas antes de la síntesis (I.E.S.T.P. a "Instituto", S/ 150 a "150 soles", APSTI a "A P S T I"), eliminando pausas forzadas o lecturas fragmentadas.')
add_bullet('Segmentación Inteligente por Expresiones Regulares: ', 'Se reemplazó la división simplista por puntos por un parser de oraciones completas que une frases coherentes hasta 320 caracteres, garantizando fluidez total.')
add_bullet('Control de Silenciamiento Inmediato: ', 'Se programó la interrupción instantánea de audio mediante tecla Escape, clic en entrada de texto o activación del botón de silenciar, evitando solapamientos sonoros.')
add_bullet('Entrada por Micrófono (STT): ', 'Se añadió reconocimiento de voz en tiempo real con indicador visual de ondas concéntricas (ripple pulse).')

add_h2('Fase 5: Navegación Adaptativa y Control de Conversación')
add_bullet('Menú Responsivo de 3 Líneas: ', 'En pantallas de escritorio (Desktop), el botón de 3 líneas colapsa suavemente el menú lateral hacia la izquierda (-280px), otorgando el 100% de la pantalla al chat conversacional estilo ChatGPT. En dispositivos móviles y tabletas, despliega un cajón lateral (Drawer) con telón oscuro translúcido (overlay) y botón de cierre táctil.')
add_bullet('Función Guardar Registro de Chat: ', 'Permite al usuario descargar con un solo clic un archivo formal (.txt) con la transcripción completa de su diálogo, fecha, hora y encabezados institucionales para su archivo personal.')
add_bullet('Función Borrar Conversación: ', 'Botón con confirmación interactiva para limpiar la pantalla de chat, restablecer el estado del sistema y regresar a la portada de bienvenida.')
add_bullet('Historial de Consultas Recientes: ', 'Almacenamiento persistente en localStorage que registra las preguntas formuladas y permite relanzarlas rápidamente desde la barra lateral.')
add_bullet('Enlaces Directos a Plataformas Oficiales: ', 'Acceso inmediato en cabecera y portada a la Biblioteca Virtual (biblioteca.ieshercar.edu.pe), Portal Web Oficial (ieshercar.edu.pe), Sistema de Pagos y Vouchers (pagos.ieshercar.edu.pe), Mesa de Partes Virtual y Consulta de Boletas Electrónicas.')
add_bullet('Optimización Táctil para Celulares: ', 'Adaptación del viewport (100dvh) para teléfonos móviles, cuadrícula responsiva a una sola columna y accesibilidad completa desde cualquier smartphone.')

add_h2('Fase 6: Optimización, Pruebas y Despliegue en la Nube')
add_bullet('Pruebas de Calidad de Interacción: ', 'Se evaluó la normalización de lenguaje eliminando tildes, signos de puntuación y admitiendo modismos frecuentes de los postulantes.')
add_bullet('Despliegue Continuo en GitHub Pages: ', 'El repositorio se alojó en GitHub (https://github.com/GMPH2007/HercarBOT) y se configuró GitHub Pages para acceso inmediato vía HTTPS desde cualquier smartphone o computadora.')

# 7. Manual y Enlaces
add_h1('7. GUÍA DE INSTALACIÓN Y ENLACES INSTITUCIONALES')
add_p('HercarIA se distribuye en dos modalidades para facilidad de los usuarios:')
add_bullet('Lanzador con 1 Clic (Local Windows): ', 'Doble clic en el archivo Iniciar_HercarBOT.bat para activar el servidor con síntesis de voz neural y abrir el navegador.')
add_bullet('Sitio Web en Vivo (Nube): ', 'Disponible en cualquier dispositivo a través de https://gmph2007.github.io/HercarBOT/')
add_bullet('Biblioteca Virtual Institucional: ', 'https://biblioteca.ieshercar.edu.pe/login.php')
add_bullet('Plataforma de Pagos y Vouchers: ', 'https://pagos.ieshercar.edu.pe/')
add_bullet('Mesa de Partes Virtual: ', 'https://sistema.ieshercar.edu.pe/registro-tramite/')
add_bullet('Consulta de Boletas: ', 'https://sistema.ieshercar.com/Consulta_Boletas/index.php')

# Guardar documento Word
output_file = 'INFORME_TECNICO_HERCARBOT.docx'
doc.save(output_file)
print(f'{output_file} generado exitosamente!')

