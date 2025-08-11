import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import type {MarkdownItPluginCb} from './typings';

// @ts-expect-error
import meta from 'markdown-it-meta';

const plugin: MarkdownItPluginCb = (md) => {
    meta(md);

    const rules = (
        md.block.ruler as unknown as {
            __rules__: {name: string; fn: Function}[];
        }
    ).__rules__;
    const rule = rules.find((r) => r.name === 'meta');
    if (!rule) {
        return;
    }

    const original = rule.fn as unknown as (
        state: StateBlock,
        startLine: number,
        endLine: number,
        silent: boolean,
    ) => boolean;

    const getLine = (state: StateBlock, line: number) => {
        const pos = state.bMarks[line];
        const max = state.eMarks[line];
        return state.src.slice(pos, max);
    };

    rule.fn = (state: StateBlock, start: number, end: number, silent: boolean) => {
        if (start === 0 && state.tShift[start] >= 0 && getLine(state, start).trim() === '---') {
            let line = start + 1;
            while (line < end && getLine(state, line).trim() !== '---') {
                if (state.tShift[line] < 0) {
                    break;
                }
                line++;
            }
            if (line >= end) {
                return false;
            }
        }

        try {
            return original(state, start, end, silent);
        } catch {
            return false;
        }
    };
};

export = plugin;
