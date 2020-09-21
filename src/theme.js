

document.addEventListener("DOMContentLoaded", () => { 

    let root = document.documentElement;
    let theme =  document.getElementById("theme");

    if(Data.get("theme"))
        root.classList.add(Data.get("theme"));

    if(theme) {
        theme.onmousedown = () => {
            theme.blur();
                
            if(root.classList.contains("light")) {
                root.classList.remove("light");
                Data.remove("theme");
            } else {
                Data.set("theme", "light");
                root.classList.add("light");
            }
        }
    }

});