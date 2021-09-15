import Data from './data.js';

export const load_theme = () => {
    const saved = Data.get('theme');
    if((saved === 'light') || (saved === undefined && window.matchMedia('(prefers-color-scheme: light)')?.matches))
        switch_theme();
}

export const switch_theme = () => {
    Data.set('theme', document.documentElement.classList.toggle('light') ? 'light' : 'dark');
}