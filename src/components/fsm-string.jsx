import { __jsx, __jsx_fragment } from '../js/jsx.js';

import '../css/fsm-string.css';

export default class FSMString extends HTMLElement {
    connectedCallback() {

        this.value = this.value ?? '';

        const element = (
            <div class='fsm-string'>
                <input type='text' placeholder='test string' class='fsm-string-input' value={this.value} enterKeyHint='done' spellcheck={false} autocomplete={false}/>
                <div class='fsm-pseudo-input'>{this.value}</div>
            </div>
        );
        this.replaceWith(element);

        const input  = element.querySelector('.fsm-string-input');
        const pseudo = element.querySelector('.fsm-pseudo-input');


        input.onblur = e => {
            this.value = pseudo.innerText = input.value;
        }

        input.onkeydown = e => {
			switch(e.key) {
				case 'Escape':
				case 'Enter' : input.blur();
			}
		}

        this.set_value = text => {
            this.value = pseudo.innerText = input.value = text;
        }

        this._highlight = index => {
            input.tabIndex = -1;
            pseudo.classList.remove('hidden');

            if(index < pseudo.innerText.length)
                pseudo.innerHTML =
                    pseudo.innerText.slice(0, index) +
                    `<span class="highlight">${pseudo.innerText[index]}</span>` +
                    pseudo.innerText.slice(index + 1);
            else {
                pseudo.innerHTML = pseudo.innerText;
                return;
            }


            if(pseudo.scrollWidth !== pseudo.clientWidth) {
                const highlight = pseudo.querySelector('.highlight');
                const dist = (highlight.offsetLeft / pseudo.scrollWidth) * (pseudo.clientWidth - 3*highlight.offsetWidth);
                const scroll = Math.round(highlight.offsetLeft - dist - highlight.offsetWidth);
                pseudo.scroll(scroll, 0);
            }
            
        }

        this._reset = () => {
            input.tabIndex = 0;
            pseudo.innerHTML = pseudo.innerText;
            pseudo.classList.add('hidden');
            this.edit?.();
        }

    }
}

customElements.define('fsm-string', FSMString);