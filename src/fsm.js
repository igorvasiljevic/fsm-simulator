export class State {
    constructor(x, y) {
        this.id = null;
        this.transitions = {};
        this.x = x;
        this.y = y;
    }

    equals(state) {
        return this.id === state.id;
    }

    addTransition(stateId, input) {
        console.log(`Add transition from state ${this.id} to ${stateId} for input ${input}`)
        if(this.transitions[stateId]) {
            if(!this.transitions[stateId].includes(input)) {
                this.transitions[stateId].push(input);
                this.transitions[stateId].sort();
            } else console.log("Transition already exists");
        } else this.transitions[stateId] = [input];
    }
}

export class FSM {
    constructor(fsm) {
        if(typeof fsm == "object") {
            this.name = fsm.name;
            this.states = [];
            this.current = fsm.current || [];
            this.final = fsm.final || [];

            fsm.states.forEach(state => {
                const newState = new State(state.x, state.y);
                newState.id = state.id;
                newState.transitions = state.transitions;
                this.states.push(newState);
            });

        } else if(typeof fsm == "string") {
            this.name = fsm;
            this.states = [];
            this.current = [];
            this.final = [];
        } else {
            this.name = null;
            this.states = [];
            this.current = [];
            this.final = [];
        }
    }

    addState(x,y) {
        const state = new State(x,y);
        state.id = this.states.length;
        this.states.push(state);
        if(state.id == 0) this.current.push(0);
    }

    removeState(state) {
        this.states = this.states.filter(function(s) {
            return !s.equals(state);
        });
    }

    addStateTransition(fromState, toState, input) {
        for(let i = 0; i < this.states.length; i++) {
            if(this.states[i].id == fromState) {
                this.states[i].addTransition(toState, input);
                return;
            }
        }
    }

    reset() {
        this.current = (this.states.length == 0) ? [] : [0];
    }

    input(input) {
        const newCurrent = [];
        this.current.forEach(sid => {
            const state = this.states[sid];
            for(let ts in state.transitions) {
                if(state.transitions[ts].includes(input) && !newCurrent.includes(Number.parseInt(ts))) {
                    newCurrent.push(Number.parseInt(ts));
                }
            }
        });
        this.current = newCurrent;
    }

    test(inputString) {
        for(let i = 0; i < inputString.length; i++)
            this.input(inputString[i]);
        return this.valid();
    }

    valid() {
        return this.current.some(state => this.final.includes(state));
    }
}