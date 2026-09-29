/**
 * TEST VOCACIONAL INTELIGENTE - IESTP HERMANOS CÁRCAMO
 * Mapeo vocacional a las 4 carreras oficiales:
 * - APSTI: Arquitectura de Plataformas y Servicios de TI (Tecnología y Software)
 * - ANI: Administración de Negocios Internacionales (Comercio exterior y logística portuaria)
 * - Contabilidad: Contabilidad y Finanzas (Economía, tributación y orden)
 * - DPA: Desarrollo Pesquero y Acuícola (Biología marina, producción pesquera y acuicultura)
 */

class TestVocacionalHercar {
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.isActive = false;
        this.currentQuestionIndex = 0;
        this.scores = {
            apsti: 0,
            ani: 0,
            contabilidad: 0,
            dpa: 0
        };

        this.questions = [
            {
                id: 1,
                titulo: 'Intereses y Pasiones',
                pregunta: '¿Qué tipo de actividad te llama más la atención en tu tiempo libre o en proyectos?',
                opciones: [
                    {
                        texto: 'Explorar aplicaciones, entender cómo funcionan los programas, videojuegos o configurar dispositivos.',
                        carrera: 'apsti',
                        icono: '💻'
                    },
                    {
                        texto: 'Descubrir cómo se negocian productos a nivel mundial, aprender sobre aduanas, puertos y transporte marítimo.',
                        carrera: 'ani',
                        icono: '🚢'
                    },
                    {
                        texto: 'Administrar presupuestos, ordenar gastos, analizar cuentas y asegurar que todo cuadre con exactitud.',
                        carrera: 'contabilidad',
                        icono: '📊'
                    },
                    {
                        texto: 'Estar en contacto con el mar, la vida marina, la crianza de peces/mariscos y la producción de alimentos del océano.',
                        carrera: 'dpa',
                        icono: '🐟'
                    }
                ]
            },
            {
                id: 2,
                titulo: 'Habilidades y Destrezas',
                pregunta: '¿En cuál de estas tareas sientes que destacas o aprendes más rápido?',
                opciones: [
                    {
                        texto: 'Resolver problemas lógicos paso a paso, automatizar tareas y aprender herramientas digitales.',
                        carrera: 'apsti',
                        icono: '🧠'
                    },
                    {
                        texto: 'Liderar grupos, convencer personas, negociar acuerdos y planificar estrategias comerciales.',
                        carrera: 'ani',
                        icono: '🤝'
                    },
                    {
                        texto: 'Ser muy detallista, organizado con los números, registrar facturas y manejar normativas legales.',
                        carrera: 'contabilidad',
                        icono: '📑'
                    },
                    {
                        texto: 'El trabajo práctico, ciencias naturales, observar el crecimiento de especies y supervisar calidad biológica.',
                        carrera: 'dpa',
                        icono: '🔬'
                    }
                ]
            },
            {
                id: 3,
                titulo: 'Ambiente de Trabajo Soñado',
                pregunta: '¿Dónde te imaginas trabajando con mayor entusiasmo en el futuro?',
                opciones: [
                    {
                        texto: 'En una empresa de tecnología moderna, sala de servidores o trabajando de forma remota para cualquier parte del mundo.',
                        carrera: 'apsti',
                        icono: '🌐'
                    },
                    {
                        texto: 'En agencias marítimas de Paita, almacenes aduaneros o empresas exportadoras de productos norteños.',
                        carrera: 'ani',
                        icono: '⚓'
                    },
                    {
                        texto: 'En una oficina contable, departamento financiero, banco, caja municipal o asesorando empresas formalizadas.',
                        carrera: 'contabilidad',
                        icono: '🏢'
                    },
                    {
                        texto: 'En modernas plantas procesadoras de recursos marinos, criaderos acuícolas o en faenas a bordo de embarcaciones.',
                        carrera: 'dpa',
                        icono: '🌊'
                    }
                ]
            },
            {
                id: 4,
                titulo: 'Materias de Preferencia',
                pregunta: 'En la secundaria o en tus estudios, ¿cuáles materias o temas disfrutaste más?',
                opciones: [
                    {
                        texto: 'Computación, matemática aplicada, lógica, robótica o tecnología.',
                        carrera: 'apsti',
                        icono: '⚙️'
                    },
                    {
                        texto: 'Geografía mundial, ciencias sociales, economía, inglés o comunicación.',
                        carrera: 'ani',
                        icono: '🌍'
                    },
                    {
                        texto: 'Aritmética, estadística, educación para el trabajo, administración o finanzas personales.',
                        carrera: 'contabilidad',
                        icono: '📈'
                    },
                    {
                        texto: 'Biología, química, ciencias de la naturaleza, ecología o medio ambiente marino.',
                        carrera: 'dpa',
                        icono: '🌱'
                    }
                ]
            },
            {
                id: 5,
                titulo: 'Solución de Retos',
                pregunta: 'Frente a un problema grande en una empresa, ¿qué preferirías resolver?',
                opciones: [
                    {
                        texto: 'Crear un software o app que solucione las fallas y haga más rápida la atención a clientes.',
                        carrera: 'apsti',
                        icono: '⚡'
                    },
                    {
                        texto: 'Abrir un nuevo mercado en el extranjero para vender mangos, uvas, pota o perico a compradores internacionales.',
                        carrera: 'ani',
                        icono: '📦'
                    },
                    {
                        texto: 'Detectar dónde se están perdiendo ganancias, auditar gastos y optimizar el pago de impuestos ante la SUNAT.',
                        carrera: 'contabilidad',
                        icono: '🔍'
                    },
                    {
                        texto: 'Mejorar las técnicas de cultivo de conchas de abanico y garantizar que el pescado procesado cumpla estándares de exportación.',
                        carrera: 'dpa',
                        icono: '🛡️'
                    }
                ]
            },
            {
                id: 6,
                titulo: 'Meta Profesional en 3 Años',
                pregunta: 'Al culminar tus 3 años en el IESTP Hermanos Cárcamo y obtener tu título oficial, ¿cuál es tu mayor meta?',
                opciones: [
                    {
                        texto: 'Ser programador o administrador de sistemas en la nube y liderar la innovación tecnológica.',
                        carrera: 'apsti',
                        icono: '🚀'
                    },
                    {
                        texto: 'Dirigir operaciones de importación/exportación en agencias portuarias o crear mi propia exportadora.',
                        carrera: 'ani',
                        icono: '🏆'
                    },
                    {
                        texto: 'Tener mi propio estudio contable o ser jefe de finanzas de una empresa reconocida de Piura.',
                        carrera: 'contabilidad',
                        icono: '💼'
                    },
                    {
                        texto: 'Ser supervisor de calidad en la industria pesquera, gestionar centros de maricultura o navegar con tecnología avanzada.',
                        carrera: 'dpa',
                        icono: '🧭'
                    }
                ]
            }
        ];
    }

    iniciar() {
        this.isActive = true;
        this.currentQuestionIndex = 0;
        this.scores = { apsti: 0, ani: 0, contabilidad: 0, dpa: 0 };

        const introMsg = `🎓 **¡Bienvenido al Test Vocacional Oficial del IESTP Hermanos Cárcamo!**
        
Te haré **6 preguntas rápidas** para descubrir tu verdadera vocación y recomendarte la carrera que mejor se adapta a tus gustos, talentos y oportunidades laborales en Paita y el Perú.
        
Elige con sinceridad la opción que mejor te describa:`;

        this.chatApp.addBotMessage(introMsg, false);
        this.mostrarPreguntaActual();
    }

    mostrarPreguntaActual() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finalizarTest();
            return;
        }

        const q = this.questions[this.currentQuestionIndex];
        const numPregunta = this.currentQuestionIndex + 1;
        const total = this.questions.length;
        const porcentaje = Math.round((numPregunta / total) * 100);

        let html = `
        <div class="test-card">
            <div class="test-header">
                <div class="test-badge">Pregunta ${numPregunta} de ${total}</div>
                <div class="test-category">${q.titulo}</div>
            </div>
            <div class="test-progress-bar">
                <div class="test-progress-fill" style="width: ${porcentaje}%"></div>
            </div>
            <p class="test-question-text">${q.pregunta}</p>
            <div class="test-options">
        `;

        q.opciones.forEach((opcion, idx) => {
            html += `
                <button type="button" class="test-option-btn" onclick="window.hercarTest.seleccionarOpcion('${opcion.carrera}', ${idx})">
                    <span class="test-opt-icon">${opcion.icono}</span>
                    <span class="test-opt-text">${opcion.texto}</span>
                </button>
            `;
        });

        html += `
            </div>
            <div class="test-footer-actions">
                <button type="button" class="test-cancel-btn" onclick="window.hercarTest.cancelar()">Cancelar Test</button>
            </div>
        </div>
        `;

        this.chatApp.addBotInteractive(html, `Pregunta ${numPregunta}: ${q.pregunta}`);
    }

    seleccionarOpcion(carrera, idx) {
        if (!this.isActive) return;

        // Sumar puntaje
        if (this.scores[carrera] !== undefined) {
            this.scores[carrera] += 1;
        }

        // Feedback inmediato en el chat
        const q = this.questions[this.currentQuestionIndex];
        const opcionElegida = q.opciones[idx];
        this.chatApp.addUserMessage(`${opcionElegida.icono} ${opcionElegida.texto}`);

        this.currentQuestionIndex++;
        
        // Siguiente pregunta o reporte final
        setTimeout(() => {
            this.mostrarPreguntaActual();
        }, 350);
    }

    finalizarTest() {
        this.isActive = false;

        // Calcular porcentajes
        const totalPreguntas = this.questions.length;
        const carrerasInfo = {
            apsti: {
                nombre: 'Arquitectura de Plataformas y Servicios de T.I. (APSTI)',
                icono: '💻',
                tagline: 'Desarrollo de Software, Redes y Cloud Computing',
                id: 'apsti'
            },
            ani: {
                nombre: 'Administración de Negocios Internacionales (ANI)',
                icono: '🚢',
                tagline: 'Comercio Exterior, Logística Portuaria y Exportaciones',
                id: 'ani'
            },
            contabilidad: {
                nombre: 'Contabilidad',
                icono: '📊',
                tagline: 'Gestión Financiera, Auditoría y Tributación SUNAT',
                id: 'contabilidad'
            },
            dpa: {
                nombre: 'Desarrollo Pesquero y Acuícola (DPA)',
                icono: '🐟',
                tagline: 'Maricultura, Procesamiento Marino y Calidad Pesquera',
                id: 'dpa'
            }
        };

        // Ordenar carreras por puntaje
        const ranking = Object.keys(this.scores).map(key => {
            const porcentaje = Math.round((this.scores[key] / totalPreguntas) * 100);
            return {
                id: key,
                porcentaje: porcentaje,
                pts: this.scores[key],
                ...carrerasInfo[key]
            };
        }).sort((a, b) => b.pts - a.pts);

        const ganadora = ranking[0];
        const segunda = ranking[1];

        // Mensaje de voz y texto
        const textoVoz = `¡Excelente! He completado tu evaluación vocacional. Tu carrera ideal en el Instituto Hermanos Cárcamo es ${ganadora.nombre} con una afinidad del ${ganadora.porcentaje} por ciento. Tienes un perfil extraordinario para esta profesión técnica.`;

        let html = `
        <div class="test-result-card">
            <div class="test-result-trophy">🏆</div>
            <div class="test-result-header">
                <h3>¡Tu Carrera Ideal es:</h3>
                <h2 class="test-result-career">${ganadora.icono} ${ganadora.nombre}</h2>
                <p class="test-result-tagline">${ganadora.tagline}</p>
            </div>

            <div class="test-result-match-box">
                <span class="test-result-match-label">Compatibilidad Vocacional:</span>
                <span class="test-result-match-percent">${ganadora.porcentaje}% de Afinidad</span>
            </div>

            <p class="test-result-desc">
                Tus respuestas demuestran un gran potencial para <strong>${ganadora.nombre}</strong>. Tienes curiosidad innata, afinidad práctica con sus campos de acción y una gran oportunidad de inserción laboral en las principales empresas de Paita, Piura y todo el país.
            </p>

            <div class="test-ranking-section">
                <h4>Detalle de afinidad por carrera:</h4>
        `;

        ranking.forEach(c => {
            html += `
                <div class="test-rank-item">
                    <div class="test-rank-info">
                        <span>${c.icono} ${c.nombre}</span>
                        <span class="test-rank-pct">${c.porcentaje}%</span>
                    </div>
                    <div class="test-rank-bar">
                        <div class="test-rank-fill" style="width: ${Math.max(c.porcentaje, 8)}%"></div>
                    </div>
                </div>
            `;
        });

        html += `
            </div>

            <div class="test-secondary-note">
                💡 <em>Opción complementaria recomendada:</em> <strong>${segunda.icono} ${segunda.nombre}</strong> (${segunda.porcentaje}% afinidad).
            </div>

            <div class="test-result-actions">
                <button type="button" class="btn-action-primary" onclick="window.hercarApp.enviarConsultaDirecta('Cuéntame todo sobre la carrera de ${ganadora.id}')">
                    📖 Ver Malla y Perfil de ${ganadora.id.toUpperCase()}
                </button>
                <button type="button" class="btn-action-secondary" onclick="window.hercarApp.enviarConsultaDirecta('¿Cuáles son los requisitos de matrícula y admisión?')">
                    📝 Requisitos de Matrícula
                </button>
                <button type="button" class="btn-action-outline" onclick="window.hercarTest.iniciar()">
                    🔄 Repetir Test Vocacional
                </button>
            </div>
        </div>
        `;

        this.chatApp.addBotInteractive(html, textoVoz);
    }

    cancelar() {
        this.isActive = false;
        this.chatApp.addBotMessage('Has cancelado el test vocacional. No te preocupes, puedes preguntarme cualquier duda sobre las carreras, matrículas o métodos de pago cuando desees.', true);
    }
}

// Export para uso en navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestVocacionalHercar;
}
