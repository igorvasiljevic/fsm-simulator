import { __jsx, __jsx_fragment } from '../js/jsx.js';

import Data from '../js/data.js';
import { mobile, toggle_fullscreen, window_center } from '../js/util.js';
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

const MAX_ZOOM = 2;
const ZOOM_VELOCITY = 0.1;
// let native_fullscreen_supported = false;

export class FSMCanvas extends HTMLElement {
	connectedCallback() {
		
		let current_states = [];
		let highlight = 0;
		let transition_from_state = null;
		let step_timeout;

		const example = this.getAttribute('example');

		const canvas = <div class='fsm-canvas'/>;

		const zoom = <button type='button' class='pill' onclick={() => this._reset()} title='Reset zoom' aria-label='Reset zoom'/>;
		const type = <button type='button' class='pill' onclick={() => this._cycle_type()} title='Change FSM type' aria-label='Change FSM type'/>;

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
					{ this.fullsize ? '' :
						<button type='button' class='pill small' onclick={() => this._toggle_fullscreen()} title='Fullscreen' aria-label='Fullscreen'>
							<svgl class='svg_fullscreen' svg={svg_fullscreen}/>
							<svgl class='svg_fullscreen_exit' svg={svg_fullscreen_exit}/>
						</button>
					}
				</div>
				<div class='bottombar'>
					<fsm-string/>
					<button type='button' class='img-btn' onclick={() => this._toggle_play()} title='Play/Stop' aria-label='Play/Stop'>
						<svgl class='svg_run' svg={svg_run}/>
						<svgl class='svg_stop' svg={svg_stop}/>
					</button>
					<div class='control-menu'>
						<div class='controls'>
							<button type='button' class='img-btn' title='Step' aria-label='Step'
								onpointerdown={e => {
									e.target._held = true;
									e.target.setPointerCapture(e.pointerId);
									step.bind(this)(e);
								}}
								onpointerup={e => {
									e.target._held = false;
									e.target.releasePointerCapture(e.pointerId);
									clearTimeout(step_timeout);
								}}
							><svgl svg={svg_step}/></button>
							<button type='button' class='img-btn' onclick={fast.bind(this)} title='Run' aria-label='Run'>
								<svgl svg={svg_fast}/>
							</button>
						</div>
					</div>
					<div class='edit-menu'>
						<div class='tools'>
							<button type='button' initial    class='img-btn' onclick={select_tool} title='Set initial'       aria-label='Set initial'><svgl svg={svg_initial}/></button>
							<button type='button' final      class='img-btn' onclick={select_tool} title='Toggle final'      aria-label='Toggle final'><svgl svg={svg_final}/></button>
							<button type='button' transition class='img-btn' onclick={select_tool} title='Create transition' aria-label='Create transition'><svgl svg={svg_transition}/></button>
							<button type='button' delete     class='img-btn' onclick={select_tool} title='Delete state'      aria-label='Delete state'><svgl svg={svg_delete}/></button>
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
			for(let state of canvas.querySelectorAll('.state')) {
				current_states.includes(state._id) ?
					state.classList.add('current') :
					state.classList.remove('current', 'accepted', 'rejected');
			}
		}

		function highlight_accepted_states() {			
			const current_final_states = canvas.querySelectorAll('.state.current.final');

			if(current_final_states.length) {
				for(let state of current_final_states)
					state.classList.add('accepted');
				notify('<span style="color:var(--state-bg-color-accepted)">String accepted</span>');
			} else {
				for(let state of canvas.querySelectorAll('.state.current'))
					state.classList.add('rejected');
				notify('<span style="color:var(--state-bg-color-rejected)">String not accepted</span>');
			}
		}

		function step(e, first_step = true) {
			if(
				(!first_step && !e.target._held) ||
				highlight >= string._get_value().length
			)
				return;
			
			if(first_step)
				for(let state of canvas.querySelectorAll('.state.current'))
					state.classList.remove('current');

			const symbol = string._get_value()[highlight];
			const transitions = new Set();
			const epsilon_transitions = new Set();

			for(let state of current_states) {
				for(let to of this.fsm.transition_states([state], symbol)) {
					let transition = canvas.querySelector(`#transition_${state}_${to}`);
					if(transition)
						transitions.add(transition);
					for(let e_to of this.fsm.transitions[to]?.['$'] ?? [])
						epsilon_transitions.add(canvas.querySelector(`#transition_${to}_${e_to}`));
				}
			}

			Promise
				.all([...transitions].map(t => t._animate()))
				.then(() => Promise.all([...epsilon_transitions].map(t => t._animate(true))))
				.then(() => {
					current_states = this.fsm.transition_states(current_states, symbol); // TODO: Issue is here
					string._highlight(++highlight);
					highlight_current_states();
					if(highlight === string._get_value().length) {
						highlight_accepted_states();
						controls.at(-1).style = 'transform: rotate(180deg)';
					}
					step_timeout = setTimeout(() => step.bind(this)(e, false), first_step ? 200 : 0);
				})
				.catch(err => {});

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

		this._toggle_fullscreen = () => {
			if(!toggle_fullscreen(element))
				window_center(element);
		}

		// this._toggle_fullscreen = () => {
		// 	if(native_fullscreen_supported) {
		// 		if(document.fullscreenElement) {
		// 			document.exitFullscreen?.()?.then?.(res => window_center(element));
		// 		} else {
		// 			(
		// 				!document.fullscreenEnabled     ? new Promise((resolve, reject) => reject('Fullscreen not allowed!')) :
		// 				element.requestFullscreen       ? element.requestFullscreen() :
		// 				element.webkitRequestFullscreen ? element.webkitRequestFullscreen() :
		// 				element.msRequestFullScreen     ? element.msRequestFullScreen() :
		// 												  new Promise((resolve, reject) => reject('Fullscreen not available!'))
		// 			)
		// 			.catch(err => {
		// 				native_fullscreen_supported = false;
		// 				console.log(err + ' Falling back to custom fullscreen');
		// 			});
		// 		}
		// 	}
		// 	if(!native_fullscreen_supported)
		// 		if(!toggle_fullscreen(element))
		// 			window_center(element);
		// }

		this._edit_mode = () => {
			for(let control of controls)
				control.disabled = true;
			for(let tool of tools)
				tool.disabled = false;

			canvas.ondblclick = dbl_click;
			string._reset();
			current_states = [];
			highlight_current_states();

			element.classList.add('fsm-edit');
		};

		this._play_mode = () => {
			controls.at(-1).style = '';

			for(let control of controls)
				control.disabled = false;
			for(let tool of tools) {
				tool.disabled = true;
				tool.classList.remove('tool-selected');
			}

			canvas.ondblclick = undefined;
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
			for(let tool of tools) {
				tool === e?.target ?
					tool.classList.toggle('tool-selected') :
					tool.classList.remove('tool-selected')
			}
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
					for(let transition of state._transitions)
						transition.remove();
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
							onfocus={mobile ? into_view : transition_focused}
							input={values => {
								values = new Set(values.replaceAll(',','').split(''));
								if(this.fsm.type !== FSMType.eNFA) values.delete('$');
								return [...values].join();
							}}
							change={values => {
								this.fsm.remove_transition(from._id, to._id);
								for(let value of values)
									this.fsm.add_transition(from._id, to._id, value)
								this._reset_fsm();
							}}
						/>
					);
					
				}
			}
		}

		const into_view = element => {
			element.scrollIntoViewIfNeeded();
		}

		canvas._styles = window.getComputedStyle(canvas, null);
		const offset_left   = parseFloat(canvas._styles.paddingLeft);
		const offset_right  = parseFloat(canvas._styles.paddingRight);
		const offset_top    = parseFloat(canvas._styles.paddingTop);
		const offset_bottom = parseFloat(canvas._styles.paddingBottom);
		delete canvas._styles;

		const transition_focused = transition => {
			const x1 = (transition._to._offset_x + offset_left)*canvas._scale + canvas._x;
			const y1 = (transition._to._offset_y + offset_top)*canvas._scale + canvas._y;
			const x2 = (transition._from._offset_x + offset_left)*canvas._scale + canvas._x;
			const y2 = (transition._from._offset_y + offset_top)*canvas._scale + canvas._y;

			if(
				x1 < offset_left || x1 > element.offsetWidth - transition._to.offsetWidth*canvas._scale - offset_right ||
				y1 < offset_top || y1 > element.offsetHeight - transition._to.offsetHeight*canvas._scale - offset_bottom ||
				x2 < offset_left || x2 > element.offsetWidth - transition._from.offsetWidth*canvas._scale - offset_right ||
				y2 < offset_top || y2 > element.offsetHeight - transition._from.offsetHeight*canvas._scale - offset_bottom
			) {
				canvas._pan_to({
					x: (transition._to._x + transition._from._x)/2,
					y: (transition._to._y + transition._from._y)/2,
				});
			}

		}

		const state_focused = state => {
			const x = (state._offset_x + offset_left)*canvas._scale + canvas._x;
			const y = (state._offset_y + offset_top)*canvas._scale + canvas._y;
			if(
				x < offset_left || x > element.offsetWidth - state.offsetWidth*canvas._scale - offset_right ||
				y < offset_top || y > element.offsetHeight - state.offsetHeight*canvas._scale - offset_bottom
			) {
				canvas._pan_to({x: state._x, y: state._y});
			}
		}

		panzoom(canvas, MAX_ZOOM, ZOOM_VELOCITY);

		new ResizeObserver(() => {	
			canvas._center?.();
			for(let state of canvas.querySelectorAll('.state'))
				state._move()

			// on mobile the virtual keyboard popping up cometimes pushes
			// the focused element out of view
			if(mobile && document.activeElement?.classList.contains('input')) {
				const parent = document.activeElement.parentElement;
				if(parent.classList.contains('state'))
					state_focused(parent, true);
				else if(parent.classList.contains('transition'))
					transition_focused(parent, true);
			}
		}).observe(element);

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
					onfocus={mobile ? into_view : state_focused}
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

		this._reset = (canvas_reset = true) => {
			if(canvas_reset)
				canvas._reset?.();
			this._edit_mode();
		}

		this._reset_fsm = () => {
			this._set_fsm(new FSM(this._get_fsm()), false);
		}

		this._cycle_type = () => {
			if(!element.classList.contains('fsm-edit'))
				return;

			this.fsm.type = (this.fsm.type + 1) % 3;
			type.innerText = ['DFA','NFA','ɛ-NFA'][this.fsm.type]; // TODO: localization

			this._reset_fsm();
		};

		this._get_fsm = () => {
			const fsm = this.fsm;
			fsm.state_info = {};
			this.fsm.string = string._get_value();
			for(let state_id of this.fsm.states) {
				const state_element = canvas.querySelector(`#state_${state_id}`);
				fsm.state_info[state_id] = {
					name: state_element._name,
					x: state_element._x,
					y: state_element._y
				};
			}
			return fsm;
		}

		this._set_fsm = (fsm, canvas_reset = true) => {
			canvas.innerHTML = '';
			this.fsm = fsm;

			const fragment = document.createDocumentFragment();
			for(let state_id of fsm.states) {
				fragment.appendChild(
					<fsm-state
						id={state_id}
						name={fsm.state_info?.[state_id]?.name ?? `q${state_id}`}
						x={fsm.state_info?.[state_id]?.x ?? 0}
						y={fsm.state_info?.[state_id]?.y ?? 0}
						initial={fsm.initial_state === state_id}
						final={fsm.final_states.has(state_id)}
						onclick={state_clicked}
						onfocus={mobile ? into_view : state_focused}
					/>
				);
			}
			canvas.appendChild(fragment);

			fragment.innerHTML = '';
			for(let state of canvas.querySelectorAll('.state')) {
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
							onfocus={mobile ? into_view : transition_focused}
							input={values => {
								values = new Set(values.replaceAll(',','').split(''));
								if(this.fsm.type !== FSMType.eNFA) values.delete('$');
								return [...values].join();
							}}
							change={values => {
								this.fsm.remove_transition(from._id, to._id);
								for(let value of values)
									this.fsm.add_transition(from._id, to._id, value)
								this._reset_fsm();
							}}
						/>
					);
				}
				
			}
			canvas.appendChild(fragment);

			type.innerText = ['DFA','NFA','ɛ-NFA'][this.fsm.type];

			this._reset(canvas_reset);
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