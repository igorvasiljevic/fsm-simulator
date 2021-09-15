import { load_theme } from './js/theme.js';
import register_sw from './js/register_sw.js';

import './css/index.css';
load_theme();

import './components/fsm-header.jsx';
import './components/fsm-footer.jsx';
import './components/fsm-state.jsx';
import './components/fsm-transition.jsx';
import './components/fsm-canvas.jsx';
import './components/fsm-simulator.jsx';

window.onload = register_sw;