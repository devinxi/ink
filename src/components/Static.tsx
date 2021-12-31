import React, {
	createMemo,
	createSignal,
	createRenderEffect,
	ReactNode,
	For,
	children,
	createEffect
} from 'solid-js';
import {Styles} from '../styles';

export interface Props<T> {
	/**
	 * Array of items of any type to render using a function you pass as a component child.
	 */
	readonly items: T[];

	/**
	 * Styles to apply to a container of child elements. See <Box> for supported properties.
	 */
	readonly style?: Styles;

	/**
	 * Function that is called to render every item in `items` array.
	 * First argument is an item itself and second argument is index of that item in `items` array.
	 * Note that `key` must be assigned to the root component.
	 */
	readonly children: (item: T, index: number) => ReactNode;
}

/**
 * `<Static>` component permanently renders its output above everything else.
 * It's useful for displaying activity like completed tasks or logs - things that
 * are not changing after they're rendered (hence the name "Static").
 *
 * It's preferred to use `<Static>` for use cases like these, when you can't know
 * or control the amount of items that need to be rendered.
 *
 * For example, [Tap](https://github.com/tapjs/node-tap) uses `<Static>` to display
 * a list of completed tests. [Gatsby](https://github.com/gatsbyjs/gatsby) uses it
 * to display a list of generated pages, while still displaying a live progress bar.
 */
const Static = <T,>(props: Props<T>) => {
	const [index, setIndex] = createSignal(0);

	const itemsToRender: T[] = createMemo(() => {
		return props.items.slice(index());
	});

	createEffect(() => {
		console.log(itemsToRender());
	});
	// createEffect(() => {
	// 	console.log(props.items.length);
	// 	setIndex(props.items.length);
	// });

	const style: Styles = createMemo(() => ({
		position: 'absolute',
		flexDirection: 'column',
		...props.customStyle
	}));

	return (
		<ink-box
			// @ts-ignore
			internal_static
			style={style()}
		>
			{itemsToRender().map((item, itemIndex) => {
				// console.log(item, itemIndex, console.log(props.children(item)));
				// process.exit();
				return props.children(item);
			})}
		</ink-box>
	);
};

Static.displayName = 'Static';

export default Static;
