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
        <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>
        </div>
    </div>
  );
}

export default BookCard;