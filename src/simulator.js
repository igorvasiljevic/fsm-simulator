let fsm_canvas;

window.addEventListener('load', () => {

    let download = document.getElementById("download");
    let toggle_btn = document.getElementsByClassName("toggle_options_menu")[0];
    let options_menu = document.getElementsByClassName("options_menu")[0];
    let load_menu = document.getElementsByClassName("load_menu")[0];
    let fsm_frame = document.getElementsByClassName("fsm_frame")[0];


    fsm_canvas = new FSMCanvas(fsm_frame);
    fsm_canvas.setString(Data.get("string"));
    try {
        setFSM(new FSM(JSON.parse(Data.get("fsm"))));
    } catch(err) {
        setFSM(new FSM());
    }
    

    toggle_btn.onmousedown = () => {
        if(options_menu.classList.contains("menu_show")) {
            options_menu.parentElement.onmousedown();
        } else {
            toggle_btn.classList.add("disabled");
            options_menu.parentElement.classList.remove("disabled");
            setTimeout(() => { options_menu.classList.add("menu_show") }, 10);
        }

    }
    options_menu.parentElement.onmousedown = () => {
        options_menu.classList.remove("menu_show");
        load_menu.classList.remove("menu_show");
        setTimeout(() => {
            options_menu.parentElement.classList.add("disabled");
            toggle_btn.classList.remove("disabled");
        }, 120);
    }

    load_menu.innerHTML = "";
    for(let fsm_name in TutorialFSMS) {
        let li = document.createElement("li");
        li.innerText = fsm_name;
        li.onmousedown = e => {
            e.stopPropagation();
            setFSM(new FSM(JSON.parse(JSON.stringify(TutorialFSMS[fsm_name]))));
        }
        load_menu.appendChild(li);
    }
    document.getElementById("examples").onmousedown = e => {
        e.stopPropagation();
        load_menu.classList.add("menu_show");
    }
    document.getElementById("new").onmousedown = e => {
        e.stopPropagation();
        options_menu.parentElement.onmousedown();
        setFSM(new FSM());
    }
    document.getElementById("load").onmousedown = e => {
        e.stopPropagation();
        try {
            setFSM(new FSM(JSON.parse(Data.get("fsm"))));
            fsm_canvas.setString(Data.get("string"));
        } catch(err) { console.log(err); }
    }
    document.getElementById("upload").parentElement.onmousedown = e => {
        e.stopPropagation();
    }
    document.getElementById("upload").onchange = e => {
        e.stopPropagation();
        options_menu.parentElement.onmousedown();

        if(e.target.files && e.target.files[0]) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                setFSM(new FSM(JSON.parse(reader.result)));
                e.target.value = null;
            };
            reader.readAsText(file, 'utf-8');
        }
    }
    document.getElementById("save").onmousedown = e => {
        e.stopPropagation();

        Data.set("fsm", JSON.stringify(fsm_canvas.fsm));
        Data.set("string", fsm_canvas.fsm_string.value);
    }


    download.download = "fsm.fsm"; // TODO: take name from tab
    download.href = window.URL.createObjectURL(new Blob());
    download.onmousedown = e => {
        e.stopPropagation();

        let fsm_data = new Blob([JSON.stringify(fsm_canvas.fsm)], { type:'text/plain' });        
        download.href = window.URL.createObjectURL(fsm_data);
        window.URL.revokeObjectURL(fsm_data);
    }

    function setFSM(fsm) {
        fsm_canvas.setFSM(fsm);
        fsm_canvas.draw();
    }
});