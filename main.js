
const mouseButtons = { LEFT_MOUSE: 0, MIDDLE_MOUSE: 1, RIGHT_MOUSE: 2 }

const stateRadius = 22;
const stateEdgePadding = { top:45, bottom:60, left:20, right:20, between:10 };

var tabs, tab;

var canvas, context;
var fsms = [];

const canvasSizeMultiplier = 3;
var canvasOffsetX, canvasOffsetY;

var messages;

document.addEventListener("DOMContentLoaded", function() {

    if (typeof(Storage) !== "undefined" && "fsms" in localStorage) {
        var tmpFSMS = JSON.parse(localStorage.getItem("fsms"));
        tmpFSMS.forEach(fsm => {
            fsms.push(new FSM(fsm));
        });
        
        if(fsms.length === 0) {
            fsms.push(new fsms());
        }
    }

    messages = document.getElementById("messages");
    
    tabs = document.getElementById("tabs");

    tab = tabs.children[0].cloneNode(true);

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    canvas.width = window.innerWidth*canvasSizeMultiplier;
    canvas.height = window.innerHeight*canvasSizeMultiplier;
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + "px";
    canvas.style.top = ((window.innerHeight - canvas.height) / 2) + "px";
    

    window.addEventListener("resize", canvasResize);
    window.addEventListener("scroll", drawFSM);
    window.addEventListener("beforeunload", pageClosing);

    tabs.addEventListener("wheel", tabsScroll);
    tabs.addEventListener("touchstart", tabsTouchStart);
    tabs.addEventListener("touchmove", tabsTouchMove);
    tabs.addEventListener("dragover", allowDrop);
    
    
    canvas.addEventListener("mousedown", canvasMouseDown);
    // canvas.addEventListener("mouseup", canvasMouseUp);
    // canvas.addEventListener("contextmenu", canvasContextMenu);
    //canvas.addEventListener("wheel", canvasScroll);
    canvas.addEventListener("touchstart", canvasDrag);
    
    dragElement(canvas);
    canvasResize();

    if(fsms[0].name)
        tabs.children[0].children[0].innerText = fsms[0].name;
    for(let i = 1; i < fsms.length; i++) {
        createTab(fsms[i].name);
    }

    drawFSM();
});

// function ondragleave() {
//     console.log("ondragleave");
// }

// function canvasContextMenu(e) {
//     e.preventDefault();
//     console.log("canvas context menu!")
// }

function getTabIndex(tab) {
    return Array.prototype.indexOf.call(tabs.children, tab);
}

function getCurrentTabIndex() {
    let currentTab = tabs.getElementsByClassName("selected")[0];
    return getTabIndex(currentTab);
}

function canvasMouseDown(e) {
    if(e.button == mouseButtons.LEFT_MOUSE) {
        let x = e.clientX;
        let y = e.clientY;

        if(x > stateRadius + stateEdgePadding.left &&
           x < window.innerWidth - stateRadius - stateEdgePadding.right &&
           y > stateRadius + stateEdgePadding.top &&
           y < window.innerHeight - stateRadius - stateEdgePadding.bottom) {
            // check if a previous state is held down
            
            x -= canvasOffsetX;
            y -= canvasOffsetY
            
            const states = fsms[getCurrentTabIndex()].states;
            for(var i = 0; i < states.length; i++) {
                let a = x - states[i].x;
                let b = y - states[i].y;
                let dist = Math.sqrt(a*a + b*b);
                
                if(dist < stateRadius + stateEdgePadding.between) break;
                if(dist < stateRadius*2 + stateEdgePadding.between) return;
            }

            if(i < states.length) {
                dragState(states[i]);
            } else {
                addState(new State(x,y));
            }

        }
    }
}

// function canvasMouseUp(e) {
//     if(e.button == mouseButtons.LEFT_MOUSE) {
//     }
// }

// function canvasScroll(e) {
//     if(e.deltaY > 0) // Zoom out
//         context.scale(0.9,0.9);
//     else if(e.deltaY < 0) // Zoom in
//         context.scale(1.1,1.1);
// }

function addState(state) {
    fsms[getCurrentTabIndex()].addState(state);
    drawFSM();
}

function dragState(state) {
    messages.innerText = state.id + " pressed";
    let startX, startY;
    canvas.addEventListener("mouseup", stopDrag);
    canvas.addEventListener("mousemove", startDrag);
    
    
    function startDrag(e) {
        e.preventDefault();
        
        if(startX == null) startX = e.clientX;
        if(startY == null) startY = e.clientY;
        
        state.x += e.clientX - startX;
        state.y += e.clientY - startY;

        if(state.x < stateRadius + stateEdgePadding.left)
            state.x = stateRadius + stateEdgePadding.left;
        else if(state.x > canvas.width - stateRadius - stateEdgePadding.right)
            state.x = canvas.width - stateRadius - stateEdgePadding.right;
        if(state.y < stateRadius + stateEdgePadding.top)
            state.y = stateRadius + stateEdgePadding.top;
        else if(state.y > canvas.height - stateRadius - stateEdgePadding.bottom)
            state.y = canvas.height - stateRadius - stateEdgePadding.bottom;

        startX = e.clientX;
        startY = e.clientY;

        drawFSM();
    }
    
    function stopDrag(e) {
        canvas.removeEventListener("mousemove", startDrag);
        canvas.removeEventListener("mouseup", stopDrag);
    }
}

function drawFSM() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(fsms[getCurrentTabIndex()].states.length === 0)
        return;
    
    context.strokeStyle = "rgb(15,15,15)";
    context.lineWidth = 3;
    context.font = "bold 22px Open Sans";
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    fsms[getCurrentTabIndex()].states.forEach(state => {
        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(state.x, state.y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(state.id, state.x, state.y + 2);
    });
}

function pageClosing() {
    if (typeof(Storage) !== "undefined")
        localStorage.setItem("fsms", JSON.stringify(fsms));
    else alert("Local storage not found. All unsaved data will be lost!");
}

function clearData() {
    fsms = [new FSM()];

    while(tabs.firstChild)
        tabs.firstChild.remove();
    tabs.appendChild(tab.cloneNode(true));
    switchTab(tabs.children[0]);

    localStorage.clear();
    // canvas.classList.add("smoothMove");
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + "px";
    canvas.style.top = ((window.innerJHeight - canvas.height) / 2) + "px";

    // canvas.classList.remove("smoothMove");
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCurrentTab() {
    fsms[getCurrentTabIndex()].states = [];
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + "px";
    canvas.style.top = ((window.innerHeight - canvas.height) / 2) + "px";
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function createTab(name) {
    if(!name)
        name = "Tab " + (tabs.childElementCount + 1);
    
    let newTab = tab.cloneNode(true);
    newTab.children[0].innerText = name;
    newTab.title = name;
    newTab.classList.remove("selected");
    tabs.appendChild(newTab);
}

function addTab() {
    createTab();
    fsms.push(new FSM());
    switchTab(tabs.children[tabs.children.length-1]);
    tabs.scrollLeft += 200;
}

function switchTab(tab) {
    if(!tab.classList.contains("selected")) {
        let currentTab = getCurrentTabIndex();
        renameTabEnd(tabs.children[currentTab])
        tabs.children[currentTab].classList.remove("selected");
        tabs.children[currentTab].viewX = canvas.style.left;
        tabs.children[currentTab].viewY = canvas.style.top;
        tab.classList.add("selected");

        // center tab on saved position or center of canvas
        canvas.style.left = tab.viewX || ((window.innerWidth - canvas.width) / 2) + "px";
        canvas.style.top = tab.viewY || ((window.innerHeight - canvas.height) / 2) + "px";

        drawFSM();
    }
}

function tabsScroll(e) {
    if(e.deltaY > 0) // Zoom out
        tabs.scrollLeft += 50;
    else if(e.deltaY < 0) // Zoom in
        tabs.scrollLeft -= 50;
}

var ts;
function tabsTouchStart(e) {
    ts = e.touches[0].clientX;
}
function tabsTouchMove(e) {
    var te = e.changedTouches[0].clientX;
    tabs.scrollLeft += ts-te
    ts = te;
}
function allowDrop(e) {
    e.preventDefault();
}

function canvasResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    canvasOffsetX = Number.parseInt(canvas.style.left.replace("px", ""));
    canvasOffsetY = Number.parseInt(canvas.style.top.replace("px", ""));

    if(canvasOffsetX > 0)
        canvasOffsetX = 0;
    else if (canvasOffsetX < window.innerWidth - canvas.width)
        canvasOffsetX = window.innerWidth - canvas.width;
    if(canvasOffsetY > 0)
        canvasOffsetY = 0;
    else if (canvasOffsetY < window.innerHeight - canvas.height)
        canvasOffsetY = window.innerHeight - canvas.height;

    canvas.style.left = canvasOffsetX + "px";
    canvas.style.top = canvasOffsetY + "px";

    tabs.parentElement.style.maxWidth = (window.innerWidth).toString() + "px";
    tabs.style.maxWidth = (window.innerWidth - 100).toString() + "px";
}

// var csX, csY;
function canvasDrag(e) {
    let csX = e.touches[0].clientX;
    let csY = e.touches[0].clientY;

    canvas.addEventListener("touchend", canvasTouchEnd);
    canvas.addEventListener("touchmove", canvasTouchMove);

    function canvasTouchMove(e) {
        let ceX = e.changedTouches[0].clientX;
        let ceY = e.changedTouches[0].clientY;

        let tmpcanvasOffsetX = Number.parseInt(canvas.style.left.replace("px", ""));
        let tmpcanvasOffsetY = Number.parseInt(canvas.style.top.replace("px", ""));
        tmpcanvasOffsetX += ceX-csX;
        tmpcanvasOffsetY += ceY-csY;
        canvas.style.left = tmpcanvasOffsetX + "px";
        canvas.style.top = tmpcanvasOffsetY + "px";
        
        csX = ceX;
        csY = ceY;

        canvasResize();
    }
    function canvasTouchEnd(e) {
        canvas.removeEventListener("touchmove", canvasTouchMove);
        canvas.removeEventListener("touchend", canvasTouchEnd);
    }
}

const maxNameLength = 20;
var currentName;
function renameTab(tab) {
    let tabText = tab.children[0];
    currentName = tabText.innerText;
    tabText.contentEditable = true;
    // document.getElementsByClassName("selected")[0].focus();
}
function renameTabEnd(tab) {
    let tabText = tab.children[0];
    tabText.contentEditable = false;

    if(tabText.innerText != currentName) {
        let newName = tabText.innerText.trim().substring(0, maxNameLength) || currentName;
        tabText.innerText = newName;
        tab.title = newName;
        fsms[getTabIndex(tab)].name = newName;
    }
}
const ignoredKeys = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];
function renameTabKeyPress(e) {
    if(ignoredKeys.includes(e.key)) return;
    
    if(e.srcElement.innerText.length >= maxNameLength && e.key != "Backspace" && window.getSelection().toString().length === 0)
        e.preventDefault();
    if(e.key === "Enter") {
        e.preventDefault();
        renameTabEnd(e.srcElement.parentElement);

        
    }
    if(e.key === "Escape") {
        e.preventDefault();
        e.srcElement.innerText = currentName;
        renameTabEnd(e.srcElement.parentElement);
    }
}
function moveTab(indexFrom, indexTo) {
    tabs.children[indexTo].after(tabs.children[indexFrom]);
}

// canvas middle mouse drag
function dragElement(el) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if(e.button == mouseButtons.MIDDLE_MOUSE) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        canvasResize();
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}