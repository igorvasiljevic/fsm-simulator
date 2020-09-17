const state_element_template = 
    `<div class="state">
        <svg class="svg no_events" width="54" height="54" xmlns="http://www.w3.org/2000/svg">
            <ellipse class="fill no_events" cx="50%" cy="50%" rx="25" ry="25" stroke-width="4" stroke="black" fill="white"></ellipse>
            <ellipse class="final disabled no_events" cx="50%" cy="50%" rx="20" ry="20" stroke-width="4" stroke="black" fill="none"></ellipse>
        </svg>
        <input type="text" autocomplete="off" spellcheck="false" class="state_text not_selectable no_events" value="S">
    </div>`;

const transition_element_template = 
    `<div class="transition">
        <svg class="svg" width="50" height="26" xmlns="http://www.w3.org/2000/svg">
            <line stroke="#000" x1="0" y1="13" x2="100%" y2="13" stroke-width="2"></line>
            <line stroke="#000" x1="0" y1="13" x2="10" y2="8" stroke-width="2"></line>
            <line stroke="#000" x1="0" y1="13" x2="10" y2="18" stroke-width="2"></line>
        </svg>
        <input type="text" autocomplete="off" spellcheck="false" class="transition_text not_selectable no_events">
    </div>`;

const loop_element_template =
    `<div class="transition">
        <svg class="svg" width="44" height="50" xmlns="http://www.w3.org/2000/svg">           
            <ellipse stroke="#000" stroke-width="2" cx="50%" cy="28" rx="19" ry="19" fill="none"></ellipse>
            <line stroke="#000" x1="36" y1="31" x2="35" y2="43.5" stroke-width="2" fill="none"></line>
            <line stroke="#000" x1="45" y1="36" x2="34.5" y2="43.5" stroke-width="2" fill="none"></line>
        </svg>
        <input type="text" autocomplete="off" spellcheck="false" class="loop_text transition_text not_selectable no_events">
    </div>`;

class FSMCanvas {
    constructor(frame) {
        this.frame = frame;
        this.canvas = frame.getElementsByClassName("fsm_canvas")[0];

        this.state_element_template = stringToHTMLElement(state_element_template)
        this.transition_element_template = stringToHTMLElement(transition_element_template)
        this.loop_element_template = stringToHTMLElement(loop_element_template)

        this.string_input_index = -1;

        // bug fix using bottom bar fixed
        if(this.frame.style.height === "100%") {
            this.frame.style.position = "absolute";
            this.frame.getElementsByClassName("bottom_bar")[0].style.position = "fixed";
        }


        // canvas centering
        this.canvas.style.left = `${(this.frame.clientWidth - this.canvas.clientWidth)/2}px`;
        this.canvas.style.top = `${(this.frame.clientHeight - this.canvas.clientHeight)/2}px`;
        this.canvasWidth = this.canvas.clientWidth;
        this.clientHeight = this.canvas.clientHeight;
        window.onresize = e => {
            this.canvas.style.left = `${(this.frame.clientWidth - this.canvas.clientWidth)/2}px`;
            this.canvas.style.top = `${(this.frame.clientHeight - this.canvas.clientHeight)/2}px`;

            // if(this.fsm)
            //     for(let state of this.fsm.states) {
            //         state.x -= this.canvasWidth/2;
            //         state.y -= this.clientHeight/2;
            //     }

            this.canvasWidth = this.canvas.clientWidth;
            this.clientHeight = this.canvas.clientHeight;
            this.repositionStates();
            this.repositionTransitions();
        }
        // canvas movement
        this.canvas.onmousedown = e => {
            this.canvas.onmousemove = e => {
                e.preventDefault();
                this.mouseMove(this.canvas, e);
            }

            this.canvas.onmouseup = e => {
                this.canvas.onmousemove = null;
                this.canvas.onmouseup = null;
                this.fsm.addState().setPosition(e.layerX - this.canvas.clientWidth / 2, e.layerY - this.canvas.clientHeight / 2);
                this.draw();
            }
        }
        this.canvas.ontouchstart = e => {
            this.oldX = e.targetTouches[0].clientX;
            this.oldY = e.targetTouches[0].clientY;

            this.canvas.ontouchmove = e => {
                e.preventDefault();
                this.touchMove(this.canvas, e);
            }
        }

        
        // tools
        let toolbar = this.frame.getElementsByClassName("toolbar")[0];
        this.frame.getElementsByClassName("toggle_toolbar")[0].onmousedown = e => {
            if(toolbar.classList.contains("toolbar_show")) {
                toolbar.classList.remove("toolbar_show");
                if(this.tool)
                        toolbar.querySelector(`#${this.tool}`).classList.remove("tool_selected");
                delete this.tool;
            } else {
                toolbar.classList.add("toolbar_show");
            }
        }
        for(let tool of toolbar.children) {
            tool.onmousedown = e => {
                delete this.from_state_selected;

                if(this.tool === tool.id) {
                    delete this.tool;
                    tool.classList.remove("tool_selected");
                } else {
                    if(this.tool)
                        toolbar.querySelector(`#${this.tool}`).classList.remove("tool_selected");
                    this.tool = tool.id;
                    tool.classList.add("tool_selected");
                }
            }
        }

        this.stateClicked = id => {
            if(this.tool)
                this.reset();

            if(this.tool === "delete") {
                this.fsm.removeState(id);
                this.draw();
            } else if(this.tool === "initial") {
                this.fsm.initial_state = id;
                this.draw();
            } else if(this.tool === "final") {
                let state = this.fsm.getState(id);
                state.setFinal(!state.final);
                this.draw();
            } else if(this.tool === "transition") {
                let state_element = this.getState(id);

                if(this.from_state_selected) {
                    let from = this.fsm.getState(this.from_state_selected);
                    
                    state_element.ondblclick = () => {
                        state_text.focus();
                        state_text.setSelectionRange(0, state_text.value.length);
                    }

                    if(!from.transitions[id]) {
                        from.addTransition(id, "");
                        this.draw();
                    }
                        
                    for(let transition_element of this.canvas.getElementsByClassName("transition")) {
                        if(transition_element.from_id === this.from_state_selected && transition_element.to_id === id) {
                            let transition_text = transition_element.getElementsByClassName("transition_text")[0];
                            transition_text.focus();
                        }
                    }
    
                    delete this.from_state_selected;
                } else {
                    this.from_state_selected = id;
                    state_element.getElementsByClassName("fill")[0].classList.add("state_selected");
                    state_element.ondblclick = null;
                }
            }

        }

        this.transition_clicked = (from_id, to_id) => {
            if(this.tool === "delete") {
                this.fsm.getState(from_id).removeTransition(to_id);
                this.draw();
            }
        }


        // fsm string
        this.fsm_string = this.frame.getElementsByClassName("fsm_string")[0];
        this.fake_fsm_string = this.frame.getElementsByClassName("fsm_string")[1];
        this.fake_fsm_string.innerText = this.fsm_string.value;
        this.fake_fsm_string.title = this.fsm_string.value;
        this.fsm_string.onkeydown = e => {
            if(e.key === "Enter" || e.keyCode === 13)
                this.fsm_string.blur();
        }
        this.fsm_string.onblur = () => {
            this.fake_fsm_string.innerText = this.fsm_string.value;
            this.fake_fsm_string.title = this.fsm_string.value;
            this.fake_fsm_string.classList.remove("disabled");
        }
        this.fsm_string.onchange = () => {
            this.reset();
        }
        this.fake_fsm_string.onmousedown = e => {
            e.preventDefault();
            this.fake_fsm_string.classList.add("disabled");
            this.fsm_string.focus();
        }

        // step and run
        this.frame.getElementsByClassName("step")[0].onmousedown = e => { this.step() }
        this.frame.getElementsByClassName("run")[0].onmousedown = e => { this.run() }
    }

    setFSM(fsm) {
        this.fsm = fsm;
    }

    setString(string) {
        this.fsm_string.value = string;
        this.fsm_string.onchange();
    }

    step() {
        if(this.string_input_index < 0)
            this.highlightCurrentStates([]);
        

        let symbol = this.fsm_string.value[this.string_input_index];
        this.current_states = this.fsm.transition(symbol, this.current_states);
        this.highlightCurrentStates(this.current_states);

        this.string_input_index++;
        if(this.string_input_index >= this.fsm_string.value.length) {
            this.highlightFinal(this.current_states);
            this.string_input_index = -1;
            delete this.current_states;
        }
        this.stylizeInputString();
    }

    run() {
        let symbols = this.fsm_string.value.slice(this.string_input_index < 0 ? 0 : this.string_input_index);
        symbols = symbols.split("");

        this.current_states = this.fsm.test(symbols, this.current_states);

        let current_states = this.current_states;
        this.reset();
        this.highlightFinal(current_states);
    }

    getState(id) {
        for(let state of this.canvas.getElementsByClassName("state"))
            if(state.id === id)
                return state;
    }

    highlightCurrentStates(current_states) {
        for(let state of this.fsm.states) {
            if(current_states.includes(state.id))
                this.getState(state.id).getElementsByClassName("fill")[0].classList.add("state_current");
            else
                this.getState(state.id).getElementsByClassName("fill")[0].classList.remove("state_current", "state_accepted", "state_not_accepted");
        }
    }

    highlightFinal(current_states) {
        let accepted = this.fsm.accepted(current_states);

        for(let state of this.fsm.states) {
            if(current_states.includes(state.id)) {
                if(state.final)
                    this.getState(state.id).getElementsByClassName("fill")[0].classList.add("state_accepted");
                else if(!accepted)
                    this.getState(state.id).getElementsByClassName("fill")[0].classList.add("state_not_accepted");
                else
                    this.getState(state.id).getElementsByClassName("fill")[0].classList.add("state_current");
            }
        }
    }

    centerStates() {
        for(let state of this.fsm.states) {            
            state.x += this.canvas.clientWidth / 2;
            state.y += this.canvas.clientHeight / 2;
        }
    }

    mouseMove(element, e) {
        function stop(e) {
            element.onmousemove = null;
            element.onmouseup = null;
            element.onmouseout = null;
        }

        element.onmouseup = stop;
        element.onmouseout = stop;

        this.setPosition(element, element.offsetLeft + e.movementX, element.offsetTop + e.movementY);
    }

    touchMove(element, e) {
        function stop(e) {
            element.ontouchmove = null;
            element.ontouchend = null;
            element.ontouchcancel = null;
        }

        element.ontouchend = stop;
        element.ontouchcancel = stop;

        let x = e.targetTouches[0].clientX - this.oldX;
        let y = e.targetTouches[0].clientY - this.oldY;
        this.oldX = e.targetTouches[0].clientX;
        this.oldY = e.targetTouches[0].clientY;

        this.setPosition(element, element.offsetLeft + x, element.offsetTop + y);
    }

    setPosition(element, x, y) {
        x = element.clientWidth > element.parentElement.clientWidth ? 
            clamp(x, element.parentElement.clientWidth - element.clientWidth, 0) :
            clamp(x, 0, element.parentElement.clientWidth - element.clientWidth);

        y = element.clientHeight > element.parentElement.clientHeight ? 
            clamp(y, element.parentElement.clientHeight - element.clientHeight, 0) :
            clamp(y, 0, element.parentElement.clientHeight - element.clientHeight);
        

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }

    draw() {
        if(!this.fsm) return;
        this.canvas.innerHTML = "";

        this.drawStates();
        this.drawTransitions();
    }

    drawStates() {
        // draw states
        for(let state of this.fsm.states) {
            // create state element
            let state_element = this.state_element_template.cloneNode(true);
            let state_text = state_element.getElementsByClassName("state_text")[0];
            this.canvas.appendChild(state_element);

            state_element.id = state.id;
            state_text.value = state.name;

            if(state.final)
                state_element.getElementsByClassName("final")[0].classList.remove("disabled");
            if(state.id === this.fsm.initial_state)
                this.drawArrowInto(state);

            state_element.style.left = `${state.x + (this.canvas.clientWidth - state_element.clientWidth)/2}px`;
            state_element.style.top = `${state.y + (this.canvas.clientHeight - state_element.clientHeight)/2}px`;

            // state movement
            state_element.onmousedown = e => {
                e.stopPropagation();

                state_element.onmousemove = e => {
                    e.preventDefault();
                    this.mouseMove(state_element, e);

                    state.x = state_element.offsetLeft - (this.canvas.clientWidth - state_element.clientWidth)/2;
                    state.y = state_element.offsetTop - (this.canvas.clientHeight - state_element.clientHeight)/2;
                    this.repositionTransitions();
                }

                state_element.onmouseup = e => {
                    e.stopPropagation();
                    state_element.onmousemove = null;
                    state_element.onmouseup = null;
                    this.stateClicked(state.id);
                }
            }
            state_element.ontouchstart = e => {
                this.oldX = e.targetTouches[0].clientX;
                this.oldY = e.targetTouches[0].clientY;

                state_element.ontouchmove = e => {
                    e.preventDefault();
                    this.touchMove(state_element, e);

                    state.x = state_element.offsetLeft - (this.canvas.clientWidth - state_element.clientWidth)/2;
                    state.y = state_element.offsetTop - (this.canvas.clientHeight - state_element.clientHeight)/2;
                    this.repositionTransitions();
                }
            }

            // state text edit
            state_element.ondblclick = e => {
                state_text.focus();
                state_text.setSelectionRange(0, state_text.value.length);
            }
            state_text.onkeydown = e => {
                if(e.key === "Enter" || e.keyCode === 13)
                    state_text.blur();
            }
            state_text.onblur = () => {
                state_text.value ?
                    state.name = state_text.value :
                    state_text.value = state.name;
            }
        }
    }

    repositionStates() {
        for(let state_element of this.canvas.getElementsByClassName("state")) {
            let state = this.fsm.getState(state_element.id);

            state_element.style.left = `${state.x + (this.canvas.clientWidth - state_element.clientWidth)/2}px`;
            state_element.style.top = `${state.y + (this.canvas.clientHeight - state_element.clientHeight)/2}px`;
        }
    }

    drawTransitions() {
        for(let state_element of this.canvas.getElementsByClassName("state")) {
            let from = this.fsm.getState(state_element.id);

            for(let transition in from.transitions) {
                let to = this.fsm.getState(transition);

                let transition_element;
                let transition_text;
                let svg;

                if(!from || !to) {
                    continue;
                } else if(from.id === to.id) {
                    transition_element = this.loop_element_template.cloneNode(true);
                    transition_text = transition_element.getElementsByClassName("transition_text")[0];
                    svg = transition_element.getElementsByClassName("svg")[0];
                    this.canvas.appendChild(transition_element);

                    transition_element.from_id = from.id;
                    transition_element.to_id = to.id;

                    transition_text.value = from.transitions[transition].join(",");
                    
                    // position
                    transition_element.style.left = `${from.x + (this.canvas.clientWidth - transition_element.clientWidth)/2}px`;
                    transition_element.style.top = `${from.y - 40 + (this.canvas.clientHeight - transition_element.clientHeight)/2}px`;
                } else {
                    // create transition element
                    transition_element = this.transition_element_template.cloneNode(true);
                    transition_text = transition_element.getElementsByClassName("transition_text")[0];
                    svg = transition_element.getElementsByClassName("svg")[0];
                    this.canvas.appendChild(transition_element);

                    transition_element.from_id = from.id;
                    transition_element.to_id = to.id;
                    let x1 = from.x;
                    let y1 = from.y;
                    let x2 = to.x;
                    let y2 = to.y;

                    transition_text.value = from.transitions[transition].join(",");

                    // set length
                    let length = distance(x1, y1, x2, y2) - state_element.clientWidth;
                    svg.style.width = length;

                    // position
                    transition_element.style.left = `${(x1 + x2 + this.canvas.clientWidth - transition_element.clientWidth)/2}px`;
                    transition_element.style.top = `${(y1 + y2 + this.canvas.clientHeight - transition_element.clientHeight)/2}px`;

                    // rotate
                    let angle = Math.atan2(y1 - y2, x1 - x2);
                    svg.style.transform = `rotate(${angle}rad)`;
                    

                    
                }

                // transition text edit
                svg.onmousedown = e => {
                    e.stopPropagation();

                    svg.onmouseup = e => {
                        this.transition_clicked(from.id, to.id);
                    }
                }
                svg.ondblclick = e => {
                    transition_text.focus();
                    transition_text.setSelectionRange(0, transition_text.value.length);
                }
                transition_text.onkeydown = e => {
                    if(e.key === "Enter" || e.keyCode === 13)
                        transition_text.blur();
                }
                transition_text.onblur = () => {
                    if(transition_text.value) {
                        from.transitions[transition] = transition_text.value.split(",").filter(s => { return s });
                    } else if(from.transitions[transition].join()) {
                        transition_text.value = from.transitions[transition].join(",");
                    } else {
                        delete from.transitions[transition];
                        transition_element.remove();
                    }
                }


            }
        }
    }

    repositionTransitions() {
        for(let transition_element of this.canvas.getElementsByClassName("transition")) {
            let from = this.fsm.getState(transition_element.from_id);
            let to = this.fsm.getState(transition_element.to_id);
            let from_state_element = this.getState(transition_element.from_id);

            if(!from){
                // initial
                transition_element.style.left = `${to.x - 50 + (this.canvas.clientWidth - transition_element.clientWidth)/2}px`;
                transition_element.style.top = `${to.y + (this.canvas.clientHeight - transition_element.clientHeight)/2}px`;
            } else if(from.id === to.id) {
                // loop
                transition_element.style.left = `${from.x + (this.canvas.clientWidth - transition_element.clientWidth)/2}px`;
                transition_element.style.top = `${from.y - 40 + (this.canvas.clientHeight - transition_element.clientHeight)/2}px`;
            } else {
                let x1 = from.x;
                let y1 = from.y;
                let x2 = to.x;
                let y2 = to.y;

                let svg = transition_element.getElementsByClassName("svg")[0];

                // set length
                let length = distance(x1, y1, x2, y2) - from_state_element.clientWidth;
                svg.style.width = length;

                // center
                transition_element.style.left = `${(x1 + x2 + this.canvas.clientWidth - transition_element.clientWidth)/2}px`;
                transition_element.style.top = `${(y1 + y2 + this.canvas.clientHeight - transition_element.clientHeight)/2}px`;

                // rotate
                let angle = Math.atan2(y1 - y2, x1 - x2);
                svg.style.transform = `rotate(${angle}rad)`;
            }

               
        }
    }

    drawArrowInto(state) {
        let transition_element = this.transition_element_template.cloneNode(true);
        let svg = transition_element.getElementsByClassName("svg")[0];
        this.canvas.appendChild(transition_element);

        transition_element.to_id = state.id;

        svg.style.width = 100 - this.getState(state.id).clientWidth;
        transition_element.style.left = `${state.x - 50 + (this.canvas.clientWidth - transition_element.clientWidth)/2}px`;
        transition_element.style.top = `${state.y + (this.canvas.clientHeight - transition_element.clientHeight)/2}px`;
        svg.style.transform = `rotate(${Math.PI}rad)`;

        svg.onmousedown = e => { e.stopPropagation() }
    }

    stylizeInputString() {
        let string = this.fsm_string.value;

        if(this.string_input_index < 0 || this.string_input_index >= string) {
            this.fake_fsm_string.innerText = string;
            return;
        }

        this.fake_fsm_string.innerHTML = string.slice(0, this.string_input_index)
            + `<span class="inputSelected">${string[this.string_input_index]}</span>`
            + string.slice(this.string_input_index + 1, string.length);

        this.fake_fsm_string.scrollLeft = (this.string_input_index - 20) * ((this.fake_fsm_string.scrollWidth) / string.length) ;
    }

    reset() {
        delete this.current_states;
        this.string_input_index = -1;
        this.stylizeInputString();
        this.draw();
    }
}