import { home_folder, pages } from './constants.js';

const Navigate = (() => {
    
    const currentPageIndex = () => {
        let current_page = window.location.pathname.replace(home_folder, "");
        if(current_page === "/index.html") current_page = "/";
        return pages.indexOf(current_page);
    };
    
    const getPreviousPage = () => {
        let index = currentPageIndex();
        if(index != 0)
            return `${home_folder}${pages[--index]}`;
    };

    const getNextPage = () => {
        let index = currentPageIndex();
        if(index != pages.length - 1)
            return `${home_folder}${pages[++index]}`;
    };

    return {
        getPreviousPage,
        getNextPage,
        previous: () => { window.location.href = getPreviousPage() },
        next: () => { window.location.href = getNextPage() }
    }
})();

export default Navigate;