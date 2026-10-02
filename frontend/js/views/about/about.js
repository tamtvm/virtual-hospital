// --- MODULE: about / entry screen view ---

import { t } from '../../i18n.js';

const GITHUB_REPO_URL = 'https://github.com/tamtvm/virtual-hospital';
const CONTACT_EMAIL = 'ttamvm@gmail.com';

const ABOUT_TABS = {
    'what-is': {
        labelKey: 'about.tabs.whatIs',
        render: () => `
            <h5 class="mlvh-about-title">${t('about.whatIs.heading')}</h5>
            <p>${t('about.whatIs.intro')}</p>
            <p>${t('about.whatIs.sandbox')}</p>
            <p class="mb-0">${t('about.whatIs.noLogin')}</p>
        `,
    },
    'how-to': {
        labelKey: 'about.tabs.howTo',
        render: () => `
            <h5 class="mlvh-about-title">${t('about.howTo.heading')}</h5>
            <p>${t('about.howTo.enter')}</p>
            <p>${t('about.howTo.sections')}</p>

            <p class="mb-1"><strong>${t('nav.home')}</strong></p>
            <ul>
                <li>${t('about.howTo.home.scene')}</li>
                <li>${t('about.howTo.home.clock')}</li>
                <li>${t('about.howTo.home.calendar')}</li>
                <li>${t('about.howTo.home.onDuty')}</li>
            </ul>

            <p class="mb-1"><strong>${t('nav.dashboard')}</strong></p>
            <ul>
                <li>${t('about.howTo.dashboard.charts')}</li>
            </ul>

            <p class="mb-1"><strong>${t('nav.patients')}</strong></p>
            <ul>
                <li>${t('about.howTo.patients.manage')}</li>
                <li>${t('about.howTo.patients.create')}</li>
                <li>${t('about.howTo.patients.profile')}</li>
                <li>${t('about.howTo.patients.defaults')}</li>
            </ul>

            <p class="mb-1"><strong>${t('nav.medicalRecords')}</strong></p>
            <ul class="mb-0">
                <li>${t('about.howTo.records.search')}</li>
                <li>${t('about.howTo.records.add')}</li>
            </ul>

            <span class="d-block mt-3 mlvh-card-subtitle">
                ${t('about.howTo.comingSoon')}
            </span>
        `,
    },
    stack: {
        labelKey: 'about.tabs.stack',
        render: () => `
            <h5 class="mlvh-about-title">${t('about.tabs.stack')}</h5>
            <p><strong>${t('about.stack.frontendLabel')}</strong> ${t('about.stack.frontend')}</p>
            <p><strong>${t('about.stack.backendLabel')}</strong> ${t('about.stack.backend')}</p>
            <p><strong>${t('about.stack.sandboxLabel')}</strong> ${t('about.stack.sandbox')}</p>
            <p class="mb-0">${t('about.stack.repo', { repo: `<a href="${GITHUB_REPO_URL}" target="_blank" rel="noopener">${t('about.stack.repoLink')}</a>` })}</p>
        `,
    },
    'contact-me': {
        labelKey: 'about.tabs.contact',
        render: () => `
            <h5 class="mlvh-about-title">${t('about.tabs.contact')}</h5>
            <p class="mb-0">${t('about.contact.message', { email: `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>` })}</p>
        `,
    },
};

const DEFAULT_TAB = 'what-is';

const renderNavButtons = () => {
    return Object.entries(ABOUT_TABS)
        .map(([id, tab]) => `
            <button type="button" class="mlvh-sidebar-link mlvh-about-nav-btn${id === DEFAULT_TAB ? ' active' : ''}" data-tab="${id}">
                ${t(tab.labelKey)}
            </button>
        `)
        .join('');
};

export const getAboutView = () => {
    return `
    <div class="mlvh-about-wrap">
        <div class="mlvh-card mlvh-about-card">
            <div class="mlvh-folder-header">
                <h5 class="fw-bold mb-0 mlvh-folder-tab-title">${t('about.title')}</h5>
            </div>
            <div class="mlvh-card-body p-0">
                <div class="mlvh-about-columns">
                    <div class="mlvh-about-nav-col">
                        ${renderNavButtons()}
                    </div>
                    <div class="mlvh-about-content-col" id="about-content-panel">
                        ${ABOUT_TABS[DEFAULT_TAB].render()}
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary mlvh-about-enter-btn" id="about-enter-btn">${t('about.enter')}</button>
    </div>
    `;
};

export const initAboutLogic = () => {
    const panel = document.getElementById('about-content-panel');

    document.querySelectorAll('.mlvh-about-nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mlvh-about-nav-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            panel.innerHTML = ABOUT_TABS[btn.dataset.tab].render();
        });
    });

    document.getElementById('about-enter-btn')?.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('mlvh:navigate', {
            detail: { route: 'home' },
        }));
    });
};