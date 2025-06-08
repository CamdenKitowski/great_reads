import "../css/Notes.css";
import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';



function Notes() {
    const { user_book_id } = useParams();
    const location = useLocation();
    const book = location.state?.book; // Get the book from the state passed by the BookCard component
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(true); // might not need this, but it helps with the loading state


    console.log("user_book_id", user_book_id);
    useEffect(() => {
        const fetchNotes = async () => {
            const { data, error } = await supabase
                .from('UserBooks')
                .select('notes')
                .eq('user_book_id', user_book_id)
                .single();
            
            if (error) {
                console.error('Error fetching notes:', error.message);
            } else {
                setNotes(data.notes || ""); // Set notes or empty string if null
            }
            setLoading(false);
        };
        fetchNotes();
    }, [user_book_id]);

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    }

    const saveNotes = async () => {
        const { error } = await supabase
            .from('UserBooks')
            .update({ notes })
            .eq('user_book_id', user_book_id);
        
        if (error) {
            console.error('Error saving notes:', error.message);
        } else {
            console.log('Notes saved successfully');
        }
    }


    return (
        <div className="notes-container">
            <h2>Notes for {book.title} by {book.author}</h2>
            <textarea value={notes} onChange={handleNotesChange} rows="10" cols="50" />
            <button onClick={saveNotes}>Save Notes</button>
        </div>
    )
}

export default Notes;