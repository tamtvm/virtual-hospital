// --- MODULE: english locale ---

export const en = {
    shell: {
        skipToContent: 'Skip to main content',
        toggleNavigation: 'Toggle navigation',
        backToEntry: 'Back to entry screen',
        history: 'History',
        goBack: 'Go back',
        goForward: 'Go forward',
    },
    nav: {
        home: 'Home',
        patients: 'Patient Admin',
        medicalRecords: 'Medical Records',
        dashboard: 'Dashboard',
        settings: 'Settings',
    },
    settings: {
        title: 'Settings',
        language: {
            title: 'Language',
            hint: 'Choose the language for the whole hospital.',
        },
    },
    species: {
        human: 'Human',
        cat: 'Cat',
        bunny: 'Bunny',
        rat: 'Rat',
        monkey: 'Monkey',
        unknown: 'Unknown',
    },
    consultationTypes: {
        scheduled: 'Scheduled',
        preventive: 'Preventive',
        urgent: 'Urgent',
    },
    dashboard: {
        loadError: {
            title: "Couldn't load the dashboard",
            hint: 'Reload the page in a moment to try again.',
        },
        emptyChart: 'No data yet.',
        admissions: {
            title: 'Admissions per week',
            series: 'Admissions',
            rangeLabel: 'Time range',
            range: 'Last {count} weeks',
            rangeError: "Couldn't load this range.",
        },
        species: {
            title: 'Patients by species',
        },
        consultations: {
            title: 'Consultations by type',
            series: 'Consultations',
        },
    },
};