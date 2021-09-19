import { __jsx, __jsx_fragment } from '../js/jsx.js';

import { move } from '../js/events.js';

import '../css/fsm-state.css';

export class FSMState extends HTMLElement {
	connectedCallback() {

		const element = (
			<div id={'state_' + this.id} class={`state${this.initial ? ' initial' : ''}${this.final ? ' final' : ''}`}>
				<input type='text' class='input noevents' value={this.name ?? 'S'} enterKeyHint='done' maxLength='10' spellcheck={false} autocomplete={false} />
			</div>
		);
		this.replaceWith(element);

		const input = element.firstElementChild;
	
		element._id = parseInt(this.id);
		element._name = input.value;
		element._x = this.x ?? 0;
		element._y = this.y ?? 0;
		element._transitions = new Set();

		element.ondblclick = e => {
			e.stopPropagation();
			input.focus();
		};

		input.onfocus = e => {
			element._movable(false);
			input.classList.remove('noevents');
			this.onfocus?.(element);
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
			move  : () => element._transitions.forEach(t => t._reposition()),
			click : this.onclick
		});

	}
}

customElements.define('fsm-state', FSMState);