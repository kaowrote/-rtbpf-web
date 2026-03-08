"use client";

import React from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize } from './extensions/FontSize';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Link as LinkIcon, Youtube as YoutubeIcon, Instagram as InstagramIcon, Music2 as Music2Icon, Loader2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Maximize, Code } from 'lucide-react';
import imageCompression from 'browser-image-compression';

import { Instagram } from './extensions/Instagram';
import { TikTok } from './extensions/TikTok';

const ToolbarButton = ({ onClick, isActive, disabled, title, children }: { onClick: () => void, isActive?: boolean, disabled?: boolean, title?: string, children: React.ReactNode }) => (
    <button
        type="button"
        title={title}
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
    const [isUploadingImage, setIsUploadingImage] = React.useState(false);
    const [isCodeView, setIsCodeView] = React.useState(false);
    const [htmlContent, setHtmlContent] = React.useState(value);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
            Instagram,
            TikTok,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            TextStyle,
            FontFamily,
            FontSize,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setHtmlContent(html);
            if (onChange) {
                onChange(html);
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
            setHtmlContent(value);
        }
    }, [value, editor]);

    const toggleCodeView = () => {
        if (!editor) return;

        if (isCodeView) {
            // Switching from Code to Visual
            editor.commands.setContent(htmlContent);
        } else {
            // Switching from Visual to Code
            setHtmlContent(editor.getHTML());
        }
        setIsCodeView(!isCodeView);
    };

    if (!editor) {
        return null;
    }

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const originalFile = event.target.files?.[0];
        if (!originalFile) return;

        setIsUploadingImage(true);
        try {
            let file = originalFile;

            // Compress image if it's larger than 1MB
            if (file.size > 1024 * 1024) {
                try {
                    const options = {
                        maxSizeMB: 3,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    };
                    file = await imageCompression(originalFile, options);
                } catch (error) {
                    console.error('Error compressing image:', error);
                    // Fallback to original file if compression fails
                }
            }

            if (file.size > 4.5 * 1024 * 1024) {
                throw new Error("ไฟล์ภาพยังมีขนาดใหญ่เกิน 4.5MB แม้ผ่านการบีบอัดแล้ว กรุณาเลือกไฟล์ใหม่");
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "editor_uploads");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            let data;
            try {
                data = await res.json();
            } catch (e) {
                // Handles 413 Request Entity Too Large returning HTML/Text
                throw new Error("ไฟล์ภาพอาจมีขนาดใหญ่เกินไป หรือเซิร์ฟเวอร์ไม่พร้อมให้บริการ");
            }

            if (!res.ok || !data.success) {
                throw new Error(data.error?.message || "อัพโหลดไม่สำเร็จ");
            }

            // Insert image into editor securely
            editor.chain().focus().setImage({ src: data.data.url }).run();
        } catch (error: any) {
            alert(error.message || "เกิดข้อผิดพลาดในการอัพโหลด");
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
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

    const parseMediaInput = (input: string) => {
        let src = input;
        let width: number | undefined;
        let height: number | undefined;

        if (input.includes('<iframe') || input.includes('<blockquote')) {
            const srcMatch = input.match(/src="([^"]+)"/);
            const widthMatch = input.match(/width="([^"]+)"/);
            const heightMatch = input.match(/height="([^"]+)"/);

            // TikTok uses blockqoute cite=
            const citeMatch = input.match(/cite="([^"]+)"/);

            if (srcMatch) src = srcMatch[1];
            else if (citeMatch) src = citeMatch[1];

            if (widthMatch) {
                const parsedW = parseInt(widthMatch[1], 10);
                if (!isNaN(parsedW)) width = parsedW;
            }
            if (heightMatch) {
                const parsedH = parseInt(heightMatch[1], 10);
                if (!isNaN(parsedH)) height = parsedH;
            }
        }

        return { src, width, height };
    };

    const addYoutubeVideo = () => {
        const input = prompt('YouTube Video URL หรือ Embed Code:');
        if (input) {
            const { src, width, height } = parseMediaInput(input);
            // TipTap YouTube extension expects standard youtube URL to parse.
            // If the user pastes an embed code with "/embed/", we should extract the Video ID and reconstruct standard URL.
            let finalSrc = src;
            const embedMatch = src.match(/\/embed\/([^?]+)/);
            if (embedMatch && embedMatch[1]) {
                finalSrc = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
            }

            editor.chain().focus().setYoutubeVideo({
                src: finalSrc,
                ...(width && { width: Math.max(320, width) }),
                ...(height && { height: Math.max(180, height) }),
            }).run();
        }
    };

    const addInstagramPost = () => {
        const input = prompt('Instagram Post/Reel URL หรือ Embed Code:');
        if (input) {
            const { src, width, height } = parseMediaInput(input);
            editor.chain().focus().setInstagramVideo({
                src,
                ...(width && { width }),
                ...(height && { height }),
            }).run();
        }
    };

    const addTikTokVideo = () => {
        const input = prompt('TikTok Video URL หรือ Embed Code:');
        if (input) {
            const { src, width, height } = parseMediaInput(input);
            editor.chain().focus().setTikTokVideo({
                src,
                ...(width && { width }),
                ...(height && { height }),
            }).run();
        }
    };

    const resizeMedia = () => {
        let nodeType = null;
        if (editor.isActive('image')) nodeType = 'image';
        else if (editor.isActive('youtube')) nodeType = 'youtube';
        else if (editor.isActive('instagram')) nodeType = 'instagram';
        else if (editor.isActive('tiktok')) nodeType = 'tiktok';

        if (!nodeType) {
            alert("กรุณาคลิกเลือกรูปภาพหรือวิดีโอก่อน");
            return;
        }

        const width = prompt("ระบุความกว้าง (Width) ที่ต้องการ เช่น '50%', '400', '800' (ใส่แต่ตัวเลขจะถือเป็น px):");
        if (width) {
            // Some extensions only support number for width, some support string. We'll pass it exactly as user wrote, 
            // but if it's clean digits we parse to number.
            const w = /^\d+$/.test(width) ? parseInt(width, 10) : width;
            editor.chain().focus().updateAttributes(nodeType, { width: w, height: 'auto' }).run();
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
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} disabled={isCodeView}>
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} disabled={isCodeView}>
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} disabled={isCodeView}>
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <select
                    title="Font Family"
                    onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
                    value={editor.getAttributes('textStyle').fontFamily || ''}
                    disabled={isCodeView}
                    className="text-xs md:text-sm p-1 border border-gray-200 dark:border-zinc-700 rounded bg-white dark:bg-[#0a0a0a] text-black dark:text-white focus:outline-none disabled:opacity-50"
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
                    disabled={isCodeView}
                    className="text-xs md:text-sm p-1 ml-1 border border-gray-200 dark:border-zinc-700 rounded bg-white dark:bg-[#0a0a0a] text-black dark:text-white w-14 md:w-16 focus:outline-none disabled:opacity-50"
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

                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left" disabled={isCodeView}>
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center" disabled={isCodeView}>
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right" disabled={isCodeView}>
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify" disabled={isCodeView}>
                    <AlignJustify className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} disabled={isCodeView}>
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} disabled={isCodeView}>
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} disabled={isCodeView}>
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} disabled={isCodeView}>
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} disabled={isCodeView}>
                    <Quote className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} disabled={isCodeView}>
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton onClick={addImage} disabled={isCodeView || isUploadingImage}>
                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                </ToolbarButton>
                {/* Hidden File Input for Image Uploads */}
                <input
                    type="file"
                    ref={fileInputRef}
                    title="Upload Image"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    onChange={handleImageUpload}
                />

                <ToolbarButton onClick={addYoutubeVideo} title="YouTube" disabled={isCodeView}>
                    <YoutubeIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton onClick={addInstagramPost} title="Instagram" disabled={isCodeView}>
                    <InstagramIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton onClick={addTikTokVideo} title="TikTok" disabled={isCodeView}>
                    <Music2Icon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton
                    onClick={resizeMedia}
                    title="Resize Media"
                    disabled={isCodeView || !(editor.isActive('image') || editor.isActive('youtube') || editor.isActive('instagram') || editor.isActive('tiktok'))}
                >
                    <Maximize className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={isCodeView || !editor.can().undo()}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={isCodeView || !editor.can().redo()}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-2" />

                <ToolbarButton onClick={toggleCodeView} isActive={isCodeView} title="View HTML Code">
                    <Code className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Editor Content Area */}
            {isCodeView ? (
                <textarea
                    className="w-full min-h-[400px] p-6 text-sm font-mono bg-zinc-900 text-green-400 focus:outline-none dark:bg-black dark:text-green-500 border-t border-gray-200 dark:border-zinc-800"
                    title="HTML Source Code"
                    placeholder="วำงโค้ด HTML ที่นี่..."
                    value={htmlContent}
                    onChange={(e) => {
                        setHtmlContent(e.target.value);
                        if (onChange) onChange(e.target.value);
                    }}
                />
            ) : (
                <EditorContent editor={editor} className="bg-white dark:bg-[#0a0a0a]" />
            )}
        </div>
    );
}
