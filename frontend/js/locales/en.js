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
    about: {
        title: 'Welcome',
        enter: 'Enter Now',
        tabs: {
            whatIs: 'What is MLVH?',
            howTo: 'How to Use',
            stack: 'Tech Stack',
            contact: 'Contact Me!',
        },
        whatIs: {
            heading: 'hello!! this is tam, welcome to my little virtual hospital!',
            intro: 'My Little Virtual Hospital (MLVH) is a gamified hospital management system I started building mostly out of boredom in my free time. I will be using it as a collection of ideas + stuff Ill be learning along the way, so maybe it will never truly have an end!',
            sandbox: 'The website is a live online sandbox, everything is made with free easy accessible tools and every single illustration you see here is handmade by me :+}',
            noLogin: 'theres no login needed, no cookies, no tracking, just click around!! (for now heh)',
        },
        howTo: {
            heading: 'how to play mlvh?',
            enter: 'You can enter the hospital management dashboard by pressing "Enter" below! From there, youll find different sections to interact with.',
            sections: 'Currently, I only have these four active, but Im working on adding more:',
            home: {
                scene: 'The reception is an interactive scene! hover around and click the objects that react: the phone rings, and the board opens a shared whiteboard where you can draw and erase. Everyone visiting the sandbox draws on the same one and sees each others strokes live, so leave something there before the next reset wipes it!',
                clock: 'The clock shows your own local time and counts down to the next sandbox reset.',
                calendar: 'Flip the calendar with the folded corner to switch between the big date and the full month.',
                onDuty: 'Check whos On Duty!',
            },
            dashboard: {
                charts: 'See admissions per week, patients by species, consultations by type, etc! all pulled live from the same data.',
            },
            patients: {
                manage: 'Admit new patients, search the roster, and manage discharges.',
                create: 'Create your own character by pressing the "+" next to the search bar. Personalize your avatar, name, pronouns, location and more however you want!',
                profile: 'Check the profile of your characters by clicking on them to edit their info, check their medical history, or discharge them.',
                defaults: 'If you prefer to skip creating a patient, you can just use any of our 3 default characters to keep exploring the hospital.',
            },
            records: {
                search: 'Search up any currently registered patient and view their complete record history.',
                add: 'Add new consultation records!',
            },
            comingSoon: 'coming soon: Im planning to add roles, explanation pop-ups and stuff! pls stay tuned :+]',
        },
        stack: {
            frontendLabel: 'Frontend:',
            frontend: 'I decided to work with vanilla JavaScript (ES modules), Bootstrap 5, and a custom lightweight router for most of the site. To experiment with a different stack, I built the "Dashboard" section with Next.js and Recharts instead. Its a separate app, but it pulls from the same Django API and lives on the same domain, so it still feels like one site! Everything is hosted on Cloudflare Pages.',
            backendLabel: 'Backend:',
            backend: 'Django + Django REST Framework, with a PostgreSQL database on Neon.tech, deployed on Render.',
            sandboxLabel: 'The Sandbox:',
            sandbox: 'The website is a centralized, live online sandbox. Everything works together in this single link!! also everyone can see what youre currently updating, so feel free to break things :+] To keep it clean, the database resets automatically every 30 minutes using a scheduled external reset (via cron-job.org), along with an uptime ping (UptimeRobot) to keep the free-tier backend awake!',
            repo: 'Curious about the code? You can check out the {repo} here!',
            repoLink: 'GitHub repo',
        },
        contact: {
            message: 'pls feel free to contact me at {email}!',
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