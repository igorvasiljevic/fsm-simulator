
export const clamp = (
    num,
    min = -Infinity,
    max = Infinity
) =>
    Math.min(Math.max(num, min), max);

export const top_offset = element =>
    element.offsetTop + ( element.offsetParent ? top_offset(element.offsetParent) : 0 );

export const window_center = element =>
    window.scrollTo(0, top_offset(element) - window.innerHeight/2 + element.clientHeight/2);