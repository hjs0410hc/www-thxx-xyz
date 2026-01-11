'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Code, ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/actions/upload';

interface TiptapEditorProps {
    content?: any;
    onChange: (content: any) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none',
            },
        },
        immediatelyRender: false,
    });

    // Sync content when props change (e.g., language switch)
    useEffect(() => {
        if (!editor || !content) return;

        // Compare current editor content with new content prop
        // Using JSON stringify for deep comparison
        const currentContent = editor.getJSON();
        if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadImage(formData);

            if (result.error) {
                alert(`Upload failed: ${result.error}`);
            } else if (result.url) {
                // Insert image into editor
                editor.chain().focus().setImage({ src: result.url }).run();
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An unexpected error occurred while uploading the image');
        } finally {
            setUploading(false);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-lg">
            {/* Toolbar */}
            <div className="border-b p-2 flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-accent' : ''}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-accent' : ''}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-accent' : ''}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-accent' : ''}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-accent' : ''}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-accent' : ''}
                >
                    <Code className="h-4 w-4" />
                </Button>

                {/* Image Upload Button */}
                <div className="border-l pl-1 ml-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ImageIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
