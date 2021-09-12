import { __jsx, __jsx_fragment } from '../js/jsx.js';
import { setLanguage } from '../js/language.js';
import { switchTheme } from '../js/theme.js';
import { home_folder } from '../js/constants.js';

import theme from '../res/theme.svg';
import home from '../res/home.svg';

import '../css/fsm-header.css';

export default class Header extends HTMLElement {
    connectedCallback() {
        const fullsize = this?.hasAttribute('fullsize');

        this.replaceWith(
            <header class='fsm-header'>
                <div class='topbar'>
                    {fullsize ? '' :
                        <button type='button' class='topbar mra' onclick={() => location.href = home_folder + '/'}>
                            <svgl svg={home}/>
                            <span>Home</span>
                        </button>}
                    <button type='button' onclick={() => setLanguage('bs')} class='mla'>Bosanski</button>
                    <span>•</span>
                    <button type='button' onclick={() => setLanguage('en')}>English</button>
                    <button type='button' class='topbar' onclick={switchTheme}>
                        <svgl svg={theme}/>
                    </button>
                </div>
                {fullsize ? <h1>Finite-State Machines</h1> : <h2>Finite-State Machines</h2>}
                {fullsize ? <h4>by Igor Vasiljević</h4> : ''}
                <hr/>
            </header>
        );
        
    }
}

customElements.define('fsm-header', Header);