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
        this.name = fsm ? fsm.name : null;
        this.states = fsm ? fsm.states : [];
    }

    addState(state) {
        state.id = this.states.length;
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