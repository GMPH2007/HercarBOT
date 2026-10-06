/**
 * HERCARTIA - MOTOR DE RED NEURONAL ARTIFICIAL (MLP FEEDFORWARD)
 * Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios TI (APSTI)
 * IESTP "Hermanos Cárcamo" - Paita, Piura
 * 
 * Versión 5.1 Neuronal Ampliada con Mallas, Titulación, Beca 18, SIGA y Conceptos Técnicos
 */

class HercarNeuralNetwork {
    constructor() {
        this.intents = [
            'test_vocacional',
            'carrera_apsti',
            'carrera_ani',
            'carrera_contabilidad',
            'carrera_dpa',
            'malla_curricular',
            'todas_carreras',
            'matricula_costos',
            'admision_examen',
            'temario_admision',
            'titulacion_efsrt',
            'pagos_vouchers',
            'cuenta_bancaria_codigos',
            'boletas_electronicas',
            'mesa_partes_tramites',
            'duracion_semestres',
            'convalidacion_sunedu',
            'titulo_oficial',
            'turnos_horarios',
            'edad_limite',
            'convenios_practicas',
            'becas_beneficios',
            'carnet_pasaje',
            'como_llegar_transporte',
            'plataforma_siga',
            'biblioteca_virtual',
            'ubicacion_contacto',
            'historia_institucion',
            'simulador_tupa',
            'mapa_campus',
            'quien_te_creo',
            'conceptos_tecnologia',
            'saludo',
            'agradecimiento',
            'desconocido'
        ];

        this.intentLabels = {
            'test_vocacional': 'Orientación y Test Vocacional Psicométrico',
            'carrera_apsti': 'Carrera APSTI (Desarrollo, Redes y Cloud)',
            'carrera_ani': 'Carrera ANI (Comercio Exterior y Aduanas)',
            'carrera_contabilidad': 'Carrera Contabilidad (Tributación y Finanzas)',
            'carrera_dpa': 'Carrera DPA (Pesquería y Maricultura)',
            'malla_curricular': 'Malla Curricular y Cursos Semestre a Semestre',
            'todas_carreras': 'Oferta Formativa Global (Las 4 Carreras)',
            'matricula_costos': 'Matrícula, Tasas TUPA y Gratuidad Pública',
            'admision_examen': 'Admisión, Requisitos y Examen Ordinario',
            'temario_admision': 'Temario de Estudio para Examen de Admisión',
            'titulacion_efsrt': 'Requisitos de Titulación y Prácticas EFSRT',
            'pagos_vouchers': 'Registro de Vouchers en pagos.ieshercar.edu.pe',
            'cuenta_bancaria_codigos': 'Número de Cuenta Banco de la Nación y Códigos de Pago',
            'boletas_electronicas': 'Consulta y Descarga de Boletas Electrónicas',
            'mesa_partes_tramites': 'Mesa de Partes Virtual y Trámites FUT',
            'duracion_semestres': 'Duración Formativa (3 Años / 6 Semestres)',
            'convalidacion_sunedu': 'Convalidación Universitaria (SUNEDU / Ley 30512)',
            'titulo_oficial': 'Título Profesional Técnico (MINEDU)',
            'turnos_horarios': 'Turnos Diurnos y Horarios de Clases',
            'edad_limite': 'Requisitos de Edad (Sin Límite)',
            'convenios_practicas': 'Convenios y Prácticas en el Puerto de Paita',
            'becas_beneficios': 'Becas y Programas de Apoyo (Beca 18 PRONABEC)',
            'carnet_pasaje': 'Carnet Oficial de Medio Pasaje MINEDU',
            'como_llegar_transporte': 'Rutas de Transporte y Cómo Llegar al Instituto',
            'plataforma_siga': 'Sistema Académico SIGA Web (Notas y Asistencia)',
            'biblioteca_virtual': 'Biblioteca Virtual Institucional (Libros)',
            'ubicacion_contacto': 'Sede Institucional, Ubicación y Teléfonos',
            'historia_institucion': 'Historia Institucional y Héroes Cárcamo',
            'simulador_tupa': 'Simulador de Matrícula y Cuotas TUPA',
            'mapa_campus': 'Mapa Interactivo de Instalaciones y Laboratorios',
            'quien_te_creo': 'Autor y Desarrollador de la IA (APSTI)',
            'conceptos_tecnologia': 'Conceptos Técnicos de Computación e Innovación',
            'saludo': 'Protocolo de Saludo y Bienvenida',
            'agradecimiento': 'Agradecimiento y Despedida Cortés',
            'desconocido': 'Consulta Abierta / Fallback Semántico'
        };

        // Vocabulario enriquecido (260 dimensiones normalizadas)
        this.vocabulary = [
            'test', 'vocacion', 'vocacional', 'estudiar', 'elegir', 'escoger', 'recomiend', 'aptitud', 'indecis',
            'apsti', 'sistem', 'comput', 'softwar', 'program', 'desarroll', 'red', 'cisco', 'servidor', 'cloud', 'web', 'bd', 'ti', 'tecnolog', 'ia', 'codigo',
            'ani', 'negoci', 'internacional', 'aduan', 'puert', 'comerci', 'exterior', 'export', 'import', 'contened', 'flet', 'maritim', 'logist', 'reefer', 'incoterm',
            'contabil', 'tribut', 'sunat', 'finanz', 'auditor', 'libr', 'electronic', 'declar', 'igv', 'rent', 'balance', 'fiscal', 'cuent', 'sire', 'factur',
            'dpa', 'pesqu', 'acuicol', 'maricultur', 'conch', 'abanic', 'langostin', 'barc', 'embarcac', 'haccp', 'congel', 'pesc', 'harin', 'mar', 'bahia',
            'mall', 'curs', 'mater', 'asignatur', 'plan', 'estudi', 'silab', 'ciclo', 'primer', 'segund', 'tercer', 'cuart', 'quint', 'sext',
            'carrer', 'ofert', 'opcion', 'programas', 'cuant', 'dur', 'ao', 'semestr', 'cicl', 'modul', 'titul', 'nacion', 'minedu', 'efsrt', 'practic', 'ingles', 'proyect', 'sustent',
            'matricul', 'cost', 'pag', 'gratis', 'mensual', 'pension', 'cuot', 'tupa', 'tas', 'gratuit', 'public',
            'admis', 'examen', 'postul', 'ingres', 'requisit', 'pre', 'tecno', 'fech', 'cronogram', 'document', 'secundari', 'dni', 'temari', 'verbal', 'matematic',
            'voucher', 'boucher', 'banc', 'nacion', 'plataform', 'regist', 'operac', 'adjunt', 'valid',
            'bolet', 'comprobant', 'descarg', 'consult', 'electron',
            'mes', 'part', 'tramit', 'constanci', 'record', 'not', 'egresad', 'fut', 'solicitud',
            'convalid', 'univers', 'sunedu', 'bachiller', 'licenciatur', 'ley', '30512',
            'turn', 'horari', 'maana', 'tard', 'noch', 'diurn', 'taller', 'laboratori', 'clas', 'asistenci',
            'edad', 'limit', 'mayor', 'viej', 'requisito',
            'conveni', 'empres', 'puerto', 'paita', 'euroandin', 'tpe', 'bols', 'emple', 'trabaj',
            'bec', '18', 'pronabec', 'benefici', 'ayud', 'pobr', 'subvenc', 'sisfoh', 'laptop',
            'pasaj', 'carnet', 'medi', 'descuent', 'bus', 'transpor', 'combi', 'rut', 'llegar', 'terminal', 'piur', 'sullan',
            'siga', 'plataform', 'not', 'asistenci', 'virtual', 'intranet',
            'bibliotec', 'libr', 'virtual', 'lectur', 'digital', 'drep',
            'ubicac', 'dond', 'qued', 'direcc', 'telefon', 'whatsapp', 'sede', 'parqu', 'grau', 'ciud',
            'histori', 'herman', 'carcam', 'heroes', 'fundac', 'aniversari', 'gore', 'millon', 'invers', 'autorid', 'director',
            'simul', 'calcul', 'cuanto', 'pagar', 'liquid', 'presupuest', 'simulador',
            'map', 'instalac', 'campus', 'pabellon', 'aulas', 'ambientes',
            'cread', 'autor', 'gerson', 'gmph', 'desarrollad', 'programad', 'quien', 'eres',
            'defin', 'concept', 'signific', 'python', 'javascript', 'docker', 'api', 'cibersegur',
            'hol', 'buen', 'dia', 'tard', 'noch', 'salud', 'hey', 'alo',
            'graci', 'agradec', 'excelent', 'genial', 'graciass', 'amabl', 'chau', 'adios'
        ];

        this.inputDim = this.vocabulary.length;
        this.hidden1Dim = 36;
        this.hidden2Dim = 18;
        this.outputDim = this.intents.length;

        this.W1 = [];
        this.b1 = new Float32Array(this.hidden1Dim);
        this.W2 = [];
        this.b2 = new Float32Array(this.hidden2Dim);
        this.W3 = [];
        this.b3 = new Float32Array(this.outputDim);

        this.isTrained = false;
        this.trainingLoss = 0.0;
        this.trainingAccuracy = 0.0;
        this.lastInference = null;

        this.initWeights();
        this.trainNetwork();
    }

    initWeights() {
        const xavier1 = Math.sqrt(6.0 / (this.inputDim + this.hidden1Dim));
        this.W1 = new Array(this.inputDim);
        for (let i = 0; i < this.inputDim; i++) {
            this.W1[i] = new Float32Array(this.hidden1Dim);
            for (let j = 0; j < this.hidden1Dim; j++) {
                this.W1[i][j] = (Math.random() * 2 - 1) * xavier1;
            }
        }

        const xavier2 = Math.sqrt(6.0 / (this.hidden1Dim + this.hidden2Dim));
        this.W2 = new Array(this.hidden1Dim);
        for (let j = 0; j < this.hidden1Dim; j++) {
            this.W2[j] = new Float32Array(this.hidden2Dim);
            for (let k = 0; k < this.hidden2Dim; k++) {
                this.W2[j][k] = (Math.random() * 2 - 1) * xavier2;
            }
        }

        const xavier3 = Math.sqrt(6.0 / (this.hidden2Dim + this.outputDim));
        this.W3 = new Array(this.hidden2Dim);
        for (let k = 0; k < this.hidden2Dim; k++) {
            this.W3[k] = new Float32Array(this.outputDim);
            for (let l = 0; l < this.outputDim; l++) {
                this.W3[k][l] = (Math.random() * 2 - 1) * xavier3;
            }
        }
    }

    leakyRelu(x) {
        return x > 0 ? x : 0.01 * x;
    }

    dLeakyRelu(x) {
        return x > 0 ? 1.0 : 0.01;
    }

    tanh(x) {
        return Math.tanh(x);
    }

    dTanh(x) {
        const t = Math.tanh(x);
        return 1.0 - t * t;
    }

    softmax(arr) {
        let max = -Infinity;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
        }
        const exps = new Float32Array(arr.length);
        let sum = 0.0;
        for (let i = 0; i < arr.length; i++) {
            exps[i] = Math.exp(arr[i] - max);
            sum += exps[i];
        }
        for (let i = 0; i < arr.length; i++) {
            exps[i] /= (sum || 1.0);
        }
        return exps;
    }

    vectorize(text) {
        if (!text || typeof text !== 'string') {
            return { vector: new Float32Array(this.inputDim), matchedTokens: [] };
        }

        const clean = text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .trim();

        const words = clean.split(/\s+/).filter(w => w.length > 1);
        const vector = new Float32Array(this.inputDim);
        const matchedTokens = [];

        words.forEach(word => {
            for (let i = 0; i < this.vocabulary.length; i++) {
                const stem = this.vocabulary[i];
                if (word.startsWith(stem) || word === stem || (stem.length > 4 && word.includes(stem))) {
                    vector[i] += 1.0;
                    if (!matchedTokens.includes(stem)) {
                        matchedTokens.push(stem);
                    }
                }
            }
        });

        let norm = 0.0;
        for (let i = 0; i < vector.length; i++) {
            norm += vector[i] * vector[i];
        }
        norm = Math.sqrt(norm);
        if (norm > 0) {
            for (let i = 0; i < vector.length; i++) {
                vector[i] /= norm;
            }
        }

        return { vector, matchedTokens };
    }

    forward(inputVector) {
        const h1 = new Float32Array(this.hidden1Dim);
        for (let j = 0; j < this.hidden1Dim; j++) {
            let sum = this.b1[j];
            for (let i = 0; i < this.inputDim; i++) {
                sum += inputVector[i] * this.W1[i][j];
            }
            h1[j] = this.leakyRelu(sum);
        }

        const h2 = new Float32Array(this.hidden2Dim);
        for (let k = 0; k < this.hidden2Dim; k++) {
            let sum = this.b2[k];
            for (let j = 0; j < this.hidden1Dim; j++) {
                sum += h1[j] * this.W2[j][k];
            }
            h2[k] = this.tanh(sum);
        }

        const z = new Float32Array(this.outputDim);
        for (let l = 0; l < this.outputDim; l++) {
            let sum = this.b3[l];
            for (let k = 0; k < this.hidden2Dim; k++) {
                sum += h2[k] * this.W3[k][l];
            }
            z[l] = sum;
        }

        const out = this.softmax(z);
        return { h1, h2, out };
    }

    getTrainingData() {
        return [
            // Test vocacional
            { q: 'quiero hacer el test vocacional', intent: 'test_vocacional' },
            { q: 'no se que carrera estudiar ayudame a elegir', intent: 'test_vocacional' },
            { q: 'orientacion vocacional que carrera me recomiendas', intent: 'test_vocacional' },
            { q: 'estoy indeciso no se que carrera escoger', intent: 'test_vocacional' },
            { q: 'test para saber mi vocacion en el instituto', intent: 'test_vocacional' },
            { q: 'como saber que carrera tecnica es para mi', intent: 'test_vocacional' },

            // APSTI
            { q: 'cuentame sobre la carrera de apsti', intent: 'carrera_apsti' },
            { q: 'que es arquitectura de plataformas y servicios ti', intent: 'carrera_apsti' },
            { q: 'carrera de computacion e informatica sistemas y programacion', intent: 'carrera_apsti' },
            { q: 'desarrollo de software y redes de comunicacion cisco', intent: 'carrera_apsti' },
            { q: 'apsti campo laboral de sistemas y servidores cloud', intent: 'carrera_apsti' },

            // ANI
            { q: 'carrera de administracion de negocios internacionales ani', intent: 'carrera_ani' },
            { q: 'comercio exterior aduanas y logistica portuaria', intent: 'carrera_ani' },
            { q: 'exportacion e importacion en el puerto de paita', intent: 'carrera_ani' },
            { q: 'que hace un egresado de negocios internacionales', intent: 'carrera_ani' },

            // Contabilidad
            { q: 'carrera de contabilidad finanzas y tributacion sunat', intent: 'carrera_contabilidad' },
            { q: 'quiero ser contador estudiar contabilidad en paita', intent: 'carrera_contabilidad' },
            { q: 'auditoria costos balance y libros electronicos sire', intent: 'carrera_contabilidad' },

            // DPA
            { q: 'carrera de desarrollo pesquero y acuicola dpa', intent: 'carrera_dpa' },
            { q: 'pesqueria acuicultura cultivo de conchas de abanico y langostinos', intent: 'carrera_dpa' },
            { q: 'embarcacion pesquera propia practicas de maricultura haccp', intent: 'carrera_dpa' },

            // Mallas Curriculares
            { q: 'cual es la malla curricular de apsti', intent: 'malla_curricular' },
            { q: 'que cursos llevan en primer ciclo de negocios internacionales', intent: 'malla_curricular' },
            { q: 'plan de estudios y materias de contabilidad', intent: 'malla_curricular' },
            { q: 'malla de desarrollo pesquero y acuicola semestres', intent: 'malla_curricular' },
            { q: 'que asignaturas y cursos se ensenan en cada semestre', intent: 'malla_curricular' },

            // Todas las carreras
            { q: 'que carreras tecnicas ofrece el instituto hercar', intent: 'todas_carreras' },
            { q: 'cuales son los programas profesionales para estudiar', intent: 'todas_carreras' },
            { q: 'oferta academica del instituto hermanos carcamo paita', intent: 'todas_carreras' },

            // Matrícula y Costos
            { q: 'cuanto cuesta la matricula y la mensualidad', intent: 'matricula_costos' },
            { q: 'es gratis el instituto se pagan pensiones mensuales', intent: 'matricula_costos' },
            { q: 'costos tupa pago por semestre instituto publico', intent: 'matricula_costos' },

            // Admisión
            { q: 'cuando es el examen de admision y requisitos para postular', intent: 'admision_examen' },
            { q: 'como ingresar al instituto pre tecno exonerados', intent: 'admision_examen' },
            { q: 'documentos para inscribirme al examen de admision', intent: 'admision_examen' },

            // Temario Examen
            { q: 'cual es el temario del examen de admision', intent: 'temario_admision' },
            { q: 'que temas vienen en el examen para ingresar', intent: 'temario_admision' },
            { q: 'como prepararme para la prueba de conocimientos y verbal', intent: 'temario_admision' },

            // Titulación y EFSRT
            { q: 'cuales son los requisitos para titularme en el instituto', intent: 'titulacion_efsrt' },
            { q: 'como saco mi titulo profesional tecnico a nombre de la nacion', intent: 'titulacion_efsrt' },
            { q: 'que son las efsrt y practicas preprofesionales', intent: 'titulacion_efsrt' },
            { q: 'examen de suficiencia o sustentacion de proyecto para titulo', intent: 'titulacion_efsrt' },

            // Pagos y Vouchers
            { q: 'como registro mi voucher de pago en pagos ieshercar', intent: 'pagos_vouchers' },
            { q: 'donde se paga el banco de la nacion y subir voucher', intent: 'pagos_vouchers' },
            { q: 'plataforma de validacion de comprobantes y pagos', intent: 'pagos_vouchers' },

            // Número de Cuenta Bancaria y Códigos de Pago Banco de la Nación
            { q: 'pasame el numero de cuenta', intent: 'cuenta_bancaria_codigos' },
            { q: 'dile pasame el numero de cuenta', intent: 'cuenta_bancaria_codigos' },
            { q: 'pasame el numero de cuenta del instituto', intent: 'cuenta_bancaria_codigos' },
            { q: 'cual es el numero de cuenta para pagar en el banco de la nacion', intent: 'cuenta_bancaria_codigos' },
            { q: 'pasa el numero de cuenta corriente hermanos carcamo', intent: 'cuenta_bancaria_codigos' },
            { q: 'cuenta de banco de la nacion para depositar la matricula', intent: 'cuenta_bancaria_codigos' },
            { q: 'cual es el cci codigo de cuenta interbancario del instituto', intent: 'cuenta_bancaria_codigos' },
            { q: 'a que cuenta se deposita el dinero de admision o inscripcion', intent: 'cuenta_bancaria_codigos' },
            { q: 'donde deposito la plata de la matricula numero de cuenta', intent: 'cuenta_bancaria_codigos' },
            { q: 'dame los codigos de pago del banco de la nacion', intent: 'cuenta_bancaria_codigos' },
            { q: 'como pagar por transferencia interbancaria bcp bbva yape a la cuenta', intent: 'cuenta_bancaria_codigos' },
            { q: 'numero de cuenta oficial del instituto de paita', intent: 'cuenta_bancaria_codigos' },
            { q: 'a que cuenta tengo que pagar la matricula semestral', intent: 'cuenta_bancaria_codigos' },

            // Boletas
            { q: 'como descargar mi boleta de venta electronica con dni', intent: 'boletas_electronicas' },
            { q: 'consulta de boletas en sistema ieshercar', intent: 'boletas_electronicas' },

            // Mesa de partes
            { q: 'tramite en mesa de partes virtual constancia de estudios fut', intent: 'mesa_partes_tramites' },
            { q: 'como solicitar record de notas o certificado modular', intent: 'mesa_partes_tramites' },

            // Beca 18
            { q: 'tienen beca 18 de pronabec requisitos para postular', intent: 'becas_beneficios' },
            { q: 'beca permanencia laptop y ayuda economica mensual', intent: 'becas_beneficios' },

            // Carnet y Pasaje
            { q: 'como tramito el carnet de medio pasaje minedu', intent: 'carnet_pasaje' },
            { q: 'descuento de pasaje en combis para estudiantes', intent: 'carnet_pasaje' },

            // Transporte / Cómo llegar
            { q: 'como llego al instituto desde piura o sullana', intent: 'como_llegar_transporte' },
            { q: 'donde queda la parada de combis urbano paita alta parque', intent: 'como_llegar_transporte' },

            // SIGA Web
            { q: 'como entro al sistema siga para ver mis notas', intent: 'plataforma_siga' },
            { q: 'intranet o aula virtual para ver calificaciones y asistencia', intent: 'plataforma_siga' },

            // Biblioteca Virtual
            { q: 'como ingreso a la biblioteca virtual para leer libros', intent: 'biblioteca_virtual' },
            { q: 'libros digitales de computacion o comercio biblioteca drep', intent: 'biblioteca_virtual' },

            // Simulador y Mapa
            { q: 'abrir el simulador de matricula y cuotas tupa', intent: 'simulador_tupa' },
            { q: 'ver el mapa del campus e instalaciones laboratorios', intent: 'mapa_campus' },

            // Quién te creó
            { q: 'quien te creo quien es tu autor o desarrollador', intent: 'quien_te_creo' },
            { q: 'quien desarrollo esta inteligencia artificial hercaria', intent: 'quien_te_creo' },

            // Conceptos técnicos
            { q: 'que es programacion que lenguajes ensenan en apsti', intent: 'conceptos_tecnologia' },
            { q: 'que es un contenedor reefer o incoterms en negocios', intent: 'conceptos_tecnologia' },

            // Convalidación
            { q: 'puedo convalidar con una universidad licenciada por sunedu', intent: 'convalidacion_sunedu' },

            // Ubicación y Contacto
            { q: 'donde queda el instituto direccion telefono whatsapp', intent: 'ubicacion_contacto' },

            // Saludo y Agradecimiento
            { q: 'hola buenos dias como estas', intent: 'saludo' },
            { q: 'muchas gracias por tu ayuda excelente orientacion', intent: 'agradecimiento' }
        ];
    }

    trainNetwork() {
        const dataset = this.getTrainingData();
        const epochs = 45;
        const lr = 0.08;

        for (let epoch = 0; epoch < epochs; epoch++) {
            let totalLoss = 0.0;
            let correct = 0;

            for (let s = 0; s < dataset.length; s++) {
                const sample = dataset[s];
                const { vector } = this.vectorize(sample.q);
                const targetIdx = this.intents.indexOf(sample.intent);
                if (targetIdx === -1) continue;

                const { h1, h2, out } = this.forward(vector);

                const prob = Math.max(out[targetIdx], 1e-7);
                totalLoss += -Math.log(prob);

                let maxOut = -1;
                let predictedIdx = 0;
                for (let i = 0; i < this.outputDim; i++) {
                    if (out[i] > maxOut) {
                        maxOut = out[i];
                        predictedIdx = i;
                    }
                }
                if (predictedIdx === targetIdx) correct++;

                // Retropropagación (Backpropagation)
                const dZ = new Float32Array(this.outputDim);
                for (let i = 0; i < this.outputDim; i++) {
                    dZ[i] = out[i] - (i === targetIdx ? 1.0 : 0.0);
                }

                const dH2 = new Float32Array(this.hidden2Dim);
                for (let k = 0; k < this.hidden2Dim; k++) {
                    let grad = 0.0;
                    for (let l = 0; l < this.outputDim; l++) {
                        grad += dZ[l] * this.W3[k][l];
                    }
                    dH2[k] = grad * this.dTanh(h2[k]);
                }

                const dH1 = new Float32Array(this.hidden1Dim);
                for (let j = 0; j < this.hidden1Dim; j++) {
                    let grad = 0.0;
                    for (let k = 0; k < this.hidden2Dim; k++) {
                        grad += dH2[k] * this.W2[j][k];
                    }
                    dH1[j] = grad * this.dLeakyRelu(h1[j]);
                }

                // Actualizar pesos W3 y b3
                for (let k = 0; k < this.hidden2Dim; k++) {
                    for (let l = 0; l < this.outputDim; l++) {
                        this.W3[k][l] -= lr * dZ[l] * h2[k];
                    }
                }
                for (let l = 0; l < this.outputDim; l++) {
                    this.b3[l] -= lr * dZ[l];
                }

                // Actualizar pesos W2 y b2
                for (let j = 0; j < this.hidden1Dim; j++) {
                    for (let k = 0; k < this.hidden2Dim; k++) {
                        this.W2[j][k] -= lr * dH2[k] * h1[j];
                    }
                }
                for (let k = 0; k < this.hidden2Dim; k++) {
                    this.b2[k] -= lr * dH2[k];
                }

                // Actualizar pesos W1 y b1
                for (let i = 0; i < this.inputDim; i++) {
                    for (let j = 0; j < this.hidden1Dim; j++) {
                        this.W1[i][j] -= lr * dH1[j] * vector[i];
                    }
                }
                for (let j = 0; j < this.hidden1Dim; j++) {
                    this.b1[j] -= lr * dH1[j];
                }
            }

            this.trainingLoss = totalLoss / dataset.length;
            this.trainingAccuracy = correct / dataset.length;
        }

        this.isTrained = true;
    }

    predict(rawQuery) {
        const tStart = performance.now();
        const { vector, matchedTokens } = this.vectorize(rawQuery);
        const { h1, h2, out } = this.forward(vector);
        const tEnd = performance.now();
        const latencyMs = Math.max(0.1, Number((tEnd - tStart).toFixed(2)));

        const sorted = [];
        for (let i = 0; i < this.outputDim; i++) {
            sorted.push({
                intent: this.intents[i],
                label: this.intentLabels[this.intents[i]] || this.intents[i],
                probability: out[i]
            });
        }
        sorted.sort((a, b) => b.probability - a.probability);

        const best = sorted[0];
        const isUnknown = matchedTokens.length === 0 && best.probability < 0.25;

        const result = {
            query: rawQuery,
            intent: isUnknown ? 'desconocido' : best.intent,
            label: isUnknown ? 'Consulta General / Semántica' : best.label,
            confidence: isUnknown ? 0.20 : best.probability,
            confidencePercent: Math.round((isUnknown ? 0.20 : best.probability) * 100) + '%',
            latencyMs: latencyMs,
            tokens: matchedTokens,
            topK: sorted.slice(0, 5),
            hidden1Activations: Array.from(h1),
            hidden2Activations: Array.from(h2)
        };

        this.lastInference = result;
        return result;
    }

    getNetworkMetrics() {
        return {
            inputDim: this.inputDim,
            hidden1Dim: this.hidden1Dim,
            hidden2Dim: this.hidden2Dim,
            outputDim: this.outputDim,
            totalSynapticWeights: (this.inputDim * this.hidden1Dim) + (this.hidden1Dim * this.hidden2Dim) + (this.hidden2Dim * this.outputDim),
            accuracyPercent: Math.round(this.trainingAccuracy * 100) + '%',
            lossScore: this.trainingLoss.toFixed(4)
        };
    }
}

// Export para uso en navegador y Node
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HercarNeuralNetwork;
}
