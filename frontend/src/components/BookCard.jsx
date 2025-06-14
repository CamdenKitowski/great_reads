import "../css/BookCard.css";
import { Link } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { useContext } from "react";
import { BookContext } from "../contexts/BookContext";

function BookCard({ book }) {

    // const {favorites, isFavorite, addToFavorites, removeFromFavorites } = useContext(BookContext);
    // const favorite = isFavorite(book.openLibraryKey);

    const shortenTitleByWords = (title, maxWords) => {
        const words = title.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return title;
    };

    function onFavoriteClick(e) {
        console.log('dummyyy function');
        
        // e.preventDefault();
        // if (favorite) {
        //     removeFromFavorites(book);
        // } else {
        //     addToFavorites(book);
        // }
    }

    // const favoriteBook = favorites.find(fav => fav.book_id === book.book_id);
    // const notesLink = favoriteBook ? `/notes/${favoriteBook.user_book_id}` : null;

    const notesLink = book.user_book_id ? `/notes/${book.user_book_id}` : null;

    

    // className={`favorite-btn ${favorite ? "active" : ""}`}onClick={onFavoriteClick}
    return (
        <div className="book-card">
            <div className="book-poster">
                <img src={book.url} alt={book.title} />
                <div className="book-overlay">
                    {/* need to add functionality for each status -- so you can it */}
                    <button>
                        ♥
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