const default_language = "en";
let language;

document.addEventListener("DOMContentLoaded", () => {
    let new_language = Data.get("lang")
                    || window.navigator.userLanguage
                    || window.navigator.language
                    || default_language;
    new_language = new_language.split("-")[0];

    if(new_language != default_language)
        setLanguage(new_language);
});

function setLanguage(new_language) {
    if(new_language === language)
        return;
    
    language = new_language;
    language == default_language ?
        Data.remove("lang") :
        Data.set("lang", language);

    for(let element of document.getElementsByClassName("lang"))
        element.innerText = dictionary[element.id][language];
    
}

const dictionary = {
    "finite_state_machines": {
        "en": "Finite State Machines",
        "bs": "Konačni Automati"
    },
    "author": {
        "en": "by Igor Vasiljević",
        "bs": "Igor Vasiljević"
    },
    "previous_page": {
        "en": "Previous",
        "bs": "Nazad"
    },
    "next_page": {
        "en": "Next",
        "bs": "Dalje"
    }
}