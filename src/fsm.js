


class State {
    constructor(id) {
        this.id = id.toString();
        this.name = this.id;
        this.transitions = {};
        this.final = false;
        this.x = 0;
        this.y = 0;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setTransitions(transitions) {
        this.transitions = transitions;
        return this;
    }

    setFinal(final) {
        this.final = final;
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    addTransition(id, symbol) {
        this.transitions[id] ?
            this.transitions[id].push(symbol) :
            this.transitions[id] = [symbol];
    }

    removeTransition(id) {
        delete this.transitions[id];
    }
}

class FSM {
    constructor(fsm) {
        if(fsm) {
            this.next_state_id = fsm.next_state_id;
            this.initial_state = fsm.initial_state.toString();
            
            this.states = [];
            for(let state_object of fsm.states)
                this.states.push(new State(state_object.id)
                    .setName(state_object.name)
                    .setTransitions(state_object.transitions)
                    .setFinal(state_object.final)
                    .setPosition(state_object.x, state_object.y)
                );
        } else {
            this.next_state_id = 0;
            this.initial_state = this.next_state_id.toString();

            this.states = [new State(this.next_state_id).setName("S")];

            ++this.next_state_id;
        }
    }

    getState(id) {
        for(let state of this.states)
            if(state.id === id)
                return state;
    }

    addState() {
        let state = new State(this.next_state_id++);
        this.states.push(state);
        return state;
    }

    removeState(id) {
        if(id == this.initial_state)
            return;

        for(let i in this.states)
            delete this.states[i].transitions[id];

        for(let i in this.states)
            if(this.states[i].id === id)
                this.states.splice(i, 1);
    }

    transition(symbol, current_states) {
        let new_current_states = [];

        if(!current_states) {
            current_states = [this.initial_state];
            new_current_states = current_states;
        }

        for(let state_id of current_states) {
            let state = this.getState(state_id);

            for(let transition_state_id in state.transitions) {
                if(!new_current_states.includes(transition_state_id) && state.transitions[transition_state_id].includes(symbol))
                    new_current_states.push(transition_state_id);

                // epsilon transition
                for(let new_current_state_id of new_current_states) {
                    let new_current_state = this.getState(new_current_state_id);

                    for(let new_transition_state_id in new_current_state.transitions)
                        if(!new_current_states.includes(new_transition_state_id) && new_current_state.transitions[new_transition_state_id].includes(EPSILON))
                            new_current_states.push(new_transition_state_id);
                }

            }
        }

        return new_current_states;
    }

    test(array, current_states) {
        if(!current_states)
            current_states = this.transition("", current_states);

        for(let symbol of array)
            current_states = this.transition(symbol, current_states);

        return current_states;
    }

    accepted(current_states) {
        for(let state of current_states)
            if(this.getState(state).final)
                return true;

        return false;
    }
}