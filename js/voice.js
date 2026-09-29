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
        
        // Parámetros para voz femenina natural, fluida y clara
        this.voiceSpeed = 1.0;
        this.voicePitch = 1.0; // Tono natural sin distorsión
        this.backendAvailable = true;
        
        // Voz neural de chica por defecto: Camila (Chica Peruana - Dialecto Nacional Amable)
        this.preferredNeuralVoice = 'es-PE-CamilaNeural';
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
            const voices = this.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;

            // Filtrar estrictamente voces en español
            const spanishVoices = voices.filter(v => v.lang.startsWith('es') || v.lang.includes('Spanish') || v.lang.includes('Castilian'));

            // Buscar candidatas femeninas prioritarias en español
            const femaleNames = ['camila', 'sabina', 'dalia', 'elvira', 'paulina', 'elena', 'laura', 'monica', 'lucia', 'penelope', 'rosa', 'marta', 'zira', 'hilda', 'paloma', 'jimena', 'sofia', 'esperanza'];
            
            // 1. Prioridad: Voz Femenina Natural u Online en español
            let bestVoice = spanishVoices.find(v => 
                femaleNames.some(name => v.name.toLowerCase().includes(name)) && 
                (v.name.includes('Natural') || v.name.includes('Online'))
            );

            // 2. Prioridad: Cualquier voz femenina identificada por nombre
            if (!bestVoice) {
                bestVoice = spanishVoices.find(v => femaleNames.some(name => v.name.toLowerCase().includes(name)));
            }

            // 3. Prioridad: Voz femenina de Google o marcada female
            if (!bestVoice) {
                bestVoice = spanishVoices.find(v => v.name.includes('Google') || v.name.toLowerCase().includes('female'));
            }

            this.selectedBrowserVoice = bestVoice || spanishVoices[0] || voices[0];
            console.log('[Voz Femenina Navegador]:', this.selectedBrowserVoice?.name);
        };

        loadVoices();
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = loadVoices;
        }
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
            alert('Tu navegador no soporta entrada de voz por micrófono. Te recomendamos Google Chrome o Microsoft Edge.');
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
    }

    anunciarTitulo(titulo) {
        // Desactivado: El bot no hablará por simple movimiento del ratón
        return;
    }

    /**
     * Extrae un resumen conciso, natural y fonéticamente amigable para la voz
     * omitiendo tablas, links y detalles sobrecargados
     */
    limpiarTextoParaVoz(texto) {
        if (!texto) return '';

        let clean = texto;

        // 1. Reemplazos fonéticos de siglas e instituciones para que se pronuncien naturalmente
        clean = clean
            .replace(/\bI\.?E\.?S\.?T\.?P\.?\b/gi, 'Instituto')
            .replace(/\bIESTP\b/gi, 'Instituto')
            .replace(/\bHercarIA\b/gi, 'Hercaria')
            .replace(/S\/\.?\s*(\d+)/g, '$1 soles')
            .replace(/\bAPSTI\b/g, 'A P S T I')
            .replace(/\bANI\b/g, 'A N I')
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

        // 2. Limpieza de etiquetas HTML, links Markdown y emojis
        clean = clean
            .replace(/<[^>]*>/g, ' ')
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/https?:\/\/\S+/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/#{1,6}\s?/g, '')
            .replace(/[•\-\_]/g, ' ')
            .replace(/[💻🚢📊🐟🏆💡📝💳📖🔄⚙️🌍🌱📈🏢🌊⚓🌐🧠🤝📑🔬⚡📦🔍🛡️🚀🌸🇵🇪🇪🇸▶️🔊🔇🗑️💾]/gu, '')
            .replace(/\s+/g, ' ')
            .trim();

        // 3. Segmentación inteligente de oraciones por puntuación (evita romper siglas)
        const matchOraciones = clean.match(/[^.!?]+[.!?]+/g);
        if (matchOraciones && matchOraciones.length > 0) {
            let resultado = '';
            for (let i = 0; i < matchOraciones.length; i++) {
                const oracion = matchOraciones[i].trim();
                if ((resultado + ' ' + oracion).length <= 320) {
                    resultado = resultado ? resultado + ' ' + oracion : oracion;
                } else {
                    break;
                }
            }
            clean = resultado || matchOraciones[0];
        }

        if (clean.length > 320) {
            clean = clean.substring(0, 315) + '...';
        }

        return clean;
    }

    async hablar(textoOriginal) {
        if (!this.enabled) return;

        this.detenerVoz();
        const texto = this.limpiarTextoParaVoz(textoOriginal);
        if (!texto) return;

        this.setSpeakingState(true);

        // Si se seleccionó voz neural de estudio
        if (this.preferredNeuralVoice && this.backendAvailable) {
            try {
                const url = `/api/tts?voice=${encodeURIComponent(this.preferredNeuralVoice)}&text=${encodeURIComponent(texto)}`;
                const audio = new Audio(url);
                this.currentAudio = audio;

                audio.onended = () => {
                    this.setSpeakingState(false);
                    this.currentAudio = null;
                };

                audio.onerror = (e) => {
                    console.warn('[Voz Neural] Usando voz del navegador:', e);
                    this.backendAvailable = false;
                    this.hablarConNavegador(texto);
                };

                await audio.play();
                return;
            } catch (err) {
                console.warn('[Voz Neural] Error al reproducir audio neural:', err);
                this.backendAvailable = false;
            }
        }

        // Fallback al sintetizador del navegador
        this.hablarConNavegador(texto);
    }

    hablarConNavegador(texto) {
        if (!this.speechSynthesis) {
            this.setSpeakingState(false);
            return;
        }

        try {
            this.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'es-ES';
            utterance.rate = this.voiceSpeed;
            utterance.pitch = this.voicePitch; // Tono femenino dulce

            if (this.selectedBrowserVoice) {
                utterance.voice = this.selectedBrowserVoice;
            }

            utterance.onend = () => {
                this.setSpeakingState(false);
            };

            utterance.onerror = (e) => {
                console.warn('[SpeechSynthesis] Error:', e);
                this.setSpeakingState(false);
            };

            this.speechSynthesis.speak(utterance);
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
        const textoDemo = "¡Hola! Soy HercarIA, tu orientadora virtual del Instituto Hermanos Cárcamo de Paita. ¿Qué carrera te gustaría consultar?";
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
