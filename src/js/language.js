
import Data from './data.js';
import { app_root } from './navigation.js';

export const languages = ['bs', 'en'];
let current = languages[0];

// const fields = document.querySelectorAll('[dict-text]');

export const set_language = language => {
    console.log(`Switch language from ${current} to ${language}`);

    if(!language || language === current) return;

    caches
        .open('fsm-simulator-cache')
        .then(cache => cache.delete(`${app_root}/localization/${current}.json`))
        .then(() => {
            Data.set('language', language);
            current = language;
            return fetch(`${app_root}/localization/${current}.json`)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(console.log);

}

export const load_language = () => {
    const language = Data.get('language') || navigator.languages.find(prefered => languages.includes(prefered));
    set_language(language);
}

