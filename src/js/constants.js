
export const local = Boolean(
    window.location.hostname.startsWith('127.') ||
    window.location.hostname.startsWith('192.') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '' || // opened as file (file:///)
    window.location.hostname === '[::1]' // [::1] is the IPv6 localhost address.
);

export const home_folder = local ? '' : '/fsm-simulator';
export const service_worker_path = `${home_folder}/sw.js`;
export const epsilon = '$';

export const pages = [
    '/',
    '/lessons/1.html',
    '/lessons/2.html',
    '/lessons/3.html',
    '/lessons/4.html',
    '/simulator.html'
];