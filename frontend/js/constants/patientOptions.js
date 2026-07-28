// --- Option lists for <select> ---

export const LOCATIONS = [
    { value: 'EA', label: 'Earth (EA)' },
    { value: 'PL', label: 'Pluto (PL)' },
    { value: 'ET', label: 'Ether (ET)' },
    { value: 'NW', label: 'Nowhere (NW)' },
    { value: 'XX', label: 'Unknown (XX)' },
];

export const SPECIES = [
    { value: 'human', label: 'Human' },
    { value: 'cat', label: 'Cat' },
    { value: 'bunny', label: 'Bunny' },
    { value: 'rat', label: 'Rat' },
    { value: 'monkey', label: 'Monkey' },
    { value: 'unknown', label: 'Unknown' },
];

export const SEXES = [
    { value: 'unknown', label: 'Unknown' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

export const ID_NUMBER_PATTERN = '[a-zA-Z0-9]{1,5}';
export const ID_NUMBER_MAXLENGTH = 5;

export const renderOptions = (options) =>
    options.map(({ value, label }) => `<option value="${value}">${label}</option>`).join('');

export const PRONOUNS = [
    { value: 'she/her', label: 'she/her' },
    { value: 'he/him', label: 'he/him' },
    { value: 'they/them', label: 'they/them' },
];

export const CONSULTATION_TYPES = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'preventive', label: 'Preventive' },
    { value: 'urgent', label: 'Urgent' },
];

// ----- Icon sets -----
export const SPECIES_ICONS = {
    human: 'assets/icons/species/human.svg',
    cat: 'assets/icons/species/cat.svg',
    bunny: 'assets/icons/species/bunny.svg',
    rat: 'assets/icons/species/rat.svg',
    monkey: 'assets/icons/species/monkey.svg',
    unknown: 'assets/icons/species/unknown.svg',
};

export const SEX_ICONS = {
    male: 'assets/icons/sex/male.svg',
    female: 'assets/icons/sex/female.svg',
    unknown: 'assets/icons/sex/unknown.svg',
};

export const CALENDAR_ICON = 'assets/icons/misc/calendar.svg';
export const PENCIL_ICON = 'assets/icons/misc/pencil.svg';

export const renderIconButtons = (options, iconsMap, groupName) =>
    options.map(({ value, label }) => `
        <button type="button" class="mlvh-icon-btn" data-group="${groupName}" data-value="${value}" title="${label}">
            <img src="${iconsMap[value]}" alt="${label}">
        </button>
    `).join('');