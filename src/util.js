const Data = (() => {
    if (typeof(Storage) == "undefined")
    return {
        get(item) {},
        set(item, data) {},
        remove(item) {}
    }

    return {
        get(item) { return localStorage.getItem(item) },
        set(item, data) { localStorage.setItem(item, data) },
        remove(item) { localStorage.removeItem(item) }
    }
})();

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
}

function stringToHTMLElement(string) {
    let element = document.createElement("div");
    element.innerHTML = string.trim();
    return element.firstChild;
}