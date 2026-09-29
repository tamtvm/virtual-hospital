// --- MODULE: home calendar ---

import { t, getLocale } from '../../i18n.js';

const REFERENCE_SUNDAY_UTC = Date.UTC(2024, 0, 7);
const DAY_MS = 24 * 60 * 60 * 1000;
const pad = (value) => String(value).padStart(2, '0');

const getWeekdayLabels = (locale) => {
    const format = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
    return Array.from({ length: 7 }, (_, day) => format.format(REFERENCE_SUNDAY_UTC + day * DAY_MS).slice(0, 2));
};

export const getCalendarHTML = (today = new Date()) => {
    const locale = getLocale();
    const year = today.getFullYear();
    const month = today.getMonth();
    const monthName = today.toLocaleDateString(locale, { month: 'long' });
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const leadingCells = Array.from({ length: firstWeekday }, () => '<span></span>');

    const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return day === today.getDate()
            ? `<span class="mlvh-calendar-day"><span class="mlvh-calendar-today">${day}</span></span>`
            : `<span class="mlvh-calendar-day">${day}</span>`;
    });

    const detailedHTML = `
        <div class="mlvh-calendar-detailed">
            <span class="mlvh-calendar-title">${monthName} ${year}</span>
            <div class="mlvh-calendar-weekdays">
                ${getWeekdayLabels(locale).map((label) => `<span class="mlvh-calendar-weekday">${label}</span>`).join('')}
            </div>
            <div class="mlvh-calendar-days">
                ${leadingCells.join('')}
                ${dayCells.join('')}
            </div>
        </div>
    `;

    const simpleHTML = `
        <div class="mlvh-calendar-simple">
            <span class="mlvh-calendar-simple-month">${monthName}</span>
            <span class="mlvh-calendar-simple-day">${pad(today.getDate())}</span>
        </div>
    `;

    return `
    <div class="mlvh-calendar" data-calendar-view="simple">
        <button type="button" class="mlvh-calendar-toggle" aria-label="${t('home.calendar.toggle')}"></button>
        ${simpleHTML}
        ${detailedHTML}
    </div>
    `;
};

export const initCalendar = () => {
    const calendar = document.querySelector('.mlvh-calendar');
    const toggle = calendar?.querySelector('.mlvh-calendar-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        calendar.dataset.calendarView =
            calendar.dataset.calendarView === 'simple' ? 'detailed' : 'simple';
    });
};