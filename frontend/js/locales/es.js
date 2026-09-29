// --- MODULE: spanish locale ---

export const es = {
    shell: {
        skipToContent: 'Saltar al contenido principal',
        toggleNavigation: 'Abrir o cerrar la navegación',
        backToEntry: 'Volver a la pantalla de bienvenida',
        history: 'Historial',
        goBack: 'Retroceder',
        goForward: 'Avanzar',
    },
    nav: {
        home: 'Inicio',
        patients: 'Pacientes',
        medicalRecords: 'Fichas médicas',
        dashboard: 'Estadísticas',
        settings: 'Configuración',
    },
    settings: {
        title: 'Configuración',
        language: {
            title: 'Idioma',
            hint: 'Elige el idioma de todo el hospital.',
        },
    },
    routes: {
        about: {
            title: '',
            heading: 'My Little Virtual Hospital',
            description: 'Un sandbox gamificado de gestión hospitalaria. Ingresa pacientes, revisa el registro y explora analíticas clínicas en vivo. No necesitas iniciar sesión.',
        },
        home: {
            title: 'inicio',
            heading: 'Inicio',
            description: 'La recepción 3D interactiva de MLVH, revisa el calendario, mira quién está de turno hoy y más.',
        },
        patients: {
            title: 'pacientes',
            heading: 'Administración de pacientes',
            description: 'Ingresa nuevos pacientes, busca en el registro del hospital y gestiona las altas. Crea tu propio personaje.',
        },
        'medical-records': {
            title: 'fichas médicas',
            heading: 'Fichas médicas',
            description: 'Busca cualquier paciente registrado, revisa su historial médico completo y registra nuevas consultas.',
        },
        settings: {
            title: 'configuración',
            heading: 'Configuración',
            description: 'Personaliza tu visita, elige el idioma del hospital.',
        },
        'not-found': {
            title: 'no encontrada',
            heading: 'Página no encontrada',
            description: 'Esta página no existe en nuestro hospital.',
        },
        dashboard: {
            title: 'estadísticas',
            description: 'Analíticas clínicas en vivo de My Little Virtual Hospital, ingresos por semana, pacientes por especie y consultas por tipo.',
        },
    },
    notFound: {
        title: '404. Página no encontrada',
        message: 'Esta página no existe en nuestro hospital.',
        back: 'Volver al hospital',
    },
    species: {
        human: 'Humano',
        cat: 'Gato',
        bunny: 'Conejo',
        rat: 'Rata',
        monkey: 'Monito',
        unknown: 'Desconocido',
    },
    consultationTypes: {
        scheduled: 'Programada',
        preventive: 'Preventiva',
        urgent: 'Urgente',
    },
    dashboard: {
        loadError: {
            title: 'No se pudieron cargar las estadísticas',
            hint: 'Recarga la página en un momento para intentarlo de nuevo.',
        },
        emptyChart: 'Aún no hay datos.',
        admissions: {
            title: 'Ingresos por semana',
            series: 'Ingresos',
            rangeLabel: 'Periodo',
            range: 'Últimas {count} semanas',
            rangeError: 'No se pudo cargar este periodo.',
        },
        species: {
            title: 'Pacientes por especie',
        },
        consultations: {
            title: 'Consultas por tipo',
            series: 'Consultas',
        },
    },
};