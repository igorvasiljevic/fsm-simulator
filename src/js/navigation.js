
export const local = Boolean(
    window.location.hostname.startsWith('127.') ||
    window.location.hostname.startsWith('192.') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '' || // opened as file (file:///)
    window.location.hostname === '[::1]' // [::1] is the IPv6 localhost address.
);

export const home_folder = local ? '' : '/fsm-simulator';

export const pages = [
    '/',
    '/lessons/1.html',
    '/lessons/2.html',
    '/lessons/3.html',
    '/lessons/4.html'
];

const Navigate = (() => {
    
    const current_page_index = () =>
        pages.indexOf(
            window.location.pathname
                .replace(home_folder, '')
                .replace('index.html', '')
        )
    
    const get_previous_page = () => {
        const index = current_page_index();
        if(index != 0)
            return home_folder + pages[index - 1];
    }

    const get_next_page = () => {
        const index = current_page_index();
        if(index != pages.length - 1)
            return home_folder + pages[index + 1];
    }

    return {
        get_previous_page,
        get_next_page,
        home     : () => { window.location.href = home_folder + '/' },
        previous : () => { window.location.href = get_previous_page() },
        next     : () => { window.location.href = get_next_page() }
    }
})();

export default Navigate;