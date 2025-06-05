import BookCard from "../components/BookCard";
import { useContext } from "react";
import { BookContext } from "../contexts/BookContext";
import "../css/Home.css";
// import supabase from "../config/supabaseClient";

function Home() {
    const { books, loading, error, searchQuery } = useContext(BookContext);
    
    return (
        <div className="home">
            <h2>{searchQuery ? `Search results for..."${searchQuery}"` : "my list"}</h2>
            
            
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : books.length > 0 ? (
                <div className="books-grid">
                    {books.map((book) => (
                        <BookCard book={book} key={book.openLibraryKey} />
                    ))}
                </div>
            ): (
                <p>No books found. Try a different search.</p>
            )}
        </div>
    )
}

export default Home;