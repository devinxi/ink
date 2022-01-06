/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import cliCursor from 'cli-cursor';
import AppContext from './AppContext';
import StdinContext from './StdinContext';
import StdoutContext from './StdoutContext';
import StderrContext from './StderrContext';
import FocusContext from './FocusContext';
import ErrorOverview from './ErrorOverview';
import {createSignal, JSX} from 'solid-js';
import {createStore} from 'solid-js/store';
const TAB = '\t';
const SHIFT_TAB = '\u001B[Z';
const ESC = '\u001B';

interface Props {
	readonly children: JSX.Element;
	readonly stdin: NodeJS.ReadStream;
	readonly stdout: NodeJS.WriteStream;
	readonly stderr: NodeJS.WriteStream;
	readonly writeToStdout: (data: string) => void;
	readonly writeToStderr: (data: string) => void;
	readonly exitOnCtrlC: boolean;
	readonly onExit: (error?: Error) => void;
}

interface State {
	readonly isFocusEnabled: boolean;
	readonly activeFocusId?: string;
	readonly focusables: Focusable[];
	readonly error?: Error;
}

interface Focusable {
	readonly id: string;
	readonly isActive: boolean;
}

export default function App(props) {
	const [state, setState] = createStore({
		isFocusEnabled: true,
		activeFocusId: undefined,
		focusables: [],
		error: undefined
	});

	// state = {
	// 	isFocusEnabled: true,
	// 	activeFocusId: undefined,
	// 	focusables: [],
	// 	error: undefined
	// };

	// // Count how many components enabled raw mode to avoid disabling
	// // raw mode until all components don't need it anymore
	let rawModeEnabledCount = 0;

	// static getDerivedStateFromError(error: Error) {
	// 	return {error};
	// }

	// Determines if TTY is supported on the provided stdin
	function isRawModeSupported(): boolean {
		return props.stdin.isTTY;
	}

	function componentDidMount() {
		cliCursor.hide(props.stdout);
	}

	function componentWillUnmount() {
		cliCursor.show(props.stdout);

		// ignore calling setRawMode on an handle stdin it cannot be called
		if (isRawModeSupported()) {
			handleSetRawMode(false);
		}
	}

	function componentDidCatch(error: Error) {
		handleExit(error);
	}

	const handleSetRawMode = (isEnabled: boolean): void => {
		const {stdin} = props;

		if (!isRawModeSupported()) {
			if (stdin === process.stdin) {
				throw new Error(
					'Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
				);
			} else {
				throw new Error(
					'Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
				);
			}
		}

		stdin.setEncoding('utf8');

		if (isEnabled) {
			// Ensure raw mode is enabled only once
			if (rawModeEnabledCount === 0) {
				stdin.addListener('data', handleInput);
				stdin.resume();
				stdin.setRawMode(true);
			}

			rawModeEnabledCount++;
			return;
		}

		// Disable raw mode only when no components left that are using it
		if (--rawModeEnabledCount === 0) {
			stdin.setRawMode(false);
			stdin.removeListener('data', handleInput);
			stdin.pause();
		}
	};

	const handleInput = (input: string): void => {
		// Exit on Ctrl+C
		// eslint-disable-next-line unicorn/no-hex-escape
		if (input === '\x03' && props.exitOnCtrlC) {
			handleExit();
		}

		// Reset focus when there's an active focused component on Esc
		if (input === ESC && state.activeFocusId) {
			setState(s => ({
				activeFocusId: undefined
			}));
		}

		if (state.isFocusEnabled && state.focusables.length > 0) {
			if (input === TAB) {
				focusNext();
			}

			if (input === SHIFT_TAB) {
				focusPrevious();
			}
		}
	};

	const handleExit = (error?: Error): void => {
		if (isRawModeSupported()) {
			handleSetRawMode(false);
		}

		props.onExit(error);
	};

	const enableFocus = (): void => {
		setState({
			isFocusEnabled: true
		});
	};

	const disableFocus = (): void => {
		setState({
			isFocusEnabled: false
		});
	};

	const focus = (id: string): void => {
		setState(previousState => {
			const hasFocusableId = previousState.focusables.some(
				focusable => focusable?.id === id
			);

			if (!hasFocusableId) {
				return previousState;
			}

			return {activeFocusId: id};
		});
	};

	const focusNext = (): void => {
		setState(previousState => {
			const firstFocusableId = previousState.focusables[0]?.id;
			const nextFocusableId = findNextFocusable(previousState);

			return {
				activeFocusId: nextFocusableId || firstFocusableId
			};
		});
	};

	const focusPrevious = (): void => {
		setState(previousState => {
			const lastFocusableId =
				previousState.focusables[previousState.focusables.length - 1]?.id;
			const previousFocusableId = findPreviousFocusable(previousState);

			return {
				activeFocusId: previousFocusableId || lastFocusableId
			};
		});
	};

	const addFocusable = (
		id: string,
		{autoFocus}: {autoFocus: boolean}
	): void => {
		setState(previousState => {
			let nextFocusId = previousState.activeFocusId;

			if (!nextFocusId && autoFocus) {
				nextFocusId = id;
			}

			return {
				activeFocusId: nextFocusId,
				focusables: [
					...previousState.focusables,
					{
						id,
						isActive: true
					}
				]
			};
		});
	};

	const removeFocusable = (id: string): void => {
		setState(previousState => ({
			activeFocusId:
				previousState.activeFocusId === id
					? undefined
					: previousState.activeFocusId,
			focusables: previousState.focusables.filter(focusable => {
				return focusable.id !== id;
			})
		}));
	};

	const activateFocusable = (id: string): void => {
		setState(previousState => ({
			focusables: previousState.focusables.map(focusable => {
				if (focusable.id !== id) {
					return focusable;
				}

				return {
					id,
					isActive: true
				};
			})
		}));
	};

	const deactivateFocusable = (id: string): void => {
		setState(previousState => ({
			activeFocusId:
				previousState.activeFocusId === id
					? undefined
					: previousState.activeFocusId,
			focusables: previousState.focusables.map(focusable => {
				if (focusable.id !== id) {
					return focusable;
				}

				return {
					id,
					isActive: false
				};
			})
		}));
	};

	const findNextFocusable = (state: State): string | undefined => {
		const activeIndex = state.focusables.findIndex(focusable => {
			return focusable.id === state.activeFocusId;
		});

		for (
			let index = activeIndex + 1;
			index < state.focusables.length;
			index++
		) {
			if (state.focusables[index]?.isActive) {
				return state.focusables[index].id;
			}
		}

		return undefined;
	};

	const findPreviousFocusable = (state: State): string | undefined => {
		const activeIndex = state.focusables.findIndex(focusable => {
			return focusable.id === state.activeFocusId;
		});

		for (let index = activeIndex - 1; index >= 0; index--) {
			if (state.focusables[index]?.isActive) {
				return state.focusables[index].id;
			}
		}

		return undefined;
	};
	return (
		<AppContext.Provider
			value={{
				exit: handleExit
			}}
		>
			<StdinContext.Provider
				value={{
					stdin: props.stdin,
					setRawMode: handleSetRawMode,
					isRawModeSupported: isRawModeSupported(),
					internal_exitOnCtrlC: props.exitOnCtrlC
				}}
			>
				<StdoutContext.Provider
					value={{
						stdout: props.stdout,
						write: props.writeToStdout
					}}
				>
					<StderrContext.Provider
						value={{
							stderr: props.stderr,
							write: props.writeToStderr
						}}
					>
						<FocusContext.Provider
							value={{
								activeId: state.activeFocusId,
								add: addFocusable,
								remove: removeFocusable,
								activate: activateFocusable,
								deactivate: deactivateFocusable,
								enableFocus: enableFocus,
								disableFocus: disableFocus,
								focusNext: focusNext,
								focusPrevious: focusPrevious,
								focus: focus
							}}
						>
							{state.error ? (
								<ErrorOverview error={state.error! as Error} />
							) : (
								props.children
							)}
						</FocusContext.Provider>
					</StderrContext.Provider>
				</StdoutContext.Provider>
			</StdinContext.Provider>
		</AppContext.Provider>
	);
}

// Root component for all Ink apps
// It renders stdin and stdout contexts, so that children can access them if needed
// It also handles Ctrl+C exiting and cursor visibility
// export class InkApp {
// 	static displayName = 'InternalApp';

// 	state = {
// 		isFocusEnabled: true,
// 		activeFocusId: undefined,
// 		focusables: [],
// 		error: undefined
// 	};

// 	// Count how many components enabled raw mode to avoid disabling
// 	// raw mode until all components don't need it anymore
// 	rawModeEnabledCount = 0;

// 	static getDerivedStateFromError(error: Error) {
// 		return {error};
// 	}

// 	// Determines if TTY is supported on the provided stdin
// 	isRawModeSupported(): boolean {
// 		return props.stdin.isTTY;
// 	}

// 	render() {
// 		return (
// 			<AppContext.Provider
// 				value={{
// 					exit: handleExit
// 				}}
// 			>
// 				<StdinContext.Provider
// 					value={{
// 						stdin: props.stdin,
// 						setRawMode: handleSetRawMode,
// 						isRawModeSupported: isRawModeSupported(),
// 						internal_exitOnCtrlC: props.exitOnCtrlC
// 					}}
// 				>
// 					<StdoutContext.Provider
// 						value={{
// 							stdout: props.stdout,
// 							write: props.writeToStdout
// 						}}
// 					>
// 						<StderrContext.Provider
// 							value={{
// 								stderr: props.stderr,
// 								write: props.writeToStderr
// 							}}
// 						>
// 							<FocusContext.Provider
// 								value={{
// 									activeId: state.activeFocusId,
// 									add: addFocusable,
// 									remove: removeFocusable,
// 									activate: activateFocusable,
// 									deactivate: deactivateFocusable,
// 									enableFocus: enableFocus,
// 									disableFocus: disableFocus,
// 									focusNext: focusNext,
// 									focusPrevious: focusPrevious,
// 									focus: focus
// 								}}
// 							>
// 								{state.error ? (
// 									<ErrorOverview error={state.error! as Error} />
// 								) : (
// 									props.children
// 								)}
// 							</FocusContext.Provider>
// 						</StderrContext.Provider>
// 					</StdoutContext.Provider>
// 				</StdinContext.Provider>
// 			</AppContext.Provider>
// 		);
// 	}

// 	componentDidMount() {
// 		cliCursor.hide(props.stdout);
// 	}

// 	componentWillUnmount() {
// 		cliCursor.show(props.stdout);

// 		// ignore calling setRawMode on an handle stdin it cannot be called
// 		if (isRawModeSupported()) {
// 			handleSetRawMode(false);
// 		}
// 	}

// 	componentDidCatch(error: Error) {
// 		handleExit(error);
// 	}

// 	handleSetRawMode = (isEnabled: boolean): void => {
// 		const {stdin} = props;

// 		if (!isRawModeSupported()) {
// 			if (stdin === process.stdin) {
// 				throw new Error(
// 					'Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
// 				);
// 			} else {
// 				throw new Error(
// 					'Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
// 				);
// 			}
// 		}

// 		stdin.setEncoding('utf8');

// 		if (isEnabled) {
// 			// Ensure raw mode is enabled only once
// 			if (rawModeEnabledCount === 0) {
// 				stdin.addListener('data', handleInput);
// 				stdin.resume();
// 				stdin.setRawMode(true);
// 			}

// 			rawModeEnabledCount++;
// 			return;
// 		}

// 		// Disable raw mode only when no components left that are using it
// 		if (--rawModeEnabledCount === 0) {
// 			stdin.setRawMode(false);
// 			stdin.removeListener('data', handleInput);
// 			stdin.pause();
// 		}
// 	};

// 	handleInput = (input: string): void => {
// 		// Exit on Ctrl+C
// 		// eslint-disable-next-line unicorn/no-hex-escape
// 		if (input === '\x03' && props.exitOnCtrlC) {
// 			handleExit();
// 		}

// 		// Reset focus when there's an active focused component on Esc
// 		if (input === ESC && state.activeFocusId) {
// 			setState({
// 				activeFocusId: undefined
// 			});
// 		}

// 		if (state.isFocusEnabled && state.focusables.length > 0) {
// 			if (input === TAB) {
// 				focusNext();
// 			}

// 			if (input === SHIFT_TAB) {
// 				focusPrevious();
// 			}
// 		}
// 	};

// 	handleExit = (error?: Error): void => {
// 		if (isRawModeSupported()) {
// 			handleSetRawMode(false);
// 		}

// 		props.onExit(error);
// 	};

// 	enableFocus = (): void => {
// 		setState({
// 			isFocusEnabled: true
// 		});
// 	};

// 	disableFocus = (): void => {
// 		setState({
// 			isFocusEnabled: false
// 		});
// 	};

// 	focus = (id: string): void => {
// 		setState(previousState => {
// 			const hasFocusableId = previousState.focusables.some(
// 				focusable => focusable?.id === id
// 			);

// 			if (!hasFocusableId) {
// 				return previousState;
// 			}

// 			return {activeFocusId: id};
// 		});
// 	};

// 	focusNext = (): void => {
// 		setState(previousState => {
// 			const firstFocusableId = previousState.focusables[0]?.id;
// 			const nextFocusableId = findNextFocusable(previousState);

// 			return {
// 				activeFocusId: nextFocusableId || firstFocusableId
// 			};
// 		});
// 	};

// 	focusPrevious = (): void => {
// 		setState(previousState => {
// 			const lastFocusableId =
// 				previousState.focusables[previousState.focusables.length - 1]?.id;
// 			const previousFocusableId = findPreviousFocusable(previousState);

// 			return {
// 				activeFocusId: previousFocusableId || lastFocusableId
// 			};
// 		});
// 	};

// 	addFocusable = (id: string, {autoFocus}: {autoFocus: boolean}): void => {
// 		setState(previousState => {
// 			let nextFocusId = previousState.activeFocusId;

// 			if (!nextFocusId && autoFocus) {
// 				nextFocusId = id;
// 			}

// 			return {
// 				activeFocusId: nextFocusId,
// 				focusables: [
// 					...previousState.focusables,
// 					{
// 						id,
// 						isActive: true
// 					}
// 				]
// 			};
// 		});
// 	};

// 	removeFocusable = (id: string): void => {
// 		setState(previousState => ({
// 			activeFocusId:
// 				previousState.activeFocusId === id
// 					? undefined
// 					: previousState.activeFocusId,
// 			focusables: previousState.focusables.filter(focusable => {
// 				return focusable.id !== id;
// 			})
// 		}));
// 	};

// 	activateFocusable = (id: string): void => {
// 		setState(previousState => ({
// 			focusables: previousState.focusables.map(focusable => {
// 				if (focusable.id !== id) {
// 					return focusable;
// 				}

// 				return {
// 					id,
// 					isActive: true
// 				};
// 			})
// 		}));
// 	};

// 	deactivateFocusable = (id: string): void => {
// 		setState(previousState => ({
// 			activeFocusId:
// 				previousState.activeFocusId === id
// 					? undefined
// 					: previousState.activeFocusId,
// 			focusables: previousState.focusables.map(focusable => {
// 				if (focusable.id !== id) {
// 					return focusable;
// 				}

// 				return {
// 					id,
// 					isActive: false
// 				};
// 			})
// 		}));
// 	};

// 	findNextFocusable = (state: State): string | undefined => {
// 		const activeIndex = state.focusables.findIndex(focusable => {
// 			return focusable.id === state.activeFocusId;
// 		});

// 		for (
// 			let index = activeIndex + 1;
// 			index < state.focusables.length;
// 			index++
// 		) {
// 			if (state.focusables[index]?.isActive) {
// 				return state.focusables[index].id;
// 			}
// 		}

// 		return undefined;
// 	};

// 	findPreviousFocusable = (state: State): string | undefined => {
// 		const activeIndex = state.focusables.findIndex(focusable => {
// 			return focusable.id === state.activeFocusId;
// 		});

// 		for (let index = activeIndex - 1; index >= 0; index--) {
// 			if (state.focusables[index]?.isActive) {
// 				return state.focusables[index].id;
// 			}
// 		}

// 		return undefined;
// 	};
// }
