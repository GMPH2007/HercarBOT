#!/usr/bin/env python3
"""
Generador de Documento Word (.docx) Profesional de Alta Fidelidad
Informe Técnico y Memoria Descriptiva Completa de HercarIA
IESTP "Hermanos Cárcamo" - Paita, Piura
Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI)
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

# Configuración de márgenes estándar (1 pulgada / 2.54 cm)
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

# Paleta de Colores Corporativa Oficial
COLOR_NAVY = RGBColor(19, 53, 123)     # #13357b (Azul Institucional Primario)
COLOR_BLUE = RGBColor(37, 99, 235)     # #2563eb (Azul Eléctrico Tecnológico)
COLOR_GOLD = RGBColor(217, 119, 6)     # #d97706 (Ámbar Distintivo)
COLOR_GRAY = RGBColor(100, 116, 139)   # #64748b (Gris Pizarra Técnico)
COLOR_DARK = RGBColor(30, 41, 59)      # #1e293b (Texto Principal)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=130, bottom=130, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

# ==========================================
# PORTADA ACADÉMICA FORMAL Y ELEGANTE
# ==========================================
p_inst = doc.add_paragraph()
p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_inst = p_inst.add_run('INSTITUTO DE EDUCACIÓN SUPERIOR TECNOLÓGICO PÚBLICO\n"HERMANOS CÁRCAMO" — PAITA, PIURA')
run_inst.font.name = 'Arial'
run_inst.font.size = Pt(13)
run_inst.font.bold = True
run_inst.font.color.rgb = COLOR_NAVY
p_inst.paragraph_format.space_after = Pt(20)

# Insignia Oficial Institucional
if os.path.exists('assets/logo-crest.png'):
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_picture('assets/logo-crest.png', width=Inches(2.2))
    p_logo_after = doc.paragraphs[-1]
    p_logo_after.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo_after.paragraph_format.space_after = Pt(20)

# Título Principal
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run('INFORME TÉCNICO Y MEMORIA DESCRIPTIVA')
run_title.font.name = 'Arial'
run_title.font.size = Pt(22)
run_title.font.bold = True
run_title.font.color.rgb = COLOR_NAVY
p_title.paragraph_format.space_after = Pt(8)

p_subtitle = doc.add_paragraph()
p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_sub = p_subtitle.add_run('Desarrollo e Implementación del Asistente Virtual Inteligente\ny Orientador Vocacional "HercarIA"')
run_sub.font.name = 'Arial'
run_sub.font.size = Pt(13.5)
run_sub.font.bold = True
run_sub.font.color.rgb = COLOR_BLUE
p_subtitle.paragraph_format.space_after = Pt(25)

# Bloque de Metadatos del Proyecto
p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER

r = p_meta.add_run('CARRERA PROFESIONAL TÉCNICA:\n')
r.font.bold = True
r.font.size = Pt(10.5)
r.font.color.rgb = COLOR_NAVY
r = p_meta.add_run('Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI)\n\n')
r.font.bold = True
r.font.size = Pt(11.5)
r.font.color.rgb = COLOR_BLUE

r = p_meta.add_run('AUTOR / DESARROLLADOR:\n')
r.font.bold = True
r.font.size = Pt(10.5)
r = p_meta.add_run('Gerson Misael Pintado Huamán (GMPH2007)\n\n')
r.font.size = Pt(12)
r.font.bold = True

r = p_meta.add_run('REPOSITORIO OFICIAL EN GITHUB:\n')
r.font.bold = True
r.font.size = Pt(9.5)
r = p_meta.add_run('https://github.com/GMPH2007/HercarBOT\n\n')
r.font.size = Pt(9.5)
r.font.color.rgb = COLOR_BLUE

r = p_meta.add_run('DESPLIEGUE WEB EN VIVO (GITHUB PAGES):\n')
r.font.bold = True
r.font.size = Pt(9.5)
r = p_meta.add_run('https://gmph2007.github.io/HercarBOT/\n\n')
r.font.size = Pt(9.5)
r.font.color.rgb = COLOR_BLUE

r = p_meta.add_run('Paita — Piura, Perú\n2026')
r.font.size = Pt(11)
r.font.bold = True
r.font.color.rgb = COLOR_GRAY

doc.add_page_break()

# ==========================================
# FUNCIONES AUXILIARES DE FORMATEO
# ==========================================
def add_h1(text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(6)
    r = h.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = COLOR_NAVY
    return h

def add_h2(text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(12)
    h.paragraph_format.space_after = Pt(4)
    r = h.add_run(text)
    r.font.name = 'Arial'
    r.font.size = Pt(12)
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
    r.font.color.rgb = COLOR_DARK
    return p

def add_bullet(bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    r1 = p.add_run(bold_prefix)
    r1.font.name = 'Arial'
    r1.font.bold = True
    r1.font.size = Pt(10.5)
    r1.font.color.rgb = COLOR_DARK
    r2 = p.add_run(text)
    r2.font.name = 'Arial'
    r2.font.size = Pt(10.5)
    r2.font.color.rgb = COLOR_DARK
    return p

# ==========================================
# 1. RESUMEN EJECUTIVO
# ==========================================
add_h1('1. RESUMEN EJECUTIVO')
add_p('El presente informe técnico expone la concepción, fundamentación técnica, desarrollo e implementación del sistema "HercarIA", un asistente virtual conversacional inteligente dotado de síntesis de voz femenina neural humana y orientador vocacional psicométrico, concebido específicamente para el Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo" de Paita.')
add_p('Desarrollado en el marco formativo de la Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI), HercarIA solventa la brecha de orientación académica en la provincia de Paita y el norte peruano. Ofrece atención ininterrumpida las 24 horas del día, los 7 días de la semana, informando verazmente sobre la oferta formativa institucional (APSTI, Administración de Negocios Internacionales, Contabilidad y Desarrollo Pesquero y Acuícola), el principio de gratuidad de la enseñanza pública (sin mensualidades privadas), los protocolos de registro digital de vouchers del Banco de la Nación, requisitos de admisión y el trámite de documentos oficiales a través de la Mesa de Partes Virtual.')
add_p('La solución se distingue por su arquitectura ligera y moderna inspirada en ChatGPT, con menú colapsable, controles ergonómicos en cabecera ("Guardar Chat" en archivo de texto formal y "Borrar Chat"), barra de píldoras de acceso rápido sobre el campo de escritura, y un avanzado motor de voz sintetizada dulce, natural y libre de lecturas robóticas de sintaxis Markdown.')

# ==========================================
# 2. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN EN PAITA
# ==========================================
add_h1('2. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN EN PAITA')
add_p('La provincia de Paita constituye el segundo polo económico y comercial más relevante de la Región Piura, albergando el principal puerto marítimo del norte peruano (Terminal Portuario Euroandinos), una pujante industria pesquera y acuícola, centros logísticos aduaneros y agroexportadores. Pese a este entorno favorable, los egresados de educación secundaria y jóvenes de la región enfrentan serias dificultades al momento de decidir su formación superior:')
add_bullet('Desinformación sobre la Gratuidad Pública: ', 'Gran parte de los postulantes y padres de familia confunden al instituto con una entidad privada lucrativa, asumiendo erróneamente que deberán afrontar costosas pensiones mensuales. HercarIA aclara permanentemente que el IESTP Hermanos Cárcamo es 100% público estatal y que solo se abona una tasa semestral mínima por concepto de TUPA.')
add_bullet('Indecisión Vocacional y Deserción Prematura: ', 'Muchos aspirantes carecen de test vocacionales cercanos y accesibles, postulando a carreras que no concuerdan con sus habilidades reales. El test vocacional integrado de 6 reactivos orienta objetivamente el perfil del estudiante hacia las necesidades laborales reales de Paita.')
add_bullet('Restricción Horaria en Mesa de Partes y Secretaría: ', 'La atención administrativa presencial concluye a las 3:00 PM de lunes a viernes, imposibilitando la resolución de dudas en horario vespertino, nocturno o fines de semana.')
add_bullet('Complejidad en el Registro Virtual de Pagos: ', 'El uso de la plataforma digital institucional (pagos.ieshercar.edu.pe) suscita dudas continuas respecto a qué números consignar del voucher del Banco de la Nación, cómo adjuntar el comprobante y de qué forma descargar la boleta electrónica oficial.')

# ==========================================
# 3. MARCO NORMATIVO Y OFICIALIDAD INSTITUCIONAL
# ==========================================
add_h1('3. MARCO NORMATIVO Y OFICIALIDAD INSTITUCIONAL')
add_p('HercarIA se diseñó alineado a las directrices de la legislación educativa técnica superior del Perú:')
add_bullet('Ley de Institutos y Escuelas de Educación Superior N° 30512: ', 'Marco legal que regula el funcionamiento de los institutos tecnológicos del país, garantizando calidad académica, pertinencia formativa y titulación oficial.')
add_bullet('Título Profesional Técnico a Nombre de la Nación: ', 'Todos los programas académicos concluidos con éxito en el IESTP Hermanos Cárcamo otorgan Título Profesional Técnico expedido directamente por el Ministerio de Educación (MINEDU), con validez nacional e internacional.')
add_bullet('Convalidación Universitaria (SUNEDU): ', 'Los egresados titulados de las carreras técnicas de 3 años pueden convalidar sus créditos y cursos en universidades licenciadas por SUNEDU, completando el grado universitario de Bachiller y Licenciatura en menor tiempo.')
add_bullet('Certificaciones Modulares Progresivas: ', 'Por cada año lectivo aprobado (2 semestres), el alumno recibe un certificado oficial modular técnico que le permite insertarse formalmente en el mercado laboral antes de titularse.')

# ==========================================
# 4. OFERTA FORMATIVA INSTITUCIONAL (LAS 4 CARRERAS TÉCNICAS)
# ==========================================
add_h1('4. OFERTA FORMATIVA INSTITUCIONAL')
add_p('El IESTP Hermanos Cárcamo brinda 4 carreras profesionales técnicas de 3 años de duración lectiva (6 semestres académicos), con turno regular diurno y énfasis en talleres prácticos y laboratorios de cómputo:')

table_c = doc.add_table(rows=1, cols=3)
table_c.alignment = WD_TABLE_ALIGNMENT.CENTER
for idx, title in enumerate(['Carrera Profesional', 'Enfoque Formativo y Módulos', 'Campo Laboral en Paita / Piura']):
    c = table_c.rows[0].cells[idx]
    c.text = title
    set_cell_background(c, '13357B')
    p = c.paragraphs[0]
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_margins(c, 130, 130, 150, 150)

carreras_data = [
    ('Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI)', 
     'Desarrollo de software web y móvil, diseño de bases de datos relacionales y no relacionales, cableado estructurado, configuración de redes WAN/LAN, seguridad informática, administración de servidores Linux/Windows y despliegue en entornos Cloud.', 
     'Desarrollador de software en agencias marítimas y de aduanas, administrador de servidores en empresas del Parque Industrial de Paita, soporte TI en entidades bancarias, instituciones de salud y teletrabajo internacional.'),
    
    ('Administración de Negocios Internacionales (ANI)', 
     'Operaciones aduaneras, regímenes de importación y exportación, logística portuaria y de contenedores refrigerados, tratados comerciales internacionales, fletes marítimos e investigación de mercados exteriores.', 
     'Operadores portuarios en el Terminal Portuario Euroandinos (TPE), agencias aduaneras, depósitos aduaneros autorizados, empresas agroexportadoras de mango, uva y banano orgánico, y procesadoras de pota y perico.'),
    
    ('Contabilidad', 
     'Contabilidad comercial, de costos, gubernamental y de sociedades; registro de libros contables físicos y electrónicos (SIRE - SUNAT), liquidación de tributos (PDT, IGV, Renta), auditoría financiera y balances generales.', 
     'Estudios contables independientes, áreas de tesorería y contabilidad de empresas pesqueras e industriales, agencias bancarias (Banco de la Nación, Cajas Piura/Sullana), municipios y entidades del Estado.'),
    
    ('Desarrollo Pesquero y Acuícola (DPA)', 
     'Cultivo marino de conchas de abanico, langostinos y tilapias; artes y aparejos de pesca, navegación costera y de altura a bordo de la embarcación del instituto, procesamiento industrial y sistemas de inocuidad alimentaria (HACCP, BPM).', 
     'Supervisores de aseguramiento de calidad (QA/QC) en plantas pesqueras congeladoras y conserveras de Paita, jefes de centros de maricultura en la bahía de Sechura y Paita, capitanes de pesca e inspectores de SANIPES.')
]

for c_row in carreras_data:
    r_cells = table_c.add_row().cells
    for idx, text in enumerate(c_row):
        r_cells[idx].text = text
        p = r_cells[idx].paragraphs[0]
        p.runs[0].font.name = 'Arial'
        p.runs[0].font.size = Pt(9.5)
        set_cell_margins(r_cells[idx], 100, 100, 120, 120)

# ==========================================
# 5. PROCEDIMIENTOS DE MATRÍCULA Y REGISTRO DE PAGOS
# ==========================================
add_h1('5. PROCEDIMIENTOS DE MATRÍCULA Y REGISTRO DE PAGOS')
add_h2('5.1. Gratuidad de la Enseñanza Pública')
add_p('El IESTP Hermanos Cárcamo es un instituto tecnológico público tutelado por la Dirección Regional de Educación de Piura (DREP) y el MINEDU. La enseñanza es totalmente gratuita y no se abona ningún tipo de pensión mensual privada. El único pago corresponde a la tasa administrativa semestral estipulada en el TUPA institucional (S/ 150 a S/ 250 por semestre completo).')

add_h2('5.2. Protocolo Paso a Paso de Registro de Vouchers BN')
add_bullet('Paso 1 (Depósito Bancario): ', 'El postulante o estudiante regular acude a cualquier ventanilla o Agente MultiRed del Banco de la Nación para abonar la tasa institucional, conservando su váucher físico o comprobante digital.')
add_bullet('Paso 2 (Acceso al Portal): ', 'Ingresa desde su celular o computadora al portal oficial: https://pagos.ieshercar.edu.pe/')
add_bullet('Paso 3 (Autenticación): ', 'Digita su número de DNI para que el sistema identifique su legajo académico.')
add_bullet('Paso 4 (Ingreso de Datos del Váucher): ', 'Selecciona el concepto correspondiente (Matrícula, Examen de Admisión o Trámite Administrativo) y transcribe cuidadosamente la Fecha, Monto exacto y Número de Operación impreso en el váucher.')
add_bullet('Paso 5 (Carga de Comprobante): ', 'Adjunta una fotografía nítida o archivo PDF del comprobante y presiona "Registrar Pago".')
add_bullet('Paso 6 (Descarga de Boleta Electrónica): ', 'Una vez validado el pago, el usuario ingresa a https://sistema.ieshercar.com/Consulta_Boletas/index.php con su DNI para visualizar y descargar su boleta electrónica con valor tributario.')

# ==========================================
# 6. STACK TECNOLÓGICO Y ARQUITECTURA DEL SISTEMA
# ==========================================
add_h1('6. STACK TECNOLÓGICO Y ARQUITECTURA DEL SISTEMA')
add_p('HercarIA se construyó bajo principios de alto desempeño, desacoplamiento y cero dependencias complejas, garantizando que el sistema cargue instantáneamente incluso bajo conexiones móviles lentas en zonas periféricas de Paita:')

table_tech = doc.add_table(rows=1, cols=3)
table_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = table_tech.rows[0].cells
hdr_cells[0].text = 'Capa de Arquitectura'
hdr_cells[1].text = 'Tecnología Empleada'
hdr_cells[2].text = 'Función y Aporte al Sistema'
for i, c in enumerate(hdr_cells):
    set_cell_background(c, '13357B')
    p = c.paragraphs[0]
    p.runs[0].font.bold = True
    p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_margins(c, 120, 120, 150, 150)

tech_rows = [
    ('Frontend UI / UX', 'HTML5 Semántico + CSS3 Avanzado (Variables Dinámicas)', 'Diseño fullscreen responsivo inspirado en ChatGPT, soporte completo para tema claro/oscuro, microinteracciones y efectos ripple.'),
    ('Lógica Conversacional', 'Vanilla JavaScript (ES6+ Modular)', 'Normalización de texto, motor NLP basado en intenciones semánticas y expresiones regulares, parsing dinámico de Markdown.'),
    ('Iconografía Vectorial', 'SVG Inline (Trazo uniforme a 2px)', 'Iconografía nítida y corporativa que sustituye emojis informales, garantizando coherencia visual técnica en todas las resoluciones.'),
    ('Orientador Vocacional', 'Algoritmo Polifactorial JS', 'Cuestionario interactivo de 6 reactivos con ponderación matricial y cálculo de compatibilidad porcentual con trofeo de resultado.'),
    ('Motor de Voz Neural', 'Microsoft Edge TTS (Python) + Web Speech API', 'Síntesis de voz femenina dulce y humana con fallback automático para funcionamiento universal en web estática y servidores locales.'),
    ('Reconocimiento Vocal', 'Web Speech Recognition API', 'Dictado por voz mediante micrófono en tiempo real con dialecto español de Perú (es-PE) y detección de silencio.'),
    ('Almacenamiento Local', 'Web Storage API (localStorage)', 'Persistencia del historial de consultas recientes del usuario y preferencias de tema de interfaz.'),
    ('Despliegue y CDN', 'GitHub Pages (HTTPS Global)', 'Alojamiento en la nube con disponibilidad permanente 24/7, certificado SSL activo y CDN de alta velocidad.')
]

for row in tech_rows:
    r_cells = table_tech.add_row().cells
    for idx, text in enumerate(row):
        r_cells[idx].text = text
        p = r_cells[idx].paragraphs[0]
        p.runs[0].font.name = 'Arial'
        p.runs[0].font.size = Pt(9.5)
        set_cell_margins(r_cells[idx], 100, 100, 120, 120)

# ==========================================
# 7. MOTOR DE HUMANIZACIÓN VOCAL FEMENINA Y DICTADO
# ==========================================
add_h1('7. MOTOR DE HUMANIZACIÓN VOCAL FEMENINA Y DICTADO')
add_p('Uno de los mayores logros del proyecto es la humanización de la voz de HercarIA, eliminando cualquier sensación de sintetizador robótico antiguo:')
add_bullet('Calibración Acústica Agradable y Femenina: ', 'Se calibró la tasa de velocidad en 0.93 y el tono (pitch) en 1.05. Este ajuste acústico produce una cadencia pausada, melodiosa, suave y natural, ideal para la atención y orientación vocacional.')
add_bullet('Supresión Total de Sintaxis Markdown y Asteriscos: ', 'Se diseñó un filtro de limpieza previa (regex) que erradica por completo la pronunciación de asteriscos (**), guiones, numerales (#), barras y tablas. La voz habla con lenguaje conversacional limpio mientras la pantalla muestra el texto formateado con viñetas y negritas.')
add_bullet('Normalización Fonética de Siglas Institucionales: ', 'El preprocesador vocal traduce términos técnicos antes de llegar al sintetizador: "APSTI" se modula fonéticamente como "Ápsti" o "Arquitectura de Plataformas y Servicios TI", "ANI" como "Ani", "DPA" como "D P A", "S/ 150" como "150 soles", "IESTP" como "Instituto", y "SUNAT" como "Sunat".')
add_bullet('Priorización Inteligente de Voces Femeninas: ', 'En la versión web (GitHub Pages y celulares), el sistema analiza las voces instaladas en el dispositivo y selecciona prioritariamente voces dulces en español (Dalia, Camila, Salome, Elvira, Sabina).')
add_bullet('Módulo de Audio Desplegable Popover: ', 'En la cabecera superior se incluye el botón minimalista "[ 🔊 🟢 Voz ]". Al hacer clic, despliega un panel flotante donde el usuario puede activar/desactivar la voz, elegir su voz favorita y probar la entonación con el botón "Probar Voz".')
add_bullet('Cancelación Instantánea de Ecos y Ruidos: ', 'Se programó la interrupción inmediata de la síntesis vocal al presionar la tecla Escape, al dar clic en el campo de texto o al enviar una nueva consulta, evitando la superposición molesta de audios.')

# ==========================================
# 8. REDISEÑO ERGONÓMICO DE LA INTERFAZ DE USUARIO (UI/UX)
# ==========================================
add_h1('8. REDISEÑO ERGONÓMICO DE LA INTERFAZ DE USUARIO (UI/UX)')
add_p('Para brindar una experiencia óptima al usuario, se rediseñó la distribución de los componentes eliminando saturaciones visuales:')
add_bullet('Menú Lateral Limpio estilo ChatGPT: ', 'El menú lateral (Sidebar) se reservó exclusivamente para las acciones de navegación fundamentales: botón destacado "+ Nueva Conversación", acceso rápido a "Test Vocacional", lista de "Consultas Recientes" y conmutador de "Modo Oscuro".')
add_bullet('Botones de Utilidad en Cabecera Superior: ', 'Las funciones operativas se trasladaron a la esquina superior derecha del encabezado, junto al selector de voz: el botón "Guardar Chat" (descarga la transcripción en un archivo .txt con membrete oficial) y el botón "Borrar Chat" (reinicia la sesión de diálogo de manera segura).')
add_bullet('Barra de Píldoras de Acceso Rápido (Chips): ', 'Directamente sobre el cuadro de entrada de texto se dispuso una barra horizontal con chips interactivos ("Las 4 Carreras Técnicas", "Registro de Pagos", "Matrícula y Costos 2026", "Mesa de Partes Virtual", "Ubicación y Contacto"). Al presionar un chip, la consulta se envía inmediatamente al chat sin necesidad de teclear.')
add_bullet('Navegación Adaptativa de 3 Líneas: ', 'En computadoras de escritorio, el icono de menú colapsa la barra lateral para otorgar el 100% de la pantalla a la conversación. En teléfonos inteligentes, abre un Drawer deslizante con fondo oscuro translúcido y botón táctil de cierre.')

# ==========================================
# 9. TEST VOCACIONAL PSICOMÉTRICO INTERACTIVO
# ==========================================
add_h1('9. TEST VOCACIONAL PSICOMÉTRICO INTERACTIVO')
add_p('El sistema incorpora un orientador vocacional desarrollado en js/test_vocacional.js que diagnostica la inclinación profesional del postulante mediante 6 reactivos interactivos:')
add_bullet('Pregunta 1 (Intereses Naturales): ', 'Indaga sobre actividades predilectas en tiempo libre (resolver problemas tecnológicos, coordinar proyectos comerciales, organizar finanzas o explorar la fauna marina).')
add_bullet('Pregunta 2 (Entorno Laboral Deseado): ', 'Evalúa el ambiente de trabajo preferido (oficinas tecnológicas con servidores, agencias aduaneras portuarias, despachos tributarios o plantas de procesamiento y embarcaciones).')
add_bullet('Pregunta 3 (Habilidades Destacadas): ', 'Mide competencias autopercibidas (pensamiento analítico y algoritmos, negociación persuasiva, exactitud numérica y orden, o destreza biológica y trabajo en campo).')
add_bullet('Pregunta 4 (Motivación Profesional): ', 'Analiza metas de vida (crear soluciones de software para empresas, impulsar exportaciones regionales hacia mercados globales, liderar la administración contable de grandes corporaciones o innovar en la maricultura sostenible).')
add_bullet('Pregunta 5 (Resolución de Conflictos): ', 'Evalúa el estilo de respuesta ante desafíos cotidianos.')
add_bullet('Pregunta 6 (Visión de Futuro en Paita): ', 'Conecta las aspiraciones personales con las oportunidades laborales tangibles del puerto de Paita y la Región Piura.')
add_p('Al culminar la evaluación, el algoritmo calcula el porcentaje de afinidad de las 4 carreras, presenta una tarjeta interactiva con trofeo dorado, detalla el campo laboral en la región y ofrece botones de acción para revisar la malla curricular o conocer los requisitos de matrícula.')

# ==========================================
# 10. MEMORIA DE CONSTRUCCIÓN PASO A PASO
# ==========================================
add_h1('10. MEMORIA DE CONSTRUCCIÓN PASO A PASO')
add_p('El desarrollo de HercarIA se ejecutó siguiendo 6 fases sistemáticas:')
add_bullet('Fase 1 (Recopilación e Ingeniería de Conocimiento): ', 'Extracción sistemática de datos desde el portal web oficial ieshercar.edu.pe, TUPA vigente, plataforma de pagos (pagos.ieshercar.edu.pe) y sistema de boletas electrónicas.')
add_bullet('Fase 2 (Maquetación y Diseño Visual ChatGPT): ', 'Creación de index.html y css/styles.css con maquetación flexible en pantalla completa, portada hero con tarjetas explicativas y soporte completo para modo oscuro y claro.')
add_bullet('Fase 3 (Desarrollo del Motor NLP en JavaScript): ', 'Programación de js/app.js para detectar intenciones de usuario sobre requisitos, gratuidad, carreras, convalidaciones, títulos oficiales y horarios, aplicando normalización de cadenas de texto.')
add_bullet('Fase 4 (Implementación del Test Psicométrico): ', 'Codificación de js/test_vocacional.js con cálculo matricial dinámico y tarjetas visuales interactivas.')
add_bullet('Fase 5 (Humanización Vocal y Audio Desplegable): ', 'Desarrollo de js/voice.js, integrando Microsoft Edge TTS (Python) y síntesis del navegador con tono femenino dulce, filtros de sintaxis Markdown y dictado por micrófono.')
add_bullet('Fase 6 (Despliegue y Control de Versiones en GitHub): ', 'Publicación en el repositorio oficial de GitHub (https://github.com/GMPH2007/HercarBOT) y activación de GitHub Pages para acceso universal y gratuito desde cualquier dispositivo móvil o computadora.')

# ==========================================
# 11. GUÍA DE INSTALACIÓN Y ENLACES OFICIALES
# ==========================================
add_h1('11. GUÍA DE INSTALACIÓN Y ENLACES OFICIALES')
add_p('HercarIA se distribuye en dos modalidades para facilidad de los usuarios:')
add_bullet('1. Acceso en Vivo en la Nube (GitHub Pages): ', 'Disponible de forma instantánea sin instalaciones en: https://gmph2007.github.io/HercarBOT/')
add_bullet('2. Ejecución Local con 1 Clic (Windows): ', 'Descargar el proyecto desde GitHub y hacer doble clic en el archivo Iniciar_HercarBOT.bat. Este lanzador inicia el microservicio local de voz neural y abre el navegador automáticamente en http://localhost:8080.')
add_bullet('Portal Web Oficial del Instituto: ', 'https://ieshercar.edu.pe/')
add_bullet('Biblioteca Virtual Institucional: ', 'https://biblioteca.ieshercar.edu.pe/login.php')
add_bullet('Plataforma de Pagos y Registro de Vouchers: ', 'https://pagos.ieshercar.edu.pe/')
add_bullet('Mesa de Partes Virtual: ', 'https://sistema.ieshercar.edu.pe/registro-tramite/')
add_bullet('Consulta y Descarga de Boletas Electrónicas: ', 'https://sistema.ieshercar.com/Consulta_Boletas/index.php')

# Guardar documento Word actualizado
output_file = 'INFORME_TECNICO_HERCARBOT.docx'
doc.save(output_file)
print(f'[OK] {output_file} generado exitosamente con formato institucional de alta fidelidad!')
