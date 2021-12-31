import React, {FC, createSignal, useCallback, createEffect} from 'solid-js';
import {render, useInput, useApp, Text} from '../..';

const App: FC = () => {
	const {exit} = useApp();
	const [input, setInput] = createSignal('');

	const handleInput = useCallback((input: string) => {
		setInput((previousInput: string) => previousInput + input);
	}, []);

	useInput(handleInput);
	useInput(handleInput, {isActive: false});

	createEffect(() => {
		setTimeout(exit, 1000);
	}, []);

	return <Text>{input}</Text>;
};

const app = render(<App />);

(async () => {
	await app.waitUntilExit();
	console.log('exited');
})();
