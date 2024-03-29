import { __jsx, __jsx_fragment } from '../js/jsx.js';
import { set_language } from '../js/language.js';
import { switch_theme } from '../js/theme.js';
import Navigate from '../js/navigation.js';

import svg_theme from '../res/theme.svg';
import svg_home from '../res/home.svg';

import '../css/fsm-header.css';

export default class Header extends HTMLElement {
    connectedCallback() {
        const home = this.hasAttribute('home');
        const text = this.getAttribute('text') || 'Konačni Automati';
        
        this.replaceWith(
            <header class='fsm-header'>
                <div class='topbar'>
                    {home ? '' :
                        <button type='button' class='topbar mra' onclick={Navigate.home}>
                            <svgl svg={svg_home}/>
                            <span>Početna</span>
                        </button>}
                    {/* <button type='button' onclick={() => set_language('bs')} class='mla'>Bosanski</button>
                    <span>•</span>
                    <button type='button' onclick={() => set_language('en')}>English</button> */}
                    <button type='button' class='topbar mla' onclick={switch_theme} title='Promijeni temu' aria-label='Promijeni temu'>
                        <svgl svg={svg_theme}/>
                    </button>
                </div>
                {home ? <h1>{text}</h1> : <h2>{text}</h2>}
                {home ? <h4>Igor Vasiljević</h4> : ''}
                <hr/>
            </header>
        );
        
    }
}

customElements.define('fsm-header', Header);