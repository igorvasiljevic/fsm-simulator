import { __jsx, __jsx_fragment } from '../js/jsx.js';

import { mask, unmask } from '../js/util.js';

import '../css/fsm-menu.css';

import svg_more from '../res/more.svg';

export default class FSMMenu extends HTMLElement {
    connectedCallback() {        
        const element = (
            <div class='menu-container'>
                <button type='button' id='menu-btn' class='img-btn' title='Meni' aria-label='Meni'>
                    <svgl svg={svg_more}/>
                </button>
                <div class='menu menu-hidden'>
                    {[...this.children]}
                </div>
            </div>
        );
        this.replaceWith(element);
        
        const menu = element.querySelector('.menu');
        const open_menus = [];

        const hide_menu = menu => {
            for(let btn of menu.querySelectorAll('button'))
                btn.disabled = true;
            menu.classList.add('menu-hidden');
        }
        hide_menu(menu);

        const hide_all = () => {
            while(open_menus.length)
                open_menus.pop().classList.add('menu-hidden');
            hide_menu(menu);
        }

        const show_menu = menu => {
            open_menus.push(menu);
            for(let btn of menu.querySelectorAll(':scope > button'))
                btn.disabled = false;

            if(document.activeElement.matches(':focus-visible'))
                menu.firstElementChild.focus();

            menu.onkeydown = e => {
                if(e.key === 'Tab' && (
                    (!e.shiftKey && document.activeElement === menu.lastElementChild) ||
                    (e.shiftKey && document.activeElement === menu.firstElementChild)
                )) {
                    menu.onkeydown = undefined;
                    hide_menu(open_menus.pop());
                }
            }

            menu.classList.remove('menu-hidden');
        }

        element.onclick = e => {
            if(e.target.id === 'menu-btn') {
                if(open_menus.length === 0) {
                    mask(element, hide_all);
                    show_menu(menu);
                } else {
                    hide_menu(open_menus.pop());
                    if(open_menus.length === 0)
                        unmask();
                }
            } else if(e.target.submenu) {
                show_menu(menu.querySelector('#' + e.target.submenu));
            }
        }


    }
}

customElements.define('fsm-menu', FSMMenu);