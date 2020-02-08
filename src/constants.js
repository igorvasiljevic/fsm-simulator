export const TAB_NAME = 'Tab';
export const MAX_TAB_NAME_LENGTH = 50;
export const TABS_RIGHT_OFFSET = -20;

export const MOUSE_BUTTONS = {
    LEFT_MOUSE: 0, MIDDLE_MOUSE: 1, RIGHT_MOUSE: 2 };

export const STATE_RADIUS = 22;
export const STATE_EDGE_PADDING = {
    TOP:45, BOTTOM:60, LEFT:20, RIGHT:20, BETWEEN:20 };

export const CANVAS_SIZE_MULTIPLIER = 2;
export const CANVAS_MIN_SIZE_MULTIPLIER = 1.5;
export const PIXEL_RATIO = (() => {
    const ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;
    return (dpr / bsr) < 2 ? 2 : (dpr / bsr);
})();
// after what number of states will the drawing on state drag be optimized
export const CANVAS_OPTIMIZATION_THRESHOLD = {
    DESKTOP:10, MOBILE:5 };


export const STRING_ACCEPTED = 'String accepted';
export const STRING_NOT_ACCEPTED = 'String not accepted';

export const TRANSITION_EVENT_NAME = (() => {
    let t;
    let el = document.createElement('fakeelement');
    let transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
})();

export const MOBILE = (() => {
    const devices = [
        'Android', 'webOS',
        'iPhone', 'iPad','iPod',
        'BlackBerry','Windows Phone'];

    for(let d in devices)
        if(navigator.userAgent.includes(devices[d]))
            return true;
})();