import {Text, Component} from '../../';

export interface Props {
	isSelected?: boolean;
	label: string;
}

const Item: Component<Props> = props => (
	<Text color={props.isSelected ? 'blue' : undefined}>{props.label}</Text>
);

export default Item;
