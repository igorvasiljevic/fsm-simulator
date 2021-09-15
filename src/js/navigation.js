import { home_folder, pages } from './constants.js';

const Navigate = (() => {
    
    const current_page_index = () =>
        pages.indexOf(
            window.location.pathname
                .replace(home_folder, '')
                .replace('index.html', '')
        );
    
    const get_previous_page = () => {
        let index = current_page_index();
        if(index != 0)
            return home_folder + pages[--index];
    };

    const get_next_page = () => {
        let index = current_page_index();
        if(index != pages.length - 1)
            return home_folder + pages[++index];
    };

    return {
        get_previous_page,
        get_next_page,
        previous: () => { window.location.href = get_previous_page() },
        next: () => { window.location.href = get_next_page() }
    }
})();

export default Navigate;