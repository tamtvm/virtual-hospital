// --- MODULE: home scene ---

const SCENE_BASE_PATH = '/assets/illustrations/scene';
const BOARD_MODAL_ID = 'boardModal';

// --- Item behaviors ---
const SCENE_BEHAVIORS = {
    phone: (layer) => {
        if (layer.classList.contains('is-ringing')) return;
        layer.classList.add('is-ringing');
        layer.addEventListener('animationend', () => layer.classList.remove('is-ringing'), { once: true });
    },
    board: () => {
        const modal = document.getElementById(BOARD_MODAL_ID);
        if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();
    },
};

export const getSceneHTML = () => `
    <div class="mlvh-home-scene">
        <img class="mlvh-scene-layer" src="${SCENE_BASE_PATH}/room.png" alt="">
    </div>
`;

// --- Layer n zone factories ---
const createLayer = (key, { left, top, width, height }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mlvh-scene-item';
    wrapper.id = `item-${key}`;
    wrapper.style.setProperty('--mlvh-zone-left', `${left}%`);
    wrapper.style.setProperty('--mlvh-zone-top', `${top}%`);
    wrapper.style.setProperty('--mlvh-zone-width', `${width}%`);
    wrapper.style.setProperty('--mlvh-zone-height', `${height}%`);

    const img = document.createElement('img');
    img.className = 'mlvh-scene-layer';
    img.src = `${SCENE_BASE_PATH}/${key}.png`;
    img.alt = '';

    wrapper.append(img);
    return wrapper;
};

const createZone = (key, { left, top, width, height }) => {
    const zone = document.createElement('button');
    zone.type = 'button';
    zone.className = 'mlvh-scene-zone';
    zone.dataset.item = key;
    zone.setAttribute('aria-label', key);
    Object.assign(zone.style, {
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
    });
    return zone;
};

// --- Init ---
export const initScene = async () => {
    const scene = document.querySelector('.mlvh-home-scene');
    if (!scene) return;

    let layout;
    try {
        const response = await fetch(`${SCENE_BASE_PATH}/layout.json`);
        if (!response.ok) throw new Error(`layout.json ${response.status}`);
        layout = await response.json();
    } catch (error) {
        console.error('Scene layout unavailable:', error);
        return;
    }
    if (!document.body.contains(scene)) return;

    const entries = Object.entries(layout);
    const layers = new Map(entries.map(([key, bounds]) => [key, createLayer(key, bounds)]));
    scene.append(...layers.values(), ...entries.map(([key, bounds]) => createZone(key, bounds)));

    scene.addEventListener('click', (event) => {
        const zone = event.target.closest('.mlvh-scene-zone');
        if (!zone) return;
        SCENE_BEHAVIORS[zone.dataset.item]?.(layers.get(zone.dataset.item));
    });
};