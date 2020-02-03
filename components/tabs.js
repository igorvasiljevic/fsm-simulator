customElements.define('g-tabs', class extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <div class="tabs_container">
            <div class="tab addtab"><h2>+</h2></div>
            <div class="tab_shadow_container">
                <div class="shadow_left"></div>
                <div class="tabs"></div>
                
            </div>
            <div class="deleteBox hidden"><h2>Drag here to delete tab</h2></div>
        </div>
        `;

        // <div class="shadow_right"></div>

        this._addtab = this.getElementsByClassName('addtab')[0];
        this._tabs = this.getElementsByClassName('tabs')[0];
        this._delete = this.getElementsByClassName('deleteBox')[0];

        this._addtab.title = "New tab";

        this._tabs.addEventListener('wheel', this._scroll, {passive: true});
        this._tabs.addEventListener('touchstart', this._touchStart, {passive: true});
        this._tabs.addEventListener('dragstart', e => {
            if(this.onDragStart) this.onDragStart(e);
        }, {passive: true});

        this._addtab.addEventListener('click', e => this.add());
    }

    set defaultTabName(name) { this._defaultTabName = name }
    set transitionEventName(name) { this._transitionEventName = name }
    set maxTabNameLength(length) { this._maxTabNameLength = length }
    set tabsRightOffset(offset) {
        const addtabWidth = Number.parseInt(window.getComputedStyle(this._addtab).width.replace('px',''));
        const maxWidth = window.innerWidth - addtabWidth - offset;
        this._tabs.style.maxWidth = maxWidth + 'px';
        
    }

    get selected() {
        return this._tabs.getElementsByClassName('selected')[0];
    }
    set selected(tab) {
        if(!tab.classList.contains('tab')) return;
        const currentTab = this.selected;
        if(currentTab && currentTab.isSameNode(tab)) return;

        if(currentTab)
            currentTab.classList.remove('selected');
        tab.classList.add('selected');

        if(this.onSelectedChange)
            this.onSelectedChange(tab);
    }

    get selectedIndex() {
        return this.index(this.selected);
    }
    set selectedIndex(tabIndex) {
        if(tabIndex >= 0 && tabIndex < this._tabs.children.length)
            this.selected = this._tabs.children[tabIndex];
    }
    index(tab) {
        return Array.prototype.indexOf.call(this._tabs.children, tab);
    }

    add(name) {
        const newTab = this.create(name);
        this._tabs.scrollLeft += this._tabs.scrollWidth;

        if(this.onAdd) this.onAdd(newTab);
        return newTab;
    }

    create(name) {
        const newTab = document.createElement('g-tab');
        this._tabs.appendChild(newTab);
        newTab.name = name || this._defaultTabName;
        return newTab;
    }

    remove(tab) {
        if(!tab) return;

        const tabIndex = this.index(tab);
        this.selectedIndex = tabIndex ? tabIndex-1 : tabIndex+1;
        
        if(tabIndex == 0 && this._tabs.childElementCount == 1) {
            tab.remove();
            if(this.onRemove) this.onRemove(tabIndex);
            return;
        }
        
        tab.addEventListener(this._transitionEventName, e => {
            tab.remove();
            if(this.onRemove) this.onRemove(tabIndex);
        });

        requestAnimationFrame(() => {
            tab.style.opacity = '0.4';
            tab.style.width = window.getComputedStyle(tab)['width'];
            requestAnimationFrame(() => {
                tab.style.width = '0px';
            });
        });
    }

    move(tab, afterTab) {
        const gtabs = tab._gtabs;
        let from = gtabs.index(tab);
        let to = gtabs.index(afterTab);
        to = from > to ? to+1 : to;

        if(from != to) {
            to ? afterTab.after(tab) : gtabs._tabs.firstElementChild.before(tab);
            if(gtabs.onMove) gtabs.onMove(from, to);
        }
    }

    clear() {
        while(this._tabs.firstElementChild)
            this._tabs.firstElementChild.remove();
    }

    _scroll(e) {
        if(e.deltaY > 0) // Zoom out
            this.scrollLeft += 50;
        else if(e.deltaY < 0) // Zoom in
            this.scrollLeft -= 50;
    }

    _touchStart(e) {
        let ts = e.targetTouches[0].clientX;
        this.ontouchmove = tabsTouchMove;

        function tabsTouchMove(e) {
            let te = e.targetTouches[0].clientX;
            this.scrollLeft += ts-te
            ts = te;
        }
    }

    _dragStart(e) {
        this._draggedElement = e.target;

        e.stopPropagation();

        this._draggedElement.style.opacity = 0.4;
        this._delete.classList.remove('hidden');
    }

    _dragEnter(e) {
        e.preventDefault()
        e.stopPropagation();
        
        if(e.target.classList.contains('deleteBox'))
            e.target.classList.add('delete');
        else if(e.target.parentElement && e.target.classList.contains('tab')) {
            if(e.target.classList.contains('addtab')){
                console.log('addtab');
                e.target.classList.add('dropZone');
                return;
            }
            const draggedElement = e.target._gtabs._draggedElement;
            if(!draggedElement.isSameNode(e.target) && !draggedElement.isSameNode(e.target.nextSibling))
                e.target.classList.add('dropZone');
        }
    }

    _dragLeave(e) {
        e.preventDefault()
        e.stopPropagation();
        e.target.classList.remove('dropZone');
        e.target.classList.remove('delete');
    }

    _drop(e) {
        e.preventDefault()
        e.stopPropagation();

        const draggedElement = this._draggedElement;

        if(e.target.isSameNode(this._delete)) {
            this.remove(draggedElement);
        } else if(e.target.classList.contains('tab')) {
            if(!draggedElement.isSameNode(e.target) && !draggedElement.isSameNode(e.target.nextSibling))
                this.move(draggedElement, e.target);
        }

        this._dragEnd(this);
    }

    _dragEnd() {
        const draggedElement = this._draggedElement;

        if(draggedElement) {
            draggedElement.style.opacity = 1;
            delete this._draggedElement;
        }
        this._delete.classList.add('hidden');
        this._delete.classList.remove('delete');
        this._addtab.classList.remove('dropZone');

        for(let i = 0; i < this._tabs.children.length; i++)
            this._tabs.children[i].classList.remove('dropZone');
    }

});

customElements.define('g-tab', class extends HTMLElement {
    connectedCallback() {
        if(this.innerHTML) return;

        this.innerHTML = `
        <div class='verticalAlign'>
        <input type="text" disabled></input>
        </div>
        `;
        this._input = this.querySelector('input');
        this._input.maxLength = this._gtabs._maxTabNameLength;
        this.classList.add('tab');
        this.setAttribute('draggable', true);
        this.onclick = e => this._gtabs.selected = e.target;
        this.ondblclick = e => this._renameStart(e.target);

        this._input.onblur = e => this._renameEnd(e.target);
        this._input.oninput = e => { e.target.size = e.target.value.length || 1 };
        this._input.onkeydown = e => this._renameKeyDown(e);
    }

    get name() { return this.title }
    set name(name) {
        this.title = this._input.title = this._input.value = name;
        this._input.size = name ? name.length || 1 : 1;
    }

    get _gtabs() { return this.parentElement.parentElement.parentElement.parentElement }

    _renameStart(tab) {
        if(!tab._input) return;
        tab.renaming = true;
        tab._currentName = this._input.value;

        tab._input.style.pointerEvents = 'all';
        tab._input.classList.add('alignTextLeft');
        tab._input.disabled = false;
        tab._input.select();
    }
    _renameEnd(input) {
        input.disabled = true;
        input.classList.remove('alignTextLeft');
        
        let newName = input.value.trim() || this._currentName;
        input.value = newName;
        if(newName != this._currentName) {    
            this.title = input.title = newName;
            if(this._gtabs.onRename) this._gtabs.onRename(this);
        }
        
        input.size = newName.length || 1;
        window.getSelection().empty();
        input.style.pointerEvents = 'none';
        delete this.renaming;
    }
    _renameKeyDown(e) {
        if(e.key === 'Enter') {
            e.preventDefault();
            this._renameEnd(e.target);
        } else if(e.key === 'Escape') {
            e.preventDefault();
            e.target.value = this._currentName;
            this._renameEnd(e.target);
        }
    }
});