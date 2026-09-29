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
    routes: {
        about: {
            title: '',
            heading: 'My Little Virtual Hospital',
            description: 'A gamified hospital management sandbox. Admit patients, browse the roster and explore live clinical analytics. No login needed.',
        },
        home: {
            title: 'home',
            heading: 'Home',
            description: 'The MLVH interactive 3D front desk, check the calendar, see who is on duty today, etc.',
        },
        patients: {
            title: 'patient admin',
            heading: 'Patient Administration',
            description: 'Admit new patients, search the hospital roster and manage discharges. Create your own character.',
        },
        'medical-records': {
            title: 'medical records',
            heading: 'Medical Records',
            description: 'Search any registered patient, read their full medical history and log new consultation records.',
        },
        settings: {
            title: 'settings',
            heading: 'Settings',
            description: 'Personalize your visit, choose the language for the hospital.',
        },
        'not-found': {
            title: 'not found',
            heading: 'Page Not Found',
            description: 'This page does not exist in our hospital.',
        },
        dashboard: {
            title: 'dashboard',
            description: 'Live clinical analytics for My Little Virtual Hospital, admissions per week, patients by species and consultations by type.',
        },
    },
    notFound: {
        title: '404. Not Found',
        message: 'This page does not exist in our hospital.',
        back: 'Back to the Hospital',
    },
    common: {
        close: 'Close',
    },
    home: {
        welcome: 'Welcome to My Little Virtual Hospital !!',
        nextReset: 'next reset in {time}...',
        onDuty: 'On Duty',
        nextProfessional: 'Next professional',
        calendar: {
            toggle: 'Toggle calendar view',
        },
        scene: {
            phone: 'Phone',
            board: 'Whiteboard',
        },
        board: {
            title: 'Reception Whiteboard',
            tools: 'Whiteboard tools',
            pen: 'Pen',
            eraser: 'Eraser',
            canvas: 'Shared whiteboard',
            loading: 'the board is loading...!',
            loadError: 'Could not load the whiteboard.',
            saveError: 'Could not save your stroke.',
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