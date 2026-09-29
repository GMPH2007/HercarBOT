# 🤖 HercarIA • Asistente Virtual Oficial IESTP "Hermanos Cárcamo" (Paita - Piura)

Bienvenido a **HercarIA**, el sistema inteligente de orientación vocacional, consultas académicas y atención al estudiante del **Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo" de Paita**.

---

## 🌟 Características Principales

1. **Diseño Moderno tipo ChatGPT (Pantalla Completa):**
   - Interfaz limpia, fluida y responsiva inspirada en ChatGPT.
   - Colores y branding oficial del instituto: Azul Marino Institucional (`#13357b`), acentos Dorados (`#f59e0b`) y Azul Eléctrico.
   - Barra lateral con accesos rápidos a carreras, matrículas, pagos y modo oscuro/claro.
   - Historial de chat persistente.

2. **🎓 Test Vocacional Interactivo Integrado:**
   - Diseñado específicamente para aspirantes y jóvenes que no saben qué carrera elegir.
   - 6 preguntas dinámicas evaluando intereses, habilidades y metas.
   - Diagnóstico automático con porcentaje de afinidad por carrera, carrera ganadora con trofeo y recomendaciones de inserción laboral en Paita y el Perú.

3. **🗣️ Voz Femenina Neural de Alta Calidad y Micrófono:**
   - **Voz Femenina Neural (Estudio):** Integración con Microsoft Edge TTS (`es-PE-CamilaNeural` - Perú / `es-MX-DaliaNeural`), suave, clara y natural.
   - **Soporte Offline / Standalone:** Si se abre sin servidor, utiliza la síntesis nativa del navegador con entonación dulce y femenina.
   - **Micrófono (Entrada por Voz):** Permite al usuario hablar directamente al bot con transcripción en tiempo real.
   - **Control de Voz:** Botón en cabecera para silenciar o activar la voz en cualquier momento.

4. **📚 Base de Conocimiento Institucional Completa:**
   - **4 Carreras Técnicas (3 años / Título a Nombre de la Nación):**
     - 💻 **APSTI:** Arquitectura de Plataformas y Servicios de Tecnologías de la Información (Software, Redes, Cloud).
     - 🚢 **ANI:** Administración de Negocios Internacionales (Comercio Exterior, Logística Portuaria, Aduanas).
     - 📊 **Contabilidad:** Gestión Financiera, Libros Electrónicos, Tributación SUNAT, Costos.
     - 🐟 **DPA:** Desarrollo Pesquero y Acuícola (Acuicultura, Procesamiento Marino y Prácticas en Embarcación Propia).
   - **Matrículas y Costos:** Explicación clara de la educación pública gratuita (sin pensiones mensuales privadas), solo pago administrativo de matrícula semestral.
   - **Métodos de Pago y Vouchers:** Guía paso a paso para pagar en el Banco de la Nación, registrar el voucher en [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/) y consultar boletas electrónicas.
   - **Trámites y Mesa de Partes:** Constancias de matrícula, récord de notas, egreso y titulación.
   - **Ubicación y Contacto:** Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura | Tel: +51 969 100 257 / (073) 251013.

---

## 🚀 Cómo Iniciar el Chatbot

### Opción 1: Con 1 solo clic (Recomendada con Voz Neural)
Haz doble clic en el archivo:
```text
Iniciar_HercarBOT.bat
```
Esto iniciará el servidor local con la voz neural femenina de máxima calidad y abrirá tu navegador automáticamente en `http://localhost:8080`.

### Opción 2: Desde la terminal de comandos (PowerShell / CMD)
```bash
python server.py
```
Abre tu navegador en: [http://localhost:8080](http://localhost:8080)

### Opción 3: Modo Directo (Sin servidor)
Puedes simplemente hacer doble clic en el archivo `index.html` para abrirlo directamente en cualquier navegador (Google Chrome, Microsoft Edge, Firefox). El bot funcionará al 100% usando la síntesis vocal nativa del navegador.

---

## 📂 Estructura del Proyecto

```text
├── assets/
│   ├── logo-hercar.png          # Logo oficial del IESTP Hermanos Cárcamo
│   └── logo-iestp.png           # Escudo institucional
├── css/
│   └── styles.css               # Estilos modernos ChatGPT, modo oscuro y animaciones
├── js/
│   ├── knowledge.js             # Base de conocimiento exhaustiva del instituto
│   ├── test_vocacional.js       # Algoritmo interactivo del Test Vocacional
│   ├── voice.js                 # Motor de voz TTS (Neural + Web Speech) y STT (Micrófono)
│   └── app.js                   # Controlador principal, NLP y formateo markdown
├── index.html                   # Interfaz web responsiva en pantalla completa
├── server.py                    # Servidor Python con endpoint /api/tts de voz neural
├── Iniciar_HercarBOT.bat        # Lanzador para Windows de un solo clic
└── README.md                    # Documentación del sistema
```

---

## 🏛️ Información Institucional
* **Nombre:** Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo"
* **Sitio Web:** [https://ieshercar.edu.pe/](https://ieshercar.edu.pe/)
* **Plataforma de Pagos:** [https://pagos.ieshercar.edu.pe/](https://pagos.ieshercar.edu.pe/)
* **Mesa de Partes:** [https://sistema.ieshercar.edu.pe/registro-tramite/](https://sistema.ieshercar.edu.pe/registro-tramite/)
