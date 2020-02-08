import * as Constants from './src/constants.js'
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
    mouseButtons: Constants.MOUSE_BUTTONS,
    getInput: document.getElementById('getInput')
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
            let url = URL.createObjectURL(new File([fsm.toFile()], 'fsm.json'));
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
                reader.onload = e => {
                    let fsm = JSON.parse(e.target.result);
                    const name = file.name.replace('.json','');
                    if(name) fsm.name = name;
                    
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
        localStorage.setItem('fsms', JSON.stringify(fsms, (k,v) => {
            switch(k) {
                case 'current': case '_currentId': return undefined;
                default: return v
            }
        }));
    });

    try {
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
    } catch(err) {}
    if(fsms.length == 0) tabs.add();
}


// ---------------------------//
// SW SETUP                   //
// ---------------------------//
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if(refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    }
});


// ---------------------------//
// TOOLBAR SETUP              //
// ---------------------------//
document.getElementById('step').onclick = step;
document.getElementById('run').onclick = run;
const tools = document.getElementById('tools');
for(let i = 0; i < tools.children.length; i++)
    document.getElementById(tools.children[i].id).onclick = () => selectTool(i);


const inputString = document.getElementById('inputString');
const more = document.getElementById('more');
document.addEventListener('DOMContentLoaded', () => {
    more.onclick = clearData;

    resize();
    canvas.center();
    loadData();

    tabs.onSelectedChange = tab => { fsmcanvas.fsm = fsms[tabs.index(tab)] }
    tabs.selectedIndex = 0;
    tabs.onSelectedChange = tab => {
        fsmcanvas.fsm = fsms[tabs.index(tab)];
        reset();
    }
    if(!fsmcanvas.FSM) fsmcanvas.fsm = fsms[tabs.selectedIndex];
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
    console.timeEnd('load_time');
});

const keys = ["Delete", "Shift", "Control", "Alt"];
const keydown = Array(keys.length);
window.addEventListener('keydown', e => {
    const toolIndex = keys.indexOf(e.key);

    if(toolIndex < 0) return;

    e.preventDefault();
    e.stopPropagation();

    if(!keydown[toolIndex]) {
        keydown[toolIndex] = true;
        selectTool(toolIndex);
    }
});
window.addEventListener('keyup', e => {
    const toolIndex = keys.indexOf(e.key);

    if(toolIndex < 0) return;
    
    e.preventDefault();
    e.stopPropagation();

    deselectTool();
    keydown[toolIndex] = false;
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

function reset() {
    fsmcanvas.FSM.reset();
    fsmcanvas.FSM.current = [fsmcanvas.FSM.initial];
    delete fsmcanvas._accepted;
    currentInputIndex = 0;
    inputStringSelect(0);
    fsmcanvas.drawFSM();
}

let currentInputIndex = 0;
function step() {
    if(currentInputIndex >= inputString.innerText.length) {
        reset();
        return;
    }
    if(currentInputIndex == 0 &&
       JSON.stringify(fsmcanvas.FSM.current) != JSON.stringify([fsmcanvas.FSM.initial])){
        reset();
        return;
    }

    const input = inputString.innerText[currentInputIndex];
    fsmcanvas.FSM.input(input);
    fsmcanvas.drawFSM();
    currentInputIndex++;

    if(currentInputIndex >= inputString.innerText.length) {
        inputStringSelect(-1);
        fsmcanvas.accepted = fsmcanvas.FSM.valid();
        toast(fsmcanvas._accepted ? Constants.STRING_ACCEPTED : Constants.STRING_NOT_ACCEPTED);
        fsmcanvas.drawFSM();
        return;
    }

    inputStringSelect(currentInputIndex);
}

function run() {
    fsmcanvas.FSM.reset();
    delete fsmcanvas._accepted;
    fsmcanvas.accepted = fsmcanvas.FSM.test(inputString.innerText);
    toast(fsmcanvas._accepted ? Constants.STRING_ACCEPTED : Constants.STRING_NOT_ACCEPTED);
    fsmcanvas.drawFSM();
}

let selectedTool;
function selectTool(toolIndex) {
    let tool = tools.children[toolIndex];

    if(fsmcanvas.selected != null && tool) {
        switch(tool.id) {
            case 'delete_state':
                fsmcanvas._removeState(fsmcanvas.selected);
                fsmcanvas.selected = null;
                return;
            case 'set_final_state':
                fsmcanvas._setFinalState(fsmcanvas.selected);
                return;
            case 'set_initial_state':
                fsmcanvas._setInitialState(fsmcanvas.selected);
                return;
        }
    }

    if(selectedTool)
        selectedTool.classList.remove("toolSelected");
    if(selectedTool && selectedTool.id == tool.id)
        tool = null;
    selectedTool = tool;
    if(selectedTool)
        selectedTool.classList.add("toolSelected");
    fsmcanvas.tool = selectedTool ? selectedTool.id : null;
}

function deselectTool() {
    if(selectedTool) {
        selectedTool.classList.remove("toolSelected");
        selectedTool = null;
        fsmcanvas.tool = null;
    }
}

function inputStringSelect(index) {
    if(index >= inputString.innerText.length) return;
    if(index < 0) {
        inputString.innerHTML = inputString.innerText;
        return;
    }
    inputString.innerHTML = inputString.innerText.slice(0,index) +
                         '<span class="inputSelected">' + inputString.innerText[index] + '</span>' +
                         inputString.innerText.slice(index+1, inputString.innerText.length);
}



const _toast = document.getElementById('toast');
function toast(message) {
    _toast.innerText = message;
    _toast.classList.remove('hidden');

    setTimeout(() => { _toast.classList.add('hidden') }, 2000);
}


window.g = {
    Constants,
    tabs,
    fsms,
    canvas,
    fsmcanvas,
    more,
    inputString,
    toast
}