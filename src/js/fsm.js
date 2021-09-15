
import { epsilon } from './constants.js'

export const FSMType = {
    DFA  : 0,
    NFA  : 1,
    eNFA : 2
}

export class FSM {
    constructor({
        type,
        states,
        // alphabet,
        initial_state,
        final_states,
        transitions,

        state_info,
        string
    } = {}) {
        this.type = type ?? FSMType.DFA;
        this.states = new Set(states);
        // this.alphabet = new Set(alphabet);
        this.initial_state = initial_state ?? 0;
        this.final_states = new Set(final_states);
        this.transitions = {};

        this.states.add(this.initial_state);
        for(let from_state in transitions ?? {})
            for(let symbol in transitions[from_state] ?? {})
                for(let to_state of transitions[from_state][symbol] ?? [])
                    this.add_transition(from_state, to_state, symbol);
 
        this.state_info = state_info;
        this.string = string;
    }

    get_next_id() {
        let id = 0;
        while(this.states.has(id))
            ++id;
        return id;
    }

    add_state(state) {
        this.states.add(state);
        this.transitions[state] = {};
    }

    remove_state(state) {
        if(state === this.initial_state)
            return false;

        this.final_states.delete(state);

        delete this.transitions[state];
        for(let from_state in this.transitions)
            this.remove_transition(from_state, state);
        
        return this.states.delete(state);
    }

    add_transition(from_state, to_state, symbol) {
        if(symbol === epsilon && this.type !== FSMType.eNFA)
            return;

        if(!this.transitions[from_state])
            this.transitions[from_state] = {};

        if(!this.transitions[from_state][symbol])
            this.transitions[from_state][symbol] = new Set();

        // DFA only allows transition into one state for a symbol
        if(this.type === FSMType.DFA)
            this.transitions[from_state][symbol].clear();

        this.transitions[from_state][symbol].add(to_state);

        // return this.transitions[from_state][symbol].size > 0
    }

    remove_transition(from_state, to_state) {
        for(let symbol in this.transitions[from_state]) {
            this.transitions[from_state][symbol]?.delete?.(to_state);
            if(this.transitions[from_state][symbol]?.size === 0)
                delete this.transitions[from_state][symbol];
        }
    }

    epsilon_transition(states) {
        let old_size = states;
        let new_size;
        while(old_size !== new_size) {
            old_size = states.size;
            
            let old_states = states;
            for(let state of old_states)
                if(this.transitions[state] && this.transitions[state][epsilon])
                    for(let new_state of this.transitions[state][epsilon])
                        states.add(new_state);

            new_size = states.size;
        }

        return states;
    }

    start() {
        return this.type === FSMType.eNFA ?
            [...this.epsilon_transition(new Set([this.initial_state]))] :
            [this.initial_state];
    }

    transition(state, symbol) {
        let states = this.transitions?.[state]?.[symbol];
        
        if(!states) return [];

        if(this.type === FSMType.eDFA)
            states = this.epsilon_transition(states);

        return [...states];        
    }

    transition_states(states, symbol) {
        const new_states = new Set();

        for(let state of states)
            for(let new_state of this.transition(state, symbol))
                new_states.add(new_state);
        
        return [...new_states];
    }

    // run(string) {
    //     let states = this.start();

    //     for(let symbol of string)
    //         states = this.transition_states(states, symbol);

    //     return states;
    // }

    // accepted(states) {
    //     for(let state of states)
    //         if(this.final_states.has(state))
    //             return true;
    //     return false;
    // }

    // test(string) {
    //     return this.accepted(this.run(string));
    // }

    toJSON() {
        let transitions = this.transitions;
        for(let state in transitions)
            for(let symbol in transitions[state])
                transitions[state][symbol] = [...transitions[state][symbol]];

        return {
            states        : [...this.states],
            initial_state : this.initial_state,
            final_states  : [...this.final_states],
            transitions   : this.transitions,
            type          : this.type,
            state_info    : this.state_info,
            string        : this.string
        }
    }
}