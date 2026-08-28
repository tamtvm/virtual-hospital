// --- MODULE: home view ---

import { PROFESSIONALS } from '../../constants/patientOptions.js';
import { getCalendarHTML, initCalendar } from './calendar.js';

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
        <div class="mlvh-home-grid">
            <div class="mlvh-home-col-left">
                <div class="mlvh-calendar-card">
                    <div class="mlvh-calendar-spiral">
                        ${Array.from({ length: 7 }, () => '<span class="mlvh-calendar-ring"></span>').join('')}
                    </div>
                    <div class="mlvh-card mlvh-home-card mlvh-home-poster">
                        <div class="mlvh-card-body mlvh-home-card-body">
                            ${getCalendarHTML()}
                        </div>
                    </div>
                </div>
                <div class="mlvh-card mlvh-home-card mlvh-home-poster">
                    <div class="mlvh-card-body mlvh-home-card-body"></div>
                </div>
            </div>

            <div class="mlvh-home-col-center">
                <h2 class="mlvh-home-welcome">welcome to my little virtual hospital</h2>
                <div class="mlvh-reset-clock">
                    <span class="mlvh-reset-time" id="home-clock-time"></span>
                    <span class="mlvh-reset-note" id="home-clock-note"></span>
                </div>
                <div class="mlvh-home-desk" aria-hidden="true"></div>
            </div>

            <div class="mlvh-home-col-right">
                <div class="mlvh-card mlvh-home-card">
                    <div class="mlvh-card-header">
                        <span class="mlvh-card-tag">On Duty Today</span>
                    </div>
                    <div class="mlvh-card-body mlvh-home-card-body">
                        <ul class="mlvh-duty-list">
                            ${PROFESSIONALS.map(({ label }) => `<li class="mlvh-duty-item">${label}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

export const initHomeLogic = () => {
    initCalendar();

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