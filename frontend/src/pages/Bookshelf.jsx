import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import "../css/Bookshelf.css";
import supabase from "../config/supabaseClient";
import BookCard from "../components/BookCard";


function Bookshelf() {
    const { status } = useParams();
    const [booksOnBookshelf, setBooksOnBookshelf] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() =>  {
        if (!user) {
            setBooksOnBookshelf([]);
            return;
        }

        const fetchBooksOnBookshelf = async() => {
            console.log('fetching bookshelf books');
            console.log('status: ', status);
            console.log("user: ", user.id);
            const { data, error } = await supabase
                .from('UserBooks')
                .select('book_id, user_book_id, Books (key, title, author, cover_i)')
                .eq('user_id', user.id)
                .eq('status', status);

            if (error) {
                console.error(`Error fetching books for status "${status}":`, error.message);
                setBooksOnBookshelf([]);
            } else {
                const flattenedBooks = data.map(item => ({
                    user_book_id: item.user_book_id,
                    book_id: item.book_id,
                    openLibraryKey: item.Books.key,
                    title: item.Books.title,
                    author: item.Books.author,
                    cover_i: item.Books.cover_i,
                    url: `https://covers.openlibrary.org/b/id/${item.Books.cover_i}-L.jpg`
                }));
                setBooksOnBookshelf(flattenedBooks || []);
            }
        };        
        fetchBooksOnBookshelf();

    }, [status, user]);

    if (booksOnBookshelf.length > 0) {
        return (
            <div id="bookshelf">
                <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
                <div className="books-grid">
                    {booksOnBookshelf.map((book) => (
                        <BookCard book={book} key={book.openLibraryKey} />
                    ))}
                </div>
            </div>
        )
    }


    return (
        <p>No books in {status} yet.</p>
    ) 

}

export default Bookshelf;