window.addEventListener('load', () => {
    for(let fsm_frame of document.getElementsByClassName("fsm_frame")) {
        let fsm_canvas = new FSMCanvas(fsm_frame);
        let fsm = new FSM(JSON.parse(JSON.stringify(TutorialFSMS[fsm_frame.dataset.fsm])));

        fsm_canvas.setString(fsm_frame.dataset.string);
        fsm_canvas.setFSM(fsm);
        fsm_canvas.draw();
    }
});