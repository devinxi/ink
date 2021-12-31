'use strict';
const React = require('react');
const {render, Text, useStderr} = require('../..');

const Example = () => {
	const {write} = useStderr();

	createEffect(() => {
		const timer = setInterval(() => {
			write('Hello from Ink to stderr\n');
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <Text>Hello World</Text>;
};

render(<Example />);
