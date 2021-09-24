import register_sw from './js/register_sw.js';
register_sw();

import { load_theme } from './js/theme.js';
// import { load_language } from './js/language.js';

import './css/index.css';

load_theme();
// load_language();

import './components/fsm-header.jsx';
import './components/fsm-footer.jsx';
import './components/fsm-state.jsx';
import './components/fsm-transition.jsx';
import './components/fsm-canvas.jsx';
import './components/fsm-simulator.jsx';