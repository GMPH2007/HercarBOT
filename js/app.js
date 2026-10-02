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

        // Motor de Red Neuronal Artificial (APSTI)
        this.neuralNet = new HercarNeuralNetwork();
        this.lastNeuralInference = null;

        this.isTyping = false;
        this.history = [];

        this.initSimuladorData();
        this.init();
    }

    init() {
        // Exponer globalmente
        window.hercarApp = this;
        window.hercarTest = this.testEngine;
        window.hercarVoice = this.voiceEngine;
        window.hercarNeural = this.neuralNet;

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

        // Herramientas Inteligentes APSTI en Sidebar
        const btnOpenSim = document.getElementById('btn-open-simulador');
        if (btnOpenSim) {
            btnOpenSim.addEventListener('click', () => {
                this.cerrarSidebarMovilSiAplica();
                this.abrirSimuladorTUPA();
            });
        }

        const btnOpenMap = document.getElementById('btn-open-mapa');
        if (btnOpenMap) {
            btnOpenMap.addEventListener('click', () => {
                this.cerrarSidebarMovilSiAplica();
                this.abrirMapaCampus();
            });
        }

        const btnOpenNeural = document.getElementById('btn-open-neural-monitor');
        if (btnOpenNeural) {
            btnOpenNeural.addEventListener('click', () => {
                this.cerrarSidebarMovilSiAplica();
                this.abrirInspectorNeuronal();
            });
        }

        const headerNeuralInd = document.getElementById('header-neural-indicator');
        if (headerNeuralInd) {
            headerNeuralInd.addEventListener('click', () => {
                this.abrirInspectorNeuronal();
            });
        }

        // Laboratorio / Playground de la Red Neuronal
        const btnPlayground = document.getElementById('btn-run-playground');
        const inputPlayground = document.getElementById('neural-playground-input');
        if (btnPlayground && inputPlayground) {
            const runTest = () => {
                const val = inputPlayground.value.trim();
                if (val) this.abrirInspectorNeuronal(val);
            };
            btnPlayground.addEventListener('click', runTest);
            inputPlayground.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') runTest();
            });
        }

        // Cerrar modales al hacer clic en el backdrop
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.cerrarTodosLosModales();
                }
            });
        });

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

        // 🧠 Inferencia en Tiempo Real de la Red Neuronal (APSTI)
        const neuralResult = this.neuralNet.predict(query);
        this.lastNeuralInference = neuralResult;
        console.log('[Inferencia Red Neuronal]:', neuralResult);

        // Actualizar indicador de cabecera en tiempo real
        const headerIndicator = document.getElementById('header-neural-indicator');
        if (headerIndicator) {
            const textEl = headerIndicator.querySelector('.neural-header-text');
            if (textEl) {
                textEl.textContent = `Red Neuronal: ${neuralResult.confidencePercent}`;
            }
        }

        setTimeout(() => {
            this.removerTypingIndicator();
            this.procesarRespuestaInteligente(query, neuralResult);
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

    addBotMessage(markdownText, autoSpeak = true, spokenText = '', neuralResult = null, customFollowUps = null) {
        this.activarAreaChat();

        const inference = neuralResult || this.lastNeuralInference || {
            intent: 'general',
            confidence: 0.95,
            confidencePercent: '95.0%',
            latencyMs: 3.8,
            tokens: []
        };

        const msgObj = { sender: 'bot', text: markdownText, timestamp: new Date(), inference: inference };
        this.history.push(msgObj);

        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message message-bot';
        const parsedHTML = this.parseMarkdown(markdownText);
        const followUps = customFollowUps || this.getFollowUpSuggestions(inference.intent);

        const confPct = inference.confidencePercent || (inference.confidence * 100).toFixed(1) + '%';
        const previewQuery = (inference.query || markdownText.slice(0, 50)).replace(/'/g, "\\'");

        messageEl.innerHTML = `
            <div class="bot-avatar">
                <img src="assets/logo-hercar.png" alt="HercarIA" onerror="this.src='assets/logo-iestp.png'">
            </div>
            <div class="message-bubble bot-bubble">
                <div class="bot-header-meta">
                    <span class="bot-name">HercarIA</span>
                    <span class="bot-badge-tag">Orientadora Oficial</span>
                    <button type="button" class="btn-neural-badge" title="Ver análisis neuronal de esta consulta" onclick="window.hercarApp.abrirInspectorNeuronal('${previewQuery}')">
                        🧠 Red Neuronal: ${confPct} <span class="badge-time">(${inference.latencyMs}ms)</span>
                    </button>
                    <span class="voice-wave-anim" style="display: none;">
                        <span></span><span></span><span></span><span></span>
                    </span>
                </div>
                <div class="message-text">${parsedHTML}</div>

                ${followUps && followUps.length > 0 ? `
                <div class="bot-follow-up-chips">
                    <span class="follow-up-title">💡 Preguntas relacionadas sugeridas:</span>
                    <div class="chips-container">
                        ${followUps.map(chip => `
                            <button type="button" class="btn-followup-chip" onclick="window.hercarApp.enviarConsultaDirecta('${chip.query.replace(/'/g, "\\'")}')">
                                ${chip.icon ? `<span class="chip-icon">${chip.icon}</span>` : ''} ${chip.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="message-actions">
                    <button type="button" class="msg-action-btn btn-speak" title="Escuchar respuesta en voz dulce">
                        🔊 Escuchar
                    </button>
                    <button type="button" class="msg-action-btn btn-copy" title="Copiar texto de respuesta">
                        📋 Copiar
                    </button>
                    <button type="button" class="msg-action-btn btn-neural-inspect" title="Inspeccionar activación de la Red Neuronal" onclick="window.hercarApp.abrirInspectorNeuronal('${previewQuery}')">
                        🧠 Red Neuronal
                    </button>
                    <div class="msg-rating-group">
                        <button type="button" class="msg-action-btn btn-rate-up" title="Respuesta útil" onclick="window.hercarApp.calificarRespuesta(this, 'up')">👍</button>
                        <button type="button" class="msg-action-btn btn-rate-down" title="Respuesta no útil" onclick="window.hercarApp.calificarRespuesta(this, 'down')">👎</button>
                    </div>
                </div>
            </div>
        `;

        const textoParaHablar = spokenText || markdownText;

        const btnSpeak = messageEl.querySelector('.btn-speak');
        if (btnSpeak) {
            btnSpeak.addEventListener('click', () => {
                this.voiceEngine.hablar(textoParaHablar);
            });
        }

        const btnCopy = messageEl.querySelector('.btn-copy');
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(markdownText).then(() => {
                    this.mostrarToast('✅ ¡Respuesta copiada al portapapeles!');
                    btnCopy.innerHTML = '✅ Copiado';
                    setTimeout(() => btnCopy.innerHTML = '📋 Copiar', 2000);
                });
            });
        }

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
     * MOTOR DE RESPUESTAS CON RED NEURONAL ARTIFICIAL (APSTI) + ENSEMBLE SEMÁNTICO
     */
    procesarRespuestaInteligente(rawQuery, neuralResult = null) {
        const q = this.normalizarTexto(rawQuery);
        const nr = neuralResult || this.neuralNet.predict(rawQuery);
        this.lastNeuralInference = nr;

        // 1. Detección de herramientas interactivas por Red Neuronal
        if (nr.intent === 'simulador_tupa' && nr.confidence >= 0.40) {
            this.abrirSimuladorTUPA(nr);
            return;
        }

        if (nr.intent === 'mapa_campus' && nr.confidence >= 0.40) {
            this.abrirMapaCampus(nr);
            return;
        }

        if (nr.intent === 'test_vocacional' && nr.confidence >= 0.45) {
            this.testEngine.iniciar();
            return;
        }

        // 2. Detección Ensamble (Red Neuronal + Reglas Semánticas)
        if (nr.intent === 'simulador_tupa' || q.includes('simular') || q.includes('calculadora') || q.includes('calcular matricula') || q.includes('cuanto pagare')) {
            this.abrirSimuladorTUPA(nr);
            return;
        }

        if (nr.intent === 'mapa_campus' || q.includes('mapa del campus') || q.includes('plano') || q.includes('croquis') || q.includes('donde estan los laboratorios') || q.includes('instalaciones')) {
            this.abrirMapaCampus(nr);
            return;
        }

        if (
            nr.intent === 'test_vocacional' ||
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

        // Boletas Electrónicas
        if (nr.intent === 'boletas_electronicas' || q.includes('boleta') || q.includes('comprobante') || q.includes('descargar boleta')) {
            this.responderBoletasElectronicas(nr);
            return;
        }

        // Pagos y Vouchers
        if (
            nr.intent === 'pagos_vouchers' ||
            q.includes('pago') || 
            q.includes('pagar') || 
            q.includes('voucher') || 
            q.includes('boucher') || 
            q.includes('banco de la nacion') || 
            q.includes('metodo de pago') ||
            q.includes('donde pago') ||
            q.includes('como pago')
        ) {
            this.responderMetodosDePago(nr);
            return;
        }

        // Matrícula y Costos
        if (
            nr.intent === 'matricula_costos' ||
            q.includes('matricula') || 
            q.includes('matricularme') || 
            q.includes('cuanto cuesta') || 
            q.includes('cuanto se paga') || 
            q.includes('mensualidad') || 
            q.includes('pension') || 
            q.includes('gratis') || 
            q.includes('costo')
        ) {
            this.responderMatriculaYCostos(nr);
            return;
        }

        // Admisión
        if (
            nr.intent === 'admision_examen' ||
            q.includes('admision') || 
            q.includes('examen') || 
            q.includes('postular') || 
            q.includes('ingreso') || 
            q.includes('pre tecno') || 
            q.includes('academia') || 
            q.includes('requisitos para entrar')
        ) {
            this.responderAdmision(nr);
            return;
        }

        // Carreras específicas
        if (nr.intent === 'carrera_apsti' || q.includes('apsti') || q.includes('sistema') || q.includes('sistemas') || q.includes('computacion') || q.includes('software') || q.includes('programacion') || q.includes('redes') || q.includes('ti')) {
            this.responderCarreraDetalle('apsti', nr);
            return;
        }

        if (nr.intent === 'carrera_ani' || q.includes('ani') || q.includes('negocio') || q.includes('negocios') || q.includes('internacional') || q.includes('aduanas') || q.includes('comercio exterior') || q.includes('exportacion') || q.includes('importacion')) {
            this.responderCarreraDetalle('ani', nr);
            return;
        }

        if (nr.intent === 'carrera_contabilidad' || q.includes('contabilidad') || q.includes('contador') || q.includes('tributo') || q.includes('tributos') || q.includes('sunat') || q.includes('finanza') || q.includes('finanzas')) {
            this.responderCarreraDetalle('contabilidad', nr);
            return;
        }

        if (nr.intent === 'carrera_dpa' || q.includes('dpa') || q.includes('pesca') || q.includes('pesquero') || q.includes('pesquera') || q.includes('acuicola') || q.includes('acuicultura') || q.includes('mar') || q.includes('embarcacion')) {
            this.responderCarreraDetalle('dpa', nr);
            return;
        }

        // Oferta global
        if (nr.intent === 'todas_carreras' || q.includes('carrera') || q.includes('carreras') || q.includes('programas') || q.includes('especialidades') || q.includes('que hay para estudiar') || q.includes('que ensenan')) {
            this.responderCarrerasGenerales(nr);
            return;
        }

        // Trámites
        if (nr.intent === 'mesa_partes_tramites' || q.includes('tramite') || q.includes('mesa de partes') || q.includes('constancia') || q.includes('certificado') || q.includes('record')) {
            this.responderTramites(nr);
            return;
        }

        // Convalidación
        if (nr.intent === 'convalidacion_sunedu' || q.includes('convalida') || q.includes('convalidar') || q.includes('universidad') || q.includes('bachiller') || q.includes('seguir estudiando')) {
            this.responderConvalidacionUniversitaria(nr);
            return;
        }

        // Duración
        if (nr.intent === 'duracion_semestres' || q.includes('cuanto dura') || q.includes('duracion') || q.includes('cuantos anos') || q.includes('tiempo de carrera') || q.includes('semestres')) {
            this.responderDuracion(nr);
            return;
        }

        // Título Oficial
        if (nr.intent === 'titulo_oficial' || q.includes('titulo') || q.includes('nombre de la nacion') || q.includes('grado') || q.includes('es oficial')) {
            this.responderTituloOficial(nr);
            return;
        }

        // Prácticas
        if (nr.intent === 'convenios_practicas' || q.includes('practica') || q.includes('practicas') || q.includes('convenio') || q.includes('convenios') || q.includes('bolsa de trabajo') || q.includes('bolsa laboral') || q.includes('donde trabajo')) {
            this.responderConveniosYPracticas(nr);
            return;
        }

        // Horarios
        if (nr.intent === 'turnos_horarios' || q.includes('turno') || q.includes('turnos') || q.includes('horario de clase') || q.includes('tarde') || q.includes('noche')) {
            this.responderTurnosYHorarios(nr);
            return;
        }

        // Edad
        if (nr.intent === 'edad_limite' || q.includes('limite de edad') || q.includes('edad maxima') || q.includes('edad para postular') || q.includes('soy mayor') || q.includes('tengo 30') || q.includes('tengo 40')) {
            this.responderEdadLimite(nr);
            return;
        }

        // Becas
        if (nr.intent === 'becas_beneficios' || q.includes('beca') || q.includes('becas') || q.includes('pronabec')) {
            this.responderBecas(nr);
            return;
        }

        // Contacto y Ubicación
        if (nr.intent === 'ubicacion_contacto' || q.includes('donde queda') || q.includes('ubicacion') || q.includes('direccion') || q.includes('telefono') || q.includes('celular') || q.includes('whatsapp') || q.includes('contacto')) {
            this.responderContactoYUbicacion(nr);
            return;
        }

        // Historia
        if (nr.intent === 'historia_institucion' || q.includes('historia') || q.includes('quienes fueron') || q.includes('carcamo') || q.includes('licenciamiento') || q.includes('barco') || q.includes('modernizacion')) {
            this.responderHistoriaEInstitucion(nr);
            return;
        }

        // Saludo
        if (nr.intent === 'saludo' || q.startsWith('hola') || q.includes('buenos dias') || q.includes('buenas tardes') || q.includes('buenas noches') || q.includes('saludos') || q === 'hola') {
            this.responderSaludo(nr);
            return;
        }

        // Agradecimiento
        if (nr.intent === 'agradecimiento' || q.includes('gracias') || q.includes('muchas gracias') || q.includes('te pasaste') || q.includes('excelente')) {
            this.responderAgradecimiento(nr);
            return;
        }

        // Respuesta general
        this.responderGenerico(rawQuery, nr);
    }

    responderMetodosDePago(nr = null) {
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
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderMatriculaYCostos(nr = null) {
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
        this.addBotMessage(respuesta, true, vozMatricula, nr);
    }

    responderAdmision(nr = null) {
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
        this.addBotMessage(respuesta, true, vozAdmision, nr);
    }

    responderCarrerasGenerales(nr = null) {
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
        this.addBotMessage(respuesta, true, vozCarreras, nr);
    }

    responderCarreraDetalle(carreraId, nr = null) {
        const c = this.kb.carreras.find(item => item.id === carreraId);
        if (!c) {
            this.responderCarrerasGenerales(nr);
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
        } else if (carreraId === 'pesquera' || carreraId === 'dpa') {
            voz = "La carrera de Desarrollo Pesquero dura 3 años. Contamos con nuestra propia embarcación con radar y visión nocturna para que realices prácticas reales en alta mar. ¿Te gustaría conocer el plan de estudios?";
        } else {
            voz = `La carrera de ${c.nombre} dura 3 años y otorga título profesional a Nombre de la Nación. ¿Deseas conocer los requisitos de matrícula?`;
        }
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderContactoYUbicacion(nr = null) {
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
        this.addBotMessage(respuesta, true, vozContacto, nr);
    }

    responderTramites(nr = null) {
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
        this.addBotMessage(respuesta, true, vozTramites, nr);
    }

    responderHistoriaEInstitucion(nr = null) {
        const i = this.kb.instituto;
        const respuesta = `🏛️ **HISTORIA Y LOGROS DEL IESTP "HERMANOS CÁRCAMO"**

${i.historia}

### 🌟 Pilares de Excelencia:
* **Creación Oficial:** Creado bajo ${i.creacion} y revalidado por ${i.revalidacion}.
* **Inversión Histórica de S/ 36 Millones:** Renovación integral de infraestructura con modernas aulas pedagógicas, talleres, laboratorios de ofimática, física, química y microbiología.
* **Embarcación Pesquera Propia:** Un hito educativo en el norte del Perú, equipada con sistemas de radar, visión nocturna y navegación GPS para que los estudiantes de Pesquera y Acuicultura aprendan en el mar con tecnología de primer nivel.
* **Compromiso Social:** Brindar educación superior tecnológica de calidad sin barreras económicas a toda la juventud de Paita, Piura y la región.`;

        const vozHistoria = "El instituto fue fundado en 1987 en honor a los heroicos hermanos Cárcamo de Paita. Actualmente contamos con una inversión de 36 millones en modernos laboratorios y una embarcación propia para prácticas en alta mar.";
        this.addBotMessage(respuesta, true, vozHistoria, nr);
    }

    responderBecas(nr = null) {
        const respuesta = `🎓 **BECAS Y BENEFICIOS PARA ESTUDIANTES**

En el IESTP "Hermanos Cárcamo" tienes acceso a múltiples beneficios económicos y académicos:

1. **Beca 18 (PRONABEC):** Si eres postulante o estudiante preseleccionado de Beca 18, puedes estudiar en nuestro instituto con todos los gastos de manutención, laptop y materiales cubiertos por el Estado Peruano.
2. **Beca por Excelencia Académica:** Exoneraciones y reconocimientos a los primeros puestos del examen de admisión y promedios destacados de cada ciclo.
3. **Carnet de Medio Pasaje:** Carnet oficial emitido por el MINEDU que te garantiza tarifa preferencial en transporte público.
4. **Bolsa Laboral y Prácticas:** Convenios con agencias marítimas, aduaneras, plantas pesqueras y agroindustrias de Paita y Piura para tu rápida inserción al mercado de trabajo.`;

        const vozBecas = "¡Sí! En nuestro instituto puedes estudiar con Beca 18 de Pronabec con todos los gastos cubiertos, además de becas por excelencia académica y carnet de medio pasaje.";
        this.addBotMessage(respuesta, true, vozBecas, nr);
    }

    responderDuracion(nr = null) {
        const respuesta = `⏳ **DURACIÓN Y ESTRUCTURA DE LAS CARRERAS**

En el **IESTP "Hermanos Cárcamo"**, todas las carreras profesionales técnicas tienen una duración oficial de:

* ⏱️ **3 Años Académicos** (distribuidos en **6 semestres** o ciclos lectivos).
* 📜 **Certificaciones Modulares Progresivas:** Cada año que apruebas con éxito, recibes una certificación oficial que te permite trabajar formalmente sin esperar a graduarte.
* 🎓 **Grado al finalizar:** Título Profesional Técnico a Nombre de la Nación.

¿Te gustaría conocer la malla curricular o el perfil de alguna carrera en específico?`;

        const voz = "Todas nuestras carreras técnicas duran 3 años divididos en 6 semestres. Además, al culminar cada año recibes una certificación modular oficial para incorporarte al trabajo de inmediato. ¿Deseas conocer alguna carrera?";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderConvalidacionUniversitaria(nr = null) {
        const respuesta = `🏛️ **CONVALIDACIÓN CON UNIVERSIDADES**

¡Sí, totalmente! De acuerdo con la **Ley de Institutos y Escuelas de Educación Superior (Ley N° 30512)**:

* 🎓 **Convalidación Oficial:** Los egresados titulados de institutos superiores públicos pueden convalidar sus créditos y asignaturas aprobadas en universidades públicas y privadas licenciadas por la **SUNEDU**.
* 🚀 **Beneficio:** Te permite obtener tu Grado de Bachiller Universitario y Título Profesional Universitario (como Ingeniero o Licenciado) en menor tiempo (habitualmente 2 a 3 años adicionales).
* 💼 **Ventaja Competitiva:** Ya ingresarás a la universidad con experiencia práctica y trabajando como profesional técnico calificado.`;

        const voz = "¡Sí, totalmente! Gracias a la Ley de Educación Superior, puedes convalidar tus estudios técnicos con universidades públicas y privadas licenciadas por SUNEDU para obtener tu ingeniería o licenciatura en menor tiempo.";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderTituloOficial(nr = null) {
        const respuesta = `🎖️ **VALOR OFICIAL DEL TÍTULO PROFESIONAL**

Al culminar satisfactoriamente tus 3 años (6 ciclos) y aprobar tu proceso de titulación en el IESTP "Hermanos Cárcamo":

* 🇵🇪 **Título a Nombre de la Nación:** Emitido con el respaldo oficial del **Ministerio de Educación (MINEDU)**.
* 🌐 **Reconocimiento Nacional e Internacional:** Válido para postular a plazas laborales del Estado (régimen CAS, 276, 728), ascensos en las Fuerzas Armadas y Policía Nacional, y empresas privadas en todo el Perú.
* 📋 **Inscripción en el Registro Nacional de Grados y Títulos:** Tu título queda registrado de forma pública y oficial.`;

        const voz = "Al culminar tus 3 años y sustentar tu proyecto obtienes el Título Profesional Técnico a Nombre de la Nación con valor oficial del Ministerio de Educación en todo el Perú.";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderTurnosYHorarios(nr = null) {
        const respuesta = `⏰ **HORARIOS DE CLASES Y TURNOS**

* ☀️ **Turno de Clases:** Turno diurno regular.
* 🏫 **Ambientes Pedagógicos:** Clases teóricas y sesiones prácticas intensivas en talleres y laboratorios especializados (computación, redes, microbiología, navegación marítima).
* 🏢 **Horario de Atención Administrativa:** Lunes a Viernes de 8:00 AM a 3:00 PM en nuestro campus de Paita.

¿Deseas saber más sobre las inscripciones o el examen de admisión?`;

        const voz = "Nuestras clases se imparten en turno diurno regular, con modernas aulas y talleres tecnológicos. Atendemos de lunes a viernes de 8 de la mañana a 3 de la tarde.";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderEdadLimite(nr = null) {
        const respuesta = `🎂 **¿HAY LÍMITE DE EDAD PARA POSTULAR?**

¡**NO HAY LÍMITE DE EDAD**! La educación superior tecnológica pública en el Perú está abierta para todos:

* ✅ Pueden postular jóvenes recién egresados de 5° de secundaria.
* ✅ Pueden postular adultos, trabajadores o emprendedores que deseen formalizar sus conocimientos técnicos y obtener un título oficial a Nombre de la Nación.
* 📑 **Único requisito fundamental:** Haber concluido satisfactoriamente la educación secundaria (EBR o EBA) con certificados de estudios.`;

        const voz = "¡No hay ningún límite de edad! Cualquier persona que haya terminado la secundaria puede postular y estudiar cualquiera de nuestras 4 carreras profesionales técnicas.";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderConveniosYPracticas(nr = null) {
        const respuesta = `🤝 **CONVENIOS DE PRÁCTICAS Y EMPLEABILIDAD**

El IESTP "Hermanos Cárcamo" cuenta con una sólida alianza con el sector productivo de Paita y Piura:

* 🚢 **Sector Portuario y Marítimo:** Convenios con agencias aduaneras, navieras y terminales portuarios de Paita para estudiantes de APSTI y Negocios Internacionales.
* 🐟 **Sector Pesquero e Industrial:** Prácticas en empresas pesqueras, congeladoras y acuícolas, además de prácticas reales en la embarcación propia del instituto.
* 💼 **Sector Comercial y Financiero:** Bancos, cooperativas y estudios contables para estudiantes de Contabilidad.
* 🌐 **Bolsa Laboral Activa:** [bolsa-laboral.ieshercar.edu.pe](https://bolsa-laboral.ieshercar.edu.pe/)`;

        const voz = "Contamos con convenios institucionales con empresas del puerto de Paita, agencias aduaneras y plantas pesqueras para que realices prácticas preprofesionales desde tus primeros ciclos.";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderBoletasElectronicas(nr = null) {
        const respuesta = `🧾 **CONSULTA Y DESCARGA DE BOLETAS ELECTRÓNICAS**

Una vez que has registrado tu voucher bancario en la plataforma de pagos institucional, puedes consultar y descargar tu comprobante de pago oficial:

### 🔗 Enlace Directo al Sistema de Boletas:
👉 [sistema.ieshercar.com/Consulta_Boletas/index.php](https://sistema.ieshercar.com/Consulta_Boletas/index.php)

### 📋 Pasos para Descargar:
1. Digita tu **número de DNI** en el recuadro de consulta.
2. Presiona en **"Buscar Comprobantes"**.
3. El sistema listará tus boletas validadas con fecha, concepto y monto.
4. Haz clic en **"Descargar PDF"** para imprimir tu comprobante oficial con valor tributario.

*Nota:* La validación administrativa en el sistema toma habitualmente de 24 a 48 horas hábiles tras registrar el voucher.`;

        const voz = "Puedes consultar y descargar tu boleta electrónica oficial ingresando tu DNI en sistema.ieshercar.com. ¡Es totalmente digital y seguro!";
        this.addBotMessage(respuesta, true, voz, nr);
    }

    responderSaludo(nr = null) {
        const respuesta = `¡Hola! Qué gusto saludarte. 😊 Soy **HercarIA**, la orientadora virtual del **Instituto Hermanos Cárcamo de Paita**.

Estoy lista para ayudarte con:
* 🎓 **Test Vocacional Interactivo** (si tienes dudas sobre qué estudiar).
* 💻 Información de la carrera de **APSTI** (Sistemas, Desarrollo Web y Cloud).
* 💼 Nuestras otras carreras: **Negocios Internacionales**, **Contabilidad** y **Desarrollo Pesquero**.
* 📝 **Matrículas, requisitos y costos** (¡educación pública gratuita!).
* 💳 **Registro de pagos y vouchers** en [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/).
* 🧮 **Simulador de Matrícula y Cuotas TUPA 2026**.
* 🗺️ **Mapa interactivo del campus e instalaciones**.

¿Qué tema te gustaría consultar hoy?`;

        const vozSaludo = "¡Hola! Qué gusto saludarte. Soy HercarIA, tu orientadora virtual del Instituto Hermanos Cárcamo de Paita. ¿Qué te gustaría consultar hoy?";
        this.addBotMessage(respuesta, true, vozSaludo, nr);
    }

    responderAgradecimiento(nr = null) {
        const respuesta = `🤝 **¡HA SIDO UN PLACER AYUDARTE!**

En el **IESTP "Hermanos Cárcamo"** nos alegra orientarte en tu camino hacia una carrera técnica profesional de excelencia.

Recuerda que estoy disponible las **24 horas del día** para resolver cualquier duda sobre admisiones, convalidaciones universitarias, gratuidad y trámites. ¡Muchos éxitos en tus metas académicas! 🌟`;

        const vozAgradece = "¡De nada! Ha sido un placer orientarte. Recuerda que estoy disponible las 24 horas para resolver tus dudas. ¡Muchos éxitos!";
        this.addBotMessage(respuesta, true, vozAgradece, nr);
    }

    responderGenerico(query, nr = null) {
        const respuesta = `Comprendo tu consulta sobre *"**${this.escapeHTML(query)}**"*. 

Como orientadora oficial del **IESTP Hermanos Cárcamo de Paita**, puedo guiarte con exactitud en cualquiera de estos temas:

* 🎓 **¿Aún no sabes qué carrera elegir?** 👉 Puedes realizar nuestro **Test Vocacional Interactivo**.
* 💻 **Carreras Técnicas de 3 años:** APSTI (Sistemas/Software), Negocios Internacionales, Contabilidad o Desarrollo Pesquero y Acuícola.
* 📝 **Matrícula y Admisión:** Requisitos para cachimbos, exonerados y fechas.
* 💳 **Pagos y Vouchers:** Depósitos en Banco de la Nación y validación en [pagos.ieshercar.edu.pe](https://pagos.ieshercar.edu.pe/).
* 🧮 **Simulador TUPA:** Calcula el costo de matrícula o constancias.
* 🗺️ **Mapa del Campus:** Explora nuestros laboratorios de cómputo y talleres.
* 📞 **Contacto directo:** Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita o al **+51 969 100 257**.

¿Te gustaría que te detalle alguna carrera o iniciamos el test vocacional?`;

        const vozGenerica = "Puedo orientarte sobre nuestras 4 carreras técnicas de 3 años, requisitos de matrícula gratuita, registro de pagos en el Banco de la Nación o iniciar tu test vocacional. ¿En qué tema te gustaría que te ayude?";
        this.addBotMessage(respuesta, true, vozGenerica, nr);
    }

    /* ==========================================================================
       HERRAMIENTAS INTERACTIVAS Y MODALES (APSTI)
       ========================================================================== */

    getFollowUpSuggestions(intent) {
        switch (intent) {
            case 'carrera_apsti':
                return [
                    { text: 'Malla Curricular de APSTI', query: '¿Cuál es la malla curricular y cursos de APSTI?', icon: '📖' },
                    { text: 'Costos y Matrícula', query: '¿Cuánto cuesta la matrícula y cuáles son los requisitos?', icon: '📝' },
                    { text: 'Laboratorios en el Mapa', query: 'Ver mapa interactivo del campus e instalaciones', icon: '🗺️' },
                    { text: 'Test Vocacional', query: 'Iniciar test vocacional', icon: '🎯' }
                ];
            case 'carrera_ani':
                return [
                    { text: 'Campo Laboral en Puerto Paita', query: '¿Cuál es el campo laboral de Negocios Internacionales en Paita?', icon: '🚢' },
                    { text: 'Requisitos de Matrícula', query: '¿Cuáles son los requisitos de matrícula?', icon: '📝' },
                    { text: 'Simulador TUPA', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' }
                ];
            case 'carrera_contabilidad':
                return [
                    { text: 'Módulos y Certificaciones', query: '¿Qué se aprende en la carrera de Contabilidad?', icon: '📊' },
                    { text: 'Convalidación SUNEDU', query: '¿Se puede convalidar con universidades licenciadas por SUNEDU?', icon: '🎓' },
                    { text: 'Simulador de Matrícula', query: 'Abrir el simulador de matrícula', icon: '🧮' }
                ];
            case 'carrera_dpa':
                return [
                    { text: 'Prácticas en Barco Propio', query: 'Cuéntame sobre la embarcación pesquera y prácticas de DPA', icon: '🐟' },
                    { text: 'Convenios con Pesqueras', query: '¿Qué convenios tiene el instituto con empresas pesqueras?', icon: '🤝' },
                    { text: 'Requisitos de Admisión', query: '¿Cuándo es el examen de admisión y requisitos?', icon: '📝' }
                ];
            case 'matricula_costos':
                return [
                    { text: 'Abrir Simulador TUPA', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' },
                    { text: '¿Cómo registro mi Voucher?', query: '¿Cómo registro mi voucher en pagos.ieshercar.edu.pe?', icon: '💳' },
                    { text: 'Descargar Boleta Oficial', query: '¿Cómo descargo mi boleta electrónica oficial?', icon: '🧾' }
                ];
            case 'pagos_vouchers':
            case 'boletas_electronicas':
                return [
                    { text: 'Descargar Boleta Electrónica', query: '¿Cómo descargo mi boleta electrónica oficial?', icon: '🧾' },
                    { text: 'Mesa de Partes Virtual', query: '¿Cómo ingreso a la Mesa de Partes Virtual?', icon: '📁' },
                    { text: 'Simulador de Cuotas', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' }
                ];
            case 'convalidacion_sunedu':
            case 'titulo_oficial':
                return [
                    { text: 'Carrera de APSTI', query: 'Cuéntame sobre la carrera de APSTI', icon: '💻' },
                    { text: 'Duración y Semestres', query: '¿Cuánto tiempo duran las carreras técnicas?', icon: '⏳' },
                    { text: 'Trámites en Mesa de Partes', query: '¿Cómo tramito una constancia de estudios o título?', icon: '📁' }
                ];
            case 'ubicacion_contacto':
            case 'turnos_horarios':
                return [
                    { text: 'Ver Mapa del Campus', query: 'Ver mapa interactivo del campus e instalaciones', icon: '🗺️' },
                    { text: 'Simulador de Matrícula', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' },
                    { text: 'Las 4 Carreras Técnicas', query: 'Cuéntame sobre todas las carreras técnicas', icon: '🎓' }
                ];
            default:
                return [
                    { text: 'Las 4 Carreras Técnicas', query: 'Cuéntame sobre todas las carreras técnicas que ofrece el instituto', icon: '💻' },
                    { text: 'Test Vocacional Interactivo', query: 'Iniciar test vocacional', icon: '🎯' },
                    { text: 'Simulador TUPA 2026', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' }
                ];
        }
    }

    /**
     * VISOR / INSPECTOR DE RED NEURONAL ARTIFICIAL APSTI
     */
    abrirInspectorNeuronal(queryCustom = '') {
        const modal = document.getElementById('modal-neural-inspector');
        if (!modal) return;

        let inference = this.lastNeuralInference;
        if (queryCustom && queryCustom.trim()) {
            inference = this.neuralNet.predict(queryCustom);
        } else if (!inference) {
            inference = this.neuralNet.predict("¿Qué carreras ofrece el instituto?");
        }

        const metricIntent = document.getElementById('neural-metric-intent');
        const metricConf = document.getElementById('neural-metric-confidence');
        const metricLat = document.getElementById('neural-metric-latency');
        const metricWeights = document.getElementById('neural-metric-weights');

        if (metricIntent) metricIntent.textContent = (inference.label || inference.intent).split('(')[0].trim();
        if (metricConf) metricConf.textContent = inference.confidencePercent;
        if (metricLat) metricLat.textContent = inference.latencyMs + ' ms';
        if (metricWeights) {
            const stats = this.neuralNet.getNetworkMetrics();
            metricWeights.textContent = stats.totalSynapticWeights.toLocaleString();
        }

        const probContainer = document.getElementById('neural-prob-bars');
        if (probContainer && inference.topK) {
            probContainer.innerHTML = inference.topK.map(item => `
                <div class="prob-bar-item">
                    <div class="prob-bar-header">
                        <span>${item.label}</span>
                        <span class="prob-bar-pct">${(item.prob * 100).toFixed(1)}%</span>
                    </div>
                    <div class="prob-bar-track">
                        <div class="prob-bar-fill" style="width: ${Math.max(item.prob * 100, 6)}%"></div>
                    </div>
                </div>
            `).join('');
        }

        const tokensContainer = document.getElementById('neural-tokens-cloud');
        if (tokensContainer) {
            if (inference.tokens && inference.tokens.length > 0) {
                tokensContainer.innerHTML = inference.tokens.map(t => `<span class="token-badge">🏷️ ${t}</span>`).join('');
            } else {
                tokensContainer.innerHTML = `<span class="token-empty">Clasificación por sesgo general (sin coincidencia léxica directa)</span>`;
            }
        }

        modal.style.display = 'flex';
    }

    /**
     * SIMULADOR DE MATRÍCULA Y TASAS TUPA
     */
    initSimuladorData() {
        this.simuladorItems = {
            cachimbo: [
                { id: 'c_mat', name: 'Derecho de Matrícula (Ingresante Cachimbo Sem. I)', price: 180, checked: true, req: true },
                { id: 'c_car', name: 'Carnet de Medio Pasaje Oficial (MINEDU)', price: 15, checked: true, req: false },
                { id: 'c_pro', name: 'Carpeta y Prospecto de Admisión', price: 30, checked: true, req: false },
                { id: 'c_seg', name: 'Seguro Estudiantil contra Accidentes', price: 20, checked: false, req: false }
            ],
            regular: [
                { id: 'r_mat', name: 'Derecho de Matrícula Semestral (Sem. II - VI)', price: 150, checked: true, req: true },
                { id: 'r_car', name: 'Renovación de Carnet de Estudiante MINEDU', price: 15, checked: true, req: false },
                { id: 'r_seg', name: 'Seguro Estudiantil contra Accidentes', price: 20, checked: false, req: false }
            ],
            tramites: [
                { id: 't_con', name: 'Constancia de Estudios Oficial', price: 25, checked: true, req: false },
                { id: 't_rec', name: 'Récord de Notas Académico Completo', price: 30, checked: false, req: false },
                { id: 't_egr', name: 'Certificado de Egresado Oficial', price: 45, checked: false, req: false },
                { id: 't_mod', name: 'Certificado Modular Progresivo (por Año)', price: 40, checked: false, req: false },
                { id: 't_tit', name: 'Derecho de Titulación Profesional Técnico', price: 160, checked: false, req: false }
            ]
        };
        this.perfilSimuladorActual = 'cachimbo';
    }

    abrirSimuladorTUPA(nr = null) {
        const modal = document.getElementById('modal-simulador-tupa');
        if (!modal) return;
        this.renderizarItemsSimulador();
        modal.style.display = 'flex';

        if (nr) {
            this.addBotMessage(
                `🧮 **SIMULADOR DE MATRÍCULA Y TASAS TUPA 2026**\n\nHe desplegado en pantalla el simulador oficial de pagos. Puedes seleccionar tu perfil (Cachimbo, Regular o Trámites) y activar conceptos para calcular el importe exacto a depositar en el Banco de la Nación.\n\n*Recuerda:* La enseñanza es **100% gratuita** (S/ 0.00 mensualidades).`,
                true,
                "He abierto en pantalla el simulador interactivo de matrícula y tasas TUPA. Puedes calcular el monto exacto para tu inscripción en el Banco de la Nación.",
                nr
            );
        }
    }

    cambiarPerfilSimulador(perfil) {
        this.perfilSimuladorActual = perfil;
        document.querySelectorAll('.sim-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.profile === perfil);
        });
        this.renderizarItemsSimulador();
    }

    renderizarItemsSimulador() {
        const container = document.getElementById('simulador-items-list');
        if (!container) return;

        const items = this.simuladorItems[this.perfilSimuladorActual] || [];
        container.innerHTML = items.map((it, idx) => `
            <div class="sim-item-row" onclick="window.hercarApp.toggleItemSimulador('${it.id}')">
                <div class="sim-item-left">
                    <input type="checkbox" class="sim-checkbox" id="chk_${it.id}" ${it.checked ? 'checked' : ''} onclick="event.stopPropagation(); window.hercarApp.toggleItemSimulador('${it.id}')">
                    <span class="sim-item-title">${it.name} ${it.req ? '<em style="color:#d97706; font-size:11px;">(Obligatorio)</em>' : ''}</span>
                </div>
                <div class="sim-item-price">S/ ${it.price.toFixed(2)}</div>
            </div>
        `).join('');

        this.calcularSimuladorTotal();
    }

    toggleItemSimulador(itemId) {
        const items = this.simuladorItems[this.perfilSimuladorActual] || [];
        const item = items.find(i => i.id === itemId);
        if (item) {
            item.checked = !item.checked;
            this.renderizarItemsSimulador();
        }
    }

    calcularSimuladorTotal() {
        const items = this.simuladorItems[this.perfilSimuladorActual] || [];
        const total = items.reduce((sum, i) => i.checked ? sum + i.price : sum, 0);
        const totalEl = document.getElementById('simulador-total-val');
        if (totalEl) totalEl.textContent = `S/ ${total.toFixed(2)}`;
        return total;
    }

    copiarResumenSimulador() {
        const items = this.simuladorItems[this.perfilSimuladorActual] || [];
        const checked = items.filter(i => i.checked);
        const total = this.calcularSimuladorTotal();
        let text = `📋 RESUMEN DE TASAS TUPA - IESTP HERMANOS CÁRCAMO (PAITA)\nPerfil: ${this.perfilSimuladorActual.toUpperCase()}\n------------------------------------\n`;
        checked.forEach(c => {
            text += `• ${c.name}: S/ ${c.price.toFixed(2)}\n`;
        });
        text += `------------------------------------\nTOTAL A PAGAR (BANCO DE LA NACIÓN): S/ ${total.toFixed(2)}\n*Enseñanza 100% gratuita (S/ 0.00 mensualidades)`;
        navigator.clipboard.writeText(text).then(() => {
            this.mostrarToast('✅ Resumen de simulación copiado al portapapeles');
        });
    }

    consultarSobreSimulacion() {
        this.cerrarTodosLosModales();
        const total = this.calcularSimuladorTotal();
        this.enviarConsultaDirecta(`Calculé en el simulador un total de S/ ${total.toFixed(2)} para ${this.perfilSimuladorActual}. ¿Cómo realizo el pago y qué requisitos presento?`);
    }

    /**
     * MAPA INTERACTIVO DEL CAMPUS
     */
    abrirMapaCampus(nr = null) {
        const modal = document.getElementById('modal-mapa-campus');
        if (!modal) return;
        modal.style.display = 'flex';
        this.seleccionarHotspotMapa('apsti');

        if (nr) {
            this.addBotMessage(
                `🗺️ **MAPA INTERACTIVO DEL CAMPUS E INSTALACIONES**\n\nAquí tienes el plano de distribución del **IESTP "Hermanos Cárcamo"** en Paita (Av. Miguel Grau – Urb. El Parque).\n\nEn pantalla puedes hacer clic en cada pabellón para conocer los laboratorios de cómputo de APSTI, el taller pesquero de DPA, las aulas multimedia de ANI y Contabilidad, o la Dirección y Mesa de Partes.`,
                true,
                "He desplegado el mapa interactivo del campus. Puedes explorar cada pabellón y laboratorio del instituto directamente en pantalla.",
                nr
            );
        }
    }

    seleccionarHotspotMapa(sectorId) {
        const titleEl = document.getElementById('sector-title');
        const descEl = document.getElementById('sector-description');
        if (!titleEl || !descEl) return;

        document.querySelectorAll('.map-sector').forEach(s => s.classList.remove('active'));
        const target = document.querySelector(`.sector-${sectorId}`);
        if (target) target.classList.add('active');

        const data = {
            apsti: {
                title: '💻 Pabellón A: Arquitectura de Plataformas y Servicios TI (APSTI)',
                desc: 'Alberga 4 modernos laboratorios de cómputo con conectividad de alta velocidad, gabinetes de servidores rack Linux/Windows, centro de telecomunicaciones con routers y switches CISCO para prácticas de redes, y estaciones para desarrollo de software web y móvil.'
            },
            dpa: {
                title: '🐟 Módulo Marítimo: Desarrollo Pesquero y Acuícola (DPA)',
                desc: 'Comprende el taller de artes y aparejos de pesca, laboratorio de maricultura y acuicultura con tanques de ensayo, maquetas de maniobras náuticas y acceso al programa de prácticas a bordo de la embarcación pesquera de instrucción del instituto.'
            },
            ani: {
                title: '🚢 Pabellón B: Administración de Negocios Internacionales y Contabilidad',
                desc: 'Aulas con tecnología multimedia para simulación de operaciones de comercio exterior, despacho aduanero portuario y laboratorios contables equipados con software tributario y de libros electrónicos SUNAT.'
            },
            admin: {
                title: '🏛️ Edificio Administrativo: Dirección y Mesa de Partes',
                desc: 'Oficinas de Dirección General, Jefatura de Unidad Académica, Secretaría Académica, Ventanilla de Caja y Mesa de Partes para recepción y trámite presencial de documentos y certificados.'
            },
            biblio: {
                title: '📚 Biblioteca Central y Auditorio Institucional',
                desc: 'Amplia sala de lectura con terminales de acceso a la Biblioteca Virtual (biblioteca.ieshercar.edu.pe), bibliografía técnica especializada de las 4 carreras y auditorio climatizado para conferencias y ponencias académicas.'
            },
            deportes: {
                title: '⚽ Complejo Polideportivo y Áreas de Recreación',
                desc: 'Losa deportiva multiusos acondicionada para fútbol, básquetbol y vóleibol, rodeada de áreas de esparcimiento e integración comunitaria para la vida universitaria saludable.'
            }
        };

        const sec = data[sectorId] || data['apsti'];
        titleEl.textContent = sec.title;
        descEl.textContent = sec.desc;
    }

    cerrarTodosLosModales() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    }

    mostrarToast(mensaje, duracion = 2500) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = mensaje;
        toast.classList.add('show');
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, duracion);
    }

    calificarRespuesta(btn, tipo) {
        const parent = btn.closest('.msg-rating-group');
        if (parent) {
            parent.querySelectorAll('.msg-action-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
        if (tipo === 'up') {
            this.mostrarToast('👍 ¡Gracias por tu valoración positiva!');
        } else {
            this.mostrarToast('🙏 Tomaremos en cuenta tu feedback para seguir mejorando.');
        }
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
