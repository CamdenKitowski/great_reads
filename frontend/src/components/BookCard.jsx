import "../css/BookCard.css";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useContext } from "react";
import { BookContext } from "../contexts/BookContext";

function BookCard({ book }) {

    const {favorites, isFavorite, addToFavorites, removeFromFavorites } = useContext(BookContext);
    const favorite = isFavorite(book.openLibraryKey);

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
            removeFromFavorites(book);
        } else {
            addToFavorites(book);
        }
    }

    const favoriteBook = favorites.find(fav => fav.book_id === book.book_id);
    const notesLink = favoriteBook ? `/notes/${favoriteBook.user_book_id}` : null;

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
                    {notesLink ? (
                        <Link to={notesLink} state={{ book }}>Notes</Link>
                    ) : (
                        <span></span>
                    )}

                </div>
            </div>
        </div>
    );
}

export default BookCard;