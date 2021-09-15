import { __jsx, __jsx_fragment } from '../js/jsx.js';
import Data from '../js/data.js';
import { window_center } from '../js/util.js';
import { panzoom } from '../js/events.js';

import { FSM, FSMType } from '../js/fsm.js';
import Examples from '../js/examples.js';

import { notify } from './fsm-notify.jsx';

import './fsm-string.jsx';

import '../css/fsm-canvas.css';

import svg_run from '../res/run.svg';
import svg_stop from '../res/stop.svg';
import svg_step from '../res/step.svg';
import svg_fast from '../res/fast.svg';

import svg_delete from '../res/delete.svg';
import svg_initial from '../res/initial.svg';
import svg_final from '../res/final.svg';
import svg_transition from '../res/transition.svg';

import svg_fullscreen from '../res/fullscreen.svg';
import svg_fullscreen_exit from '../res/fullscreen-exit.svg';


export class FSMCanvas extends HTMLElement {
	connectedCallback() {

		let current_states = [];
		let highlight = 0;
		let transition_from_state = null;
		let step_timeout;

		const example = this.getAttribute('example');

		const canvas = <div class='fsm-canvas'/>;

		const zoom = <button type='button' class='pill' onclick={() => this._reset()}/>;
		const type = <button type='button' class='pill' onclick={() => this._cycle_type()}/>;

		const run  = <svgl svg={svg_run}/>;
		const stop = <svgl svg={svg_stop}/>;
		const play = (
			<button type='button' class='img-btn' onclick={() => this._toggle_play()}>
				{run}
			</button>
		);

		const fullscreen_enter = <svgl svg={svg_fullscreen}/>;
		const fullscreen_exit = <svgl svg={svg_fullscreen_exit}/>;
		const fullscreen = (
			<button type='button' class='pill' onclick={() => this._toggle_fullscreen()}>
				{fullscreen_enter}
			</button>
		);

		const element = (
			<div class='fsm-container fsm-edit'>
				<div class='pill-container'>
					{ zoom }
					{ !example ? '' :
						<button type='button' class='pill'
							onclick={() => this._set_fsm(new FSM(Examples[example]))}
						>Reset</button>
					}
					{ type }
					{ fullscreen }
				</div>
				<div class='bottombar'>
					<fsm-string/>
					{ play }
					<div class='control-menu'>
						<div class='controls'>
							<button id='step' type='button' class='img-btn'
								onpointerdown={step.bind(this)}
								onpointerup={() => clearTimeout(step_timeout)}
							><svgl svg={svg_step}/></button>
							<button type='button' class='img-btn' onclick={fast.bind(this)}>
								<svgl svg={svg_fast}/>
							</button>
						</div>
					</div>
					<div class='edit-menu'>
						<div class='tools'>
							<button type='button' initial    class='img-btn' onclick={select_tool}><svgl svg={svg_initial}/></button>
							<button type='button' final      class='img-btn' onclick={select_tool}><svgl svg={svg_final}/></button>
							<button type='button' transition class='img-btn' onclick={select_tool}><svgl svg={svg_transition}/></button>
							<button type='button' delete     class='img-btn' onclick={select_tool}><svgl svg={svg_delete}/></button>
						</div>
					</div>
				</div>
				{ canvas }
			</div>
		);
		this.replaceWith(element);

		const string = element.querySelector('.fsm-string');
		const controls = [...element.querySelector('.controls').querySelectorAll('button')];
		const tools = [...element.querySelector('.tools').querySelectorAll('button')];
		
		function highlight_current_states() {
			canvas.querySelectorAll('.state').forEach(state => {
				current_states.includes(state._id) ?
					state.classList.add('current') :
					state.classList.remove('current', 'accepted', 'rejected');
			});
		}

		function highlight_accepted_states() {			
			const current_final_states = canvas.querySelectorAll('.state.current.final');

			if(current_final_states.length) {
				current_final_states.forEach(state =>
					state.classList.add('accepted')
				);
				notify('<span style="color:var(--state-bg-color-accepted)">String accepted</span>');
			} else {
				canvas.querySelectorAll('.state.current').forEach(state =>
					state.classList.add('rejected')
				);
				notify('<span style="color:var(--state-bg-color-rejected)">String not accepted</span>');
			}
		}

		function step(e) {
			if(highlight >= string._get_value().length) return;

			current_states = this.fsm.transition_states(current_states, string._get_value()[highlight]);
			string._highlight(++highlight);
			highlight_current_states();
			if(highlight === string._get_value().length) {
				highlight_accepted_states();
				controls.at(-1).style = 'transform: rotate(180deg)';
			}
			
			step_timeout = setTimeout(step.bind(this), e ? 300 : 35);
		}

		function fast(e) {
			if(highlight >= string._get_value().length) {
				string._highlight(highlight = 0);
				current_states = this.fsm.start();
				highlight_current_states();
				controls.at(-1).style = '';
				return;
			}

			while(highlight < string._get_value().length)
				current_states = this.fsm.transition_states(current_states, string._get_value()[highlight++]);
			string._highlight(highlight);
			highlight_current_states();
			highlight_accepted_states();
			controls.at(-1).style = 'transform: rotate(180deg)';
		}

		element.addEventListener('fullscreenchange', e => {
			fullscreen.firstChild.replaceWith(document.fullscreenElement ? fullscreen_exit : fullscreen_enter);
		});

		this._toggle_fullscreen = () => {
			if(document.fullscreenElement) {
				document.exitFullscreen?.()
						?.then?.(res => window_center(element));
			} else {
				(
					!document.fullscreenEnabled     ? new Promise((resolve, reject) => reject('Fullscreen not allowed')) :
					element.requestFullscreen       ? element.requestFullscreen() :
					element.webkitRequestFullscreen ? element.webkitRequestFullscreen() :
					element.msRequestFullScreen     ? element.msRequestFullScreen() :
													  new Promise((resolve, reject) => reject('Fullscreen not available'))
				)
				.catch(console.log);
			}
		}

		this._edit_mode = () => {
			controls.forEach(control => control.tabIndex = -1);
			tools.forEach(tool => tool.tabIndex = 0);

			canvas.ondblclick = dbl_click;
			play.firstChild.replaceWith(run);
			string._reset();
			current_states = [];
			highlight_current_states();

			element.classList.add('fsm-edit');
		};

		this._play_mode = () => {
			controls.at(-1).style = '';

			controls.forEach(control => {
				control.tabIndex = 0;
			});
			tools.forEach(tool => {
				tool.tabIndex = -1;
				tool.classList.remove('tool-selected');
			});

			canvas.ondblclick = undefined;
			play.firstChild.replaceWith(stop);
			string._highlight(highlight = 0);
			current_states = this.fsm.start();
			highlight_current_states();
			if(highlight >= string._get_value().length)
				highlight_accepted_states();

			element.classList.remove('fsm-edit');
		}

		this._toggle_play = () => {
			element.classList.contains('fsm-edit') ?
				this._play_mode() :
				this._edit_mode();
		}

		function select_tool(e) {
			transition_from_state?.classList.remove('selected');
			transition_from_state = null;
			tools.forEach(tool => tool === e?.target ?
				tool.classList.toggle('tool-selected') :
				tool.classList.remove('tool-selected')
			);
		}

		const transition_clicked = e => {
			const tool = element.querySelector('.tool-selected');
			if(!tool) return;

			const transition = e.target.parentElement;

			if(tool.delete) {
				this.fsm.remove_transition(transition._from._id, transition._to._id);
				transition._delete();
			}
		}
		
		const state_clicked = e => {
			const tool = element.querySelector('.tool-selected');
			if(!tool) return;

			if(tool.delete) {
				if(this.fsm.remove_state(e.target._id)) {
					let state = e.target;
					this.fsm.remove_state(e.target._id);
					state._transitions.forEach(t => t.remove());
					state.remove();
				}
			} else if(tool.initial) {
				const old_initial = canvas.querySelector('.state.initial');
				let new_initial = e.target;

				if(old_initial === new_initial)
					return;

				const old_transition = canvas.querySelector('.transition.initial');
				old_initial._transitions.delete(old_transition);
				old_initial.classList.remove('initial');
				old_transition.remove();

				this.fsm.initial_state = e.target._id;
				const new_transition = <fsm-transition to={new_initial}/>;
				canvas.appendChild(new_transition);
				new_initial.classList.add('initial');
			} else if(tool.final) {
				if(this.fsm.final_states.has(e.target._id)) {
					this.fsm.final_states.delete(e.target._id);
					e.target.classList.remove('final');
				} else {
					this.fsm.final_states.add(e.target._id);
					e.target.classList.add('final');
				}
			} else if(tool.transition) {
				if(!transition_from_state) {
					transition_from_state = e.target;
					transition_from_state.classList.add('selected');
				} else {
					const from = transition_from_state;
					const to = e.target;

					transition_from_state = null;
					from.classList.remove('selected');

					const existing_transition = canvas.querySelector(`#transition_${from._id}_${to._id}`);
					if(existing_transition) {
						existing_transition.querySelector('svg').ondblclick();
						return;
					}

					canvas.appendChild(
						<fsm-transition
							from={from}
							to={to}
							onclick={transition_clicked}
							input={values => {
								values = new Set(values.replaceAll(',','').split(''));
								if(this.fsm.type !== FSMType.eNFA) values.delete('$');
								return [...values].join();
							}}
							change={values => {
								this.fsm.remove_transition(from._id, to._id);
								values.forEach(value => {
									this.fsm.add_transition(from._id, to._id, value);
									this._reset_fsm();
								});
							}}
						/>
					);
					
				}
			}
		}

		panzoom(canvas, 2, 0.1);
		
		window.addEventListener('resize', e => {
			canvas._reset();
			canvas.querySelectorAll('.state').forEach(state => state._move());
		});

		element.onscroll = e => {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			element.scroll(0,0);
		}

		const dbl_click = e => {
			const styles = window.getComputedStyle(canvas, null);
			const offset_x = parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
			const offset_y = parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);

			let id = this.fsm.get_next_id();
			this.fsm.add_state(id);
			canvas.appendChild(
				<fsm-state
					id={id}
					name={`q${id}`}
					x={e.offsetX - (canvas.offsetWidth + offset_x)/2}
					y={e.offsetY - (canvas.offsetHeight + offset_y)/2}
					onclick={state_clicked}
				/>
			);
		}
		canvas.ondblclick = dbl_click;
		
		canvas.onmousedown = e => {
			if(e.detail > 1)
				e.preventDefault();
		}

		canvas._change = () => {
			zoom.innerText = `${parseInt(canvas._scale*100)}%`;
		}

		this._reset = () => {
			canvas._reset();
			this._edit_mode();
		}

		this._reset_fsm = () => {
			this._set_fsm(new FSM(this._get_fsm()));
		}

		this._cycle_type = () => {
			if(!element.classList.contains('fsm-edit'))
				return;

			this.fsm.type = (this.fsm.type + 1) % 3;
			type.innerText = ['DFA','NFA','ɛ-NFA'][this.fsm.type];

			this._reset_fsm();
		};

		this._get_fsm = () => {
			const fsm = this.fsm;
			fsm.state_info = {};
			this.fsm.string = string._get_value();
			this.fsm.states.forEach(state_id => {
				const state_element = canvas.querySelector(`#state_${state_id}`);
				fsm.state_info[state_id] = {
					name: state_element._name,
					x: state_element._x,
					y: state_element._y
				};
			});
			return fsm;
		}

		this._set_fsm = fsm => {
			canvas.innerHTML = '';
			this.fsm = fsm;

			const fragment = document.createDocumentFragment();
			fsm.states.forEach(state_id =>
				fragment.appendChild(
					<fsm-state
						id={state_id}
						name={fsm.state_info?.[state_id]?.name ?? `q${state_id}`}
						x={fsm.state_info?.[state_id]?.x ?? 0}
						y={fsm.state_info?.[state_id]?.y ?? 0}
						initial={fsm.initial_state === state_id}
						final={fsm.final_states.has(state_id)}
						onclick={state_clicked}
					/>
				)
			);
			canvas.appendChild(fragment);

			fragment.innerHTML = '';
			canvas.querySelectorAll('.state').forEach(state => {
				if(state.classList.contains('initial'))
					fragment.appendChild(<fsm-transition to={state}/>);

				let to_states = {};
				for(let symbol in this.fsm.transitions[state._id])
					for(let to_state of [...this.fsm.transitions[state._id][symbol]])
						!to_states[to_state] ?
							to_states[to_state] = [symbol] :
							to_states[to_state].push(symbol);

				for(let to_state in to_states) {
					const from = state;
					const to = canvas.querySelector(`#state_${to_state}`);

					fragment.appendChild(
						<fsm-transition
							from={from}
							to={to}
							value={to_states[to_state].sort().join(',')}
							onclick={transition_clicked}
							input={values => {
								values = new Set(values.replaceAll(',','').split(''));
								if(this.fsm.type !== FSMType.eNFA) values.delete('$');
								return [...values].join();
							}}
							change={values => {
								this.fsm.remove_transition(from._id, to._id);
								values.forEach(value => {
									this.fsm.add_transition(from._id, to._id, value);
									this._reset_fsm();
								});
							}}
						/>
					);
				}
				
			});
			canvas.appendChild(fragment);

			type.innerText = ['DFA','NFA','ɛ-NFA'][this.fsm.type];
			canvas._change();
			this._reset();
		}

		this._set_fsm(
			this.load ? new FSM(JSON.parse(Data.get('fsm') || '{}')) :
			example   ? new FSM(Examples[example]) :
						new FSM()
		);

		if(this.fsm.string)
			string._set_value(this.fsm.string);

	}
}

// Register custom elements after dom load so dimensions are initialized
document.addEventListener('DOMContentLoaded', () => {
	customElements.define('fsm-canvas', FSMCanvas);
}, { once: true });