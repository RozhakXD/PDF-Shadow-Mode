const THEMES_CONFIG = {
    'Classic Dark': {
        filter: 'invert(1) hue-rotate(180deg)',
        background: '#000000'
    },
    'One Dark (Contrast)': {
        filter: 'invert(1) hue-rotate(180deg) contrast(1.1) brightness(0.95)',
        background: '#1e2127'
    },
    'Material Dark (Vibrant)': {
        filter: 'invert(1) hue-rotate(180deg) brightness(0.9) saturate(1.2)',
        background: '#212121'
    },
    'Gruvbox Dark': {
        filter: 'invert(1) hue-rotate(180deg) sepia(0.3) contrast(0.85) brightness(0.95)',
        background: '#1d2021'
    },
    'Dracula': {
        filter: 'invert(1) hue-rotate(180deg) brightness(0.95) contrast(1.1) saturate(1.1)',
        background: '#282a36'
    },
    'Monokai': {
        filter: 'invert(1) hue-rotate(180deg) contrast(1.05) brightness(0.95) sepia(0.1)',
        background: '#2d2a2e'
    },
    'Nord': {
        filter: 'invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.95) saturate(0.9)',
        background: '#2e3440'
    },
    'High Contrast': {
        filter: 'invert(1) hue-rotate(180deg) contrast(1.25) brightness(0.9)',
        background: '#000000'
    },
    'Grayscale': {
        filter: 'invert(1) hue-rotate(180deg) grayscale(1)',
        background: '#111111'
    }
};

const getThemeFilter = (themeName) => {
    return THEMES_CONFIG[themeName]?.filter || THEMES_CONFIG['Classic Dark'].filter;
}

const getThemeBackground = (themeName) => {
    return THEMES_CONFIG[themeName]?.background || THEMES_CONFIG['Classic Dark'].background;
}

const getAllThemeNames = () => {
    return Object.keys(THEMES_CONFIG);
}

if (typeof window !== 'undefined') {
    window.THEMES_CONFIG = THEMES_CONFIG;
    window.getThemeFilter = getThemeFilter;
    window.getThemeBackground = getThemeBackground;
    window.getAllThemeNames = getAllThemeNames;
}