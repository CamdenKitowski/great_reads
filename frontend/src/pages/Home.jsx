import BookCard from "../components/BookCard";

function Home() {
    const books = [
        { id: 1, title: "Book One", author: "Author A" },
        { id: 2, title: "Book Two", author: "Author B" },
        { id: 3, title: "Book Three", author: "Author C" },
    ]

    return(
        <div className="books-grid">
            {books.map((book) => (
                <BookCard book={book} key={book.id} />
            ))}
        </div>
    )
}

export default Home;