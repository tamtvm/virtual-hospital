// --- MODULE: home calendar ---

const WEEKDAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
const pad = (value) => String(value).padStart(2, '0');

export const getCalendarHTML = (today = new Date()) => {
    const year = today.getFullYear();
    const month = today.getMonth();
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
            <span class="mlvh-calendar-title">${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <div class="mlvh-calendar-weekdays">
                ${WEEKDAYS.map((label) => `<span class="mlvh-calendar-weekday">${label}</span>`).join('')}
            </div>
            <div class="mlvh-calendar-days">
                ${leadingCells.join('')}
                ${dayCells.join('')}
            </div>
        </div>
    `;

    const simpleHTML = `
        <div class="mlvh-calendar-simple">
            <span class="mlvh-calendar-simple-month">${today.toLocaleDateString('en-US', { month: 'long' })}</span>
            <span class="mlvh-calendar-simple-day">${pad(today.getDate())}</span>
        </div>
    `;

    return `
    <div class="mlvh-calendar" data-calendar-view="simple">
        <button type="button" class="mlvh-calendar-toggle" aria-label="Toggle calendar view"></button>
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