class State {
    constructor(x, y) {
        this.id = null;
        this.connections = [];
        this.x = x;
        this.y = y;
    }

    equals(state) {
        return this.id === state.id;
    }

    addConnection(state) {
        this.connections.push(state.id);
    }
}

class FSM {
    constructor(fsm) {
        if(typeof fsm == "object") {
            this.name = fsm.name;
            this.states = fsm.states || [];
        } else if(typeof fsm == "string") {
            this.name = fsm;
            this.states = [];
        } else {
            this.name = null;
            this.states = [];
        }
    }

    addState(state) {
        state.id = this.states.length+1;
        this.states.push(state);
    }

    removeState(state) {
        this.states = this.states.filter(function(s) {
            return !s.equals(state);
        });
    }

    addStateConnection(fromState, toState) {
        fromState.addConnection(toState);
    }
}