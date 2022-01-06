import {createEffect, mergeProps, Text} from '..';
import * as spinners from 'cli-spinners';
import type {SpinnerName} from 'cli-spinners';
import {createSignal} from '..';

interface Props {
	/**
	 * Type of a spinner.
	 * See [cli-spinners](https://github.com/sindresorhus/cli-spinners) for available spinners.
	 *
	 * @default dots
	 */
	type: SpinnerName;
}

/**
 * Spinner.
 */
const Spinner = (props: Partial<Props>) => {
	props = mergeProps({type: 'dots'}, props) as Props;
	const [frame, setFrame] = createSignal(0);

	createEffect(() => {
		let spinner = spinners[props.type!];
		const timer = setInterval(() => {
			setFrame(previousFrame => {
				const isLastFrame = previousFrame === spinner.frames.length - 1;
				return isLastFrame ? 0 : previousFrame + 1;
			});
		}, spinner.interval);

		return () => {
			clearInterval(timer);
		};
	});

	return <Text>{spinners[props.type!].frames[frame()]}</Text>;
};

export default Spinner;
