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
        if(this.transitions[stateId]) {
            if(!this.transitions[stateId].includes(input)) {
                this.transitions[stateId].push(input);
                this.transitions[stateId].sort();
            }
        } else this.transitions[stateId] = [input];
    }
}

export class FSM {
    constructor(fsm) {
        this.states = [];
        this.current = [];
        this.final = [];
        this._currentId = -1;

        if(typeof fsm == "object") {
            this.name = fsm.name;
            this.initial = fsm.initial;
            this.final = fsm.final || [];
            
            
            fsm.states.forEach(state => {
                const newState = new State(state.x, state.y);
                newState.id = state.id;
                if(state.id > this._currentId)
                    this._currentId = Number.parseInt(state.id);
                newState.transitions = state.transitions || {};
                this.states.push(newState);
            });
        } else if(typeof fsm == "string") {
            this.name = fsm;
        } else {
            this.name = null;
        }
    }

    toFile() {
        return JSON.stringify(this, (k,v) => {
            switch(k) {
                case 'name': case 'current': case '_currentId': return undefined;
                case 'transitions': return Object.keys(v).length ? v : undefined;
                default: return v
            }
        })
    }

    getState(stateId) {
        for(let i = 0; i < this.states.length; i++)
            if(this.states[i].id == stateId)
                return this.states[i];
        return null;
    }

    addState(x,y) {
        const state = new State(x,y);
        state.id = ++this._currentId;
        if(this.states.length == 0) this.initial = state.id;
        this.states.push(state);
        return state;
    }

    removeState(stateId) {
        this.states = this.states.filter(s => { return s.id != stateId });
        this.final = this.final.filter(s => { return s.id != stateId });
        for(let i = 0; i < this.states.length; i++)
            delete this.states[i].transitions[stateId];
        if(this.initial == stateId)
            this.initial = this.states.length == 0 ? null : this.states[0].id;
        this.reset();
    }

    addStateTransition(fromStateId, toStateId, input) {
        for(let i = 0; i < this.states.length; i++) {
            if(this.states[i].id == fromStateId) {
                this.states[i].addTransition(toStateId, input);
                return;
            }
        }
    }

    toggleFinal(stateId) {
        let index = this.final.indexOf(stateId);
        if(index < 0) this.final.push(stateId);
        else this.final.splice(index, 1);
    }

    setInitial(stateId) {
        this.initial = stateId;
    }

    reset() {
        this.current = [];
    }

    input(input) {
        if(this.states.length == 0) return;
        
        const newCurrent = [];
        this.current.forEach(sid => {
            const state = this.getState(sid);
            for(let ts in state.transitions) {
                if(state.transitions[ts].includes(input) && !newCurrent.includes(Number.parseInt(ts))) {
                    newCurrent.push(Number.parseInt(ts));
                }
            }
        });
        this.current = newCurrent;
    }

    test(inputString) {
        if(this.states.length == 0) return;
        if(this.current.length == 0) this.current = [this.initial];

        const inputArray = (inputString.indexOf(',') < 0) ?
                                inputString.split('') :
                                inputString.split(',');
        for(let i = 0; i < inputArray.length; i++)
            this.input(inputArray[i]);
        return this.valid();
    }

    valid() {
        return this.current.some(state => this.final.includes(state));
    }
}