/**
 * BASE DE CONOCIMIENTO INSTITUCIONAL COMPLETA
 * I.E.S.T.P. "HERMANOS CÁRCAMO" - PAITA, PIURA, PERÚ
 * Sitio Oficial: https://ieshercar.edu.pe/
 * Plataforma de Pagos: https://pagos.ieshercar.edu.pe/
 * Mesa de Partes: https://sistema.ieshercar.edu.pe/registro-tramite/
 */

const INSTITUCIONAL_KB = {
    instituto: {
        nombre: 'Instituto de Educación Superior Tecnológico Público "Hermanos Cárcamo"',
        siglas: 'IESTP HÉRCAR',
        lema: 'Formando Profesionales y Construyendo Oportunidades',
        creacion: 'Resolución Ministerial N° 232-87-ED (1987)',
        revalidacion: 'Resolución Ministerial N° 0528-2006-ED',
        direccion: 'Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura, Perú',
        horario: 'Lunes a Viernes de 8:00 AM a 3:00 PM',
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
        
        historia: `El IESTP "Hermanos Cárcamo" fue creado en 1987 (R.M. N° 232-87-ED) y revalidado por R.M. N° 0528-2006-ED. Lleva con orgullo el nombre de los heroicos hermanos Cárcamo (Victoriano, Andrés, Raymundo y Enrique), ilustres paiteños que en 1821 capturaron el pailebote español "Sacramento", acción gloriosa que dio origen a la Marina de Guerra del Perú. Hoy en día, la institución cuenta con un megaproyecto de modernización de más de S/ 36 millones ejecutado por el Gobierno Regional de Piura, con laboratorios de última tecnología, modernos ambientes y una embarcación pesquera propia con radar y visión nocturna para la instrucción práctica en alta mar.`,
        
        beneficiosPublicos: [
            'Educación Superior Gratuita (Instituto Público del Estado Peruano - MINEDU). Solo se cancela derecho de matrícula y carnet por semestre.',
            'Título Profesional Técnico a Nombre de la Nación con valor oficial en todo el Perú y convalidación universitaria.',
            'Certificaciones Modulares Progresivas al culminar cada año académico, permitiendo inserción laboral inmediata.',
            'Convenios de prácticas preprofesionales con las principales empresas del puerto de Paita y Piura.',
            'Acceso a Beca 18 (PRONABEC), Beca Permanencia y beneficios económicos para primeros puestos.',
            'Carnet de Medio Pasaje oficial del MINEDU.',
            'Biblioteca Virtual moderna y plataformas digitales 24/7 (Mesa de Partes y Sistema de Pagos).'
        ]
    },

    carreras: [
        {
            id: 'apsti',
            nombre: 'Arquitectura de Plataformas y Servicios de Tecnologías de la Información (APSTI)',
            alias: ['sistemas', 'computacion', 'informatica', 'programacion', 'ti', 'software', 'redes', 'apsti'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Arquitectura de Plataformas y Servicios de Tecnologías de la Información',
            icono: '💻',
            color: '#3b82f6',
            descripcionCorta: 'Desarrollo de software, gestión de infraestructura cloud, ciberseguridad, redes informáticas y soporte técnico de plataformas digitales.',
            perfil: 'Aprenderás a programar aplicaciones web y móviles, diseñar bases de datos, administrar servidores, implementar seguridad informática y gestionar la infraestructura tecnológica que necesitan las empresas modernas.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Gestión de soporte técnico, seguridad y tecnologías de la información' },
                { modulo: 'Módulo II', nombre: 'Desarrollo de software, sistemas web, móviles y bases de datos' },
                { modulo: 'Módulo III', nombre: 'Gestión y arquitectura de servicios TI, redes y computación en la nube (Cloud)' }
            ],
            campoLaboral: [
                'Desarrollador de aplicaciones web, móviles y sistemas empresariales.',
                'Administrador de redes, servidores y plataformas en la nube (Cloud/DevOps).',
                'Especialista en soporte técnico informático y centros de datos.',
                'Gestor de ciberseguridad y administrador de bases de datos (SQL, NoSQL).',
                'Empresas portuarias, agencias de aduana, agroindustrias de Piura o trabajo remoto global.'
            ],
            porQueEstudiar: 'Es una de las carreras más demandadas del planeta y en Paita todas las agencias aduaneras, logísticas, pesqueras y comerciales requieren sistemas automatizados y soporte digital continuo.'
        },
        {
            id: 'ani',
            nombre: 'Administración de Negocios Internacionales (ANI)',
            alias: ['negocios', 'comercio exterior', 'aduanas', 'exportaciones', 'importaciones', 'ani', 'administracion'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Administración de Negocios Internacionales',
            icono: '🚢',
            color: '#0ea5e9',
            descripcionCorta: 'Estrategias de comercio exterior, logística aduanera internacional, importación, exportación y operaciones portuarias.',
            perfil: 'Te capacitarás para gestionar operaciones de compra y venta internacional, tramitar gestiones aduaneras, coordinar la cadena de suministros y logística portuaria internacional, y formular planes de negocios globales.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Operaciones y logística comercial nacional e internacional' },
                { modulo: 'Módulo II', nombre: 'Gestión aduanera, aranceles, importación, exportación y transporte internacional' },
                { modulo: 'Módulo III', nombre: 'Planes de negocios internacionales, finanzas y marketing global' }
            ],
            campoLaboral: [
                'Agencias de aduanas y agencias marítimas en el Puerto de Paita.',
                'Empresas agroexportadoras (mango, uva, limón, banano orgánico de Piura).',
                'Empresas pesqueras e hidrobiológicas exportadoras.',
                'Depósitos temporales, almacenes logísticos y terminales portuarios.',
                'Gestor de tu propio negocio de importación o exportación independiente.'
            ],
            porQueEstudiar: 'Paita alberga el puerto de exportación más trascendental del norte peruano. Estudiar Negocios Internacionales en Paita te sitúa en el epicentro del comercio mundial con un mercado laboral natural e inmediato.'
        },
        {
            id: 'contabilidad',
            nombre: 'Contabilidad',
            alias: ['conta', 'finanzas', 'tributos', 'auditoria', 'contabilidad', 'impuestos', 'sunat'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Contabilidad',
            icono: '📊',
            color: '#10b981',
            descripcionCorta: 'Registro financiero, gestión tributaria (SUNAT), auditoría, costos, presupuestos y control económico empresarial.',
            perfil: 'Dominarás el registro contable computarizado, la liquidación de impuestos de acuerdo con la normativa de SUNAT, el cálculo de planillas, formulación de estados financieros y análisis de costos para la toma de decisiones empresariales.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Procesos contables, libros electrónicos y documentación comercial' },
                { modulo: 'Módulo II', nombre: 'Contabilidad de costos, presupuestos y control interno' },
                { modulo: 'Módulo III', nombre: 'Análisis de estados financieros, auditoría tributaria y formulación de proyectos' }
            ],
            campoLaboral: [
                'Asistente contable en empresas comerciales, pesqueras, logísticas y agroindustriales.',
                'Gestor tributario y especialista en declaraciones ante SUNAT.',
                'Entidades bancarias y financieras (Banco de la Nación, Cajas Municipales, Cooperativas).',
                'Sector público: Municipalidad de Paita, UGEL, hospitales y organismos estatales.',
                'Consultor contable y asesor tributario independiente para MYPES.'
            ],
            porQueEstudiar: 'Toda empresa legalmente constituida en el Perú requiere obligatoriamente servicios contables. Es una carrera con estabilidad económica permanente y amplio margen de trabajo independiente.'
        },
        {
            id: 'dpa',
            nombre: 'Desarrollo Pesquero y Acuícola (DPA)',
            alias: ['pesqueria', 'pesca', 'acuicultura', 'mar', 'peces', 'dpa', 'recursos hidrobiologicos', 'maricultura'],
            duracion: '3 años (6 semestres académicos)',
            titulo: 'Profesional Técnico en Desarrollo Pesquero y Acuícola',
            icono: '🐟',
            color: '#06b6d4',
            descripcionCorta: 'Producción acuícola, navegación y pesca responsable, procesamiento de recursos marinos y aseguramiento de calidad sanitaria (HACCP).',
            perfil: 'Te formarás en técnicas de cultivo de especies marinas (conchas de abanico, langostinos, peces), navegación y artes de pesca, control higiénico-sanitario en plantas procesadoras y congeladoras, y gestión sostenible de recursos del mar.',
            modulos: [
                { modulo: 'Módulo I', nombre: 'Navegación, artes de pesca y conservación de recursos hidrobiológicos' },
                { modulo: 'Módulo II', nombre: 'Cultivo, reproducción acuícola y manejo de centros de maricultura' },
                { modulo: 'Módulo III', nombre: 'Procesamiento industrial pesquero, inocuidad alimentaria y sistemas HACCP' }
            ],
            campoLaboral: [
                'Supervisor de control de calidad (QA/QC) en plantas congeladoras y conserveras de Paita.',
                'Técnico acuícola en centros de cultivo y criaderos de conchas de abanico o langostinos.',
                'Inspector sanitario pesquero en entidades como SANIPES o IMARPE.',
                'Técnico de operaciones en embarcaciones pesqueras industriales y artesanales.',
                'Asesor técnico en proyectos de innovación y sostenibilidad marina.'
            ],
            porQueEstudiar: 'Paita es la capital pesquera del Perú. Además, el IESTP Hermanos Cárcamo cuenta con una moderna embarcación pesquera propia equipada con tecnología radar, GPS y visión nocturna para clases prácticas directas en el mar.'
        }
    ],

    admision: {
        modalidades: [
            {
                tipo: 'Examen de Admisión Ordinario',
                descripcion: 'Convocatoria general para todos los egresados de educación secundaria (EBR o EBA). Consta de una prueba de conocimientos y aptitud académica (razonamiento verbal, matemático, cultura general y ciencias).'
            },
            {
                tipo: 'Admisión por Exoneración',
                descripcion: 'Dirigido a los dos primeros puestos de colegios secundarios, deportistas calificados acreditados por el IPD, personas con discapacidad (Ley N° 29973), y postulantes preseleccionados de Beca 18 (PRONABEC).'
            },
            {
                tipo: 'Academia Pre Tecno (Centro Pre)',
                descripcion: 'Ciclo preparatorio institucional del instituto que brinda ingreso directo a las carreras según el orden de mérito de sus evaluaciones periódicas.'
            }
        ],
        requisitosInscripcion: [
            'Solicitud dirigida a la Dirección del IESTP en Formato Único de Trámite (FUT).',
            'Certificado original de estudios secundarios de 1° a 5° año (visado por UGEL o emitido por el sistema MINEDU).',
            'Copia simple y legible del DNI vigente.',
            'Partida o acta de nacimiento (original o copia).',
            'Dos (02) fotografías recientes tamaño carnet o pasaporte, a color y con fondo blanco.',
            'Comprobante de pago (Voucher original) por derecho de inscripción al examen de admisión cancelado en el Banco de la Nación.'
        ],
        procesoPasoAPaso: [
            '1. Infórmate sobre la carrera de tu preferencia y las vacantes disponibles.',
            '2. Realiza el depósito por derecho de examen en el Banco de la Nación.',
            '3. Ingresa a la plataforma oficial o acércate a la oficina de admisión del campus.',
            '4. Presenta tus documentos y canjea tu carnet de postulante.',
            '5. Rinde tu evaluación en la fecha programada.',
            '6. Consulta la lista oficial de ingresantes publicada en la web y redes del instituto.'
        ]
    },

    matricula: {
        descripcion: 'La matrícula se efectúa al inicio de cada semestre académico (marzo/abril para semestre I, y agosto/septiembre para semestre II). Por ser un instituto público, la enseñanza es gratuita y no existen pensiones mensuales privadas.',
        costosReferenciales: 'El IESTP Hermanos Cárcamo es un instituto público estatal. Únicamente se cancela una tasa única por derecho de matrícula y carnet institucional según el TUPA institucional (aproximadamente entre S/ 150 a S/ 250 por semestre completo, sin mensualidades adicionales).',
        requisitosCachimbos: [
            'Haber alcanzado vacante en el Examen de Admisión o por Exoneración.',
            'Voucher de pago del derecho de matrícula cancelado en el Banco de la Nación.',
            'Expediente completo con certificados de estudios secundarios originales y copia de DNI.',
            'Registro de voucher en la plataforma digital https://pagos.ieshercar.edu.pe/',
            'Ficha de matrícula debidamente llenada.'
        ],
        requisitosRegulares: [
            'No tener cursos desaprobados que impidan la continuidad académica según plan de estudios.',
            'Constancia de no adeudo administrativo de biblioteca ni talleres.',
            'Voucher de pago del derecho de matrícula semestral en el Banco de la Nación.',
            'Registro del comprobante en https://pagos.ieshercar.edu.pe/'
        ]
    },

    pagos: {
        entidad: 'Banco de la Nación (Cuentas oficiales del IESTP Hermanos Cárcamo)',
        sistemaWeb: 'https://pagos.ieshercar.edu.pe/',
        consultaBoletas: 'https://sistema.ieshercar.com/Consulta_Boletas/index.php',
        guiaPasoAPaso: [
            'Paso 1: Realiza el depósito en el Banco de la Nación (ventanilla física, agente MultiRed o banca autorizada). Guarda muy bien el voucher físico o comprobante digital.',
            'Paso 2: Ingresa desde tu navegador a la plataforma web oficial: https://pagos.ieshercar.edu.pe/',
            'Paso 3: Digita tu número de DNI para que el sistema ubique tus datos de alumno o postulante.',
            'Paso 4: Selecciona el concepto correspondiente (Matrícula, Examen de Admisión, Trámite documentario, Certificado, etc.).',
            'Paso 5: Ingresa los datos exactos del voucher: Número de Operación, Fecha de depósito y Monto cancelado.',
            'Paso 6: Adjunta una foto o archivo PDF nítido y legible del voucher de pago.',
            'Paso 7: Presiona en "Registrar Pago". El sistema emitirá tu constancia de registro.',
            'Paso 8: Descarga tu Boleta Electrónica en: https://sistema.ieshercar.com/Consulta_Boletas/index.php ingresando tu DNI.'
        ],
        importante: '¡Nunca entregues dinero a terceras personas ni a cuentas bancarias personales! Todos los pagos se realizan estrictamente en la cuenta del Banco de la Nación de la institución.'
    },

    tramites: {
        mesaPartes: 'https://sistema.ieshercar.edu.pe/registro-tramite/',
        tramitesFrecuentes: [
            { tramite: 'Constancia de Matrícula', detalle: 'Acredita que te encuentras matriculado en el ciclo actual.' },
            { tramite: 'Constancia de Estudios', detalle: 'Certifica los semestres que vienes cursando en el instituto.' },
            { tramite: 'Consolidado de Notas / Récord Académico', detalle: 'Detalle oficial de las calificaciones obtenidas en cada unidad didáctica.' },
            { tramite: 'Constancia de Egresado', detalle: 'Documento oficial tras haber culminado exitosamente los 6 semestres del plan de estudios.' },
            { tramite: 'Constancia de No Adeudo', detalle: 'Requisito para trámites de titulación y egreso.' },
            { tramite: 'Certificado Modular Oficial', detalle: 'Certifica las competencias técnicas de cada módulo anual aprobado.' },
            { tramite: 'Examen de Suficiencia Profesional y Título', detalle: 'Trámite final para la obtención del Título Profesional Técnico a Nombre de la Nación.' }
        ]
    },

    preguntasFrecuentes: [
        {
            pregunta: '¿El instituto Hermanos Cárcamo es público o privado?',
            respuesta: 'El IESTP "Hermanos Cárcamo" es un **Instituto de Educación Superior Tecnológico Público** del Estado Peruano, dependiente de la Dirección Regional de Educación de Piura (DREP) y el MINEDU. Por ello, la educación es gratuita y no se pagan mensualidades privadas.'
        },
        {
            pregunta: '¿Cuánto dura una carrera técnica?',
            respuesta: 'Todas las carreras profesionales técnicas tienen una duración de **3 años lectivos (distribuidos en 6 semestres académicos)**. Al culminar, obtienes tu **Título Profesional Técnico a Nombre de la Nación** y certificaciones modulares cada año.'
        },
        {
            pregunta: '¿Qué carreras puedo estudiar en el IESTP Hermanos Cárcamo?',
            respuesta: 'Ofrece 4 carreras de alta demanda: \n1. **Arquitectura de Plataformas y Servicios de T.I. (APSTI)**\n2. **Administración de Negocios Internacionales (ANI)**\n3. **Contabilidad**\n4. **Desarrollo Pesquero y Acuícola (DPA)**.'
        },
        {
            pregunta: '¿Tienen convenios o Beca 18?',
            respuesta: '¡Sí! Al ser un instituto público reconocido por el MINEDU, los estudiantes pueden postular a las convocatorias de **Beca 18** de PRONABEC, así como acceder a bolsas de trabajo locales y convenios de prácticas preprofesionales en empresas marítimas, aduaneras, logísticas y agroindustriales de Paita y Piura.'
        },
        {
            pregunta: '¿Cómo llego al instituto y en qué horario atienden?',
            respuesta: 'El campus se ubica en **Av. Miguel Grau – Urb. El Parque Mz. A Lt. 01, Paita – Piura**. La atención al público en ventanilla y secretaría es de **lunes a viernes de 8:00 AM a 3:00 PM**. También puedes comunicarte al **+51 969 100 257** o al **(073) 251013**.'
        },
        {
            pregunta: '¿Puedo convalidar mi carrera técnica con una universidad?',
            respuesta: '¡Sí! De acuerdo con la Ley de Institutos y Escuelas de Educación Superior (Ley N° 30512), los egresados con Título Profesional Técnico a Nombre de la Nación pueden convalidar sus estudios con universidades públicas o privadas para continuar y obtener el grado de bachiller y licenciatura o ingeniería.'
        }
    ]
};

// Export para uso en navegador y módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = INSTITUCIONAL_KB;
}
