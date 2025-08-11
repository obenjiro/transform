import dedent from 'ts-dedent';
import MarkdownIt from 'markdown-it';
// @ts-expect-error
import meta from 'markdown-it-meta';

import transform from '../src/transform';

describe('documents starting with ---', () => {
    const input = dedent`
    ---
    {{bad}}
    Content
    `;

    it('markdown-it-meta throws on malformed frontmatter', () => {
        const md = new MarkdownIt();
        md.use(meta);
        expect(() => md.render(input)).toThrow();
    });

    it('renders leading --- as horizontal rule', () => {
        const {
            result: {html},
        } = transform(input);
        expect(html).toMatchSnapshot();
    });
});
