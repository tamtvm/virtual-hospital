// --- MODULE: not found view ---

export const getNotFoundView = () => {
    return `
    <div class="mlvh-card">
        <div class="mlvh-card-header">
            <span class="mlvh-card-tag">404</span>
        </div>
        <div class="mlvh-card-body text-center">
            <h5 class="mlvh-about-title">404. Not Found</h5>
            <p class="mlvh-card-subtitle">This page does not exist in our hospital.</p>
            <button type="button" class="btn btn-primary" id="not-found-back-btn">Back to the Hospital</button>
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