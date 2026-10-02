// --- Modal focus ---
const openers = new WeakMap();

const focusTargetFor = (modal) => {
    const opener = openers.get(modal);
    return opener?.isConnected && opener !== document.body ? opener : document.getElementById('main-content');
};

export const initModalFocus = () => {
    document.addEventListener('show.bs.modal', (event) => {
        openers.set(event.target, document.activeElement);
    });

    document.addEventListener('hide.bs.modal', (event) => {
        if (event.defaultPrevented) return;
        event.target.inert = true;
        focusTargetFor(event.target)?.focus();
    });

    document.addEventListener('hidden.bs.modal', (event) => {
        event.target.inert = false;
        if (document.activeElement === document.body) focusTargetFor(event.target)?.focus();
    });
};