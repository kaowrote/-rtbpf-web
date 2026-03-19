import { Node, mergeAttributes } from '@tiptap/core';

export interface TwitterEmbedOptions {
    inline: boolean;
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        twitterEmbed: {
            setTwitterEmbed: (options: { src: string; width?: number; height?: number }) => ReturnType;
        };
    }
}

export const TwitterEmbed = Node.create<TwitterEmbedOptions>({
    name: 'twitterEmbed',

    addOptions() {
        return {
            inline: false,
            HTMLAttributes: {},
        };
    },

    inline() {
        return this.options.inline;
    },

    group() {
        return this.options.inline ? 'inline' : 'block';
    },

    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            width: { default: 550 },
            height: { default: 600 },
        };
    },

    parseHTML() {
        return [
            { tag: 'iframe[src*="twitter.com"]' },
            { tag: 'iframe[src*="platform.twitter.com"]' },
            { tag: 'iframe[src*="x.com"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { class: 'twitter-embed-wrapper', style: 'display: flex; justify-content: center; margin: 1rem 0;' },
            ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                frameborder: '0',
                scrolling: 'no',
                allowtransparency: 'true',
                style: 'border: none; overflow: hidden; border-radius: 12px;',
            })]
        ];
    },

    addCommands() {
        return {
            setTwitterEmbed:
                (options: { src: string; width?: number; height?: number }) =>
                    ({ commands }) => {
                        let url = options.src;

                        // Convert twitter.com/x.com URLs to embed format
                        const tweetMatch = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
                        if (tweetMatch && tweetMatch[1]) {
                            url = `https://platform.twitter.com/embed/Tweet.html?id=${tweetMatch[1]}&theme=light`;
                        }

                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                src: url,
                                width: options.width || 550,
                                height: options.height || 600,
                            },
                        });
                    },
        };
    },
});
