(()=>{var t={get:t=>window?.localStorage?.getItem(t),set:(t,e)=>window?.localStorage?.setItem(t,e),remove:t=>window?.localStorage?.removeItem(t)},e=()=>{t.set("theme",document.documentElement.classList.toggle("light")?"light":"dark")},s="",n=["/","/lessons/1.html","/lessons/2.html","/lessons/3.html","/lessons/4.html","/simulator.html"],i=()=>{if("serviceWorker"in navigator){let t;navigator.serviceWorker.register("/sw.js"),navigator.serviceWorker.addEventListener("controllerchange",(()=>{t||(t=!0,window.location.reload())}))}};function o(t,e={},...s){let n=-1===t?document.createDocumentFragment():"svgl"===t?function(t){let e=document.createElement("div");return e.innerHTML=t,e.firstChild}(e.svg):e?.xmlns?document.createElementNS(e.xmlns,t):document.createElement(t);e?.svg;for(let t in e)if("style"===t)for(let t in e.style)n.style[t]=e.style[t];else t.startsWith("on")||!(t in n)&&"class"!==t&&!t.startsWith("data-")?n[t]=e[t]:n.setAttributeNS(null,t,e[t]);return n.append(...s.flat()),n}var l=t=>{console.log(t)},a='<svg viewBox="-50 -50 100 100" stroke="var(--svg-color)" stroke-width="4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><path fill="var(--svg-color)" d="M0 20a1 1 0 0 0 0-40"/><path fill="none" stroke-width="4.5" d="M0-20a1 1 0 0 0 0 40m0 13v13m0-79v-13M-33 0h-13m79 0h13m-71-25-8-8m8 58-8 8m58-8 8 8m-8-58 8-8"/></svg>',r='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="5" stroke-linecap="round" d="m10 45 40-30 40 30m-64 5v35h16V65h16v20h16V50"/></svg>',c=class extends HTMLElement{connectedCallback(){let t=this?.hasAttribute("fullsize");this.replaceWith(o("header",{class:"fsm-header"},o("div",{class:"topbar"},t?"":o("button",{type:"button",class:"topbar mra",onclick:()=>location.href="/"},o("svgl",{svg:r}),o("span",null,"Home")),o("button",{type:"button",onclick:()=>l("bs"),class:"mla"},"Bosanski"),o("span",null,"•"),o("button",{type:"button",onclick:()=>l("en")},"English"),o("button",{type:"button",class:"topbar",onclick:e},o("svgl",{svg:a}))),o(t?"h1":"h2",null,"Finite-State Machines"),t?o("h4",null,"by Igor Vasiljević"):"",o("hr",null)))}};customElements.define("fsm-header",c);var d=(()=>{let t=()=>{let t=window.location.pathname.replace(s,"");return"/index.html"===t&&(t="/"),n.indexOf(t)},e=()=>{let e=t();if(0!=e)return`${n[--e]}`},i=()=>{let e=t();if(e!=n.length-1)return`${n[++e]}`};return{getPreviousPage:e,getNextPage:i,previous:()=>{window.location.href=e()},next:()=>{window.location.href=i()}}})(),f=class extends HTMLElement{connectedCallback(){let t=void 0!==d.getPreviousPage(),e=void 0!==d.getNextPage(),s=!t&&e?"Start":"Next";this.replaceWith(o("footer",{class:"fsm-footer"},o("hr",null),o("nav",null,t?o("button",{type:"button",onclick:d.previous},o("span",{class:"rp"},"<"),"Previous"):"",t&&e?o("span",null,"•"):"",e?o("button",{type:"button",onclick:d.next},s,o("span",{class:"lp"},">")):"")))}};customElements.define("fsm-footer",f);var h=(t,e=-1/0,s=1/0)=>Math.min(Math.max(t,e),s),m=t=>t.offsetTop+(t.offsetParent?m(t.offsetParent):0),u={DFA:0,NFA:1,eNFA:2},p=class{constructor({type:t,states:e,initial_state:s,final_states:n,transitions:i,state_info:o,string:l}={}){this.type=t??u.DFA,this.states=new Set(e),this.initial_state=s??0,this.final_states=new Set(n),this.transitions={},this.states.add(this.initial_state);for(let t in i??{})for(let e in i[t]??{})for(let s of i[t][e]??[])this.add_transition(t,s,e);this.state_info=o,this.string=l}get_next_id(){let t=0;for(;this.states.has(t);)++t;return t}add_state(t){this.states.add(t),this.transitions[t]={}}remove_state(t){if(t===this.initial_state)return!1;this.final_states.delete(t),delete this.transitions[t];for(let e in this.transitions)this.remove_transition(e,t);return this.states.delete(t)}add_transition(t,e,s){this.transitions[t]||(this.transitions[t]={}),this.transitions[t][s]||(this.transitions[t][s]=new Set),this.type===u.DFA&&this.transitions[t][s].clear(),this.transitions[t][s].add(e)}remove_transition(t,e){for(let s in this.transitions[t])this.transitions[t][s]?.delete?.(e),0===this.transitions[t][s]?.size&&delete this.transitions[t][s]}epsilon_transition(t){let e,s=t;for(;s!==e;){s=t.size;let n=[...t];for(let e of n)if(this.transitions[e]&&this.transitions[e].$)for(let s of[...this.transitions[e].$])t.add(s);e=t.size}return t}start(){return this.type===u.eNFA?[...this.epsilon_transition(new Set([this.initial_state]))]:[this.initial_state]}transition(t,e){let s=this.transitions?.[t]?.[e];return s?(this.type===u.eDFA&&(s=this.epsilon_transition(s)),[...s]):[]}toJSON(){let t=this.transitions;for(let e in t)for(let s in t[e])t[e][s]=[...t[e][s]];return{states:[...this.states],initial_state:this.initial_state,final_states:[...this.final_states],transitions:this.transitions,type:this.type,state_info:this.state_info,string:this.string}}},_={First:{states:[0],initial_state:0,final_states:[],transitions:{},type:0,state_info:{0:{name:"q0",x:0,y:0}},string:"first"},Second:{states:[0,1],initial_state:0,final_states:[1],transitions:{},type:1,state_info:{0:{name:"q0",x:-50,y:-50},1:{name:"q1",x:50,y:50}},string:"second"},Third:{states:[1,2,3],initial_state:1,final_states:[2,3],transitions:{},type:2,state_info:{1:{name:"q1",x:-50,y:-50},2:{name:"q2",x:50,y:-50},3:{name:"q3",x:50,y:50}},string:"third"},Fourth:{states:[0,1,2,3],initial_state:0,final_states:[3],transitions:{0:{c:[0],a:[1],b:[2]},1:{a:[1,2],c:[1]},2:{c:[2],b:[3],$:[3]},3:{b:[3],c:[3]}},type:1,state_info:{0:{name:"q0",x:-110,y:0},1:{name:"q1",x:0,y:-110},2:{name:"q2",x:110,y:0},3:{name:"q3",x:0,y:110}},string:"ccaccaccbccbcc"}},g=class extends HTMLElement{connectedCallback(){this.value=this.value??"";let t=o("div",{class:"fsm-string"},o("input",{type:"text",placeholder:"test string",class:"fsm-string-input",value:this.value,enterKeyHint:"done",spellcheck:!1,autocomplete:!1}),o("div",{class:"fsm-pseudo-input"},this.value));this.replaceWith(t);let e=t.querySelector(".fsm-string-input"),s=t.querySelector(".fsm-pseudo-input");e.onblur=t=>{this.value=s.innerText=e.value},e.onkeydown=t=>{switch(t.key){case"Escape":case"Enter":e.blur()}},this.set_value=t=>{this.value=s.innerText=e.value=t},this._highlight=t=>{if(e.tabIndex=-1,s.classList.remove("hidden"),t<s.innerText.length){if(s.innerHTML=s.innerText.slice(0,t)+`<span class="highlight">${s.innerText[t]}</span>`+s.innerText.slice(t+1),s.scrollWidth!==s.clientWidth){let t=s.querySelector(".highlight"),e=t.offsetLeft/s.scrollWidth*(s.clientWidth-3*t.offsetWidth),n=Math.round(t.offsetLeft-e-t.offsetWidth);s.scroll(n,0)}}else s.innerHTML=s.innerText},this._reset=()=>{e.tabIndex=0,s.innerHTML=s.innerText,s.classList.add("hidden"),this.edit?.()}}};customElements.define("fsm-string",g);var v=class extends HTMLElement{connectedCallback(){let t=this.name??"S",e=this.x??0,s=this.y??0,n=o("div",{id:"state_"+this.id,class:`state${this.initial?" initial":""}${this.final?" final":""}`},o("input",{type:"text",class:"input noevents",value:t,enterKeyHint:"done",maxLength:"10",spellcheck:!1,autocomplete:!1}));this.replaceWith(n),n._id=parseInt(this.id),n._name=t,n._pos_x=e,n._pos_y=s,n._transitions_from=[],n._transitions_to=[];let i=n.querySelector(".input");function l(t){t.target!==n&&!n.contains(t.target)&&(i.blur(),document.removeEventListener("pointerdown",l,{capture:!0}))}n.ondblclick=t=>{t.stopPropagation(),i.focus()},i.onfocus=t=>{n._movable(!1),i.classList.remove("noevents"),document.addEventListener("pointerdown",l,{capture:!0})},i.ondblclick=t=>{i.setSelectionRange(0,i.value.length)},i.onkeydown=t=>{switch(t.key){case"Escape":i.value=n._name;case"Enter":i.blur()}},i.onblur=t=>{let e=i.value.trim();i.value=n._name=e||n._name,i.classList.add("noevents"),n._movable(!0)},((t,e={})=>{let s=0,n=0,i=null,o=!1,l=!1;t._styles=window.getComputedStyle(t.parentElement,null),t._styles._padding_left=parseFloat(t._styles.paddingLeft),t._styles._padding_right=parseFloat(t._styles.paddingRight),t._styles._padding_top=parseFloat(t._styles.paddingTop),t._styles._padding_bottom=parseFloat(t._styles.paddingBottom),t._styles._offset_x=(t._styles._padding_left-t._styles._padding_right)/2,t._styles._offset_y=(t._styles._padding_top-t._styles._padding_bottom)/2;let a=t.offsetWidth/2+t._styles._padding_left-t._styles._offset_x,r=t.offsetWidth/2+t._styles._padding_right+t._styles._offset_x,c=t.offsetHeight/2+t._styles._padding_top-t._styles._offset_y,d=t.offsetHeight/2+t._styles._padding_bottom+t._styles._offset_y;function f(e){t.onpointermove=e?u:t=>t.stopPropagation()}function m(a){try{t.releasePointerCapture(i)}catch(t){}i=null,s=0,n=0,e.pointer_up?.(a),o&&e.click?.(a),o=l=!1}function u(e){if(e.pointerId!==i)return;l=!0,e.stopPropagation();let o=t.parentElement._scale??1;t._pos_x+=(e.clientX-s)/o,t._pos_y+=(e.clientY-n)/o,s=e.clientX,n=e.clientY,p()}function p(){let s=t.parentElement.offsetWidth/2,n=t.parentElement.offsetHeight/2;t._pos_x=h(t._pos_x,a-s,s-r),t._pos_y=h(t._pos_y,c-n,n-d),t._offset_x=t._pos_x-a+s,t._offset_y=t._pos_y-c+n,t.style.transform=`translate(${t._offset_x}px, ${t._offset_y}px)`,e.move?.()}function _({x:e,y:s}={}){t._pos_x=e??t._pos_x,t._pos_y=s??t._pos_y,p()}delete t._styles,t._move=_,t._movable=f,t.onpointerdown=function(a){i=a.pointerId,t.setPointerCapture(i),s=a.clientX,n=a.clientY,o=!0,setTimeout((()=>{l&&(o=!1)}),100),e.pointer_down?.(a)},t.onpointerup=m,t.onpointercancel=m,f(!0),_(t._pos_x??0,t._pos_y)})(n,{pointer_down:t=>t.target.classList.add("held"),pointer_up:t=>t.target.classList.remove("held"),click:this.onclick,move:()=>{n._transitions_from.forEach((t=>t._reposition())),n._transitions_to.forEach((t=>t._reposition()))}})}},y=class extends HTMLElement{connectedCallback(){let t=!this.from,e=this.from===this.to,s=o("svgl",e?{svg:'<svg width="45" height="50" xmlns="http://www.w3.org/2000/svg"><g class="noevents" fill="none" stroke="var(--transition-color)" stroke-width="2"><circle r="18.2" cx="50%" cy="28"/><path d="m36 31-1 12M44 36l-9.5 7"/></g></svg>'}:{svg:'<svg style="width:60px;height:26px" xmlns="http://www.w3.org/2000/svg"><g class="noevents" stroke="var(--transition-color)" stroke-width="2"><line y1="13" x2="100%" y2="13"/><path d="m0 13 10-5M0 13l10 5"/></g></svg>'}),n=o("div",{class:`transition${t?" initial":""}${e?" loop":""}`},s,o("input",{type:"text",class:"input noevents",enterKeyHint:"done",spellcheck:!1,autocomplete:!1,value:t?"Start":this.value||""}));if(this.replaceWith(n),n.from=this.from,n.to=this.to,n._reposition=()=>{if(t){s.style.transform="rotate(180deg)";let t=n.to._offset_x-n.offsetWidth,e=n.to._offset_y+n.offsetHeight/2;n.style.transform=`translate(${t}px, ${e}px)`}else if(e){let t=n.from._offset_x+(n.from.offsetWidth-n.offsetWidth)/2,e=n.from._offset_y+(n.from.offsetHeight-n.offsetHeight)/2-40;n.style.transform=`translate(${t}px, ${e}px)`}else{let t=n.from._offset_x+n.from.offsetWidth/2,e=n.from._offset_y+n.from.offsetHeight/2,i=n.to._offset_x+n.to.offsetWidth/2,o=n.to._offset_y+n.to.offsetHeight/2,l=Math.hypot(t-i,e-o)-n.from.offsetWidth;s.style.width=`${l}px`;let a=(t+i-n.offsetWidth)/2,r=(e+o-n.offsetHeight)/2;n.style.transform=`translate(${a}px, ${r}px)`;let c=Math.atan2(e-o,t-i);s.style.transform=`rotate(${c}rad)`}},n._reposition(),n.to._transitions_to.push(n),t)return;n.from._transitions_from.push(n),n.id=`transition_${n.from._id}_${n.to._id}`,n._delete=()=>{n.from._transitions_from=n.from._transitions_from.filter((t=>t!==n)),n.from._transitions_to=n.from._transitions_to.filter((t=>t!==n)),n.remove()},n._value=this.value||"";let i=n.querySelector(".input");function l(t){t.target!==n&&!n.contains(t.target)&&(i.blur(),document.removeEventListener("pointerdown",l,{capture:!0}))}n.onclick=this.onclick,n.ondblclick=t=>{t?.stopPropagation?.(),setTimeout((()=>i.focus()),1)},i.onfocus=t=>{i.classList.remove("noevents"),document.addEventListener("pointerdown",l,{capture:!0})},i.ondblclick=t=>{i.setSelectionRange(0,i.value.length)},i.onkeydown=t=>{switch(t.key){case"Escape":i.value=n._value;case"Enter":i.blur()}},i.onblur=t=>{i.classList.add("noevents");let e=[...new Set(i.value.replaceAll(",","").replaceAll(" ","").split(""))],s=e.sort().join(",");i.value=n._value=s||n._value,n._value?this.change(e):n._delete()},this.value||setTimeout((()=>i.focus()),1)}},w=class extends HTMLElement{connectedCallback(){let e,s=[],n=0,i=null,l=this.getAttribute("example"),a=o("div",{class:"fsm-canvas"}),r=o("fsm-string",null),c=o("button",{type:"button",class:"pill",onclick:()=>this.reset()}),d=o("button",{type:"button",class:"pill",onclick:()=>this.cycle_type()}),f=o("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="m35 25 38 25-38 25z"/></svg>'}),g=o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-25-25h50v50h-50z"/></svg>'}),v=o("button",{type:"button",class:"img-btn",onclick:()=>this._toggle_play()},f),y=o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-28-8v-20h20m16 0h20v20m0 16v20H8m-16 0h-20V8"/></svg>'}),w=o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-32-12h20v-20m24 0v20h20m0 24H12v20m-24 0V12h-20"/></svg>'}),b=o("button",{type:"button",class:"pill",onclick:()=>this._toggle_fullscreen()},y),x=o("div",{class:"fsm-container fsm-edit"},o("div",{class:"pill-container"},c,l?o("button",{type:"button",class:"pill",onclick:()=>this.setFSMdata(new p(_[l]))},"Reset"):"",d,b),o("div",{class:"bottombar"},r,v,o("div",{class:"control-menu"},o("div",{class:"controls"},o("button",{id:"step",type:"button",class:"img-btn",onpointerdown:t=>{t.preventDefault();let s=r.value.length;if(n>=s)return;let i=()=>{n>=s||(F.bind(this)(),r._highlight(++n),n===r.value.length?(S(),t.target.nextElementSibling.style="transform: rotate(180deg)"):L(),e=setTimeout(i,35))};F.bind(this)(),r._highlight(++n),n===r.value.length?(S(),t.target.nextElementSibling.style="transform: rotate(180deg)"):L(),e=setTimeout(i,300)},onpointerup:()=>clearTimeout(e)},o("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="12" d="m34 18 35 32-35 32"/></svg>'})),o("button",{id:"fast-forward",type:"button",class:"img-btn",onclick:t=>{if(n===r.value.length)return r._highlight(n=0),s=this.fsm.start(),L(),void(t.target.style="");for(;n<r.value.length;)F.bind(this)(),++n;r._highlight(n),L(),S(),t.target.style="transform: rotate(180deg)"}},o("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="m24 28 28 22-28 22zm34 0 28 22-28 22z"/></svg>'})))),o("div",{class:"edit-menu"},o("div",{class:"tools"},o("button",{type:"button",initial:!0,class:"img-btn",onclick:M},o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="M-38 0h28m2 0a1 1 0 0 1 45 0A1 1 0 0 1-8 0"/><path fill="none" stroke="var(--svg-color)" stroke-width="5" d="m-24-11 14 11-14 11"/></svg>'})),o("button",{type:"button",final:!0,class:"img-btn",onclick:M},o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="var(--svg-color)"><circle r="35" stroke-width="6"/><circle r="23" stroke-width="5"/></g></svg>'})),o("button",{type:"button",transition:!0,class:"img-btn",onclick:M},o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="m-26 26 52-52M4-26h22v22"/><circle r="7" cx="-26" cy="26" fill="var(--svg-color)"/></svg>'})),o("button",{type:"button",delete:!0,class:"img-btn",onclick:M},o("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="12" d="m-26-26 52 52m0-52-52 52"/></svg>'}))))),a);this.replaceWith(x);let k=[...x.querySelector(".controls").querySelectorAll("button")],E=[...x.querySelector(".tools").querySelectorAll("button")];function L(){a.querySelectorAll(".state").forEach((t=>{s.includes(t._id)?t.classList.add("current"):t.classList.remove("current","accepted","rejected")}))}function S(){a.querySelectorAll(".state.current").forEach((t=>{t.classList.add(t.classList.contains("final")?"accepted":"rejected")}))}function F(){let t=r.value[n],e=new Set;for(let n of s)for(let s of this.fsm.transition(n,t))e.add(s);s=[...e]}function M(t){i?.classList.remove("selected"),i=null,E.forEach((e=>{e!==t.target&&e.classList.remove("tool-selected")})),t.target.classList.toggle("tool-selected")}this._get_string=()=>r.value,this._toggle_fullscreen=()=>{document.fullscreenElement?document.exitFullscreen?.()?.then?.((t=>{return e=x,window.scrollTo(0,m(e)-window.innerHeight/2+e.clientHeight/2);var e})):(document.fullscreenEnabled?x.requestFullscreen?x.requestFullscreen():x.webkitRequestFullscreen?x.webkitRequestFullscreen():x.msRequestFullScreen?x.msRequestFullScreen():new Promise(((t,e)=>e("Fullscreen not available"))):new Promise(((t,e)=>e("Fullscreen not allowed")))).catch(console.log)},document.addEventListener("fullscreenchange",(t=>{x===t.target&&b.firstChild.replaceWith(document.fullscreenElement?w:y)})),this._edit_mode=()=>{k.forEach((t=>{t.tabIndex=-1})),E.forEach((t=>{t.tabIndex=0,t.classList.remove("tool-selected")})),a.ondblclick=W,v.firstChild.replaceWith(f),r._reset(),s=[],L(),x.classList.add("fsm-edit")},this._play_mode=()=>{k.at(-1).style="",k.forEach((t=>{t.tabIndex=0})),E.forEach((t=>{t.tabIndex=-1,t.classList.remove("tool-selected")})),a.ondblclick=void 0,v.firstChild.replaceWith(g),r._highlight(n=0),s=this.fsm.start(),L(),x.classList.remove("fsm-edit")},this._toggle_play=()=>{x.classList.contains("fsm-edit")?this._play_mode():this._edit_mode()};let q=t=>{let e=t.target.parentElement,s=x.querySelector(".tool-selected");!s||s.delete&&(this.fsm.remove_transition(e.from._id,e.to._id),e._delete())},T=t=>{let e=x.querySelector(".tool-selected");if(e)if(e.delete){if(this.fsm.remove_state(t.target._id)){let e=t.target;this.fsm.remove_state(t.target._id),e._transitions_from.forEach((t=>t.remove())),e._transitions_to.forEach((t=>t.remove())),e.remove()}}else if(e.initial){let e=a.querySelector(".state.initial"),s=t.target;if(e===s)return;let n=a.querySelector(".transition.initial");e._transitions_to=e._transitions_to.filter((t=>t!==n)),e.classList.remove("initial"),n.remove(),this.fsm.initial_state=t.target._id;let i=o("fsm-transition",{to:s});a.appendChild(i),s.classList.add("initial")}else if(e.final)this.fsm.final_states.has(t.target._id)?(this.fsm.final_states.delete(t.target._id),t.target.classList.remove("final")):(this.fsm.final_states.add(t.target._id),t.target.classList.add("final"));else if(e.transition)if(i){let e=i,s=t.target;if(i=null,e.classList.remove("selected"),a.querySelector(`#transition_${e._id}_${s._id}`))return void transition.ondblclick();a.appendChild(o("fsm-transition",{from:e,to:s,change:t=>{this.fsm.remove_transition(e._id,s._id),t.forEach((t=>{this.fsm.add_transition(e._id,s._id,t),this.fsm.type===u.DFA&&this.resetFSM()}))},click:q}))}else i=t.target,i.classList.add("selected")};((t,e,s)=>{t._scale=1;let n=0,i=0,o={},l=0;function a(t){let e=o[t.pointerId]?.target;!e||(delete o[t.pointerId],[n,i]=c(),l=d(),delete e._dragged)}function r(n,i,o){let l=t.parentElement.getBoundingClientRect();n-=l.left,i-=l.top;let a=(t._pos_x-n)/t._scale,r=(t._pos_y-i)/t._scale;t._scale=h(t._scale*(1+o*s),t.parentElement.offsetWidth/t.offsetWidth,e),t._pos_x=a*t._scale+n,t._pos_y=r*t._scale+i,f()}function c(){let t=Object.values(o),e=0,s=0;return t.forEach((({clientX:t,clientY:n})=>{e+=t,s+=n})),e/=t.length,s/=t.length,[e,s]}function d(){let t=Object.values(o);if(2===t.length&&t[0].target===t[1].target){let e=t[0].clientX-t[1].clientX,s=t[0].clientY-t[1].clientY;return Math.sqrt(e*e+s*s)}return 0}function f(){t._pos_x=h(t._pos_x,t.parentElement.offsetWidth-t.offsetWidth*t._scale,0),t._pos_y=h(t._pos_y,t.parentElement.offsetHeight-t.offsetHeight*t._scale,0);let e=t._pos_x+t.offsetWidth*(t._scale-1)/2,s=t._pos_y+t.offsetHeight*(t._scale-1)/2;t.style.transform=`translate(${e}px, ${s}px) scale(${t._scale})`,t._change?.()}function m(){t._pos_x=(t.parentElement.offsetWidth-t.offsetWidth)/2,t._pos_y=(t.parentElement.offsetHeight-t.offsetHeight)/2,f()}t.onpointerdown=function(t){o[t.pointerId]=t,t.target.setPointerCapture(t.pointerId),[n,i]=c(),l=d()},t.onpointerup=a,t.onpointermove=function(e){let s=o[e.pointerId]?.target;if(!s)return;e.preventDefault(),o[e.pointerId]=e,s._dragged=!0;let[a,h]=c();t._pos_x+=a-n,t._pos_y+=h-i,n=a,i=h;let m=d(),u=(m-l)/50;l=m,u?r(a,h,u):f()},t.onpointerleave=a,t.onpointercancel=a,t.onwheel=function(t){t.preventDefault(),r(t.clientX,t.clientY,h(t.wheelDelta??t.deltaY,-1,1))},t._pan=function({x:e,y:s}){t._pos_x=e??t._pos_x,t._pos_y=s??t._pos_y,f()},t._pan_to=function({x:e,y:s}){let n=(t.parentElement.offsetWidth-t.offsetWidth)/2,i=(t.parentElement.offsetHeight-t.offsetHeight)/2;t._pos_x=n-e,t._pos_y=i-s,f()},t._center=m,t._reset=function(){t._scale=1,m()}})(a,2,.1),window.addEventListener("resize",(t=>{a._reset(),a.querySelectorAll(".state").forEach((t=>t._move()))})),x.onscroll=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),x.scroll(0,0)};let W=t=>{let e=window.getComputedStyle(a,null),s=parseFloat(e.paddingLeft)-parseFloat(e.paddingRight),n=parseFloat(e.paddingTop)-parseFloat(e.paddingBottom),i=this.fsm.get_next_id();this.fsm.add_state(i),a.appendChild(o("fsm-state",{id:i,name:`q${i}`,x:t.offsetX-(a.offsetWidth+s)/2,y:t.offsetY-(a.offsetHeight+n)/2,onclick:T}))};a.ondblclick=W,a.onmousedown=t=>{t.detail>1&&t.preventDefault()},a._change=()=>{c.innerText=`${parseInt(100*a._scale)}%`},this.reset=()=>{a._reset(),this._edit_mode()},this.resetFSM=()=>{this.setFSMdata(new p(this.getFSMdata()))},this.cycle_type=()=>{!x.classList.contains("fsm-edit")||(this.fsm.type=(this.fsm.type+1)%3,d.innerText=["DFA","NFA","ɛ-NFA"][this.fsm.type],this.fsm.type===u.DFA&&this.resetFSM())},this.getFSMdata=()=>{let t=this.fsm;return t.state_info={},[...this.fsm.states].forEach((e=>{let s=a.querySelector(`#state_${e}`);t.state_info[e]={name:s._name,x:s._pos_x,y:s._pos_y}})),t},this.setFSMdata=t=>{a.innerHTML="",this.fsm=t;let e=document.createDocumentFragment();t.states.forEach((s=>{e.appendChild(o("fsm-state",{id:s,name:t.state_info?.[s]?.name??`q${s}`,x:t.state_info?.[s]?.x??0,y:t.state_info?.[s]?.y??0,initial:t.initial_state===s,final:t.final_states.has(s),onclick:T}))})),a.appendChild(e),e.innerHTML="",a.querySelectorAll(".state").forEach((t=>{t.classList.contains("initial")&&e.appendChild(o("fsm-transition",{to:t}));let s={};for(let e in this.fsm.transitions[t._id])for(let n of[...this.fsm.transitions[t._id][e]])s[n]||(s[n]=[]),s[n].push(e);for(let n in s){let i=t,l=a.querySelector(`#state_${n}`);e.appendChild(o("fsm-transition",{from:i,to:l,value:s[n].sort().join(","),change:t=>{this.fsm.remove_transition(i._id,l._id),t.forEach((t=>{this.fsm.add_transition(i._id,l._id,t),this.fsm.type===u.DFA&&this.resetFSM()}))},onclick:q}))}})),a.appendChild(e),d.innerText=["DFA","NFA","ɛ-NFA"][this.fsm.type],a._change(),this.reset()},this.setFSMdata(this.load?new p(JSON.parse(t.get("fsm")||"{}")):l?new p(_[l]):new p),this.fsm.string&&r.set_value(this.fsm.string)}};document.addEventListener("DOMContentLoaded",(()=>{customElements.define("fsm-state",v),customElements.define("fsm-transition",y),customElements.define("fsm-canvas",w)}),{once:!0});var b=o("a",{download:"fsm.json",style:{display:"none"},onclick:t=>t.stopPropagation()}),x=o("input",{type:"file",accept:".json",style:{display:"none"},onclick:t=>t.stopPropagation()}),k=new FileReader;document.addEventListener("DOMContentLoaded",(()=>{document.body.append(b,x)}),{once:!0});var E={download:(t,e)=>{b.setAttribute("download",t),b.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),b.click()},upload:()=>new Promise(((t,e)=>{x.onchange=s=>{try{let e=x.files?.[0];e&&(k.onload=()=>{x.value=null,k.onload=void 0,t(k.result)},k.readAsText(e,"utf-8"))}catch(t){e(t)}},x.click()}))},L=class extends HTMLElement{connectedCallback(){let t,e=o("div",{class:"fsm-notify hide"});this.replaceWith(e),this._show=s=>{clearTimeout(t),e.innerHTML=s,e.classList.remove("hide"),t=setTimeout((()=>e.classList.add("hide")),1500)}}};customElements.define("fsm-notify",L);var S=o("fsm-notify",null);document.addEventListener("DOMContentLoaded",(()=>{document.body.appendChild(S)}),{once:!0});var F=t=>{S._show(t)},M=class extends HTMLElement{connectedCallback(){let t=o("div",{class:"menu-container"},o("button",{type:"button",id:"menu-btn",class:"img-btn"},o("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="var(--svg-color)"><circle r="10" cx="50" cy="20"/><circle r="10" cx="50" cy="50"/><circle r="10" cx="50" cy="80"/></g></svg>'})),o("div",{class:"menu menu-hidden"},[...this.children]));this.replaceWith(t);let e=t.querySelector(".menu"),s=e.querySelectorAll(".submenu");function n(i){i.target!==t&&!t.contains(i.target)&&([...s,e].forEach((t=>t.classList.add("menu-hidden"))),document.removeEventListener("pointerdown",n,{capture:!0}))}function i(t){[...t.children].forEach((t=>{"BUTTON"===t.tagName&&(t.tabIndex=0)})),document.activeElement.matches(":focus-visible")&&t.firstElementChild.focus(),t.onkeydown=e=>{"Tab"===e.key&&(!e.shiftKey&&document.activeElement===t.lastElementChild||e.shiftKey&&document.activeElement===t.firstElementChild)&&(l(t),t.onkeydown=void 0)},t.classList.remove("menu-hidden")}function l(t){t.querySelectorAll("button").forEach((t=>{t.tabIndex=-1})),t.classList.add("menu-hidden")}l(e),s.forEach(l),t.querySelector("#menu-btn").onclick=t=>{if(e.classList.contains("menu-hidden"))document.addEventListener("pointerdown",n,{capture:!0}),i(e);else{let t=!1;s.forEach((e=>{e.classList.contains("menu-hidden")||(l(e),t=!0)})),t||(l(e),document.removeEventListener("pointerdown",n,{capture:!0}))}},[...e.children].forEach((t=>{if(void 0!==t.submenu){let s=e.querySelector("#"+t.submenu);t.onclick=()=>i(s)}})),s.forEach((t=>{t.onfocusout=e=>{l(t)}}))}};customElements.define("sim-menu",M);var q=class extends HTMLElement{connectedCallback(){let s=o("fsm-canvas",{scale:2,load:!0}),n=o("sim-menu",null,o("button",{type:"button",submenu:"menu-examples"},"Examples"),o("div",{id:"menu-examples",class:"menu submenu menu-hidden"},Object.keys(_).map((t=>o("button",{type:"button",onclick:()=>{s.setFSMdata(new p(_[t]))}},t)))),o("button",{type:"button",onclick:()=>{s.setFSMdata(new p)}},"New"),o("button",{type:"button",onclick:()=>{let e=t.get("fsm");e?s.setFSMdata(new p(JSON.parse(e))):F("No saved data")}},"Load"),o("button",{type:"button",onclick:()=>{E.upload().then((t=>{s.setFSMdata(new p(JSON.parse(t)))}))}},"Upload"),o("button",{type:"button",onclick:()=>{s.fsm.string=s._get_string(),t.set("fsm",JSON.stringify(s.getFSMdata())),F("Data saved")}},"Save"),o("button",{type:"button",onclick:()=>{let t=prompt("Enter file name","fsm.json");t&&E.download(t,JSON.stringify(s.getFSMdata()))}},"Download"),o("button",{type:"button",onclick:e,class:"theme img-btn"},o("svgl",{svg:a})));this.replaceWith(o(-1,null,o("button",{type:"button",class:"img-btn home",onclick:()=>location.href="/"},o("svgl",{svg:r})),n,s))}};customElements.define("fsm-simulator",q),(()=>{let s=t.get("theme");("light"===s||void 0===s&&window.matchMedia("(prefers-color-scheme: light)")?.matches)&&e()})(),window.onload=i})();