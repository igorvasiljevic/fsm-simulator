
function move(element, x, y) {
    x = element.clientWidth > element.parentElement.clientWidth ? 
            clamp(x, element.parentElement.clientWidth - element.clientWidth, 0) :
            clamp(x, 0, element.parentElement.clientWidth - element.clientWidth);

    y = element.clientHeight > element.parentElement.clientHeight ? 
        clamp(y, element.parentElement.clientHeight - element.clientHeight, 0) :
        clamp(y, 0, element.parentElement.clientHeight - element.clientHeight);

    element.style.transform = `translate(${x}px, ${y}px)`;
}


function Events(element, events) {

    const stop = () => {
        element.onmouseup = null;
        element.onmousemove = null;
        element.ondblclick = null;
        element.onmouseleave = null;

        element.ontouchend = null;
        element.ontouchmove = null;
        element.ontouchcancel =  null;
    }

    element.onmousedown = e1 => {
        e1.stopPropagation();

        let selected = e1.target;

        element.onmouseleave = stop;
        
        element.onmouseup = e2 => {
            e2.stopPropagation();
            element.onmousemove = null;

            if(events.click) events.click(e1);
        }

        if(events.move) {
            element.onmousemove = e2 => {
                e2.preventDefault();
                element.onmouseup = stop;

                events.move(selected, e2);
            }
        }

        if(events.dblclick) {
            element.ondblclick = e2 => {
                events.dblclick(e2);
            }
        }
        
    }

    element.onwheel = events.wheel;


    let old_touches = {};
    element.ontouchstart = e1 => {
        element.ontouchcancel = stop;

        element.ontouchend = e2 => {
            for(let end_touch of e2.changedTouches)
                delete old_touches[end_touch.target.id];
        }


        for(let old_touch of e1.changedTouches) {
            old_touches[old_touch.target.id] = {
                x: old_touch.pageX,
                y: old_touch.pageY
            };
        }

        if(events.move) {
            element.ontouchmove = e2 => {
                e2.preventDefault();

                for(let touch of e2.changedTouches) {                        
                    if(old_touches[touch.target.id]) {
                        e2.movementX = touch.pageX - old_touches[touch.target.id].x;
                        e2.movementY = touch.pageY - old_touches[touch.target.id].y;
                        old_touches[touch.target.id].x = touch.pageX;
                        old_touches[touch.target.id].y = touch.pageY;

                        events.move(touch.target, e2);
                    }
                }
        
            }
        }


    }
}