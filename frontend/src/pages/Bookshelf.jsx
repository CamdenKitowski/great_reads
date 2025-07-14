import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { BookContext } from "../contexts/BookContext";
import { useParams } from "react-router-dom";
import "../css/Bookshelf.css";
import BookCard from "../components/BookCard";


function Bookshelf() {
    const { status } = useParams();
    const [booksOnBookshelf, setBooksOnBookshelf] = useState([]);
    const { user } = useContext(AuthContext);
    const { API_BASE_URL } = useContext(AuthContext);
    const { userBooks } = useContext(BookContext);

    useEffect(() =>  {
        if (!user) {
            setBooksOnBookshelf([]);
            return;
        }

        const fetchBooksOnBookshelf = async() => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/books-by-status?user_id=${user.id}&status=${status}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status ${response.status}`);
                }
                const data = await response.json();
                setBooksOnBookshelf(data || []);
            } catch (error) {
                console.error(`Error fetching books for status "${status}":`, error.message);
                setBooksOnBookshelf([]);
            }
        };        
        fetchBooksOnBookshelf();
    }, [status, user, userBooks]);

    if (booksOnBookshelf.length > 0) {
        return (
            <div id="bookshelf">
                <h2 id="title-status">{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                <div className="books-grid">
                    {booksOnBookshelf.map((book) => (
                        <BookCard book={book} key={book.openLibraryKey} />
                    ))}
                </div>
            </div>
        )
    }


    return (
        <p>No books in {status} yet.</p>
    ) 

}

export default Bookshelf;