import { Accessor, Component, JSX } from 'solid-js';
import { DOMElement } from './dom';
export declare let hostContext: {
    isInsideText: boolean;
    rootNode: DOMElement | null;
};
export type { JSX };
export declare const render: (code: () => DOMElement, node: DOMElement) => () => void, effect: <T>(fn: (prev?: T | undefined) => T, init?: T | undefined) => void, memo: <T>(fn: () => T, equal: boolean) => () => T, createComponent: <T>(Comp: (props: T) => DOMElement, props: T) => DOMElement, createElement: (tag: string) => DOMElement, createTextNode: (value: string) => DOMElement, insertNode: (parent: DOMElement, node: DOMElement, anchor?: DOMElement | undefined) => void, insert: <T>(parent: any, accessor: T | (() => T), marker?: any) => DOMElement, spread: <T>(node: any, accessor: T | (() => T), skipChildren?: Boolean | undefined) => void, setProp: <T>(node: DOMElement, name: string, value: T, prev?: T | undefined) => T, mergeProps: (...sources: unknown[]) => unknown;
export * from 'solid-js';
declare type DynamicProps<T> = T & {
    children?: any;
    component?: Component<T> | string | keyof JSX.IntrinsicElements;
};
/**
 * renders an arbitrary custom or native component and passes the other props
 * ```typescript
 * <Dynamic component={multiline() ? 'textarea' : 'input'} value={value()} />
 * ```
 * @description https://www.solidjs.com/docs/latest/api#%3Cdynamic%3E
 */
export declare function Dynamic<T>(props: DynamicProps<T>): Accessor<JSX.Element>;
//# sourceMappingURL=solid-ink.d.ts.map