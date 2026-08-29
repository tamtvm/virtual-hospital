// --- MODULE: home on-duty ---

import { PROFESSIONALS } from '../../constants/patientOptions.js';
import { AVATAR_BASE_PATH, DEFAULT_AVATAR } from '../../config.js';
import { setAvatarWithFallback } from '../../utils/dom.js';

const DUTY_AVATARS = {
    dr_milo: DEFAULT_AVATAR,
    rn_tam: `${AVATAR_BASE_PATH}/human_female.png`,
};

export const getOnDutyHTML = () => {
    const slides = PROFESSIONALS.map(({ value, label }, index) => `
        <div class="mlvh-duty-slide${index === 0 ? ' active' : ''}" data-duty-slide="${index}">
            <div class="mlvh-duty-photo">
                <img class="mlvh-duty-avatar" data-avatar-src="${DUTY_AVATARS[value] ?? DEFAULT_AVATAR}" alt="${label}">
            </div>
            <span class="mlvh-duty-name">${label}</span>
        </div>
    `).join('');

    return `
    <div class="mlvh-duty" data-duty-index="0">
        <div class="mlvh-duty-slides">
            ${slides}
        </div>
        <button type="button" class="mlvh-duty-next" aria-label="Next professional">
            <img src="/assets/icons/misc/back.svg" alt="">
        </button>
    </div>
    `;
};

export const initOnDuty = () => {
    const duty = document.querySelector('.mlvh-duty');
    if (!duty) return;

    duty.querySelectorAll('.mlvh-duty-avatar').forEach((img) => {
        setAvatarWithFallback(img, img.dataset.avatarSrc, DEFAULT_AVATAR);
    });

    const slides = duty.querySelectorAll('.mlvh-duty-slide');
    const next = duty.querySelector('.mlvh-duty-next');
    if (!next || slides.length === 0) return;

    next.addEventListener('click', () => {
        const updated = (Number(duty.dataset.dutyIndex) + 1) % slides.length;
        duty.dataset.dutyIndex = updated;
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === updated);
        });
    });
};