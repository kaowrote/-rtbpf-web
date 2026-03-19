import { Node, mergeAttributes } from '@tiptap/core';

export interface FacebookEmbedOptions {
    inline: boolean;
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        facebookEmbed: {
            setFacebookEmbed: (options: { src: string; width?: number; height?: number }) => ReturnType;
        };
    }
}

export const FacebookEmbed = Node.create<FacebookEmbedOptions>({
    name: 'facebookEmbed',

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
            width: { default: 500 },
            height: { default: 600 },
        };
    },

    parseHTML() {
        return [
            { tag: 'iframe[src*="facebook.com"]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { class: 'facebook-embed-wrapper', style: 'display: flex; justify-content: center; margin: 1rem 0;' },
            ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                frameborder: '0',
                scrolling: 'no',
                allowtransparency: 'true',
                allow: 'encrypted-media',
                style: 'border: none; overflow: hidden; border-radius: 8px;',
            })]
        ];
    },

    addCommands() {
        return {
            setFacebookEmbed:
                (options: { src: string; width?: number; height?: number }) =>
                    ({ commands }) => {
                        let url = options.src;

                        // Handle Facebook post/video URLs
                        if (url.includes('facebook.com') && !url.includes('plugins')) {
                            // Convert to embed URL
                            const encodedUrl = encodeURIComponent(url);
                            if (url.includes('/videos/') || url.includes('watch')) {
                                url = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&width=${options.width || 500}`;
                            } else {
                                url = `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=${options.width || 500}`;
                            }
                        }

                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                src: url,
                                width: options.width || 500,
                                height: options.height || 600,
                            },
                        });
                    },
        };
    },
});
