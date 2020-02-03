import * as Constants from './src/constants.js'
import { registerServiceWorker } from './swsetup.js'
import './components/tabs.js'
import './components/canvas.js'
import FSMCanvas from './src/fsmcanvas.js'
import { FSM } from './src/fsm.js'


console.time('load_time');

const fsms = [];


// ---------------------------//
// CANVAS SETUP               //
// ---------------------------//
const canvas = document.getElementsByTagName('g-canvas')[0];
canvas.pixelRatio = Constants.PIXEL_RATIO;
const fsmcanvas = new FSMCanvas({
    canvas: canvas,
    stateRadius: Constants.STATE_RADIUS,
    stateEdgePadding: Constants.STATE_EDGE_PADDING,
    canvasOptimizationThreshold: Constants.CANVAS_OPTIMIZATION_THRESHOLD,
    mouseButtons: Constants.MOUSE_BUTTONS
});


// ---------------------------//
// TABS SETUP                 //
// ---------------------------//
const tabs = document.getElementsByTagName('g-tabs')[0];
(() => {
    tabs.defaultTabName = Constants.TAB_NAME;
    tabs.transitionEventName = Constants.TRANSITION_EVENT_NAME;
    tabs.maxTabNameLength = Constants.MAX_TAB_NAME_LENGTH;

    tabs.onAdd = tab => {
        fsms.push(new FSM(tab.name));
        tabs.selectedIndex = fsms.length-1;
    };
    tabs.onRemove = index => {
        fsms.splice(index, 1);
        if(!fsms.length) tabs.add();
    }
    tabs.onMove = (from, to) => fsms.splice(to, 0, fsms.splice(from, 1)[0]);
    tabs.onRename = tab => { fsms[tabs.selectedIndex].name = tab.name }

    document.ondragover = e => e.preventDefault();
    tabs.onDragStart = e => {
        if(Constants.MOBILE) {
            e.dataTransfer.setData('text/plain', 'text');
        } else {
            let fsm = fsms[tabs.selectedIndex];
            let url = URL.createObjectURL(new File([JSON.stringify(fsm)], 'fsm.json'));
            e.dataTransfer.setData('DownloadURL', 'text:' + fsm.name + '.json:' + url);
        }
        tabs._dragStart(e);
    };
    document.ondragenter = tabs._dragEnter;
    document.ondragleave = tabs._dragLeave;
    document.ondragend = () => tabs._dragEnd(tabs);
    document.ondrop = e => {
        e.preventDefault();
        e.stopPropagation();


        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            for(let i = 0; i < e.dataTransfer.files.length; i++) {
                let file = e.dataTransfer.files[i];

                let reader = new FileReader();
                reader.onload = function (event) {
                    let fsm = JSON.parse(event.target.result);
                    
                    if(fsm.hasOwnProperty('name') && fsm.hasOwnProperty('states')) {
                        fsms.push(new FSM(fsm));
                        tabs.create(fsm.name);
                    }
                }
                reader.readAsText(file, 'utf-8');
            }
        } else {
            tabs._drop(e, tabs);
        }
    }
})();


// ---------------------------//
// DATA LOAD/SAVE SETUP       //
// ---------------------------//
function loadData() {
    if(typeof(Storage) == 'undefined') {
        alert('Local storage not found. All unsaved data will be lost!');
        return;
    }

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('fsms', JSON.stringify(fsms));
    });

    
    if('fsms' in localStorage) {
        const storedFSMS = JSON.parse(localStorage.getItem('fsms'));

        // storedFSMS.push({"name":"Tab","states":[{"id":0,"transitions":{"0":["C"],"1":["A"],"2":["B"]},"x":1118,"y":861},{"id":1,"transitions":{"1":["C"],"2":["B"]},"x":1464,"y":747},{"id":2,"transitions":{},"x":1464,"y":984}],"current":[0],"final":[2]});
        
        storedFSMS.forEach(fsm => {

            // calculate bounding box of fsm
            let left = Number.MAX_SAFE_INTEGER, top = Number.MAX_SAFE_INTEGER;
            let right = 0, bottom = 0;
            fsm.states.forEach(state => {
                if(state.x < left) left = state.x;
                if(state.x > right) right = state.x;
                if(state.y < top) top = state.y;
                if(state.y > bottom) bottom = state.y;
            });
            //  move center of bounding box to center of canvas
            fsm.states.forEach(state => {
                state.x -= left;
                state.x += canvas.canvas.scrollWidth/2 - (right - left)/2;
                state.y -= top;
                state.y += canvas.canvas.scrollHeight/2 - (bottom - top)/2;
            });


            fsms.push(new FSM(fsm));
            tabs.create(fsm.name);
        });
    }
    if(fsms.length == 0) tabs.add();
}


// ---------------------------//
// SW SETUP                   //
// ---------------------------//
window.addEventListener('load', registerServiceWorker());

const messages = document.getElementById('messages');
const more = document.getElementById('more');
document.addEventListener('DOMContentLoaded', () => {
    more.onclick = clearData;
    document.getElementById('clearTab').onclick = step;

    resize();
    canvas.center();
    loadData();
    tabs.onSelectedChange = tab => fsmcanvas.fsm = fsms[tabs.index(tab)];
    tabs.selectedIndex = 0;

    messageSelect(0);
});

window.addEventListener('resize', resize);
function resize() {
    tabs.tabsRightOffset = more.clientWidth + Constants.TABS_RIGHT_OFFSET;
    if(canvas.canvas.width < window.innerWidth * Constants.CANVAS_MIN_SIZE_MULTIPLIER ||
       canvas.canvas.height < window.innerHeight * Constants.CANVAS_MIN_SIZE_MULTIPLIER) 
    {
        canvas.resize(window.innerWidth*Constants.CANVAS_SIZE_MULTIPLIER,
                      window.innerHeight*Constants.CANVAS_SIZE_MULTIPLIER);
        fsmcanvas.drawFSM();
    }
}

window.addEventListener('load', () => {
    // fsmcanvas.fsm = fsms[0];
    console.timeEnd('load_time');
});



function clearData() {
    fsms.splice(0, fsms.length);
    tabs.clear();
    tabs.add();
    canvas.center();
}

function clearTab() {
    fsms[tabs.selectedIndex].states = [];
    canvas.center();
    fsmcanvas.drawFSM();
}

let currentInputIndex = 0;
function step() {
    if(currentInputIndex >= messages.innerText.length) {
        fsmcanvas.FSM.current = [0];
        delete fsmcanvas._accepted;
        currentInputIndex = 0;
        messageSelect(0);
        fsmcanvas.drawFSM();
        return;
    }

    const input = messages.innerText[currentInputIndex];
    fsmcanvas.FSM.input(input);
    fsmcanvas.drawFSM();
    currentInputIndex++;

    if(currentInputIndex >= messages.innerText.length) {
        messageSelect(-1);
        fsmcanvas.accepted = fsmcanvas.FSM.valid();
        fsmcanvas.drawFSM();
        return;
    }

    messageSelect(currentInputIndex);
}

function test() {
    fsmcanvas.FSM.current = [0];
    delete fsmcanvas._accepted;
    fsmcanvas.accepted = fsmcanvas.FSM.test(messages.innerText);
    fsmcanvas.drawFSM();
}

function messageSelect(index) {
    if(index >= messages.innerText.length) return;
    if(index < 0) {
        messages.innerHTML = messages.innerText;
        return;
    }
    messages.innerHTML = messages.innerText.slice(0,index) +
                         '<span class="inputSelected">' + messages.innerText[index] + '</span>' +
                         messages.innerText.slice(index+1, messages.innerText.length);
}



window.g = {
    Constants,
    tabs,
    fsms,
    canvas,
    fsmcanvas,
    more,
    messages
}