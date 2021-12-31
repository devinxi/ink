import React, {createEffect} from 'solid-js';
import {Text, render} from '../..';

const App = () => {
	createEffect(() => {
		const timer = setTimeout(() => {}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return <Text>Hello World</Text>;
};

const {unmount} = render(<App />);
console.log('First log');
unmount();
console.log('Second log');
