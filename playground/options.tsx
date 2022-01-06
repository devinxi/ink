import {render, Box, For, Text, createSignal, useInput, createEffect} from '..';
import SelectInput from './select';

const SearchQuery = () => {
	const handleSelect = (item: any) => {
		console.log(item);
		// `item` = { label: 'First', value: 'first' }
	};

	const items = [
		{
			label: 'First',
			value: 'first'
		},
		{
			label: 'Second',
			value: 'second'
		},
		{
			label: 'Third',
			value: 'third'
		}
	];

	return <SelectInput items={items} onSelect={handleSelect} />;
};

render(() => <SearchQuery />);
