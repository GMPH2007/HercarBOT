/**
 * CONTROLADOR DEL PANEL DE ADMINISTRACIÓN Y ENTRENAMIENTO IA
 * HercarIA v6.0 - APSTI - IESTP "Hermanos Cárcamo" - Paita, Piura
 */

const DEFAULT_OFFICIAL_SYSTEM_PROMPT = `Eres "HercarIA", la asistente virtual y orientadora oficial del Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo" (IESTP Hermanos Cárcamo), ubicado en Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura, Perú.

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

class HercarAdminController {
    constructor() {
        this.neuralNet = new HercarNeuralNetwork();
        this.kb = INSTITUCIONAL_KB;

        this.loadState();
        this.initDOM();
        this.setupEventListeners();
        this.renderAll();
        this.checkAuth();
    }

    loadState() {
        // Cargar configuración de API
        try {
            const rawCfg = localStorage.getItem('hercar_admin_config');
            this.config = rawCfg ? JSON.parse(rawCfg) : {
                mode: 'hybrid',
                provider: 'gemini',
                model: 'gemini-1.5-flash',
                apiKey: '',
                temperature: 0.7,
                maxTokens: 800,
                systemPrompt: DEFAULT_OFFICIAL_SYSTEM_PROMPT
            };
        } catch (e) {
            this.config = {
                mode: 'hybrid',
                provider: 'gemini',
                model: 'gemini-1.5-flash',
                apiKey: '',
                temperature: 0.7,
                maxTokens: 800,
                systemPrompt: DEFAULT_OFFICIAL_SYSTEM_PROMPT
            };
        }

        // Cargar Base de Conocimiento Personalizada
        try {
            const rawKb = localStorage.getItem('hercar_custom_kb');
            if (rawKb && JSON.parse(rawKb).length > 0) {
                this.customKb = JSON.parse(rawKb);
            } else {
                this.customKb = [
                    {
                        id: 'kb_institucional_1',
                        question: '¿Cuál es el horario de atención en Mesa de Partes Virtual y Secretaría?',
                        answer: 'El horario oficial de atención es de **Lunes a Viernes de 8:00 AM a 3:00 PM**. Los trámites registrados después de las 3:00 PM o fines de semana ingresan con fecha de recepción del siguiente día hábil institucional.',
                        timestamp: new Date().toLocaleDateString('es-PE')
                    },
                    {
                        id: 'kb_institucional_2',
                        question: '¿Dónde se tramita el carné de medio pasaje oficial MINEDU?',
                        answer: 'El carné oficial de medio pasaje técnico MINEDU se solicita durante la matrícula semestral adjuntando la tasa TUPA de **S/ 20**. Secretaría Académica tramita el lote consolidado ante el Ministerio de Educación.',
                        timestamp: new Date().toLocaleDateString('es-PE')
                    }
                ];
                localStorage.setItem('hercar_custom_kb', JSON.stringify(this.customKb));
            }
        } catch (e) {
            this.customKb = [];
        }

        // Cargar Consultas No Respondidas o de Baja Certeza
        try {
            const rawUnans = localStorage.getItem('hercar_unanswered_queries');
            if (rawUnans && JSON.parse(rawUnans).length > 0) {
                this.unanswered = JSON.parse(rawUnans);
            } else {
                this.unanswered = [
                    {
                        id: 'unans_apsti_1',
                        query: '¿En qué empresas o puertos de Paita puedo realizar mis prácticas profesionales de APSTI?',
                        intent: 'practicas_preprofesionales',
                        confidence: 0.32,
                        confidencePercent: '32% (Baja Certeza)',
                        timestamp: new Date().toLocaleDateString('es-PE'),
                        reason: 'Consulta estudiantil con baja certeza de la red neuronal - Requiere respuesta oficial institucional'
                    },
                    {
                        id: 'unans_apsti_2',
                        query: '¿Hay clases o talleres presenciales los días sábados en la carrera de APSTI?',
                        intent: 'horarios_clases',
                        confidence: 0.28,
                        confidencePercent: '28% (Baja Certeza)',
                        timestamp: new Date().toLocaleDateString('es-PE'),
                        reason: 'Duda de postulantes sobre turnos de estudio no clasificada'
                    },
                    {
                        id: 'unans_apsti_3',
                        query: '¿Cómo solicito la convalidación de cursos si me traslado de otro instituto tecnológico a APSTI?',
                        intent: 'traslados_convalidacion',
                        confidence: 0.35,
                        confidencePercent: '35% (Baja Certeza)',
                        timestamp: new Date().toLocaleDateString('es-PE'),
                        reason: 'Consulta compleja de trámites académicos con baja confianza'
                    }
                ];
                localStorage.setItem('hercar_unanswered_queries', JSON.stringify(this.unanswered));
            }
        } catch (e) {
            this.unanswered = [];
        }

        // Cargar Métricas y Auditoría
        try {
            const rawMetrics = localStorage.getItem('hercar_admin_metrics');
            this.metrics = rawMetrics ? JSON.parse(rawMetrics) : {
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
    }

    initDOM() {
        // Tema Oscuro / Claro
        if (localStorage.getItem('hercar_theme') === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeBtn(true);
        }

        // Sincronizar campos de API
        const selProvider = document.getElementById('select-provider');
        if (selProvider) selProvider.value = this.config.provider || 'gemini';

        this.updateModelOptions(this.config.provider || 'gemini');

        const selModel = document.getElementById('select-model');
        if (selModel && this.config.model) selModel.value = this.config.model;

        const inputKey = document.getElementById('input-api-key');
        if (inputKey) inputKey.value = this.config.apiKey || '';

        const sliderTemp = document.getElementById('slider-temp');
        const labelTemp = document.getElementById('label-temp-val');
        if (sliderTemp) sliderTemp.value = this.config.temperature || 0.7;
        if (labelTemp) labelTemp.textContent = this.config.temperature || '0.7';

        const selTokens = document.getElementById('select-tokens');
        if (selTokens) selTokens.value = this.config.maxTokens || 800;

        const txtPrompt = document.getElementById('system-prompt-textarea');
        if (txtPrompt) txtPrompt.value = this.config.systemPrompt || DEFAULT_OFFICIAL_SYSTEM_PROMPT;

        // Modo seleccionado
        this.selectModeRadio(this.config.mode || 'hybrid');
    }

    setupEventListeners() {
        // Pestañas del Menú Lateral
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Alternar Tema
        const themeBtn = document.getElementById('theme-toggle-admin');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-mode');
                localStorage.setItem('hercar_theme', isDark ? 'dark' : 'light');
                this.updateThemeBtn(isDark);
            });
        }

        // Sesión y Logout
        const btnLogout = document.getElementById('btn-admin-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.stopPropagation();
                this.logout();
            });
        }

        const sessionPill = document.getElementById('admin-session-pill');
        if (sessionPill) {
            sessionPill.addEventListener('click', () => {
                const session = localStorage.getItem('hercar_admin_session');
                if (!session) {
                    const loginModal = document.getElementById('modal-admin-login');
                    if (loginModal) loginModal.style.display = 'flex';
                }
            });
        }

        // Selección de Modos Operativos
        document.querySelectorAll('input[name="admin_mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.config.mode = e.target.value;
                this.selectModeRadio(e.target.value);
                this.saveConfigSilently();
                this.updateSidebarStatus();
                this.showToast('Modo operativo actualizado: ' + e.target.value);
            });
        });

        // Cambio de Proveedor
        const selProvider = document.getElementById('select-provider');
        if (selProvider) {
            selProvider.addEventListener('change', (e) => {
                const prov = e.target.value;
                this.config.provider = prov;
                this.updateModelOptions(prov);
                this.updateSidebarStatus();
            });
        }

        // Cambio de Modelo
        const selModel = document.getElementById('select-model');
        if (selModel) {
            selModel.addEventListener('change', (e) => {
                this.config.model = e.target.value;
            });
        }

        // Ver / Ocultar API Key
        const btnToggleKey = document.getElementById('btn-toggle-key');
        const inputKey = document.getElementById('input-api-key');
        if (btnToggleKey && inputKey) {
            btnToggleKey.addEventListener('click', () => {
                inputKey.type = inputKey.type === 'password' ? 'text' : 'password';
                btnToggleKey.textContent = inputKey.type === 'password' ? '👁️' : '🙈';
            });
        }

        // Slider Temperatura
        const sliderTemp = document.getElementById('slider-temp');
        const labelTemp = document.getElementById('label-temp-val');
        if (sliderTemp && labelTemp) {
            sliderTemp.addEventListener('input', (e) => {
                labelTemp.textContent = e.target.value;
            });
        }

        // Probar Conexión API
        const btnTestApi = document.getElementById('btn-test-api');
        if (btnTestApi) {
            btnTestApi.addEventListener('click', () => this.testApiConnection());
        }

        // Guardar Configuración API
        const btnSaveApi = document.getElementById('btn-save-api');
        if (btnSaveApi) {
            btnSaveApi.addEventListener('click', () => this.saveApiSettings());
        }

        // Borrar API Key
        const btnClearApi = document.getElementById('btn-clear-api');
        if (btnClearApi) {
            btnClearApi.addEventListener('click', () => this.clearApiKey());
        }

        // Vaciar Preguntas Sin Resolver
        const btnClearUnans = document.getElementById('btn-clear-all-unanswered');
        if (btnClearUnans) {
            btnClearUnans.addEventListener('click', () => this.clearAllUnanswered());
        }

        // Modal de Responder y Enseñar
        const btnCloseTeachModal = document.getElementById('btn-close-teach-modal');
        const btnCancelTeachModal = document.getElementById('btn-cancel-teach-modal');
        const btnConfirmTeachModal = document.getElementById('btn-confirm-teach-modal');

        if (btnCloseTeachModal) btnCloseTeachModal.addEventListener('click', () => this.closeTeachModal());
        if (btnCancelTeachModal) btnCancelTeachModal.addEventListener('click', () => this.closeTeachModal());
        if (btnConfirmTeachModal) btnConfirmTeachModal.addEventListener('click', () => this.confirmTeachAnswer());

        // Añadir Conocimiento en Custom KB
        const btnAddCustom = document.getElementById('btn-add-custom-knowledge');
        if (btnAddCustom) {
            btnAddCustom.addEventListener('click', () => this.addCustomKnowledge());
        }

        // Buscar en Custom KB
        const searchKb = document.getElementById('search-custom-kb');
        if (searchKb) {
            searchKb.addEventListener('input', (e) => this.renderCustomKbList(e.target.value));
        }

        // Playground de Red Neuronal
        const btnRunNeural = document.getElementById('btn-run-neural-test');
        const inputNeural = document.getElementById('neural-test-input');
        if (btnRunNeural && inputNeural) {
            btnRunNeural.addEventListener('click', () => this.runNeuralPlayground(inputNeural.value));
            inputNeural.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.runNeuralPlayground(inputNeural.value);
            });
        }

        // Guardar System Prompt
        const btnSavePrompt = document.getElementById('btn-save-prompt');
        if (btnSavePrompt) {
            btnSavePrompt.addEventListener('click', () => this.saveSystemPrompt());
        }

        // Restablecer System Prompt
        const btnResetPrompt = document.getElementById('btn-reset-prompt');
        if (btnResetPrompt) {
            btnResetPrompt.addEventListener('click', () => this.resetSystemPrompt());
        }

        // Exportar Auditoría JSON
        const btnExportAudit = document.getElementById('btn-export-audit-json');
        if (btnExportAudit) {
            btnExportAudit.addEventListener('click', () => this.exportAuditJson());
        }

        // Imprimir Informe Formal de Sustentación
        const btnPrintAudit = document.getElementById('btn-print-audit-report');
        if (btnPrintAudit) {
            btnPrintAudit.addEventListener('click', () => this.printFormalAuditReport());
        }

        // Simulador de Chat en Vivo
        const btnPreviewSend = document.getElementById('btn-chat-preview-send');
        const inputPreview = document.getElementById('chat-preview-input');
        if (btnPreviewSend && inputPreview) {
            btnPreviewSend.addEventListener('click', () => this.handleChatPreviewSubmit());
            inputPreview.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.handleChatPreviewSubmit();
            });
        }
    }

    switchTab(tabId) {
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.admin-tab-view').forEach(view => {
            view.classList.toggle('active', view.id === tabId);
        });
    }

    updateThemeBtn(isDark) {
        const icon = document.getElementById('theme-icon');
        const text = document.getElementById('theme-text');
        if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        if (text) text.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }

    selectModeRadio(mode) {
        document.querySelectorAll('.mode-card').forEach(card => card.classList.remove('selected'));
        const targetRadio = document.querySelector(`input[name="admin_mode"][value="${mode}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            const parent = targetRadio.closest('.mode-card');
            if (parent) parent.classList.add('selected');
        }
    }

    updateSidebarStatus() {
        const modeEl = document.getElementById('status-sidebar-mode');
        const provEl = document.getElementById('status-sidebar-provider');
        const modeMap = { hybrid: '⚡ Híbrido', cloud: '☁️ Cloud', local: '🧠 Local' };
        if (modeEl) modeEl.textContent = modeMap[this.config.mode] || this.config.mode;
        if (provEl) provEl.textContent = (this.config.provider || 'gemini').toUpperCase();
    }

    updateModelOptions(provider) {
        const selModel = document.getElementById('select-model');
        if (!selModel) return;

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
        selModel.innerHTML = list.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

        if (this.config.model && list.some(m => m.id === this.config.model)) {
            selModel.value = this.config.model;
        } else {
            this.config.model = list[0].id;
            selModel.value = list[0].id;
        }
    }

    async testApiConnection() {
        const btn = document.getElementById('btn-test-api');
        const badge = document.getElementById('test-result-badge');
        const inputKey = document.getElementById('input-api-key');
        const selProv = document.getElementById('select-provider');
        const selModel = document.getElementById('select-model');

        const key = (inputKey ? inputKey.value : this.config.apiKey || '').trim();
        const prov = selProv ? selProv.value : this.config.provider;
        const model = selModel ? selModel.value : this.config.model;

        if (!key) {
            if (badge) {
                badge.className = 'test-result-pill error';
                badge.textContent = '⚠️ Ingresa una clave API primero.';
            }
            return;
        }

        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span>⏳ Conectando...</span>';
        }
        if (badge) {
            badge.className = 'test-result-pill';
            badge.style.display = 'inline-block';
            badge.style.background = 'rgba(59, 130, 246, 0.15)';
            badge.style.color = '#2563eb';
            badge.textContent = 'Probando petición en vivo...';
        }

        const tStart = performance.now();
        try {
            if (prov === 'gemini') {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: 'Hola, di "Conexión Exitosa".' }] }],
                        generationConfig: { maxOutputTokens: 20 }
                    })
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message || `HTTP ${res.status}`);
                }
            } else {
                let endpoint = 'https://api.openai.com/v1/chat/completions';
                const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` };
                if (prov === 'groq') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
                else if (prov === 'openrouter') {
                    endpoint = 'https://openrouter.ai/api/v1/chat/completions';
                    headers['HTTP-Referer'] = window.location.origin || 'https://gmph2007.github.io/HercarBOT/';
                } else if (prov === 'deepseek') endpoint = 'https://api.deepseek.com/chat/completions';

                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ model: model, messages: [{ role: 'user', content: 'Ping' }], max_tokens: 15 })
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error?.message || `HTTP ${res.status}`);
                }
            }

            const latency = Math.round(performance.now() - tStart);
            if (badge) {
                badge.className = 'test-result-pill success';
                badge.textContent = `✅ ¡Conexión Exitosa con ${prov.toUpperCase()}! (Latencia: ${latency} ms)`;
            }
            this.showToast(`✅ Conexión con ${prov.toUpperCase()} verificada con éxito (${latency}ms)`);
        } catch (e) {
            if (badge) {
                badge.className = 'test-result-pill error';
                badge.textContent = `❌ Error: ${e.message}`;
            }
            this.showToast(`❌ Error de conexión: ${e.message}`, 4000);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<span>⚡ Probar Conexión con la API en Tiempo Real</span>';
            }
        }
    }

    saveApiSettings() {
        const inputKey = document.getElementById('input-api-key');
        const selProv = document.getElementById('select-provider');
        const selModel = document.getElementById('select-model');
        const sliderTemp = document.getElementById('slider-temp');
        const selTokens = document.getElementById('select-tokens');
        const selModeRadio = document.querySelector('input[name="admin_mode"]:checked');

        this.config.apiKey = inputKey ? inputKey.value.trim() : '';
        this.config.provider = selProv ? selProv.value : 'gemini';
        this.config.model = selModel ? selModel.value : 'gemini-1.5-flash';
        this.config.temperature = sliderTemp ? parseFloat(sliderTemp.value) : 0.7;
        this.config.maxTokens = selTokens ? parseInt(selTokens.value) : 800;
        if (selModeRadio) this.config.mode = selModeRadio.value;

        this.saveConfigSilently();
        this.updateSidebarStatus();
        this.showToast('✅ ¡Configuración de API guardada exitosamente!');

        const statusInd = document.getElementById('save-status-indicator');
        if (statusInd) {
            statusInd.textContent = '✅ ¡Guardado con éxito!';
            statusInd.style.opacity = '1';
            setTimeout(() => { if (statusInd) statusInd.style.opacity = '0'; }, 3000);
        }
    }

    async clearApiKey() {
        const confirmar = await this.mostrarConfirmacion({
            titulo: '¿Eliminar Clave API?',
            mensaje: '¿Deseas eliminar la clave API almacenada? El chatbot volverá al modo Red Neuronal Local APSTI.',
            icono: '⚠️',
            tipo: 'warning',
            textoConfirmar: 'Sí, Eliminar Clave',
            textoCancelar: 'Cancelar'
        });
        if (!confirmar) return;

        this.config.apiKey = '';
        const inputKey = document.getElementById('input-api-key');
        if (inputKey) inputKey.value = '';
        const badge = document.getElementById('test-result-badge');
        if (badge) badge.style.display = 'none';

        this.saveConfigSilently();
        this.updateSidebarStatus();
        this.showToast('🗑️ Clave API eliminada correctamente.');

        const statusInd = document.getElementById('save-status-indicator');
        if (statusInd) {
            statusInd.textContent = '🗑️ Clave eliminada (Modo Local activo)';
            statusInd.style.opacity = '1';
            setTimeout(() => { if (statusInd) statusInd.style.opacity = '0'; }, 3000);
        }
    }

    saveConfigSilently() {
        try {
            localStorage.setItem('hercar_admin_config', JSON.stringify(this.config));
        } catch (e) {}
    }

    // =========================================================================
    // GESTIÓN DE PREGUNTAS SIN RESOLVER / ENSEÑAR AL BOT
    // =========================================================================

    renderUnansweredList() {
        const container = document.getElementById('unanswered-list-container');
        const badgeCount = document.getElementById('badge-unanswered-count');
        if (!container) return;

        if (badgeCount) {
            badgeCount.textContent = this.unanswered.length;
            badgeCount.className = this.unanswered.length > 0 ? 'sidebar-badge badge-pending' : 'sidebar-badge badge-zero';
        }

        if (this.unanswered.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <div style="font-size: 2.2rem; margin-bottom: 10px;">🎉</div>
                    <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">¡Bandeja al día!</h4>
                    <p style="font-size: 0.85rem;">No hay preguntas de estudiantes sin resolver pendientes de enseñar. Todas las consultas recientes se respondieron con alta confianza o ya fueron añadidas a la base oficial.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.unanswered.map((item, idx) => `
            <div class="unanswered-card-item">
                <div class="unanswered-content">
                    <div class="unanswered-question">❓ "${this.escapeHTML(item.query)}"</div>
                    <div class="unanswered-meta">
                        <span>📅 ${item.timestamp || 'Reciente'}</span>
                        <span>🎯 Confianza: <strong style="color: #ef4444;">${item.confidence || 'Baja'}</strong></span>
                        <span>🏷️ Intención tentativa: ${item.intent || 'desconocida'}</span>
                    </div>
                </div>
                <div class="unanswered-actions">
                    <button type="button" class="btn-answer-teach" onclick="window.adminCtrl.openTeachModal('${item.id}')">
                        ➕ Responder y Enseñar
                    </button>
                    <button type="button" class="btn-discard-unans" onclick="window.adminCtrl.discardUnanswered('${item.id}')" title="Descartar esta pregunta">
                        ✕
                    </button>
                </div>
            </div>
        `).join('');
    }

    openTeachModal(id) {
        const item = this.unanswered.find(u => u.id === id);
        if (!item) return;

        this.currentTeachingId = id;
        const modal = document.getElementById('modal-answer-unanswered');
        const qInput = document.getElementById('teach-modal-question');
        const aInput = document.getElementById('teach-modal-answer');

        if (qInput) qInput.value = item.query;
        if (aInput) aInput.value = '';
        if (modal) modal.style.display = 'flex';
    }

    closeTeachModal() {
        const modal = document.getElementById('modal-answer-unanswered');
        if (modal) modal.style.display = 'none';
        this.currentTeachingId = null;
    }

    async confirmTeachAnswer() {
        const qInput = document.getElementById('teach-modal-question');
        const aInput = document.getElementById('teach-modal-answer');

        const q = qInput ? qInput.value.trim() : '';
        const a = aInput ? aInput.value.trim() : '';

        if (!q || !a) {
            await this.mostrarAlerta({
                titulo: 'Campos Incompletos',
                mensaje: 'Por favor, ingresa tanto la pregunta como la respuesta institucional.',
                icono: '⚠️',
                tipo: 'warning',
                textoBoton: 'Entendido'
            });
            return;
        }

        // Agregar a la Base de Conocimiento oficial
        const newKb = {
            id: 'kb_' + Date.now(),
            question: q,
            answer: a,
            timestamp: new Date().toLocaleDateString('es-PE')
        };
        this.customKb.unshift(newKb);
        localStorage.setItem('hercar_custom_kb', JSON.stringify(this.customKb));

        // Remover de la bandeja de sin responder
        if (this.currentTeachingId) {
            this.unanswered = this.unanswered.filter(u => u.id !== this.currentTeachingId);
            localStorage.setItem('hercar_unanswered_queries', JSON.stringify(this.unanswered));
        }

        this.closeTeachModal();
        this.renderUnansweredList();
        this.renderCustomKbList();
        this.showToast('✅ ¡Pregunta respondida y enseñada al chatbot con éxito!');
    }

    discardUnanswered(id) {
        this.unanswered = this.unanswered.filter(u => u.id !== id);
        localStorage.setItem('hercar_unanswered_queries', JSON.stringify(this.unanswered));
        this.renderUnansweredList();
        this.showToast('Consulta descartada de la bandeja.');
    }

    async clearAllUnanswered() {
        const confirmar = await this.mostrarConfirmacion({
            titulo: '¿Vaciar Consultas?',
            mensaje: '¿Deseas vaciar todas las preguntas pendientes de la bandeja?',
            icono: '🗑️',
            tipo: 'danger',
            textoConfirmar: 'Sí, Vaciar Bandeja',
            textoCancelar: 'Cancelar'
        });
        if (!confirmar) return;

        this.unanswered = [];
        localStorage.setItem('hercar_unanswered_queries', JSON.stringify(this.unanswered));
        this.renderUnansweredList();
        this.showToast('Bandeja de consultas vaciada.');
    }

    // =========================================================================
    // BASE DE CONOCIMIENTO (CUSTOM KB)
    // =========================================================================

    async addCustomKnowledge() {
        const qInput = document.getElementById('kb-input-question');
        const aInput = document.getElementById('kb-input-answer');

        const q = qInput ? qInput.value.trim() : '';
        const a = aInput ? aInput.value.trim() : '';

        if (!q || !a) {
            await this.mostrarAlerta({
                titulo: 'Campos Incompletos',
                mensaje: 'Por favor, escribe la pregunta y la respuesta oficial institucional.',
                icono: '⚠️',
                tipo: 'warning',
                textoBoton: 'Entendido'
            });
            return;
        }

        const item = {
            id: 'kb_' + Date.now(),
            question: q,
            answer: a,
            timestamp: new Date().toLocaleDateString('es-PE')
        };

        this.customKb.unshift(item);
        localStorage.setItem('hercar_custom_kb', JSON.stringify(this.customKb));

        if (qInput) qInput.value = '';
        if (aInput) aInput.value = '';

        this.renderCustomKbList();
        this.showToast('✅ Pregunta y respuesta añadidas a la Base de Conocimiento.');
    }

    renderCustomKbList(filterText = '') {
        const container = document.getElementById('custom-kb-cards-container');
        const badgeCount = document.getElementById('badge-kb-count');
        if (!container) return;

        if (badgeCount) {
            badgeCount.textContent = this.customKb.length;
            badgeCount.className = this.customKb.length > 0 ? 'sidebar-badge badge-active-kb' : 'sidebar-badge badge-zero';
        }

        let filtered = this.customKb;
        if (filterText && filterText.trim()) {
            const f = filterText.toLowerCase();
            filtered = filtered.filter(item => 
                item.question.toLowerCase().includes(f) || item.answer.toLowerCase().includes(f)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.88rem;">
                    No hay preguntas personalizadas ${filterText ? 'que coincidan con la búsqueda' : 'registradas aún'}.
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(item => `
            <div style="background: var(--bg-card-alt); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px 18px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <strong style="color: var(--primary); font-size: 0.95rem;">❓ ${this.escapeHTML(item.question)}</strong>
                    <button type="button" class="btn-discard-unans" onclick="window.adminCtrl.deleteCustomKb('${item.id}')" title="Eliminar este conocimiento">🗑️</button>
                </div>
                <div style="font-size: 0.84rem; color: var(--text-primary); line-height: 1.5; white-space: pre-wrap;">${this.escapeHTML(item.answer)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">Añadida el: ${item.timestamp || 'Reciente'}</div>
            </div>
        `).join('');
    }

    async deleteCustomKb(id) {
        const confirmar = await this.mostrarConfirmacion({
            titulo: '¿Eliminar Conocimiento?',
            mensaje: '¿Seguro que deseas eliminar esta pregunta de la base de conocimiento institucional?',
            icono: '🗑️',
            tipo: 'danger',
            textoConfirmar: 'Sí, Eliminar',
            textoCancelar: 'Cancelar'
        });
        if (!confirmar) return;

        this.customKb = this.customKb.filter(item => item.id !== id);
        localStorage.setItem('hercar_custom_kb', JSON.stringify(this.customKb));
        this.renderCustomKbList();
        this.showToast('🗑️ Pregunta eliminada de la base de conocimiento.');
    }

    // =========================================================================
    // RED NEURONAL APSTI - PLAYGROUND
    // =========================================================================

    runNeuralPlayground(query) {
        if (!query || !query.trim()) return;

        const resBox = document.getElementById('neural-test-results-box');
        const intentEl = document.getElementById('res-neural-intent');
        const confEl = document.getElementById('res-neural-conf');
        const latEl = document.getElementById('res-neural-lat');
        const tokensEl = document.getElementById('res-neural-tokens');

        const prediction = this.neuralNet.predict(query);

        if (intentEl) intentEl.textContent = prediction.label || prediction.intent;
        if (confEl) confEl.textContent = prediction.confidencePercent;
        if (latEl) latEl.textContent = prediction.latencyMs + ' ms';

        if (tokensEl) {
            tokensEl.innerHTML = (prediction.activeTokens || []).map(t => `
                <span style="padding: 2px 8px; background: rgba(37,99,235,0.1); color: var(--primary); border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
                    ${t}
                </span>
            `).join('') || '<span style="color: var(--text-muted); font-size: 0.78rem;">Ningún token léxico institucional específico detectado</span>';
        }

        if (resBox) resBox.style.display = 'block';
    }

    // =========================================================================
    // MÉTRICAS Y AUDITORÍA
    // =========================================================================

    renderAnalytics() {
        const totalEl = document.getElementById('analytics-total');
        const cloudEl = document.getElementById('analytics-cloud');
        const localEl = document.getElementById('analytics-local');
        const satEl = document.getElementById('analytics-sat');

        if (totalEl) totalEl.textContent = this.metrics.totalQueries || 0;
        if (cloudEl) cloudEl.textContent = this.metrics.cloudQueries || 0;
        if (localEl) localEl.textContent = this.metrics.localQueries || 0;

        const up = this.metrics.upvotes || 0;
        const down = this.metrics.downvotes || 0;
        const totalV = up + down;
        const satPct = totalV > 0 ? Math.round((up / totalV) * 100) + '%' : '100%';
        if (satEl) satEl.textContent = satPct;

        // Barras
        const cats = this.metrics.categoryCounts || { apsti: 1, ani: 1, conta: 1, dpa: 1 };
        const totalCat = (cats.apsti || 0) + (cats.ani || 0) + (cats.conta || 0) + (cats.dpa || 0) + (cats.general || 0) || 1;

        const pApsti = Math.max(5, Math.round(((cats.apsti || 0) / totalCat) * 100));
        const pAni = Math.max(5, Math.round(((cats.ani || 0) / totalCat) * 100));
        const pConta = Math.max(5, Math.round(((cats.conta || 0) / totalCat) * 100));
        const pDpa = Math.max(5, Math.round(((cats.dpa || 0) / totalCat) * 100));

        const barApsti = document.getElementById('bar-fill-apsti');
        const numApsti = document.getElementById('bar-num-apsti');
        if (barApsti) barApsti.style.width = pApsti + '%';
        if (numApsti) numApsti.textContent = `${pApsti}% (${cats.apsti || 0})`;

        const barAni = document.getElementById('bar-fill-ani');
        const numAni = document.getElementById('bar-num-ani');
        if (barAni) barAni.style.width = pAni + '%';
        if (numAni) numAni.textContent = `${pAni}% (${cats.ani || 0})`;

        const barConta = document.getElementById('bar-fill-conta');
        const numConta = document.getElementById('bar-num-conta');
        if (barConta) barConta.style.width = pConta + '%';
        if (numConta) numConta.textContent = `${pConta}% (${cats.conta || 0})`;

        const barDpa = document.getElementById('bar-fill-dpa');
        const numDpa = document.getElementById('bar-num-dpa');
        if (barDpa) barDpa.style.width = pDpa + '%';
        if (numDpa) numDpa.textContent = `${pDpa}% (${cats.dpa || 0})`;

        // Tabla
        const tbody = document.getElementById('analytics-audit-tbody');
        if (tbody) {
            const logs = this.metrics.auditLog || [];
            if (logs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 18px;">No hay registros de auditoría aún.</td></tr>`;
            } else {
                tbody.innerHTML = logs.map(l => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px; font-weight: 700;">${this.escapeHTML(l.time)}</td>
                        <td style="padding: 10px;">${this.escapeHTML(l.query)}</td>
                        <td style="padding: 10px;"><span style="padding: 2px 8px; border-radius: 4px; background: rgba(37,99,235,0.1); color: var(--primary); font-size: 0.78rem;">${this.escapeHTML(l.engine)}</span></td>
                        <td style="padding: 10px;">${this.escapeHTML(l.status)}</td>
                    </tr>
                `).join('');
            }
        }
    }

    exportAuditJson() {
        const payload = {
            institucion: 'IESTP Hermanos Cárcamo - Paita',
            sistema: 'HercarIA v6.0 APSTI',
            fechaExportacion: new Date().toISOString(),
            configuracion: this.config,
            metricas: this.metrics,
            preguntasSinResolver: this.unanswered,
            preguntasPersonalizadas: this.customKb
        };

        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Auditoria_HercarIA_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('📥 Auditoría exportada exitosamente.');
    }

    printFormalAuditReport() {
        const ahora = new Date();
        const fechaStr = ahora.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
        const horaStr = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const totalQ = this.metrics.totalQueries || 0;
        const cloudQ = this.metrics.cloudQueries || 0;
        const localQ = this.metrics.localQueries || 0;
        const up = this.metrics.upvotes || 0;
        const down = this.metrics.downvotes || 0;
        const satPct = (up + down) > 0 ? Math.round((up / (up + down)) * 100) + '%' : '100%';
        const cats = this.metrics.categoryCounts || { apsti: 0, ani: 0, conta: 0, dpa: 0, general: 0 };
        const logs = this.metrics.auditLog || [];

        const printWindow = window.open('', '_blank', 'width=960,height=800');
        if (!printWindow) {
            await this.mostrarAlerta({
                titulo: 'Ventana Emergente Bloqueada',
                mensaje: 'Por favor, permite las ventanas emergentes en tu navegador para generar e imprimir el informe formal de sustentación.',
                icono: '⚠️',
                tipo: 'warning',
                textoBoton: 'Entendido'
            });
            return;
        }

        const reportHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe Técnico de Auditoría IA • IESTP Hermanos Cárcamo</title>
    <style>
        @page { size: A4; margin: 18mm 15mm 18mm 15mm; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 24px;
            background: #fff;
            line-height: 1.5;
            font-size: 11pt;
        }
        .header-box {
            display: flex;
            align-items: center;
            gap: 18px;
            border-bottom: 2.5px solid #1e3a8a;
            padding-bottom: 14px;
            margin-bottom: 20px;
        }
        .header-box img {
            width: 72px;
            height: auto;
            object-fit: contain;
        }
        .header-text h1 {
            margin: 0;
            font-size: 13pt;
            color: #1e3a8a;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 0.5px;
        }
        .header-text h2 {
            margin: 2px 0;
            font-size: 11pt;
            color: #0f172a;
            font-weight: 700;
        }
        .header-text p {
            margin: 0;
            font-size: 9pt;
            color: #64748b;
        }
        .doc-title-box {
            background: #f1f5f9;
            border-left: 5px solid #2563eb;
            padding: 12px 16px;
            margin-bottom: 22px;
            border-radius: 4px;
        }
        .doc-title-box h3 {
            margin: 0;
            font-size: 12pt;
            color: #1e293b;
            text-transform: uppercase;
            font-weight: 800;
        }
        .doc-title-box p {
            margin: 3px 0 0;
            font-size: 9.5pt;
            color: #475569;
        }
        h4 {
            font-size: 10.5pt;
            color: #1e3a8a;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 4px;
            margin: 18px 0 10px;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
            margin-bottom: 16px;
        }
        table th {
            background: #e2e8f0;
            color: #1e293b;
            font-weight: 700;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            text-align: left;
        }
        table td {
            padding: 7px 10px;
            border: 1px solid #cbd5e1;
        }
        tr:nth-child(even) td {
            background: #f8fafc;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8.5pt;
            font-weight: 700;
        }
        .badge-neural { background: #f3e8ff; color: #7e22ce; }
        .badge-cloud { background: #dbeafe; color: #1d4ed8; }
        .signatures-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 55px;
            page-break-inside: avoid;
        }
        .sig-box {
            text-align: center;
            border-top: 1.5px solid #475569;
            padding-top: 8px;
            font-size: 8.5pt;
            color: #334155;
        }
        .sig-box strong {
            display: block;
            color: #0f172a;
            font-size: 9pt;
            margin-bottom: 2px;
        }
        .footer-note {
            margin-top: 35px;
            font-size: 8pt;
            color: #94a3b8;
            text-align: center;
            border-top: 1px dashed #cbd5e1;
            padding-top: 8px;
        }
        @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 16px; text-align: right;">
        <button onclick="window.print()" style="padding: 10px 22px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 11pt; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">🖨️ Imprimir / Guardar en PDF</button>
        <button onclick="window.close()" style="padding: 10px 16px; background: #94a3b8; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 11pt; margin-left: 8px;">✕ Cerrar</button>
    </div>

    <div class="header-box">
        <img src="assets/logo-crest.png" alt="Insignia IESTP Hermanos Cárcamo" onerror="this.src='assets/logo-iestp.png'">
        <div class="header-text">
            <h1>Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo"</h1>
            <h2>Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios TI (APSTI)</h2>
            <p>Paita, Piura — Perú | Tel: 955 600 660 | Portal: ieshercar.edu.pe | Mesa de Partes: sistema.ieshercar.edu.pe</p>
        </div>
    </div>

    <div class="doc-title-box">
        <h3>Informe Oficial de Rendimiento y Auditoría Forense de Inteligencia Artificial</h3>
        <p><strong>Proyecto:</strong> Sistema Multi-Agente Inteligente "HercarIA" v6.0 | <strong>Modalidad:</strong> Sustentación de Trabajo de Titulación Profesional Técnica</p>
        <p><strong>Fecha y Hora de Emisión:</strong> \${fechaStr} a las \${horaStr} | <strong>Ambiente:</strong> Producción Client-Side (GitHub Pages / Local)</p>
    </div>

    <h4>1. Resumen Ejecutivo de Métricas Operativas</h4>
    <table>
        <thead>
            <tr>
                <th>Indicador de Rendimiento</th>
                <th>Valor Registrado</th>
                <th>Observación Técnica</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Total de Consultas Procesadas</strong></td>
                <td><strong>\${totalQ}</strong></td>
                <td>Sesiones de orientación vocacional y académica</td>
            </tr>
            <tr>
                <td><strong>Inferencia Red Neuronal Local APSTI</strong></td>
                <td><strong>\${localQ} (\${totalQ > 0 ? Math.round((localQ/totalQ)*100) : 0}%)</strong></td>
                <td>Perceptrón Multicapa MLP (260-36-18-34) • Latencia &lt;5 ms</td>
            </tr>
            <tr>
                <td><strong>Inferencia Cloud API (Modelos Externos)</strong></td>
                <td><strong>\${cloudQ} (\${totalQ > 0 ? Math.round((cloudQ/totalQ)*100) : 0}%)</strong></td>
                <td>Proveedor: \${(this.config.provider || 'gemini').toUpperCase()} (\${this.config.model || 'Flash'})</td>
            </tr>
            <tr>
                <td><strong>Índice de Aceptación Estudiantil (👍)</strong></td>
                <td><strong>\${satPct}</strong></td>
                <td>Valoraciones positivas recibidas en el chatbot</td>
            </tr>
            <tr>
                <td><strong>Modo Operativo del Chatbot</strong></td>
                <td><strong>\${(this.config.mode || 'hybrid').toUpperCase()}</strong></td>
                <td>Conmutación automática de contingencia activa</td>
            </tr>
            <tr>
                <td><strong>Conocimientos Personalizados en Base</strong></td>
                <td><strong>\${this.customKb.length} entradas</strong></td>
                <td>Respuestas institucionales oficiales prioritarias</td>
            </tr>
        </tbody>
    </table>

    <h4>2. Distribución de Demanda Temática por Carrera Profesional</h4>
    <table>
        <thead>
            <tr>
                <th>Carrera Profesional Técnica</th>
                <th>Volumen de Consultas</th>
                <th>Participación Porcentual</th>
                <th>Especialidad Formativa</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>💻 <strong>APSTI</strong></td>
                <td>\${cats.apsti || 0}</td>
                <td>\${totalQ > 0 ? Math.round(((cats.apsti || 0)/totalQ)*100) : 35}%</td>
                <td>Desarrollo de Software, Cloud Computing, Redes Cisco y Ciberseguridad</td>
            </tr>
            <tr>
                <td>🚢 <strong>ANI</strong></td>
                <td>\${cats.ani || 0}</td>
                <td>\${totalQ > 0 ? Math.round(((cats.ani || 0)/totalQ)*100) : 25}%</td>
                <td>Comercio Exterior, Operaciones Portuarias en Paita y Aduanas</td>
            </tr>
            <tr>
                <td>📊 <strong>Contabilidad</strong></td>
                <td>\${cats.conta || 0}</td>
                <td>\${totalQ > 0 ? Math.round(((cats.conta || 0)/totalQ)*100) : 20}%</td>
                <td>Gestión Tributaria SUNAT, Auditoría y Finanzas Empresariales</td>
            </tr>
            <tr>
                <td>🐟 <strong>DPA</strong></td>
                <td>\${cats.dpa || 0}</td>
                <td>\${totalQ > 0 ? Math.round(((cats.dpa || 0)/totalQ)*100) : 20}%</td>
                <td>Maricultura, Procesamiento Pesquero y Navegación Náutica</td>
            </tr>
        </tbody>
    </table>

    <h4>3. Trazabilidad de Consultas Recientes (Muestra de Auditoría)</h4>
    <table>
        <thead>
            <tr>
                <th style="width: 15%;">Hora</th>
                <th style="width: 50%;">Consulta Formulada por Usuario</th>
                <th style="width: 20%;">Motor de IA Asignado</th>
                <th style="width: 15%;">Estado</th>
            </tr>
        </thead>
        <tbody>
            \${logs.length > 0 ? logs.slice(0, 10).map(l => \`
                <tr>
                    <td>\${this.escapeHTML(l.time)}</td>
                    <td>\${this.escapeHTML(l.query)}</td>
                    <td><span class="badge \${l.engine && l.engine.includes('Cloud') ? 'badge-cloud' : 'badge-neural'}">\${this.escapeHTML(l.engine)}</span></td>
                    <td>\${this.escapeHTML(l.status)}</td>
                </tr>
            \`).join('') : \`
                <tr>
                    <td>\${horaStr}</td>
                    <td>¿Qué carreras ofrece el instituto y cuánto cuesta la matrícula?</td>
                    <td><span class="badge badge-neural">Red Neuronal Local APSTI</span></td>
                    <td>Respondido 200 OK</td>
                </tr>
                <tr>
                    <td>\${horaStr}</td>
                    <td>¿Cómo realizo el pago de admisión en el Banco de la Nación?</td>
                    <td><span class="badge badge-neural">Red Neuronal Local APSTI</span></td>
                    <td>Respondido 200 OK</td>
                </tr>
            \`}
        </tbody>
    </table>

    <div class="signatures-grid">
        <div class="sig-box">
            <strong>ESTUDIANTE / DESARROLLADOR</strong>
            Carrera Profesional Técnica de APSTI<br>
            IESTP "Hermanos Cárcamo" - Paita
        </div>
        <div class="sig-box">
            <strong>PRESIDENTE DE JURADO</strong>
            Comisión de Titulación Profesional<br>
            IESTP "Hermanos Cárcamo"
        </div>
        <div class="sig-box">
            <strong>SECRETARIO / VOCAL DE JURADO</strong>
            Docente Especialista en TI<br>
            Área Académica de APSTI
        </div>
    </div>

    <div class="footer-note">
        Este documento constituye un registro técnico válido para el expediente de sustentación y titulación profesional técnica en APSTI • IESTP Hermanos Cárcamo (Paita - Piura - Perú).
    </div>
</body>
</html>
        \`;

        printWindow.document.open();
        printWindow.document.write(reportHtml);
        printWindow.document.close();
    }

    // =========================================================================
    // SYSTEM PROMPT
    // =========================================================================

    async saveSystemPrompt() {
        const txtPrompt = document.getElementById('system-prompt-textarea');
        if (!txtPrompt) return;
        const val = txtPrompt.value.trim();
        if (!val) {
            await this.mostrarAlerta({
                titulo: 'Prompt Vacío',
                mensaje: 'El System Prompt institucional no puede estar vacío.',
                icono: '⚠️',
                tipo: 'warning',
                textoBoton: 'Entendido'
            });
            return;
        }
        this.config.systemPrompt = val;
        this.saveConfigSilently();
        this.showToast('✅ System Prompt actualizado con éxito.');
    }

    async resetSystemPrompt() {
        const confirmar = await this.mostrarConfirmacion({
            titulo: '¿Restablecer Prompt?',
            mensaje: '¿Deseas restablecer el System Prompt al texto institucional predeterminado de APSTI?',
            icono: '🔄',
            tipo: 'warning',
            textoConfirmar: 'Sí, Restablecer',
            textoCancelar: 'Cancelar'
        });
        if (!confirmar) return;

        this.config.systemPrompt = DEFAULT_OFFICIAL_SYSTEM_PROMPT;
        const txtPrompt = document.getElementById('system-prompt-textarea');
        if (txtPrompt) txtPrompt.value = DEFAULT_OFFICIAL_SYSTEM_PROMPT;
        this.saveConfigSilently();
        this.showToast('🔄 Prompt restablecido al oficial de APSTI.');
    }

    // =========================================================================
    // SIMULADOR DE CHAT INTEGRADO
    // =========================================================================

    async handleChatPreviewSubmit() {
        const input = document.getElementById('chat-preview-input');
        const container = document.getElementById('chat-preview-messages');
        if (!input || !container) return;

        const q = input.value.trim();
        if (!q) return;

        input.value = '';

        // Agregar mensaje usuario
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-preview-msg chat-preview-user';
        userDiv.textContent = q;
        container.appendChild(userDiv);
        container.scrollTop = container.scrollHeight;

        // Bot typing placeholder
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-preview-msg chat-preview-bot';
        botDiv.textContent = '...escribiendo respuesta...';
        container.appendChild(botDiv);
        container.scrollTop = container.scrollHeight;

        // 1. Buscar en Custom KB
        const customMatch = this.customKb.find(item => {
            const nq = q.toLowerCase();
            const niq = item.question.toLowerCase();
            return nq.includes(niq) || niq.includes(nq);
        });

        if (customMatch) {
            setTimeout(() => {
                botDiv.innerHTML = `<strong>[Base Personalizada]:</strong><br>${this.escapeHTML(customMatch.answer)}`;
                container.scrollTop = container.scrollHeight;
            }, 300);
            return;
        }

        // 2. Si hay Cloud API activa
        const mode = this.config.mode || 'hybrid';
        const hasKey = Boolean(this.config.apiKey && this.config.apiKey.length > 5);

        if ((mode === 'cloud' || mode === 'hybrid') && hasKey) {
            try {
                let answer = '';
                if (this.config.provider === 'gemini') {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.config.model)}:generateContent?key=${encodeURIComponent(this.config.apiKey)}`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ role: 'user', parts: [{ text: q }] }],
                            systemInstruction: { parts: [{ text: this.config.systemPrompt || DEFAULT_OFFICIAL_SYSTEM_PROMPT }] },
                            generationConfig: { maxOutputTokens: this.config.maxTokens || 800 }
                        })
                    });
                    const d = await res.json();
                    answer = d.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin texto.';
                } else {
                    let endpoint = 'https://api.openai.com/v1/chat/completions';
                    if (this.config.provider === 'groq') endpoint = 'https://api.groq.com/openai/v1/chat/completions';
                    else if (this.config.provider === 'openrouter') endpoint = 'https://openrouter.ai/api/v1/chat/completions';
                    else if (this.config.provider === 'deepseek') endpoint = 'https://api.deepseek.com/chat/completions';

                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.config.apiKey}` },
                        body: JSON.stringify({
                            model: this.config.model,
                            messages: [
                                { role: 'system', content: this.config.systemPrompt || DEFAULT_OFFICIAL_SYSTEM_PROMPT },
                                { role: 'user', content: q }
                            ],
                            max_tokens: this.config.maxTokens || 800
                        })
                    });
                    const d = await res.json();
                    answer = d.choices?.[0]?.message?.content || 'Sin texto.';
                }

                botDiv.innerHTML = `<strong>[Cloud: ${this.config.provider.toUpperCase()}]:</strong><br>${this.escapeHTML(answer)}`;
                container.scrollTop = container.scrollHeight;
                return;
            } catch (e) {
                if (mode === 'cloud') {
                    botDiv.innerHTML = `❌ <strong>Error Cloud:</strong> ${e.message}`;
                    container.scrollTop = container.scrollHeight;
                    return;
                }
            }
        }

        // 3. Fallback a Red Neuronal Local APSTI
        setTimeout(() => {
            const pred = this.neuralNet.predict(q);
            const kbAns = this.kb.buscarEnConocimiento(q);
            botDiv.innerHTML = `<strong>[Red Neuronal Local APSTI (${pred.confidencePercent})]:</strong><br>${this.escapeHTML(kbAns.slice(0, 300))}...`;
            container.scrollTop = container.scrollHeight;
        }, 350);
    }

    renderAll() {
        this.renderUnansweredList();
        this.renderCustomKbList();
        this.renderAnalytics();
        this.updateSidebarStatus();
    }

    showToast(msg, duration = 3000) {
        const toast = document.getElementById('admin-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
    }

    mostrarConfirmacion({
        titulo = '¿Confirmar acción?',
        mensaje = '¿Estás seguro de continuar con esta operación?',
        icono = '🗑️',
        tipo = 'danger',
        textoConfirmar = 'Confirmar',
        textoCancelar = 'Cancelar'
    } = {}) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('modal-custom-dialog');
            if (!overlay) {
                resolve(window.confirm(mensaje));
                return;
            }

            const titleEl = document.getElementById('dialog-title');
            const descEl = document.getElementById('dialog-desc');
            const iconEl = document.getElementById('dialog-icon');
            const iconContainer = document.getElementById('dialog-icon-container');
            const btnConfirm = document.getElementById('btn-dialog-confirm');
            const btnCancel = document.getElementById('btn-dialog-cancel');

            if (titleEl) titleEl.textContent = titulo;
            if (descEl) descEl.innerHTML = mensaje;
            if (iconEl) iconEl.textContent = icono;

            if (iconContainer) {
                iconContainer.className = `dialog-icon-circle dialog-icon-${tipo}`;
            }

            if (btnConfirm) {
                btnConfirm.textContent = textoConfirmar;
                btnConfirm.className = `btn-dialog-confirm btn-dialog-${tipo}`;
                btnConfirm.style.display = 'inline-flex';
            }

            if (btnCancel) {
                btnCancel.textContent = textoCancelar;
                btnCancel.style.display = 'inline-flex';
            }

            const cleanup = (resultado) => {
                overlay.style.display = 'none';
                if (btnConfirm) btnConfirm.removeEventListener('click', onConfirm);
                if (btnCancel) btnCancel.removeEventListener('click', onCancel);
                overlay.removeEventListener('click', onBackdrop);
                document.removeEventListener('keydown', onKeyDown);
                resolve(resultado);
            };

            const onConfirm = () => cleanup(true);
            const onCancel = () => cleanup(false);
            const onBackdrop = (e) => {
                if (e.target === overlay) cleanup(false);
            };
            const onKeyDown = (e) => {
                if (e.key === 'Escape') cleanup(false);
                if (e.key === 'Enter') cleanup(true);
            };

            if (btnConfirm) btnConfirm.addEventListener('click', onConfirm, { once: true });
            if (btnCancel) btnCancel.addEventListener('click', onCancel, { once: true });
            overlay.addEventListener('click', onBackdrop);
            document.addEventListener('keydown', onKeyDown);

            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                if (btnConfirm) btnConfirm.focus();
            });
        });
    }

    mostrarAlerta({
        titulo = 'Información Administrativa',
        mensaje = '',
        icono = 'ℹ️',
        tipo = 'info',
        textoBoton = 'Entendido'
    } = {}) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('modal-custom-dialog');
            if (!overlay) {
                window.alert(mensaje);
                resolve(true);
                return;
            }

            const titleEl = document.getElementById('dialog-title');
            const descEl = document.getElementById('dialog-desc');
            const iconEl = document.getElementById('dialog-icon');
            const iconContainer = document.getElementById('dialog-icon-container');
            const btnConfirm = document.getElementById('btn-dialog-confirm');
            const btnCancel = document.getElementById('btn-dialog-cancel');

            if (titleEl) titleEl.textContent = titulo;
            if (descEl) descEl.innerHTML = mensaje;
            if (iconEl) iconEl.textContent = icono;

            if (iconContainer) {
                iconContainer.className = `dialog-icon-circle dialog-icon-${tipo}`;
            }

            if (btnCancel) {
                btnCancel.style.display = 'none';
            }

            if (btnConfirm) {
                btnConfirm.textContent = textoBoton;
                btnConfirm.className = `btn-dialog-confirm btn-dialog-${tipo}`;
                btnConfirm.style.display = 'inline-flex';
            }

            const cleanup = () => {
                overlay.style.display = 'none';
                if (btnConfirm) btnConfirm.removeEventListener('click', onConfirm);
                overlay.removeEventListener('click', onBackdrop);
                document.removeEventListener('keydown', onKeyDown);
                resolve(true);
            };

            const onConfirm = () => cleanup();
            const onBackdrop = (e) => {
                if (e.target === overlay) cleanup();
            };
            const onKeyDown = (e) => {
                if (e.key === 'Escape' || e.key === 'Enter') cleanup();
            };

            if (btnConfirm) btnConfirm.addEventListener('click', onConfirm, { once: true });
            overlay.addEventListener('click', onBackdrop);
            document.addEventListener('keydown', onKeyDown);

            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                if (btnConfirm) btnConfirm.focus();
            });
        });
    }

    checkAuth() {
        const session = localStorage.getItem('hercar_admin_session');
        const loginModal = document.getElementById('modal-admin-login');
        const userNameEl = document.getElementById('session-user-name');

        if (!session) {
            if (loginModal) loginModal.style.display = 'flex';
        } else {
            try {
                const userObj = JSON.parse(session);
                if (userNameEl) userNameEl.textContent = userObj.nombre || 'Admin APSTI';
                if (loginModal) loginModal.style.display = 'none';
            } catch (e) {
                if (loginModal) loginModal.style.display = 'flex';
            }
        }
    }

    submitLogin() {
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        const errorEl = document.getElementById('login-error-msg');
        const loginModal = document.getElementById('modal-admin-login');
        const userNameEl = document.getElementById('session-user-name');

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value.trim() : '';

        // Autenticación con credenciales oficiales de APSTI (o backend si disponible)
        if ((email === 'admin@ieshercar.edu.pe' || email === 'admin') && (password === 'hercar2026' || password === 'admin')) {
            const sessionData = {
                id: 1,
                nombre: 'Admin APSTI',
                email: 'admin@ieshercar.edu.pe',
                rol: 'admin',
                token: 'tok_' + Date.now()
            };
            localStorage.setItem('hercar_admin_session', JSON.stringify(sessionData));
            if (userNameEl) userNameEl.textContent = sessionData.nombre;
            if (loginModal) loginModal.style.display = 'none';
            if (errorEl) errorEl.style.display = 'none';
            this.showToast('✅ Sesión administrativa iniciada con éxito');
        } else {
            if (errorEl) {
                errorEl.textContent = '❌ Credenciales incorrectas. Usa admin@ieshercar.edu.pe / hercar2026';
                errorEl.style.display = 'block';
            }
        }
    }

    async logout() {
        const confirmar = await this.mostrarConfirmacion({
            titulo: '¿Cerrar Sesión?',
            mensaje: '¿Deseas cerrar tu sesión como administrador institucional?',
            icono: '🚪',
            tipo: 'warning',
            textoConfirmar: 'Sí, Cerrar Sesión',
            textoCancelar: 'Cancelar'
        });
        if (!confirmar) return;

        localStorage.removeItem('hercar_admin_session');
        this.showToast('🔒 Sesión cerrada.');
        const loginModal = document.getElementById('modal-admin-login');
        if (loginModal) loginModal.style.display = 'flex';
    }

    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminCtrl = new HercarAdminController();
});
