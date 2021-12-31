import {JSX} from 'solid-js';
import {Except} from 'type-fest';
import {DOMElement} from './dom';
import {Styles} from './styles';

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'ink-box': Ink.Box;
			'ink-text': Ink.Text;
		}
	}
}

declare namespace Ink {
	interface Box {
		children?: JSX.Element;
		key?: Key;
		ref?: LegacyRef<DOMElement>;
		style?: Except<Styles, 'textWrap'>;
	}

	interface Text {
		children?: JSX.Element;
		key?: Key;
		style?: Styles;
		internal_transform?: (children: string) => string;
	}
}
