

const Examples = {
    First: {
        states        : [0],
        initial_state : 0,
        final_states  : [],
        transitions   : {},
        type          : 0,
        state_info    : {
            0: { name:'q0', x:0, y:0 }
        },
        string        : 'first'
    },
    Second: {
        states        : [0, 1],
        initial_state : 0,
        final_states  : [1],
        transitions   : {},
        type          : 1,
        state_info    : {
            0: { name:'q0', x:-50, y:-50 },
            1: { name:'q1', x: 50, y: 50 }
        },
        string        : 'second'
    },
    Third: {
        states        : [1, 2, 3],
        initial_state : 1,
        final_states  : [2, 3],
        transitions   : {},
        type          : 2,
        state_info    : {
            1: { name:'q1', x:-50, y:-50 },
            2: { name:'q2', x: 50, y:-50 },
            3: { name:'q3', x: 50, y: 50 }
        },
        string        : 'third'
    },
    Fourth: {
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
                c: [2],
                b: [3],
                $: [3]
            },
            3: {
                b: [3],
                c: [3]
            }
        },
        type          : 1,
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