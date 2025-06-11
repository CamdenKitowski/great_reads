import { useContext } from "react";
import { BookContext } from "../contexts/BookContext";
import BookCard from "../components/BookCard";
import "../css/Bookshelf.css";

function Bookshelf() {
    const {favorites} = useContext(BookContext);

    console.log("favorites", favorites);
    console.log(favorites.length);

    if (favorites.length > 0) {
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="books-grid">
                    {/* this is prop driling */}
                    {favorites.map((book) => (<BookCard book={book} key={book.openLibraryKey} />
                ))}
                </div>
            </div>
        )
    }

    return (
        <p>No books added yet.</p>
    ) 

}

export default Bookshelf;