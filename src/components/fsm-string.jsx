import { __jsx, __jsx_fragment } from '../js/jsx.js';

import '../css/fsm-string.css';

export default class FSMString extends HTMLElement {
    connectedCallback() {

        const value = this.value ?? '';

        const element = (
            <div class='fsm-string'>
                <input type='text' placeholder='test string' class='fsm-string-input' value={value} enterKeyHint='done' spellcheck={false} autocomplete={false}/>
                <div class='fsm-pseudo-input'>{value}</div>
            </div>
        );
        this.replaceWith(element);

        const input  = element.querySelector('.fsm-string-input');
        const pseudo = element.querySelector('.fsm-pseudo-input');

        element._get_value = () => input.value;

        element._set_value = text => {
            pseudo.innerText = input.value = text.replaceAll('$','');
        }

        element._highlight = index => {
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

        element._reset = () => {
            input.tabIndex = 0;
            pseudo.innerHTML = pseudo.innerText;
            pseudo.classList.add('hidden');
            this.edit?.();
        }

        input.onblur = e => {
            pseudo.innerText = input.value;
        }

        input.onkeydown = e => {
			switch(e.key) {
				case 'Escape':
				case 'Enter' : input.blur();
			}
		}

        input.oninput = e => {
            element._set_value(input.value);
        }

        input.onchange = e => {
            console.log(e);
        }

    }
}

customElements.define('fsm-string', FSMString);