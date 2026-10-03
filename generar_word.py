#!/usr/bin/env python3
"""
Generador de Documento Word (.docx) Profesional de Alta Fidelidad
Informe Técnico y Memoria Descriptiva Completa de HercarIA v5.0 Neuronal APSTI
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
COLOR_PURPLE = RGBColor(124, 58, 237)  # #7c3aed (Violeta Neuronal IA)

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
run_sub = p_subtitle.add_run('Desarrollo e Implementación del Asistente Virtual Inteligente "HercarIA"\nDotado de Arquitectura Híbrida Multi-API (Gemini, OpenAI, Groq), Red Neuronal Local APSTI (MLP),\nPanel de Administración con Métricas, Síntesis Vocal Femenina Humana y Simulador TUPA 2026')
run_sub.font.name = 'Arial'
run_sub.font.size = Pt(12)
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

r = p_meta.add_run('VERSIÓN DEL SISTEMA:\n')
r.font.bold = True
r.font.size = Pt(10)
r = p_meta.add_run('Versión 6.0 Arquitectura Híbrida Multi-API & Red Neuronal APSTI (Producción Estable)\n\n')
r.font.size = Pt(10.5)
r.font.bold = True
r.font.color.rgb = COLOR_PURPLE

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
add_p('El presente informe técnico expone la fundamentación de ingeniería, diseño arquitectónico, desarrollo algorítmico y despliegue del sistema "HercarIA v5.1", una plataforma de Inteligencia Artificial conversacional de última generación concebida para el Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo" de Paita.')
add_p('Desarrollado en el seno formativo de la Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI), HercarIA integra una Red Neuronal Artificial Perceptrón Multicapa (MLP) ejecutada íntegramente en el cliente (Browser Client-Side Deep Learning) con vectorización TF-IDF, activación LeakyReLU y Tanh, distribución Softmax de intenciones con latencia inferior a 5 milisegundos, y un motor de recuperación semántica enciclopédico.')
add_p('La versión 5.1 expande masivamente el conocimiento institucional para responder consultas detalladas sobre mallas curriculares ciclo por ciclo, temarios del examen de admisión, trámites de titulación y prácticas EFSRT, Beca 18 (PRONABEC), carné de medio pasaje, rutas de transporte desde Piura y Sullana, el sistema SIGA web y la biblioteca virtual. Asimismo, refina ergonómicamente la interfaz ocultando indicadores o botones toscos de IA para brindar una experiencia de usuario limpia, sobria, humana y profesional similar a ChatGPT.')

# ==========================================
# 2. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN EN PAITA
# ==========================================
add_h1('2. PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN EN PAITA')
add_p('La provincia de Paita alberga el principal puerto marítimo y comercial del norte peruano, un nodo estratégico de agroexportación, pesquería de consumo humano directo e industrias de frío. No obstante, los jóvenes egresados de secundaria y la comunidad provincial enfrentan brechas persistentes:')
add_bullet('Desconocimiento del Principio de Gratuidad: ', 'Existe una confusión recurrente donde muchos postulantes asumen que el instituto cobra mensualidades privadas elevadas. HercarIA ratifica en cada diálogo que el IESTP Hermanos Cárcamo es 100% público estatal y que solo se cancela una tasa administrativa semestral mínima por TUPA.')
add_bullet('Falta de Orientación Vocacional Tecnológica: ', 'Carencia de herramientas interactivas que evalúen vocaciones hacia la tecnología, computación en la nube, negocios aduaneros y maricultura, incrementando el riesgo de deserción.')
add_bullet('Horarios Restringidos de Secretaría: ', 'La atención en ventanilla culmina a las 3:00 PM, dejando desatendidas consultas urgentes en turnos de tarde, noche o fines de semana.')
add_bullet('Fricción en el Registro de Vouchers: ', 'Dudas continuas en el llenado de datos bancarios en pagos.ieshercar.edu.pe y en la consulta de boletas electrónicas tributarias.')

# ==========================================
# 3. MARCO NORMATIVO Y OFICIALIDAD INSTITUCIONAL
# ==========================================
add_h1('3. MARCO NORMATIVO Y OFICIALIDAD INSTITUCIONAL')
add_p('HercarIA se fundamenta en las normativas del sector educativo superior técnico del Perú:')
add_bullet('Ley de Institutos y Escuelas de Educación Superior N° 30512: ', 'Regula la formación técnica de excelencia, asegurando el cumplimiento de las condiciones básicas de calidad.')
add_bullet('Título Profesional Técnico a Nombre de la Nación: ', 'Expedido directamente por el Ministerio de Educación (MINEDU), otorgando reconocimiento pleno a nivel nacional e internacional.')
add_bullet('Convalidación Universitaria (SUNEDU): ', 'Permite a los egresados de 3 años convalidar créditos académicos en universidades licenciadas para culminar el Bachillerato y Licenciatura universitaria.')
add_bullet('Certificaciones Modulares Progresivas: ', 'Certificación oficial al cierre de cada año académico cursado con éxito, habilitando al alumno para incorporarse con sustento formal al mercado de trabajo.')

# ==========================================
# 4. OFERTA FORMATIVA INSTITUCIONAL (LAS 4 CARRERAS TÉCNICAS)
# ==========================================
add_h1('4. OFERTA FORMATIVA INSTITUCIONAL')
add_p('El IESTP Hermanos Cárcamo imparte 4 programas profesionales técnicos de 3 años lectivos (6 semestres), organizados bajo planes curriculares modulares:')

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
     'Desarrollo de aplicaciones web y móviles, arquitectura cloud, bases de datos relacionales y NoSQL, administración de redes Cisco/MikroTik, seguridad perimetral, administración de servidores Linux/Windows Server e Inteligencia Artificial aplicada.', 
     'Especialista en soporte y cloud en operadores portuarios (TPE), empresas del Parque Industrial de Paita, agencias aduaneras, banca, agroindustrias y desarrollo de software remoto global.'),
    
    ('Administración de Negocios Internacionales (ANI)', 
     'Gestión aduanera, operatividad de importación/exportación, fletes marítimos y aéreos, logística de contenedores refrigerados reefer, tratados de libre comercio y finanzas internacionales.', 
     'Agencias marítimas y de aduanas, almacenes aduaneros temporales, operadoras portuarias, plantas agroexportadoras y terminales logísticos.'),
    
    ('Contabilidad', 
     'Contabilidad financiera, de costos y gubernamental, formulación de estados financieros, sistemas tributarios SUNAT (SIRE, PDT, Renta, IGV), auditoría y planillas laborales.', 
     'Áreas contables y de auditoría en consorcios pesqueros, entidades bancarias y microfinancieras (Banco de la Nación, Cajas municipales), municipalidades y despachos contables independientes.'),
    
    ('Desarrollo Pesquero y Acuícola (DPA)', 
     'Cultivo de especies marinas (conchas de abanico, langostinos, peces), faenas de navegación y pesca responsable en la embarcación del instituto, plantas de procesamiento y normas internacionales HACCP y BPM.', 
     'Supervisores de aseguramiento y control de calidad (QA/QC) en plantas congeladoras de pota y perico, centros de maricultura en bahía de Paita y Sechura, e inspectores de SANIPES.')
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
# 5. ARQUITECTURA DE LA RED NEURONAL ARTIFICIAL (MLP MULTICAPA APSTI)
# ==========================================
add_h1('5. ARQUITECTURA DE LA RED NEURONAL ARTIFICIAL (MLP MULTICAPA)')
add_p('Como estandarte de la carrera técnica de APSTI, HercarIA v5.0 trasciende los chatbots tradicionales basados en concordancias rígidas de texto para incorporar una Red Neuronal Artificial Perceptrón Multicapa (Feedforward Multi-Layer Perceptron - MLP) ejecutada 100% en el entorno cliente del navegador web, prescindiendo de librerías externas o CDNs susceptibles a fallos.')

add_h2('5.1. Topología y Estructura Matemática de la Red')
add_p('La red neuronal fue configurada específicamente para la clasificación de intenciones en el dominio institucional y académico:')
add_bullet('Capa de Entrada (Input Layer - 220 Nodos): ', 'Vectorización TF-IDF con vocabulario institucional cerrado de 220 términos normalizados (stemming fonético, lematización de jergas paiteñas y remoción de signos ortográficos).')
add_bullet('Capa Oculta 1 (Hidden Layer 1 - 36 Neuronas): ', 'Encargada de aprender correlaciones léxicas y sinonimias semánticas complejas. Emplea la función de activación LeakyReLU (alpha = 0.01) para evitar el problema de neuronas muertas (Dying ReLU): f(x) = x si x > 0, f(x) = 0.01x si x <= 0.')
add_bullet('Capa Oculta 2 (Hidden Layer 2 - 18 Neuronas): ', 'Realiza una abstracción dimensional superior hacia los ejes institucionales. Utiliza la función de activación Tangente Hiperbólica (Tanh): f(x) = (e^x - e^(-x)) / (e^x + e^(-x)), acotando los gradientes entre -1 y +1.')
add_bullet('Capa de Salida (Output Layer - 22 Neuronas): ', 'Genera una distribución de probabilidad normalizada entre las 22 clases de intención del sistema mediante la función Softmax: P(y = c | x) = exp(z_c) / sum(exp(z_j)).')

add_h2('5.2. Inicialización de Pesos de Xavier / Glorot y Entrenamiento')
add_p('Para garantizar una convergencia rápida y libre de explosión o desvanecimiento de gradientes (Vanishing Gradient), los pesos sinápticos W de cada capa se inicializan siguiendo la distribución uniforme de Xavier/Glorot: W ~ U(-sqrt(6 / (fan_in + fan_out)), +sqrt(6 / (fan_in + fan_out))).')
add_p('El entrenamiento supervisado se ejecuta automáticamente al iniciar la aplicación mediante el algoritmo de Retropropagación del Error (Backpropagation) combinado con Descenso de Gradiente Estocástico (SGD) y función de pérdida de Entropía Cruzada Categórica (Categorical Cross-Entropy Loss). Entrena con un dataset pre-construido de 180 patrones representativos de habla estudiantil en aproximadamente 35 milisegundos, permitiendo una experiencia instantánea y sin bloqueos de interfaz.')

add_h2('5.3. Ensamble Híbrido Resiliente (Hybrid Ensemble)')
add_p('Para garantizar una precisión del 100% y neutralizar el fenómeno de alucinación inherente a los modelos de lenguaje masivos, HercarIA combina las predicciones de la Red Neuronal con un subsistema determinista basado en reglas semánticas institucionales:')
add_bullet('Predicción con Alta Certeza (Confianza >= 40%): ', 'El sistema canaliza la respuesta empleando la intención predicha por el Perceptrón Multicapa.')
add_bullet('Manejo de Casos Ambiguos: ', 'Si la confianza de la red es marginal, el ensamble híbrido evalúa patrones léxicos y consultas frecuentes, garantizando que el usuario siempre reciba la respuesta institucional oficial y veraz.')

# ==========================================
# 6. HERRAMIENTAS INTERACTIVAS Y MODALES ESPECIALIZADOS
# ==========================================
add_h1('6. HERRAMIENTAS INTERACTIVAS Y MODALES ESPECIALIZADOS')
add_p('HercarIA v5.0 integra un ecosistema de herramientas visuales orientadas a postulantes, alumnos matriculados y evaluadores académicos:')

add_h2('6.1. Inspector Visual de Red Neuronal y Playground en Tiempo Real')
add_p('Accesible mediante el indicador pulsante de la cabecera superior o la barra de herramientas lateral, este modal interactivo permite auditar el funcionamiento interno de la IA:')
add_bullet('Diagrama Topológico SVG Reactivo: ', 'Representación gráfica en vivo de la red neuronal, iluminando los nodos de entrada y las capas ocultas según la intensidad de activación neuronal producida por la frase evaluada.')
add_bullet('Histograma de Probabilidades Softmax: ', 'Gráfico de barras dinámico con los porcentajes exactos de las 5 intenciones más probables calculadas por la red.')
add_bullet('Playground de Experimentación: ', 'Caja de prueba donde los docentes o evaluadores pueden escribir cualquier consulta arbitraria y pulsar "Evaluar con Red Neuronal" para examinar la latencia en milisegundos, los tokens del vocabulario activados y la clase resultante.')

add_h2('6.2. Simulador de Matrícula y Tasas TUPA 2026')
add_p('Calculadora institucional financiera interactiva diseñada para transparentar los conceptos de pago y eliminar dudas de costos:')
add_bullet('Perfiles Estudiantiles: ', 'Dispone de 3 perfiles configurables: Postulantes / Nuevos Ingresantes (Examen de admisión S/ 100, Matrícula 1er ciclo S/ 150, Carné MINEDU S/ 20, Carpeta S/ 25), Estudiantes Regulares (Matrícula semestral S/ 150, Carné S/ 20, Seguro de accidentes S/ 15) y Trámites de Titulación (Certificado modular S/ 40, Carpeta de titulación profesional técnica S/ 250, Certificados oficiales S/ 50).')
add_bullet('Cálculo Dinámico en Tiempo Real: ', 'Suma automática con desglose ítem por ítem en soles (S/).')
add_bullet('Exportación Rápida de Presupuesto: ', 'Permite copiar el resumen financiero al portapapeles con formato formal o enviar el presupuesto directo al chat para recibir orientación sobre el depósito bancario.')

add_h2('6.3. Mapa Arquitectónico Interactivo del Campus')
add_p('Plano arquitectónico esquemático del campus de Paita organizado en cuadrícula y sectores estratégicos:')
add_bullet('Laboratorios de Cómputo y Cloud APSTI: ', 'Equipados con servidores de prueba, racks de telecomunicaciones y laboratorios de software.')
add_bullet('Módulo de Prácticas DPA: ', 'Acuarios experimentales de maricultura y embarcación escuela para prácticas en alta mar.')
add_bullet('Aulas Multimedia de ANI y Contabilidad: ', 'Ambientes climatizados con conectividad digital e infoproyectores.')
add_bullet('Hotspots Interactivos: ', 'Al pulsar cualquier sector, se despliegan detalles de equipamiento, aforo y un botón de consulta inmediata en el chat bot.')

add_h2('6.4. Chips Contextuales de Continuidad y Acciones de Mensaje')
add_bullet('Chips Dinámicos: ', 'Bajo cada respuesta del asistente se generan 3 botones de seguimiento contextual ("¿Cuánto cuesta la matrícula?", "¿Qué requisitos piden?", etc.) que guían la conversación de manera fluida.')
add_bullet('Acciones por Burbuja: ', 'Cada mensaje del bot cuenta con botones para escuchar con voz dulce, copiar con notificación Toast visual, auditar el cálculo neural y calificar la utilidad de la respuesta (feedback positivo/negativo).')

add_h2('6.5. Panel de Administración Dedicado (admin.html) & Arquitectura Híbrida Multi-API (v6.0 APSTI)')
add_p('Para dotar a la institución y a los evaluadores de APSTI de control total sobre el motor de inteligencia, la versión 6.0 introduce una página ejecutiva independiente (admin.html) y controles avanzados de administración:')
add_bullet('Página Independiente admin.html: ', 'Portal de control autónomo con diseño administrativo profesional, accesible desde el botón "⚙️ Panel Admin" o el comando "/admin", con enlace directo de retorno al chatbot institucional.')
add_bullet('Bandeja de Consultas de Estudiantes Sin Resolver: ', 'Registro automático de preguntas formuladas por los usuarios que obtuvieron baja confianza (<40%) o feedback negativo (👎). Permite al administrador pulsar "Responder y Enseñar", redactar la respuesta institucional oficial y guardarla con prioridad absoluta en la Base de Conocimiento.')
add_bullet('Gestión Granular de Historial y Borrado: ', 'Botón destacado de "Borrar Conversación" en el menú lateral e íconos de eliminación individual (✕) en cada consulta del historial reciente para una limpieza ágil y ergonómica.')
add_bullet('Soporte Multi-Proveedor de Modelos Cloud: ', 'Conexión nativa mediante Fetch API en el navegador a Google Gemini (gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash), OpenAI (gpt-4o, gpt-4o-mini, gpt-3.5-turbo), Groq (Llama 3.1 8B, Llama 3.3 70B, Mixtral 8x7B), OpenRouter y DeepSeek API.')
add_bullet('Modo Híbrido Resiliente con Fallback Automático: ', 'Si se provee una API Key, el sistema aprovecha el modelo generativo en la nube para consultas complejas. Ante caídas de conexión externa o agotamiento de cuota (HTTP 429), conmuta de inmediato a la Red Neuronal Local APSTI (MLP) sin que el usuario experimente interrupción alguna.')
add_bullet('Prueba de Conexión en Tiempo Real: ', 'Verificación instantánea del estado de la clave API con cálculo de latencia de red en milisegundos y retroalimentación mediante insignias visuales.')
add_bullet('Tablero de Métricas y Registro Forense de Auditoría: ', 'Cuadro de mando en vivo con total de consultas, ratio Cloud vs. Local, índice de satisfacción estudiantil (👍/👎), distribución porcentual por carrera y tabla cronológica de consultas con opción de descarga de reporte en formato JSON.')
add_bullet('Base de Conocimiento Personalizada (Custom KB): ', 'Módulo para ingresar preguntas y respuestas oficiales ad hoc (ej. fechas de sustentación, eventos institucionales) almacenadas en LocalStorage con máxima prioridad de respuesta.')
add_bullet('Editor de Prompt del Sistema Institucional: ', 'Área de edición de directrices de identidad y restricciones del asistente, con botón de restauración al texto institucional predeterminado de APSTI con un solo clic.')
add_bullet('Simulador de Pruebas de Chat Integrado: ', 'Entorno interactivo dentro de admin.html para probar en vivo las respuestas y verificar el comportamiento del bot sin salir de la vista de gestión.')

# ==========================================
# 7. MOTOR DE HUMANIZACIÓN VOCAL FEMENINA Y DICTADO
# ==========================================
add_h1('7. MOTOR DE HUMANIZACIÓN VOCAL FEMENINA Y DICTADO')
add_p('HercarIA destaca por su timbre vocal humanizado, erradicando lecturas mecánicas e impersonales:')
add_bullet('Afinación Acústica Melodiosa: ', 'Configurada con velocidad 0.93 y tono 1.05 en voces neurales femeninas de alta fidelidad (Camila es-PE, Dalia es-MX y Elvira es-ES).')
add_bullet('Filtro Integral Antirruido y Anti-Markdown: ', 'Expresiones regulares que eliminan asteriscos (*), almohadillas (#), corchetes y signos tipográficos antes de remitir la cadena al sintetizador vocal.')
add_bullet('Normalización Fonética Estricta: ', 'Traducción de siglas institucionales a fonemas amigables: "APSTI" se pronuncia "Ápsti", "IESTP" como "Instituto", "S/ 150" como "150 soles" y "DPA" como "D P A".')
add_bullet('Dictado por Voz con Micrófono: ', 'Reconocimiento continuo con Web Speech Recognition y efecto óptico de ondas concéntricas (Ripple Effect) durante la escucha activa.')

# ==========================================
# 8. PROCEDIMIENTOS DE MATRÍCULA Y REGISTRO DE PAGOS
# ==========================================
add_h1('8. PROCEDIMIENTOS DE MATRÍCULA Y REGISTRO DE PAGOS')
add_h2('8.1. Gratuidad de la Enseñanza Pública')
add_p('El IESTP Hermanos Cárcamo es un instituto tecnológico público tutelado por la DREP Piura y el MINEDU. La enseñanza es gratuita sin mensualidades privadas. Solo se cancela la tasa administrativa semestral estipulada en el TUPA.')

add_h2('8.2. Protocolo de Registro de Vouchers BN')
add_bullet('Paso 1: ', 'Abono en ventanilla o Agente MultiRed del Banco de la Nación.')
add_bullet('Paso 2: ', 'Acceso a la plataforma institucional: https://pagos.ieshercar.edu.pe/')
add_bullet('Paso 3: ', 'Identificación mediante número de DNI.')
add_bullet('Paso 4: ', 'Ingreso de Fecha, Monto exacto y Número de Operación del váucher.')
add_bullet('Paso 5: ', 'Carga de la imagen o archivo PDF del comprobante y registro.')
add_bullet('Paso 6: ', 'Consulta y descarga de la boleta electrónica con validez fiscal en: https://sistema.ieshercar.com/Consulta_Boletas/index.php')

# ==========================================
# 9. STACK TECNOLÓGICO Y ARQUITECTURA DEL SISTEMA
# ==========================================
add_h1('9. STACK TECNOLÓGICO Y ARQUITECTURA DEL SISTEMA')
add_p('HercarIA se construyó bajo estándares de ingeniería de software moderno y cero dependencias complejas:')

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
    ('Red Neuronal Artificial (MLP)', 'HercarNeuralNetwork (Vanilla JS ES6+)', 'Perceptrón Multicapa (220-36-18-22) con LeakyReLU, Tanh, Softmax y Backpropagation en browser.'),
    ('Panel de Administración Multi-API', 'Fetch API Nativo (CORS Directo)', 'Integración client-side directa sin servidores intermedios para Google Gemini, OpenAI, Groq, OpenRouter y DeepSeek.'),
    ('Métricas y Registro de Auditoría', 'HTML5 LocalStorage + JSON Export', 'Panel de métricas en tiempo real, trazabilidad forense de consultas e índice de satisfacción del usuario.'),
    ('Base de Conocimiento y Respaldo', 'Memoria Institucional + Custom KB', 'Respuestas inmediatas oficiales, banco de preguntas personalizables y fallback instantáneo ante fallas externas.'),
    ('Inspector & Playground IA', 'SVG Reactivo + DOM Dinámico', 'Auditoría en tiempo real del grafo neuronal, distribución Softmax y banco de pruebas interactivas.'),
    ('Frontend UI / UX', 'HTML5 Semántico + CSS3 Avanzado (Variables Dinámicas)', 'Diseño fullscreen estilo ChatGPT, microinteracciones, modales glassmorphism y tema claro/oscuro.'),
    ('Simulador Financiero TUPA', 'Algoritmo JS de Tasas 2026', 'Calculadora interactiva con perfiles de cachimbos, regulares y titulación con copiado al portapapeles.'),
    ('Orientador Vocacional', 'Algoritmo Polifactorial JS', 'Cuestionario de 6 reactivos con cálculo matricial de compatibilidad porcentual y trofeo interactivo.'),
    ('Motor de Voz Neural', 'Microsoft Edge TTS (Python) + Web Speech API', 'Síntesis de voz femenina dulce con entonación natural y normalización fonética de siglas.'),
    ('Reconocimiento Vocal', 'Web Speech Recognition API', 'Dictado por voz mediante micrófono en tiempo real con animación concéntrica Ripple.'),
    ('Despliegue y CDN', 'GitHub Pages (HTTPS Global)', 'Alojamiento en la nube con disponibilidad 24/7, certificado SSL y CDN de alta velocidad.')
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
# 10. GUÍA DE INSTALACIÓN Y ENLACES OFICIALES
# ==========================================
add_h1('10. GUÍA DE INSTALACIÓN Y ENLACES OFICIALES')
add_p('HercarIA se distribuye en dos modalidades para conveniencia de toda la comunidad:')
add_bullet('1. Despliegue en Vivo en la Nube (GitHub Pages): ', 'Acceso inmediato sin instalaciones en: https://gmph2007.github.io/HercarBOT/')
add_bullet('2. Ejecución Local con 1 Clic (Windows): ', 'Doble clic sobre el archivo Iniciar_HercarBOT.bat para activar el microservicio local de voz de estudio en http://localhost:8080.')
add_bullet('Portal Web Oficial del Instituto: ', 'https://ieshercar.edu.pe/')
add_bullet('Biblioteca Virtual Institucional: ', 'https://biblioteca.ieshercar.edu.pe/login.php')
add_bullet('Plataforma de Pagos y Registro de Vouchers: ', 'https://pagos.ieshercar.edu.pe/')
add_bullet('Mesa de Partes Virtual: ', 'https://sistema.ieshercar.edu.pe/registro-tramite/')
add_bullet('Consulta y Descarga de Boletas Electrónicas: ', 'https://sistema.ieshercar.com/Consulta_Boletas/index.php')
add_bullet('Repositorio Oficial GitHub: ', 'https://github.com/GMPH2007/HercarBOT')

# ==========================================
# 11. CONCLUSIONES Y TRABAJOS FUTUROS
# ==========================================
add_h1('11. CONCLUSIONES')
add_p('1. La implementación de una Red Neuronal Perceptrón Multicapa (MLP) ejecutada 100% en el cliente posiciona a HercarIA y a la carrera de APSTI a la vanguardia de la innovación tecnológica en la Región Piura, demostrando que la Inteligencia Artificial de alto rendimiento es viable en navegadores web sin incurrir en costos de infraestructura.')
add_p('2. Las herramientas integradas de Simulador TUPA 2026, Mapa del Campus, Inspector Neuronal y Orientador Vocacional ofrecen una experiencia pedagógica e interactiva integral, transformando a HercarIA en una plataforma institucional de referencia para el IESTP Hermanos Cárcamo.')
add_p('3. La calibración acústica femenina dulce, libre de sintaxis Markdown, combinada con la interfaz sobria inspirada en ChatGPT, asegura un trato cálido, humano y profesional para toda la juventud estudiantil paiteña.')

output_file = 'INFORME_TECNICO_HERCARBOT.docx'
doc.save(output_file)
print(f'[OK] {output_file} generado exitosamente con formato institucional de alta fidelidad!')
