
const mouseButtons = { LEFT_MOUSE: 0, MIDDLE_MOUSE: 1, RIGHT_MOUSE: 2 }

const stateRadius = 22;
const stateEdgePadding = { top:45, bottom:60, left:20, right:20, between:10 };

const tabsRightOffset = 0; //= 100;
const maxTabNameLength = 50;
let tabs, tab;

let canvas, context;
let fsms = [];

const canvasSizeMultiplier = 3;

// after what number of states will the drawing on state drag be optimized
const canvasOptimizationThreshold = { desktop:150, mobile:30 };

let messages;
let deleteBox;

function getTransitionEventName(){
    let t;
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
const transitionEventName = getTransitionEventName();

function isMobile() {
    const devices = ['Android', 'webOS',
                 'iPhone', 'iPad','iPod',
                 'BlackBerry','Windows Phone'];

    for(d in devices) {
        if(navigator.userAgent.includes(devices[d]))
            return true;
    }
}
let mobile = isMobile();

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
            
            // .then(reg => {
            //     if(!navigator.serviceWorker.controller)
            //         return;

            //     if(reg.waiting) {
            //         updateReady(reg.waiting);
            //         return;
            //     }

            //     if(reg.installing) {
            //         trackInstalling(reg.installing);
            //         return;
            //     }

            //     reg.addEventListener('updatefound', () => {
            //         trackInstalling(reg.installing);
            //     });
            // });

            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if(refreshing) return;
                refreshing = true;
                window.location.reload();
            });

        });

        // function trackInstalling(worker) {
        //     worker.addEventListener('statechange', () => {
        //         if(worker.state == 'installed')
        //             updateReady(worker);
        //     });
        // }

        // function updateReady(worker) {
        //     messages.innerText = 'Update found - Reload to check it out';
        //     messages.onclick = () => { worker.postMessage('skipWaiting') }
        // }

    }
};
registerServiceWorker();

document.ondragover = e => { e.preventDefault() };
document.addEventListener('DOMContentLoaded', () => {
    messages = document.getElementById('messages');
    deleteBox = document.getElementById('delete');

    tabs = document.getElementById('tabs');
    tab = tabs.firstElementChild;
    tab.firstElementChild.maxLength = maxTabNameLength;
    tab.firstElementChild.size = tab.firstElementChild.value.length;
    tab.title = tab.firstElementChild.title = tab.firstElementChild.value;

    if (typeof(Storage) !== 'undefined' && 'fsms' in localStorage) {
        let tmpFSMS = JSON.parse(localStorage.getItem('fsms'));
        tmpFSMS.forEach(fsm => {
            fsms.push(new FSM(fsm));
        });
    }
    if(fsms.length == 0) {
        fsms.push(new FSM(tab.firstElementChild.value));
    }

    tab = tab.cloneNode(true);
    tabs.firstElementChild.remove();
    for(let i = 0; i < fsms.length; i++) {
        createTab(fsms[i].name);
    }
    tabs.firstElementChild.classList.add('selected');

    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth*canvasSizeMultiplier;
    canvas.height = window.innerHeight*canvasSizeMultiplier;
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + 'px';
    canvas.style.top = ((window.innerHeight - canvas.height) / 2) + 'px';
    context = canvas.getContext('2d');

    window.addEventListener('resize', windowResize);
    window.addEventListener('scroll', drawFSM);
    window.addEventListener('beforeunload', pageClosing);


    tabs.addEventListener('wheel', tabsScroll, {passive: true});
    tabs.addEventListener('touchstart', tabsTouchStart, {passive: true});
    tabs.addEventListener('dragstart', tabDragStart, {passive: true});

    document.ondragenter = tabDragEnter;
    document.ondragleave = tabDragLeave;
    document.ondrop = onDrop;
    document.ondragend = onDragEnd;
    
    
    canvas.addEventListener('mousedown', canvasMouseDown);
    // canvas.addEventListener('contextmenu', canvasContextMenu);
    //canvas.addEventListener('wheel', canvasScroll);
    canvas.addEventListener('touchstart', canvasDrag, {passive: true});

    windowResize();
});

window.addEventListener("load", drawFSM);

function allowDragOver(e) {
    e.preventDefault();
}

function getTabIndex(tab) {
    return Array.prototype.indexOf.call(tabs.children, tab);
}

function getCurrentTabIndex() {
    let currentTab = tabs.getElementsByClassName('selected')[0];
    return getTabIndex(currentTab);
}

let draggedElement;
function tabDragStart(e) {
    draggedElement = e.target;

    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';

    if(mobile) {
        e.dataTransfer.setData('text/plain', 'text');
    } else {
        let fsm = fsms[getTabIndex(draggedElement)];
        let url = URL.createObjectURL(new File([JSON.stringify(fsm)], 'fsm.json'));
        e.dataTransfer.setData('DownloadURL', 'text:' + draggedElement.firstElementChild.value + '.json:' + url);
    }

    draggedElement.style.opacity = 0.4;
    deleteBox.classList.remove('hidden');
}

function tabDragEnter(e) {
    e.preventDefault()
    e.stopPropagation();
    if(e.target.id == 'delete') {
        deleteBox.classList.add('delete');
    } else if(e.target.parentElement && e.target.classList.contains('tab')) {
        if(!draggedElement.isSameNode(e.target) && !draggedElement.isSameNode(e.target.nextSibling)) {
            e.target.classList.add('dropZone');
        }
    }
}

function tabDragLeave(e) {
    e.preventDefault()
    e.stopPropagation();
    e.target.classList.remove('dropZone');
    e.target.classList.remove('delete');
}

function onDrop(e) {
    e.preventDefault()
    e.stopPropagation();

    onDragEnd();

    if(e.target.id == 'delete') {
        deleteTab(draggedElement);
    } else if(e.target.parentElement && e.target.classList.contains('tab')) {
        if(!draggedElement.isSameNode(e.target) && !draggedElement.isSameNode(e.target.nextSibling)) {
            moveTab(draggedElement, e.target);
        }
    } else {
        if (e.dataTransfer.files) {
            for(let i = 0; i < e.dataTransfer.files.length; i++) {
                let file = e.dataTransfer.files[i];

                let reader = new FileReader();
                reader.onload = function (event) {
                    let fsm = JSON.parse(event.target.result);
                    if(fsm.hasOwnProperty('name') && fsm.hasOwnProperty('states')) {
                        fsms.push(new FSM(fsm));
                        createTab(fsm.name);
                    }
                };

                reader.readAsText(file, 'utf-8');
            }
        }
    }
}

function onDragEnd() {
    if(draggedElement)
        draggedElement.style.opacity = 1;
    deleteBox.classList.add('hidden');
    deleteBox.classList.remove('delete');
    tabs.parentElement.getElementsByClassName('addtab')[0].classList.remove('dropZone');

    for(let i = 0; i < tabs.children.length; i++) {
        tabs.children[i].classList.remove('dropZone');
    }
}





function addState(state) {
    fsms[getCurrentTabIndex()].addState(state);
    drawFSM();
}
function drawState(id, x, y) {
    context.beginPath();
    context.strokeStyle = 'rgb(15,15,15)';
    context.lineWidth = 3;
    context.fillStyle = 'rgb(235,235,235)';
    context.arc(x, y, stateRadius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.fillStyle = 'rgb(15,15,15)';
    context.font = 'bold 22px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(id, x, y + 2);
}
function drawStateGhost(id, x, y) {
    context.beginPath();
    context.strokeStyle = 'rgb(15,15,15)';
    context.lineWidth = 3;
    context.fillStyle = 'rgba(0,0,0,0.95)';
    context.arc(x, y, stateRadius, 0, 2 * Math.PI);
    context.fill();
    context.fillStyle = 'rgba(100,100,100,0.4)';
    context.font = 'bold 22px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(id, x, y + 2);
}

function dragState(state, e) {
    let startX = e.targetTouches[0].clientX - canvas.offsetLeft;
    let startY = e.targetTouches[0].clientY - canvas.offsetTop;
    let states = fsms[getCurrentTabIndex()].states;
    let optimized = canvasOptimizationThreshold.mobile < states.length;
    
    canvas.ontouchend = stopDrag;
    canvas.ontouchmove = optimized ? startTouchDragOptimized : startTouchDrag;

    let canvasBuffer;
    if(optimized) {
        canvasBuffer = document.createElement('canvas');
        let canvasBufferContext = canvasBuffer.getContext('2d');
        canvasBuffer.width = canvas.width;
        canvasBuffer.height = canvas.height;

        drawStateGhost(state.id, state.x, state.y);
        canvasBufferContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
                                            0, 0, canvas.width, canvas.height);
        drawState(state.id, state.x, state.y);
    }

    let newPositionX = state.x;
    let newPositionY = state.y;

    function startTouchDrag(e) {
        let x = e.targetTouches[0].clientX - canvas.offsetLeft;
        let y = e.targetTouches[0].clientY - canvas.offsetTop;

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

        if(!newPositionValid) {
            drawStateGhost(state.id, newPositionX, newPositionY);
        }
    }

    function startTouchDragOptimized(e) {
        let x = e.targetTouches[0].clientX - canvas.offsetLeft;
        let y = e.targetTouches[0].clientY - canvas.offsetTop;

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

        drawState(state.id, newPositionX, newPositionY);
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
        canvasBuffer = document.createElement('canvas');
        let canvasBufferContext = canvasBuffer.getContext('2d');
        canvasBuffer.width = canvas.width;
        canvasBuffer.height = canvas.height;
        drawStateGhost(state.id, state.x, state.y);
        canvasBufferContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
                                            0, 0, canvas.width, canvas.height);
        drawState(state.id, state.x, state.y);
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

        if(!newPositionValid) {
            drawStateGhost(state.id, newPositionX, newPositionY);
        }
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

        drawState(state.id, newPositionX, newPositionY);
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
    
    
    
    for(let i = 0; i < states.length; i++) {
        if(currentState && states[i].id == currentState) return; //skip state

        let x = states[i].x;
        let y = states[i].y;

        drawState(states[i].id, x, y);
    }

    if(currentState) {
        drawState(currentState.id, currentState.x, currentState.y);
    }
}

function pageClosing() {
    if (typeof(Storage) !== 'undefined')
        localStorage.setItem('fsms', JSON.stringify(fsms));
    else alert('Local storage not found. All unsaved data will be lost!');
}

function clearData() {
    deleteBox.classList.add('hidden');

    if(fsms.length == 1) {
        fsms[0].states = [];
        let firstTab = tabs.firstElementChild;
        let firstTabText = firstTab.firstElementChild;
        fsms[0].name = firstTab.title = firstTabText.title = firstTabText.value = tab.firstElementChild.value;
        firstTabText.size = firstTabText.value.length || 1;
    } else {
        fsms = [new FSM(tab.firstElementChild.value)];
        while(tabs.firstElementChild)
            tabs.firstElementChild.remove();
        createTab();
        tabs.firstElementChild.classList.add('selected');
        switchTab(tabs.firstElementChild);
    }

    localStorage.clear();
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + 'px';
    canvas.style.top = ((window.innerJHeight - canvas.height) / 2) + 'px';

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCurrentTab() {
    fsms[getCurrentTabIndex()].states = [];
    canvas.style.left = ((window.innerWidth - canvas.width) / 2) + 'px';
    canvas.style.top = ((window.innerHeight - canvas.height) / 2) + 'px';
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function createTab(name) {
    if(!name)
        name = tab.firstElementChild.value;
    
    let newTab = tab.cloneNode(true);
    newTab.firstElementChild.value = name;
    newTab.title = newTab.firstElementChild.title = name;
    newTab.firstElementChild.size = name.length;
    newTab.classList.remove('selected');
    tabs.appendChild(newTab);
    
    return newTab;
}

function addTab() {
    let newTab = createTab();
    fsms.push(new FSM(newTab.firstElementChild.value));
    switchTab(newTab);
    tabs.scrollLeft += tabs.scrollWidth;
}

function switchTab(tab) {
    if(!tab.classList.contains('selected')) {
        let currentTab = getCurrentTabIndex();
        renameTabEnd(tabs.children[currentTab]);
        tabs.children[currentTab].classList.remove('selected');
        tabs.children[currentTab].viewX = canvas.style.left;
        tabs.children[currentTab].viewY = canvas.style.top;
        tab.classList.add('selected');

        // center tab on saved position or center of canvas
        canvas.style.left = tab.viewX || ((window.innerWidth - canvas.width) / 2) + 'px';
        canvas.style.top = tab.viewY || ((window.innerHeight - canvas.height) / 2) + 'px';

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
    e.preventDefault();
    let ts = e.targetTouches[0].clientX;
    tabs.ontouchmove = tabsTouchMove;

    function tabsTouchMove(e) {
        let te = e.targetTouches[0].clientX;
        tabs.scrollLeft += ts-te
        ts = te;
    }
}
function deleteTab(tab) {
    if(tabs.children.length == 1) {
        clearData();
    } else {
        let from = getTabIndex(tab);
        switchTab(tabs.children[from ? from-1 : from+1]);
        tab.addEventListener(transitionEventName, tabRemoved);
        collapseTab(tab);
        fsms.splice(from, 1);
    }
}
function tabRemoved(e) {
    e.target.remove();
}
function collapseTab(tab) {
    tab.style.opacity = '0.4';
    tab.style.width = tab.scrollWidth + 'px';
    requestAnimationFrame(() => {
        tab.style.width = '0px';
    });
}
function moveTab(tab, afterTab) {
    let from = getTabIndex(tab);
    let to = getTabIndex(afterTab);
    to = from > to ? to+1 : to;

    if(from != to) {
        fsms.splice(to, 0, fsms.splice(from, 1)[0]);
        to ? afterTab.after(tab) : tabs.firstElementChild.before(tab);
    }
}

function windowResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    let redrawFSM = false;
    if(canvas.width < window.innerWidth * canvasSizeMultiplier) {
        redrawFSM = true;
        canvas.width = window.innerWidth * canvasSizeMultiplier;
    } if(canvas.height < window.innerHeight * canvasSizeMultiplier) {
        redrawFSM = true;
        canvas.height = window.innerHeight * canvasSizeMultiplier;
    }
    if(redrawFSM)
        drawFSM();

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

    canvas.style.left = canvasOffsetX + 'px';
    canvas.style.top = canvasOffsetY + 'px';
}

function canvasMouseDown(e) {
    if(renaming) {
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
//     console.log('canvas context menu!')
// }

// function canvasScroll(e) {
//     if(e.deltaY > 0) // Zoom out
//         context.scale(0.9,0.9);
//     else if(e.deltaY < 0) // Zoom in
//         context.scale(1.1,1.1);
// }

function canvasDrag(e) {
    let csX = e.targetTouches[0].clientX;
    let csY = e.targetTouches[0].clientY;
    
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
        let ceX = e.targetTouches[0].clientX;
        let ceY = e.targetTouches[0].clientY;

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

        canvas.style.left = canvasOffsetX + 'px';
        canvas.style.top = canvasOffsetY + 'px';
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

        canvas.style.left = canvasOffsetX + 'px';
        canvas.style.top = canvasOffsetY + 'px';
    }

    function stopDrag() {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
    }
}

let currentName;
let renaming = false;
function renameTab(tab) {
    renaming = true;
    let tabText = tab.firstElementChild;
    currentName = tabText.value;

    tabText.style.pointerEvents = 'all'
    tabText.classList.add('alignTextLeft');
    tabText.disabled = false;
    tabText.select();
}
function renameTabEnd(tab) {
    let tabText = tab.firstElementChild;
    tabText.disabled = true;
    tabText.classList.remove('alignTextLeft');
    
    if(tabText.value != currentName) {
        let newName = tabText.value.trim().substring(0, maxTabNameLength) || currentName;
        tabText.value = newName;
        fsms[getTabIndex(tab)].name = newName;

        tabText.size = tabText.value.length || 1;
        tab.title = tabText.title = tabText.value;
    }
    
    window.getSelection().empty()
    tabText.style.pointerEvents = ''
    renaming = false;
}
function renameTabKeyPress(e) {
    if(e.key === 'Enter') {
        e.preventDefault();
        renameTabEnd(e.srcElement.parentElement);
    } else if(e.key === 'Escape') {
        e.preventDefault();
        e.srcElement.value = currentName;
        renameTabEnd(e.srcElement.parentElement);
    }
}
function onInput(e) {
    e.target.size = e.target.value.length || 1;
}