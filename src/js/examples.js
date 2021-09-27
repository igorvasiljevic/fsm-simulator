

const Examples = {
    'Initial and final': {
        states        : [0, 1],
        initial_state : 0,
        final_states  : [1],
        transitions   : {
            0: {
                a: [1]
            }
        },
        type          : 0,
        state_info    : {
            0: { name:'q0', x:-60, y:0 },
            1: { name:'q1', x: 60, y:0 },
        },
        string        : 'a'
    },
    'Ends in bb': {
        states        : [0, 1, 2],
        initial_state : 0,
        final_states  : [2],
        transitions   : {
            0: {
                a: [0],
                b: [1]
            },
            1: {
                a: [0],
                b: [2]
            },
            2: {
                a: [0],
                b: [2]
            }
        },
        type          : 0,
        state_info    : {
            0: { name:'q0', x:-65, y:-20 },
            1: { name:'q1', x:  0, y: 70 },
            2: { name:'q2', x: 65, y:-20 }
        },
        string        : 'aababaabb'
    },
    'Nondeterministic transition': {
        states        : [0, 1, 2],
        initial_state : 0,
        final_states  : [],
        transitions   : {
            0: {
                a: [1, 2]
            }
        },
        type          : 1,
        state_info    : {
            0: { name:'q0', x:-65, y:  0 },
            1: { name:'q1', x: 65, y:-50 },
            2: { name:'q2', x: 65, y: 50 }
        },
        string        : 'aa'
    },
    'Epsilon transition': {
        states        : [0, 1, 2, 3, 4],
        initial_state : 0,
        final_states  : [3, 4],
        transitions   : {
            0: {
                a: [1]
            },
            1: {
                $: [2],
                b: [3]
            },
            2: {
                c: [4]
            }
        },
        type          : 2,
        state_info    : {
            0: { name:'q0', x:-95,  y:-30 },
            1: { name:'q1', x:  0,  y:-30 },
            2: { name:'q2', x:  0,  y: 70 },
            3: { name:'q3', x: 95,  y:-30 },
            4: { name:'q4', x: 95,  y: 70 },
        },
        string        : 'ad'
    },
    Fifth: {
        states        : [0, 1, 2, 3],
        initial_state : 0,
        final_states  : [3],
        transitions   : {
            0: {
                c: [0],
                a: [1],
                b: [2]
            },
            1: {
                a: [1,2],
                c: [1]
            },
            2: {
                a: [1],
                c: [2],
                b: [3],
                $: [3]
            },
            3: {
                b: [3],
                c: [3]
            }
        },
        type          : 2,
        state_info    : {
            0: { name:'q0', x:-110,  y:   0 },
            1: { name:'q1', x:   0,  y:-110 },
            2: { name:'q2', x: 110,  y:   0 },
            3: { name:'q3', x:   0,  y: 110 }
        },
        string        : 'ccaccaccbccbcc'
    }
}

export default Examples;