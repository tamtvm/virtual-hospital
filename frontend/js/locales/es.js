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