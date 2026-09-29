  // --- MODULE: not found view ---

  import { t } from '../../i18n.js';

export const getNotFoundView = () => {
    return `
    <div class="mlvh-card">
        <div class="mlvh-card-header">
            <span class="mlvh-card-tag">404</span>
        </div>
        <div class="mlvh-card-body text-center">
            <h5 class="mlvh-about-title">${t('notFound.title')}</h5>
            <p class="mlvh-card-subtitle">${t('notFound.message')}</p>
            <button type="button" class="btn btn-primary" id="not-found-back-btn">${t('notFound.back')}</button>
        </div>
    </div>
    `;
};

export const initNotFoundLogic = () => {
    document.getElementById('not-found-back-btn')?.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('mlvh:navigate', {
            detail: { route: 'home' },
        }));
    });
};