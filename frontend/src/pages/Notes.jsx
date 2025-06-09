import "../css/Notes.css";

import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { useEditor, EditorContent, } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';


function Notes() {
    const { user_book_id } = useParams(); // get the user_book_id from the URL parameters
    const location = useLocation(); // get navigation contents with any passed state
    const book = location.state?.book; // Get the book from the state passed by the BookCard component
    const [loading, setLoading] = useState(true); // might not need this, but it helps with the loading state

    // could make this a separate component later
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p></p>',
    });

    // useEffect(() => {
    //     const fetchNotes = async () => {
    //         if (!user_book_id) {
    //             console.error('user_book_id is undefined');
    //             setLoading(false);
    //             return;
    //         }
    //         const { data, error } = await supabase
    //             .from('UserBooks')
    //             .select('notes')
    //             .eq('user_book_id', user_book_id)
    //             .single();

    //         if (error) {
    //             console.error('Error fetching notes:', error.message);
    //         } else {
    //             editor?.commands.setContent(data?.notes || '<p></p>');
    //         }
    //         setLoading(false);
    //     };
    //     fetchNotes();
    // }, [user_book_id, editor]);

    // const saveNotes = async () => {
    //     if (!user_book_id || !editor) {
    //         console.error('user_book_id or editor is undefined');
    //         return;
    //     }
    //     const { error } = await supabase
    //         .from('UserBooks')
    //         .update({ notes: editor.getHTML() })
    //         .eq('user_book_id', user_book_id);

    //     if (error) {
    //         console.error('Error saving notes:', error.message);
    //     } else {
    //         console.log('Notes saved successfully');
    //     }
    // }



    return (
        <div className="notes-container">
            <h2>Notes for {book.title} by {book.author}</h2>
            <div className="toolbar">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={editor.isActive('bold') ? 'is-active' : ''}
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? 'is-active' : ''}
                >
                    Paragraph
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                >
                    H3
                </button>
               
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                    .
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                >
                    1,2,3
                </button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    Horizontal Rule
                </button>
            </div>
            <EditorContent editor={editor} className="prose" />
            <button className="save-button">Save Notes</button>
        </div>
    )
}

export default Notes;