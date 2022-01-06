import {render, Box, For, Text, createSignal, useInput, createEffect} from '..';
import Spinner from './spinner';
import TextInput from './text-input';
// import TextInput from 'ink-text-input';

const SearchQuery = () => {
	const [query, setQuery] = createSignal('');

	return (
		<Box flexDirection="column">
			<Spinner />
			<Spinner type="arrow2" />
			<Box>
				<Box marginRight={1}>
					<Text color="green">Enter your query: </Text>
				</Box>
				<TextInput
					value={query()}
					focus={true}
					placeholder="place"
					showCursor={true}
					onChange={setQuery}
					onSubmit={console.log}
				/>
			</Box>
			{/* <Box flexDirection="column">
				<For each={[...query()]}>{char => <Text>{char}</Text>}</For>
			</Box> */}
		</Box>
	);
};

render(() => <SearchQuery />);
