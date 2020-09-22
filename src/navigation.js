const pages = [
    "/",
    "/lessons/1.html",
    "/lessons/2.html",
    "/lessons/3.html",
    "/lessons/4.html",
    "/simulator.html"
];

function previousPage() {
    let current_page = window.location.pathname.replace(home_folder, "");
    if(current_page === "/index.html") current_page = "/";
    let index = pages.indexOf(current_page);

    if(index != 0)
        window.location.href = `${home_folder}${pages[--index]}`;
}

function nextPage() {
    let current_page = window.location.pathname.replace(home_folder, "");
    if(current_page === "/index.html") current_page = "/";
    let index = pages.indexOf(current_page);

    if(index != pages.length - 1)
        window.location.href = `${home_folder}${pages[++index]}`;
}