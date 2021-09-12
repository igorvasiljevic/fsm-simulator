import { __jsx, __jsx_fragment } from '../js/jsx.js';

import '../css/fsm-menu.css';

import more from '../res/more.svg';

export default class FSMMenu extends HTMLElement {
    connectedCallback() {
        
        const element = (
            <div class='menu-container'>
                <button type='button' id='menu-btn' class='img-btn'><svgl svg={more}/></button>
                <div class='menu menu-hidden'>
                    {[...this.children]}
                </div>
            </div>
        );
        this.replaceWith(element);
        
        const menu = element.querySelector('.menu');
        const submenus = menu.querySelectorAll('.submenu');

        // hide all menus and disable tab navigation for their children
        hide_menu(menu);
        submenus.forEach(hide_menu);
        
        // menu button on click open/close menu/submenu
        element.querySelector('#menu-btn').onclick = e => {
            if(menu.classList.contains('menu-hidden')) {
                document.addEventListener('pointerdown', mask, { capture: true });
                show_menu(menu);
            } else {
                let submenu_open = false;
                submenus.forEach(submenu => {
                    if(!submenu.classList.contains('menu-hidden')) {
                        hide_menu(submenu);
                        submenu_open = true;
                    }
                });

                if(!submenu_open) {
                    hide_menu(menu);
                    document.removeEventListener('pointerdown', mask, { capture: true });
                }

            }
        }

        // submenu buttons on click open submenu
        [...menu.children].forEach(btn => {
            if(btn.submenu !== undefined) {
                const submenu_el = menu.querySelector('#' + btn.submenu);
                btn.onclick = () => show_menu(submenu_el);
            }
        });

        submenus.forEach(submenu => {
            submenu.onfocusout = e => {
                hide_menu(submenu);
            }
        });

        function mask(e) {
            if(e.target !== element && !element.contains(e.target)) {
                [...submenus, menu].forEach(menu => menu.classList.add('menu-hidden'));
                document.removeEventListener('pointerdown', mask, { capture: true });
            }
        }

        
        function show_menu(menu_el) {
            [...menu_el.children].forEach(child => {
                if(child.tagName === 'BUTTON')
                    child.tabIndex = 0;
            });

            if(document.activeElement.matches(':focus-visible'))
                menu_el.firstElementChild.focus();

            menu_el.onkeydown = e => {
                if(e.key === 'Tab' && (
                    (!e.shiftKey && document.activeElement === menu_el.lastElementChild) ||
                    (e.shiftKey && document.activeElement === menu_el.firstElementChild)
                )) {
                    hide_menu(menu_el);
                    menu_el.onkeydown = undefined;
                }
            }

            menu_el.classList.remove('menu-hidden');
        }

        function hide_menu(menu_el  ) {
            menu_el.querySelectorAll('button').forEach(btn => {
                btn.tabIndex = -1;
            });
            menu_el.classList.add('menu-hidden');
        }

    }
}

customElements.define('sim-menu', FSMMenu);