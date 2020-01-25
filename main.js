
const mouseButtons = { LEFT_MOUSE: 0, MIDDLE_MOUSE: 1, RIGHT_MOUSE: 2 }

const stateRadius = 22;
const stateEdgePadding = { top:45, bottom:60, left:20, right:20, between:10 };

var tabs, tab;

var canvas, context;
var fsms = [];

const canvasSizeMultiplier = 3;

// after what number of states will the drawing on state drag be optimized
const canvasOptimizationThreshold = { desktop:10, mobile:30 };

var messages;

document.addEventListener("DOMContentLoaded", function() {

    if (typeof(Storage) !== "undefined" && "fsms" in localStorage) {
        var tmpFSMS = JSON.parse(localStorage.getItem("fsms"));
        tmpFSMS.forEach(fsm => {
            fsms.push(new FSM(fsm));
        });
        
        if(fsms.length === 0) {
            fsms.push(new FSM("Tab 1"));
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
    

    window.addEventListener("resize", windowResize);
    window.addEventListener("scroll", drawFSM);
    window.addEventListener("beforeunload", pageClosing);

    tabs.addEventListener("wheel", tabsScroll);
    tabs.addEventListener("touchstart", tabsTouchStart);

    tabs.addEventListener("dragstart", tabDragStart);
    
    
    canvas.addEventListener("mousedown", canvasMouseDown);
    // canvas.addEventListener("contextmenu", canvasContextMenu);
    //canvas.addEventListener("wheel", canvasScroll);
    canvas.addEventListener("touchstart", canvasDrag);
    
    windowResize();

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

function tabDragStart(e) {
    let draggedElement = e.target;

    tabs.ondragover = e => { e.preventDefault(); };
    tabs.ondragenter = tabDragEnter;
    tabs.ondragleave = tabDragLeave;
    tabs.ondrop = onDrop;

    function tabDragEnter(e) {
        if(e.target.classList.contains("tab"))
            e.target.classList.add("dropZone");
        else if(e.target.localName == "h4")
            e.target.parentElement.classList.add("dropZone");
    }

    function tabDragLeave(e) {
        if(e.fromElement == null)
            e.toElement.classList.remove("dropZone");
        else if(e.fromElement.id == "canvas")
            e.target.classList.remove("dropZone");
        else if(e.fromElement.classList.contains("tab") && e.toElement.classList.contains("tab"))
            e.toElement.classList.remove("dropZone");
        
    }

    function onDrop(e) {
        for(let i = 0; i < tabs.children.length; i++)
            tabs.children[i].classList.remove("dropZone");

        if(e.target.classList.contains("tab")) {
            if(e.target.isSameNode(draggedElement) ||
               e.target.nextSibling.isSameNode(draggedElement)) {
                return;
            } else {
                moveTab(draggedElement, e.target);
            }
        } else if(e.target.localName = "h4") {
            if(e.target.parentElement.isSameNode(draggedElement) ||
               e.target.parentElement.nextSibling.isSameNode(draggedElement)) {
                return;
            }
            moveTab(draggedElement, e.target.parentElement);
        }
    }
}


function getTabIndex(tab) {
    return Array.prototype.indexOf.call(tabs.children, tab);
}

function getCurrentTabIndex() {
    let currentTab = tabs.getElementsByClassName("selected")[0];
    return getTabIndex(currentTab);
}

function canvasMouseDown(e) {
    if(renaming){
        renameTabEnd(tabs.children[getCurrentTabIndex()]);
        return;
    }
    if(e.button == mouseButtons.LEFT_MOUSE) {
        let x = e.clientX;
        let y = e.clientY;

        if(x > stateRadius + stateEdgePadding.left &&
           x < window.innerWidth - stateRadius - stateEdgePadding.right &&
           y > stateRadius + stateEdgePadding.top &&
           y < window.innerHeight - stateRadius - stateEdgePadding.bottom) {
            // check if a previous state is held down
            
            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;
            
            const states = fsms[getCurrentTabIndex()].states;
            let tooClose = false;
            for(var i = 0; i < states.length; i++) {
                let a = x - states[i].x;
                let b = y - states[i].y;
                let dist = Math.sqrt(a*a + b*b);

                if(dist < stateRadius + stateEdgePadding.between) break;
                if(dist < stateRadius*2 + stateEdgePadding.between) tooClose = true;
            }

            if(i < states.length) {
                dragMouseState(states[i], e);
            } else if(!tooClose) {
                addState(new State(x,y));
            }

        }
    } else if(e.button = mouseButtons.MIDDLE_MOUSE) {
        canvasMouseDrag(e);
    }
}

// function canvasContextMenu(e) {
//     e.preventDefault();
//     console.log("canvas context menu!")
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


function dragState(state, e) {
    let startX = e.changedTouches[0].clientX - canvas.offsetLeft;
    let startY = e.changedTouches[0].clientY - canvas.offsetTop;
    let states = fsms[getCurrentTabIndex()].states;
    let optimized = canvasOptimizationThreshold.mobile < states.length;
    
    canvas.ontouchend = stopDrag;
    canvas.ontouchmove = optimized ? startTouchDragOptimized : startTouchDrag;

    let canvasBuffer;
    if(optimized) {
        canvasBuffer = document.createElement("canvas");
        let canvasBufferContext = canvasBuffer.getContext("2d");
        canvasBuffer.width = canvas.width;
        canvasBuffer.height = canvas.height;
        context.beginPath();
        context.fillStyle = "rgba(0,0,0,0.95)";
        context.arc(state.x, state.y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = "rgba(100,100,100,0.4)";
        context.fillText(state.id, state.x, state.y + 2);
        canvasBufferContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
                                            0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(state.x, state.y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(state.id, state.x, state.y + 2);
    }

    let newPositionX = state.x;
    let newPositionY = state.y;

    function startTouchDrag(e) {
        let x = e.changedTouches[0].clientX - canvas.offsetLeft;
        let y = e.changedTouches[0].clientY - canvas.offsetTop;

        newPositionX += x - startX;
        newPositionY += y- startY;
        
        if(newPositionX < stateRadius + stateEdgePadding.left) {
            newPositionX = stateRadius + stateEdgePadding.left;
        } else if(newPositionX > canvas.width - stateRadius - stateEdgePadding.right) {
            newPositionX = canvas.width - stateRadius - stateEdgePadding.right;
        } if(newPositionY < stateRadius + stateEdgePadding.top) {
            newPositionY = stateRadius + stateEdgePadding.top;
        } else if(newPositionY > canvas.height - stateRadius - stateEdgePadding.bottom) {
            newPositionY = canvas.height - stateRadius - stateEdgePadding.bottom;
        }

        let newPositionValid = true;
        for(let i = 0; i < states.length; i++) {
            if(states[i].id == state.id) continue;

            let a = states[i].x - newPositionX;
            let b = states[i].y - newPositionY;
            let dist = a*a + b*b;
            
            let minDist = stateRadius*2 + stateEdgePadding.between;
            if(dist < minDist*minDist) {
                newPositionValid = false;
                break;
            }
        }
        
        if(newPositionValid) {
            state.x = newPositionX;
            state.y = newPositionY;
        }

        startX = x;
        startY = y;

        drawFSM();
    }

    function startTouchDragOptimized(e) {
        let x = e.changedTouches[0].clientX - canvas.offsetLeft;
        let y = e.changedTouches[0].clientY - canvas.offsetTop;

        newPositionX += x - startX;
        newPositionY += y- startY;
        
        if(newPositionX < stateRadius + stateEdgePadding.left) {
            newPositionX = stateRadius + stateEdgePadding.left;
        } else if(newPositionX > canvas.width - stateRadius - stateEdgePadding.right) {
            newPositionX = canvas.width - stateRadius - stateEdgePadding.right;
        } if(newPositionY < stateRadius + stateEdgePadding.top) {
            newPositionY = stateRadius + stateEdgePadding.top;
        } else if(newPositionY > canvas.height - stateRadius - stateEdgePadding.bottom) {
            newPositionY = canvas.height - stateRadius - stateEdgePadding.bottom;
        }

        startX = x;
        startY = y;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(canvasBuffer, 0, 0, canvas.width, canvas.height,
                                        0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(newPositionX, newPositionY, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(state.id, newPositionX, newPositionY + 2);
    }
    
    function stopDrag() {
        if(optimized) {
            let newPositionValid = true;
            for(let i = 0; i < states.length; i++) {
                if(states[i].id == state.id) continue;

                let a = states[i].x - newPositionX;
                let b = states[i].y - newPositionY;
                let dist = a*a + b*b;
                
                let minDist = stateRadius*2 + stateEdgePadding.between;
                if(dist < minDist*minDist) {
                    newPositionValid = false;
                    break;
                }
            }
            if(newPositionValid) {
                state.x = newPositionX;
                state.y = newPositionY;
            }
        }

        canvas.ontouchmove = null;
        canvas.ontouchend = null;

        drawFSM();
    }
}
function dragMouseState(state, e) {
    let startX = e.clientX;
    let startY = e.clientY;
    let states = fsms[getCurrentTabIndex()].states;
    let optimized = canvasOptimizationThreshold.desktop < states.length;
    
    canvas.onmouseup = stopDrag;
    canvas.onmousemove = optimized ? startDragOptimized : startDrag;

    let canvasBuffer;
    if(optimized) {
        canvasBuffer = document.createElement("canvas");
        let canvasBufferContext = canvasBuffer.getContext("2d");
        canvasBuffer.width = canvas.width;
        canvasBuffer.height = canvas.height;
        context.beginPath();
        context.fillStyle = "rgba(0,0,0,0.95)";
        context.arc(state.x, state.y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = "rgba(100,100,100,0.4)";
        context.fillText(state.id, state.x, state.y + 2);
        canvasBufferContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
                                            0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(state.x, state.y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(state.id, state.x, state.y + 2);
    }
    
    let newPositionX = state.x;
    let newPositionY = state.y;
    
    function startDrag(e) {
        newPositionX += e.clientX - startX;
        newPositionY += e.clientY - startY;
        
        if(newPositionX < stateRadius + stateEdgePadding.left) {
            newPositionX = stateRadius + stateEdgePadding.left;
        } else if(newPositionX > canvas.width - stateRadius - stateEdgePadding.right) {
            newPositionX = canvas.width - stateRadius - stateEdgePadding.right;
        } if(newPositionY < stateRadius + stateEdgePadding.top) {
            newPositionY = stateRadius + stateEdgePadding.top;
        } else if(newPositionY > canvas.height - stateRadius - stateEdgePadding.bottom) {
            newPositionY = canvas.height - stateRadius - stateEdgePadding.bottom;
        }
        
        let newPositionValid = true;
        for(let i = 0; i < states.length; i++) {
            if(states[i].id == state.id) continue;

            let a = states[i].x - newPositionX;
            let b = states[i].y - newPositionY;
            let dist = a*a + b*b;
            
            let minDist = stateRadius*2 + stateEdgePadding.between;
            if(dist < minDist*minDist) {
                newPositionValid = false;
                break;
            }
        }
        
        if(newPositionValid) {
            state.x = newPositionX;
            state.y = newPositionY;
        }
        
        startX = e.clientX;
        startY = e.clientY;
        
        drawFSM(state);
    }

    function startDragOptimized(e) {
        newPositionX += e.clientX - startX;
        newPositionY += e.clientY - startY;
        
        if(newPositionX < stateRadius + stateEdgePadding.left) {
            newPositionX = stateRadius + stateEdgePadding.left;
        } else if(newPositionX > canvas.width - stateRadius - stateEdgePadding.right) {
            newPositionX = canvas.width - stateRadius - stateEdgePadding.right;
        } if(newPositionY < stateRadius + stateEdgePadding.top) {
            newPositionY = stateRadius + stateEdgePadding.top;
        } else if(newPositionY > canvas.height - stateRadius - stateEdgePadding.bottom) {
            newPositionY = canvas.height - stateRadius - stateEdgePadding.bottom;
        }
        
        startX = e.clientX;
        startY = e.clientY;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(canvasBuffer, 0, 0, canvas.width, canvas.height,
                                        0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(newPositionX, newPositionY, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(state.id, newPositionX, newPositionY + 2);
    }
    
    function stopDrag() {
        if(optimized) {
            let newPositionValid = true;
            for(let i = 0; i < states.length; i++) {
                if(states[i].id == state.id) continue;

                let a = states[i].x - newPositionX;
                let b = states[i].y - newPositionY;
                let dist = a*a + b*b;
                
                let minDist = stateRadius*2 + stateEdgePadding.between;
                if(dist < minDist*minDist) {
                    newPositionValid = false;
                    break;
                }
            }
            if(newPositionValid) {
                state.x = newPositionX;
                state.y = newPositionY;
            }
        }

        canvas.onmousemove = null;
        canvas.onmouseup = null;

        drawFSM();
    }
}


function drawFSM(currentState) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const states = fsms[getCurrentTabIndex()].states;
    if(states.length === 0)
        return;
    
    context.strokeStyle = "rgb(15,15,15)";
    context.lineWidth = 3;
    context.font = "bold 22px Roboto";
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    for(let i = 0; i < states.length; i++) {
        if(currentState && states[i].id == currentState) return; //skip state

        let x = states[i].x;
        let y = states[i].y;

        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(x, y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(states[i].id, x, y + 2);
    }

    if(currentState) {
        context.beginPath();
        context.fillStyle = "rgb(235,235,235)";
        context.arc(currentState.x, currentState.y, stateRadius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.fillStyle = "rgb(15,15,15)";
        context.fillText(currentState.id, currentState.x, currentState.y + 2);
    }
}

function pageClosing() {
    if (typeof(Storage) !== "undefined")
        localStorage.setItem("fsms", JSON.stringify(fsms));
    else alert("Local storage not found. All unsaved data will be lost!");
}

function clearData() {
    fsms = [new FSM("Tab 1")];

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
    return name;
}

function addTab() {
    let name = createTab();
    fsms.push(new FSM(name));
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
function tabsTouchStart(e) {
    let ts = e.touches[0].clientX;
    tabs.ontouchmove = tabsTouchMove;

    function tabsTouchMove(e) {
        var te = e.changedTouches[0].clientX;
        tabs.scrollLeft += ts-te
        ts = te;
    }
}

function windowResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    let canvasOffsetX = canvas.offsetLeft;
    let canvasOffsetY = canvas.offsetTop;

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

function canvasDrag(e) {
    if(renaming){
        e.preventDefault();
        renameTabEnd(tabs.children[getCurrentTabIndex()]);
        return;
    }

    let csX = e.touches[0].clientX;
    let csY = e.touches[0].clientY;
    
    if(csX > stateRadius + stateEdgePadding.left &&
       csX < window.innerWidth - stateRadius - stateEdgePadding.right &&
       csY > stateRadius + stateEdgePadding.top &&
       csY < window.innerHeight - stateRadius - stateEdgePadding.bottom) {
        
        let states = fsms[getCurrentTabIndex()].states;
        for(var i = 0; i < states.length; i++) {
            let a = csX - canvas.offsetLeft - states[i].x;
            let b = csY - canvas.offsetTop - states[i].y;
            let dist = a*a + b*b;
            
            let minDist = stateRadius + stateEdgePadding.between;
            if(dist < minDist*minDist) break;
        }

        if(i < states.length) {
            dragState(states[i], e);
            return;
        }
    }

    canvas.ontouchend = touchEnd;
    canvas.ontouchmove = touchMove;

    function touchMove(e) {
        let ceX = e.changedTouches[0].clientX;
        let ceY = e.changedTouches[0].clientY;

        let canvasOffsetX = canvas.offsetLeft;
        let canvasOffsetY = canvas.offsetTop;
        canvasOffsetX += ceX-csX;
        canvasOffsetY += ceY-csY;
        csX = ceX;
        csY = ceY;
        
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
    }
    function touchEnd() {
        canvas.ontouchmove = null;
        canvas.ontouchend = null;
    }
}

function canvasMouseDrag(e) {
    let csX = e.clientX;
    let csY = e.clientY;

    canvas.onmouseup = stopDrag;
    canvas.onmousemove = startDrag;

    function startDrag(e) {
        let ceX = e.clientX;
        let ceY = e.clientY;

        let canvasOffsetX = canvas.offsetLeft;
        let canvasOffsetY = canvas.offsetTop;
        canvasOffsetX += ceX-csX;
        canvasOffsetY += ceY-csY;
        csX = ceX;
        csY = ceY;
        
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
    }

    function stopDrag() {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
    }
}

const maxTabNameLength = 20;
var currentName;
var renaming = false;
function renameTab(tab) {
    let tabText = tab.children[0];
    currentName = tabText.innerText;
    tabText.contentEditable = true;
    renaming = true;
    // document.getElementsByClassName("selected")[0].focus();
}
function renameTabEnd(tab) {
    let tabText = tab.children[0];
    tabText.contentEditable = false;

    if(tabText.innerText != currentName) {
        let newName = tabText.innerText.trim().substring(0, maxTabNameLength) || currentName;
        tabText.innerText = newName;
        tab.title = newName;
        fsms[getTabIndex(tab)].name = newName;
    }

    renaming = false;
}
function renameTabKeyPress(e) {
    const ignoredKeys = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];
    if(ignoredKeys.includes(e.key)) return;
    
    if(e.srcElement.innerText.length >= maxTabNameLength &&
       e.key != "Backspace" &&
       window.getSelection().toString().length === 0) {
        e.preventDefault();
    } if(e.key === "Enter") {
        e.preventDefault();
        renameTabEnd(e.srcElement.parentElement);
    }
    if(e.key === "Escape") {
        e.preventDefault();
        e.srcElement.innerText = currentName;
        renameTabEnd(e.srcElement.parentElement);
    }
}
function moveTab(tab, afterTab) {
    let from = getTabIndex(tab);
    let to = getTabIndex(afterTab);
    to = from > to ? to+1 : to;

    if(from != to) {
        fsms.splice(to, 0, fsms.splice(from, 1)[0]);
        afterTab.after(tab);
    }
}