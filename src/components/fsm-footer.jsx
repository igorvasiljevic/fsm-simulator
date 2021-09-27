import { __jsx, __jsx_fragment } from '../js/jsx.js';
import Navigate from '../js/navigation.js';

import '../css/fsm-footer.css';

export default class Footer extends HTMLElement {
    connectedCallback() {
        const back = Navigate.get_previous_page() !== undefined;
        const next = Navigate.get_next_page() !== undefined;
        const txt_next = !back && next ? 'Počni' : 'Dalje';

        this.replaceWith(
            <footer class='fsm-footer'>
                <hr/>
                <nav>
                    {back ? <button type='button' onclick={Navigate.previous}><span class='rp'>&lt;</span>Nazad</button> : ''}
                    {back && next ? <span>•</span> : ''}
                    {next ? <button type='button' onclick={Navigate.next}>{txt_next}<span class='lp'>&gt;</span></button> : ''}
                </nav>
            </footer>
        );

    }
}

customElements.define('fsm-footer', Footer);