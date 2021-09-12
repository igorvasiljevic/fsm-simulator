import { __jsx, __jsx_fragment } from '../js/jsx.js';
import { home_folder } from '../js/constants.js';
import { switchTheme } from '../js/theme.js';
import File from '../js/file.jsx';
import Data from '../js/data.js';
import Examples from '../js/examples.js';
import { FSM } from '../js/fsm.js';

import { notify } from './fsm-notify.jsx';
import './fsm-menu.jsx';

import '../css/fsm-simulator.css';

import home from '../res/home.svg';
import theme from '../res/theme.svg';

export default class Simulator extends HTMLElement {
    connectedCallback() {

        // const notify = <fsm-notify/>;
        const canvas = <fsm-canvas scale={2} load/>;
        const menu = (
            <sim-menu>
                <button type='button' submenu='menu-examples'>Examples</button>
                <div id='menu-examples' class='menu submenu menu-hidden'>
                    { Object.keys(Examples).map(example => (
                        <button type='button' onclick={() => {
                            canvas.setFSMdata(new FSM(Examples[example]));
                        }}>{example}</button>
                    ))}
                </div>

                <button type='button' onclick={() => {
                    canvas.setFSMdata(new FSM());
                }}>New</button>

                <button type='button' onclick={() => {
                    const fsm_data = Data.get('fsm');
                    if(fsm_data)
                        canvas.setFSMdata(new FSM(JSON.parse(fsm_data)));
                    else
                        notify('No saved data');

                }}>Load</button>

                <button type='button' onclick={() => {
                    File.upload().then(res => {
                        canvas.setFSMdata(new FSM(JSON.parse(res)))
                    });
                }}>Upload</button>

                <button type='button' onclick={() => {
                    canvas.fsm.string = canvas._get_string();
                    Data.set('fsm', JSON.stringify(canvas.getFSMdata()));
                    notify('Data saved');
                }}>Save</button>

                <button type='button' onclick={() => {
                    const filename = prompt('Enter file name', 'fsm.json');
                    if(filename)
                        File.download(filename, JSON.stringify(canvas.getFSMdata()));
                }}>Download</button>

                <button type='button' onclick={ switchTheme } class='theme img-btn'>
                    <svgl svg={theme}/>
                </button>
            </sim-menu>
        );

        this.replaceWith(
            <>
                <button type='button' class='img-btn home' onclick={() => location.href = home_folder + '/'}>
                    <svgl svg={home}/>
                </button>
                {menu}
                {canvas}
            </>
        );
        
    }
}

customElements.define('fsm-simulator', Simulator);