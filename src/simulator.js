registerServiceWorker();


let fsm_canvas;

window.addEventListener('load', () => {

    let fsm_frame = document.getElementsByClassName("fsm_frame")[0];

    fsm_canvas = new FSMCanvas(fsm_frame);

    fsm_canvas.setString(Data.get("string"));
    let fsm;
    try {
        fsm = new FSM(JSON.parse(Data.get("fsm")));
    } catch(err) {
        fsm = new FSM();
    }
    fsm_canvas.setFSM(fsm);
    fsm_canvas.draw();
});

window.addEventListener('unload', () => {
    Data.set("fsm", JSON.stringify(fsm_canvas.fsm));
    Data.set("string", fsm_canvas.fsm_string.value);
});