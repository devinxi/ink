/// <reference types="node" />
import { JSX } from './solid-ink';
export interface Options {
    stdout: NodeJS.WriteStream;
    stdin: NodeJS.ReadStream;
    stderr: NodeJS.WriteStream;
    debug: boolean;
    exitOnCtrlC: boolean;
    patchConsole: boolean;
    waitUntilExit?: () => Promise<void>;
}
export default class Ink {
    private readonly options;
    private readonly log;
    private readonly throttledLog;
    private isUnmounted;
    private lastOutput;
    private readonly container;
    private readonly rootNode;
    private fullStaticOutput;
    private exitPromise?;
    private restoreConsole?;
    private readonly unsubscribeResize?;
    constructor(options: Options);
    resolveExitPromise: () => void;
    rejectExitPromise: (reason?: Error) => void;
    unsubscribeExit: () => void;
    onRender: () => void;
    render(node: () => JSX.Element): void;
    writeToStdout(data: string): void;
    writeToStderr(data: string): void;
    unmount(error?: Error | number | null): void;
    waitUntilExit(): Promise<void>;
    clear(): void;
    patchConsole(): void;
}
//# sourceMappingURL=ink.d.ts.map