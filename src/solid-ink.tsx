import {
	Accessor,
	Component,
	createMemo,
	JSX,
	splitProps,
	untrack
} from 'solid-js';
import {createRenderer} from 'solid-js/universal';
import {
	createNode,
	DOMNodeAttribute,
	markNodeAsDirty,
	removeChildNode,
	setAttribute,
	DOMElement,
	setStyle,
	createTextNode as domText,
	insertBeforeNode,
	setTextNodeValue
} from './dom';
import {OutputTransformer} from './render-node-to-output';
import {Styles} from './styles';
// import {createThreeRenderer} from './core/renderer';
// import {roots} from './core';
// import {createSolidRenderer} from './solid';

// export const threeReconciler = createThreeRenderer(roots);
// export const threeRenderer = createSolidRenderer(threeReconciler);
export let hostContext = {
	isInsideText: false,
	rootNode: null as DOMElement | null
};

export type {JSX};

export const {
	render,
	effect,
	memo,
	createComponent,
	createElement,
	createTextNode,
	insertNode,
	insert,
	spread,
	setProp,
	mergeProps
} = createRenderer<DOMElement>({
	createElement: originalType => {
		if (hostContext.isInsideText && originalType === 'ink-box') {
			throw new Error(`<Box> can’t be nested inside <Text> component`);
		}

		const type =
			originalType === 'ink-text' && hostContext.isInsideText
				? 'ink-virtual-text'
				: originalType;

		const node = createNode(type as any);
		return node as any;
	},
	createTextNode: text => {
		return domText(text);
	},
	setProperty: (node, key, value) => {
		if (key === 'children') {
		} else if (key === 'style') {
			setStyle(node, value as Styles);
		} else if (key === 'internal_transform') {
			node.internal_transform = value as OutputTransformer;
		} else if (key === 'internal_static') {
			node.internal_static = true;
			// if (node.internal_static) {

			// Save reference to <Static> node to skip traversal of entire
			// node tree to find it
			hostContext.rootNode.staticNode = node;
			hostContext.isStaticDirty = true;
			// }
		} else {
			setAttribute(node, key, value as DOMNodeAttribute);
		}
	},
	getFirstChild: node => {
		return node.childNodes[0];
	},
	getNextSibling: node => {
		// console.log(
		// 	'getNextSibling',
		// 	node,
		// 	node.parentNode.childNodes.indexOf(node)
		// );
	},
	replaceText(node, text) {
		setTextNodeValue(node, text);
	},
	insertNode: (node, childNode, oldChildNode) => {
		insertBeforeNode(node, childNode, oldChildNode);
	},
	removeNode: (parent, node) => {
		removeChildNode(parent, node);
		// parent.childNodes.splice(node.index, 1);
	}
} as any);

export * from 'solid-js';

type DynamicProps<T> = T & {
	children?: any;
	component?: Component<T> | string | keyof JSX.IntrinsicElements;
};

/**
 * renders an arbitrary custom or native component and passes the other props
 * ```typescript
 * <Dynamic component={multiline() ? 'textarea' : 'input'} value={value()} />
 * ```
 * @description https://www.solidjs.com/docs/latest/api#%3Cdynamic%3E
 */
export function Dynamic<T>(props: DynamicProps<T>): Accessor<JSX.Element> {
	const [p, others] = splitProps(props, ['component']);
	return createMemo(() => {
		const component = p.component as Function | string;
		switch (typeof component) {
			case 'function':
				return untrack(() => component(others));

			case 'string':
				// const isSvg = SVGElements.has(component);
				// const el = sharedConfig.context
				//   ? getNextElement()
				let el = createElement(component);

				spread(el, others, true);
				return el;

			default:
				break;
		}
	});
}
