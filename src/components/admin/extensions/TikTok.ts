import { Node, mergeAttributes } from '@tiptap/core';

export interface TikTokOptions {
    inline: boolean;
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        tiktok: {
            /**
             * Set a TikTok video embed
             */
            setTikTokVideo: (options: { src: string; width?: number; height?: number }) => ReturnType;
        };
    }
}

export const TikTok = Node.create<TikTokOptions>({
    name: 'tiktok',

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
            src: {
                default: null,
            },
            width: {
                default: 325,
            },
            height: {
                default: 600,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src*="tiktok.com"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { class: 'tiktok-embed-wrapper', style: 'display: flex; justify-content: center; margin: 1rem 0;' },
            ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                frameborder: '0',
                allow: 'encrypted-media;',
                style: 'border: none; overflow: hidden; border-radius: 8px;',
            })]
        ];
    },

    addCommands() {
        return {
            setTikTokVideo:
                (options: { src: string; width?: number; height?: number }) =>
                    ({ commands }) => {
                        let url = options.src;
                        const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/i);
                        if (match && match[1]) {
                            url = `https://www.tiktok.com/embed/v2/${match[1]}`;
                        } else if (url.match(/tiktok\.com\/embed/)) {
                            // Valid internal tiktok embed
                        } else {
                            return false;
                        }

                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                src: url,
                                width: options.width || 325,
                                height: options.height || 600,
                            },
                        });
                    },
        };
    },
});
