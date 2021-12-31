'use strict';
const {
	render,
	createSignal,
	createEffect,
	Static,
	Box,
	Text,
	onCleanup
} = require('../..');

const Example = () => {
	const [tests, setTests] = createSignal([]);

	createEffect(() => {
		let completedTests = 0;
		let timer;

		const run = () => {
			if (completedTests++ < 10) {
				setTests(previousTests => [
					...previousTests,
					{
						id: previousTests.length,
						title: `Test #${previousTests.length + 1}`
					}
				]);

				timer = setTimeout(run, 100);
			}
		};

		run();

		 onCleanup(() => {
			clearTimeout(timer);
		});
	}, []);

	return (
		<>
			<Static items={tests()}>
				{test => (
					<Box key={test.id}>
						<Text color="green">✔ {test.title}</Text>
					</Box>
				)}
			</Static>

			<Box marginTop={1}>
				<Text dimColor>Completed tests: {tests().length}</Text>
			</Box>
		</>
	);
};

render(() => <Example />);
