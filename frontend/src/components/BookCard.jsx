import "../css/BookCard.css";
import { Link } from "react-router-dom";

function BookCard({ book }) {

    const shortenTitleByWords = (title, maxWords) => {
        const words = title.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return title;
    };

    return (
        <div className="book-card">
            <div className="book-poster">
                {/* <img src={`https://covers.openlibrary.org/b/id/240727-L.jpg`} alt={book.title} /> */}
                <img src={book.url} alt={book.title} />
                <div className="book-overlay">
                    <button className="favorite-btn">
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