import Data from './data.js';

export const loadTheme = () => {
    const saved = Data.get("theme");
    if((saved === 'light') || (saved === undefined && window.matchMedia('(prefers-color-scheme: light)')?.matches))
        switchTheme();
}

export const switchTheme = () => {
    Data.set('theme', document.documentElement.classList.toggle('light') ? 'light' : 'dark');
}