// --- MODULE: about / entry screen view ---

const ABOUT_TABS = {
    'what-is': {
        label: 'What is MLVH?',
        content: `
            <h5 class="mlvh-about-title">hello!! this is tam, welcome to my little virtual hospital!</h5>
            <p>My Little Virtual Hospital (MLVH) is a gamified hospital management system I started building mostly out of boredom in my free time. I will be using it as a collection of ideas + stuff Ill be learning along the way, so maybe it will never truly have an end!</p>
            <p>The website is a live online sandbox, everything is made with free easy accessible tools and every single illustration you see here is handmade by me :+}</p>
            <p class="mb-0">theres no login needed, no data collection, just click around!! (for now heh)</p>
        `,
    },
    'how-to': {
        label: 'How to Use',
        content: `
            <h5 class="mlvh-about-title">how to play mlvh?</h5>
            <p>You can enter the hospital management dashboard by pressing "Enter" below! From there, youll find different sections to interact with.</p>
            <p>Currently, I only have these two active, but Im working on adding more:</p>

            <p class="mb-1"><strong>Patient Admin</strong></p>
            <ul>
                <li>Admit new patients, search the roster, and manage discharges.</li>
                <li>Create your own character by pressing the "+" next to the search bar. Personalize your avatar, name, pronouns, location and more however you want!</li>
                <li>Check the profile of your characters by clicking on them to edit their info, check their medical history, or discharge them.</li>
                <li>If you prefer to skip creating a patient, you can just use any of our 3 default characters to keep exploring the hospital.</li>
            </ul>

            <p class="mb-1"><strong>Medical Records</strong></p>
            <ul class="mb-0">
                <li>Search up any currently registered patient and view their complete record history.</li>
                <li>Add new consultation records!</li>
            </ul>

            <span class="d-block mt-3 mlvh-card-subtitle">
                coming soon: Im planning to add roles, explanation pop-ups, a dashboard graph and stuff! pls stay tuned :+]
            </span>
        `,
    },
    stack: {
        label: 'Tech Stack',
        content: `
            <h5 class="mlvh-about-title">Tech Stack</h5>
            <p><strong>Frontend:</strong> I decided to work with vanilla JavaScript (ES modules), Bootstrap 5, and a custom lightweight router, no heavy frontend frameworks! Everything is hosted on Cloudflare Pages.</p>
            <p><strong>Backend:</strong> Django + Django REST Framework, with a PostgreSQL database on Neon.tech, deployed on Render.</p>
            <p><strong>The Sandbox:</strong> The website is a centralized, live online sandbox. Everything works together in this single link!! also everyone can see what youre currently updating, so feel free to break things :+] To keep it clean, the database resets automatically every 30 minutes using a scheduled external reset (via cron-job.org), along with an uptime ping (UptimeRobot) to keep the free-tier backend awake!</p>
            <p class="mb-0">Curious about the code? You can check out the <a href="https://github.com/tamtvm/virtual-hospital" target="_blank" rel="noopener">GitHub repo</a> here!</p>
        `,
    },
    'contact-me': {
        label: 'Contact Me!',
        content: `
            <h5 class="mlvh-about-title">Contact Me!</h5>
            <p class="mb-0">pls feel free to contact me at <a href="mailto:ttamvm@gmail.com">ttamvm@gmail.com</a>!</p>
        `,
    },
};

const DEFAULT_TAB = 'what-is';

const renderNavButtons = () => {
    return Object.entries(ABOUT_TABS)
        .map(([id, tab]) => `
            <button type="button" class="mlvh-sidebar-link mlvh-about-nav-btn${id === DEFAULT_TAB ? ' active' : ''}" data-tab="${id}">
                ${tab.label}
            </button>
        `)
        .join('');
};

export const getAboutView = () => {
    return `
    <div class="mlvh-about-wrap">
        <div class="mlvh-card mlvh-about-card">
            <div class="mlvh-folder-header">
                <h5 class="fw-bold mb-0 mlvh-folder-tab-title">Welcome</h5>
            </div>
            <div class="mlvh-card-body p-0">
                <div class="mlvh-about-columns">
                    <div class="mlvh-about-nav-col">
                        ${renderNavButtons()}
                    </div>
                    <div class="mlvh-about-content-col" id="about-content-panel">
                        ${ABOUT_TABS[DEFAULT_TAB].content}
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary mlvh-about-enter-btn" id="about-enter-btn">Enter Now</button>
    </div>
    `;
};

export const initAboutLogic = () => {
    const panel = document.getElementById('about-content-panel');

    document.querySelectorAll('.mlvh-about-nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mlvh-about-nav-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            panel.innerHTML = ABOUT_TABS[btn.dataset.tab].content;
        });
    });

    document.getElementById('about-enter-btn')?.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('mlvh:navigate', {
            detail: { route: 'patients' },
        }));
    });
};