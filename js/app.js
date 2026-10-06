/**
 * CONTROLADOR PRINCIPAL DEL CHATBOT "HERCARIA"
 * I.E.S.T.P. "HERMANOS CÁRCAMO" - PAITA, PIURA, PERÚ
 */

const DEFAULT_HERCAR_SYSTEM_PROMPT = `Eres "HercarIA", la asistente virtual y orientadora oficial del Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo" (IESTP Hermanos Cárcamo), ubicado en Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura, Perú.

TU IDENTIDAD Y MISIÓN:
- Brindas orientación académica, administrativa y vocacional con un trato cálido, empático, formal, profesional y sumamente claro.
- Eres embajadora de la excelencia educativa técnica y de la carrera profesional de "Arquitectura de Plataformas y Servicios de Tecnologías de la Información" (APSTI).
- Cuando menciones la sigla APSTI, escríbela siempre como APSTI o explica que es la carrera de Arquitectura de Plataformas y Servicios de Tecnologías de la Información.

INFORMACIÓN INSTITUCIONAL CLAVE:
1. Carreras Profesionales Técnicas (3 años, 6 semestres, Título a Nombre de la Nación):
   - APSTI (Arquitectura de Plataformas y Servicios de Tecnologías de la Información): Desarrollo web y móvil, bases de datos SQL/NoSQL, redes Cisco, infraestructura cloud (AWS/Azure), ciberseguridad, servidores Linux/Windows.
   - ANI (Administración de Negocios Internacionales): Comercio exterior, aduanas marítimas en el Puerto de Paita, logística internacional, finanzas.
   - Contabilidad: Gestión contable, tributación SUNAT, planillas, auditoría financiera, libros electrónicos.
   - DPA (Desarrollo Pesquero y Acuícola): Acuicultura de concha de abanico, navegación marítima, procesamiento pesquero en plantas de Paita.
2. Costos y Matrícula:
   - Admisión: S/ 150.00 (Examen Ordinario) o S/ 200.00 (Pre-Tecnológico con ingreso directo).
   - Matrícula Regular: S/ 100.00 por semestre. En el IESTP Cárcamo ¡NO SE PAGA MENSUALIDADES NI PENSIONES! La educación técnica es 100% pública y gratuita.
3. Plataformas Oficiales:
   - Portal Web Institucional: https://ieshercar.edu.pe/
   - Plataforma de Pagos y Vouchers: https://pagos.ieshercar.edu.pe/
   - Mesa de Partes Virtual: https://sistema.ieshercar.edu.pe/registro-tramite/
   - Biblioteca Virtual: https://biblioteca.ieshercar.edu.pe/login.php
   - Consulta de Boletas: https://sistema.ieshercar.com/Consulta_Boletas/index.php
   - Cuenta Corriente Banco de la Nación: N° 00-631-018241 (o tributo por ventanilla).
4. Directrices de Respuesta:
   - Utiliza formato Markdown limpio con viñetas claras y negritas en datos clave.
   - Si el usuario pregunta por costos, trámites, cursos de APSTI u otra carrera, sé precisa con montos y requisitos.
   - Mantén siempre una actitud colaborativa, educada y motivadora para los jóvenes y postulantes de Paita y Piura.`;

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

        // Inicializar Sistema de Administración Multi-API v6.0
        this.initAdminSystem();
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
        this.setupAdminEventListeners();
        this.setupVoiceFeedback();
        this.renderizarHistorialSidebar();
        this.actualizarBadgeAdminSidebar();
        
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

    async enviarConsultaDirecta(query) {
        if (!query || !query.trim()) return;

        const trimmed = query.trim();
        // Comando especial para abrir el Panel de Administración de IA
        if (trimmed.toLowerCase() === '/admin' || trimmed.toLowerCase() === '/panel' || trimmed.toLowerCase() === 'admin') {
            this.abrirPanelAdmin();
            return;
        }

        this.agregarAHistorialReciente(query);
        this.activarAreaChat();
        this.addUserMessage(query);
        this.mostrarTypingIndicator();

        // 🧠 Inferencia en Tiempo Real de la Red Neuronal (APSTI)
        const neuralResult = this.neuralNet.predict(query);
        this.lastNeuralInference = neuralResult;
        console.log('[Inferencia Red Neuronal]:', neuralResult);

        if (neuralResult && neuralResult.confidence < 0.40) {
            this.registrarConsultaSinResponder(query, neuralResult);
        }

        // Actualizar indicador de cabecera en tiempo real
        const headerIndicator = document.getElementById('header-neural-indicator');
        if (headerIndicator) {
            const textEl = headerIndicator.querySelector('.neural-header-text');
            if (textEl) {
                textEl.textContent = `Red Neuronal: ${neuralResult.confidencePercent}`;
            }
        }

        // 1. Verificación en Base de Conocimiento Personalizada (Custom KB)
        const customMatch = this.buscarEnCustomKB(query);
        if (customMatch) {
            setTimeout(() => {
                this.removerTypingIndicator();
                this.registrarMetricaConsulta('local', query, neuralResult.intent);
                this.addBotMessage(customMatch.answer, true, '', {
                    intent: 'custom_kb',
                    confidence: 1.0,
                    confidencePercent: '100% (KB Personalizada)',
                    tokens: []
                });
            }, 400);
            return;
        }

        // 2. Determinar si se consulta Cloud API o Red Neuronal Local
        const mode = this.adminConfig ? (this.adminConfig.mode || 'hybrid') : 'hybrid';
        const hasKey = Boolean(this.adminConfig && this.adminConfig.apiKey && this.adminConfig.apiKey.trim().length > 5);

        if ((mode === 'cloud' || mode === 'hybrid') && hasKey) {
            try {
                const cloudReply = await this.consultarCloudAPI(query);
                this.removerTypingIndicator();
                this.registrarMetricaConsulta('cloud', query, neuralResult.intent);

                const cloudInference = {
                    intent: `cloud_${this.adminConfig.provider}`,
                    confidence: 0.99,
                    confidencePercent: `99% (${this.adminConfig.provider.toUpperCase()} - ${this.adminConfig.model})`,
                    tokens: []
                };

                this.addBotMessage(cloudReply, true, '', cloudInference);
                return;
            } catch (err) {
                console.warn('[Cloud API Fallback]: Error en API externa:', err);
                this.registrarFalloAuditoria(query, this.adminConfig.provider, err.message);

                if (mode === 'cloud') {
                    this.removerTypingIndicator();
                    const errMsg = `⚠️ **Error de Conexión Cloud (${this.adminConfig.provider.toUpperCase()})**:\n\n\`${err.message}\`\n\n💡 *Solución:* Verifica tu API Key en el [Panel Admin](#) o cambia al **Modo Híbrido** o **Modo Local APSTI** para continuar respondiendo con la Red Neuronal del navegador.`;
                    this.addBotMessage(errMsg, false, 'Error de conexión con la API Cloud. Revisa tu API key en el panel de administración.');
                    return;
                }

                // Si está en Modo Híbrido, continúa sin problemas hacia la Red Neuronal Local
                this.mostrarToast(`⚡ Fallback activo: Conexión externa no disponible. Respondiendo con Red Neuronal APSTI...`, 3200);
            }
        }

        // 3. Modo Local: Red Neuronal Multicapa APSTI + Base de Conocimiento Oficial
        setTimeout(() => {
            this.removerTypingIndicator();
            this.registrarMetricaConsulta('local', query, neuralResult.intent);
            this.procesarRespuestaInteligente(query, neuralResult);
        }, 500);
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

        let engineTagHtml = '';
        if (inference.intent && inference.intent.startsWith('cloud_')) {
            engineTagHtml = `<span class="engine-badge-tag tag-cloud" title="Respuesta procesada mediante Cloud LLM">⚡ Cloud API</span>`;
        } else if (inference.intent === 'custom_kb') {
            engineTagHtml = `<span class="engine-badge-tag tag-kb" title="Respuesta obtenida de la Base Oficial Institucional">📚 Base Oficial</span>`;
        } else {
            engineTagHtml = `<span class="engine-badge-tag tag-neural" title="Clasificado por Red Neuronal Artificial MLP APSTI (${confPct})">🧠 Red Neuronal MLP (${confPct})</span>`;
        }

        messageEl.innerHTML = `
            <div class="bot-avatar">
                <img src="assets/logo-hercar.png" alt="HercarIA" onerror="this.src='assets/logo-iestp.png'">
            </div>
            <div class="message-bubble bot-bubble">
                <div class="bot-header-meta">
                    <span class="bot-name">HercarIA</span>
                    <span class="bot-badge-tag">Orientadora Oficial</span>
                    ${engineTagHtml}
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
                    <button type="button" class="msg-action-btn btn-inspect-neural" title="Inspeccionar vector matemático TF-IDF y pesos de la Red Neuronal APSTI" onclick="window.hercarApp.abrirInspectorNeuronal('${previewQuery}')">
                        🧠 Vector IA
                    </button>
                    <button type="button" class="msg-action-btn btn-speak" title="Escuchar respuesta en voz dulce">
                        🔊 Escuchar
                    </button>
                    <button type="button" class="msg-action-btn btn-copy" title="Copiar texto de respuesta">
                        📋 Copiar
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
                    <div class="history-item-left">
                        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 13px; height: 13px; flex-shrink: 0; opacity: 0.7;">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>${this.escapeHTML(q)}</span>
                    </div>
                    <button type="button" class="btn-delete-single-history" title="Borrar esta consulta del historial">✕</button>
                `;

                const leftEl = item.querySelector('.history-item-left');
                if (leftEl) {
                    leftEl.addEventListener('click', () => {
                        this.cerrarSidebarMovilSiAplica();
                        this.enviarConsultaDirecta(q);
                    });
                }

                const btnDel = item.querySelector('.btn-delete-single-history');
                if (btnDel) {
                    btnDel.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.eliminarConsultaHistorial(q);
                    });
                }

                historyList.appendChild(item);
            });
        } catch (e) {}
    }

    eliminarConsultaHistorial(query) {
        try {
            let queries = JSON.parse(localStorage.getItem('hercar_recent_queries') || '[]');
            queries = queries.filter(item => item !== query);
            localStorage.setItem('hercar_recent_queries', JSON.stringify(queries));
            this.renderizarHistorialSidebar();
            this.mostrarToast('🗑️ Consulta eliminada del historial');
        } catch (e) {}
    }

    vaciarHistorialReciente() {
        if (!confirm('¿Deseas vaciar todo el historial de consultas recientes?')) return;
        localStorage.removeItem('hercar_recent_queries');
        const historySection = document.getElementById('sidebar-history-section');
        if (historySection) historySection.style.display = 'none';
        this.mostrarToast('🗑️ Historial de consultas vaciado');
    }

    registrarConsultaSinResponder(query, neuralResult = null) {
        if (!query || query.trim().length < 3) return;
        try {
            let unanswered = JSON.parse(localStorage.getItem('hercar_unanswered_queries') || '[]');
            const trimmed = query.trim();
            const exists = unanswered.some(u => u.query.toLowerCase() === trimmed.toLowerCase());
            if (!exists) {
                unanswered.unshift({
                    id: 'unans_' + Date.now(),
                    query: trimmed,
                    confidence: neuralResult ? neuralResult.confidencePercent : 'Baja',
                    intent: neuralResult ? neuralResult.intent : 'desconocido',
                    timestamp: new Date().toLocaleDateString('es-PE') + ' ' + new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
                    answered: false
                });
                if (unanswered.length > 60) unanswered = unanswered.slice(0, 60);
                localStorage.setItem('hercar_unanswered_queries', JSON.stringify(unanswered));
            }
        } catch (e) {}
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

        // 0. Comando para inspección de red neuronal (solicitado por evaluadores)
        if (q === '/inspector' || q === '/red' || q === '/neuronal' || q === '/redneuronal' || q === '/ia') {
            this.abrirInspectorNeuronal();
            return;
        }

        // Malla Curricular y Cursos ciclo por ciclo
        if (nr.intent === 'malla_curricular' || q.includes('malla') || q.includes('plan de estudio') || q.includes('cursos') || q.includes('materias') || q.includes('asignaturas')) {
            let carreraSel = 'apsti';
            if (q.includes('ani') || q.includes('negocio') || q.includes('aduan') || q.includes('comercio')) carreraSel = 'ani';
            else if (q.includes('conta') || q.includes('tribut') || q.includes('finanz')) carreraSel = 'contabilidad';
            else if (q.includes('pesqu') || q.includes('dpa') || q.includes('mar') || q.includes('acuicol')) carreraSel = 'dpa';
            this.responderMallaCurricular(carreraSel, nr);
            return;
        }

        // Temario de Examen de Admisión
        if (nr.intent === 'temario_admision' || q.includes('temario') || (q.includes('que viene') && q.includes('examen')) || q.includes('como es el examen')) {
            this.responderTemarioAdmision(nr);
            return;
        }

        // Titulación y Prácticas EFSRT
        if (nr.intent === 'titulacion_efsrt' || q.includes('titul') || q.includes('como me titulo') || q.includes('efsrt') || q.includes('proyecto de titulacion')) {
            this.responderTitulacionEFSRT(nr);
            return;
        }

        // Carnet de Medio Pasaje
        if (nr.intent === 'carnet_pasaje' || q.includes('carnet') || q.includes('medio pasaje') || q.includes('pasaje')) {
            this.responderCarnetPasaje(nr);
            return;
        }

        // Rutas y Cómo Llegar
        if (nr.intent === 'como_llegar_transporte' || q.includes('como llego') || q.includes('transporte') || q.includes('combi') || q.includes('paradero') || q.includes('desde piura') || q.includes('desde sullana')) {
            this.responderComoLlegar(nr);
            return;
        }

        // SIGA Web y Notas
        if (nr.intent === 'plataforma_siga' || q.includes('siga') || q.includes('aula virtual') || q.includes('intranet') || q.includes('ver mis notas') || q.includes('asistencia')) {
            this.responderPlataformaSIGA(nr);
            return;
        }

        // Biblioteca Virtual
        if (nr.intent === 'biblioteca_virtual' || q.includes('biblioteca') || q.includes('libros')) {
            this.responderBibliotecaVirtual(nr);
            return;
        }

        // Quién te creó / Autoría
        if (nr.intent === 'quien_te_creo' || q.includes('quien te creo') || q.includes('quien te desarrollo') || q.includes('creador') || q.includes('quien eres') || q.includes('autor')) {
            this.responderQuienTeCreo(nr);
            return;
        }

        // Conceptos técnicos de carreras
        if (nr.intent === 'conceptos_tecnologia' || q.includes('que es programacion') || q.includes('que es cloud') || q.includes('que es nube') || q.includes('que es reefer') || q.includes('que es incoterm') || q.includes('que es sire') || q.includes('que es haccp')) {
            this.responderConceptosTecnicos(rawQuery, nr);
            return;
        }

        // Búsqueda en Conocimiento Enciclopédico
        const respEnciclopedia = INSTITUCIONAL_KB.buscarEnConocimiento(rawQuery);
        if (respEnciclopedia) {
            this.addBotMessage(respEnciclopedia, true, '', nr);
            return;
        }

        // Respuesta general / Fallback
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

    responderMallaCurricular(carreraId, nr = null) {
        const malla = INSTITUCIONAL_KB.formatearMallaCarrera(carreraId);
        if (malla) {
            this.addBotMessage(malla, true, `Aquí tienes la malla curricular completa de los seis ciclos para la carrera.`, nr);
        } else {
            this.responderCarrerasGenerales(nr);
        }
    }

    responderTemarioAdmision(nr = null) {
        const temario = INSTITUCIONAL_KB.buscarEnConocimiento('temario de examen de admision');
        this.addBotMessage(temario, true, "El examen de admisión incluye razonamiento matemático, comprensión lectora, cultura general y ciencias. ¡Prepárate con confianza!", nr);
    }

    responderTitulacionEFSRT(nr = null) {
        const tit = INSTITUCIONAL_KB.buscarEnConocimiento('requisitos para titularme efsrt');
        this.addBotMessage(tit, true, "Para titularte a Nombre de la Nación debes culminar los seis ciclos, acreditar tus prácticas preprofesionales y sustentar un proyecto de innovación.", nr);
    }

    responderBeca18(nr = null) {
        const beca = INSTITUCIONAL_KB.buscarEnConocimiento('beca 18 pronabec');
        this.addBotMessage(beca, true, "El instituto Hermanos Cárcamo es público y elegible para Beca 18 de PRONABEC. Incluye laptop gratuita y subvención económica completa.", nr);
    }

    responderCarnetPasaje(nr = null) {
        const carnet = INSTITUCIONAL_KB.buscarEnConocimiento('carnet de medio pasaje');
        this.addBotMessage(carnet, true, "El carnet oficial del Ministerio de Educación te otorga el 50% de descuento en el pasaje de transporte público.", nr);
    }

    responderComoLlegar(nr = null) {
        const llegar = INSTITUCIONAL_KB.buscarEnConocimiento('como llego al instituto transporte');
        this.addBotMessage(llegar, true, "El instituto queda en Avenida Miguel Grau, Urbanización El Parque, en Paita Alta. Puedes llegar en combis directas desde Piura, Sullana o el puerto.", nr);
    }

    responderPlataformaSIGA(nr = null) {
        const siga = INSTITUCIONAL_KB.buscarEnConocimiento('sistema siga notas y asistencia');
        this.addBotMessage(siga, true, "Puedes ingresar al sistema SIGA en siga.ieshercar.edu.pe con tu DNI para revisar tus notas y asistencias.", nr);
    }

    responderBibliotecaVirtual(nr = null) {
        const respuesta = `📚 **BIBLIOTECA VIRTUAL INSTITUCIONAL**\n\nEl IESTP "Hermanos Cárcamo" cuenta con acceso a plataformas de lectura e investigación digital con más de 15,000 libros y manuales técnicos:\n\n* 🔗 **Biblioteca Virtual Oficial:** [https://biblioteca.ieshercar.edu.pe/login.php](https://biblioteca.ieshercar.edu.pe/login.php)\n* 📖 **Biblioteca Latina DREP Piura:** [https://iestphercar.bibliotecalatina.com/login](https://iestphercar.bibliotecalatina.com/login)\n\n### 💡 Colecciones disponibles:\n* Manuales de Redes Cisco, Programación y Servidores Cloud.\n* Libros de Operatividad Aduanera y Comercio Exterior.\n* Tratados de Contabilidad Financiera y Tributación SUNAT.\n* Guías de Cultivo Acuícola y Sanidad Pesquera.`;
        this.addBotMessage(respuesta, true, "Puedes ingresar a la biblioteca virtual oficial para acceder a miles de libros técnicos y manuales de tu carrera.", nr);
    }

    responderQuienTeCreo(nr = null) {
        const respuesta = `🤖 **SOBRE MÍ Y MI DESARROLLO**\n\nSoy **HercarIA**, el asistente virtual inteligente y orientador vocacional oficial del **IESTP "Hermanos Cárcamo" de Paita**.\n\n### 💻 Autor y Desarrollador:\n* **Estudiante:** **Gerson Misael Pintado Huamán (GMPH2007)**\n* **Carrera:** Arquitectura de Plataformas y Servicios de Tecnologías de la Información (**APSTI**)\n* **Sede:** Paita, Piura, Perú 🇵🇪\n\n### 🚀 Tecnología:\nCuento con una Red Neuronal Artificial en JavaScript puro con ejecución en tu navegador, síntesis de voz femenina dulce humanizada, cálculo de cuotas TUPA y mapa del campus. ¡Mi meta es ayudarte a alcanzar tus sueños profesionales técnicos!`;
        this.addBotMessage(respuesta, true, "Fui desarrollada por Gerson Misael Pintado Huamán de la carrera de APSTI del instituto Hermanos Cárcamo. ¡Estoy aquí para orientarte en todo lo que necesites!", nr);
    }

    responderConceptosTecnicos(query, nr = null) {
        const q = query.toLowerCase();
        let r = '';
        if (q.includes('programacion') || q.includes('lenguajes')) {
            r = `💻 **¿QUÉ ES PROGRAMACIÓN Y QUÉ LENGUAJES ENSEÑAN EN APSTI?**\n\nProgramar es escribir instrucciones lógicas para que una computadora resuelva problemas o cree aplicaciones de forma automática.\n\nEn la carrera técnica de **APSTI** aprenderás:\n* 🐍 **Python:** Para lógica, backend y machine learning.\n* 🌐 **JavaScript & TypeScript:** Para desarrollo web frontend moderno y móvil.\n* 🐘 **PHP y Java:** Para sistemas empresariales y bases de datos.\n* 🗄️ **SQL y MongoDB:** Para almacenamiento y consulta de datos.\n* ☁️ **Servidores Cloud:** Despliegue en AWS, Azure y contenedores Docker.`;
        } else if (q.includes('cloud') || q.includes('nube')) {
            r = `☁️ **¿QUÉ ES LA COMPUTACIÓN EN LA NUBE (CLOUD)?**\n\nEs la tecnología que permite utilizar servidores, almacenamiento de datos, redes y software a través de internet en lugar de comprar equipos físicos costosos.\n\nEn **APSTI** aprenderás a desplegar servicios en **AWS** y **Microsoft Azure**, configurar contenedores con **Docker** y garantizar que los sistemas de agencias marítimas y aduaneras funcionen las 24 horas del día sin interrupciones.`;
        } else if (q.includes('reefer') || q.includes('contenedor')) {
            r = `🧊 **¿QUÉ ES UN CONTENEDOR REEFER (NEGOCIOS INTERNACIONALES)?**\n\nUn contenedor Reefer es una unidad de carga marítima refrigerada con motor autónomo que mantiene productos perecibles a temperaturas bajo cero (hasta -25°C).\n\nEn el puerto de Paita son fundamentales para exportar pota congelada, perico, conchas de abanico, uvas y mangos orgánicos hacia Estados Unidos, Europa y Asia manteniendo intacta la cadena de frío.`;
        } else if (q.includes('incoterm')) {
            r = `🌐 **¿QUÉ SON LOS INCOTERMS EN COMERCIO EXTERIOR?**\n\nSon términos comerciales internacionales regulados por la Cámara de Comercio Internacional (CCI) como **FOB** (Free on Board) o **CIF** (Cost, Insurance and Freight).\n\nDefinen claramente quién asume el pago del flete, seguro y la responsabilidad sobre las mercancías en el trayecto desde el puerto de Paita hasta el puerto de destino.`;
        } else if (q.includes('sire')) {
            r = `📊 **¿QUÉ ES EL SIRE EN CONTABILIDAD?**\n\nEs el **Sistema Integrado de Registros Electrónicos** de la **SUNAT**.\n\nPermite a las empresas generar automáticamente sus registros de compras y ventas electrónicos a partir de los comprobantes de pago emitidos, facilitando la declaración tributaria mensual del IGV y reduciendo errores contables.`;
        } else {
            r = `🔬 **INNOVACIÓN Y TECNOLOGÍA EN EL IESTP HERMANOS CÁRCAMO**\n\nNuestras 4 carreras integran tecnologías modernas de vanguardia:\n* **APSTI:** Inteligencia Artificial, Cloud Computing y Ciberseguridad.\n* **ANI:** Logística portuaria digital y trazabilidad de comercio exterior.\n* **Contabilidad:** Facturación electrónica, SIRE y análisis financiero computarizado.\n* **DPA:** Biotecnología marina, maricultura y navegación con radares satelitales.`;
        }
        this.addBotMessage(r, true, "Aquí tienes la explicación detallada sobre este concepto técnico y cómo se aplica en la carrera.", nr);
    }

    responderGenerico(query, nr = null) {
        // Registrar en consultas sin responder para que el administrador la vea en el panel admin.html y pueda responderla
        this.registrarConsultaSinResponder(query, nr);

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
            case 'malla_curricular':
                return [
                    { text: 'Malla de APSTI', query: '¿Cuál es la malla curricular y cursos de APSTI?', icon: '💻' },
                    { text: 'Malla de Negocios (ANI)', query: '¿Cuál es la malla curricular de Negocios Internacionales?', icon: '🚢' },
                    { text: 'Malla de Contabilidad', query: '¿Cuál es la malla curricular de Contabilidad?', icon: '📊' },
                    { text: 'Malla de Pesquería (DPA)', query: '¿Cuál es la malla curricular de Desarrollo Pesquero?', icon: '🐟' }
                ];
            case 'temario_admision':
            case 'admision_examen':
                return [
                    { text: 'Temario del Examen', query: '¿Cuál es el temario del examen de admisión?', icon: '📝' },
                    { text: 'Requisitos de Admisión', query: '¿Cuáles son los requisitos para inscribirse al examen?', icon: '📋' },
                    { text: 'Simulador de Matrícula', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' }
                ];
            case 'titulacion_efsrt':
                return [
                    { text: 'Prácticas EFSRT', query: '¿Cómo se acreditan las prácticas preprofesionales EFSRT?', icon: '🤝' },
                    { text: 'Convalidación SUNEDU', query: '¿Se puede convalidar con universidades licenciadas por SUNEDU?', icon: '🎓' },
                    { text: 'Mesa de Partes Virtual', query: '¿Cómo ingreso a la Mesa de Partes Virtual?', icon: '📁' }
                ];
            case 'becas_beneficios':
                return [
                    { text: 'Requisitos de Beca 18', query: '¿Cuáles son los requisitos para postular a Beca 18?', icon: '🎓' },
                    { text: 'Carreras Elegibles', query: 'Cuéntame sobre todas las carreras técnicas', icon: '💻' },
                    { text: 'Examen de Admisión', query: '¿Cuándo es el examen de admisión y requisitos?', icon: '📝' }
                ];
            case 'como_llegar_transporte':
            case 'ubicacion_contacto':
            case 'turnos_horarios':
                return [
                    { text: 'Ver Mapa del Campus', query: 'Ver mapa interactivo del campus e instalaciones', icon: '🗺️' },
                    { text: 'Horarios de Clase', query: '¿Cuáles son los horarios y turnos de clase?', icon: '⏰' },
                    { text: 'Medio Pasaje MINEDU', query: '¿Cómo tramito mi carnet de medio pasaje?', icon: '🚌' }
                ];
            case 'carnet_pasaje':
                return [
                    { text: '¿Cómo llegar en combi?', query: '¿Cómo llego al instituto desde Piura o Sullana?', icon: '📍' },
                    { text: 'Simulador TUPA', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' },
                    { text: 'Mesa de Partes', query: '¿Cómo tramito una constancia de estudios?', icon: '📁' }
                ];
            case 'plataforma_siga':
            case 'biblioteca_virtual':
                return [
                    { text: 'Biblioteca Virtual', query: '¿Cómo ingreso a la biblioteca virtual oficial?', icon: '📚' },
                    { text: 'Sistema SIGA', query: '¿Cómo entro al sistema SIGA para ver mis notas?', icon: '💻' },
                    { text: 'Boletas Electrónicas', query: '¿Cómo descargo mi boleta electrónica oficial?', icon: '🧾' }
                ];
            default:
                return [
                    { text: 'Las 4 Carreras Técnicas', query: 'Cuéntame sobre todas las carreras técnicas que ofrece el instituto', icon: '💻' },
                    { text: 'Malla Curricular', query: '¿Cuáles son los cursos y materias de cada ciclo?', icon: '📖' },
                    { text: 'Test Vocacional', query: 'Iniciar test vocacional', icon: '🎯' },
                    { text: 'Simulador TUPA', query: 'Abrir el simulador de matrícula y tasas TUPA', icon: '🧮' }
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
            if (this.metrics) {
                this.metrics.upvotes = (this.metrics.upvotes || 0) + 1;
                this.guardarMetricas();
            }
        } else {
            this.mostrarToast('🙏 Tomaremos en cuenta tu feedback para seguir mejorando.');
            if (this.metrics) {
                this.metrics.downvotes = (this.metrics.downvotes || 0) + 1;
                this.guardarMetricas();
            }
            // Registrar la última consulta del usuario para revisión en admin.html
            const lastUserMsg = [...this.history].reverse().find(m => m.sender === 'user');
            if (lastUserMsg && lastUserMsg.text) {
                this.registrarConsultaSinResponder(lastUserMsg.text, { confidencePercent: 'Feedback 👎', intent: 'consulta_a_mejorar' });
            }
        }
        this.actualizarDashboardMetricas();
    }

    // =========================================================================
    // MÓDULO: PANEL DE ADMINISTRACIÓN Y CONFIGURACIÓN MULTI-API (APSTI v6.0)
    // =========================================================================

    initAdminSystem() {
        this.DEFAULT_SYSTEM_PROMPT = DEFAULT_HERCAR_SYSTEM_PROMPT;

        try {
            const savedConfig = localStorage.getItem('hercar_admin_config');
            this.adminConfig = savedConfig ? JSON.parse(savedConfig) : {
                mode: 'hybrid',
                provider: 'gemini',
                model: 'gemini-1.5-flash',
                apiKey: '',
                temperature: 0.7,
                maxTokens: 800,
                systemPrompt: this.DEFAULT_SYSTEM_PROMPT
            };
        } catch (e) {
            this.adminConfig = {
                mode: 'hybrid',
                provider: 'gemini',
                model: 'gemini-1.5-flash',
                apiKey: '',
                temperature: 0.7,
                maxTokens: 800,
                systemPrompt: this.DEFAULT_SYSTEM_PROMPT
            };
        }

        try {
            const savedMetrics = localStorage.getItem('hercar_admin_metrics');
            this.metrics = savedMetrics ? JSON.parse(savedMetrics) : {
                totalQueries: 0,
                cloudQueries: 0,
                localQueries: 0,
                upvotes: 0,
                downvotes: 0,
                categoryCounts: { apsti: 0, ani: 0, conta: 0, dpa: 0, general: 0 },
                auditLog: []
            };
        } catch (e) {
            this.metrics = {
                totalQueries: 0,
                cloudQueries: 0,
                localQueries: 0,
                upvotes: 0,
                downvotes: 0,
                categoryCounts: { apsti: 0, ani: 0, conta: 0, dpa: 0, general: 0 },
                auditLog: []
            };
        }

        try {
            const savedCustomKb = localStorage.getItem('hercar_custom_kb');
            this.customKb = savedCustomKb ? JSON.parse(savedCustomKb) : [];
        } catch (e) {
            this.customKb = [];
        }
    }

    setupAdminEventListeners() {
        const btnOpenAdmin = document.getElementById('btn-open-admin-panel');
        if (btnOpenAdmin) {
            btnOpenAdmin.addEventListener('click', () => {
                this.cerrarSidebarMovilSiAplica();
                this.abrirPanelAdmin();
            });
        }

        // Navegación por pestañas del modal Admin
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.cambiarPestanaAdmin(targetTab);
            });
        });

        // Cambio de Modo Operativo (Radio buttons)
        document.querySelectorAll('input[name="hercar_ai_mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.adminConfig.mode = e.target.value;
                this.guardarConfiguracionAdminSilenciosa();
                this.actualizarPillsModo();
                this.actualizarBadgeAdminSidebar();
            });
        });

        // Cambio de Proveedor de API
        const providerSelect = document.getElementById('admin-api-provider');
        if (providerSelect) {
            providerSelect.addEventListener('change', (e) => {
                const prov = e.target.value;
                this.adminConfig.provider = prov;
                this.actualizarModelosPorProveedor(prov);
                this.actualizarPlaceholdersPorProveedor(prov);
            });
        }

        // Cambio de Modelo
        const modelSelect = document.getElementById('admin-api-model');
        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                this.adminConfig.model = e.target.value;
            });
        }

        // Ver / Ocultar API Key
        const btnToggleKey = document.getElementById('btn-toggle-key-visibility');
        const inputKey = document.getElementById('admin-api-key');
        if (btnToggleKey && inputKey) {
            btnToggleKey.addEventListener('click', () => {
                if (inputKey.type === 'password') {
                    inputKey.type = 'text';
                    btnToggleKey.textContent = '🙈';
                } else {
                    inputKey.type = 'password';
                    btnToggleKey.textContent = '👁️';
                }
            });
        }

        // Slider de Temperatura
        const tempSlider = document.getElementById('admin-temperature');
        const tempLabel = document.getElementById('temp-val-label');
        if (tempSlider && tempLabel) {
            tempSlider.addEventListener('input', (e) => {
                tempLabel.textContent = e.target.value;
            });
        }

        // Probar Conexión en Vivo
        const btnTest = document.getElementById('btn-test-connection');
        if (btnTest) {
            btnTest.addEventListener('click', () => {
                this.probarConexionAPI();
            });
        }

        // Guardar Configuración API
        const btnSave = document.getElementById('btn-save-api-config');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                this.guardarConfiguracionAPI();
            });
        }

        // Limpiar / Borrar API Key
        const btnClear = document.getElementById('btn-clear-api-config');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                this.limpiarConfiguracionAPI();
            });
        }

        // Añadir Pregunta Personalizada a Custom KB
        const btnAddCustom = document.getElementById('btn-add-custom-kb');
        if (btnAddCustom) {
            btnAddCustom.addEventListener('click', () => {
                this.agregarItemCustomKB();
            });
        }

        // Guardar System Prompt
        const btnSavePrompt = document.getElementById('btn-save-system-prompt');
        if (btnSavePrompt) {
            btnSavePrompt.addEventListener('click', () => {
                this.guardarSystemPrompt();
            });
        }

        // Restablecer System Prompt
        const btnResetPrompt = document.getElementById('btn-reset-system-prompt');
        if (btnResetPrompt) {
            btnResetPrompt.addEventListener('click', () => {
                this.restablecerSystemPrompt();
            });
        }

        // Exportar Auditoría JSON
        const btnExportAudit = document.getElementById('btn-export-audit-log');
        if (btnExportAudit) {
            btnExportAudit.addEventListener('click', () => {
                this.exportarRegistroAuditoria();
            });
        }
    }

    abrirPanelAdmin(tabName = 'tab-api-config') {
        const modal = document.getElementById('modal-admin-panel');
        if (!modal) return;

        // Cargar valores actuales en controles
        const modeRadio = document.querySelector(`input[name="hercar_ai_mode"][value="${this.adminConfig.mode}"]`);
        if (modeRadio) modeRadio.checked = true;

        const providerSelect = document.getElementById('admin-api-provider');
        if (providerSelect) providerSelect.value = this.adminConfig.provider;

        this.actualizarModelosPorProveedor(this.adminConfig.provider);

        const modelSelect = document.getElementById('admin-api-model');
        if (modelSelect && this.adminConfig.model) modelSelect.value = this.adminConfig.model;

        const keyInput = document.getElementById('admin-api-key');
        if (keyInput) keyInput.value = this.adminConfig.apiKey || '';

        const tempSlider = document.getElementById('admin-temperature');
        const tempLabel = document.getElementById('temp-val-label');
        if (tempSlider) tempSlider.value = this.adminConfig.temperature || 0.7;
        if (tempLabel) tempLabel.textContent = this.adminConfig.temperature || '0.7';

        const maxTokensSelect = document.getElementById('admin-max-tokens');
        if (maxTokensSelect) maxTokensSelect.value = this.adminConfig.maxTokens || 800;

        const promptText = document.getElementById('admin-system-prompt-text');
        if (promptText) promptText.value = this.adminConfig.systemPrompt || this.DEFAULT_SYSTEM_PROMPT;

        this.actualizarPlaceholdersPorProveedor(this.adminConfig.provider);
        this.actualizarPillsModo();
        this.actualizarDashboardMetricas();
        this.renderizarListaCustomKB();

        const badgeTest = document.getElementById('connection-result-badge');
        if (badgeTest) badgeTest.style.display = 'none';

        this.cambiarPestanaAdmin(tabName);
        modal.style.display = 'flex';
    }

    cambiarPestanaAdmin(tabId) {
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.admin-tab-content').forEach(tab => {
            if (tab.id === tabId) {
                tab.style.display = 'block';
                tab.classList.add('active');
            } else {
                tab.style.display = 'none';
                tab.classList.remove('active');
            }
        });
    }

    actualizarModelosPorProveedor(provider) {
        const modelSelect = document.getElementById('admin-api-model');
        if (!modelSelect) return;

        const modelsMap = {
            gemini: [
                { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash (Rápido y Gratuito - Recomendado)' },
                { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro (Máxima Capacidad de Razonamiento)' },
                { id: 'gemini-2.0-flash', name: 'gemini-2.0-flash (Última Generación)' }
            ],
            openai: [
                { id: 'gpt-4o-mini', name: 'gpt-4o-mini (Económico y Veloz)' },
                { id: 'gpt-4o', name: 'gpt-4o (Máximo Rendimiento OpenAI)' },
                { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo (Clásico)' }
            ],
            groq: [
                { id: 'llama-3.1-8b-instant', name: 'llama-3.1-8b-instant (Inferencia Instantánea)' },
                { id: 'llama-3.3-70b-versatile', name: 'llama-3.3-70b-versatile (Alta Precisión)' },
                { id: 'mixtral-8x7b-32768', name: 'mixtral-8x7b-32768 (Gran Contexto)' }
            ],
            openrouter: [
                { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'meta-llama/llama-3.1-8b (Gratuito)' },
                { id: 'google/gemini-flash-1.5', name: 'google/gemini-flash-1.5' },
                { id: 'mistralai/mistral-7b-instruct', name: 'mistralai/mistral-7b-instruct' }
            ],
            deepseek: [
                { id: 'deepseek-chat', name: 'deepseek-chat (V3 - Muy Económico)' },
                { id: 'deepseek-reasoner', name: 'deepseek-reasoner (R1 - Razonamiento Puro)' }
            ]
        };

        const list = modelsMap[provider] || modelsMap.gemini;
        modelSelect.innerHTML = list.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

        if (this.adminConfig && this.adminConfig.model) {
            const exists = list.some(m => m.id === this.adminConfig.model);
            if (exists) {
                modelSelect.value = this.adminConfig.model;
            } else {
                this.adminConfig.model = list[0].id;
                modelSelect.value = list[0].id;
            }
        }
    }

    actualizarPlaceholdersPorProveedor(prov) {
        const inputKey = document.getElementById('admin-api-key');
        if (!inputKey) return;
        if (prov === 'gemini') {
            inputKey.placeholder = 'Clave Google AI Studio (ej: AIzaSy...)';
        } else if (prov === 'openai') {
            inputKey.placeholder = 'Clave OpenAI (ej: sk-proj-...)';
        } else if (prov === 'groq') {
            inputKey.placeholder = 'Clave Groq Console (ej: gsk_...)';
        } else if (prov === 'openrouter') {
            inputKey.placeholder = 'Clave OpenRouter (ej: sk-or-v1-...)';
        } else if (prov === 'deepseek') {
            inputKey.placeholder = 'Clave DeepSeek (ej: sk-...)';
        }
    }

    actualizarPillsModo() {
        const mode = this.adminConfig.mode || 'hybrid';
        const pill = document.getElementById('admin-mode-status-pill');
        const footerInfo = document.getElementById('admin-footer-status-text');

        const modeNames = {
            hybrid: '⚡ Modo Híbrido Inteligente',
            cloud: '☁️ Modo Cloud Exclusivo',
            local: '🧠 Red Neuronal Local APSTI'
        };

        if (pill) {
            pill.textContent = mode === 'hybrid' ? 'Híbrido' : (mode === 'cloud' ? 'Cloud' : 'Local APSTI');
            pill.style.background = mode === 'hybrid' ? 'rgba(37, 99, 235, 0.15)' : (mode === 'cloud' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(147, 51, 234, 0.15)');
            pill.style.color = mode === 'hybrid' ? '#2563eb' : (mode === 'cloud' ? '#059669' : '#7c3aed');
        }

        if (footerInfo) {
            footerInfo.textContent = `Modo: ${modeNames[mode] || mode} • Proveedor: ${(this.adminConfig.provider || 'gemini').toUpperCase()} (${this.adminConfig.model || 'Local'})`;
        }
    }

    actualizarBadgeAdminSidebar() {
        const badge = document.getElementById('admin-status-badge');
        if (!badge) return;

        const mode = this.adminConfig.mode || 'hybrid';
        const hasKey = Boolean(this.adminConfig.apiKey && this.adminConfig.apiKey.trim().length > 5);

        if (mode === 'local' || (!hasKey && mode === 'hybrid')) {
            badge.textContent = 'LOCAL 🧠';
            badge.style.background = 'rgba(147, 51, 234, 0.2)';
            badge.style.color = '#a855f7';
        } else if (mode === 'cloud') {
            badge.textContent = 'CLOUD ☁️';
            badge.style.background = 'rgba(16, 185, 129, 0.2)';
            badge.style.color = '#10b981';
        } else {
            badge.textContent = 'API ✨';
            badge.style.background = 'rgba(59, 130, 246, 0.2)';
            badge.style.color = '#3b82f6';
        }
    }

    async probarConexionAPI() {
        const btnTest = document.getElementById('btn-test-connection');
        const badge = document.getElementById('connection-result-badge');
        const keyInput = document.getElementById('admin-api-key');
        const providerSelect = document.getElementById('admin-api-provider');
        const modelSelect = document.getElementById('admin-api-model');

        const key = (keyInput ? keyInput.value : (this.adminConfig.apiKey || '')).trim();
        const provider = providerSelect ? providerSelect.value : (this.adminConfig.provider || 'gemini');
        const model = modelSelect ? modelSelect.value : (this.adminConfig.model || 'gemini-1.5-flash');

        if (!key) {
            if (badge) {
                badge.style.display = 'block';
                badge.className = 'connection-result-badge error';
                badge.textContent = '⚠️ Ingresa una API Key antes de probar la conexión.';
            }
            return;
        }

        if (btnTest) {
            btnTest.disabled = true;
            btnTest.innerHTML = '<span>⏳ Verificando conexión en vivo...</span>';
        }
        if (badge) {
            badge.style.display = 'block';
            badge.className = 'connection-result-badge';
            badge.style.background = 'rgba(59, 130, 246, 0.15)';
            badge.style.color = '#2563eb';
            badge.textContent = 'Enviando petición de prueba al servidor...';
        }

        const tStart = performance.now();
        try {
            if (provider === 'gemini') {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: 'Hola, responde "Conexión exitosa".' }] }],
                        generationConfig: { maxOutputTokens: 25 }
                    })
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message || `HTTP ${res.status} ${res.statusText}`);
                }
            } else {
                let endpoint = 'https://api.openai.com/v1/chat/completions';
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                };
                if (provider === 'groq') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
                else if (provider === 'openrouter') {
                    endpoint = 'https://openrouter.ai/api/v1/chat/completions';
                    headers['HTTP-Referer'] = window.location.origin || 'https://gmph2007.github.io/HercarBOT/';
                } else if (provider === 'deepseek') {
                    endpoint = 'https://api.deepseek.com/chat/completions';
                }

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: 'user', content: 'Ping' }],
                        max_tokens: 15
                    })
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message || `HTTP ${res.status} ${res.statusText}`);
                }
            }

            const latency = Math.round(performance.now() - tStart);
            if (badge) {
                badge.style.display = 'block';
                badge.className = 'connection-result-badge success';
                badge.textContent = `✅ ¡Conexión Exitosa con ${provider.toUpperCase()}! (Latencia: ${latency} ms)`;
            }
            this.mostrarToast(`✅ Conexión con ${provider.toUpperCase()} exitosa (${latency}ms)`);
        } catch (e) {
            if (badge) {
                badge.style.display = 'block';
                badge.className = 'connection-result-badge error';
                badge.textContent = `❌ Error: ${e.message}`;
            }
            this.mostrarToast(`❌ Error al conectar con ${provider}: ${e.message}`, 4000);
        } finally {
            if (btnTest) {
                btnTest.disabled = false;
                btnTest.innerHTML = '<span>⚡ Probar Conexión con la API</span>';
            }
        }
    }

    guardarConfiguracionAPI() {
        const keyInput = document.getElementById('admin-api-key');
        const providerSelect = document.getElementById('admin-api-provider');
        const modelSelect = document.getElementById('admin-api-model');
        const tempSlider = document.getElementById('admin-temperature');
        const maxTokensSelect = document.getElementById('admin-max-tokens');
        const modeRadio = document.querySelector('input[name="hercar_ai_mode"]:checked');

        this.adminConfig.apiKey = keyInput ? keyInput.value.trim() : '';
        this.adminConfig.provider = providerSelect ? providerSelect.value : 'gemini';
        this.adminConfig.model = modelSelect ? modelSelect.value : 'gemini-1.5-flash';
        this.adminConfig.temperature = tempSlider ? parseFloat(tempSlider.value) : 0.7;
        this.adminConfig.maxTokens = maxTokensSelect ? parseInt(maxTokensSelect.value) : 800;
        if (modeRadio) this.adminConfig.mode = modeRadio.value;

        this.guardarConfiguracionAdminSilenciosa();
        this.actualizarPillsModo();
        this.actualizarBadgeAdminSidebar();
        this.mostrarToast('✅ ¡Configuración y API Key guardadas exitosamente!');
    }

    limpiarConfiguracionAPI() {
        if (!confirm('¿Deseas eliminar la API Key configurada? El chatbot volverá al modo Red Neuronal Local APSTI.')) {
            return;
        }
        this.adminConfig.apiKey = '';
        const keyInput = document.getElementById('admin-api-key');
        if (keyInput) keyInput.value = '';

        const badgeTest = document.getElementById('connection-result-badge');
        if (badgeTest) badgeTest.style.display = 'none';

        this.guardarConfiguracionAdminSilenciosa();
        this.actualizarPillsModo();
        this.actualizarBadgeAdminSidebar();
        this.mostrarToast('🗑️ API Key eliminada. Modo Red Neuronal Local activo.');
    }

    guardarConfiguracionAdminSilenciosa() {
        try {
            localStorage.setItem('hercar_admin_config', JSON.stringify(this.adminConfig));
        } catch (e) {}
    }

    async consultarCloudAPI(query) {
        const provider = this.adminConfig.provider || 'gemini';
        const apiKey = (this.adminConfig.apiKey || '').trim();
        const model = this.adminConfig.model || 'gemini-1.5-flash';
        const temperature = parseFloat(this.adminConfig.temperature) || 0.7;
        const maxTokens = parseInt(this.adminConfig.maxTokens) || 800;
        const systemPrompt = this.adminConfig.systemPrompt || this.DEFAULT_SYSTEM_PROMPT;

        if (!apiKey) {
            throw new Error('No hay API Key configurada.');
        }

        // Contexto de los últimos 6 mensajes
        const recentHistory = (this.history || [])
            .filter(m => m.sender === 'user' || m.sender === 'bot')
            .slice(-6);

        if (provider === 'gemini') {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

            // Alternancia estricta de roles para Gemini
            const contents = [];
            let lastRole = null;
            for (const msg of recentHistory) {
                const r = msg.sender === 'user' ? 'user' : 'model';
                if (r !== lastRole) {
                    contents.push({ role: r, parts: [{ text: msg.text }] });
                    lastRole = r;
                }
            }
            if (lastRole === 'user') {
                contents.push({ role: 'model', parts: [{ text: 'Entendido. Estoy lista para responder tu consulta.' }] });
            }
            contents.push({ role: 'user', parts: [{ text: query }] });

            const bodyData = {
                contents: contents,
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: maxTokens
                }
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                const errMsg = errData.error?.message || `HTTP ${res.status} ${res.statusText}`;
                throw new Error(errMsg);
            }

            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) {
                throw new Error('Gemini no devolvió texto de respuesta.');
            }
            return text;
        } else {
            // OpenAI, Groq, OpenRouter, DeepSeek
            let endpoint = 'https://api.openai.com/v1/chat/completions';
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };

            if (provider === 'groq') {
                endpoint = 'https://api.groq.com/openai/v1/chat/completions';
            } else if (provider === 'openrouter') {
                endpoint = 'https://openrouter.ai/api/v1/chat/completions';
                headers['HTTP-Referer'] = window.location.origin || 'https://gmph2007.github.io/HercarBOT/';
                headers['X-Title'] = 'HercarIA Bot - IESTP Hermanos Carcamo';
            } else if (provider === 'deepseek') {
                endpoint = 'https://api.deepseek.com/chat/completions';
            }

            const messages = [
                { role: 'system', content: systemPrompt }
            ];

            for (const msg of recentHistory) {
                messages.push({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                });
            }
            messages.push({ role: 'user', content: query });

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                const errMsg = errData.error?.message || `HTTP ${res.status} ${res.statusText}`;
                throw new Error(errMsg);
            }

            const data = await res.json();
            const reply = data.choices?.[0]?.message?.content;
            if (!reply) {
                throw new Error(`${provider.toUpperCase()} no devolvió contenido.`);
            }
            return reply;
        }
    }

    buscarEnCustomKB(query) {
        if (!this.customKb || this.customKb.length === 0) return null;
        const normQ = this.normalizarTexto(query);
        const wordsQ = normQ.split(/\s+/).filter(w => w.length > 2);

        for (const item of this.customKb) {
            const normItemQ = this.normalizarTexto(item.question);
            if (normQ.includes(normItemQ) || normItemQ.includes(normQ)) {
                return item;
            }
            const itemWords = normItemQ.split(/\s+/).filter(w => w.length > 2);
            if (itemWords.length > 0) {
                const matchCount = itemWords.filter(w => wordsQ.includes(w)).length;
                if (matchCount / itemWords.length >= 0.6) {
                    return item;
                }
            }
        }
        return null;
    }

    agregarItemCustomKB() {
        const qInput = document.getElementById('custom-kb-question');
        const aInput = document.getElementById('custom-kb-answer');
        if (!qInput || !aInput) return;

        const q = qInput.value.trim();
        const a = aInput.value.trim();

        if (!q || !a) {
            alert('Por favor, ingresa tanto la pregunta o palabras clave como la respuesta detallada.');
            return;
        }

        const newItem = {
            id: 'kb_' + Date.now(),
            question: q,
            answer: a,
            timestamp: new Date().toLocaleDateString('es-PE')
        };

        this.customKb.unshift(newItem);
        try {
            localStorage.setItem('hercar_custom_kb', JSON.stringify(this.customKb));
        } catch (e) {}

        qInput.value = '';
        aInput.value = '';
        this.renderizarListaCustomKB();
        this.mostrarToast('✅ Pregunta personalizada añadida con éxito');
    }

    eliminarItemCustomKB(id) {
        if (!confirm('¿Seguro que deseas eliminar esta pregunta personalizada?')) return;
        this.customKb = this.customKb.filter(item => item.id !== id);
        try {
            localStorage.setItem('hercar_custom_kb', JSON.stringify(this.customKb));
        } catch (e) {}
        this.renderizarListaCustomKB();
        this.mostrarToast('🗑️ Pregunta eliminada de la base personalizada');
    }

    renderizarListaCustomKB() {
        const listEl = document.getElementById('custom-kb-list');
        const countEl = document.getElementById('custom-kb-count');
        if (!listEl) return;

        if (countEl) {
            countEl.textContent = `${this.customKb.length} ${this.customKb.length === 1 ? 'registrada' : 'registradas'}`;
        }

        if (this.customKb.length === 0) {
            listEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 15px;">No hay preguntas personalizadas añadidas aún. Las respuestas provienen de la base institucional oficial y de la Red Neuronal APSTI.</p>`;
            return;
        }

        listEl.innerHTML = this.customKb.map(item => `
            <div class="custom-kb-item">
                <div class="custom-kb-item-header">
                    <strong>❓ ${this.escapeHTML(item.question)}</strong>
                    <button type="button" class="btn-delete-kb-item" onclick="window.hercarApp.eliminarItemCustomKB('${item.id}')" title="Eliminar pregunta">🗑️</button>
                </div>
                <div class="custom-kb-item-body">
                    ${this.parseMarkdown(item.answer)}
                </div>
                <div class="custom-kb-item-date">Añadida el: ${item.timestamp || 'Reciente'}</div>
            </div>
        `).join('');
    }

    guardarSystemPrompt() {
        const promptEl = document.getElementById('admin-system-prompt-text');
        if (!promptEl) return;
        const val = promptEl.value.trim();
        if (!val) {
            alert('El System Prompt no puede estar vacío.');
            return;
        }
        this.adminConfig.systemPrompt = val;
        this.guardarConfiguracionAdminSilenciosa();
        this.mostrarToast('✅ Prompt del Sistema actualizado y guardado');
    }

    restablecerSystemPrompt() {
        if (!confirm('¿Restablecer el System Prompt al texto institucional predeterminado de APSTI?')) return;
        this.adminConfig.systemPrompt = this.DEFAULT_SYSTEM_PROMPT;
        const promptEl = document.getElementById('admin-system-prompt-text');
        if (promptEl) promptEl.value = this.DEFAULT_SYSTEM_PROMPT;
        this.guardarConfiguracionAdminSilenciosa();
        this.mostrarToast('🔄 Prompt restablecido al oficial de APSTI');
    }

    registrarMetricaConsulta(tipo, query, intent = '') {
        if (!this.metrics) return;

        this.metrics.totalQueries = (this.metrics.totalQueries || 0) + 1;
        if (tipo === 'cloud') {
            this.metrics.cloudQueries = (this.metrics.cloudQueries || 0) + 1;
        } else {
            this.metrics.localQueries = (this.metrics.localQueries || 0) + 1;
        }

        const qLower = (query + ' ' + (intent || '')).toLowerCase();
        if (!this.metrics.categoryCounts) {
            this.metrics.categoryCounts = { apsti: 0, ani: 0, conta: 0, dpa: 0, general: 0 };
        }

        if (qLower.includes('apsti') || qLower.includes('sistema') || qLower.includes('program') || qLower.includes('software') || qLower.includes('redes') || qLower.includes('cloud')) {
            this.metrics.categoryCounts.apsti = (this.metrics.categoryCounts.apsti || 0) + 1;
        } else if (qLower.includes('ani') || qLower.includes('negocio') || qLower.includes('aduan') || qLower.includes('comercio') || qLower.includes('puerto')) {
            this.metrics.categoryCounts.ani = (this.metrics.categoryCounts.ani || 0) + 1;
        } else if (qLower.includes('conta') || qLower.includes('tribut') || qLower.includes('balance') || qLower.includes('sunat') || qLower.includes('libro')) {
            this.metrics.categoryCounts.conta = (this.metrics.categoryCounts.conta || 0) + 1;
        } else if (qLower.includes('dpa') || qLower.includes('pesqu') || qLower.includes('mar') || qLower.includes('acuicol') || qLower.includes('embarca')) {
            this.metrics.categoryCounts.dpa = (this.metrics.categoryCounts.dpa || 0) + 1;
        } else {
            this.metrics.categoryCounts.general = (this.metrics.categoryCounts.general || 0) + 1;
        }

        if (!this.metrics.auditLog) this.metrics.auditLog = [];
        const entry = {
            time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            query: query.length > 70 ? query.slice(0, 70) + '...' : query,
            engine: tipo === 'cloud' ? `${this.adminConfig.provider.toUpperCase()} (${this.adminConfig.model})` : 'Red Neuronal Local APSTI',
            status: '✅ OK'
        };
        this.metrics.auditLog.unshift(entry);
        if (this.metrics.auditLog.length > 30) this.metrics.auditLog = this.metrics.auditLog.slice(0, 30);

        this.guardarMetricas();
    }

    registrarFalloAuditoria(query, provider, error) {
        if (!this.metrics) return;
        if (!this.metrics.auditLog) this.metrics.auditLog = [];
        const entry = {
            time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            query: query.length > 70 ? query.slice(0, 70) + '...' : query,
            engine: `${provider.toUpperCase()} (Fallo -> Fallback Local)`,
            status: `⚠️ ${error.slice(0, 35)}`
        };
        this.metrics.auditLog.unshift(entry);
        if (this.metrics.auditLog.length > 30) this.metrics.auditLog = this.metrics.auditLog.slice(0, 30);
        this.guardarMetricas();
    }

    guardarMetricas() {
        try {
            localStorage.setItem('hercar_admin_metrics', JSON.stringify(this.metrics));
        } catch (e) {}
    }

    actualizarDashboardMetricas() {
        if (!this.metrics) return;

        const totalEl = document.getElementById('dash-total-queries');
        const cloudEl = document.getElementById('dash-cloud-queries');
        const localEl = document.getElementById('dash-local-queries');
        const satEl = document.getElementById('dash-satisfaction-pct');

        if (totalEl) totalEl.textContent = this.metrics.totalQueries || 0;
        if (cloudEl) cloudEl.textContent = this.metrics.cloudQueries || 0;
        if (localEl) localEl.textContent = this.metrics.localQueries || 0;

        const up = this.metrics.upvotes || 0;
        const down = this.metrics.downvotes || 0;
        const totalVotes = up + down;
        const pctSat = totalVotes > 0 ? Math.round((up / totalVotes) * 100) + '%' : '100%';
        if (satEl) satEl.textContent = pctSat;

        // Distribución de Categorías
        const cats = this.metrics.categoryCounts || { apsti: 1, ani: 1, conta: 1, dpa: 1 };
        const totalCat = (cats.apsti || 0) + (cats.ani || 0) + (cats.conta || 0) + (cats.dpa || 0) + (cats.general || 0) || 1;

        const pApsti = Math.max(5, Math.round(((cats.apsti || 0) / totalCat) * 100));
        const pAni = Math.max(5, Math.round(((cats.ani || 0) / totalCat) * 100));
        const pConta = Math.max(5, Math.round(((cats.conta || 0) / totalCat) * 100));
        const pDpa = Math.max(5, Math.round(((cats.dpa || 0) / totalCat) * 100));

        const barApsti = document.getElementById('cat-bar-apsti');
        const countApsti = document.getElementById('cat-count-apsti');
        if (barApsti) barApsti.style.width = pApsti + '%';
        if (countApsti) countApsti.textContent = `${pApsti}% (${cats.apsti || 0})`;

        const barAni = document.getElementById('cat-bar-ani');
        const countAni = document.getElementById('cat-count-ani');
        if (barAni) barAni.style.width = pAni + '%';
        if (countAni) countAni.textContent = `${pAni}% (${cats.ani || 0})`;

        const barConta = document.getElementById('cat-bar-conta');
        const countConta = document.getElementById('cat-count-conta');
        if (barConta) barConta.style.width = pConta + '%';
        if (countConta) countConta.textContent = `${pConta}% (${cats.conta || 0})`;

        const barDpa = document.getElementById('cat-bar-dpa');
        const countDpa = document.getElementById('cat-count-dpa');
        if (barDpa) barDpa.style.width = pDpa + '%';
        if (countDpa) countDpa.textContent = `${pDpa}% (${cats.dpa || 0})`;

        // Tabla de Auditoría
        const tbody = document.getElementById('audit-table-body');
        if (tbody) {
            const logs = this.metrics.auditLog || [];
            if (logs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 15px;">Aún no hay consultas registradas en esta sesión.</td></tr>`;
            } else {
                tbody.innerHTML = logs.map(log => `
                    <tr>
                        <td><strong>${this.escapeHTML(log.time)}</strong></td>
                        <td title="${this.escapeHTML(log.query)}">${this.escapeHTML(log.query)}</td>
                        <td><span class="engine-badge">${this.escapeHTML(log.engine)}</span></td>
                        <td>${this.escapeHTML(log.status)}</td>
                    </tr>
                `).join('');
            }
        }
    }

    exportarRegistroAuditoria() {
        const data = {
            institucion: 'IESTP Hermanos Cárcamo - Paita',
            sistema: 'HercarIA Bot v6.0 - Arquitectura Híbrida APSTI',
            fechaExportacion: new Date().toISOString(),
            configuracionActual: {
                modo: this.adminConfig.mode,
                proveedor: this.adminConfig.provider,
                modelo: this.adminConfig.model,
                tieneApiKey: Boolean(this.adminConfig.apiKey)
            },
            metricas: this.metrics,
            preguntasPersonalizadas: this.customKb
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Auditoria_HercarIA_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.mostrarToast('📥 Registro de auditoría exportado correctamente.');
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
        let text = md;

        // 1. Bloques de código con triple backtick ```lang ... ```
        const codeBlocks = [];
        text = text.replace(/```([a-zA-Z0-9_\-\.]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const index = codeBlocks.length;
            const langName = lang ? lang.toUpperCase() : 'CÓDIGO';
            const escapedCode = this.escapeHTML(code.trim());
            const safeCodeForAttr = encodeURIComponent(code.trim());
            const blockHtml = `
                <div class="code-block-wrapper">
                    <div class="code-block-header">
                        <span class="code-lang-label">${langName}</span>
                        <button type="button" class="btn-copy-code" onclick="navigator.clipboard.writeText(decodeURIComponent('${safeCodeForAttr}')).then(() => { this.textContent = '✅ Copiado'; setTimeout(() => this.textContent = '📋 Copiar', 2000); })">
                            📋 Copiar
                        </button>
                    </div>
                    <pre class="code-pre"><code>${escapedCode}</code></pre>
                </div>
            `;
            codeBlocks.push(blockHtml);
            return `__CODE_BLOCK_${index}__`;
        });

        // 2. Tablas Markdown (| Header 1 | Header 2 | \n | --- | --- | \n | Val 1 | Val 2 |)
        const tableBlocks = [];
        text = text.replace(/((?:^[ \t]*\|[^\n]+\|[ \t]*(?:\r?\n|$))+)/gm, (tableMatch) => {
            const lines = tableMatch.trim().split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length < 2) return tableMatch;

            let headerLine = lines[0];
            let dataLines = lines.slice(1);

            let isSeparator = /^\|?[\s\-:|]+\|?$/.test(dataLines[0]);
            if (isSeparator) {
                dataLines = dataLines.slice(1);
            }

            const parseRow = (line) => {
                let cells = line.split('|');
                if (cells[0].trim() === '') cells.shift();
                if (cells[cells.length - 1].trim() === '') cells.pop();
                return cells.map(c => this.parseMarkdownInline(c.trim()));
            };

            const headerCells = parseRow(headerLine);
            const theadHtml = `<thead><tr>${headerCells.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;

            const tbodyRows = dataLines.map((rowLine, rIdx) => {
                const cells = parseRow(rowLine);
                const rowClass = rIdx % 2 === 0 ? 'even-row' : 'odd-row';
                return `<tr class="${rowClass}">${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
            }).join('');

            const tableHtml = `
                <div class="table-responsive-wrapper">
                    <table class="chat-custom-table">
                        ${theadHtml}
                        <tbody>${tbodyRows}</tbody>
                    </table>
                </div>
            `;
            const index = tableBlocks.length;
            tableBlocks.push(tableHtml);
            return `__TABLE_BLOCK_${index}__`;
        });

        // 3. Callouts tipo GitHub (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING])
        text = text.replace(/^>[ \t]*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\n((?:^>[ \t]*.*$\n?)+)/gim, (match, type, content) => {
            const cleanContent = content.split('\n').map(l => l.replace(/^>[ \t]*/, '')).join('\n').trim();
            const upperType = type.toUpperCase();
            let icon = 'ℹ️';
            let title = 'Nota Institucional';
            let cls = 'callout-note';

            if (upperType === 'TIP') {
                icon = '💡';
                title = 'Sugerencia Institucional';
                cls = 'callout-tip';
            } else if (upperType === 'IMPORTANT') {
                icon = '📌';
                title = 'Información Clave';
                cls = 'callout-important';
            } else if (upperType === 'WARNING' || upperType === 'CAUTION') {
                icon = '⚠️';
                title = 'Advertencia';
                cls = 'callout-warning';
            }

            return `<div class="chat-callout ${cls}"><div class="callout-title">${icon} ${title}</div><div>${this.parseMarkdownInline(cleanContent)}</div></div>`;
        });

        // Blockquotes estándar (> texto)
        text = text.replace(/^>[ \t]+(.*$)/gim, '<div class="chat-blockquote">$1</div>');

        // Separadores horizontales
        text = text.replace(/^---$/gim, '<hr class="chat-divider">');

        // Encabezados
        text = text.replace(/^### (.*$)/gim, '<h4>$1</h4>');
        text = text.replace(/^## (.*$)/gim, '<h3>$1</h3>');
        text = text.replace(/^# (.*$)/gim, '<h2>$1</h2>');

        // Listas ordenadas numéricas (1. Item)
        text = text.replace(/^\d+\.\s+(.*$)/gim, '<li class="num-li">$1</li>');
        text = text.replace(/((?:<li class="num-li">.*<\/li>\s*)+)/gim, '<ol class="chat-num-list">$1</ol>');

        // Listas desordenadas (* o -)
        text = text.replace(/^[\*\-]\s+(.*$)/gim, '<li>$1</li>');
        text = text.replace(/((?:<li>.*<\/li>\s*)+)/gim, '<ul class="chat-list">$1</ul>');
        text = text.replace(/<\/ul>\s*<ul class="chat-list">/g, '');

        // Formatos en línea
        text = this.parseMarkdownInline(text);

        // Saltos de línea
        text = text.replace(/\n\n/g, '<br><br>');
        text = text.replace(/\n/g, '<br>');

        // Restaurar tablas y bloques de código
        tableBlocks.forEach((tb, i) => {
            text = text.replace(`__TABLE_BLOCK_${i}__`, tb);
        });
        codeBlocks.forEach((cb, i) => {
            text = text.replace(`__CODE_BLOCK_${i}__`, cb);
        });

        return text;
    }

    parseMarkdownInline(str) {
        if (!str) return '';
        let s = str;
        // Código inline `code`
        s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        // Negrita **texto**
        s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Cursiva *texto*
        s = s.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');
        // Enlaces [texto](url)
        s = s.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1 <span class="link-arrow">↗</span></a>');
        return s;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.hercarApp = new HercarChatApp();
});
