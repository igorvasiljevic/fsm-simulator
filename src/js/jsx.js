

export const __jsx_fragment = -1;

export function __jsx(tag, props = {}, ...children) {

	const element =
			tag === __jsx_fragment ? document.createDocumentFragment() :
			tag === 'svgl'         ? svg_loader(props.svg) :
			props?.xmlns           ? document.createElementNS(props.xmlns, tag) :
									 document.createElement(tag);

	delete props?.svg;
	
	for(let attribute in props) {
		if(attribute === 'style')
			for(let style in props.style)
				element.style[style] = props.style[style];
		else if(
			!attribute.startsWith('on') &&
			// attribute !== 'contentEditable' &&
			(attribute in element || attribute === 'class' || attribute.startsWith('data-'))
		)
			element.setAttributeNS(null, attribute, props[attribute]);
		else
			element[attribute] = props[attribute];
	}

	element.append(...children.flat());
	
	return element;
}

export function svg_loader(text) {
	const tmp = document.createElement('div');
	tmp.innerHTML = text;
	return tmp.firstChild;
}