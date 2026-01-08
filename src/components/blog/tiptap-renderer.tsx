'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';

interface TiptapRendererProps {
    content: any;
}

export function TiptapRenderer({ content }: TiptapRendererProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4',
                },
            }),
        ],
        content: content || '',
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return <EditorContent editor={editor} />;
}
