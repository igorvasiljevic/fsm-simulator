(()=>{var t=Boolean(window.location.hostname.startsWith("127.")||window.location.hostname.startsWith("192.")||"localhost"===window.location.hostname||""===window.location.hostname||"[::1]"===window.location.hostname)?"":"/fsm-simulator",e=["/","/lessons/1.html","/lessons/2.html","/lessons/3.html","/lessons/4.html","/lessons/5.html"],s=(()=>{let s=()=>e.indexOf(window.location.pathname.replace(t,"").replace("index.html","")),i=()=>{let i=s();if(0!=i)return t+e[i-1]},o=()=>{let i=s();if(i!=e.length-1)return t+e[i+1]};return{get_previous_page:i,get_next_page:o,home:()=>{window.location.href=t+"/"},previous:()=>{window.location.href=i()},next:()=>{window.location.href=o()}}})(),i=t+"/sw.js",o={get:t=>window.localStorage?.getItem?.(t),set:(t,e)=>window.localStorage?.setItem?.(t,e),remove:t=>window.localStorage?.removeItem?.(t)},n=()=>{o.set("theme",document.documentElement.classList.toggle("light")?"light":"dark")},l=-1;function a(t,e={},...s){let i=t===l?document.createDocumentFragment():"svgl"===t?function(t){let e=document.createElement("div");return e.innerHTML=t,e.firstChild}(e.svg):e?.xmlns?document.createElementNS(e.xmlns,t):document.createElement(t);e?.svg;for(let t in e)if("style"===t)for(let t in e.style)i.style[t]=e.style[t];else!t.startsWith("on")&&"disabled"!==t&&(t in i||"class"===t||t.startsWith("data-")||t.startsWith("aria-"))?i.setAttributeNS(null,t,e[t]):i[t]=e[t];return i.append(...s.flat()),i}var r='<svg viewBox="-50 -50 100 100" stroke="var(--svg-color)" stroke-width="4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><path fill="var(--svg-color)" d="M0 20a1 1 0 0 0 0-40"/><path fill="none" stroke-width="4.5" d="M0-20a1 1 0 0 0 0 40m0 13v13m0-79v-13M-33 0h-13m79 0h13m-71-25-8-8m8 58-8 8m58-8 8 8m-8-58 8-8"/></svg>',c='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="5" stroke-linecap="round" d="m10 45 40-30 40 30m-64 5v35h16V65h16v20h16V50"/></svg>',d=class extends HTMLElement{connectedCallback(){let t=this.hasAttribute("home"),e=this.getAttribute("text")||"Konačni Automati";this.replaceWith(a("header",{class:"fsm-header"},a("div",{class:"topbar"},t?"":a("button",{type:"button",class:"topbar mra",onclick:s.home},a("svgl",{svg:c}),a("span",null,"Početna")),a("button",{type:"button",class:"topbar mla",onclick:n,title:"Promijeni temu","aria-label":"Promijeni temu"},a("svgl",{svg:r}))),a(t?"h1":"h2",null,e),t?a("h4",null,"Igor Vasiljević"):"",a("hr",null)))}};customElements.define("fsm-header",d);var f=class extends HTMLElement{connectedCallback(){let t=void 0!==s.get_previous_page(),e=void 0!==s.get_next_page(),i=!t&&e?"Počni":"Dalje";this.replaceWith(a("footer",{class:"fsm-footer"},a("hr",null),a("nav",null,t?a("button",{type:"button",onclick:s.previous},a("span",{class:"rp"},"<"),"Nazad"):"",t&&e?a("span",null,"•"):"",e?a("button",{type:"button",onclick:s.next},i,a("span",{class:"lp"},">")):"")))}};customElements.define("fsm-footer",f);var m,p,_,h=(t,e=-1/0,s=1/0)=>Math.min(Math.max(t,e),s),u=t=>t.offsetTop+(t.offsetParent?u(t.offsetParent):0),g=()=>{document.removeEventListener("pointerdown",m,{capture:!0}),m=void 0},v=navigator?.userAgentData?navigator.userAgentData.mobile:Boolean(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))),y="$",w=0,b=2,x=class{constructor({type:t,states:e,initial_state:s,final_states:i,transitions:o,state_info:n,string:l}={}){this.type=t??w,this.states=new Set(e),this.initial_state=s??0,this.final_states=new Set(i),this.transitions={},this.states.add(this.initial_state);for(let t in o??{})for(let e in o[t]??{})for(let s of o[t][e]??[])this.add_transition(t,s,e);this.state_info=n,this.string=l}get next_id(){let t=0;for(;this.states.has(t);)++t;return t}add_state(t){this.states.add(t),this.transitions[t]={}}remove_state(t){if(t===this.initial_state)return!1;this.final_states.delete(t),delete this.transitions[t];for(let e in this.transitions)this.remove_transition(e,t);return this.states.delete(t)}add_transition(t,e,s){s===y&&this.type!==b||(this.transitions[t]||(this.transitions[t]={}),(!this.transitions[t][s]||this.type===w)&&(this.transitions[t][s]=new Set),this.transitions[t][s].add(e))}remove_transition(t,e){for(let s in this.transitions[t])this.transitions[t][s]?.delete?.(e),0===this.transitions[t][s]?.size&&delete this.transitions[t][s]}epsilon_transition(t){let e,s=new Set([...t]);do{e=s.size;for(let t of s)if(this.transitions[t]?.$)for(let e of this.transitions[t].$)s.add(e)}while(s.size!==e);return s}start(){return this.type===b?[...this.epsilon_transition(new Set([this.initial_state]))]:[this.initial_state]}transition(t,e){let s=this.transitions[t]?.[e];return s?(this.type===b&&(s=this.epsilon_transition(s)),[...s]):[]}transition_states(t,e){return[...new Set(t.flatMap((t=>this.transition(t,e))))]}toString(){return JSON.stringify(this,((t,e)=>e instanceof Set?[...e]:e))}},k={"Initial and final":{states:[0,1],initial_state:0,final_states:[1],transitions:{0:{a:[1]}},type:0,state_info:{0:{name:"q0",x:-60,y:0},1:{name:"q1",x:60,y:0}},string:"a"},"Ends in bb":{states:[0,1,2],initial_state:0,final_states:[2],transitions:{0:{a:[0],b:[1]},1:{a:[0],b:[2]},2:{a:[0],b:[2]}},type:0,state_info:{0:{name:"q0",x:-65,y:-20},1:{name:"q1",x:0,y:70},2:{name:"q2",x:65,y:-20}},string:"aababaabb"},"Nondeterministic transition":{states:[0,1,2],initial_state:0,final_states:[],transitions:{0:{a:[1,2]}},type:1,state_info:{0:{name:"q0",x:-65,y:0},1:{name:"q1",x:65,y:-50},2:{name:"q2",x:65,y:50}},string:"aa"},"Epsilon transition":{states:[0,1,2,3,4],initial_state:0,final_states:[3,4],transitions:{0:{a:[1]},1:{$:[2],b:[3]},2:{c:[4]}},type:2,state_info:{0:{name:"q0",x:-95,y:-30},1:{name:"q1",x:0,y:-30},2:{name:"q2",x:0,y:70},3:{name:"q3",x:95,y:-30},4:{name:"q4",x:95,y:70}},string:"ad"},Fifth:{states:[0,1,2,3],initial_state:0,final_states:[3],transitions:{0:{c:[0],a:[1],b:[2]},1:{a:[1,2],c:[1]},2:{a:[1],c:[2],b:[3],$:[3]},3:{b:[3],c:[3]}},type:2,state_info:{0:{name:"q0",x:-110,y:0},1:{name:"q1",x:0,y:-110},2:{name:"q2",x:110,y:0},3:{name:"q3",x:0,y:110}},string:"ccaccaccbccbcc"}},S=class extends HTMLElement{connectedCallback(){let t,e=a("div",{class:"fsm-notify hide"});this.replaceWith(e),this._show=s=>{clearTimeout(t),e.innerHTML=s,e.classList.remove("hide"),t=setTimeout((()=>e.classList.add("hide")),1500)}}};customElements.define("fsm-notify",S);var L=a("fsm-notify",null);document.addEventListener("DOMContentLoaded",(()=>{document.body.appendChild(L)}),{once:!0});var E=t=>L._show(t),j=class extends HTMLElement{connectedCallback(){let t=a("div",{id:"state_"+this.id,class:`state${this.initial?" initial":""}${this.final?" final":""}`},a("input",{type:"text",class:"input noevents",value:this.name??"S",enterKeyHint:"done",maxLength:"10",spellcheck:!1,autocomplete:!1}));this.replaceWith(t);let e=t.firstElementChild;t.title=e.value,t._id=parseInt(this.id),t._name=e.value,t._x=this.x??0,t._y=this.y??0,t._transitions=new Set,t.ondblclick=t=>{t.stopPropagation(),e.focus()},e.onfocus=s=>{t._movable(!1),e.classList.remove("noevents"),this.onfocus?.(t)},e.ondblclick=t=>{e.setSelectionRange(0,e.value.length)},e.onkeydown=s=>{switch(s.key){case"Escape":e.value=t._name;case"Enter":e.blur()}},e.onblur=s=>{let i=e.value.trim();t.title=e.value=t._name=i||t._name,e.classList.add("noevents"),t._movable(!0)},((t,e={})=>{let s=0,i=0,o=null,n=!1;t._styles=window.getComputedStyle(t.parentElement,null),t._styles._padding_left=parseFloat(t._styles.paddingLeft),t._styles._padding_right=parseFloat(t._styles.paddingRight),t._styles._padding_top=parseFloat(t._styles.paddingTop),t._styles._padding_bottom=parseFloat(t._styles.paddingBottom),t._styles._offset_x=(t._styles._padding_left-t._styles._padding_right)/2,t._styles._offset_y=(t._styles._padding_top-t._styles._padding_bottom)/2;let l=t.offsetWidth/2+t._styles._padding_left-t._styles._offset_x,a=t.offsetWidth/2+t._styles._padding_right+t._styles._offset_x,r=t.offsetHeight/2+t._styles._padding_top-t._styles._offset_y,c=t.offsetHeight/2+t._styles._padding_bottom+t._styles._offset_y;function d(e){t.onpointermove=e?m:t=>t.stopPropagation()}function f(l){try{t.releasePointerCapture(o)}catch(t){}o=null,s=i=0,n&&e.click?.(l),n=!1}function m(e){if(e.pointerId!==o)return;e.stopPropagation();let n=t.parentElement._scale??1;t._x+=(e.clientX-s)/n,t._y+=(e.clientY-i)/n,s=e.clientX,i=e.clientY,p()}function p(){let s=t.parentElement.offsetWidth/2,i=t.parentElement.offsetHeight/2;t._x=h(t._x,l-s,s-a),t._y=h(t._y,r-i,i-c),t._offset_x=t._x-l+t.offsetLeft+s,t._offset_y=t._y-r+i,t.style.transform=`translate(${t._offset_x}px, ${t._offset_y}px)`,e.move?.()}function _({x:e,y:s}={}){t._x=e??t._x,t._y=s??t._y,p()}delete t._styles,t._move=_,t._movable=d,t.onpointerdown=function(e){if(e.target._move){o=e.pointerId;try{t.setPointerCapture(o)}catch(t){}s=e.clientX,i=e.clientY,n=!0,setTimeout((()=>n=!1),100)}},t.onpointerup=f,t.onpointercancel=f,d(!0),_(t._x??0,t._y)})(t,{click:this.onclick,move:()=>{for(let e of t._transitions)e._reposition()}})}};customElements.define("fsm-state",j);var q=-.25,z=class extends HTMLElement{connectedCallback(){let t=!this.from,e=this.from===this.to,s=a("svgl",e?{svg:'<svg width="45" height="50" xmlns="http://www.w3.org/2000/svg"><title/><g class="noevents" fill="none" stroke="var(--transition-color)" stroke-width="2"><path id="a" d="M10 43a18.5 18.5 0 1 1 24 0"/><path d="m36 31-1 12M44 36l-9.5 7"/><circle style="display:none" r="2.5" fill="var(--state-bg-color-current)" stroke="none"><animateMotion dur="0.2s" begin="indefinite" fill="freeze"><mpath href="#a"/></animateMotion></circle></g></svg>'}:{svg:'<svg style="width:60px;height:26px" xmlns="http://www.w3.org/2000/svg"><title/><g class="noevents" stroke="var(--transition-color)" stroke-width="2"><line y1="13" x2="100%" y2="13"/><path d="m0 13 10-5M0 13l10 5"/><circle style="display:none" r="2.5" cx="100%" cy="50%" fill="var(--state-bg-color-current)" stroke="none"><animate attributeName="cx" from="100%" to="0" dur="0.2s" begin="indefinite" fill="freeze"/></circle></g></svg>'}),i=a("div",{class:`transition${t?" initial":""}${e?" loop":""}`},s,a("input",{type:"text",class:"input noevents",value:t?"Start":this.value??"",disabled:t,enterKeyHint:"done",spellcheck:!1,autocomplete:!1}));this.replaceWith(i),i._from=this.from,i._to=this.to,!t&&!e&&(i._opposite=i.parentElement.querySelector(`#transition_${i._to._id}_${i._from._id}`)),i._opposite&&(i._opposite._opposite=i);let o=i.querySelector(".input");if(i._reposition=(n=!1)=>{if(t){s.style.transform="rotate(180deg)";let t=i._to._offset_x-i.offsetWidth,e=i._to._offset_y+s.clientHeight/2;i.style.transform=`translate(${t}px, ${e}px)`}else if(e){let t=i._to._offset_x+(i._to.offsetWidth-i.offsetWidth)/2,e=i._to._offset_y+(i._to.offsetHeight-s.clientHeight)/2-40;i.style.transform=`translate(${t}px, ${e}px)`}else{let t,e=i._to.offsetWidth/2,l=i._from._offset_x+e,a=i._from._offset_y+e,r=i._to._offset_x+e,c=i._to._offset_y+e,d=Math.atan2(a-c,l-r);s.style.transform=`rotate(${d}rad)`,i._opposite?(n||i._opposite._reposition(!0),l+=e*Math.cos(d+q+Math.PI),a+=e*Math.sin(d+q+Math.PI),r+=e*Math.cos(d-q),c+=e*Math.sin(d-q),t=Math.hypot(l-r,a-c)):t=Math.hypot(l-r,a-c)-2*e,s.style.width=`${t}px`,i._x=(l+r-i.offsetWidth)/2,i._y=(a+c-s.clientHeight)/2,i.style.transform=`translate(${i._x}px, ${i._y}px)`;let f=d+Math.PI/2,m=10*Math.cos(f),p=10*Math.sin(f);o.style.transform=`translate(${m}px, ${p}px)`}},i._reposition(),i._to._transitions.add(i),t)return;i._from._transitions.add(i);let n=s.querySelector("title");n.textContent=o.value,i.id=`transition_${i._from._id}_${i._to._id}`,i._value=this.value||"",i._delete=()=>{i._from._transitions.delete(i),i.remove(),i._opposite&&(delete i._opposite._opposite,i._opposite._reposition())};let l,r=s.querySelector("circle");i._animate=(t=!1)=>new Promise(((e,s)=>{r.firstElementChild.setAttributeNS(null,"dur",t?"0.15s":"0.25s"),r.firstElementChild.addEventListener("endEvent",(()=>{r.style.display="none",e()}),{once:!0}),r.style.display="initial",r.firstElementChild.beginElement()})),s.onclick=this.onclick,s.ondblclick=t=>{t?.stopPropagation?.(),setTimeout((()=>o.focus()),1)},o.onfocus=t=>{l=o.value,o.classList.remove("noevents"),this.onfocus?.(i)},o.ondblclick=t=>{o.setSelectionRange(0,o.value.length)},o.onkeydown=t=>{switch(t.key){case"Escape":o.value=i._value;case"Enter":o.blur()}},o.oninput=t=>{o.value=this.input(o.value)},o.onblur=t=>{o.classList.add("noevents");let e=[...new Set(o.value.replaceAll(",","").replaceAll(" ","").split(""))],s=e.sort().join(",");n.textContent=o.value=i._value=s||i._value,i._value?i._value!==l&&this.change?.(e):i._delete(),l=i._value},this.value||setTimeout((()=>o.focus()),100)}};customElements.define("fsm-transition",z);var P=class extends HTMLElement{connectedCallback(){let t=this.value??"",e=a("div",{class:"fsm-string"},a("input",{type:"text",placeholder:"test string",class:"fsm-string-input",value:t,enterKeyHint:"done",spellcheck:!1,autocomplete:!1}),a("div",{class:"fsm-pseudo-input"},t));this.replaceWith(e);let s=e.querySelector(".fsm-string-input"),i=e.querySelector(".fsm-pseudo-input");e._get_value=()=>s.value,e._set_value=t=>{i.innerText=s.value=t.replaceAll("$","")},e._highlight=t=>{if(s.disabled=!0,t<i.innerText.length){if(i.innerHTML=i.innerText.slice(0,t)+`<span class="highlight">${i.innerText[t]}</span>`+i.innerText.slice(t+1),i.scrollWidth!==i.clientWidth){let t=i.querySelector(".highlight"),e=t.offsetLeft/i.scrollWidth*(i.clientWidth-3*t.offsetWidth),s=Math.round(t.offsetLeft-e-t.offsetWidth);i.scroll(s,0)}}else i.innerHTML=i.innerText},e._reset=()=>{s.disabled=!1,i.innerHTML=i.innerText,this.edit?.()},s.onfocus=()=>{v&&s.scrollIntoView()},s.onblur=t=>{i.innerText=s.value},s.onkeydown=t=>{switch(t.key){case"Escape":case"Enter":s.blur()}},s.oninput=t=>{e._set_value(s.value)}}};customElements.define("fsm-string",P);var M=class extends HTMLElement{connectedCallback(){let t,e=[],s=0,i=null,n=this.getAttribute("example"),r=a("div",{class:"fsm-canvas"}),c=a("button",{id:"pill-zoom",type:"button",class:"pill",onclick:()=>this._reset(),title:"Resetuj zoom","aria-label":"Resetuj zoom"}),d=a("button",{id:"pill-type",type:"button",class:"pill",onclick:()=>this._cycle_type(),title:"Promijeni tip automata","aria-label":"Promijeni tip automata"}),f=a("div",{class:"fsm-container fsm-edit"},a("div",{class:"pill-container"},a("button",{id:"pill-tutorial",type:"button",class:"pill small",onclick:()=>this._toggle_tutorial(),title:"Pomoć","aria-label":"Pomoć"},"?"),c,n?a("button",{id:"pill-reset",type:"button",class:"pill",title:"Resetuj automat","aria-label":"Resetuj automat",onclick:()=>this._set_fsm(new x(k[n]))},"Reset"):"",d,this.fullsize?"":a("button",{id:"pill-fullscreen",type:"button",class:"pill small",onclick:()=>this._toggle_fullscreen(),title:"Fullscreen","aria-label":"Fullscreen"},a("svgl",{class:"svg_fullscreen",svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-28-8v-20h20m16 0h20v20m0 16v20H8m-16 0h-20V8"/></svg>'}),a("svgl",{class:"svg_fullscreen_exit",svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-32-12h20v-20m24 0v20h20m0 24H12v20m-24 0V12h-20"/></svg>'}))),a("div",{class:"bottombar"},a("fsm-string",null),a("button",{id:"control-play",type:"button",class:"img-btn",onclick:()=>this._toggle_play(),title:"Play/Stop","aria-label":"Play/Stop"},a("svgl",{class:"svg_run",svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="m35 25 38 25-38 25z"/></svg>'}),a("svgl",{class:"svg_stop",svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="10" d="M-25-25h50v50h-50z"/></svg>'})),a("div",{class:"control-menu"},a("div",{class:"controls"},a("button",{id:"control-step",type:"button",class:"img-btn",title:"Dalje","aria-label":"Dalje",onpointerdown:t=>{t.target._held=!0,t.target.setPointerCapture(t.pointerId),z.bind(this)(t)},onpointerup:e=>{e.target._held=!1,e.target.releasePointerCapture(e.pointerId),clearTimeout(t)}},a("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="12" d="m34 18 35 32-35 32"/></svg>'})),a("button",{id:"control-fast",type:"button",class:"img-btn",onclick:function(t){if(s>=m._get_value().length)return m._highlight(s=0),e=this.fsm.start(),L(),void(w.at(-1).style="");for(;s<m._get_value().length;)e=this.fsm.transition_states(e,m._get_value()[s++]);m._highlight(s),L(),j(),w.at(-1).style="transform: rotate(180deg)"}.bind(this),title:"Kray","aria-label":"Kraj"},a("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="m24 28 28 22-28 22zm34 0 28 22-28 22z"/></svg>'})))),a("div",{class:"edit-menu"},a("div",{class:"tools"},a("button",{id:"tool-initial",type:"button",initial:!0,class:"img-btn",onclick:P,title:"Postavi početno","aria-label":"Postavi početno"},a("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="M-38 0h28m2 0a1 1 0 0 1 45 0A1 1 0 0 1-8 0"/><path fill="none" stroke="var(--svg-color)" stroke-width="5" d="m-24-11 14 11-14 11"/></svg>'})),a("button",{id:"tool-final",type:"button",final:!0,class:"img-btn",onclick:P,title:"Postavi finalno","aria-label":"Postavi finalno"},a("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="var(--svg-color)"><circle r="35" stroke-width="6"/><circle r="23" stroke-width="5"/></g></svg>'})),a("button",{id:"tool-transition",type:"button",transition:!0,class:"img-btn",onclick:P,title:"Nova tranzicija","aria-label":"Nova tranzicija"},a("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="8" d="m-26 26 52-52M4-26h22v22"/><circle r="7" cx="-26" cy="26" fill="var(--svg-color)"/></svg>'})),a("button",{id:"tool-delete",type:"button",delete:!0,class:"img-btn",onclick:P,title:"Izbriši stanje","aria-label":"Izbriši stanje"},a("svgl",{svg:'<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="var(--svg-color)" stroke-width="12" d="m-26-26 52 52m0-52-52 52"/></svg>'}))))),r);this.replaceWith(f);let m=f.querySelector(".fsm-string"),g=f.querySelector(".control-menu"),w=[...g.querySelectorAll("button")],S=[...f.querySelector(".tools").querySelectorAll("button")];function L(){for(let t of r.querySelectorAll(".state"))e.includes(t._id)?t.classList.add("current"):t.classList.remove("current","accepted","rejected")}function j(){let t=r.querySelectorAll(".state.current.final");if(t.length){for(let e of t)e.classList.add("accepted");E('<span style="color:var(--state-bg-color-accepted)">Riječ prihvaćena</span>')}else{for(let t of r.querySelectorAll(".state.current"))t.classList.add("rejected");E('<span style="color:var(--state-bg-color-rejected)">Riječ neprihvaćena</span>')}}let q=!1;function z(i,o=!0){if(q||!o&&!i.target._held||s>=m._get_value().length)return;if(q=!0,o)for(let t of r.querySelectorAll(".state.current"))t.classList.remove("current");let n=m._get_value()[s],l=[];for(let t of e)if(this.fsm.transitions[t]?.[n])for(let e of this.fsm.transitions[t][n])l.push(r.querySelector(`#transition_${t}_${e}`));let a=new Set;for(let t of e)if(this.fsm.transitions[t]?.[n]){let e,s=new Set([...this.fsm.transitions[t][n]]);do{e=s.size;for(let t of s)if(this.fsm.transitions[t]?.$)for(let e of this.fsm.transitions[t].$){s.add(e);let i=r.querySelector(`#transition_${t}_${e}`);l.includes(i)||a.add(i)}}while(e!==s.size)}Promise.all(l.map((t=>t._animate()))).then((()=>Promise.all([...a].map((t=>t._animate(!0)))))).then((()=>{e=this.fsm.transition_states(e,n),m._highlight(++s),L(),s===m._get_value().length&&(j(),w.at(-1).style="transform: rotate(180deg)"),q=!1,t=setTimeout((()=>z.bind(this)(i,!1)),o?200:0)})).catch(console.log)}function P(t){i?.classList.remove("selected"),i=null;for(let e of S)e===t?.target?e.classList.toggle("tool-selected"):e.classList.remove("tool-selected")}this._toggle_fullscreen=()=>{var t;this._stop_tutorial(),t=f,document.documentElement.classList.toggle("fullscreen"),(([_,p]=[p,void 0])[0]??(p=t)).classList.toggle("fullscreen")||(t=>{window.scrollTo(0,u(t)-window.innerHeight/2+t.clientHeight/2)})(f)},this._edit_mode=()=>{if(!f.classList.contains("fsm-edit")){for(let t of w)t.disabled=!0;for(let t of S)t.disabled=!1;r.ondblclick=N,m._reset(),e=[],L(),f.classList.add("fsm-edit")}},this._play_mode=()=>new Promise(((t,i)=>{if(f.classList.contains("fsm-edit")){w.at(-1).style="";for(let t of w)t.disabled=!1;for(let t of S)t.disabled=!0,t.classList.remove("tool-selected");r.ondblclick=void 0,m._highlight(s=0),e=this.fsm.start(),L(),s>=m._get_value().length&&j(),f.classList.remove("fsm-edit"),g.ontransitionend=e=>{e.target===g&&t()}}})),this._toggle_play=()=>{f.classList.contains("fsm-edit")?this._play_mode():this._edit_mode()};let M=t=>{let e=f.querySelector(".tool-selected");if(!e)return;let s=t.target.parentElement;e.delete&&(this.fsm.remove_transition(s._from._id,s._to._id),s._delete())},W=t=>{let e=f.querySelector(".tool-selected");if(e)if(e.delete){if(this.fsm.remove_state(t.target._id)){let e=t.target;this.fsm.remove_state(t.target._id);for(let t of e._transitions)t.remove();e.remove()}}else if(e.initial){let e=r.querySelector(".state.initial"),s=t.target;if(e===s)return;let i=r.querySelector(".transition.initial");e._transitions.delete(i),e.classList.remove("initial"),i.remove(),this.fsm.initial_state=t.target._id;let o=a("fsm-transition",{to:s});r.appendChild(o),s.classList.add("initial")}else if(e.final)this.fsm.final_states.has(t.target._id)?(this.fsm.final_states.delete(t.target._id),t.target.classList.remove("final")):(this.fsm.final_states.add(t.target._id),t.target.classList.add("final"));else if(e.transition)if(i){let e=i,s=t.target;i=null,e.classList.remove("selected");let o=r.querySelector(`#transition_${e._id}_${s._id}`);if(o)return void o.querySelector("svg").ondblclick();r.appendChild(a("fsm-transition",{from:e,to:s,onclick:M,onfocus:v?H:B,input:t=>(t=new Set(t.replaceAll(",","").split("")),this.fsm.type!==b&&t.delete("$"),[...t].join()),change:t=>{this.fsm.remove_transition(e._id,s._id);for(let i of t)this.fsm.add_transition(e._id,s._id,i);this._reset_fsm()}}))}else i=t.target,i.classList.add("selected")},H=t=>{t.scrollIntoViewIfNeeded()};r._styles=window.getComputedStyle(r,null);let $=parseFloat(r._styles.paddingLeft),C=parseFloat(r._styles.paddingRight),T=parseFloat(r._styles.paddingTop),A=parseFloat(r._styles.paddingBottom);delete r._styles;let I,B=t=>{let e=(t._to._offset_x+$)*r._scale+r._x,s=(t._to._offset_y+T)*r._scale+r._y,i=(t._from._offset_x+$)*r._scale+r._x,o=(t._from._offset_y+T)*r._scale+r._y;(e<$||e>f.offsetWidth-t._to.offsetWidth*r._scale-C||s<T||s>f.offsetHeight-t._to.offsetHeight*r._scale-A||i<$||i>f.offsetWidth-t._from.offsetWidth*r._scale-C||o<T||o>f.offsetHeight-t._from.offsetHeight*r._scale-A)&&r._pan_to({x:(t._to._x+t._from._x)/2,y:(t._to._y+t._from._y)/2})},D=t=>{let e=(t._offset_x+$)*r._scale+r._x,s=(t._offset_y+T)*r._scale+r._y;(e<$||e>f.offsetWidth-t.offsetWidth*r._scale-C||s<T||s>f.offsetHeight-t.offsetHeight*r._scale-A)&&r._pan_to({x:t._x,y:t._y})};((t,e,s)=>{t._scale=1;let i=0,o=0,n={},l=0;function a(t){let e=n[t.pointerId]?.target;!e||(delete n[t.pointerId],[i,o]=c(),l=d(),delete e._dragged)}function r(i,o,n){let l=t.parentElement.getBoundingClientRect();i-=l.left,o-=l.top;let a=(t._x-i)/t._scale,r=(t._y-o)/t._scale;t._scale=h(t._scale*(1+n*s),t.parentElement.offsetWidth/t.offsetWidth,e),t._x=a*t._scale+i,t._y=r*t._scale+o,f()}function c(){let t=Object.values(n),e=0,s=0;for(let{clientX:i,clientY:o}of t)e+=i,s+=o;return e/=t.length,s/=t.length,[e,s]}function d(){let t=Object.values(n);if(2===t.length&&t[0].target===t[1].target){let e=t[0].clientX-t[1].clientX,s=t[0].clientY-t[1].clientY;return Math.sqrt(e*e+s*s)}return 0}function f(){t._x=h(t._x,t.parentElement.offsetWidth-t.offsetWidth*t._scale,0),t._y=h(t._y,t.parentElement.offsetHeight-t.offsetHeight*t._scale,0),t._offset_x=t._x+t.offsetWidth*(t._scale-1)/2,t._offset_y=t._y+t.offsetHeight*(t._scale-1)/2,t.style.transform=`translate(${t._offset_x}px, ${t._offset_y}px) scale(${t._scale})`,t._change?.()}function m(){t._x=(t.parentElement.offsetWidth-t.offsetWidth*t._scale)/2,t._y=(t.parentElement.offsetHeight-t.offsetHeight*t._scale)/2,f()}t.onpointerdown=function(t){!t.target._pan||(n[t.pointerId]=t,t.target.setPointerCapture(t.pointerId),[i,o]=c(),l=d())},t.onpointerup=a,t.onpointermove=function(e){let s=n[e.pointerId]?.target;if(!s)return;e.preventDefault(),n[e.pointerId]=e,s._dragged=!0;let[a,m]=c();t._x+=a-i,t._y+=m-o,i=a,o=m;let p=d(),_=(p-l)/50;l=p,_?r(a,m,_):f()},t.onpointerleave=a,t.onpointercancel=a,t.onwheel=function(t){t.preventDefault(),r(t.clientX,t.clientY,h(t.wheelDelta??t.deltaY,-1,1))},t._pan=function({x:e,y:s}){t._x=e??t._x,t._y=s??t._y,f()},t._pan_to=function({x:e,y:s}){let i=(t.parentElement.offsetWidth-t.offsetWidth*t._scale)/2,o=(t.parentElement.offsetHeight-t.offsetHeight*t._scale)/2;t._x=i-e*t._scale,t._y=o-s*t._scale,f()},t._center=m,t._reset=function(){t._scale=1,m()}})(r,2,.1),new ResizeObserver((()=>{this._stop_tutorial(),r._center?.();for(let t of r.querySelectorAll(".state"))t._move();if(v)if(document.activeElement?.classList.contains("input")){I=document.activeElement;let t=document.activeElement.parentElement;t.classList.contains("state")?D(t):t.classList.contains("transition")&&B(t,!0)}else if(I){let t=I.parentElement;I=null,t.classList.contains("state")?D(t):t.classList.contains("transition")&&B(t,!0)}})).observe(f),f.onscroll=t=>{t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),f.scroll(0,0)};let N=t=>{this._stop_tutorial();let e=window.getComputedStyle(r,null),s=parseFloat(e.paddingLeft)-parseFloat(e.paddingRight),i=parseFloat(e.paddingTop)-parseFloat(e.paddingBottom),o=this.fsm.next_id;this.fsm.add_state(o),r.appendChild(a("fsm-state",{id:o,name:`q${o}`,x:t.offsetX-(r.offsetWidth+s)/2,y:t.offsetY-(r.offsetHeight+i)/2,onclick:W,onfocus:v?H:D}))};r.ondblclick=N,r.onmousedown=t=>{t.detail>1&&t.preventDefault()},r._change=()=>{c.innerText=`${parseInt(100*r._scale)}%`,this._stop_tutorial()},this._stop_tutorial=()=>{let t=document.getElementById("fsm-tutorials");t&&(t.remove(),f.querySelector("#pill-tutorial").classList.remove("tutorial-open"))},this._toggle_tutorial=()=>{let t=f.querySelector("#pill-tutorial"),e=document.getElementById("fsm-tutorials");if(e)return e.remove(),t.classList.remove("tutorial-open"),void this._edit_mode();t.classList.add("tutorial-open"),this._reset();let s,i=[{arrow_direction:"arrow-top",target:f,onclick:0,content:`Povuci radnu površinu ili stanje ${v?"prstom":"mišem"} da bi ih pomjerio ili ${v?"koristi dva prsta":"skrolaj"} za zoom`},{arrow_direction:"arrow-top",target:f.querySelector(".state.initial"),onclick:0,content:a(l,null,"Dupli ",v?"pritisak":"klik"," na stanje da mu promijeniš ime",a("br",null),a("br",null),"Dupli ",v?"pritisak":"klik"," na prijelaz da mu promijeniš simbole")},{arrow_direction:"arrow-top",target:f.querySelector("#pill-zoom"),onclick:0,content:"Resetuj zoom i centriraj radnu površinu"},{arrow_direction:"arrow-top",target:f.querySelector("#pill-reset"),onclick:0,content:"Resetuj automat na početnu vrijednost"},{arrow_direction:"arrow-top",target:f.querySelector("#pill-type"),onclick:0,content:a(l,null,"Prođi redom kroz tipove automata",a("br",null),a("span",{class:"equation"},"DKA → NKA → ε-NKA"),a("br",null),a("br",null),"Pažnja! Promijena tipa može obrisati stanja")},{arrow_direction:"arrow-top",target:f.querySelector("#pill-fullscreen"),onclick:0,content:"Prikaži na punom ekranu ako ti treba prostora"},{arrow_direction:"arrow-right",target:f.querySelector("#tool-delete"),onclick:0,content:`Odaberi alatku i ${v?"pritisni":"klikni"} na stanje ili prijelaz da ga izbrišeš`},{arrow_direction:"arrow-right",target:f.querySelector("#tool-transition"),onclick:0,content:`odaj prelaz tako što odabereš ovu alatku i ${v?"pritisneš":"klikneš"} na polazno i onda odredišno stanje`},{arrow_direction:"arrow-right",target:f.querySelector("#tool-final"),onclick:0,content:"Označi stanje finalnim ili ga ukloni iz skupa finalnih stanja"},{arrow_direction:"arrow-right",target:f.querySelector("#tool-initial"),onclick:0,content:"Postavi stanje na početno"},{arrow_direction:"arrow-bottom",target:f.querySelector("#control-play"),onclick:()=>{s.classList.add("hidden"),this._play_mode().then(r)},content:"Pokreni play mod za testiranje prihvaćenosti riječi"},{arrow_direction:"arrow-bottom",target:f.querySelector("#control-play"),onclick:0,content:"Pritisni stop za povratak na uređivanje"},{arrow_direction:"arrow-bottom",target:f.querySelector("#control-step"),onclick:0,content:a(l,null,"Dalje da uneseš jedan simbol iz ulazne riječi",a("br",null),a("br",null),"Drži dugme dalje za spori prolazak kroz sve simbole ulazne riječi")},{arrow_direction:"arrow-bottom",target:f.querySelector("#control-fast"),onclick:0,content:"Pritisni kraj da odmah testiraš cijelu ulaznu riječ"},{arrow_direction:"arrow-bottom",target:f.querySelector(".fsm-string"),onclick:0,content:"Označeni simbol ulazne riječi označava sljedeći simbol za čitanje"}].filter((({target:t})=>Boolean(t))),o=()=>{let t=10,e=document.body.getBoundingClientRect(),i=s.target_el.getBoundingClientRect();s.target_el===f&&(i={left:e.width/2,top:i.top+.25*i.height,width:0,height:0});let o=(i.left+i.width/2)/document.documentElement.offsetWidth*s.offsetWidth-t;o=h(o,20,s.offsetWidth-20-t);let n=i.left-e.left,l=(i.top+ +i.height/2)/document.documentElement.offsetHeight*s.offsetHeight-t;l=h(l,20,s.offsetHeight-20-t);let a=i.top-e.top;s.classList.contains("arrow-top")?(document.documentElement.style.setProperty("--arrow-left",o+"px"),n-=o+t-i.width/2,a+=18+i.height):s.classList.contains("arrow-bottom")?(document.documentElement.style.setProperty("--arrow-left",o+"px"),n-=o+t-i.width/2,a-=18+s.offsetHeight):s.classList.contains("arrow-left")?(document.documentElement.style.setProperty("--arrow-top",l+"px"),n+=18+i.width,a-=l+t-i.height/2):s.classList.contains("arrow-right")&&(document.documentElement.style.setProperty("--arrow-top",l+"px"),n-=18+s.offsetWidth,a-=l+t-i.height/2),n=h(n,0,e.width-s.offsetWidth),a=h(a,0,e.height-s.offsetHeight),s.style.left=n+"px",s.style.top=a+"px"};new ResizeObserver(o).observe(document.body);let n=t=>{s=t,t.classList.remove("hidden"),o()},r=()=>{s.classList.add("hidden");let t=s.nextElementSibling;if(!t)return this._toggle_tutorial();n(t)},c=a("div",{id:"fsm-tutorials"},i.map((({arrow_direction:t,target:e,onclick:s,content:o},n)=>a("div",{class:`hidden ${t}`,target_el:e,onclick:s||r},a("div",{class:"tutorial-content"},o),a("div",{class:"tutorial-num"},n+1,"/",i.length),a("div",{class:"tutorial-next"},n+1===i.length?a(l,null,"Close ×"):a(l,null,"Next →"))))));document.body.append(c),n(c.firstElementChild)},this._reset=(t=!0)=>{t&&r._reset?.(),this._edit_mode()},this._reset_fsm=()=>{this._set_fsm(new x(this._get_fsm()),!1)},this._cycle_type=()=>{!f.classList.contains("fsm-edit")||(this.fsm.type=(this.fsm.type+1)%3,d.innerText=["DKA","NKA","ɛ-NKA"][this.fsm.type],this._reset_fsm())},this._get_fsm=()=>{let t=this.fsm;t.state_info={},this.fsm.string=m._get_value();for(let e of this.fsm.states){let s=r.querySelector(`#state_${e}`);t.state_info[e]={name:s._name,x:s._x,y:s._y}}return t},this._set_fsm=(t,e=!0)=>{r.innerHTML="",this.fsm=t;let s=document.createDocumentFragment();for(let e of t.states)s.appendChild(a("fsm-state",{id:e,name:t.state_info?.[e]?.name??`q${e}`,x:t.state_info?.[e]?.x??0,y:t.state_info?.[e]?.y??0,initial:t.initial_state===e,final:t.final_states.has(e),onclick:W,onfocus:v?H:D}));r.appendChild(s),s.innerHTML="";for(let t of r.querySelectorAll(".state")){t.classList.contains("initial")&&s.appendChild(a("fsm-transition",{to:t}));let e={};for(let s in this.fsm.transitions[t._id])for(let i of[...this.fsm.transitions[t._id][s]])e[i]?e[i].push(s):e[i]=[s];for(let i in e){let o=t,n=r.querySelector(`#state_${i}`);s.appendChild(a("fsm-transition",{from:o,to:n,value:e[i].sort().join(","),onclick:M,onfocus:v?H:B,input:t=>(t=new Set(t.replaceAll(",","").split("")),this.fsm.type!==b&&t.delete(y),[...t].join()),change:t=>{this.fsm.remove_transition(o._id,n._id);for(let e of t)this.fsm.add_transition(o._id,n._id,e);this._reset_fsm()}}))}}r.appendChild(s),d.innerText=["DKA","NKA","ɛ-NKA"][this.fsm.type],this._reset(e)},this._set_fsm(this.load?new x(JSON.parse(o.get("fsm")||"{}")):n?new x(k[n]):new x),this.fsm.string&&m._set_value(this.fsm.string)}};document.addEventListener("DOMContentLoaded",(()=>{customElements.define("fsm-canvas",M)}),{once:!0});var W=a("a",{download:"fsm.json",style:{display:"none"},onclick:t=>t.stopPropagation()}),H=a("input",{type:"file",accept:".json",style:{display:"none"},onclick:t=>t.stopPropagation()}),$=new FileReader;document.addEventListener("DOMContentLoaded",(()=>{document.body.append(W,H)}),{once:!0});var C={download:(t,e)=>{W.setAttribute("download",t),W.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),W.click()},upload:()=>new Promise(((t,e)=>{H.onchange=s=>{try{let e=H.files?.[0];e&&($.onload=()=>{H.value=null,$.onload=void 0,t($.result)},$.readAsText(e,"utf-8"))}catch(t){e(t)}},H.click()}))},T=class extends HTMLElement{connectedCallback(){let t=a("div",{class:"menu-container"},a("button",{type:"button",id:"menu-btn",class:"img-btn",title:"Meni","aria-label":"Meni"},a("svgl",{svg:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="var(--svg-color)"><circle r="10" cx="50" cy="20"/><circle r="10" cx="50" cy="50"/><circle r="10" cx="50" cy="80"/></g></svg>'})),a("div",{class:"menu menu-hidden"},[...this.children]));this.replaceWith(t);let e=t.querySelector(".menu"),s=[],i=t=>{for(let e of t.querySelectorAll("button"))e.disabled=!0;t.classList.add("menu-hidden")};i(e);let o=()=>{for(;s.length;)s.pop().classList.add("menu-hidden");i(e)},n=t=>{s.push(t);for(let e of t.querySelectorAll(":scope > button"))e.disabled=!1;document.activeElement.matches(":focus-visible")&&t.firstElementChild.focus(),t.onkeydown=e=>{"Tab"===e.key&&(!e.shiftKey&&document.activeElement===t.lastElementChild||e.shiftKey&&document.activeElement===t.firstElementChild)&&(t.onkeydown=void 0,i(s.pop()))},t.classList.remove("menu-hidden")};t.onclick=l=>{"menu-btn"===l.target.id?0===s.length?(((t,e)=>{m=s=>{s.target!==t&&!t.contains(s.target)&&(e?.(),g())},document.addEventListener("pointerdown",m,{capture:!0})})(t,o),n(e)):(i(s.pop()),0===s.length&&g()):l.target.submenu&&n(e.querySelector("#"+l.target.submenu))}}};customElements.define("fsm-menu",T);var A=class extends HTMLElement{connectedCallback(){let t=a("fsm-canvas",{load:!0,fullsize:!0}),e=a("fsm-menu",null,a("button",{type:"button",submenu:"menu-examples"},"Examples"),a("div",{id:"menu-examples",class:"menu submenu menu-hidden"},Object.keys(k).map((e=>a("button",{type:"button",onclick:()=>t._set_fsm(new x(k[e]))},e)))),a("button",{type:"button",onclick:()=>{t._set_fsm(new x)}},"New"),a("button",{type:"button",onclick:()=>{let e=o.get("fsm");e?t._set_fsm(new x(JSON.parse(e))):E("Nema spašenih podataka")}},"Load"),a("button",{type:"button",onclick:()=>{C.upload().then((e=>t._set_fsm(new x(JSON.parse(e)))))}},"Upload"),a("button",{type:"button",onclick:()=>{o.set("fsm",t._get_fsm().toString()),E("Podaci spašeni")}},"Save"),a("button",{type:"button",onclick:()=>{let e=prompt("Unesi ime fajla","ka.json");e&&C.download(e,t._get_fsm().toString())}},"Download"),a("button",{type:"button",onclick:n,class:"theme img-btn",title:"Promijeni temu","aria-label":"Promijeni temu"},a("svgl",{svg:r})));this.replaceWith(a(l,null,a("button",{type:"button",class:"img-btn home",onclick:s.home,title:"Početna","aria-label":"Početna"},a("svgl",{svg:c})),e,t))}};customElements.define("fsm-simulator",A),"serviceWorker"in navigator&&navigator.serviceWorker.register(i),(()=>{let t=o.get("theme");("light"===t||void 0===t&&window.matchMedia("(prefers-color-scheme: light)")?.matches)&&n()})()})();