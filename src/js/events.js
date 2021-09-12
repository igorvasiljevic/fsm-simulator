import { clamp } from './util.js';

export const move = (element, callback = {}) => {    

    let old_x = 0;
    let old_y = 0;
    let pointer_id = null;

    let clicked = false;
    let moved = false;

    element._styles = window.getComputedStyle(element.parentElement, null);
    element._styles._padding_left   = parseFloat(element._styles.paddingLeft);
    element._styles._padding_right  = parseFloat(element._styles.paddingRight);
    element._styles._padding_top    = parseFloat(element._styles.paddingTop);
    element._styles._padding_bottom = parseFloat(element._styles.paddingBottom);
    element._styles._offset_x = (element._styles._padding_left - element._styles._padding_right)/2;
    element._styles._offset_y = (element._styles._padding_top - element._styles._padding_bottom)/2;
    const min_x = element.offsetWidth/2  + element._styles._padding_left   - element._styles._offset_x;
    const max_x = element.offsetWidth/2  + element._styles._padding_right  + element._styles._offset_x;
    const min_y = element.offsetHeight/2 + element._styles._padding_top    - element._styles._offset_y;
    const max_y = element.offsetHeight/2 + element._styles._padding_bottom + element._styles._offset_y;
    delete element._styles;

    element._move = move;
    element._movable = movable;

    element.onpointerdown   = pointer_down;
    element.onpointerup     = pointer_up;
    element.onpointercancel = pointer_up;
    movable(true);

    move(element._pos_x ?? 0, element._pos_y ?? 0);

    function movable(enabled) {
        element.onpointermove = enabled ?
            pointer_move :
            e => e.stopPropagation();
    }

    function pointer_down(e) {
        pointer_id = e.pointerId;
        element.setPointerCapture(pointer_id);
        old_x = e.clientX;
        old_y = e.clientY;

        clicked = true;
        setTimeout(() => {
            if(moved)
                clicked = false;
        }, 100);

        callback.pointer_down?.(e);
    }

    function pointer_up(e) {
        try {
            element.releasePointerCapture(pointer_id);
        } catch(err) {}
        pointer_id = null;

        old_x = 0;
        old_y = 0;

        callback.pointer_up?.(e);

        if(clicked)
            callback.click?.(e);

        clicked = moved = false;
    }

    function pointer_move(e) {
        if(e.pointerId !== pointer_id)
            return;

        moved = true;

        e.stopPropagation();
        const parent_scale = element.parentElement._scale ?? 1;
        element._pos_x += (e.clientX - old_x) / parent_scale;
        element._pos_y += (e.clientY - old_y) / parent_scale;
        old_x = e.clientX;
        old_y = e.clientY;

        update();
    }

    function update() {
        const phw = element.parentElement.offsetWidth/2;
        const phh = element.parentElement.offsetHeight/2;

        element._pos_x = clamp(element._pos_x, min_x - phw, phw - max_x);
        element._pos_y = clamp(element._pos_y, min_y - phh, phh - max_y);
        
        element._offset_x = element._pos_x - min_x + phw;
        element._offset_y = element._pos_y - min_y + phh;
        element.style.transform = `translate(${element._offset_x}px, ${element._offset_y}px)`;
    
        callback.move?.();
    }

    function move({x, y} = {}) {
        element._pos_x = x ?? element._pos_x;
        element._pos_y = y ?? element._pos_y;
        update();
    }

}

export const panzoom = (element, scale_max, scale_velocity) => {

    element._scale = 1;

    let old_x = 0;
    let old_y = 0;
    let pointers = {};
    let old_pinch_distance = 0;

    // apply initial position and scale
    // center();

    element.onpointerdown   = pointer_down;
    element.onpointerup     = pointer_up;
    element.onpointermove   = pointer_move;
    element.onpointerleave  = pointer_up;
    element.onpointercancel = pointer_up;
    element.onwheel         = zooming;

    element._pan = pan;
    element._pan_to = pan_to;
    element._center = center;
    element._reset = reset;

    function pointer_down(e) {
        pointers[e.pointerId] = e;
        e.target.setPointerCapture(e.pointerId);

        [old_x, old_y] = calcAveragePosition();
        old_pinch_distance = calcPinchDistance();
    }

    function pointer_up(e) {
        const target = pointers[e.pointerId]?.target;
        if(!target) return;

        delete pointers[e.pointerId];
        
        // handle click
        // if(!target._dragged)
        //     click(target, e);



        [old_x, old_y] = calcAveragePosition();
        old_pinch_distance = calcPinchDistance();

        delete target._dragged;
    }

    function pointer_move(e) {
        const target = pointers[e.pointerId]?.target;
        if(!target) return;

        e.preventDefault();

        pointers[e.pointerId] = e;
        target._dragged = true;

        // handle panning
        const [avg_x, avg_y] = calcAveragePosition();
        element._pos_x += avg_x - old_x;
        element._pos_y += avg_y - old_y;
        old_x = avg_x;
        old_y = avg_y;

        // handle pinch zooming
        const pinch_distance = calcPinchDistance();
        let delta = (pinch_distance - old_pinch_distance)/50;
        old_pinch_distance = pinch_distance;
        if(delta)
            setZoom(avg_x, avg_y, delta);
        else
            update();
    }

    function zooming(e) {
        e.preventDefault();

        const zoom_x = e.clientX;
        const zoom_y = e.clientY;

        // get cross platform delta and
        // clamp for consistency between platforms
        const delta = clamp(
            e.wheelDelta ??
            e.deltaY
        , -1, 1);
        
        setZoom(zoom_x, zoom_y, delta);
    }

    function setZoom(zoom_x, zoom_y, delta) {
        
        // apply parent offset
        let parent_rect = element.parentElement.getBoundingClientRect();
        zoom_x -= parent_rect.left;
        zoom_y -= parent_rect.top;

        // calculate the point on where the element is zoomed in
        let zoom_target_x = (element._pos_x - zoom_x) / element._scale;
        let zoom_target_y = (element._pos_y - zoom_y) / element._scale;

        // apply zoom
        element._scale = clamp(
            element._scale * (1 + delta * scale_velocity),
            element.parentElement.offsetWidth / element.offsetWidth,
            scale_max
        );

        // calculate x and y based on zoom
        element._pos_x = zoom_target_x * element._scale + zoom_x;
        element._pos_y = zoom_target_y * element._scale + zoom_y;

        update();
    }

    function calcAveragePosition() {
        const events = Object.values(pointers);

        let avg_x = 0;
        let avg_y = 0;
        events.forEach(({clientX, clientY}) => {
            avg_x += clientX;
            avg_y += clientY;
        });
        avg_x /= events.length;
        avg_y /= events.length;

        return [avg_x, avg_y];
    }

    function calcPinchDistance() {
        const events = Object.values(pointers);
        if(events.length === 2 && events[0].target === events[1].target) {
            const dx = events[0].clientX - events[1].clientX;
            const dy = events[0].clientY - events[1].clientY;
            return Math.sqrt(dx*dx + dy*dy);
        }
        return 0;
    }
    
    function update() {
        // clamp position so element stays contained inside the parent
        element._pos_x = clamp(
            element._pos_x,
            element.parentElement.offsetWidth - element.offsetWidth * element._scale,
            0
        );
        element._pos_y = clamp(
            element._pos_y,
            element.parentElement.offsetHeight - element.offsetHeight * element._scale,
            0
        );

        let x = element._pos_x + element.offsetWidth * (element._scale - 1)/2;
        let y = element._pos_y + element.offsetHeight * (element._scale - 1)/2;

        element.style.transform = `translate(${x}px, ${y}px) scale(${element._scale})`;    

        element._change?.();
    }

    function pan({x, y}) {
        element._pos_x = x ?? element._pos_x;
        element._pos_y = y ?? element._pos_y;
        update();
    }

    function pan_to({x, y}) {
        const center_x = (element.parentElement.offsetWidth - element.offsetWidth) / 2;
        const center_y = (element.parentElement.offsetHeight - element.offsetHeight) / 2;
        element._pos_x = center_x - x;
        element._pos_y = center_y - y;
        update();
    }

    function center() {
        element._pos_x = (element.parentElement.offsetWidth - element.offsetWidth) / 2;
        element._pos_y = (element.parentElement.offsetHeight - element.offsetHeight) / 2;
        update();
    }

    function reset() {
        element._scale = 1;
        center();
    }
}