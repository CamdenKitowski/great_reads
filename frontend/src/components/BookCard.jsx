import "../css/BookCard.css"

function BookCard({ book }) {
    return (
        <div className="book-card">
            <div className="book-poster">
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
                    <h3>Notes</h3>
                </div>
            </div>

        </div>
    );
}

export default BookCard;