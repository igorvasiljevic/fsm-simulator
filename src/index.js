import { loadTheme } from './js/theme.js';
import register_sw from './js/register_sw.js';

import './css/index.css';
loadTheme();

import './components/fsm-header.jsx';
import './components/fsm-footer.jsx';
import './components/fsm-canvas.jsx';
import './components/fsm-simulator.jsx';

window.onload = register_sw;