import "../css/BookCard.css";
import { Link } from "react-router-dom";

function BookCard({ book }) {
    return (
        <div className="book-card">
            <div className="book-poster">
                {/* <img src={`https://covers.openlibrary.org/b/id/240727-L.jpg`} alt={book.title} /> */}
                <img src={book.url} alt={book.title} />
                <div className="book-overlay">
                    <button className="favorite-btn">
                        ♥
                    </button>
                </div>
            </div>
            <div className="book-details">
                <div className="book-info">
                    <h3>{book.title}</h3>
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