"use client";

import React from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from './extensions/FontSize';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, Youtube as YoutubeIcon } from 'lucide-react';

const ToolbarButton = ({ onClick, isActive, disabled, children }: { onClick: () => void, isActive?: boolean, disabled?: boolean, children: React.ReactNode }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${isActive ? 'bg-gray-200 dark:bg-zinc-700 text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
    >
        {children}
    </button>
);

interface TipTapEditorProps {
    value?: string;
    onChange?: (content: string) => void;
}

export default function TipTapEditor({ value = "", onChange }: TipTapEditorProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Youtube.configure({
                inline: false,
            }),
            TextStyle,
            FontFamily,
            FontSize,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert min-h-[400px] p-6 text-black dark:text-white font-thai',
            },
        },
    });

    React.useEffect(() => {
        if (editor && value && editor.getHTML() !== value) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL องรูปภาพ:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addYoutubeVideo = () => {
        const url = prompt('YouTube Video URL:');
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            });
        }
    };

    if (!mounted || !editor) {
        return (
            <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-[#0a0a0a] min-h-[400px] flex items-center justify-center text-gray-400">
                Loading editor...
            </div>
        );
    }

    return (
        <div className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <select
                    title="Font Family"
                    onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontFamily || ''}
                    className="text-xs md:text-sm p-1 border border-gray-200 dark:border-zinc-700 rounded bg-white dark:bg-[#0a0a0a] text-black dark:text-white focus:outline-none"
                >
                    <option value="">Default Font</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="'IBM Plex Sans Thai', sans-serif">IBM Plex Thai</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New</option>
                </select>

                <select
                    title="Font Size"
                    onChange={e => editor.chain().focus().setFontSize(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontSize || ''}
                    className="text-xs md:text-sm p-1 ml-1 border border-gray-200 dark:border-zinc-700 rounded bg-white dark:bg-[#0a0a0a] text-black dark:text-white w-14 md:w-16 focus:outline-none"
                >
                    <option value="">Size</option>
                    <option value="12px">12</option>
                    <option value="14px">14</option>
                    <option value="16px">16</option>
                    <option value="18px">18</option>
                    <option value="20px">20</option>
                    <option value="24px">24</option>
                    <option value="30px">30</option>
                    <option value="36px">36</option>
                    <option value="48px">48</option>
                </select>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
                    <Quote className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addYoutubeVideo}>
                    <YoutubeIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content Area */}
            <EditorContent editor={editor} className="bg-white dark:bg-[#0a0a0a]" />
        </div>
    );
}
