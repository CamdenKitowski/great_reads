import "../css/BookCard.css";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useContext } from "react";
import { BookContext } from "../contexts/BookContext";

function BookCard({ book }) {

    const {isFavorite, addToFavorites, removeFromFavorites } = useContext(BookContext);
    const favorite = isFavorite(book.key);

    const shortenTitleByWords = (title, maxWords) => {
        const words = title.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return title;
    };

    function onFavoriteClick(e) {
        e.preventDefault();
        if (favorite) {
            removeFromFavorites(book.book_id); // need to add book id
        } else {
            addToFavorites(book);
        }
    }

    return (
        <div className="book-card">
            <div className="book-poster">
                <img src={book.url} alt={book.title} />
                <div className="book-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`}onClick={onFavoriteClick}>
                        +
                    </button>
                </div>
            </div>
            <div className="book-details">
                <div className="book-info">
                    <h3 title={book.title}>{shortenTitleByWords(book.title, 8)}</h3>
                    <p>{book.author}</p>
                </div>
                <div className="book-notes">
                    <Link to="/notes">Notes</Link>
                </div>
            </div>
        </div>
    );
}

export default BookCard;