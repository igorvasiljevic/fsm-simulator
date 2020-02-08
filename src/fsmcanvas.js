export default class FSMCanvas {
    constructor({
        canvas,
        stateRadius,
        stateEdgePadding,
        canvasOptimizationThreshold,
        mouseButtons,
        getInput
    }) {
        this.canvas = canvas;
        this.context = canvas.context;
        this.stateRadius = stateRadius;
        this.stateEdgePadding = stateEdgePadding;
        this.canvasOptimizationThreshold = canvasOptimizationThreshold;
        this.mouseButtons = mouseButtons;
        this.getInput = getInput;

        this.selected = null;
        
        this.gap = this.stateRadius + 1;
        this.arrowAngle = 160 * (Math.PI / 180);
        this.arrowLength = 15;
        this.loopp = this.stateRadius + 10;
        this.loopr = this.stateRadius/1.3;

        canvas.addEventListener('mousedown', this._canvasMouseDown.bind(this));
        canvas.addEventListener('touchstart', this._canvasDrag.bind(this), {passive: true});
        
    }

    set fsm(fsm) {
        this.FSM = fsm;
        delete this._accepted;
        this.drawFSM();
    }

    set accepted(val) { this._accepted = val }

    set tool(name) { this._tool = name }
    get tool() { return this._tool }
    get selected() { return this._selected }
    set selected(stateId) {
        this._selected = (this._selected == stateId) ? null : stateId;
    }

    drawFSM() {
        this.context.clearRect(0, 0, this.context.canvas.scrollWidth, this.context.canvas.scrollHeight);

        this.context.beginPath();
        this.context.fillStyle = 'rgb(32,32,32)';
        this.context.fillRect(this.context.canvas.scrollWidth/2-1.5, this.context.canvas.scrollHeight/2-1.5, 2,2);

        if(!this.FSM) return;

        const states = this.FSM.states;
        
        for(let i = 0; i < states.length; i++) {
            this._drawStateTransitions(states[i]);
        }
        for(let i = 0; i < states.length; i++) {
            this._drawState(states[i].id, states[i].x, states[i].y);
        }
    }

    _drawState(id, x, y) {
        this.context.beginPath();

        this.context.strokeStyle = 'rgb(15,15,15)';
        if(this.FSM.initial == id)
            this.context.strokeStyle = 'blue';
        if(this.FSM.current.includes(id)) {
            if(this.hasOwnProperty('_accepted'))
                this.context.strokeStyle = this._accepted && this.FSM.final.includes(id) ? 'green' : 'red';
            else this.context.strokeStyle = 'yellow';
        }

        this.context.fillStyle = 'rgb(235,235,235)';
        if(this._selected == id)
            this.context.fillStyle = 'rgb(160, 190, 255)';
        this.context.lineWidth = 3;
        
        this.context.arc(x, y, this.stateRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();

        this.context.fillStyle = 'rgb(15,15,15)';
        this.context.font = 'bold 22px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(id, x, y + 2);

        if(this.FSM.final.includes(id)) {
            this.context.beginPath();
            this.context.strokeStyle = 'rgb(15,15,15)';
            this.context.arc(x, y, this.stateRadius - 4, 0, 2 * Math.PI);
            this.context.stroke();
        }
    }
    _drawStateGhost(id, x, y) {
        this.context.beginPath();
        this.context.strokeStyle = 'rgb(15,15,15)';
        this.context.lineWidth = 3;
        this.context.fillStyle = 'rgba(0,0,0,0.95)';
        this.context.arc(x, y, this.stateRadius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.fillStyle = 'rgba(100,100,100,0.4)';
        this.context.font = 'bold 22px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(id, x, y + 2);
    }

    _drawStateTransitions(state) {
        for(let sid in state.transitions) {
            const tstate = this.FSM.getState(sid);
            this._drawArrow(state.x, state.y, tstate.x, tstate.y,
                                state.transitions[tstate.id].filter(Boolean).join(','));
        }
    }

    _drawArrow(x1,y1,x2,y2,text,pad = true) {
        const gap = pad ? this.gap : 0;

        this.context.beginPath();
        this.context.strokeStyle = 'rgb(15,15,15)';
        this.context.fillStyle = 'rgb(235,235,235)';
        this.context.font = 'bold 18px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.lineWidth = 2;

        if(Math.abs(x1 - x2) < this.stateRadius && Math.abs(y1 - y2) < this.stateRadius) {
            this.context.arc(x1, y1 - this.loopp, this.loopr, 0, 2 * Math.PI);
            this.context.stroke();
            this.context.fillText(text, x1, y1 - this.loopp - this.loopr);
        } else {
            let vx = x2 - x1;
            let vy = y2 - y1;

            // normalization of the line vector
            const vlenght = Math.sqrt(vx*vx + vy*vy);
            vx = vx / vlenght;
            vy = vy / vlenght;

            const startx = x1 + vx*this.gap;
            const starty = y1 + vy*this.gap;
            const endx = x2 - vx*gap;
            const endy = y2 - vy*gap;

            let vx2 = Math.cos(this.arrowAngle)*vx - Math.sin(this.arrowAngle)*vy;
            let vy2 = Math.sin(this.arrowAngle)*vx + Math.cos(this.arrowAngle)*vy;

            let vx3 = Math.cos(-this.arrowAngle)*vx - Math.sin(-this.arrowAngle)*vy;
            let vy3 = Math.sin(-this.arrowAngle)*vx + Math.cos(-this.arrowAngle)*vy;

            //Arrow body
            this.context.moveTo(startx, starty);
            this.context.lineTo(endx, endy);

            // Arrow head
            this.context.moveTo(endx, endy);
            this.context.lineTo(endx + vx2*this.arrowLength, endy + vy2*this.arrowLength);
            this.context.moveTo(endx, endy);
            this.context.lineTo(endx + vx3*this.arrowLength, endy + vy3*this.arrowLength);

            this.context.stroke();

            this.context.fillText(text, (x1+x2)/2, (y1+y2)/2);
        }
    }

    _canvasMouseDown(e) {
        if(e.button == this.mouseButtons.LEFT_MOUSE) {
            let x = e.clientX;
            let y = e.clientY;

            if(x > this.stateRadius + this.stateEdgePadding.LEFT &&
               x < window.innerWidth - this.stateRadius - this.stateEdgePadding.RIGHT &&
               y > this.stateRadius + this.stateEdgePadding.TOP &&
               y < window.innerHeight - this.stateRadius - this.stateEdgePadding.BOTTOM) {
                // check if a previous state is held down

                x -= this.context.canvas.offsetLeft;
                y -= this.context.canvas.offsetTop;
                
                const states = this.FSM.states;
                let tooClose = false;
                for(var i = 0; i < states.length; i++) {
                    let a = x - states[i].x;
                    let b = y - states[i].y;
                    let dist = Math.sqrt(a*a + b*b);

                    if(dist < this.stateRadius + this.stateEdgePadding.BETWEEN) break;
                    if(dist < this.stateRadius*2 + this.stateEdgePadding.BETWEEN) tooClose = true;
                }

                if(i < states.length) {
                    console.log(this.tool);
                    if(this.tool) {
                        switch(this.tool) {
                            case 'delete_state':
                                this._removeState(states[i].id);
                                break;
                            case 'add_transition':
                                if(this.selected != null)
                                    this._createTransition(this.FSM.getState(this.selected), states[i], e);
                                else this._dragTransition(states[i], e);
                                break;
                            case 'set_final_state':
                                this._setFinalState(states[i].id);
                                break;
                            case 'set_initial_state':
                                this._setInitialState(states[i].id);
                                break;
                        } 
                    } else {
                        this.selected = states[i].id;
                        this._dragMouseState(states[i], e);
                    }
                } else if(!tooClose) {
                    if(document.activeElement && (
                       document.activeElement.tagName === 'INPUT' ||
                       document.activeElement.getAttribute('contenteditable')))
                        return;
                    const newStateId = this.FSM.addState(x,y).id;
                    this.selected = null;
                    switch(this.tool) {
                        case 'set_final_state':
                            this._setFinalState(newStateId);
                            break;
                        case 'set_initial_state':
                            this._setInitialState(newStateId);
                            break;
                    }
                    this.drawFSM();
                }

            }
        } else if(e.button == this.mouseButtons.MIDDLE_MOUSE) {
            this.canvas._mouseDrag(e);
        }
    }

    _canvasDrag(e) {
        let csX = e.targetTouches[0].clientX;
        let csY = e.targetTouches[0].clientY;

        if(csX > this.stateRadius + this.stateEdgePadding.LEFT &&
           csX < window.innerWidth - this.stateRadius - this.stateEdgePadding.RIGHT &&
           csY > this.stateRadius + this.stateEdgePadding.TOP &&
           csY < window.innerHeight - this.stateRadius - this.stateEdgePadding.BOTTOM) {
            
            let states = this.FSM.states;
            for(var i = 0; i < states.length; i++) {
                let a = csX - this.context.canvas.offsetLeft - states[i].x;
                let b = csY - this.context.canvas.offsetTop - states[i].y;
                let dist = a*a + b*b;
                
                let minDist = this.stateRadius + this.stateEdgePadding.BETWEEN;
                if(dist < minDist*minDist) break;
            }


            if(i < states.length) {
                switch(this.tool) {
                    case 'add_transition':
                        this._dragTransition(states[i], e);
                        break;
                    default:
                        this._dragState(states[i], e);
                }
                return;
            }
        } 
        this.canvas._drag(e);
    }

    _dragMouseState(state, e) {
        const canvas = this.context.canvas;
        let startX = e.clientX;
        let startY = e.clientY;
        let states = this.FSM.states;
        let optimized = this.canvasOptimizationThreshold.DESKTOP < states.length;

        
        canvas.onmouseup = stopDrag.bind(this);
        canvas.onmousemove = optimized ? startDragOptimized.bind(this) : startDrag.bind(this);

        let canvasBuffer;
        if(optimized) {
            canvasBuffer = document.createElement('canvas');
            let canvasBufferContext = canvasBuffer.getContext('2d');
            canvasBuffer.width = canvas.width;
            canvasBuffer.height = canvas.height;
            this._drawStateGhost(state.id, state.x, state.y);
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            canvasBufferContext.drawImage(canvas, 0, 0);
            this.context.setTransform(canvas.parentElement._pixelRatio, 0, 0, canvas.parentElement._pixelRatio, 0, 0);
            this._drawState(state.id, state.x, state.y);
        }
        
        let newPositionX = state.x;
        let newPositionY = state.y;
        
        function startDrag(e) {
            newPositionX += e.clientX - startX;
            newPositionY += e.clientY - startY;

            if(newPositionX < this.stateRadius + this.stateEdgePadding.LEFT)
                newPositionX = this.stateRadius + this.stateEdgePadding.LEFT;
            else if(newPositionX > canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT)
                newPositionX = canvas.scrollWidth - this.stateRadius - stateEdgePadding.RIGHT;
            if(newPositionY < this.stateRadius + this.stateEdgePadding.TOP)
                newPositionY = this.stateRadius + this.stateEdgePadding.TOP;
            else if(newPositionY > canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM)
                newPositionY = canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM;
            
            let newPositionValid = true;
            for(let i = 0; i < states.length; i++) {
                if(states[i].id == state.id) continue;

                let a = states[i].x - newPositionX;
                let b = states[i].y - newPositionY;
                let dist = a*a + b*b;
                
                let minDist = this.stateRadius*2 + this.stateEdgePadding.BETWEEN;
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
            
            this.drawFSM();

            if(!newPositionValid)
                this._drawStateGhost(state.id, newPositionX, newPositionY);
        }

        function startDragOptimized(e) {
            newPositionX += e.clientX - startX;
            newPositionY += e.clientY - startY;
            
            if(newPositionX < this.stateRadius + this.stateEdgePadding.LEFT)
                newPositionX = this.stateRadius + this.stateEdgePadding.LEFT;
            else if(newPositionX > canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT)
                newPositionX = canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT;
            if(newPositionY < this.stateRadius + this.stateEdgePadding.TOP)
                newPositionY = this.stateRadius + this.stateEdgePadding.TOP;
            else if(newPositionY > canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM)
                newPositionY = canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM;
            
            startX = e.clientX;
            startY = e.clientY;
            
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.drawImage(canvasBuffer, 0, 0);
            this.context.setTransform(canvas.parentElement._pixelRatio, 0, 0, canvas.parentElement._pixelRatio, 0, 0);
            this._drawState(state.id, newPositionX, newPositionY);
        }
        
        function stopDrag() {
            if(optimized) {
                let newPositionValid = true;
                for(let i = 0; i < states.length; i++) {
                    if(states[i].id == state.id) continue;

                    let a = states[i].x - newPositionX;
                    let b = states[i].y - newPositionY;
                    let dist = a*a + b*b;
                    
                    let minDist = this.stateRadius*2 + this.stateEdgePadding.BETWEEN;
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

            this.drawFSM();
        }
    }
    _dragState(state, e) {
        const canvas = this.context.canvas;
        let startX = e.targetTouches[0].clientX - canvas.offsetLeft;
        let startY = e.targetTouches[0].clientY - canvas.offsetTop;
        const states = this.FSM.states;
        const optimized = this.canvasOptimizationThreshold.MOBILE < states.length;
        
        canvas.ontouchend = stopDrag.bind(this);
        canvas.ontouchmove = optimized ? startTouchDragOptimized.bind(this) : startTouchDrag.bind(this);
    
        let canvasBuffer;
        if(optimized) {
            canvasBuffer = document.createElement('canvas');
            let canvasBufferContext = canvasBuffer.getContext('2d');
            canvasBuffer.width = canvas.width;
            canvasBuffer.height = canvas.height;
    
            this._drawStateGhost(state.id, state.x, state.y);
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            canvasBufferContext.drawImage(canvas, 0, 0);
            this.context.setTransform(canvas.parentElement._pixelRatio, 0, 0, canvas.parentElement._pixelRatio, 0, 0);
            this._drawState(state.id, state.x, state.y);
        }
    
        let newPositionX = state.x;
        let newPositionY = state.y;
    
        function startTouchDrag(e) {
            let x = e.targetTouches[0].clientX - canvas.offsetLeft;
            let y = e.targetTouches[0].clientY - canvas.offsetTop;
    
            newPositionX += x - startX;
            newPositionY += y- startY;
            
            if(newPositionX < this.stateRadius + this.stateEdgePadding.LEFT)
                newPositionX = this.stateRadius + this.stateEdgePadding.LEFT;
            else if(newPositionX > canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT)
                newPositionX = canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT;
            if(newPositionY < this.stateRadius + this.stateEdgePadding.TOP)
                newPositionY = this.stateRadius + this.stateEdgePadding.TOP;
            else if(newPositionY > canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM)
                newPositionY = canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM;
    
            let newPositionValid = true;
            for(let i = 0; i < states.length; i++) {
                if(states[i].id == state.id) continue;
    
                let a = states[i].x - newPositionX;
                let b = states[i].y - newPositionY;
                let dist = a*a + b*b;
                
                let minDist = this.stateRadius*2 + this.stateEdgePadding.BETWEEN;
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
    
            this.drawFSM();
    
            if(!newPositionValid)
                this._drawStateGhost(state.id, newPositionX, newPositionY);
        }
    
        function startTouchDragOptimized(e) {
            let x = e.targetTouches[0].clientX - canvas.offsetLeft;
            let y = e.targetTouches[0].clientY - canvas.offsetTop;
    
            newPositionX += x - startX;
            newPositionY += y - startY;
            
            if(newPositionX < this.stateRadius + this.stateEdgePadding.LEFT)
                newPositionX = this.stateRadius + this.stateEdgePadding.LEFT;
            else if(newPositionX > canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT)
                newPositionX = canvas.scrollWidth - this.stateRadius - this.stateEdgePadding.RIGHT;
            if(newPositionY < this.stateRadius + this.stateEdgePadding.TOP)
                newPositionY = this.stateRadius + this.stateEdgePadding.TOP;
            else if(newPositionY > canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM)
                newPositionY = canvas.scrollHeight - this.stateRadius - this.stateEdgePadding.BOTTOM;
    
            startX = x;
            startY = y;
    
            this.context.clearRect(0, 0, canvas.width, canvas.height);
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.drawImage(canvasBuffer, 0, 0);
            this.context.setTransform(canvas.parentElement._pixelRatio, 0, 0, canvas.parentElement._pixelRatio, 0, 0);
            
            this._drawState(state.id, newPositionX, newPositionY);
        }
        
        function stopDrag() {
            if(optimized) {
                let newPositionValid = true;
                for(let i = 0; i < states.length; i++) {
                    if(states[i].id == state.id) continue;
    
                    let a = states[i].x - newPositionX;
                    let b = states[i].y - newPositionY;
                    let dist = a*a + b*b;
                    
                    let minDist = this.stateRadius*2 + this.stateEdgePadding.BETWEEN;
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
    
            this.drawFSM();
        }
    }

    _dragTransition(state, e) {
        const canvas = this.context.canvas;
        const states = this.FSM.states;
        let x, y;
        if(e.targetTouches) {
            x = e.targetTouches[0].clientX - canvas.offsetLeft;
            y = e.targetTouches[0].clientY - canvas.offsetTop;

            canvas.ontouchend = stopDrag.bind(this);
            canvas.ontouchmove = startDrag.bind(this);
        } else {
            x = e.clientX - canvas.offsetLeft;
            y = e.clientY - canvas.offsetTop;

            canvas.onmouseup = stopDrag.bind(this);
            canvas.onmousemove = startDrag.bind(this);
        }

        function startDrag(e) {          
            if(e.targetTouches) {
                x = e.targetTouches[0].clientX - canvas.offsetLeft;
                y = e.targetTouches[0].clientY - canvas.offsetTop;
            } else {
                x = e.clientX - canvas.offsetLeft;
                y = e.clientY - canvas.offsetTop;
            }

            this.drawFSM();
            this._drawArrow(state.x, state.y, x, y, '', false);
        }
        
        function stopDrag() {
            canvas.onmousemove = null;
            canvas.onmouseup = null;
            canvas.ontouchend = null;
            canvas.ontouchmove = null;

            for(var i = 0; i < states.length; i++) {
                let a = states[i].x - x;
                let b = states[i].y - y;
                let dist = a*a + b*b;
                
                let minDist = this.stateRadius;
                if(dist < minDist*minDist) break;
            }

            if(i < states.length)
                this._createTransition(state, states[i]);

            this.drawFSM();
        }
    }

    _createTransition(fromState, toState, e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const canvas = this.context.canvas;
        let tx = (fromState.x + toState.x) / 2 + canvas.offsetLeft;
        let ty = (fromState.y + toState.y) / 2 + canvas.offsetTop;
        if(fromState.equals(toState)) {
            tx = fromState.x + canvas.offsetLeft;
            ty = fromState.y - this.loopp - this.loopr + canvas.offsetTop;
        } else {
            tx = (fromState.x + toState.x) / 2 + canvas.offsetLeft;
            ty = (fromState.y + toState.y) / 2 + canvas.offsetTop;
        }

        const text = fromState.transitions[toState.id] ?
                     fromState.transitions[toState.id].join(',') : 
                    '';
        if(!text) fromState.addTransition(toState.id, '');
        else fromState.transitions[toState.id] = [''];
        this.drawFSM();
        this._getInput(tx, ty, text, input => {
            console.log(input.trim() ? true : false);
            if(input.trim())
                fromState.transitions[toState.id] = input.split(',')
                                                         .map(Function.prototype.call, String.prototype.trim)
                                                         .sort();
            else delete fromState.transitions[toState];
            this.drawFSM();
        })
    }

    _getInput(x, y, text, callback) {
        this.getInput.style.left = (x-40) + 'px';
        this.getInput.style.top = (y-11) + 'px';
        this.getInput.value = text;
        this.getInput.classList.remove('not_shown');
        

        let cancel = false;
        this.getInput.onkeyup = e => {
            if(e.key === 'Escape' || e.key === 'Enter') {
                if(e.key === 'Escape') cancel = true;
                this.getInput.onkeyup = null;
                this.getInput.blur();
            }
        };
        this.getInput.onblur = e => {
            this.getInput.onblur = null;
            this.getInput.classList.add('not_shown');
            if(cancel) callback('');
            else callback(this.getInput.value);
        };
        this.getInput.focus();
    }

    _removeState(stateId) {
        this.FSM.removeState(stateId);
        this.drawFSM();
    }

    _setFinalState(stateId) {
        this.FSM.toggleFinal(stateId);
        this.drawFSM();
    }

    _setInitialState(stateId) {
        this.FSM.setInitial(stateId);
        this.drawFSM();
    }
}




