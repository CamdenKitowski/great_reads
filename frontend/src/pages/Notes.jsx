import "../css/Notes.css";

import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import supabase from '../config/supabaseClient';
import { useEditor, EditorContent, } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BookContext } from '../contexts/BookContext';



function Notes() {

    const { user_book_id } = useParams(); // get the user_book_id from the URL parameters
    const location = useLocation(); // get navigation contents with any passed state
    const book = location.state?.book; // Get the book from the state passed by the BookCard component
    const [loading, setLoading] = useState(true); // might not need this, but it helps with the loading state
    const { API_BASE_URL } = useContext(BookContext);

    // could make this a separate component later
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p></p>',
    });


    useEffect(() => {
        const fetchNotes = async () => {
            if (!user_book_id) {
                console.error('user_book_id is undefined');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/notes?user_book_id=${user_book_id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                editor?.commands.setContent(data?.notes || '<p></p>');
            } catch (err) {
                console.error('Error fetching notes:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [user_book_id, editor]);

    const saveNotes = async () => {
        console.log('user_book_id:', user_book_id);
        if (!user_book_id || !editor) {
            console.error('user_book_id or editor is undefined');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/notes`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    user_book_id,
                    notes: editor.getHTML(),
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);

            }
            console.log('Notes saved successfully');
        } catch (error) {
            console.error('Error saving notes:', error.message);
        }
    };

    return (
        <div className="notes-container">
            <div className="note-book-info">
                <div className="note-book-cover">
                    <img src={book.url} alt={book.title} />
                </div>
                <div className="note-book-details">
                    <h1>{book.title}</h1>
                    <h3>{book.author}</h3>
                </div>
            </div>

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
            <button onClick={saveNotes} className="save-button">Save Notes</button>
        </div>
    )
}

export default Notes;