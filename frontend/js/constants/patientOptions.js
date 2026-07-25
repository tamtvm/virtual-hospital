// --- Option lists for <select> ---

export const LOCATIONS = [
    { value: 'EA', label: 'Earth (EA)' },
    { value: 'PL', label: 'Pluto (PL)' },
    { value: 'ET', label: 'Ether (ET)' },
    { value: 'NW', label: 'Nowhere (NW)' },
];

export const SPECIES = [
    { value: 'human', label: 'Human' },
    { value: 'cat', label: 'Cat' },
    { value: 'bunny', label: 'Bunny' },
    { value: 'rat', label: 'Rat' },
    { value: 'monkey', label: 'Monkey' },
    { value: 'other', label: 'Other' },
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