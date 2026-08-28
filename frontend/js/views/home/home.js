// --- MODULE: home view ---

const RESET_INTERVAL_MINUTES = 30;

const getNextReset = (now) => {
    const next = new Date(now);
    next.setSeconds(0, 0);
    next.setMinutes(now.getMinutes() < RESET_INTERVAL_MINUTES ? RESET_INTERVAL_MINUTES : 60);
    return next;
};

const pad = (value) => String(value).padStart(2, '0');

export const getHomeView = () => {
    return `
    <div class="mlvh-home-wrap">
        <h2 class="mlvh-home-welcome">welcome to my little virtual hospital</h2>
        <div class="mlvh-reset-clock">
            <span class="mlvh-reset-time" id="home-clock-time"></span>
            <span class="mlvh-reset-note" id="home-clock-note"></span>
        </div>
    </div>
    `;
};

export const initHomeLogic = () => {
    const tick = () => {
        const timeEl = document.getElementById('home-clock-time');
        const noteEl = document.getElementById('home-clock-note');
        if (!timeEl || !noteEl) {
            clearInterval(intervalId);
            return;
        }
        const now = new Date();
        const diff = getNextReset(now) - now;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        noteEl.textContent = `next reset in ${pad(minutes)}:${pad(seconds)}`;
    };

    const intervalId = setInterval(tick, 1000);
    tick();
};