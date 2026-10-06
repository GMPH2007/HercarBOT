/**
 * BASE DE CONOCIMIENTO INSTITUCIONAL EXTENDIDA Y ENCICLOPÉDICA
 * I.E.S.T.P. "HERMANOS CÁRCAMO" - PAITA, PIURA, PERÚ
 * Carrera Profesional Técnica de APSTI
 * Actualización: Versión 5.1 Ampliada con Mallas Curriculares, Módulo Semántico y Conceptos Técnicos
 */

const INSTITUCIONAL_KB = {
    instituto: {
        nombre: 'Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo"',
        siglas: 'IESTP HÉRCAR',
        lema: 'Formando Profesionales y Construyendo Oportunidades',
        creacion: 'Resolución Ministerial N° 232-87-ED (1987)',
        revalidacion: 'Resolución Ministerial N° 0528-2006-ED',
        direccion: 'Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura, Perú',
        horario: 'Lunes a Viernes de 8:00 AM a 3:00 PM (Turno diurno regular)',
        telefono: '+51 969 100 257',
        telefonoFijo: '(073) 251013',
        email: 'ieshercar@ieshercar.edu.pe',
        emailTramites: 'tramitesiestphermanoscarcamo@gmail.com',
        web: 'https://ieshercar.edu.pe/',
        pagosWeb: 'https://pagos.ieshercar.edu.pe/',
        tramitesWeb: 'https://sistema.ieshercar.edu.pe/registro-tramite/',
        boletasWeb: 'https://sistema.ieshercar.com/Consulta_Boletas/index.php',
        bibliotecaVirtual: 'https://biblioteca.ieshercar.edu.pe/login.php',
        bibliotecaDrep: 'https://iestphercar.bibliotecalatina.com/login',
        bolsaLaboral: 'https://bolsa-laboral.ieshercar.edu.pe/',
        siga: 'http://siga.ieshercar.edu.pe/',
        facebook: 'https://web.facebook.com/iestphercar.edu.pe',
        youtube: 'https://www.youtube.com/@ieshercar',
        maps: 'https://maps.google.com/?q=IEST+HERMANOS+CARCAMOS+Paita',
        
        datosBancarios: {
            banco: 'Banco de la Nación del Perú',
            titular: 'I.E.S.T.P. "Hermanos Cárcamo" - Paita (Recursos Directamente Recaudados)',
            ruc: '20197087091',
            cuentaCorriente: '00-631-018241',
            cci: '018-631-000631018241-73',
            moneda: 'Soles (S/ - PEN)',
            agenciasHabilitadas: 'Ventanilla Banco de la Nación, Agentes MultiRed a nivel nacional y transferencias interbancarias',
            plataformaVouchers: 'https://pagos.ieshercar.edu.pe/',
            consultaBoletas: 'https://sistema.ieshercar.com/Consulta_Boletas/index.php',
            tasasOficiales: {
                matriculaSemestral: 'S/ 100.00 (Educación pública 100% gratuita, S/ 0 mensualidades)',
                admisionOrdinaria: 'S/ 150.00',
                preTecnologico: 'S/ 200.00',
                carnetMedioPasaje: 'S/ 20.00'
            }
        },
        
        historia: `El IESTP "Hermanos Cárcamo" fue creado en 1987 (R.M. N° 232-87-ED) y revalidado por R.M. N° 0528-2006-ED. Lleva con orgullo el nombre de los heroicos hermanos Cárcamo (Victoriano, Andrés, Raymundo y Enrique), ilustres paiteños que en 1821 capturaron el pailebote español "Sacramento", acción heroica que dio origen a la Marina de Guerra del Perú. Hoy en día, la institución cuenta con un megaproyecto de modernización de más de S/ 36 millones ejecutado por el Gobierno Regional de Piura, con laboratorios de última tecnología, modernos ambientes y una embarcación pesquera propia con radar y visión nocturna para la instrucción práctica en alta mar.`,
        
        beneficiosPublicos: [
            'Educación Superior Gratuita (Instituto Público del Estado Peruano - MINEDU). Sin mensualidades privadas.',
            'Título Profesional Técnico a Nombre de la Nación con valor oficial y convalidación universitaria.',
            'Certificaciones Modulares Progresivas al culminar cada año académico.',
            'Convenios de prácticas preprofesionales con las principales empresas del puerto de Paita y Piura.',
            'Acceso a Beca 18 (PRONABEC), Beca Permanencia y beneficios económicos para primeros puestos.',
            'Carnet de Medio Pasaje oficial del MINEDU (50% de descuento en pasajes).',
            'Biblioteca Virtual moderna con más de 15,000 libros digitales y plataformas 24/7.'
        ],

        autoridades: {
            direccionGeneral: 'Dirección General del IESTP Hermanos Cárcamo',
            unidadAcademica: 'Jefatura de Unidad Académica',
            coordinacionAPSTI: 'Coordinación de Arquitectura de Plataformas y Servicios TI',
            coordinacionANI: 'Coordinación de Administración de Negocios Internacionales',
            coordinacionConta: 'Coordinación de Contabilidad',
            coordinacionDPA: 'Coordinación de Desarrollo Pesquero y Acuícola',
            secretariaAcademica: 'Secretaría Académica y Mesa de Partes'
        }
    },

    carreras: [
        {
            id: 'apsti',
            nombre: 'Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI)',
            alias: ['sistemas', 'computacion', 'informatica', 'programacion', 'ti', 'software', 'redes', 'apsti', 'codigo', 'desarrollo web', 'inteligencia artificial'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Arquitectura de Plataformas y Servicios de Tecnologías de la Información',
            icono: '💻',
            color: '#3b82f6',
            descripcionCorta: 'Desarrollo de software, gestión de infraestructura cloud, ciberseguridad, redes informáticas e Inteligencia Artificial.',
            perfil: 'Aprenderás a programar aplicaciones web y móviles, diseñar bases de datos SQL y NoSQL, administrar servidores Linux y Windows, implementar seguridad informática, desplegar infraestructura en la nube (AWS/Azure) y aplicar Inteligencia Artificial en entornos productivos.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Gestión de soporte técnico, mantenimiento de equipos, cableado estructurado y seguridad TI' },
                { modulo: 'Módulo II', nombre: 'Desarrollo de software, sistemas web responsivos, aplicaciones móviles y gestión de bases de datos' },
                { modulo: 'Módulo III', nombre: 'Gestión y arquitectura de servicios TI, redes WAN, servidores y computación en la nube (Cloud)' }
            ],
            mallaPorCiclos: [
                { ciclo: 'I Semestre', cursos: ['Arquitectura de Computadoras y Soporte', 'Lógica y Fundamentos de Algoritmos', 'Fundamentos de Redes de Comunicación', 'Ofimática Avanzada', 'Comunicación Efectiva'] },
                { ciclo: 'II Semestre', cursos: ['Programación Orientada a Objetos (POO)', 'Modelado y Diseño de Bases de Datos SQL', 'Sistemas Operativos de Servidor (Linux/Windows)', 'Inglés Técnico para TI'] },
                { ciclo: 'III Semestre', cursos: ['Desarrollo Web Frontend (HTML5, CSS3, JS Moderno)', 'Administración de Redes y Enrutamiento Cisco', 'Bases de Datos Avanzadas', 'Metodologías Ágiles (Scrum)'] },
                { ciclo: 'IV Semestre', cursos: ['Desarrollo Backend y APIs RESTful (Node.js/Python)', 'Bases de Datos NoSQL (MongoDB)', 'Seguridad Informática y Ciberseguridad', 'Legislación Laboral'] },
                { ciclo: 'V Semestre', cursos: ['Computación en la Nube (Cloud AWS/Azure)', 'Desarrollo de Aplicaciones Móviles (Android/Flutter)', 'DevOps, Docker y Contenedores', 'Innovación Tecnológica'] },
                { ciclo: 'VI Semestre', cursos: ['Inteligencia Artificial Aplicada y Machine Learning', 'Gestión de Servicios y Gobernanza TI (ITIL)', 'Proyecto de Innovación y Titulación Profesional'] }
            ],
            campoLaboral: [
                'Desarrollador de aplicaciones web, móviles y sistemas empresariales.',
                'Administrador de redes Cisco, servidores y plataformas en la nube (Cloud/DevOps).',
                'Especialista en soporte técnico informático y centros de datos.',
                'Gestor de ciberseguridad y administrador de bases de datos.',
                'Empresas portuarias (TPE), agencias de aduana, agroindustrias de Piura o trabajo remoto global con sueldos competitivos.'
            ],
            porQueEstudiar: 'Es la carrera con mayor proyección y mejores salarios del mundo. En Paita, la transformación digital de las empresas portuarias, aduaneras y logísticas exige personal especializado en TI.'
        },
        {
            id: 'ani',
            nombre: 'Administración de Negocios Internacionales (ANI)',
            alias: ['negocios', 'comercio exterior', 'aduanas', 'exportaciones', 'importaciones', 'ani', 'administracion', 'puerto', 'contenedores', 'fletes'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Administración de Negocios Internacionales',
            icono: '🚢',
            color: '#0ea5e9',
            descripcionCorta: 'Estrategias de comercio exterior, logística aduanera internacional, importación, exportación y operaciones portuarias.',
            perfil: 'Te capacitarás para gestionar operaciones de compra y venta internacional, tramitar regímenes aduaneros ante SUNAT, coordinar la cadena de suministros y logística de contenedores en el puerto de Paita, y formular planes de negocios globales.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Operaciones y logística comercial nacional e internacional' },
                { modulo: 'Módulo II', nombre: 'Gestión aduanera, aranceles, importación, exportación y transporte internacional' },
                { modulo: 'Módulo III', nombre: 'Planes de negocios internacionales, finanzas y marketing global' }
            ],
            mallaPorCiclos: [
                { ciclo: 'I Semestre', cursos: ['Fundamentos de Comercio Internacional', 'Matemática Aplicada a los Negocios', 'Geografía Económica Comercial', 'Legislación Comercial'] },
                { ciclo: 'II Semestre', cursos: ['Operatividad del Comercio Exterior', 'Nomenclatura Arancelaria', 'Inglés Comercial Internacional', 'Documentación Aduanera'] },
                { ciclo: 'III Semestre', cursos: ['Logística de Contenedores y Almacenes de Depósito', 'Regímenes Aduaneros de Importación y Exportación', 'Incoterms Oficiales', 'Transporte Multimodal'] },
                { ciclo: 'IV Semestre', cursos: ['Gestión de Fletes Marítimos y Aéreos', 'Seguros de Carga Internacional', 'Operaciones Portuarias en TPE Paita', 'Contratación Internacional'] },
                { ciclo: 'V Semestre', cursos: ['Investigación de Mercados Exteriores', 'Tratados de Libre Comercio (TLCs)', 'Finanzas y Medios de Pago Internacional (Cartas de Crédito)'] },
                { ciclo: 'VI Semestre', cursos: ['Formulación del Plan de Exportación', 'Marketing Global y Negociación Intercultural', 'Proyecto de Titulación Profesional'] }
            ],
            campoLaboral: [
                'Agencias de aduanas y agencias marítimas en el Puerto de Paita (Euroandinos).',
                'Empresas agroexportadoras (mango, uva, limón, banano orgánico de Piura).',
                'Empresas pesqueras e hidrobiológicas exportadoras.',
                'Depósitos temporales, almacenes logísticos y terminales portuarios.',
                'Emprendedor independiente de importación y exportación de productos.'
            ],
            porQueEstudiar: 'Paita alberga el puerto de exportación más importante del norte peruano. Estudiar Negocios Internacionales aquí te sitúa en el centro del comercio mundial.'
        },
        {
            id: 'contabilidad',
            nombre: 'Contabilidad',
            alias: ['conta', 'finanzas', 'tributos', 'auditoria', 'contabilidad', 'impuestos', 'sunat', 'sire', 'balances', 'facturas'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Contabilidad',
            icono: '📊',
            color: '#10b981',
            descripcionCorta: 'Registro financiero, gestión tributaria (SUNAT), auditoría, costos, presupuestos y control económico empresarial.',
            perfil: 'Dominarás el registro contable computarizado, la liquidación de impuestos de acuerdo con la normativa de SUNAT (SIRE, PDT), el cálculo de planillas, formulación de estados financieros y análisis de costos para la toma de decisiones empresariales.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Procesos contables, libros electrónicos y documentación comercial' },
                { modulo: 'Módulo II', nombre: 'Contabilidad de costos, presupuestos y control interno' },
                { modulo: 'Módulo III', nombre: 'Análisis de estados financieros, auditoría tributaria y formulación de proyectos' }
            ],
            mallaPorCiclos: [
                { ciclo: 'I Semestre', cursos: ['Documentación Comercial y Bancaria', 'Plan Contable General Empresarial (PCGE)', 'Legislación Laboral', 'Informática Aplicada a la Contabilidad'] },
                { ciclo: 'II Semestre', cursos: ['Libros Contables Principales y Auxiliares', 'Dinámica de Cuentas Contables', 'Estadística Aplicada', 'Cálculo de Remuneraciones y Planillas'] },
                { ciclo: 'III Semestre', cursos: ['Tributación I (IGV, Comprobantes de Pago Electrónicos)', 'Sistema Integrado de Registros Electrónicos (SIRE - SUNAT)', 'Software Contable Computarizado'] },
                { ciclo: 'IV Semestre', cursos: ['Tributación II (Impuesto a la Renta de Empresas y Personas)', 'Contabilidad de Costos Industriales y Pesqueros', 'Presupuestos Empresariales'] },
                { ciclo: 'V Semestre', cursos: ['Formulación e Interpretación de Estados Financieros', 'Auditoría Financiera y Control Interno', 'Contabilidad Gubernamental'] },
                { ciclo: 'VI Semestre', cursos: ['Auditoría Tributaria Preventiva', 'Finanzas Corporativas y Proyectos de Inversión', 'Proyecto de Titulación Profesional'] }
            ],
            campoLaboral: [
                'Asistente y gestor contable en empresas comerciales, pesqueras e industriales.',
                'Especialista en liquidación de tributos y declaraciones juradas ante SUNAT.',
                'Entidades bancarias y financieras (Banco de la Nación, Cajas Municipales, Cooperativas).',
                'Sector público: Municipalidad de Paita, UGEL, hospitales y organismos del Estado.',
                'Consultor contable independiente para MYPES con cartera propia de clientes.'
            ],
            porQueEstudiar: 'Toda empresa formal necesita obligatoriamente un especialista contable para su funcionamiento tributario y financiero. Ofrece trabajo seguro e independencia laboral.'
        },
        {
            id: 'dpa',
            nombre: 'Desarrollo Pesquero y Acuícola (DPA)',
            alias: ['pesqueria', 'pesca', 'acuicultura', 'mar', 'peces', 'dpa', 'recursos hidrobiologicos', 'maricultura', 'concha de abanico', 'langostinos', 'barco'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Desarrollo Pesquero y Acuícola',
            icono: '🐟',
            color: '#06b6d4',
            descripcionCorta: 'Producción acuícola, navegación y pesca responsable, procesamiento de recursos marinos y aseguramiento de calidad sanitaria (HACCP).',
            perfil: 'Te formarás en técnicas de cultivo de especies marinas (conchas de abanico, langostinos, tilapias), navegación y faenas de pesca, control higiénico-sanitario en plantas procesadoras y congeladoras, y gestión sostenible de recursos del mar.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Navegación, artes de pesca y conservación de recursos hidrobiológicos' },
                { modulo: 'Módulo II', nombre: 'Cultivo, reproducción acuícola y manejo de centros de maricultura' },
                { modulo: 'Módulo III', nombre: 'Procesamiento industrial pesquero, inocuidad alimentaria y sistemas HACCP' }
            ],
            mallaPorCiclos: [
                { ciclo: 'I Semestre', cursos: ['Biología Marina y Limnología', 'Seguridad en la Mar y Primeros Auxilios', 'Ecología Acuática y Conservación', 'Artes y Aparejos de Pesca'] },
                { ciclo: 'II Semestre', cursos: ['Navegación Costera y Comunicaciones Marítimas', 'Maniobras y Operación en Embarcaciones', 'Oceanografía Pesquera', 'Legislación Marítima y Capitanía'] },
                { ciclo: 'III Semestre', cursos: ['Maricultura y Cultivo de Concha de Abanico en Bahía', 'Calidad del Agua y Parámetros Fisicoquímicos', 'Diseño de Instalaciones Acuícolas (Linternas/Longlines)'] },
                { ciclo: 'IV Semestre', cursos: ['Cultivo de Langostinos y Peces Marinos', 'Nutrición y Formulación de Alimentos Acuícolas', 'Sanidad y Patología Acuícola', 'Operación de Hatcheries'] },
                { ciclo: 'V Semestre', cursos: ['Tecnología de Procesamiento Pesquero (Congelados y Conservas)', 'Aseguramiento de la Calidad (Sistema HACCP, BPM, POES)', 'Bioquímica de Recursos Hidrobiológicos'] },
                { ciclo: 'VI Semestre', cursos: ['Gestión de Empresas Pesqueras y Acuícolas', 'Auditorías Sanitarias (SANIPES)', 'Proyecto de Innovación y Titulación Profesional'] }
            ],
            campoLaboral: [
                'Supervisor de control de calidad (QA/QC) en plantas congeladoras de pota y perico en Paita.',
                'Técnico acuícola en criaderos y concesiones de conchas de abanico (Sechura/Paita).',
                'Inspector sanitario pesquero en SANIPES, PRODUCE o IMARPE.',
                'Técnico de operaciones en embarcaciones pesqueras industriales y de investigación.',
                'Asesor técnico en proyectos de innovación y maricultura sostenible.'
            ],
            porQueEstudiar: 'Paita es el puerto pesquero más productivo del Perú. Además, el IESTP Hermanos Cárcamo cuenta con una embarcación pesquera propia equipada con radar y visión nocturna para prácticas reales en el mar.'
        }
    ],

    admision: {
        modalidades: [
            {
                tipo: 'Examen de Admisión Ordinario',
                descripcion: 'Convocatoria general para todos los egresados de educación secundaria (EBR o EBA). Consta de 100 preguntas de aptitud y conocimientos.'
            },
            {
                tipo: 'Admisión por Exoneración',
                descripcion: 'Para primeros puestos de secundaria, deportistas calificados acreditados por el IPD, personas con discapacidad (Ley N° 29973) y preseleccionados de Beca 18.'
            },
            {
                tipo: 'Academia Pre Tecno (Centro Pre)',
                descripcion: 'Ciclo preparatorio institucional que brinda ingreso directo según estricto orden de mérito.'
            }
        ],
        temarioExamen: [
            'Razonamiento Lógico-Matemático (30%): Aritmética básica, porcentajes, sucesiones, geometría elemental y resolución de problemas.',
            'Razonamiento Verbal y Comprensión Lectora (30%): Sinónimos, antónimos, analogías, textos expositivos e inferencia.',
            'Cultura General y Realidad Regional (20%): Historia de Paita y el Perú, geografía, actualidad nacional e instituciones del Estado.',
            'Ciencias, Tecnología y Sociedad (20%): Nociones de física, química básica, computación y medio ambiente.'
        ],
        requisitosInscripcion: [
            'Solicitud en Formato Único de Trámite (FUT) dirigida a la Dirección General.',
            'Certificado de estudios secundarios original de 1° a 5° año (visado por UGEL o emitido vía web por el MINEDU).',
            'Copia simple y legible del DNI vigente.',
            'Partida o acta de nacimiento (original o copia legalizada).',
            'Dos (02) fotografías recientes tamaño carnet a color con fondo blanco.',
            'Voucher de depósito en el Banco de la Nación por concepto de inscripción al examen de admisión (S/ 100.00 aproximadamente).'
        ]
    },

    titulacion: {
        descripcion: 'El IESTP Hermanos Cárcamo otorga el Título Profesional Técnico a Nombre de la Nación reconocido por el MINEDU, con validez en todo el país y apto para convalidación universitaria.',
        requisitos: [
            'Haber aprobado el 100% de los créditos y unidades didácticas de los 6 semestres académicos de la carrera.',
            'Acreditar el cumplimiento de las Experiencias Formativas en Situaciones Reales de Trabajo (EFSRT / Prácticas preprofesionales) en empresas del sector.',
            'Acreditar la aprobación de Idioma Extranjero (Inglés Técnico) a nivel básico/intermedio según normativa MINEDU.',
            'Aprobar la sustentación de un Proyecto de Innovación Tecnológica o rendir satisfactoriamente el Examen de Suficiencia Profesional.',
            'Constancia de no adeudo administrativo, biblioteca y talleres.',
            'Pago de las tasas correspondientes en el Banco de la Nación según TUPA institucional.'
        ],
        efsrtDetalle: 'Las EFSRT corresponden a prácticas reales en empresas formalmente constituidas de Paita y Piura. Se convalidan por módulos formativos anuales con un mínimo de horas estipulado en el plan de estudios.'
    },

    beca18: {
        descripcion: 'El IESTP Hermanos Cárcamo es un instituto tecnológico público elegible en todas las convocatorias de PRONABEC para Beca 18 y Beca Permanencia.',
        requisitos: [
            'Haber culminado la secundaria con alto rendimiento académico (tercio superior o promedio 15 en los 2 últimos años).',
            'Estar en condición de pobreza o pobreza extrema según el SISFOH del Ministerio de Desarrollo e Inclusión Social (MIDIS).',
            'Tener menos de 22 años a la fecha de postulación (sin límite de edad para personas con discapacidad o comunidades nativas).',
            'Haber ingresado a una de las carreras oficiales del IESTP Hermanos Cárcamo.'
        ],
        beneficios: [
            'Subvención económica mensual para alimentación y movilidad local.',
            'Laptop personal gratuita para el desarrollo de clases.',
            'Gastos de matrícula, materiales de estudio y carnet cubiertos al 100%.',
            'Costos completos de titulación profesional técnica cubiertos por el Estado.',
            'Acompañamiento psicopedagógico y tutoría continua de PRONABEC.'
        ]
    },

    carnetMedioPasaje: {
        descripcion: 'El carnet oficial de estudiante de educación superior es emitido por el MINEDU y gestionado por la Secretaría Académica del instituto.',
        beneficio: 'Otorga el 50% de descuento (Medio Pasaje) en el transporte público urbano e interurbano (combis, buses y colectivos de Paita, Piura, Sullana y Talara) conforme a la Ley N° 26271.',
        costoTupa: 'Tasa institucional mínima de S/ 20.00 aprobada en el TUPA del instituto.',
        vigencia: 'Válido durante todo el año lectivo académico.'
    },

    comoLlegar: {
        direccion: 'Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita Alta – Piura.',
        referencia: 'A escasos metros del parque principal de la Urbanización El Parque en la parte alta de Paita.',
        desdePiura: 'Tomar combi o colectivo en el Terminal Terrestre de Piura (Av. Sánchez Cerro). Bajar en el paradero principal de Paita Alta (Urb. El Parque). Tiempo estimado: 45 a 55 minutos.',
        desdeSullana: 'Tomar colectivo en el terminal de autos Sullana-Paita. Solicitar parada en Paita Alta / Urb. El Parque. Tiempo estimado: 35 a 45 minutos.',
        desdePaitaBaja: 'Tomar cualquier combi urbana o colectivo que suba hacia Paita Alta (rutas que pasan por la bajada de la punta o el óvalo). Bajar en el paradero de Urb. El Parque. Tiempo: 8 a 10 minutos.'
    },

    conceptosTecnicos: {
        apsti: [
            { tema: '¿Qué es programación y qué lenguajes se enseñan?', respuesta: 'Programar es escribir instrucciones lógicas para que una computadora resuelva problemas automáticamente. En APSTI se enseña lógica de algoritmos, Python, JavaScript moderno, PHP, Java, SQL y frameworks para desarrollo web y móvil.' },
            { tema: '¿Qué es la computación en la nube (Cloud)?', respuesta: 'Es la tecnología que permite ejecutar servidores, almacenar bases de datos y procesar información en centros de datos globales (como AWS, Microsoft Azure y Google Cloud) a través de internet, sin necesidad de comprar servidores físicos costosos.' },
            { tema: '¿Qué es una base de datos SQL y NoSQL?', respuesta: 'Una base de datos SQL (como MySQL o PostgreSQL) organiza la información en tablas estructuradas con filas y columnas. Una base de datos NoSQL (como MongoDB) guarda datos en documentos flexibles tipo JSON, ideal para aplicaciones móviles y analítica a gran escala.' },
            { tema: '¿Qué es ciberseguridad?', respuesta: 'Es el conjunto de prácticas y herramientas para proteger redes, servidores, programas y datos confidenciales contra accesos no autorizados, ataques informáticos y robo de identidad.' }
        ],
        ani: [
            { tema: '¿Qué es un contenedor reefer?', respuesta: 'Es un contenedor marítimo refrigerado equipado con motor térmico que mantiene cargas perecibles (como pota congelada, conchas de abanico, mango o uva de exportación) a temperaturas de hasta -25°C durante todo el trayecto marítimo.' },
            { tema: '¿Qué son los Incoterms?', respuesta: 'Son términos de comercio internacional (como FOB - Free on Board, CIF - Cost Insurance and Freight, EXW - Ex Works) que definen con exactitud qué parte (exportador o importador) asume los costos de flete, seguro y riesgos de la mercancía.' },
            { tema: '¿Qué es la DAM en aduanas?', respuesta: 'Es la Declaración Aduanera de Mercancías, documento oficial emitido ante la SUNAT que detalla la partida arancelaria, valor FOB, peso y origen de los productos exportados o importados.' }
        ],
        contabilidad: [
            { tema: '¿Qué es el SIRE de SUNAT?', respuesta: 'El Sistema Integrado de Registros Electrónicos (SIRE) es la plataforma digital de la SUNAT que genera automáticamente las propuestas del Registro de Ventas e Ingresos Electrónicos (RVIE) y del Registro de Compras Electrónico (RCE).' },
            { tema: '¿Qué es el IGV y el Impuesto a la Renta?', respuesta: 'El IGV es el Impuesto General a las Ventas (tasa del 18%) que grava el consumo de bienes y servicios. El Impuesto a la Renta grava las ganancias y utilidades netas generadas por empresas y personas durante el ejercicio fiscal.' }
        ],
        dpa: [
            { tema: '¿Cómo se cultiva la concha de abanico en bahía?', respuesta: 'Se realiza mediante sistemas suspendidos (longlines con linternas de malla) o en fondos marinos delimitados. En la Bahía de Sechura y Paita se aprovechan las corrientes ricas en fitoplancton para lograr un crecimiento acelerado y de alta calidad para exportación.' },
            { tema: '¿Qué es el sistema HACCP?', respuesta: 'Es el sistema de Análisis de Peligros y Puntos Críticos de Control (HACCP), un protocolo internacional de inocuidad alimentaria de cumplimiento obligatorio para exportar productos hidrobiológicos a la Unión Europea y Estados Unidos.' }
        ]
    },

    buscarEnConocimiento: function(query) {
        if (!query) return null;
        const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // 0. Preguntas sobre Número de Cuenta Bancaria / Dónde depositar / CCI / Banco de la Nación
        if (
            q.includes('cuenta') || 
            q.includes('cci') || 
            q.includes('interbancari') || 
            q.includes('codigo de pago') || 
            q.includes('codigos de pago') || 
            q.includes('donde deposito') || 
            q.includes('a que cuenta') || 
            q.includes('donde pago') || 
            q.includes('donde se paga') || 
            (q.includes('banco') && q.includes('nacion'))
        ) {
            return this.formatearDatosBancarios();
        }

        // 1. Preguntas sobre malla curricular o cursos
        if (q.includes('malla') || q.includes('cursos') || q.includes('plan de estudio') || q.includes('que materias') || q.includes('que ensenan')) {
            if (q.includes('apsti') || q.includes('sistema') || q.includes('comput') || q.includes('software')) {
                return this.formatearMallaCarrera('apsti');
            }
            if (q.includes('ani') || q.includes('negocio') || q.includes('aduan') || q.includes('comercio')) {
                return this.formatearMallaCarrera('ani');
            }
            if (q.includes('conta') || q.includes('tribut')) {
                return this.formatearMallaCarrera('contabilidad');
            }
            if (q.includes('pesqu') || q.includes('dpa') || q.includes('mar') || q.includes('acuicol')) {
                return this.formatearMallaCarrera('dpa');
            }
        }

        // 2. Preguntas sobre Beca 18
        if (q.includes('beca 18') || (q.includes('beca') && q.includes('pronabec'))) {
            return `🎓 **PROGRAMA BECA 18 - PRONABEC EN EL IESTP HERCÁR**\n\n¡Excelentes noticias! El **IESTP Hermanos Cárcamo** es un instituto público elegible para las convocatorias de **Beca 18** y **Beca Permanencia** de PRONABEC:\n\n### 📋 Requisitos Principales:\n* Pertenecer al tercio superior o tener promedio 15 en los 2 últimos años de secundaria.\n* Clasificación de pobreza o pobreza extrema en el SISFOH (MIDIS).\n* Tener menos de 22 años de edad al postular.\n* Haber ingresado a cualquiera de las 4 carreras oficiales.\n\n### 🎁 Beneficios que Otorga el Estado:\n* **Laptop personal gratuita** para tus estudios.\n* Subvención económica mensual para alimentación y movilidad local.\n* Pago total de matrícula, materiales y trámites de titulación profesional.\n* Acompañamiento y tutoría constante.`;
        }

        // 3. Preguntas sobre Titulación y Prácticas EFSRT
        if (q.includes('titul') || q.includes('como me titulo') || q.includes('efsrt') || q.includes('practicas pre')) {
            return `🏆 **REQUISITOS OFICIALES PARA TITULACIÓN PROFESIONAL TÉCNICA**\n\nTodos los egresados obtienen su **Título Profesional Técnico a Nombre de la Nación** emitido por el Ministerio de Educación (MINEDU):\n\n### 📌 Requisitos indispensables:\n1. **Aprobar los 6 semestres académicos** del plan de estudios oficial.\n2. **Acreditar las EFSRT** (Experiencias Formativas en Situaciones Reales de Trabajo / Prácticas Preprofesionales) en empresas del sector productivo.\n3. **Acreditar el idioma extranjero** (Inglés Técnico a nivel básico/intermedio).\n4. **Aprobar la sustentación de un Proyecto de Innovación Tecnológica** o rendir el Examen de Suficiencia Profesional.\n5. **Constancia de no adeudo** administrativo, de biblioteca y talleres.\n\n*Nota:* Por cada año aprobado recibes un **Certificado Modular Progresivo** que te permite trabajar formalmente antes de titularte.`;
        }

        // 4. Preguntas sobre Carnet de Medio Pasaje
        if (q.includes('carnet') || q.includes('pasaje') || q.includes('medio pasaje')) {
            return `🚌 **CARNET OFICIAL DE MEDIO PASAJE (MINEDU)**\n\nEl carnet oficial de estudiante de educación superior tecnológica se tramita al inicio del año lectivo:\n\n* **Beneficio Legal:** Otorga el **50% de descuento (Medio Pasaje)** en el transporte público urbano e interurbano (combis, buses y colectivos de Paita, Piura, Sullana y Talara) conforme a la Ley N° 26271.\n* **Costo TUPA:** Tasa mínima de **S/ 20.00** aprobada en el TUPA institucional.\n* **Vigencia:** 1 año académico completo.`;
        }

        // 5. Preguntas sobre Cómo llegar / Transporte
        if (q.includes('como llego') || q.includes('donde queda') || q.includes('ruta') || q.includes('paradero') || q.includes('combi')) {
            return `📍 **¿CÓMO LLEGAR AL IESTP HERMANOS CÁRCAMO?**\n\nEl campus central está ubicado en **Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita Alta**.\n\n### 🚍 Rutas de Acceso:\n* **Desde Piura:** Tomar combis o autos en el Terminal Terrestre de Piura (Av. Sánchez Cerro). Bajar en el paradero de Paita Alta / Urb. El Parque. (Viaje: ~50 minutos).\n* **Desde Sullana:** Colectivos directos Sullana-Paita. Solicitar parada en Urb. El Parque en Paita Alta. (Viaje: ~40 minutos).\n* **Desde Paita Baja:** Tomar cualquier combi urbana o colectivo que suba a Paita Alta por la bajada de la punta o el óvalo. Bajar frente a Urb. El Parque. (Viaje: ~10 minutos).`;
        }

        // 6. Preguntas sobre Temario y Examen de Admisión
        if (q.includes('temario') || (q.includes('que viene') && q.includes('examen')) || q.includes('como es el examen')) {
            return `📝 **TEMARIO DEL EXAMEN DE ADMISIÓN OFICIAL**\n\nEl examen de admisión evalúa las siguientes áreas académicas:\n\n* 🧮 **Razonamiento Lógico-Matemático (30%):** Aritmética, porcentajes, sucesiones numéricas, planteo de ecuaciones y razonamiento espacial.\n* 📖 **Razonamiento Verbal y Comprensión Lectora (30%):** Comprensión de textos, analogías, términos excluidos y vocabulario contextual.\n* 🏛️ **Cultura General y Realidad Regional (20%):** Historia de Paita, héroes Cárcamo, geografía del norte peruano y actualidad nacional.\n* 🔬 **Ciencias, Tecnología y Sociedad (20%):** Fundamentos de tecnología, ecología, conservación y razonamiento científico.\n\n*Consejo:* Descansa bien la noche anterior y asiste con tu DNI original y carnet de postulante.`;
        }

        // 7. Preguntas sobre Quién te creó / Autor
        if (q.includes('quien te creo') || q.includes('quien te desarrollo') || q.includes('quien te programo') || q.includes('autor') || q.includes('creador')) {
            return `🤖 **ORIGEN Y DESARROLLO DE HERCARTA**\n\nFui concebida, desarrollada y entrenada por **Gerson Misael Pintado Huamán (GMPH2007)**, estudiante de la **Carrera Profesional Técnica de Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI)** del **IESTP "Hermanos Cárcamo" de Paita**.\n\nMi desarrollo combina una Red Neuronal Artificial en JavaScript, síntesis de voz femenina dulce humanizada, simulador financiero TUPA y diseño fullscreen moderno para brindar atención 24/7 a toda la juventud paiteña.`;
        }

        // 8. Plataformas SIGA / Aula Virtual / Biblioteca
        if (q.includes('siga') || q.includes('aula virtual') || q.includes('notas') || q.includes('asistencia')) {
            return `💻 **SISTEMA ACADÉMICO SIGA WEB**\n\nPara consultar tus calificaciones, asistencias y matrícula virtual, puedes ingresar al sistema SIGA institucional:\n\n🔗 [http://siga.ieshercar.edu.pe/](http://siga.ieshercar.edu.pe/)\n\nIngresas con tu usuario (número de DNI) y tu contraseña asignada por Secretaría Académica.`;
        }

        return null;
    },

    formatearMallaCarrera: function(carreraId) {
        const c = this.carreras.find(car => car.id === carreraId);
        if (!c || !c.mallaPorCiclos) return null;

        let res = `📖 **MALLA CURRICULAR Y PLAN DE ESTUDIOS: ${c.nombre.toUpperCase()}**\n\n`;
        res += `Duración: **3 años lectivos (6 semestres)** | Título: **${c.titulo}**\n\n`;
        
        c.mallaPorCiclos.forEach(ciclo => {
            res += `### 🔹 ${ciclo.ciclo}:\n`;
            ciclo.cursos.forEach(cur => {
                res += `* ${cur}\n`;
            });
            res += '\n';
        });

        res += `> 💡 *Certificación Modular:* Al culminar cada 2 semestres (1 año) obtienes un certificado oficial emitido por el MINEDU para incorporarte al mercado laboral.`;
        return res;
    },

    formatearDatosBancarios: function() {
        const b = this.instituto.datosBancarios;
        return `🏦 **DATOS BANCARIOS OFICIALES: BANCO DE LA NACIÓN**

El **IESTP "Hermanos Cárcamo"** recauda todas sus tasas académicas y administrativas únicamente en las cuentas oficiales del **Banco de la Nación**:

### 💳 Cuentas Institucionales para Depósitos y Transferencias:
* **Entidad Bancaria:** ${b.banco}
* **Titular de la Cuenta:** ${b.titular}
* **RUC Institucional:** \`${b.ruc}\`
* **Cuenta Corriente (Soles):** \`${b.cuentaCorriente}\`
* **Código de Cuenta Interbancario (CCI):** \`${b.cci}\`
* **Moneda:** ${b.moneda}
* **Canales Habilitados:** Ventanillas BN a nivel nacional, Red de Agentes MultiRed y transferencias interbancarias directas (BCP, BBVA, Interbank, Scotiabank, Yape/Plin a cuenta).

---

### 💵 Principales Tasas TUPA 2026:
* **Matrícula Semestral Regular:** ${b.tasasOficiales.matriculaSemestral}
* **Inscripción Examen de Admisión Ordinario:** ${b.tasasOficiales.admisionOrdinaria}
* **Ciclo Pre-Tecnológico:** ${b.tasasOficiales.preTecnologico}
* **Carnet de Medio Pasaje MINEDU:** ${b.tasasOficiales.carnetMedioPasaje}

---

### 📲 ¿Qué hacer luego de depositar?
1. Exige tu voucher impreso o comprobante digital con el **N° de Operación** legible.
2. Ingresa a la plataforma oficial: [pagos.ieshercar.edu.pe](${b.plataformaVouchers})
3. Digita tu **DNI**, adjunta la imagen clara del voucher y haz clic en *Registrar Pago*.
4. Descarga tu boleta de venta electrónica oficial desde: [sistema.ieshercar.com/Consulta_Boletas](${b.consultaBoletas})

> ⚠️ *Advertencia de Seguridad:* Nunca deposites a números de cuenta de personas particulares. Todos los pagos del instituto se realizan exclusivamente en las cuentas oficiales del Banco de la Nación.`;
    }
};

// Export para Node.js y navegadores
if (typeof module !== 'undefined' && module.exports) {
    module.exports = INSTITUCIONAL_KB;
}
