
import Data from './data.js';
import { app_root } from './navigation.js';

export const languages = ['bs', 'en'];
const default_language = 'bs';
let current = default_language;

// const fields = document.querySelectorAll('[dict-text]');

export const set_language = language => {
    if(!language || language === current) return;

    caches.keys()
        .then(cache_names => caches.open(cache_names[0]))
        .then(cache => cache.delete(`${app_root}/localization/${current}.json`))
        .then(() => {
            Data.set('language', language);
            document.documentElement.lang = current = language;
            return fetch(`${app_root}/localization/${current}.json`);
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(console.log);
}

export const load_language = () => {
    const language = Data.get('language') || navigator.languages.find(prefered => languages.includes(prefered));
    set_language(language);
}

