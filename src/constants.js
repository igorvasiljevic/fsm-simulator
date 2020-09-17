

const EPSILON = "$";

const TutorialFSMS = {
    "first": {
        "initial_state": 0,
        "next_state_id": 1,
        "states": [
            {
                "id": "0",
                "name": "S",
                "transitions": {},
                "final": false,
                "x": 0,
                "y": 0
            }
        ]
    },
    "second": {
        "initial_state": 0,
        "next_state_id": 2,
        "states": [
            {
                "id": "0",
                "name": "S",
                "transitions": {
                    "1": ["a"],
                },
                "final": false,
                "x": -80,
                "y": 0
            },
            {
                "id": "1",
                "name": "X",
                "transitions": {
                },
                "final": false,
                "x": 80,
                "y": 0
            }
        ]
    },
    "third": {
        "initial_state": 0,
        "next_state_id": 4,
        "states": [
            {
                "id": "0",
                "name": "S",
                "transitions": {
                    "0": ["c"],
                    "1": ["a"],
                    "2": ["b"]
                },
                "final": false,
                "x": -85,
                "y": 0
            },
            {
                "id": "1",
                "name": "X",
                "transitions": {
                    "1": ["a","c"],
                    "2": ["a"]
                },
                "final": false,
                "x": 0,
                "y": -100
            },
            {
                "id": "2",
                "name": "Y",
                "transitions": {
                    "2": ["c"],
                    "3": ["b","$"]
                },
                "final": false,
                "x": 100,
                "y": 0
            },
            {
                "id": "3",
                "name": "Z",
                "transitions": {
                    "3": ["b","c"],
                },
                "final": true,
                "x": 0,
                "y": 100
            }
        ]
    }
    
}