


// ---------------------------//
// SW SETUP                   //
// ---------------------------//
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('./sw.js');

//         let refreshing;
//         navigator.serviceWorker.addEventListener('controllerchange', () => {
//             if(refreshing) return;
//             refreshing = true;
//             window.location.reload();
//         });
//     });
// }


function previousPage() {
    console.log("Previous page");
}

function nextPage() {
    window.location.href = "simulator.html";
}


window.addEventListener('load', () => {

    for(let fsm_frame of document.getElementsByClassName("fsm_frame")) {
        let fsm_canvas = new FSMCanvas(fsm_frame);
        let fsm = new FSM(JSON.parse(JSON.stringify(TutorialFSMS[fsm_frame.dataset.fsm])));

        fsm_canvas.setString(fsm_frame.dataset.string);
        fsm_canvas.setFSM(fsm);
        fsm_canvas.draw();
    }

});