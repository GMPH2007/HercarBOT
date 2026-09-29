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
        this.renderizarHistorialSidebar();
        
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
                this.cerrarSidebarMovilSiAplica();
                this.reiniciarConversacion();
            });
        }

        const exportBtns = document.querySelectorAll('.btn-export-chat');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', () => this.exportarConversacion());
        });

        const clearBtns = document.querySelectorAll('.btn-clear-chat');
        clearBtns.forEach(btn => {
            btn.addEventListener('click', () => this.borrarConversacionConConfirmacion());
        });

        const btnClearHistoryAll = document.getElementById('btn-clear-history-all');
        if (btnClearHistoryAll) {
            btnClearHistoryAll.addEventListener('click', () => this.vaciarHistorialReciente());
        }

        if (this.btnStartTestSidebarEl) {
            this.btnStartTestSidebarEl.addEventListener('click', () => {
                this.cerrarSidebarMovilSiAplica();
                this.testEngine.iniciar();
            });
        }

        // Toggle Sidebar en móviles (drawer con overlay) y en desktop (colapso completo)
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const btnCloseSidebarMobile = document.getElementById('btn-close-sidebar-mobile');

        const toggleSidebar = () => {
            if (window.innerWidth <= 768) {
                const isOpen = sidebar.classList.toggle('open');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('active', isOpen);
                }
            } else {
                sidebar.classList.toggle('collapsed');
            }
        };

        const cerrarSidebar = () => {
            if (sidebar) sidebar.classList.remove('open');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        };

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSidebar();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', cerrarSidebar);
        }

        if (btnCloseSidebarMobile) {
            btnCloseSidebarMobile.addEventListener('click', cerrarSidebar);
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
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
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

        this.agregarAHistorialReciente(query);
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

    addBotMessage(markdownText, autoSpeak = true, spokenText = '') {
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
                    <button class="msg-action-btn btn-speak" title="Escuchar respuesta en voz alta">
                        🔊 Escuchar
                    </button>
                    <button class="msg-action-btn btn-copy" title="Copiar texto">
                        📋 Copiar
                    </button>
                </div>
            </div>
        `;

        const textoParaHablar = spokenText || markdownText;

        const btnSpeak = messageEl.querySelector('.btn-speak');
        btnSpeak.addEventListener('click', () => {
            this.voiceEngine.hablar(textoParaHablar);
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
            this.voiceEngine.hablar(textoParaHablar);
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

    borrarConversacionConConfirmacion() {
        if (!this.history || this.history.length === 0) {
            this.reiniciarConversacion();
            return;
        }

        const confirmar = confirm('¿Estás seguro de que deseas borrar toda la conversación actual y reiniciar el chat?');
        if (confirmar) {
            this.reiniciarConversacion();
        }
    }

    exportarConversacion() {
        if (!this.history || this.history.length === 0) {
            alert('Aún no hay mensajes en la conversación para guardar. Realiza una consulta primero.');
            return;
        }

        const ahora = new Date();
        const fechaStr = ahora.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
        const horaStr = ahora.toLocaleTimeString('es-PE');
        const fileDate = ahora.toISOString().slice(0, 10);

        let contenido = `========================================================================\n`;
        contenido += `   REGISTRO OFICIAL DE CONVERSACIÓN - HERCARTA (IESTP "HERMANOS CÁRCAMO")\n`;
        contenido += `   Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo"\n`;
        contenido += `   Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura, Perú\n`;
        contenido += `   Portal Oficial: https://ieshercar.edu.pe/ | Plataforma Pagos: https://pagos.ieshercar.edu.pe/\n`;
        contenido += `   Fecha: ${fechaStr} | Hora: ${horaStr}\n`;
        contenido += `========================================================================\n\n`;

        this.history.forEach((item) => {
            const time = item.timestamp ? new Date(item.timestamp).toLocaleTimeString('es-PE') : '';
            const rol = item.sender === 'user' ? 'USUARIO / POSTULANTE' : 'HERCARIA (ORIENTADORA VIRTUAL)';
            const cleanText = (item.text || '')
                .replace(/<[^>]*>/g, '')
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                .trim();

            contenido += `[${time}] ${rol}:\n${cleanText}\n\n`;
            contenido += `------------------------------------------------------------------------\n\n`;
        });

        contenido += `========================================================================\n`;
        contenido += `Fin del registro de conversación. Generado automáticamente por HercarIA.\n`;
        contenido += `Para consultas presenciales: Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita.\n`;
        contenido += `========================================================================\n`;

        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Registro_Chat_HercarIA_${fileDate}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    agregarAHistorialReciente(query) {
        if (!query || query.trim().length < 3) return;
        try {
            let queries = JSON.parse(localStorage.getItem('hercar_recent_queries') || '[]');
            queries = queries.filter(q => q.toLowerCase() !== query.toLowerCase());
            queries.unshift(query.trim());
            if (queries.length > 8) queries = queries.slice(0, 8);
            localStorage.setItem('hercar_recent_queries', JSON.stringify(queries));
            this.renderizarHistorialSidebar();
        } catch (e) {}
    }

    renderizarHistorialSidebar() {
        const historySection = document.getElementById('sidebar-history-section');
        const historyList = document.getElementById('sidebar-history-list');
        if (!historySection || !historyList) return;

        try {
            const queries = JSON.parse(localStorage.getItem('hercar_recent_queries') || '[]');
            if (queries.length === 0) {
                historySection.style.display = 'none';
                return;
            }

            historySection.style.display = 'block';
            historyList.innerHTML = '';

            queries.forEach(q => {
                const item = document.createElement('div');
                item.className = 'sidebar-history-item';
                item.title = q;
                item.innerHTML = `
                    <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 13px; height: 13px; flex-shrink: 0; opacity: 0.7;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${this.escapeHTML(q)}</span>
                `;
                item.addEventListener('click', () => {
                    this.cerrarSidebarMovilSiAplica();
                    this.enviarConsultaDirecta(q);
                });
                historyList.appendChild(item);
            });
        } catch (e) {}
    }

    vaciarHistorialReciente() {
        localStorage.removeItem('hercar_recent_queries');
        const historySection = document.getElementById('sidebar-history-section');
        if (historySection) historySection.style.display = 'none';
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

        // 11. Convalidación universitaria
        if (q.includes('convalida') || q.includes('convalidar') || q.includes('universidad') || q.includes('bachiller') || q.includes('seguir estudiando')) {
            this.responderConvalidacionUniversitaria();
            return;
        }

        // 12. Duración de carreras
        if (q.includes('cuanto dura') || q.includes('duracion') || q.includes('cuantos anos') || q.includes('tiempo de carrera') || q.includes('semestres')) {
            this.responderDuracion();
            return;
        }

        // 13. Título oficial a Nombre de la Nación
        if (q.includes('titulo') || q.includes('nombre de la nacion') || q.includes('grado') || q.includes('es oficial')) {
            this.responderTituloOficial();
            return;
        }

        // 14. Prácticas y convenios laborales
        if (q.includes('practica') || q.includes('practicas') || q.includes('convenio') || q.includes('convenios') || q.includes('bolsa de trabajo') || q.includes('bolsa laboral') || q.includes('donde trabajo')) {
            this.responderConveniosYPracticas();
            return;
        }

        // 15. Turnos y horarios de estudio
        if (q.includes('turno') || q.includes('turnos') || q.includes('horario de clase') || q.includes('tarde') || q.includes('noche')) {
            this.responderTurnosYHorarios();
            return;
        }

        // 16. Límite de edad
        if (q.includes('limite de edad') || q.includes('edad maxima') || q.includes('edad para postular') || q.includes('soy mayor') || q.includes('tengo 30') || q.includes('tengo 40')) {
            this.responderEdadLimite();
            return;
        }

        // 17. Saludos
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

        const voz = "Puedes pagar en el Banco de la Nación o mediante Págalo punto pe. Luego subes la foto de tu comprobante en la plataforma oficial de pagos. ¡Es muy sencillo y seguro!";
        this.addBotMessage(respuesta, true, voz);
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

        const vozMatricula = "¡La educación en nuestro instituto es 100% pública y gratuita! No cobramos mensualidades privadas. Solo se cancela el derecho de matrícula por semestre. ¿Deseas conocer los requisitos para postular?";
        this.addBotMessage(respuesta, true, vozMatricula);
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

        const vozAdmision = "Contamos con examen de admisión ordinario, exoneración para primeros puestos y Beca 18, además de ingreso directo por nuestra academia preparatoria. ¿Te gustaría saber los requisitos de postulación?";
        this.addBotMessage(respuesta, true, vozAdmision);
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

        const vozCarreras = "Ofrecemos 4 carreras profesionales técnicas de 3 años: Ápsti, Negocios Internacionales, Contabilidad y Desarrollo Pesquero. Todas otorgan título a Nombre de la Nación. ¿De cuál de ellas te gustaría conocer más?";
        this.addBotMessage(respuesta, true, vozCarreras);
    }

    responderCarreraDetalle(carreraId) {
        const c = this.kb.carreras.find(item => item.id === carreraId);
        if (!c) {
            this.responderCarrerasGenerales();
            return;
        }

        let respuesta = `## ${c.icono} Carrera Profesional Técnica de ${c.nombre}

En el Instituto "Hermanos Cárcamo", esta carrera tiene una duración de **${c.duracion}** y otorga **${c.titulo}** a Nombre de la Nación.

* **Enfoque formativo:** ${c.perfil}

---

### 🛠️ Módulos Formativos y Certificaciones Oficiales por Año:
Al culminar cada año académico con éxito, recibes una certificación modular oficial para incorporarte al mercado laboral:
`;

        c.modulos.forEach(m => {
            respuesta += `* **${m.modulo}:** ${m.nombre}\n`;
        });

        respuesta += `
---

### 💼 Campo Laboral y Oportunidades en Paita y Piura:
`;
        c.campoLaboral.forEach(cl => {
            respuesta += `* ${cl}\n`;
        });

        respuesta += `
---

### 🌟 ¿Por qué elegir esta carrera en Paita?
${c.porQueEstudiar}

¿Te gustaría consultar los requisitos y fechas de matrícula para esta carrera o evaluar tu perfil con nuestro test vocacional?`;

        let voz = "";
        if (carreraId === 'apsti') {
            voz = "¡Hola! La carrera de Ápsti dura 3 años. Aprenderás desarrollo de aplicaciones web y móviles, servidores cloud y ciberseguridad, con certificaciones oficiales cada año. ¿Te gustaría saber los requisitos de matrícula?";
        } else if (carreraId === 'ani') {
            voz = "La carrera de Administración de Negocios Internacionales dura 3 años. Aprenderás comercio exterior, aduanas y logística portuaria con gran demanda en las empresas del puerto de Paita. ¿Te gustaría saber más?";
        } else if (carreraId === 'contabilidad') {
            voz = "La carrera de Contabilidad dura 3 años. Te formarás en gestión tributaria, finanzas y auditoría con amplia salida laboral en el sector público y privado. ¿Deseas los requisitos de admisión?";
        } else if (carreraId === 'pesquera') {
            voz = "La carrera de Desarrollo Pesquero dura 3 años. Contamos con nuestra propia embarcación con radar y visión nocturna para que realices prácticas reales en alta mar. ¿Te gustaría conocer el plan de estudios?";
        } else {
            voz = `La carrera de ${c.nombre} dura 3 años y otorga título profesional a Nombre de la Nación. ¿Deseas conocer los requisitos de matrícula?`;
        }
        this.addBotMessage(respuesta, true, voz);
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

        const vozContacto = "Estamos ubicados en la Avenida Miguel Grau, Urbanización El Parque, en Paita. Atendemos de lunes a viernes de 8 de la mañana a 3 de la tarde. ¡Siempre eres bienvenido!";
        this.addBotMessage(respuesta, true, vozContacto);
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

        const vozTramites = "A través de nuestra Mesa de Partes Virtual puedes tramitar constancias de estudio, certificados y récords de notas desde cualquier dispositivo sin hacer colas.";
        this.addBotMessage(respuesta, true, vozTramites);
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

        const vozHistoria = "El instituto fue fundado en 1987 en honor a los heroicos hermanos Cárcamo de Paita. Actualmente contamos con una inversión de 36 millones en modernos laboratorios y una embarcación propia para prácticas en alta mar.";
        this.addBotMessage(respuesta, true, vozHistoria);
    }

    responderBecas() {
        const respuesta = `🎓 **BECAS Y BENEFICIOS PARA ESTUDIANTES**

En el IESTP "Hermanos Cárcamo" tienes acceso a múltiples beneficios económicos y académicos:

1. **Beca 18 (PRONABEC):** Si eres postulante o estudiante preseleccionado de Beca 18, puedes estudiar en nuestro instituto con todos los gastos de manutención, laptop y materiales cubiertos por el Estado Peruano.
2. **Beca por Excelencia Académica:** Exoneraciones y reconocimientos a los primeros puestos del examen de admisión y promedios destacados de cada ciclo.
3. **Carnet de Medio Pasaje:** Carnet oficial emitido por el MINEDU que te garantiza tarifa preferencial en transporte público.
4. **Bolsa Laboral y Prácticas:** Convenios con agencias marítimas, aduaneras, plantas pesqueras y agroindustrias de Paita y Piura para tu rápida inserción al mercado de trabajo.`;

        const vozBecas = "¡Sí! En nuestro instituto puedes estudiar con Beca 18 de Pronabec con todos los gastos cubiertos, además de becas por excelencia académica y carnet de medio pasaje.";
        this.addBotMessage(respuesta, true, vozBecas);
    }

    responderDuracion() {
        const respuesta = `⏳ **DURACIÓN Y ESTRUCTURA DE LAS CARRERAS**

En el **IESTP "Hermanos Cárcamo"**, todas las carreras profesionales técnicas tienen una duración oficial de:

* ⏱️ **3 Años Académicos** (distribuidos en **6 semestres** o ciclos lectivos).
* 📜 **Certificaciones Modulares Progresivas:** Cada año que apruebas con éxito, recibes una certificación oficial que te permite trabajar formalmente sin esperar a graduarte.
* 🎓 **Grado al finalizar:** Título Profesional Técnico a Nombre de la Nación.

¿Te gustaría conocer la malla curricular o el perfil de alguna carrera en específico?`;

        const voz = "Todas nuestras carreras técnicas duran 3 años divididos en 6 semestres. Además, al culminar cada año recibes una certificación modular oficial para incorporarte al trabajo de inmediato. ¿Deseas conocer alguna carrera?";
        this.addBotMessage(respuesta, true, voz);
    }

    responderConvalidacionUniversitaria() {
        const respuesta = `🏛️ **CONVALIDACIÓN CON UNIVERSIDADES**

¡Sí, totalmente! De acuerdo con la **Ley de Institutos y Escuelas de Educación Superior (Ley N° 30512)**:

* 🎓 **Convalidación Oficial:** Los egresados titulados de institutos superiores públicos pueden convalidar sus créditos y asignaturas aprobadas en universidades públicas y privadas licenciadas por la **SUNEDU**.
* 🚀 **Beneficio:** Te permite obtener tu Grado de Bachiller Universitario y Título Profesional Universitario (como Ingeniero o Licenciado) en menor tiempo (habitualmente 2 a 3 años adicionales).
* 💼 **Ventaja Competitiva:** Ya ingresarás a la universidad con experiencia práctica y trabajando como profesional técnico calificado.`;

        const voz = "¡Sí, totalmente! Gracias a la Ley de Educación Superior, puedes convalidar tus estudios técnicos con universidades públicas y privadas licenciadas por SUNEDU para obtener tu ingeniería o licenciatura en menor tiempo.";
        this.addBotMessage(respuesta, true, voz);
    }

    responderTituloOficial() {
        const respuesta = `🎖️ **VALOR OFICIAL DEL TÍTULO PROFESIONAL**

Al culminar satisfactoriamente tus 3 años (6 ciclos) y aprobar tu proceso de titulación en el IESTP "Hermanos Cárcamo":

* 🇵🇪 **Título a Nombre de la Nación:** Emitido con el respaldo oficial del **Ministerio de Educación (MINEDU)**.
* 🌐 **Reconocimiento Nacional e Internacional:** Válido para postular a plazas laborales del Estado (régimen CAS, 276, 728), ascensos en las Fuerzas Armadas y Policía Nacional, y empresas privadas en todo el Perú.
* 📋 **Inscripción en el Registro Nacional de Grados y Títulos:** Tu título queda registrado de forma pública y oficial.`;

        const voz = "Al culminar tus 3 años y sustentar tu proyecto obtienes el Título Profesional Técnico a Nombre de la Nación con valor oficial del Ministerio de Educación en todo el Perú.";
        this.addBotMessage(respuesta, true, voz);
    }

    responderTurnosYHorarios() {
        const respuesta = `⏰ **HORARIOS DE CLASES Y TURNOS**

* ☀️ **Turno de Clases:** Turno diurno regular.
* 🏫 **Ambientes Pedagógicos:** Clases teóricas y sesiones prácticas intensivas en talleres y laboratorios especializados (computación, redes, microbiología, navegación marítima).
* 🏢 **Horario de Atención Administrativa:** Lunes a Viernes de 8:00 AM a 3:00 PM en nuestro campus de Paita.

¿Deseas saber más sobre las inscripciones o el examen de admisión?`;

        const voz = "Nuestras clases se imparten en turno diurno regular, con modernas aulas y talleres tecnológicos. Atendemos de lunes a viernes de 8 de la mañana a 3 de la tarde.";
        this.addBotMessage(respuesta, true, voz);
    }

    responderEdadLimite() {
        const respuesta = `🎂 **¿HAY LÍMITE DE EDAD PARA POSTULAR?**

¡**NO HAY LÍMITE DE EDAD**! La educación superior tecnológica pública en el Perú está abierta para todos:

* ✅ Pueden postular jóvenes recién egresados de 5° de secundaria.
* ✅ Pueden postular adultos, trabajadores o emprendedores que deseen formalizar sus conocimientos técnicos y obtener un título oficial a Nombre de la Nación.
* 📑 **Único requisito fundamental:** Haber concluido satisfactoriamente la educación secundaria (EBR o EBA) con certificados de estudios.`;

        const voz = "¡No hay ningún límite de edad! Cualquier persona que haya terminado la secundaria puede postular y estudiar cualquiera de nuestras 4 carreras profesionales técnicas.";
        this.addBotMessage(respuesta, true, voz);
    }

    responderConveniosYPracticas() {
        const respuesta = `🤝 **CONVENIOS DE PRÁCTICAS Y EMPLEABILIDAD**

El IESTP "Hermanos Cárcamo" cuenta con una sólida alianza con el sector productivo de Paita y Piura:

* 🚢 **Sector Portuario y Marítimo:** Convenios con agencias aduaneras, navieras y terminales portuarios de Paita para estudiantes de APSTI y Negocios Internacionales.
* 🐟 **Sector Pesquero e Industrial:** Prácticas en empresas pesqueras, congeladoras y acuícolas, además de prácticas reales en la embarcación propia del instituto.
* 💼 **Sector Comercial y Financiero:** Bancos, cooperativas y estudios contables para estudiantes de Contabilidad.
* 🌐 **Bolsa Laboral Activa:** [bolsa-laboral.ieshercar.edu.pe](https://bolsa-laboral.ieshercar.edu.pe/)`;

        const voz = "Contamos con convenios institucionales con empresas del puerto de Paita, agencias aduaneras y plantas pesqueras para que realices prácticas preprofesionales desde tus primeros ciclos.";
        this.addBotMessage(respuesta, true, voz);
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

        const vozSaludo = "¡Hola! Qué gusto saludarte. Soy HercarIA, tu orientadora virtual del Instituto Hermanos Cárcamo de Paita. ¿Qué te gustaría consultar hoy?";
        this.addBotMessage(respuesta, true, vozSaludo);
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

        const vozGenerica = "Puedo orientarte sobre nuestras 4 carreras técnicas de 3 años, requisitos de matrícula gratuita, registro de pagos en el Banco de la Nación o iniciar tu test vocacional. ¿En qué tema te gustaría que te ayude?";
        this.addBotMessage(respuesta, true, vozGenerica);
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
