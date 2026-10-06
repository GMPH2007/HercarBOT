/**
 * MOTOR DE VOZ PROFESIONAL FEMENINA (TTS & STT) - IESTP HERMANOS CÁRCAMO
 * - Voz Neural Femenina de Estudio: es-ES-ElviraNeural (Por defecto) / es-MX-DaliaNeural / es-PE-CamilaNeural
 * - Fallback Web Speech API con filtrado estricto de voces femeninas en español
 * - Lectura optimizada y concisa (solo títulos o resúmenes breves)
 * - Micro-interacciones de micrófono con efecto Ripple
 */

class VoiceEngineHercar {
    constructor() {
        this.enabled = true;
        this.isSpeaking = false;
        this.isListening = false;
        this.currentAudio = null;
        this.speechSynthesis = window.speechSynthesis || null;
        this.selectedBrowserVoice = null;
        
        // Calibración acústica para voz femenina sumamente dulce, suave, delicada y humana
        this.voiceSpeed = 0.93; // 93% de velocidad: cadencia pausada, dulce y natural
        this.voicePitch = 1.05; // Tono dulce, femenino, cálido y cristalino
        
        // Detección de host estático: en GitHub Pages o archivo local no hay servidor Python
        const isStaticHost = window.location.protocol === 'file:' || 
                             window.location.hostname.includes('github.io') ||
                             window.location.hostname.includes('vercel.app') ||
                             window.location.hostname.includes('netlify.app');
        this.backendAvailable = !isStaticHost;
        
        // Voz neural de máxima dulzura y suavidad por defecto: Dalia (Latinoamericana dulce y suave)
        this.preferredNeuralVoice = 'es-MX-DaliaNeural';
        this.lastHoverTime = 0;

        this.initBrowserVoices();
        this.initSpeechRecognition();
        this.setupAudioUnlock();
        this.setupAudioPopover();
    }

    setupAudioUnlock() {
        const unlock = () => {
            if (this.speechSynthesis && this.speechSynthesis.paused) {
                this.speechSynthesis.resume();
            }
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });
    }

    setupAudioPopover() {
        document.addEventListener('DOMContentLoaded', () => {
            const btnAudioSettings = document.getElementById('btn-audio-settings');
            const audioPopover = document.getElementById('audio-popover');
            const btnClosePopover = document.getElementById('btn-close-popover');
            const btnVoiceToggle = document.getElementById('btn-voice-toggle');
            const voiceSwitchText = document.getElementById('voice-switch-text');
            const voiceBadgeIndicator = document.getElementById('voice-badge-indicator');
            const voiceSelect = document.getElementById('voice-select');
            const btnTestVoice = document.getElementById('btn-test-voice');

            if (btnAudioSettings && audioPopover) {
                btnAudioSettings.addEventListener('click', (e) => {
                    e.stopPropagation();
                    audioPopover.classList.toggle('open');
                });
            }

            if (btnClosePopover && audioPopover) {
                btnClosePopover.addEventListener('click', () => {
                    audioPopover.classList.remove('open');
                });
            }

            // Cerrar popover al hacer clic fuera
            document.addEventListener('click', (e) => {
                if (audioPopover && !audioPopover.contains(e.target) && e.target !== btnAudioSettings) {
                    audioPopover.classList.remove('open');
                }
            });

            if (btnVoiceToggle) {
                btnVoiceToggle.addEventListener('click', () => {
                    const active = this.toggleMute();
                    if (active) {
                        btnVoiceToggle.classList.remove('is-muted');
                        if (voiceSwitchText) voiceSwitchText.textContent = 'Activada';
                        if (voiceBadgeIndicator) voiceBadgeIndicator.style.background = '#10b981';
                        if (btnAudioSettings) btnAudioSettings.classList.remove('muted');
                    } else {
                        btnVoiceToggle.classList.add('is-muted');
                        if (voiceSwitchText) voiceSwitchText.textContent = 'Silenciada';
                        if (voiceBadgeIndicator) voiceBadgeIndicator.style.background = '#ef4444';
                        if (btnAudioSettings) btnAudioSettings.classList.add('muted');
                    }
                });
            }

            if (voiceSelect) {
                voiceSelect.addEventListener('change', (e) => {
                    this.setVozPreferida(e.target.value);
                });
            }

            if (btnTestVoice) {
                btnTestVoice.addEventListener('click', () => {
                    this.probarVozDemostracion();
                });
            }
        });
    }

    initBrowserVoices() {
        if (!this.speechSynthesis) return;

        const loadVoices = () => {
            const voice = this.getBestBrowserVoice(this.preferredNeuralVoice);
            if (voice) {
                this.selectedBrowserVoice = voice;
                console.log('[Voz Navegador Seleccionada]:', voice.name);
            }
        };

        loadVoices();
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    /**
     * Selecciona inteligentemente la mejor voz femenina en español disponible en el navegador
     * buscando coincidencias con voces dulces y naturales (Dalia, Camila, Salome, Elvira, etc.)
     */
    getBestBrowserVoice(preferredKey) {
        if (!this.speechSynthesis) return null;
        const voices = this.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return null;

        // Filtrar estrictamente voces en español
        const spanishVoices = voices.filter(v => 
            v.lang && (v.lang.startsWith('es') || v.lang.includes('Spanish') || v.lang.includes('Castilian'))
        );

        if (spanishVoices.length === 0) return voices[0] || null;

        // Si se especificó una voz favorita desde el selector
        if (preferredKey) {
            const keyLower = preferredKey.toLowerCase();
            let sub = '';
            if (keyLower.includes('dalia')) sub = 'dalia';
            else if (keyLower.includes('camila')) sub = 'camila';
            else if (keyLower.includes('salome')) sub = 'salome';
            else if (keyLower.includes('elvira')) sub = 'elvira';

            if (sub) {
                const direct = spanishVoices.find(v => v.name.toLowerCase().includes(sub));
                if (direct) return direct;
            }
        }

        // Lista priorizada de voces dulces y naturales en español
        const sweetNames = ['dalia', 'camila', 'salome', 'salomé', 'sabina', 'paloma', 'paulina', 'lucia', 'monica', 'mónica', 'elena', 'elvira', 'sofia', 'esperanza', 'marta', 'rosa'];

        // 1. Prioridad: Voz Natural u Online con nombre dulce femenino
        let candidate = spanishVoices.find(v => 
            sweetNames.some(name => v.name.toLowerCase().includes(name)) && 
            (v.name.includes('Natural') || v.name.includes('Online'))
        );
        if (candidate) return candidate;

        // 2. Prioridad: Cualquier voz femenina identificada por nombre dulce
        candidate = spanishVoices.find(v => sweetNames.some(name => v.name.toLowerCase().includes(name)));
        if (candidate) return candidate;

        // 3. Prioridad: Voz de Google en español o marcada female
        candidate = spanishVoices.find(v => v.name.includes('Google') || v.name.toLowerCase().includes('female'));
        if (candidate) return candidate;

        // 4. Prioridad: Primera voz disponible en español
        return spanishVoices[0];
    }

    initSpeechRecognition() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            console.warn('Reconocimiento de voz no soportado en este navegador.');
            this.recognition = null;
            return;
        }

        this.recognition = new SpeechRec();
        this.recognition.lang = 'es-PE';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.detenerVoz();
            this.onListeningStateChange(true);
        };

        this.recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            if (this.onSpeechResult) {
                this.onSpeechResult(transcript, event.results[0].isFinal);
            }
        };

        this.recognition.onerror = (event) => {
            console.warn('Error en micrófono:', event.error);
            this.isListening = false;
            this.onListeningStateChange(false);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningStateChange(false);
        };
    }

    toggleListening() {
        if (!this.recognition) {
            if (window.hercarApp && typeof window.hercarApp.mostrarAlerta === 'function') {
                window.hercarApp.mostrarAlerta({
                    titulo: 'Micrófono No Compatible',
                    mensaje: 'Tu navegador no soporta entrada de voz por micrófono. Te recomendamos Google Chrome o Microsoft Edge para una experiencia óptima.',
                    icono: '🎙️',
                    tipo: 'warning',
                    textoBoton: 'Entendido'
                });
            } else {
                alert('Tu navegador no soporta entrada de voz por micrófono. Te recomendamos Google Chrome o Microsoft Edge.');
            }
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            try {
                this.recognition.start();
            } catch (e) {
                console.error('Error al iniciar micrófono:', e);
            }
        }
    }

    onListeningStateChange(listening) {
        const micBtn = document.getElementById('btn-mic');
        const micWrapper = document.querySelector('.mic-button-wrapper');
        const micPulse = document.getElementById('mic-pulse-indicator');
        const inputBox = document.getElementById('chat-input-box');

        if (listening) {
            if (micBtn) {
                micBtn.classList.add('listening');
                micBtn.title = 'Escuchando tu voz... Clic para detener';
            }
            if (micWrapper) micWrapper.classList.add('is-recording');
            if (micPulse) micPulse.style.display = 'flex';
            if (inputBox) inputBox.style.borderColor = '#ef4444';
        } else {
            if (micBtn) {
                micBtn.classList.remove('listening');
                micBtn.title = 'Hablar con el micrófono';
            }
            if (micWrapper) micWrapper.classList.remove('is-recording');
            if (micPulse) micPulse.style.display = 'none';
            if (inputBox) inputBox.style.borderColor = '';
        }
    }

    setVozPreferida(vozKey) {
        if (vozKey === 'browser') {
            this.preferredNeuralVoice = null;
        } else {
            this.preferredNeuralVoice = vozKey;
        }
        this.selectedBrowserVoice = this.getBestBrowserVoice(this.preferredNeuralVoice);
        // Reproducir muestra sonora inmediata para apreciar la dulzura de la voz
        this.probarVozDemostracion();
    }

    anunciarTitulo(titulo) {
        // Desactivado: El bot no hablará por simple movimiento del ratón
        return;
    }

    /**
     * Extrae un resumen sumamente dulce, natural, fonéticamente armónico y fluido para la voz
     * omitiendo tecnicismos secos, tablas y símbolos
     */
    limpiarTextoParaVoz(texto) {
        if (!texto) return '';

        let clean = texto;

        // 1. Títulos en Markdown y encabezados: asegurar punto final para cadencia adecuada
        clean = clean
            .replace(/(\*\*[A-ZÁÉÍÓÚ\s\(\)]+\*\*)\s*\n+/g, '$1.\n')
            .replace(/#{1,6}\s*([^\n\r]+)/g, '$1.\n')
            .replace(/^\s*[\*\•\-]\s*(.*?)$/gm, '$1.');

        // 2. Números romanos en módulos y semestres para articulación natural
        clean = clean
            .replace(/\bMódulo\s+I\b/gi, 'Módulo uno')
            .replace(/\bMódulo\s+II\b/gi, 'Módulo dos')
            .replace(/\bMódulo\s+III\b/gi, 'Módulo tres')
            .replace(/\bMódulo\s+IV\b/gi, 'Módulo cuatro')
            .replace(/\bMódulo\s+V\b/gi, 'Módulo cinco')
            .replace(/\bMódulo\s+VI\b/gi, 'Módulo seis')
            .replace(/\bSemestre\s+I\b/gi, 'Semestre uno')
            .replace(/\bSemestre\s+II\b/gi, 'Semestre dos')
            .replace(/\bSemestre\s+III\b/gi, 'Semestre tres')
            .replace(/\bSemestre\s+IV\b/gi, 'Semestre cuatro')
            .replace(/\bSemestre\s+V\b/gi, 'Semestre cinco')
            .replace(/\bSemestre\s+VI\b/gi, 'Semestre seis')
            .replace(/\bCiclo\s+I\b/gi, 'Ciclo uno')
            .replace(/\bCiclo\s+II\b/gi, 'Ciclo dos')
            .replace(/\bCiclo\s+III\b/gi, 'Ciclo tres')
            .replace(/\bCiclo\s+IV\b/gi, 'Ciclo cuatro')
            .replace(/\bCiclo\s+V\b/gi, 'Ciclo cinco')
            .replace(/\bCiclo\s+VI\b/gi, 'Ciclo seis');

        // 3. Ordinales frecuentes
        clean = clean
            .replace(/\b1er\b/gi, 'primer')
            .replace(/\b2do\b/gi, 'segundo')
            .replace(/\b3er\b/gi, 'tercer')
            .replace(/\b4to\b/gi, 'cuarto')
            .replace(/\b5to\b/gi, 'quinto')
            .replace(/\b6to\b/gi, 'sexto');

        // 4. Reemplazos fonéticos naturales para español peruano y siglas institucionales
        clean = clean
            .replace(/\bI\.?E\.?S\.?T\.?P\.?\b/gi, 'Instituto')
            .replace(/\bIESTP\b/gi, 'Instituto')
            .replace(/\bHercarIA\b/gi, 'Hercaria')
            .replace(/S\/\.?\s*(\d+)/g, '$1 soles')
            .replace(/\((APSTI|Ápsti)\)/gi, ', Ápsti,')
            .replace(/\bAPSTI\b/g, 'Ápsti')
            .replace(/\bANI\b/g, 'Ani')
            .replace(/\bDPA\b/g, 'D P A')
            .replace(/\bSUNAT\b/gi, 'Sunat')
            .replace(/\bMINEDU\b/gi, 'Minedu')
            .replace(/\bTUPA\b/gi, 'Tupa')
            .replace(/\bDNI\b/gi, 'D N I')
            .replace(/\bAv\.\s*/gi, 'Avenida ')
            .replace(/\bUrb\.\s*/gi, 'Urbanización ')
            .replace(/\bMz\.\s*/gi, 'Manzana ')
            .replace(/\bLt\.\s*/gi, 'Lote ')
            .replace(/\betc\.\s*/gi, 'etcétera ')
            .replace(/\bpág\.\s*/gi, 'página ')
            .replace(/\bN°\s*/gi, 'número ');

        // 5. Suprimir numeraciones secas de listas "1.", "2."
        clean = clean.replace(/^\s*\d+[\.\)]\s*/gm, ' ');

        // 6. Colones al final de título convertidos en punto, y colones internos en coma suave
        clean = clean
            .replace(/:\s*(\n|$)/g, '.\n')
            .replace(/:/g, ', ');

        // 7. Limpieza absoluta de markdown, asteriscos, guiones, corchetes, comillas y enlaces
        clean = clean
            .replace(/<[^>]*>/g, ' ')                          // HTML
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')          // Links Markdown [Texto](url) -> Texto
            .replace(/https?:\/\/\S+/g, '')                    // URLs sin texto
            .replace(/[\*\_\#\~\`•\-–—|]/g, ' ')               // ¡ELIMINAR TODOS LOS ASTERISCOS, GUIONES Y BARRAS!
            .replace(/[()\[\]{}'\"«»“”„]/g, ' ')               // Paréntesis y comillas
            // Limpieza exhaustiva de emojis y símbolos gráficos
            .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
            .replace(/\s+/g, ' ')
            .trim();

        // 8. Segmentación por oraciones completas con cadencia armónica (sin cortar abruptamente)
        const matchOraciones = clean.match(/[^.!?]+[.!?]+/g);
        if (matchOraciones && matchOraciones.length > 0) {
            let resultado = '';
            for (let i = 0; i < matchOraciones.length; i++) {
                const oracion = matchOraciones[i].trim();
                if ((resultado + ' ' + oracion).length <= 360) {
                    resultado = resultado ? (resultado + ' ' + oracion) : oracion;
                } else {
                    break;
                }
            }
            clean = resultado || matchOraciones[0].trim();
        }

        if (!/[.!?]$/.test(clean)) {
            clean += '.';
        }

        return clean;
    }

    async hablar(textoOriginal) {
        if (!this.enabled) return;

        this.detenerVoz();
        const texto = this.limpiarTextoParaVoz(textoOriginal);
        if (!texto) return;

        // Si se seleccionó voz neural de estudio y el backend está disponible (servidor local)
        if (this.preferredNeuralVoice && this.backendAvailable) {
            try {
                this.setSpeakingState(true);
                const url = `/api/tts?voice=${encodeURIComponent(this.preferredNeuralVoice)}&text=${encodeURIComponent(texto)}`;
                const audio = new Audio();
                this.currentAudio = audio;

                audio.onended = () => {
                    this.setSpeakingState(false);
                    this.currentAudio = null;
                };

                audio.onerror = () => {
                    this.backendAvailable = false;
                    this.hablarConNavegador(texto);
                };

                audio.src = url;
                await audio.play();
                return;
            } catch (err) {
                this.backendAvailable = false;
            }
        }

        // Síntesis vocal humana y dulce del navegador (GitHub Pages y móviles)
        this.hablarConNavegador(texto);
    }

    hablarConNavegador(texto) {
        if (!this.speechSynthesis) {
            this.setSpeakingState(false);
            return;
        }

        try {
            this.speechSynthesis.cancel();

            // Pausa breve de 35ms para permitir que el sintetizador del navegador limpie su buffer
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(texto);
                
                const matchedVoice = this.getBestBrowserVoice(this.preferredNeuralVoice);
                if (matchedVoice) {
                    utterance.voice = matchedVoice;
                    utterance.lang = matchedVoice.lang || 'es-PE';
                } else {
                    utterance.lang = 'es-PE';
                }

                utterance.rate = this.voiceSpeed;
                utterance.pitch = this.voicePitch; // Tono dulce, suave y natural

                utterance.onstart = () => {
                    this.setSpeakingState(true);
                };

                utterance.onend = () => {
                    this.setSpeakingState(false);
                };

                utterance.onerror = (e) => {
                    console.warn('[SpeechSynthesis] Error:', e);
                    this.setSpeakingState(false);
                };

                this.speechSynthesis.speak(utterance);
            }, 35);
        } catch (e) {
            console.error('[SpeechSynthesis] Error general:', e);
            this.setSpeakingState(false);
        }
    }

    detenerVoz() {
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
        }

        if (this.speechSynthesis) {
            try {
                this.speechSynthesis.cancel();
            } catch (e) {}
        }

        this.setSpeakingState(false);
    }

    probarVozDemostracion() {
        const textoDemo = "¡Hola! Qué gusto saludarte. Soy HercarIA, tu orientadora virtual del Instituto Hermanos Cárcamo de Paita. ¿Qué carrera te gustaría consultar hoy?";
        this.hablar(textoDemo);
    }

    setSpeakingState(speaking) {
        this.isSpeaking = speaking;
        const voiceWaves = document.querySelectorAll('.speaking-wave, .voice-wave-anim');
        voiceWaves.forEach(w => {
            w.style.display = speaking ? 'inline-flex' : 'none';
        });
    }

    toggleMute() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.detenerVoz();
        }
        return this.enabled;
    }
}

// Export para uso en navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceEngineHercar;
}
