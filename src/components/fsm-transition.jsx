import { __jsx, __jsx_fragment } from '../js/jsx.js';

import '../css/fsm-transition.css';

import svg_arrow from '../res/transition-arrow.svg';
import svg_arrow_loop from '../res/transition-arrow-loop.svg';

const TWO_WAY_ARROW_SEPARATION = -0.35;

export class FSMTransition extends HTMLElement {
	connectedCallback() {

		const initial = !this.from;
		const loop = this.from === this.to;

		const arrow = loop ?
			<svgl svg={svg_arrow_loop}/> :
			<svgl svg={svg_arrow}/>;

		const element = (
			<div class={`transition${initial ? ' initial' : ''}${loop ? ' loop' : ''}`}>
				{arrow}
				<input type='text' class='input noevents' enterKeyHint='done' spellcheck={false} autocomplete={false} value={initial ? 'Start' : this.value || ''}/>
			</div>
		);
		this.replaceWith(element);

		element._from = this.from;
		element._to = this.to;

		if(!initial && !loop)
			element._opposite = document.getElementById(`transition_${element._to._id}_${element._from._id}`);
		if(element._opposite)
			element._opposite._opposite = element;

		element._reposition = (opposite_positioned = false) => {
			if(initial) {
				arrow.style.transform = `rotate(180deg)`;
				let x = element._to._offset_x - element.offsetWidth;
				let y = element._to._offset_y + arrow.clientHeight/2;
				element.style.transform = `translate(${x}px, ${y}px)`;
			} else if(loop) {
				let x = element._to._offset_x + (element._to.offsetWidth - element.offsetWidth)/2;
				let y = element._to._offset_y + (element._to.offsetHeight - arrow.clientHeight)/2 - 40;
				element.style.transform = `translate(${x}px, ${y}px)`;
			} else {				
				const state_radius = element._to.offsetWidth/2;

				let x1 = element._from._offset_x + state_radius;
				let y1 = element._from._offset_y + state_radius;
				let x2 = element._to._offset_x + state_radius;
				let y2 = element._to._offset_y + state_radius;

				const angle = Math.atan2(y1 - y2, x1 - x2);
				arrow.style.transform = `rotate(${angle}rad)`;

				let length;
				if(element._opposite) {
					if(!opposite_positioned)
						element._opposite._reposition(true);

					x1 += state_radius * Math.cos(angle + TWO_WAY_ARROW_SEPARATION + Math.PI);
					y1 += state_radius * Math.sin(angle + TWO_WAY_ARROW_SEPARATION + Math.PI);
					x2 += state_radius * Math.cos(angle - TWO_WAY_ARROW_SEPARATION);
					y2 += state_radius * Math.sin(angle - TWO_WAY_ARROW_SEPARATION);

					length = Math.hypot(x1 - x2, y1 - y2);
				} else {
					length = Math.hypot(x1 - x2, y1 - y2) - 2*state_radius;
				}
				
				arrow.style.width = `${length}px`;

				const x = (x1 + x2 - element.offsetWidth)/2;
				const y = (y1 + y2 - arrow.clientHeight)/2;
				element.style.transform = `translate(${x}px, ${y}px)`;
					
			}
		}
		element._reposition();
		
		element._to._transitions.add(element);

		if(initial) return;
		
		element._from._transitions.add(element);

		const input = element.querySelector('.input');
		
		element.id = `transition_${element._from._id}_${element._to._id}`;
		element._value = this.value || '';
		
		function mask(e) {
            if(e.target !== element && !element.contains(e.target)) {
				input.blur();
                document.removeEventListener('pointerdown', mask, { capture: true });
            }
        }

		element._delete = () => {
			element._from._transitions.delete(element);
			element.remove();
			if(element._opposite) {
				delete element._opposite._opposite;
				element._opposite._reposition();
			}
		}

		arrow.onclick = this._click;

		arrow.ondblclick = e => {
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

		input.oninput = e => {
			input.value = this.input(input.value);
		}

		input.onblur = e => {
			input.classList.add('noevents');

			let values = [...new Set(
				input.value
					.replaceAll(',','')
					.replaceAll(' ','')
					.split('')
			)];
			let value = values.sort().join(',');
			input.value = element._value = value ? value : element._value;

			if(!element._value)
				element._delete();
			else
				this.change(values);			
		}


		if(!this.value)
			setTimeout(() => input.focus(), 100);
	}
}

customElements.define('fsm-transition', FSMTransition);