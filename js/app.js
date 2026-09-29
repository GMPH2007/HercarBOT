/**
 * CONTROLADOR PRINCIPAL DEL CHATBOT "HERCARIA"
 * I.E.S.T.P. "HERMANOS CÁRCAMO" - PAITA, PIURA, PERÚ
 */

class HercarChatApp {
    constructor() {
        this.kb = INSTITUCIONAL_KB;
        this.voiceEngine = new VoiceEngineHercar();
        this.testEngine = new TestVocacionalHercar(this);

        this.chatScrollAreaEl = document.getElementById('chat-scroll-area');
        this.chatMessagesEl = document.getElementById('chat-messages');
        this.portadaContainerEl = document.getElementById('portada-container');
        this.chatInputEl = document.getElementById('chat-input');
        this.btnSendEl = document.getElementById('btn-send');
        this.btnMicEl = document.getElementById('btn-mic');
        this.btnVoiceToggleEl = document.getElementById('btn-voice-toggle');
        this.btnTestVoiceEl = document.getElementById('btn-test-voice');
        this.voiceSelectEl = document.getElementById('voice-select');
        this.btnNewChatEl = document.getElementById('btn-new-chat');
        this.btnStartTestSidebarEl = document.getElementById('btn-start-test-sidebar');

        this.isTyping = false;
        this.history = [];

        this.init();
    }

    init() {
        // Exponer globalmente
        window.hercarApp = this;
        window.hercarTest = this.testEngine;
        window.hercarVoice = this.voiceEngine;

        this.setupEventListeners();
        this.setupVoiceFeedback();
        
        // Mostrar Portada de bienvenida por defecto
        this.mostrarPortada();
    }

    setupEventListeners() {
        // Enviar al presionar Enter
        if (this.chatInputEl) {
            this.chatInputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.voiceEngine.detenerVoz();
                    this.handleUserSubmit();
                }
            });

            this.chatInputEl.addEventListener('focus', () => {
                this.voiceEngine.detenerVoz();
            });

            this.chatInputEl.addEventListener('input', () => {
                this.chatInputEl.style.height = 'auto';
                this.chatInputEl.style.height = Math.min(this.chatInputEl.scrollHeight, 140) + 'px';
            });
        }

        // Tecla Escape para silenciar inmediatamente cualquier audio activo
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.voiceEngine.detenerVoz();
            }
        });

        if (this.btnSendEl) {
            this.btnSendEl.addEventListener('click', () => this.handleUserSubmit());
        }

        if (this.btnMicEl) {
            this.btnMicEl.addEventListener('click', () => {
                this.voiceEngine.toggleListening();
            });
        }

        if (this.btnVoiceToggleEl) {
            this.btnVoiceToggleEl.addEventListener('click', () => {
                const enabled = this.voiceEngine.toggleMute();
                this.actualizarBotonVoz(enabled);
            });
        }

        if (this.btnTestVoiceEl) {
            this.btnTestVoiceEl.addEventListener('click', () => {
                this.voiceEngine.probarVozDemostracion();
            });
        }

        if (this.voiceSelectEl) {
            this.voiceSelectEl.addEventListener('change', (e) => {
                this.voiceEngine.setVozPreferida(e.target.value);
            });
        }

        if (this.btnNewChatEl) {
            this.btnNewChatEl.addEventListener('click', () => {
                this.reiniciarConversacion();
            });
        }

        if (this.btnStartTestSidebarEl) {
            this.btnStartTestSidebarEl.addEventListener('click', () => {
                this.cerrarSidebarMovilSiAplica();
                this.testEngine.iniciar();
            });
        }

        // Toggle Sidebar en móviles
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Modo Oscuro / Claro
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                themeToggle.innerHTML = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
                localStorage.setItem('hercar_theme', isDark ? 'dark' : 'light');
            });

            if (localStorage.getItem('hercar_theme') === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.innerHTML = '☀️ Modo Claro';
            }
        }
    }

    setupVoiceFeedback() {
        this.voiceEngine.onSpeechResult = (transcript, isFinal) => {
            if (this.chatInputEl) {
                this.chatInputEl.value = transcript;
                this.chatInputEl.style.height = 'auto';
                this.chatInputEl.style.height = Math.min(this.chatInputEl.scrollHeight, 140) + 'px';

                if (isFinal) {
                    setTimeout(() => {
                        this.handleUserSubmit();
                    }, 500);
                }
            }
        };
    }

    actualizarBotonVoz(enabled) {
        if (!this.btnVoiceToggleEl) return;
        if (enabled) {
            this.btnVoiceToggleEl.innerHTML = '🔊 <span class="voice-status-text">Voz Activada</span>';
            this.btnVoiceToggleEl.classList.remove('muted');
        } else {
            this.btnVoiceToggleEl.innerHTML = '🔇 <span class="voice-status-text">Voz Silenciada</span>';
            this.btnVoiceToggleEl.classList.add('muted');
        }
    }

    mostrarPortada() {
        if (this.portadaContainerEl) {
            this.portadaContainerEl.style.display = 'block';
        }
        if (this.chatMessagesEl) {
            this.chatMessagesEl.style.display = 'none';
        }
    }

    activarAreaChat() {
        if (this.portadaContainerEl) {
            this.portadaContainerEl.style.display = 'none';
        }
        if (this.chatMessagesEl) {
            this.chatMessagesEl.style.display = 'flex';
        }
    }

    cerrarSidebarMovilSiAplica() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    handleUserSubmit() {
        if (!this.chatInputEl) return;
        const text = this.chatInputEl.value.trim();
        if (!text) return;

        this.chatInputEl.value = '';
        this.chatInputEl.style.height = 'auto';

        if (this.testEngine.isActive && (text.toLowerCase().includes('cancelar') || text.toLowerCase().includes('salir'))) {
            this.testEngine.cancelar();
            return;
        }

        this.enviarConsultaDirecta(text);
    }

    enviarConsultaDirecta(query) {
        if (!query || !query.trim()) return;

        this.activarAreaChat();
        this.addUserMessage(query);
        this.mostrarTypingIndicator();

        setTimeout(() => {
            this.removerTypingIndicator();
            this.procesarRespuestaInteligente(query);
        }, 550);
    }

    addUserMessage(text) {
        const msgObj = { sender: 'user', text: text, timestamp: new Date() };
        this.history.push(msgObj);

        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message message-user';
        messageEl.innerHTML = `
            <div class="message-bubble user-bubble">
                <div class="message-text">${this.escapeHTML(text)}</div>
            </div>
            <div class="user-avatar-icon">👤</div>
        `;

        this.chatMessagesEl.appendChild(messageEl);
        this.scrollToBottom();
    }

    addBotMessage(markdownText, autoSpeak = true) {
        this.activarAreaChat();

        const msgObj = { sender: 'bot', text: markdownText, timestamp: new Date() };
        this.history.push(msgObj);

        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message message-bot';
        const parsedHTML = this.parseMarkdown(markdownText);

        messageEl.innerHTML = `
            <div class="bot-avatar">
                <img src="assets/logo-hercar.png" alt="HercarIA" onerror="this.src='assets/logo-iestp.png'">
            </div>
            <div class="message-bubble bot-bubble">
                <div class="bot-header-meta">
                    <span class="bot-name">HercarIA</span>
                    <span class="bot-badge-tag">Orientadora Oficial</span>
                    <span class="voice-wave-anim" style="display: none;">
                        <span></span><span></span><span></span><span></span>
                    </span>
                </div>
                <div class="message-text">${parsedHTML}</div>
                <div class="message-actions">
                    <button class="msg-action-btn btn-speak" title="Escuchar respuesta con voz de chica">
                        🔊 Escuchar
                    </button>
                    <button class="msg-action-btn btn-copy" title="Copiar texto">
                        📋 Copiar
                    </button>
                </div>
            </div>
        `;

        const btnSpeak = messageEl.querySelector('.btn-speak');
        btnSpeak.addEventListener('click', () => {
            this.voiceEngine.hablar(markdownText);
        });

        const btnCopy = messageEl.querySelector('.btn-copy');
        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(markdownText).then(() => {
                btnCopy.innerHTML = '✅ Copiado';
                setTimeout(() => btnCopy.innerHTML = '📋 Copiar', 2000);
            });
        });

        this.chatMessagesEl.appendChild(messageEl);
        this.scrollToBottom();

        if (autoSpeak) {
            this.voiceEngine.hablar(markdownText);
        }
    }

    addBotInteractive(htmlContent, voiceSummary = '') {
        this.activarAreaChat();

        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message message-bot message-interactive';

        messageEl.innerHTML = `
            <div class="bot-avatar">
                <img src="assets/logo-hercar.png" alt="HercarIA" onerror="this.src='assets/logo-iestp.png'">
            </div>
            <div class="message-bubble bot-bubble">
                <div class="bot-header-meta">
                    <span class="bot-name">HercarIA</span>
                    <span class="bot-badge-tag">Test Vocacional</span>
                    <span class="voice-wave-anim" style="display: none;">
                        <span></span><span></span><span></span><span></span>
                    </span>
                </div>
                <div class="interactive-content">${htmlContent}</div>
            </div>
        `;

        this.chatMessagesEl.appendChild(messageEl);
        this.scrollToBottom();

        if (voiceSummary) {
            this.voiceEngine.hablar(voiceSummary);
        }
    }

    mostrarTypingIndicator() {
        if (this.isTyping) return;
        this.isTyping = true;

        const typingEl = document.createElement('div');
        typingEl.id = 'bot-typing-indicator';
        typingEl.className = 'chat-message message-bot typing-state';
        typingEl.innerHTML = `
            <div class="bot-avatar">
                <img src="assets/logo-hercar.png" alt="HercarIA">
            </div>
            <div class="message-bubble bot-bubble typing-bubble">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        this.chatMessagesEl.appendChild(typingEl);
        this.scrollToBottom();
    }

    removerTypingIndicator() {
        this.isTyping = false;
        const typingEl = document.getElementById('bot-typing-indicator');
        if (typingEl) {
            typingEl.remove();
        }
    }

    scrollToBottom() {
        if (this.chatScrollAreaEl) {
            this.chatScrollAreaEl.scrollTop = this.chatScrollAreaEl.scrollHeight;
        }
    }

    reiniciarConversacion() {
        this.history = [];
        this.chatMessagesEl.innerHTML = '';
        this.voiceEngine.detenerVoz();
        this.testEngine.isActive = false;
        this.mostrarPortada();
    }

    /**
     * MOTOR DE RESPUESTAS NLP
     */
    procesarRespuestaInteligente(rawQuery) {
        const q = this.normalizarTexto(rawQuery);

        // 1. Detección de Test Vocacional / Orientación
        if (
            q.includes('test') || 
            q.includes('vocacional') || 
            q.includes('no se que estudiar') || 
            q.includes('no se que carrera') || 
            q.includes('elegir carrera') || 
            q.includes('escoger carrera') || 
            q.includes('orientacion') || 
            q.includes('que me recomiendas') ||
            q.includes('ayudame a decidir') ||
            q.includes('indeciso')
        ) {
            this.testEngine.iniciar();
            return;
        }

        // 2. Registro de Pagos / Vouchers / Métodos de Pago
        if (
            q.includes('pago') || 
            q.includes('pagar') || 
            q.includes('voucher') || 
            q.includes('boucher') || 
            q.includes('banco de la nacion') || 
            q.includes('boleta') || 
            q.includes('boletas') || 
            q.includes('metodo de pago') ||
            q.includes('donde pago') ||
            q.includes('como pago')
        ) {
            this.responderMetodosDePago();
            return;
        }

        // 3. Matrícula / Costos de matrícula / Cuánto cuesta
        if (
            q.includes('matricula') || 
            q.includes('matricularme') || 
            q.includes('cuanto cuesta') || 
            q.includes('cuanto se paga') || 
            q.includes('mensualidad') || 
            q.includes('pension') || 
            q.includes('gratis') || 
            q.includes('costo')
        ) {
            this.responderMatriculaYCostos();
            return;
        }

        // 4. Admisión / Examen de admisión / Requisitos para ingresar
        if (
            q.includes('admision') || 
            q.includes('examen') || 
            q.includes('postular') || 
            q.includes('ingreso') || 
            q.includes('pre tecno') || 
            q.includes('academia') || 
            q.includes('requisitos para entrar')
        ) {
            this.responderAdmision();
            return;
        }

        // 5. Carreras específicas
        // APSTI (Sistemas)
        if (
            q.includes('apsti') || 
            q.includes('sistema') || 
            q.includes('sistemas') || 
            q.includes('computacion') || 
            q.includes('software') || 
            q.includes('programacion') || 
            q.includes('redes') || 
            q.includes('ti')
        ) {
            this.responderCarreraDetalle('apsti');
            return;
        }

        // ANI (Negocios Internacionales)
        if (
            q.includes('ani') || 
            q.includes('negocio') || 
            q.includes('negocios') || 
            q.includes('internacional') || 
            q.includes('aduanas') || 
            q.includes('comercio exterior') || 
            q.includes('exportacion') || 
            q.includes('importacion')
        ) {
            this.responderCarreraDetalle('ani');
            return;
        }

        // Contabilidad
        if (
            q.includes('contabilidad') || 
            q.includes('contador') || 
            q.includes('tributo') || 
            q.includes('tributos') || 
            q.includes('sunat') || 
            q.includes('finanza') || 
            q.includes('finanzas')
        ) {
            this.responderCarreraDetalle('contabilidad');
            return;
        }

        // Desarrollo Pesquero y Acuícola (DPA)
        if (
            q.includes('dpa') || 
            q.includes('pesca') || 
            q.includes('pesquero') || 
            q.includes('pesquera') || 
            q.includes('acuicola') || 
            q.includes('acuicultura') || 
            q.includes('mar') || 
            q.includes('embarcacion')
        ) {
            this.responderCarreraDetalle('dpa');
            return;
        }

        // 6. Carreras en general
        if (
            q.includes('carrera') || 
            q.includes('carreras') || 
            q.includes('programas') || 
            q.includes('especialidades') || 
            q.includes('que hay para estudiar') ||
            q.includes('que ensenan')
        ) {
            this.responderCarrerasGenerales();
            return;
        }

        // 7. Ubicación, Horarios, Teléfono, Contacto
        if (
            q.includes('donde queda') || 
            q.includes('ubicacion') || 
            q.includes('direccion') || 
            q.includes('horario') || 
            q.includes('telefono') || 
            q.includes('celular') || 
            q.includes('whatsapp') || 
            q.includes('contacto') || 
            q.includes('mapa')
        ) {
            this.responderContactoYUbicacion();
            return;
        }

        // 8. Trámites / Mesa de Partes / Constancias
        if (
            q.includes('tramite') || 
            q.includes('mesa de partes') || 
            q.includes('constancia') || 
            q.includes('certificado') || 
            q.includes('titulo') || 
            q.includes('notas') || 
            q.includes('record')
        ) {
            this.responderTramites();
            return;
        }

        // 9. Historia, modernización y embarcación
        if (
            q.includes('historia') || 
            q.includes('quienes fueron') || 
            q.includes('carcamo') || 
            q.includes('licenciamiento') || 
            q.includes('barco') || 
            q.includes('embarcacion') || 
            q.includes('modernizacion') ||
            q.includes('beneficios')
        ) {
            this.responderHistoriaEInstitucion();
            return;
        }

        // 10. Becas y beneficios
        if (
            q.includes('beca') || 
            q.includes('becas') || 
            q.includes('pronabec')
        ) {
            this.responderBecas();
            return;
        }

        // 11. Saludos
        if (
            q.startsWith('hola') || 
            q.includes('buenos dias') || 
            q.includes('buenas tardes') || 
            q.includes('buenas noches') || 
            q.includes('saludos') ||
            q === 'hola'
        ) {
            this.responderSaludo();
            return;
        }

        // 12. Respuesta general
        this.responderGenerico(rawQuery);
    }

    responderMetodosDePago() {
        const respuesta = `💳 **GUÍA OFICIAL DE PAGOS Y REGISTRO DE VOUCHERS**
        
El IESTP "Hermanos Cárcamo" cuenta con una plataforma virtual exclusiva para la recepción y verificación de pagos:

### 🏦 1. ¿Dónde realizar el pago?
Todos los conceptos (matrícula, examen de admisión, constancias, certificaciones) se cancelan en el **Banco de la Nación**:
* **En Ventanilla** de cualquier agencia bancaria a nivel nacional.
* **En Agentes MultiRed** autorizados.
* *Importante:* Al pagar, solicita tu comprobante (voucher físico o digital) y revisa que figure tu DNI y el monto exacto.

---

### 💻 2. ¿Cómo registrar tu Voucher paso a paso?
Una vez que tengas tu comprobante bancario, debes registrarlo obligatoriamente en el sistema institucional:
1. Ingresa a la plataforma oficial: [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/)
2. Digita tu **DNI**.
3. Selecciona el **concepto de pago** (ej: Matrícula Semestral, Examen de Admisión, etc.).
4. Rellena los datos del voucher: **Número de Operación**, **Fecha de emisión** y **Monto pagado**.
5. Adjunta una fotografía clara o archivo PDF de tu voucher.
6. Haz clic en **"Registrar Pago"** y conserva tu código de registro.

---

### 📄 3. Consulta y Descarga de Boletas Electrónicas
Puedes verificar y descargar tu comprobante de pago electrónico en cualquier momento desde:
🔗 [sistema.ieshercar.com/Consulta_Boletas/index.php](https://sistema.ieshercar.com/Consulta_Boletas/index.php)

> ⚠️ *Advertencia de Seguridad:* Nunca realices depósitos a números de cuenta de personas particulares. Todos los abonos institucionales se realizan únicamente en las cuentas oficiales del Banco de la Nación.`;

        this.addBotMessage(respuesta);
    }

    responderMatriculaYCostos() {
        const respuesta = `📝 **MATRÍCULA Y COSTOS EDUCATIVOS**

¡Excelentes noticias para tu economía! El **IESTP "Hermanos Cárcamo" es una institución pública del Estado Peruano** (dependiente de la DREP Piura y el MINEDU):

### 💰 ¿Cuánto cuesta estudiar?
* **PENSIONES MENSUALES:** **S/ 0.00 (TOTALMENTE GRATUITO)**. No pagas mensualidades privadas.
* **DERECHO DE MATRÍCULA:** Únicamente se abona una tasa administrativa semestral estipulada en el TUPA institucional (aproximadamente entre **S/ 150 y S/ 250 por ciclo de 6 meses**, que incluye carnet y servicios).

---

### 📋 Requisitos para Matrícula de Cachimbos (Ingresantes):
1. **Haber alcanzado vacante** en el Examen de Admisión Ordinario, Exonerados o por Academia Pre Tecno.
2. **Voucher de pago** por concepto de matrícula en el Banco de la Nación.
3. **Registro obligatorio del voucher** en [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/).
4. **Certificados originales de estudios secundarios** concluidos (1° a 5° de secundaria) visados por UGEL o emitidos por el portal MINEDU.
5. Copia legible de **DNI vigente**.
6. Partida de nacimiento original o copia certificada.
7. 02 fotos tamaño carnet a color con fondo blanco.

---

### 🔄 Matrícula de Alumnos Regulares:
1. No adeudar libros a la biblioteca ni herramientas de laboratorios.
2. Realizar el depósito semestral en el Banco de la Nación y registrar el comprobante en la plataforma de pagos.
3. Confirmar la inscripción de unidades didácticas con su coordinación académica.`;

        this.addBotMessage(respuesta);
    }

    responderAdmision() {
        const respuesta = `🎯 **PROCESO DE ADMISIÓN IESTP HERMANOS CÁRCAMO**

El instituto apertura sus procesos de admisión para sus **4 carreras profesionales técnicas**:

### 📌 Modalidades de Ingreso:
1. **Examen de Admisión Ordinario:** Dirigido a todos los egresados de secundaria. Evalúa razonamiento verbal, razonamiento matemático, ciencias y cultura general.
2. **Modalidad por Exoneración:** 
   * Primeros puestos de educación secundaria (1° y 2° puesto).
   * Personas con discapacidad acreditada por CONADIS (Ley N° 29973).
   * Deportistas calificados acreditados por el IPD.
   * Postulantes preseleccionados de **Beca 18**.
3. **Academia Pre Tecno (Ingreso Directo):** Ciclo preparatorio del instituto donde los mejores promedios obtienen su vacante directa sin dar el examen general.

---

### 📑 Requisitos de Postulación:
* Solicitud en Formato Único de Trámite (FUT).
* Certificado de estudios secundarios completos (1° al 5° año).
* Copia simple del DNI.
* Partida de nacimiento.
* 02 fotografías tamaño carnet fondo blanco.
* Voucher de pago por derecho de examen de admisión en el Banco de la Nación.

¿Te gustaría que te ayude a saber para qué carrera tienes mayor aptitud con nuestro **Test Vocacional**?`;

        this.addBotMessage(respuesta);
    }

    responderCarrerasGenerales() {
        const respuesta = `📚 **NUESTRAS 4 CARRERAS PROFESIONALES TÉCNICAS**
        
Todas nuestras carreras tienen una duración de **3 años (6 semestres académicos)** y otorgan **Título Profesional Técnico a Nombre de la Nación**:

1. 💻 **Arquitectura de Plataformas y Servicios de T.I. (APSTI)**
   * Software, aplicaciones web, móviles, redes, ciberseguridad y servidores cloud.
   * Alta demanda laboral en empresas tecnológicas y portuarias.

2. 🚢 **Administración de Negocios Internacionales (ANI)**
   * Comercio exterior, exportación de productos piuranos, aduanas y logística portuaria.
   * Paita es el puerto comercial más relevante del norte peruano.

3. 📊 **Contabilidad**
   * Gestión tributaria ante SUNAT, análisis financiero, auditoría y costos empresariales.
   * Campo laboral indispensable en toda empresa formal pública o privada.

4. 🐟 **Desarrollo Pesquero y Acuícola (DPA)**
   * Maricultura, crianza de conchas y langostinos, procesamiento marino y control de calidad (HACCP).
   * Contamos con una **embarcación pesquera propia con tecnología radar y GPS** para prácticas reales en el mar.

👉 *Puedes preguntarme por cualquiera de ellas diciendo por ejemplo: "Háblame de APSTI" o haz clic en el botón de abajo:*
<br>
<button class="btn-action-primary" onclick="window.hercarTest.iniciar()">🎓 Iniciar Test Vocacional</button>`;

        this.addBotMessage(respuesta);
    }

    responderCarreraDetalle(carreraId) {
        const c = this.kb.carreras.find(item => item.id === carreraId);
        if (!c) {
            this.responderCarrerasGenerales();
            return;
        }

        let respuesta = `${c.icono} **CARRERA PROFESIONAL TÉCNICA DE ${c.nombre.toUpperCase()}**

* **Duración:** ${c.duracion}
* **Título Otorgado:** ${c.titulo}
* **Enfoque formativo:** ${c.perfil}

---

### 🛠️ Módulos Formativos y Certificaciones Anuales:
Cada año que apruebes recibes una certificación oficial que te permite laborar antes de terminar la carrera:
`;

        c.modulos.forEach(m => {
            respuesta += `* **${m.modulo}:** ${m.nombre}\n`;
        });

        respuesta += `
---

### 💼 Campo Laboral y Oportunidades:
`;
        c.campoLaboral.forEach(cl => {
            respuesta += `* ${cl}\n`;
        });

        respuesta += `
---

### 🌟 ¿Por qué estudiarla en Paita?
${c.porQueEstudiar}

¿Deseas saber los requisitos de matrícula o evaluar si encaja con tu perfil en el test vocacional?`;

        this.addBotMessage(respuesta);
    }

    responderContactoYUbicacion() {
        const i = this.kb.instituto;
        const respuesta = `📍 **UBICACIÓN, CONTACTO Y HORARIOS DE ATENCIÓN**

El IESTP "Hermanos Cárcamo" te espera en su moderno campus en Paita:

* 🏢 **Dirección:** ${i.direccion}
* ⏰ **Horario de Atención:** ${i.horario}
* 📞 **Teléfono Celular / WhatsApp:** [${i.telefono}](tel:${i.telefono.replace(/\s+/g, '')})
* ☎️ **Teléfono Fijo:** ${i.telefonoFijo}
* ✉️ **Correo Institucional:** [${i.email}](mailto:${i.email})
* 🌐 **Sitio Web Oficial:** [ieshercar.edu.pe](${i.web})
* 🗺️ **Ubicación en Google Maps:** [Ver Mapa Interactivo](${i.maps})

### 🌐 Plataformas Digitales 24/7:
* **Sistema de Pagos y Vouchers:** [pagos.ieshercar.edu.pe](${i.pagosWeb})
* **Mesa de Partes Virtual:** [sistema.ieshercar.edu.pe/registro-tramite/](${i.tramitesWeb})
* **Consulta de Boletas Electrónicas:** [sistema.ieshercar.com/Consulta_Boletas](${i.boletasWeb})
* **Biblioteca Virtual:** [biblioteca.ieshercar.edu.pe](${i.bibliotecaVirtual})`;

        this.addBotMessage(respuesta);
    }

    responderTramites() {
        const respuesta = `📄 **TRÁMITES Y MESA DE PARTES VIRTUAL**

Para realizar gestiones documentarias no necesitas hacer colas físicas, puedes ingresar a la **Mesa de Partes Virtual**:
🔗 [sistema.ieshercar.edu.pe/registro-tramite/](${this.kb.instituto.tramitesWeb})

### Trámites que puedes solicitar:
1. **Constancia de Matrícula:** Acredita que eres alumno regular en el ciclo vigente.
2. **Constancia de Estudios y Récord de Notas:** Detalle oficial de tus asignaturas aprobadas.
3. **Constancia de Egresado:** Tras aprobar los 6 semestres académicos.
4. **Constancia de No Adeudo:** Requisito para trámite de titulación.
5. **Certificados Modulares:** Para validar tus competencias laborales tras culminar cada año.
6. **Examen de Suficiencia Profesional y Título Profesional Técnico a Nombre de la Nación.**

*Nota:* Recuerda cancelar la tasa correspondiente en el Banco de la Nación y adjuntar el voucher en tu solicitud.`;

        this.addBotMessage(respuesta);
    }

    responderHistoriaEInstitucion() {
        const i = this.kb.instituto;
        const respuesta = `🏛️ **HISTORIA Y LOGROS DEL IESTP "HERMANOS CÁRCAMO"**

${i.historia}

### 🌟 Pilares de Excelencia:
* **Creación Oficial:** Creado bajo ${i.creacion} y revalidado por ${i.revalidacion}.
* **Inversión Histórica de S/ 36 Millones:** Renovación integral de infraestructura con modernas aulas pedagógicas, talleres, laboratorios de ofimática, física, química y microbiología.
* **Embarcación Pesquera Propia:** Un hito educativo en el norte del Perú, equipada con sistemas de radar, visión nocturna y navegación GPS para que los estudiantes de Pesquera y Acuicultura aprendan en el mar con tecnología de primer nivel.
* **Compromiso Social:** Brindar educación superior tecnológica de calidad sin barreras económicas a toda la juventud de Paita, Piura y la región.`;

        this.addBotMessage(respuesta);
    }

    responderBecas() {
        const respuesta = `🎓 **BECAS Y BENEFICIOS PARA ESTUDIANTES**

En el IESTP "Hermanos Cárcamo" tienes acceso a múltiples beneficios económicos y académicos:

1. **Beca 18 (PRONABEC):** Si eres postulante o estudiante preseleccionado de Beca 18, puedes estudiar en nuestro instituto con todos los gastos de manutención, laptop y materiales cubiertos por el Estado Peruano.
2. **Beca por Excelencia Académica:** Exoneraciones y reconocimientos a los primeros puestos del examen de admisión y promedios destacados de cada ciclo.
3. **Carnet de Medio Pasaje:** Carnet oficial emitido por el MINEDU que te garantiza tarifa preferencial en transporte público.
4. **Bolsa Laboral y Prácticas:** Convenios con agencias marítimas, aduaneras, plantas pesqueras y agroindustrias de Paita y Piura para tu rápida inserción al mercado de trabajo.`;

        this.addBotMessage(respuesta);
    }

    responderSaludo() {
        const respuesta = `¡Hola! Qué gusto saludarte. 😊 Soy **HercarIA**, la asistente virtual del **Instituto Hermanos Cárcamo de Paita**.

Estoy lista para ayudarte con:
* 🎓 **Test Vocacional Interactivo** (si tienes dudas sobre qué estudiar).
* 💼 Información completa de nuestras **4 carreras profesionales técnicas**.
* 📝 **Matrículas, requisitos y costos** (¡educación superior pública gratuita!).
* 💳 **Registro de pagos y vouchers** en [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/).
* 📍 **Ubicación y horarios de atención en Paita.**

¿Qué consulta te gustaría realizar en este momento?`;

        this.addBotMessage(respuesta);
    }

    responderGenerico(query) {
        const respuesta = `Comprendo tu consulta sobre *"**${this.escapeHTML(query)}**"*. 

Como orientadora oficial del **IESTP Hermanos Cárcamo de Paita**, puedo guiarte con exactitud en cualquiera de estos temas:

* 🎓 **¿Aún no sabes qué carrera elegir?** 👉 Puedes realizar nuestro **Test Vocacional Interactivo**.
* 💻 **Carreras Técnicas de 3 años:** APSTI (Sistemas/Software), Negocios Internacionales, Contabilidad o Desarrollo Pesquero y Acuícola.
* 📝 **Matrícula y Admisión:** Requisitos para cachimbos, exonerados y fechas.
* 💳 **Pagos y Vouchers:** Depósitos en Banco de la Nación y validación en [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/).
* 📞 **Contacto directo:** Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita o al **+51 969 100 257**.

¿Te gustaría que te detalle alguna carrera o iniciamos el test vocacional?`;

        this.addBotMessage(respuesta);
    }

    normalizarTexto(txt) {
        if (!txt) return '';
        return txt
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[¿?¡!,.;:()_]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    parseMarkdown(md) {
        if (!md) return '';
        let html = md;

        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^# (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^> (.*$)/gim, '<div class="chat-blockquote">$1</div>');
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1 <span class="link-arrow">↗</span></a>');
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gim, '<ul class="chat-list">$1</ul>');
        html = html.replace(/<\/ul>\s*<ul class="chat-list">/g, '');
        html = html.replace(/^---$/gim, '<hr class="chat-divider">');
        html = html.replace(/\n\n/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');

        return html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.hercarApp = new HercarChatApp();
});
