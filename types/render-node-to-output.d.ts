import { DOMElement } from './dom';
import Output from './output';
export declare type OutputTransformer = (s: string) => string;
declare const renderNodeToOutput: (node: DOMElement, output: Output, options: {
    offsetX?: number | undefined;
    offsetY?: number | undefined;
    transformers?: OutputTransformer[] | undefined;
    skipStaticElements: boolean;
}) => void;
export default renderNodeToOutput;
//# sourceMappingURL=render-node-to-output.d.ts.map