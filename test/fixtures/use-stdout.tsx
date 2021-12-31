import React, {FC, createEffect} from 'solid-js';
import {render, useStdout, Text} from '../..';

const WriteToStdout: FC = () => {
	const {write} = useStdout();

	createEffect(() => {
		write('Hello from Ink to stdout\n');
	}, []);

	return <Text>Hello World</Text>;
};

const app = render(<WriteToStdout />);

(async () => {
	await app.waitUntilExit();
	console.log('exited');
})();
