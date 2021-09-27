import { __jsx, __jsx_fragment } from '../js/jsx.js';

import Navigate from '../js/navigation.js';
import { switch_theme } from '../js/theme.js';
import File from '../js/file.jsx';
import Data from '../js/data.js';
import Examples from '../js/examples.js';
import { FSM } from '../js/fsm.js';

import { notify } from './fsm-notify.jsx';
import './fsm-menu.jsx';

import '../css/fsm-simulator.css';

import svg_home from '../res/home.svg';
import svg_theme from '../res/theme.svg';

export default class Simulator extends HTMLElement {
    connectedCallback() {

        const canvas = <fsm-canvas load fullsize/>;
        const menu = (
            <fsm-menu>
                <button type='button' submenu='menu-examples'>Examples</button>
                <div id='menu-examples' class='menu submenu menu-hidden'>
                    {
                        Object.keys(Examples).map(example => (
                            <button type='button' onclick={() =>
                                canvas._set_fsm(new FSM(Examples[example]))
                            }>{example}</button>
                        ))
                    }
                </div>

                <button type='button' onclick={() => {
                    canvas._set_fsm(new FSM());
                }}>New</button>

                <button type='button' onclick={() => {
                    const fsm_data = Data.get('fsm');
                    fsm_data ?
                        canvas._set_fsm(new FSM(JSON.parse(fsm_data))) :
                        notify('Nema spašenih podataka');
                }}>Load</button>

                <button type='button' onclick={() => {
                    File.upload().then(res => canvas._set_fsm(new FSM(JSON.parse(res))));
                }}>Upload</button>

                <button type='button' onclick={() => {
                    Data.set('fsm', canvas._get_fsm().toString());
                    notify('Podaci spašeni');
                }}>Save</button>

                <button type='button' onclick={() => {
                    let filename = prompt('Unesi ime fajla', 'ka.json');
                    if(filename)
                        File.download(filename, canvas._get_fsm().toString());
                }}>Download</button>

                <button type='button' onclick={ switch_theme } class='theme img-btn' title='Promijeni temu' aria-label='Promijeni temu'>
                    <svgl svg={svg_theme}/>
                </button>
            </fsm-menu>
        );

        this.replaceWith(
            <>
                <button type='button' class='img-btn home' onclick={Navigate.home} title='Početna' aria-label='Početna'>
                    <svgl svg={svg_home}/>
                </button>
                {menu}
                {canvas}
            </>
        );
        
    }
}

customElements.define('fsm-simulator', Simulator);