import { State } from './fsm.js';

export default class FSMCanvas {
    constructor({
        canvas,
        stateRadius,
        stateEdgePadding,
        canvasOptimizationThreshold,
        mouseButtons
    }) {
        this.canvas = canvas;
        this.context = canvas.context;
        this.stateRadius = stateRadius;
        this.stateEdgePadding = stateEdgePadding;
        this.canvasOptimizationThreshold = canvasOptimizationThreshold;
        this.mouseButtons = mouseButtons;

        canvas.addEventListener('mousedown', this._canvasMouseDown.bind(this));
        canvas.addEventListener('touchstart', this._canvasDrag.bind(this), {passive: true});
        
    }

    set fsm(fsm) {
        this.FSM = fsm;
        delete this._accepted;
        this.drawFSM();
    }

    set accepted(val) { this._accepted = val; }

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
        if(this.FSM.current.includes(id)) {
            if(this.hasOwnProperty('_accepted'))
                this.context.strokeStyle = this._accepted && this.FSM.final.includes(id) ? 'green' : 'red';
            else this.context.strokeStyle = 'yellow';
        }
        this.context.lineWidth = 3;
        this.context.fillStyle = 'rgb(235,235,235)';

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
        const gap = this.stateRadius + 1;
        const arrowAngle = 0.13;
        const arrowLength = 37;
        const loopp = this.stateRadius + 10;
        const loopr = this.stateRadius/1.3;

        for(let sid in state.transitions) {
            if(sid == state.id) {
                // state has transition into itself

                this.context.beginPath();
                this.context.strokeStyle = 'rgb(15,15,15)';
                this.context.fillStyle = 'rgb(235,235,235)';
                this.context.font = 'bold 18px Arial';
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.lineWidth = 2;

                // Arrow body
                this.context.arc(state.x, state.y - loopp, loopr, 0, 2 * Math.PI);

                this.context.stroke();
                this.context.fillText(state.transitions[state.id].join(','),
                    state.x, state.y - loopp - loopr);

            } else {
                const tstate = this.FSM.states[Number.parseInt(sid)];

                this.context.beginPath();
                this.context.strokeStyle = 'rgb(15,15,15)';
                this.context.fillStyle = 'rgb(235,235,235)';
                this.context.font = 'bold 18px Arial';
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.lineWidth = 2;
                
                let vx = tstate.x - state.x;
                let vy = tstate.y - state.y;
                let vlenght = Math.sqrt(vx*vx + vy*vy);
                vx = vx / vlenght;
                vy = vy / vlenght;

                let vx2 = Math.cos(arrowAngle)*vx - Math.sin(arrowAngle)*vy;
                let vy2 = Math.sin(arrowAngle)*vx + Math.cos(arrowAngle)*vy;

                let vx3 = Math.cos(-arrowAngle)*vx - Math.sin(-arrowAngle)*vy;
                let vy3 = Math.sin(-arrowAngle)*vx + Math.cos(-arrowAngle)*vy;

                //Arrow body
                this.context.moveTo(state.x + vx*gap, state.y + vy*gap);
                this.context.lineTo(tstate.x - vx*gap, tstate.y - vy*gap);

                // Arrow head
                this.context.lineTo(tstate.x - vx2*arrowLength, tstate.y - vy2*arrowLength);
                this.context.moveTo(tstate.x - vx*gap, tstate.y - vy*gap);
                this.context.lineTo(tstate.x - vx3*arrowLength, tstate.y - vy3*arrowLength);

                this.context.stroke();
                
                this.context.fillText(state.transitions[sid].join(', '),
                    (state.x + tstate.x) / 2 - vx*gap,
                    (state.y + tstate.y) / 2 - vy*gap);
            }
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
                    this._dragMouseState(states[i], e);
                } else if(!tooClose) {
                    this.FSM.addState(x,y);
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
                this._dragState(states[i], e);
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

            // console.log(this);

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
        let states = this.FSM.states;
        let optimized = this.canvasOptimizationThreshold.MOBILE < states.length;
        
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
            newPositionY += y- startY;
            
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
}




