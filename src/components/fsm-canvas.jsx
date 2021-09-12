import { __jsx, __jsx_fragment } from '../js/jsx.js';
import Data from '../js/data.js';
import { window_center } from '../js/util.js';
import { panzoom, move } from '../js/events.js'

import { FSM, FSMType } from '../js/fsm.js';
import Examples from '../js/examples.js';

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

import svg_transition_arrow from '../res/transition-arrow.svg';
import svg_transition_arrow_loop from '../res/transition-arrow-loop.svg';

export class FSMState extends HTMLElement {
	connectedCallback() {
		const name = this.name ?? "S";
		const x = this.x ?? 0;
		const y = this.y ?? 0;

		const element = (
			<div id={'state_' + this.id} class={`state${this.initial ? ' initial' : ''}${this.final ? ' final' : ''}`}>
				<input type="text" class="input noevents" value={name} enterKeyHint="done" maxLength="10" spellcheck={false} autocomplete={false} />
			</div>
		);
		this.replaceWith(element);
	
		element._id = parseInt(this.id);
		element._name = name;
		element._pos_x = x;
		element._pos_y = y;
		element._transitions_from = [];
		element._transitions_to = [];

		const input = element.querySelector('.input');

		function mask(e) {
            if(e.target !== element && !element.contains(e.target)) {
				input.blur();
                document.removeEventListener('pointerdown', mask, { capture: true });
            }
        }

		element.ondblclick = e => {
			e.stopPropagation();
			input.focus();
		};

		input.onfocus = e => {
			element._movable(false);
			input.classList.remove('noevents');
			document.addEventListener('pointerdown', mask, { capture: true });
			// this.onfocus?.(e);
		}

		input.ondblclick = e => {
			input.setSelectionRange(0, input.value.length);
		}

		input.onkeydown = e => {
			switch(e.key) {
				case 'Escape': input.value = element._name;
				case 'Enter' : input.blur();
			}
		}

		input.onblur = e => {
			const name = input.value.trim();
			input.value = element._name = (name) ? name : element._name;

			input.classList.add('noevents');
			element._movable(true);
		}

		move(element, {
			pointer_down: e => e.target.classList.add('held'),
			pointer_up  : e => e.target.classList.remove('held'),
			click       : this.onclick,
			move        : () => {
				element._transitions_from.forEach(transition => transition._reposition());
				element._transitions_to.forEach(transition => transition._reposition());
			}
		});

	}
}

export class FSMTransition extends HTMLElement {
	connectedCallback() {

		const initial = !this.from;
		const loop = this.from === this.to;

		const transition_arrow = loop ?
			<svgl svg={svg_transition_arrow_loop}/> :
			<svgl svg={svg_transition_arrow}/>;

		const element = (
			<div class={`transition${initial ? " initial" : ""}${loop ? " loop" : ""}`}>
				{transition_arrow}
				<input type="text" class="input noevents" enterKeyHint="done" spellcheck={false} autocomplete={false} value={initial ? "Start" : this.value || ""}/>
			</div>
		);
		this.replaceWith(element);

		element.from = this.from;
		element.to = this.to;

		element._reposition = () => {
			if(initial) {
				transition_arrow.style.transform = `rotate(180deg)`;
				let pos_x = element.to._offset_x - element.offsetWidth;
				let pos_y = element.to._offset_y + element.offsetHeight/2;
				element.style.transform = `translate(${pos_x}px, ${pos_y}px)`;
			} else if(loop) {
				let pos_x = element.from._offset_x + (element.from.offsetWidth - element.offsetWidth)/2;
				let pos_y = element.from._offset_y + (element.from.offsetHeight - element.offsetHeight)/2 - 40;
				element.style.transform = `translate(${pos_x}px, ${pos_y}px)`;
			} else {
				let x1 = element.from._offset_x + element.from.offsetWidth/2;
				let y1 = element.from._offset_y + element.from.offsetHeight/2;
				let x2 = element.to._offset_x   + element.to.offsetWidth/2;
				let y2 = element.to._offset_y   + element.to.offsetHeight/2;

				let length = Math.hypot(x1 - x2, y1 - y2) - element.from.offsetWidth;
				transition_arrow.style.width = `${length}px`;

				let pos_x = (x1 + x2 - element.offsetWidth)/2;
				let pos_y = (y1 + y2 - element.offsetHeight)/2;
				element.style.transform = `translate(${pos_x}px, ${pos_y}px)`;

				let angle = Math.atan2(y1 - y2, x1 - x2);
				transition_arrow.style.transform = `rotate(${angle}rad)`;
			}
		}
		element._reposition();
		
		element.to._transitions_to.push(element);
		
		if(initial) return;
		
		element.from._transitions_from.push(element);
		
		element.id = `transition_${element.from._id}_${element.to._id}`;

		element._delete = () => {
			element.from._transitions_from = element.from._transitions_from.filter(t => t !== element);
			element.from._transitions_to = element.from._transitions_to.filter(t => t !== element);
			element.remove();
		}

		element._value = this.value || "";

		const input = element.querySelector('.input');
		
		function mask(e) {
            if(e.target !== element && !element.contains(e.target)) {
				input.blur();
                document.removeEventListener('pointerdown', mask, { capture: true });
            }
        }

		element.onclick = this.onclick;

		element.ondblclick = e => {
			e?.stopPropagation?.();
			setTimeout(() => input.focus(), 1);
		};

		input.onfocus = e => {
			input.classList.remove('noevents');
			document.addEventListener('pointerdown', mask, { capture: true });
		}

		input.ondblclick = e => {
			input.setSelectionRange(0, input.value.length);
		}

		input.onkeydown = e => {
			switch(e.key) {
				case 'Escape': input.value = element._value;
				case 'Enter' : input.blur();
			}
		}

		input.onblur = e => {
			input.classList.add('noevents');

			let values = [...new Set(
				input.value
					.replaceAll(",","")
					.replaceAll(" ","")
					.split("")
			)];
			let value = values.sort().join(',');
			input.value = element._value = (value) ? value : element._value;

			if(!element._value)
				element._delete();
			else
				this.change(values);			
		}



		if(!this.value)
			setTimeout(() => input.focus(), 1);
	}
}

export class FSMCanvas extends HTMLElement {
	connectedCallback() {

		let current_states = [];
		let highlight = 0;
		let transition_from_state = null;

		const example = this.getAttribute('example');

		const canvas = <div class="fsm-canvas"/>;
		const string = <fsm-string/>;

		const zoom = <button type="button" class="pill" onclick={() => this.reset()}/>;
		const type = <button type="button" class="pill" onclick={() => this.cycle_type()}/>;

		const run  = <svgl svg={svg_run}/>;
		const stop = <svgl svg={svg_stop}/>;
		const play = <button type="button" class="img-btn" onclick={() =>this._toggle_play()}>{run}</button>;

		const fullscreen_enter = <svgl svg={svg_fullscreen}/>;
		const fullscreen_exit = <svgl svg={svg_fullscreen_exit}/>;
		const fullscreen = (
			<button type="button" class="pill" onclick={() => this._toggle_fullscreen()}>
				{fullscreen_enter}
			</button>
		);

		let step_fun_timeout;

		const element = (
			<div class="fsm-container fsm-edit">
				<div class="pill-container">
					{ zoom }
					{ !example ? '' :
						<button type="button" class="pill"
							onclick={() => this.setFSMdata(new FSM(Examples[example]))}
						>Reset</button>
					}
					{ type }
					{ fullscreen }
				</div>
				<div class="bottombar">
					{ string }
					{ play }
					<div class="control-menu">
						<div class="controls">
							<button id="step" type="button" class="img-btn"
								onpointerdown={e => {
									e.preventDefault();
									let max = string.value.length;
									if(highlight >= max) return;

									const step_fun = () => {
										if(highlight >= max) return;
										step.bind(this)();
										string._highlight(++highlight);
										if(highlight === string.value.length) {
											highlight_accepted_states();
											e.target.nextElementSibling.style = 'transform: rotate(180deg)';
										} else {
											highlight_current_states();
										}
										step_fun_timeout = setTimeout(step_fun, 35);
									}

									step.bind(this)();
									string._highlight(++highlight);
									if(highlight === string.value.length) {
										highlight_accepted_states();
										e.target.nextElementSibling.style = 'transform: rotate(180deg)';
									} else {
										highlight_current_states();
									}
									step_fun_timeout = setTimeout(step_fun, 300);
								}}
								onpointerup={() => clearTimeout(step_fun_timeout)}
							><svgl svg={svg_step}/></button>
							<button id="fast-forward" type="button" class="img-btn" onclick={e => {
								if(highlight === string.value.length) {
									string._highlight(highlight = 0);
									current_states = this.fsm.start();
									highlight_current_states();
									e.target.style = '';
									return;
								}

								while(highlight < string.value.length) {
									step.bind(this)();
									++highlight;
								}
								string._highlight(highlight);
								highlight_current_states();
								highlight_accepted_states();
								e.target.style = 'transform: rotate(180deg)';
							}}><svgl svg={svg_fast}/></button>
						</div>
					</div>
					<div class="edit-menu">
						<div class="tools">
							<button type="button" initial    class="img-btn" onclick={select_tool}><svgl svg={svg_initial}/></button>
							<button type="button" final      class="img-btn" onclick={select_tool}><svgl svg={svg_final}/></button>
							<button type="button" transition class="img-btn" onclick={select_tool}><svgl svg={svg_transition}/></button>
							<button type="button" delete     class="img-btn" onclick={select_tool}><svgl svg={svg_delete}/></button>
						</div>
					</div>
				</div>
				{ canvas }
			</div>
		);
		this.replaceWith(element);
		
		const controls = [...element.querySelector('.controls').querySelectorAll('button')];
		const tools = [...element.querySelector('.tools').querySelectorAll('button')];
		
		function highlight_current_states() {
			canvas.querySelectorAll('.state').forEach(state => {
				if(current_states.includes(state._id))
					state.classList.add('current');
				else
					state.classList.remove('current', 'accepted', 'rejected');
			});
		}

		function highlight_accepted_states() {
			canvas.querySelectorAll('.state.current').forEach(state => {
				state.classList.add(state.classList.contains('final') ? 'accepted' : 'rejected');
			});
		}

		function step() {
			const symbol = string.value[highlight];
			const new_states = new Set();

			for(let state of current_states)
				for(let new_state of this.fsm.transition(state, symbol))
					new_states.add(new_state);
			
			current_states = [...new_states];
		}

		this._get_string = () => string.value;

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

		document.addEventListener("fullscreenchange", e => {
			if(element !== e.target)
				return;

			fullscreen.firstChild.replaceWith(document.fullscreenElement ? fullscreen_exit : fullscreen_enter);
			// canvas._reset();
		});

		this._edit_mode = () => {
			controls.forEach(control => {
				control.tabIndex = -1;
			});
			tools.forEach(tool => {
				tool.tabIndex = 0;
				tool.classList.remove('tool-selected');
			});

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

			element.classList.remove('fsm-edit');
		}

		this._toggle_play = () => {
			element.classList.contains('fsm-edit') ?
				this._play_mode() :
				this._edit_mode();
		}

		function select_tool(e) {
			transition_from_state?.classList.remove("selected");
			transition_from_state = null;
			tools.forEach(tool => {
				if(tool !== e.target)
					tool.classList.remove('tool-selected')
			});
			e.target.classList.toggle('tool-selected');
		}

		const transition_clicked = e => {
			const transition = e.target.parentElement;
			const tool = element.querySelector('.tool-selected');
			if(!tool)
				return;

			if(tool.delete) {
				this.fsm.remove_transition(transition.from._id, transition.to._id);
				transition._delete();
			}
		}
		
		const state_clicked = e => {
			const tool = element.querySelector('.tool-selected');
			if(!tool)
				return;

			if(tool.delete) {
				if(this.fsm.remove_state(e.target._id)) {
					let state = e.target;
					this.fsm.remove_state(e.target._id);
					state._transitions_from.forEach(transition => transition.remove());
					state._transitions_to.forEach(transition => transition.remove());
					state.remove();
				}
			} else if(tool.initial) {
				const old_initial = canvas.querySelector('.state.initial');
				let new_initial = e.target;

				if(old_initial === new_initial)
					return;

				const old_transition = canvas.querySelector('.transition.initial');
				old_initial._transitions_to = old_initial._transitions_to.filter(t => t !== old_transition);
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
					transition_from_state.classList.add("selected");
				} else {
					const from = transition_from_state;
					const to = e.target;

					transition_from_state = null;
					from.classList.remove("selected");

					const existing_transition = canvas.querySelector(`#transition_${from._id}_${to._id}`);
					if(existing_transition) {
						transition.ondblclick();
						return;
					}

					canvas.appendChild(
						<fsm-transition
							from={from}
							to={to}
							change={values => {
								this.fsm.remove_transition(from._id, to._id);
								values.forEach(value => {
									this.fsm.add_transition(from._id, to._id, value);
									if(this.fsm.type === FSMType.DFA)
										this.resetFSM();
									}
								);
							}}
							click={transition_clicked}
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
					// onfocus={e => state_focused(id, e)}
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


		this.reset = () => {
			canvas._reset();
			this._edit_mode();
		}

		this.resetFSM = () => {
			this.setFSMdata(new FSM(this.getFSMdata()));
		}

		this.cycle_type = () => {
			if(!element.classList.contains('fsm-edit'))
				return;

			this.fsm.type = (this.fsm.type + 1) % 3;
			type.innerText = ['DFA','NFA','ɛ-NFA'][this.fsm.type];

			if(this.fsm.type === FSMType.DFA)
				this.resetFSM();
		};

		this.getFSMdata = () => {
			const fsm = this.fsm;
			fsm.state_info = {};
			[...this.fsm.states].forEach(state_id => {
				const state_element = canvas.querySelector(`#state_${state_id}`);
				fsm.state_info[state_id] = {
					name: state_element._name,
					x: state_element._pos_x,
					y: state_element._pos_y
				};
			});
			return fsm;
		}

		this.setFSMdata = fsm => {
			canvas.innerHTML = '';
			this.fsm = fsm;

			const fragment = document.createDocumentFragment();
			fsm.states.forEach(state_id => {
				fragment.appendChild(
					<fsm-state
						id={state_id}
						name={fsm.state_info?.[state_id]?.name ?? `q${state_id}`}
						x={fsm.state_info?.[state_id]?.x ?? 0}
						y={fsm.state_info?.[state_id]?.y ?? 0}
						initial={fsm.initial_state === state_id}
						final={fsm.final_states.has(state_id)}
						onclick={state_clicked}
						// onfocus={e => state_focused(state_id, e)}
					/>
				);
			});
			canvas.appendChild(fragment);

			fragment.innerHTML = '';
			canvas.querySelectorAll(".state").forEach(state => {
				if(state.classList.contains('initial')) {
					fragment.appendChild(<fsm-transition to={state}/>);
				}

				let to_states = {};
				for(let symbol in this.fsm.transitions[state._id]) {
					for(let to_state of [...this.fsm.transitions[state._id][symbol]]) {
						if(!to_states[to_state])
							to_states[to_state] = [];
						to_states[to_state].push(symbol);
					}
				}

				for(let to_state in to_states) {
					const from = state;
					const to = canvas.querySelector(`#state_${to_state}`);

					fragment.appendChild(
						<fsm-transition
							from={from}
							to={to}
							value={to_states[to_state].sort().join(',')}
							change={values => {
								this.fsm.remove_transition(from._id, to._id);
								values.forEach(value => {
									this.fsm.add_transition(from._id, to._id, value);
									// also need to remove transitions that no longer exist
									if(this.fsm.type === FSMType.DFA)
										this.resetFSM();
								});
							}}
							onclick={transition_clicked}
						/>
					)
				}
				
				// draw transitions from state to other states in fsm.transitions
			});
			canvas.appendChild(fragment);

			type.innerText = ['DFA','NFA','ɛ-NFA'][this.fsm.type];
			canvas._change();
			this.reset();
		}

		// initialize first FSM
		this.setFSMdata(
			this.load ? new FSM(JSON.parse(Data.get('fsm') || '{}')) :
			example   ? new FSM(Examples[example]) :
						new FSM()
		);

		if(this.fsm.string)
			string.set_value(this.fsm.string);

	}
}

// Register custom elements after dom load so dimensions are initialized
document.addEventListener('DOMContentLoaded', () => {
	customElements.define('fsm-state', FSMState);
	customElements.define('fsm-transition', FSMTransition);
	customElements.define('fsm-canvas', FSMCanvas);
}, { once: true });