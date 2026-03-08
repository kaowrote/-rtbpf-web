import { Node, mergeAttributes } from '@tiptap/core';

export interface InstagramOptions {
    inline: boolean;
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        instagram: {
            /**
             * Set an Instagram video/post embed
             */
            setInstagramVideo: (options: { src: string; width?: number; height?: number }) => ReturnType;
        };
    }
}

export const Instagram = Node.create<InstagramOptions>({
    name: 'instagram',

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
                default: 400,
            },
            height: {
                default: 480,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src*="instagram.com"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { class: 'instagram-embed-wrapper', style: 'display: flex; justify-content: center; margin: 1rem 0;' },
            ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                frameborder: '0',
                scrolling: 'no',
                allowtransparency: 'true',
                style: 'border: none; overflow: hidden; border-radius: 8px;',
            })]
        ];
    },

    addCommands() {
        return {
            setInstagramVideo:
                (options: { src: string; width?: number; height?: number }) =>
                    ({ commands }) => {
                        let url = options.src;
                        const match = url.match(/(?:instagram\.com.*\/p\/|instagram\.com.*\/reel\/)([a-zA-Z0-9_\-]+)/i);
                        if (match && match[1]) {
                            url = `https://www.instagram.com/p/${match[1]}/embed/`;
                        } else if (url.includes('/embed')) {
                            // keep it
                        } else {
                            return false;
                        }

                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                src: url,
                                width: options.width || 400,
                                height: options.height || 480,
                            },
                        });
                    },
        };
    },
});
