(()=>{var t={get:t=>window.localStorage?.getItem?.(t),set:(t,e)=>window.localStorage?.setItem?.(t,e),remove:t=>window.localStorage?.removeItem?.(t)},e=()=>{t.set("theme",document.documentElement.classList.toggle("light")?"light":"dark")},s=Boolean(window.location.hostname.startsWith("127.")||window.location.hostname.startsWith("192.")||"localhost"===window.location.hostname||""===window.location.hostname||"[::1]"===window.location.hostname)?"":"/fsm-simulator",i=["/","/lessons/1.html","/lessons/2.html","/lessons/3.html","/lessons/4.html"],n=(()=>{let t=()=>i.indexOf(window.location.pathname.replace(s,"").replace("index.html","")),e=()=>{let e=t();if(0!=e)return s+i[e-1]},n=()=>{let e=t();if(e!=i.length-1)return s+i[e+1]};return{get_previous_page:e,get_next_page:n,home:()=>{window.location.href=s+"/"},previous:()=>{window.location.href=e()},next:()=>{window.location.href=n()}}})(),o=s+"/sw.js";function l(t,e={},...s){let i=-1===t?document.createDocumentFragment():"svgl"===t?function(t){let e=document.createElement("div");return e.innerHTML=t,e.firstChild}(e.svg):e?.xmlns?document.createElementNS(e.xmlns,t):document.createElement(t);e?.svg;for(let t in e)if("style"===t)for(let t in e.style)i.style[t]=e.style[t];else!t.startsWith("on")&&"disabled"!==t&&(t in i||"class"===t||t.startsWith("data-")||t.startsWith("aria-"))?i.setAttributeNS(null,t,e[t]):i[t]=e[t];return i.append(...s.flat()),i}var a=t=>{console.log(t)},r='<svg viewBox="-50 -50 100 100" stroke="var(--svg-color)" stroke-width="4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><path fill="var(--svg-color)" d="M0 20a1 1 0 0 0 0-40"/><path fill="none" stroke-width="4.5" d="M0-20a1 1 0 0 0 0 40m0 13v13m0-79v-13M-33 0h-13m79 0h13m-71-25-8-8m8 58-8 8m58-8 8 8m-8-58 8-8"/></svg>',c='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="5" stroke-linecap="round" d="m10 45 40-30 40 30m-64 5v35h16V65h16v20h16V50"/></svg>',d=class extends HTMLElement{connectedCallback(){let t=this.hasAttribute("fullsize");this.replaceWith(l("header",{class:"fsm-header"},l("div",{class:"topbar"},t?"":l("button",{type:"button",class:"topbar mra",onclick:n.home},l("svgl",{svg:c}),l("span",null,"Home")),l("button",{type:"button",onclick:()=>a("bs"),class:"mla"},"Bosanski"),l("span",null,"•"),l("button",{type:"button",onclick:()=>a("en")},"English"),l("button",{type:"button",class:"topbar",onclick:e,"aria-label":"Switch theme"},l("svgl",{svg:r}))),l(t?"h1":"h2",null,"Finite-State Machines"),t?l("h4",null,"by Igor Vasiljević"):"",l("hr",null)))}};customElements.define("fsm-header",d);var f=class extends HTMLElement{connectedCallback(){let t=void 0!==n.get_previous_page(),e=void 0!==n.get_next_page(),s=!t&&e?"Start":"Next";this.replaceWith(l("footer",{class:"fsm-footer"},l("hr",null),l("nav",null,t?l("button",{type:"button",onclick:n.previous},l("span",{class:"rp"},"<"),"Previous"):"",t&&e?l("span",null,"•"):"",e?l("button",{type:"button",onclick:n.next},s,l("span",{class:"lp"},">")):"")))}};customElements.define("fsm-footer",f);var h,_,m,p=(t,e=-1/0,s=1/0)=>Math.min(Math.max(t,e),s),u=t=>t.offsetTop+(t.offsetParent?u(t.offsetParent):0),g=navigator?.userAgentData?navigator.userAgentData.mobile:Boolean(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))),v=class extends HTMLElement{connectedCallback(){let t=l("div",{id:"state_"+this.id,class:`state${this.initial?" initial":""}${this.final?" final":""}`},l("input",{type:"text",class:"input noevents",value:this.name??"S",enterKeyHint:"done",maxLength:"10",spellcheck:!1,autocomplete:!1}));this.replaceWith(t);let e=t.firstElementChild;t._id=parseInt(this.id),t._name=e.value,t._x=this.x??0,t._y=this.y??0,t._transitions=new Set,t.ondblclick=t=>{t.stopPropagation(),e.focus()},e.onfocus=s=>{t._movable(!1),e.classList.remove("noevents"),this.onfocus?.(t)},e.ondblclick=t=>{e.setSelectionRange(0,e.value.length)},e.onkeydown=s=>{switch(s.key){case"Escape":e.value=t._name;case"Enter":e.blur()}},e.onblur=s=>{let i=e.value.trim();e.value=t._name=i||t._name,e.classList.add("noevents"),t._movable(!0)},((t,e={})=>{let s=0,i=0,n=null,o=!1;t._styles=window.getComputedStyle(t.parentElement,null),t._styles._padding_left=parseFloat(t._styles.paddingLeft),t._styles._padding_right=parseFloat(t._styles.paddingRight),t._styles._padding_top=parseFloat(t._styles.paddingTop),t._styles._padding_bottom=parseFloat(t._styles.paddingBottom),t._styles._offset_x=(t._styles._padding_left-t._styles._padding_right)/2,t._styles._offset_y=(t._styles._padding_top-t._styles._padding_bottom)/2;let l=t.offsetWidth/2+t._styles._padding_left-t._styles._offset_x,a=t.offsetWidth/2+t._styles._padding_right+t._styles._offset_x,r=t.offsetHeight/2+t._styles._padding_top-t._styles._offset_y,c=t.offsetHeight/2+t._styles._padding_bottom+t._styles._offset_y;function d(e){t.onpointermove=e?h:t=>t.stopPropagation()}function f(l){try{t.releasePointerCapture(n)}catch(t){}n=null,s=i=0,o&&e.click?.(l),o=!1}function h(e){if(e.pointerId!==n)return;e.stopPropagation();let o=t.parentElement._scale??1;t._x+=(e.clientX-s)/o,t._y+=(e.clientY-i)/o,s=e.clientX,i=e.clientY,_()}function _(){let s=t.parentElement.offsetWidth/2,i=t.parentElement.offsetHeight/2;t._x=p(t._x,l-s,s-a),t._y=p(t._y,r-i,i-c),t._offset_x=t._x-l+s,t._offset_y=t._y-r+i,t.style.transform=`translate(${t._offset_x}px, ${t._offset_y}px)`,e.move?.()}function m({x:e,y:s}={}){t._x=e??t._x,t._y=s??t._y,_()}delete t._styles,t._move=m,t._movable=d,t.onpointerdown=function(e){if(e.target._move){n=e.pointerId;try{t.setPointerCapture(n)}catch(t){}s=e.clientX,i=e.clientY,o=!0,setTimeout((()=>o=!1),100)}},t.onpointerup=f,t.onpointercancel=f,d(!0),m(t._x??0,t._y)})(t,{move:()=>t._transitions.forEach((t=>t._reposition())),click:this.onclick})}};customElements.define("fsm-state",v);var y=-.25,w=class extends HTMLElement{connectedCallback(){let t=!this.from,e=this.from===this.to,s=l("svgl",e?{svg:'<svg width="45" height="50" xmlns="http://www.w3.org/2000/svg"><g class="noevents" fill="none" stroke="var(--transition-color)" stroke-width="2"><circle r="18.2" cx="50%" cy="28"/><path d="m36 31-1 12M44 36l-9.5 7"/></g></svg>'}:{svg:'<svg style="width:60px;height:26px" xmlns="http://www.w3.org/2000/svg"><g class="noevents" stroke="var(--transition-color)" stroke-width="2"><line y1="13" x2="100%" y2="13"/><path d="m0 13 10-5M0 13l10 5"/></g></svg>'}),i=l("div",{class:`transition${t?" initial":""}${e?" loop":""}`},s,l("input",{type:"text",class:"input noevents",value:t?"Start":this.value??"",disabled:t,enterKeyHint:"done",spellcheck:!1,autocomplete:!1}));this.replaceWith(i),i._from=this.from,i._to=this.to,!t&&!e&&(i._opposite=i.parentElement.querySelector(`#transition_${i._to._id}_${i._from._id}`)),i._opposite&&(i._opposite._opposite=i);let n,o=i.querySelector(".input");i._reposition=(n=!1)=>{if(t){s.style.transform="rotate(180deg)";let t=i._to._offset_x-i.offsetWidth,e=i._to._offset_y+s.clientHeight/2;i.style.transform=`translate(${t}px, ${e}px)`}else if(e){let t=i._to._offset_x+(i._to.offsetWidth-i.offsetWidth)/2,e=i._to._offset_y+(i._to.offsetHeight-s.clientHeight)/2-40;i.style.transform=`translate(${t}px, ${e}px)`}else{let t,e=i._to.offsetWidth/2,l=i._from._offset_x+e,a=i._from._offset_y+e,r=i._to._offset_x+e,c=i._to._offset_y+e,d=Math.atan2(a-c,l-r);s.style.transform=`rotate(${d}rad)`,i._opposite?(n||i._opposite._reposition(!0),l+=e*Math.cos(d+y+Math.PI),a+=e*Math.sin(d+y+Math.PI),r+=e*Math.cos(d-y),c+=e*Math.sin(d-y),t=Math.hypot(l-r,a-c)):t=Math.hypot(l-r,a-c)-2*e,s.style.width=`${t}px`,i._x=(l+r-i.offsetWidth)/2,i._y=(a+c-s.clientHeight)/2,i.style.transform=`translate(${i._x}px, ${i._y}px)`;let f=d+Math.PI/2,h=10*Math.cos(f),_=10*Math.sin(f);o.style.transform=`translate(${h}px, ${_}px)`}},i._reposition(),i._to._transitions.add(i),t||(i._from._transitions.add(i),i.id=`transition_${i._from._id}_${i._to._id}`,i._value=this.value||"",i._delete=()=>{i._from._transitions.delete(i),i.remove(),i._opposite&&(delete i._opposite._opposite,i._opposite._reposition())},s.onclick=this._click,s.ondblclick=t=>{t?.stopPropagation?.(),setTimeout((()=>o.focus()),1)},o.onfocus=t=>{n=o.value,o.classList.remove("noevents"),this.onfocus?.(i)},o.ondblclick=t=>{o.setSelectionRange(0,o.value.length)},o.onkeydown=t=>{switch(t.key){case"Escape":o.value=i._value;case"Enter":o.blur()}},o.oninput=t=>{o.value=this.input(o.value)},o.onblur=t=>{o.classList.add("noevents");let e=[...new Set(o.value.replaceAll(",","").replaceAll(" ","").split(""))],s=e.sort().join(",");o.value=i._value=s||i._value,i._value?i._value!==n&&this.change?.(e):i._delete(),n=i._value},this.value||setTimeout((()=>o.focus()),100))}};customElements.define("fsm-transition",w);var b={DFA:0,NFA:1,eNFA:2},x=class{constructor({type:t,states:e,initial_state:s,final_states:i,transitions:n,state_info:o,string:l}={}){this.type=t??b.DFA,this.states=new Set(e),this.initial_state=s??0,this.final_states=new Set(i),this.transitions={},this.states.add(this.initial_state);for(let t in n??{})for(let e in n[t]??{})for(let s of n[t][e]??[])this.add_transition(t,s,e);this.state_info=o,this.string=l}get_next_id(){let t=0;for(;this.states.has(t);)++t;return t}add_state(t){this.states.add(t),this.transitions[t]={}}remove_state(t){if(t===this.initial_state)return!1;this.final_states.delete(t),delete this.transitions[t];for(let e in this.transitions)this.remove_transition(e,t);return this.states.delete(t)}add_transition(t,e,s){"$"===s&&this.type!==b.eNFA||(this.transitions[t]||(this.transitions[t]={}),this.transitions[t][s]||(this.transitions[t][s]=new Set),this.type===b.DFA&&this.transitions[t][s].clear(),this.transitions[t][s].add(e))}remove_transition(t,e){for(let s in this.transitions[t])this.transitions[t][s]?.delete?.(e),0===this.transitions[t][s]?.size&&delete this.transitions[t][s]}epsilon_transition(t){let e,s=t;for(;s!==e;){s=t.size;let i=t;for(let e of i)if(this.transitions[e]&&this.transitions[e].$)for(let s of this.transitions[e].$)t.add(s);e=t.size}return t}start(){return this.type===b.eNFA?[...this.epsilon_transition(new Set([this.initial_state]))]:[this.initial_state]}transition(t,e){let s=this.transitions?.[t]?.[e];return s?(this.type===b.eDFA&&(s=this.epsilon_transition(s)),[...s]):[]}transition_states(t,e){let s=new Set;for(let i of t)for(let t of this.transition(i,e))s.add(t);return[...s]}toJSON(){let t=this.transitions;for(let e in t)for(let s in t[e])t[e][s]=[...t[e][s]];return{states:[...this.states],initial_state:this.initial_state,final_states:[...this.final_states],transitions:this.transitions,type:this.type,state_info:this.state_info,string:this.string}}},k={First:{states:[0],initial_state:0,final_states:[],transitions:{},type:0,state_info:{0:{name:"q0",x:0,y:0}},string:"first"},Second:{states:[0,1],initial_state:0,final_states:[1],transitions:{},type:1,state_info:{0:{name:"q0",x:-50,y:-50},1:{name:"q1",x:50,y:50}},string:"second"},Third:{states:[1,2,3],initial_state:1,final_states:[2,3],transitions:{},type:2,state_info:{1:{name:"q1",x:-50,y:-50},2:{name:"q2",x:50,y:-50},3:{name:"q3",x:50,y:50}},string:"third"},Fourth:{states:[0,1,2,3],initial_state:0,final_states:[3],transitions:{0:{c:[0],a:[1],b:[2]},1:{a:[1,2],c:[1]},2:{c:[2],b:[3]},3:{b:[3],c:[3]}},type:1,state_info:{0:{name:"q0",x:-110,y:0},1:{name:"q1",x:0,y:-110},2:{name:"q2",x:110,y:0},3:{name:"q3",x:0,y:110}},string:"ccaccaccbccbcc"},Fifth:{states:[0,1,2,3],initial_state:0,final_states:[3],transitions:{0:{c:[0],a:[1],b:[2]},1:{a:[1,2],c:[1]},2:{a:[1],c:[2],b:[3],$:[3]},3:{b:[3],c:[3]}},type:2,state_info:{0:{name:"q0",x:-110,y:0},1:{name:"q1",x:0,y:-110},2:{name:"q2",x:110,y:0},3:{name:"q3",x:0,y:110}},string:"ccaccaccbccbcc"}},E=class extends HTMLElement{connectedCallback(){let t,e=l("div",{class:"fsm-notify hide"});this.replaceWith(e),this._show=s=>{clearTimeout(t),e.innerHTML=s,e.classList.remove("hide"),t=setTimeout((()=>e.classList.add("hide")),1500)}}};customElements.define("fsm-notify",E);var L=l("fsm-notify",null);document.addEventListener("DOMContentLoaded",(()=>{document.body.appendChild(L)}),{once:!0});var S=t=>L._show(t),q=class extends HTMLElement{connectedCallback(){let t=this.value??"",e=l("div",{class:"fsm-string"},l("input",{type:"text",placeholder:"test string",class:"fsm-string-input",value:t,enterKeyHint:"done",spellcheck:!1,autocomplete:!1}),l("div",{class:"fsm-pseudo-input"},t));this.replaceWith(e);let s=e.querySelector(".fsm-string-input"),i=e.querySelector(".fsm-pseudo-input");e._get_value=()=>s.value,e._set_value=t=>{i.innerText=s.value=t.replaceAll("$","")},e._highlight=t=>{if(s.disabled=!0,i.classList.remove("hidden"),t<i.innerText.length){if(i.innerHTML=i.innerText.slice(0,t)+`<span class="highlight">${i.innerText[t]}</span>`+i.innerText.slice(t+1),i.scrollWidth!==i.clientWidth){let t=i.querySelector(".highlight"),e=t.offsetLeft/i.scrollWidth*(i.clientWidth-3*t.offsetWidth),s=Math.round(t.offsetLeft-e-t.offsetWidth);i.scroll(s,0)}}else i.innerHTML=i.innerText},e._reset=()=>{s.disabled=!1,i.innerHTML=i.innerText,i.classList.add("hidden"),this.edit?.()},s.onfocus=()=>{g&&s.scrollIntoView()},s.onblur=t=>{i.innerText=s.value},s.onkeydown=t=>{switch(t.key){case"Escape":case"Enter":s.blur()}},s.oninput=t=>{e._set_value(s.value)}}};customElements.define("fsm-string",q);var M=class extends HTMLElement{connectedCallback(){let e,s=[],i=0,n=null,o=this.getAttribute("example"),a=l("div",{class:"fsm-canvas"}),r=l("button",{type:"button",class:"pill",onclick:()=>this._reset(),"aria-label":"Reset zoom"}),c=l("button",{type:"button",class:"pill",onclick:()=>this._cycle_type(),"aria-label":"Change FSM type"}),d=l("div",{class:"fsm-container fsm-edit"},l("div",{class:"pill-container"},r,o?l("button",{type:"button",class:"pill",onclick:()=>this._set_fsm(new x(k[o]))},"Reset"):"",c,this.fullsize?"":l("button",{type:"button",class:"pill small",onclick:()=>this._toggle_fullscreen(),"aria-label":"Fullscreen"},l("svgl",{class:"svg_fullscreen",svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-28-8v-20h20m16 0h20v20m0 16v20H8m-16 0h-20V8"/></svg>'}),l("svgl",{class:"svg_fullscreen_exit",svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-32-12h20v-20m24 0v20h20m0 24H12v20m-24 0V12h-20"/></svg>'}))),l("div",{class:"bottombar"},l("fsm-string",null),l("button",{type:"button",class:"img-btn",onclick:()=>this._toggle_play(),"aria-label":"Play"},l("svgl",{class:"svg_run",svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="m35 25 38 25-38 25z"/></svg>'}),l("svgl",{class:"svg_stop",svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-25-25h50v50h-50z"/></svg>'})),l("div",{class:"control-menu"},l("div",{class:"controls"},l("button",{id:"step",type:"button",class:"img-btn","aria-label":"Step",onpointerdown:function t(n){i>=f._get_value().length||(s=this.fsm.transition_states(s,f._get_value()[i]),f._highlight(++i),w(),i===f._get_value().length&&(E(),v.at(-1).style="transform: rotate(180deg)"),e=setTimeout(t.bind(this),n?300:35))}.bind(this),onpointerup:()=>clearTimeout(e)},l("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="12" d="m34 18 35 32-35 32"/></svg>'})),l("button",{type:"button",class:"img-btn",onclick:function(t){if(i>=f._get_value().length)return f._highlight(i=0),s=this.fsm.start(),w(),void(v.at(-1).style="");for(;i<f._get_value().length;)s=this.fsm.transition_states(s,f._get_value()[i++]);f._highlight(i),w(),E(),v.at(-1).style="transform: rotate(180deg)"}.bind(this),"aria-label":"Run"},l("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="m24 28 28 22-28 22zm34 0 28 22-28 22z"/></svg>'})))),l("div",{class:"edit-menu"},l("div",{class:"tools"},l("button",{type:"button",initial:!0,class:"img-btn",onclick:L,"aria-label":"Set initial"},l("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="M-38 0h28m2 0a1 1 0 0 1 45 0A1 1 0 0 1-8 0"/><path fill="none" stroke="var(--svg-color)" stroke-width="5" d="m-24-11 14 11-14 11"/></svg>'})),l("button",{type:"button",final:!0,class:"img-btn",onclick:L,"aria-label":"Toggle final"},l("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="var(--svg-color)"><circle r="35" stroke-width="6"/><circle r="23" stroke-width="5"/></g></svg>'})),l("button",{type:"button",transition:!0,class:"img-btn",onclick:L,"aria-label":"Create transition"},l("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="m-26 26 52-52M4-26h22v22"/><circle r="7" cx="-26" cy="26" fill="var(--svg-color)"/></svg>'})),l("button",{type:"button",delete:!0,class:"img-btn",onclick:L,"aria-label":"Delete state"},l("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="12" d="m-26-26 52 52m0-52-52 52"/></svg>'}))))),a);this.replaceWith(d);let f=d.querySelector(".fsm-string"),v=[...d.querySelector(".controls").querySelectorAll("button")],y=[...d.querySelector(".tools").querySelectorAll("button")];function w(){a.querySelectorAll(".state").forEach((t=>{s.includes(t._id)?t.classList.add("current"):t.classList.remove("current","accepted","rejected")}))}function E(){let t=a.querySelectorAll(".state.current.final");t.length?(t.forEach((t=>t.classList.add("accepted"))),S('<span style="color:var(--state-bg-color-accepted)">String accepted</span>')):(a.querySelectorAll(".state.current").forEach((t=>t.classList.add("rejected"))),S('<span style="color:var(--state-bg-color-rejected)">String not accepted</span>'))}function L(t){n?.classList.remove("selected"),n=null,y.forEach((e=>e===t?.target?e.classList.toggle("tool-selected"):e.classList.remove("tool-selected")))}this._toggle_fullscreen=()=>{var t;t=d,(h?(document.body.replaceChildren(...m),h.classList.remove("fullscreen"),_.after(h),h=_=m=void 0,0):(_=(h=t).previousSibling,m=[...document.body.children],h.classList.add("fullscreen"),document.body.replaceChildren(h),1))||(t=>{window.scrollTo(0,u(t)-window.innerHeight/2+t.clientHeight/2)})(d)},this._edit_mode=()=>{v.forEach((t=>t.disabled=!0)),y.forEach((t=>t.disabled=!1)),a.ondblclick=z,f._reset(),s=[],w(),d.classList.add("fsm-edit")},this._play_mode=()=>{v.at(-1).style="",v.forEach((t=>t.disabled=!1)),y.forEach((t=>{t.disabled=!0,t.classList.remove("tool-selected")})),a.ondblclick=void 0,f._highlight(i=0),s=this.fsm.start(),w(),i>=f._get_value().length&&E(),d.classList.remove("fsm-edit")},this._toggle_play=()=>{d.classList.contains("fsm-edit")?this._play_mode():this._edit_mode()};let q=t=>{let e=d.querySelector(".tool-selected");if(!e)return;let s=t.target.parentElement;e.delete&&(this.fsm.remove_transition(s._from._id,s._to._id),s._delete())},M=t=>{let e=d.querySelector(".tool-selected");if(e)if(e.delete){if(this.fsm.remove_state(t.target._id)){let e=t.target;this.fsm.remove_state(t.target._id),e._transitions.forEach((t=>t.remove())),e.remove()}}else if(e.initial){let e=a.querySelector(".state.initial"),s=t.target;if(e===s)return;let i=a.querySelector(".transition.initial");e._transitions.delete(i),e.classList.remove("initial"),i.remove(),this.fsm.initial_state=t.target._id;let n=l("fsm-transition",{to:s});a.appendChild(n),s.classList.add("initial")}else if(e.final)this.fsm.final_states.has(t.target._id)?(this.fsm.final_states.delete(t.target._id),t.target.classList.remove("final")):(this.fsm.final_states.add(t.target._id),t.target.classList.add("final"));else if(e.transition)if(n){let e=n,s=t.target;n=null,e.classList.remove("selected");let i=a.querySelector(`#transition_${e._id}_${s._id}`);if(i)return void i.querySelector("svg").ondblclick();a.appendChild(l("fsm-transition",{from:e,to:s,onclick:q,onfocus:g?W:$,input:t=>(t=new Set(t.replaceAll(",","").split("")),this.fsm.type!==b.eNFA&&t.delete("$"),[...t].join()),change:t=>{this.fsm.remove_transition(e._id,s._id),t.forEach((t=>this.fsm.add_transition(e._id,s._id,t))),this._reset_fsm()}}))}else n=t.target,n.classList.add("selected")},W=t=>{t.scrollIntoViewIfNeeded()};a._styles=window.getComputedStyle(a,null);let H=parseFloat(a._styles.paddingLeft),A=parseFloat(a._styles.paddingRight),T=parseFloat(a._styles.paddingTop),C=parseFloat(a._styles.paddingBottom);delete a._styles;let $=t=>{let e=(t._to._offset_x+H)*a._scale+a._x,s=(t._to._offset_y+T)*a._scale+a._y,i=(t._from._offset_x+H)*a._scale+a._x,n=(t._from._offset_y+T)*a._scale+a._y;(e<H||e>d.offsetWidth-t._to.offsetWidth*a._scale-A||s<T||s>d.offsetHeight-t._to.offsetHeight*a._scale-C||i<H||i>d.offsetWidth-t._from.offsetWidth*a._scale-A||n<T||n>d.offsetHeight-t._from.offsetHeight*a._scale-C)&&a._pan_to({x:(t._to._x+t._from._x)/2,y:(t._to._y+t._from._y)/2})},F=t=>{let e=(t._offset_x+H)*a._scale+a._x,s=(t._offset_y+T)*a._scale+a._y;(e<H||e>d.offsetWidth-t.offsetWidth*a._scale-A||s<T||s>d.offsetHeight-t.offsetHeight*a._scale-C)&&a._pan_to({x:t._x,y:t._y})};((t,e,s)=>{t._scale=1;let i=0,n=0,o={},l=0;function a(t){let e=o[t.pointerId]?.target;!e||(delete o[t.pointerId],[i,n]=c(),l=d(),delete e._dragged)}function r(i,n,o){let l=t.parentElement.getBoundingClientRect();i-=l.left,n-=l.top;let a=(t._x-i)/t._scale,r=(t._y-n)/t._scale;t._scale=p(t._scale*(1+o*s),t.parentElement.offsetWidth/t.offsetWidth,e),t._x=a*t._scale+i,t._y=r*t._scale+n,f()}function c(){let t=Object.values(o),e=0,s=0;return t.forEach((({clientX:t,clientY:i})=>{e+=t,s+=i})),e/=t.length,s/=t.length,[e,s]}function d(){let t=Object.values(o);if(2===t.length&&t[0].target===t[1].target){let e=t[0].clientX-t[1].clientX,s=t[0].clientY-t[1].clientY;return Math.sqrt(e*e+s*s)}return 0}function f(){t._x=p(t._x,t.parentElement.offsetWidth-t.offsetWidth*t._scale,0),t._y=p(t._y,t.parentElement.offsetHeight-t.offsetHeight*t._scale,0),t._offset_x=t._x+t.offsetWidth*(t._scale-1)/2,t._offset_y=t._y+t.offsetHeight*(t._scale-1)/2,t.style.transform=`translate(${t._offset_x}px, ${t._offset_y}px) scale(${t._scale})`,t._change?.()}function h(){t._x=(t.parentElement.offsetWidth-t.offsetWidth*t._scale)/2,t._y=(t.parentElement.offsetHeight-t.offsetHeight*t._scale)/2,f()}t.onpointerdown=function(t){!t.target._pan||(o[t.pointerId]=t,t.target.setPointerCapture(t.pointerId),[i,n]=c(),l=d())},t.onpointerup=a,t.onpointermove=function(e){let s=o[e.pointerId]?.target;if(!s)return;e.preventDefault(),o[e.pointerId]=e,s._dragged=!0;let[a,h]=c();t._x+=a-i,t._y+=h-n,i=a,n=h;let _=d(),m=(_-l)/50;l=_,m?r(a,h,m):f()},t.onpointerleave=a,t.onpointercancel=a,t.onwheel=function(t){t.preventDefault(),r(t.clientX,t.clientY,p(t.wheelDelta??t.deltaY,-1,1))},t._pan=function({x:e,y:s}){t._x=e??t._x,t._y=s??t._y,f()},t._pan_to=function({x:e,y:s}){let i=(t.parentElement.offsetWidth-t.offsetWidth*t._scale)/2,n=(t.parentElement.offsetHeight-t.offsetHeight*t._scale)/2;t._x=i-e*t._scale,t._y=n-s*t._scale,f()},t._center=h,t._reset=function(){t._scale=1,h()}})(a,2,.1),new ResizeObserver((()=>{if(a._center(),a.querySelectorAll(".state").forEach((t=>t._move())),g&&document.activeElement?.classList.contains("input")){let t=document.activeElement.parentElement;t.classList.contains("state")?F(t):t.classList.contains("transition")&&$(t,!0)}})).observe(d),d.onscroll=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),d.scroll(0,0)};let z=t=>{let e=window.getComputedStyle(a,null),s=parseFloat(e.paddingLeft)-parseFloat(e.paddingRight),i=parseFloat(e.paddingTop)-parseFloat(e.paddingBottom),n=this.fsm.get_next_id();this.fsm.add_state(n),a.appendChild(l("fsm-state",{id:n,name:`q${n}`,x:t.offsetX-(a.offsetWidth+s)/2,y:t.offsetY-(a.offsetHeight+i)/2,onclick:M,onfocus:g?W:F}))};a.ondblclick=z,a.onmousedown=t=>{t.detail>1&&t.preventDefault()},a._change=()=>{r.innerText=`${parseInt(100*a._scale)}%`},this._reset=(t=!0)=>{t&&a._reset(),this._edit_mode()},this._reset_fsm=()=>{this._set_fsm(new x(this._get_fsm()),!1)},this._cycle_type=()=>{!d.classList.contains("fsm-edit")||(this.fsm.type=(this.fsm.type+1)%3,c.innerText=["DFA","NFA","ɛ-NFA"][this.fsm.type],this._reset_fsm())},this._get_fsm=()=>{let t=this.fsm;return t.state_info={},this.fsm.string=f._get_value(),this.fsm.states.forEach((e=>{let s=a.querySelector(`#state_${e}`);t.state_info[e]={name:s._name,x:s._x,y:s._y}})),t},this._set_fsm=(t,e=!0)=>{a.innerHTML="",this.fsm=t;let s=document.createDocumentFragment();t.states.forEach((e=>s.appendChild(l("fsm-state",{id:e,name:t.state_info?.[e]?.name??`q${e}`,x:t.state_info?.[e]?.x??0,y:t.state_info?.[e]?.y??0,initial:t.initial_state===e,final:t.final_states.has(e),onclick:M,onfocus:g?W:F})))),a.appendChild(s),s.innerHTML="",a.querySelectorAll(".state").forEach((t=>{t.classList.contains("initial")&&s.appendChild(l("fsm-transition",{to:t}));let e={};for(let s in this.fsm.transitions[t._id])for(let i of[...this.fsm.transitions[t._id][s]])e[i]?e[i].push(s):e[i]=[s];for(let i in e){let n=t,o=a.querySelector(`#state_${i}`);s.appendChild(l("fsm-transition",{from:n,to:o,value:e[i].sort().join(","),onclick:q,onfocus:g?W:$,input:t=>(t=new Set(t.replaceAll(",","").split("")),this.fsm.type!==b.eNFA&&t.delete("$"),[...t].join()),change:t=>{this.fsm.remove_transition(n._id,o._id),t.forEach((t=>this.fsm.add_transition(n._id,o._id,t))),this._reset_fsm()}}))}})),a.appendChild(s),c.innerText=["DFA","NFA","ɛ-NFA"][this.fsm.type],this._reset(e)},this._set_fsm(this.load?new x(JSON.parse(t.get("fsm")||"{}")):o?new x(k[o]):new x),this.fsm.string&&f._set_value(this.fsm.string)}};document.addEventListener("DOMContentLoaded",(()=>{customElements.define("fsm-canvas",M)}),{once:!0});var W=l("a",{download:"fsm.json",style:{display:"none"},onclick:t=>t.stopPropagation()}),H=l("input",{type:"file",accept:".json",style:{display:"none"},onclick:t=>t.stopPropagation()}),A=new FileReader;document.addEventListener("DOMContentLoaded",(()=>{document.body.append(W,H)}),{once:!0});var T={download:(t,e)=>{W.setAttribute("download",t),W.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),W.click()},upload:()=>new Promise(((t,e)=>{H.onchange=s=>{try{let e=H.files?.[0];e&&(A.onload=()=>{H.value=null,A.onload=void 0,t(A.result)},A.readAsText(e,"utf-8"))}catch(t){e(t)}},H.click()}))},C=class extends HTMLElement{connectedCallback(){let t=l("div",{class:"menu-container"},l("button",{type:"button",id:"menu-btn",class:"img-btn"},l("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="var(--svg-color)"><circle r="10" cx="50" cy="20"/><circle r="10" cx="50" cy="50"/><circle r="10" cx="50" cy="80"/></g></svg>'})),l("div",{class:"menu menu-hidden"},[...this.children]));this.replaceWith(t);let e=t.querySelector(".menu"),s=e.querySelectorAll(".submenu");function i(n){n.target!==t&&!t.contains(n.target)&&([...s,e].forEach((t=>t.classList.add("menu-hidden"))),document.removeEventListener("pointerdown",i,{capture:!0}))}function n(t){t.querySelectorAll(":scope > button").forEach((t=>t.disabled=!1)),document.activeElement.matches(":focus-visible")&&t.firstElementChild.focus(),t.onkeydown=e=>{"Tab"===e.key&&(!e.shiftKey&&document.activeElement===t.lastElementChild||e.shiftKey&&document.activeElement===t.firstElementChild)&&(o(t),t.onkeydown=void 0)},t.classList.remove("menu-hidden")}function o(t){t.querySelectorAll("button").forEach((t=>t.disabled=!0)),t.classList.add("menu-hidden")}o(e),s.forEach(o),t.querySelector("#menu-btn").onclick=()=>{if(e.classList.contains("menu-hidden"))document.addEventListener("pointerdown",i,{capture:!0}),n(e);else{let t=!1;s.forEach((e=>{e.classList.contains("menu-hidden")||(o(e),t=!0)})),t||(o(e),document.removeEventListener("pointerdown",i,{capture:!0}))}},[...e.children].forEach((t=>{if(void 0!==t.submenu){let s=e.querySelector("#"+t.submenu);t.onclick=()=>n(s)}})),s.forEach((t=>t.onfocusout=()=>o(t)))}};customElements.define("fsm-menu",C);var $=class extends HTMLElement{connectedCallback(){let s=l("fsm-canvas",{load:!0,fullsize:!0}),i=l("fsm-menu",null,l("button",{type:"button",submenu:"menu-examples"},"Examples"),l("div",{id:"menu-examples",class:"menu submenu menu-hidden"},Object.keys(k).map((t=>l("button",{type:"button",onclick:()=>{s._set_fsm(new x(k[t]))}},t)))),l("button",{type:"button",onclick:()=>{s._set_fsm(new x)}},"New"),l("button",{type:"button",onclick:()=>{let e=t.get("fsm");e?s._set_fsm(new x(JSON.parse(e))):S("No saved data")}},"Load"),l("button",{type:"button",onclick:()=>{T.upload().then((t=>s._set_fsm(new x(JSON.parse(t)))))}},"Upload"),l("button",{type:"button",onclick:()=>{t.set("fsm",JSON.stringify(s._get_fsm())),S("Data saved")}},"Save"),l("button",{type:"button",onclick:()=>{let t=prompt("Enter file name","fsm.json");t&&T.download(t,JSON.stringify(s._get_fsm()))}},"Download"),l("button",{type:"button",onclick:e,class:"theme img-btn"},l("svgl",{svg:r})));this.replaceWith(l(-1,null,l("button",{type:"button",class:"img-btn home",onclick:n.home},l("svgl",{svg:c})),i,s))}};customElements.define("fsm-simulator",$),(()=>{let s=t.get("theme");("light"===s||void 0===s&&window.matchMedia("(prefers-color-scheme: light)")?.matches)&&e()})(),window.onload=()=>{if("serviceWorker"in navigator){let t;navigator.serviceWorker.register(o),navigator.serviceWorker.addEventListener("controllerchange",(()=>{t||(t=!0,window.location.reload())}))}}})();