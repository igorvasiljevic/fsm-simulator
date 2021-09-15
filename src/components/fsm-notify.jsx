import { __jsx, __jsx_fragment } from '../js/jsx.js';

import '../css/fsm-notify.css';

class Notify extends HTMLElement {
    connectedCallback() {

        const element = <div class='fsm-notify hide'/>;

        this.replaceWith(element);

        let timeout;
        this._show = message => {
            clearTimeout(timeout);
            element.innerHTML = message;
            element.classList.remove('hide');
            timeout = setTimeout(() => element.classList.add('hide'), 1500);
        }

    }
}

customElements.define('fsm-notify', Notify);
const notify_element = <fsm-notify/>;

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(notify_element);
}, { once: true });

export const notify = message => notify_element._show(message);