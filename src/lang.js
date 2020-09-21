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

    
    for(let element of document.getElementsByClassName("lang")) {
        if(dictionary[element.id] && dictionary[element.id][language])
            element.innerText = dictionary[element.id][language];
    }
    
}

const dictionary = {
    "txt_finite_state_machines": {
        "en": "Finite-State Machines",
        "bs": "Konačni Automati"
    },
    "txt_author": {
        "en": "by Igor Vasiljević",
        "bs": "Igor Vasiljević"
    },
    "txt_previous_page": {
        "en": "Previous",
        "bs": "Nazad"
    },
    "txt_next_page": {
        "en": "Next",
        "bs": "Dalje"
    },
    "txt_gettin_started": {
        "en": "Getting started",
        "bs": "Uvod"
    },
    "txt_dfsm": {
        "en": "Deterministic finite-state machines",
        "bs": "Deterministički konačni automati"
    },
    "txt_definition" : {
        "en" : "Definition",
        "bs" : "Definicija"
    },
    "txt_initial" : {
        "en" : "Initial state",
        "bs" : "Početno stanje"
    },
    "txt_final" : {
        "en" : "Final state",
        "bs" : "Prihvatljivo stanje"
    },
    "txt_transition": {
        "en" : "Transitions",
        "bs" : "Prijelazi"
    },
    "txt_nfsm": {
        "en" : "Nondeterministic finite-state machines",
        "bs" : "Nedeterministički konačni automati"
    },
    "txt_enfsm": {
        "en" : "Nondeterministic finite-state machines with ε-transitions",
        "bs" : "Nedeterministički konačni automati s ε-prijelazima"
    }
}