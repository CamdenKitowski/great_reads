import { createContext, useState, useEffect } from "react";
import supabase from "../config/supabaseClient";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {

    // books to add from the search
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    

    // Get books details from query
    const searchBooks = async (query) => {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`http://openlibrary.org/search.json?q=title:${encodedQuery}+OR+author:${encodedQuery}`);
        const data = await response.json();
        const books = data.docs.slice(0, 20).map((doc) => ({
            key: doc.key,
            title: doc.title,
            author: doc.author_name ? doc.author_name[0] : "Unknown Author",
            cover_i: doc.cover_i,
            url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
        }));
        console.log("Books fetched:", books);
        return books;
    };

    useEffect(() => {
        if (!searchQuery.trim()) return

        const loadSearchResults = async () => {
            setLoading(true);
            try {
                const searchResult = await searchBooks(searchQuery);
                setBooks(searchResult);
                setError(null);
            } catch (err) {
                console.log("Error fetching books:", err);
                setError("Failed to fetch books. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadSearchResults();
    }, [searchQuery]);


    const addToFavorites = async (book) => {
        const defaultUserId = '550e8400-e29b-41d4-a716-446655440000';
        let generatedBookId;

        const { data: existingBook, error: checkError } = await supabase
            .from('Books')
            .select('book_id')
            .eq('key', book.key)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 means "no rows found", which is fine; other errors are problems
            console.error('Error checking book in Books:', checkError.message);
            return;
        }

        // get book_id
        if (!existingBook) {
            // book does not exist, insert it
            const { data: newBook, error: insertError } = await supabase
                .from('Books')
                .insert([{
                    title: book.title,
                    author: book.author,
                    cover_i: book.cover_i,
                    key: book.key
                }])
                .select('book_id')
                .single();
            if (insertError) {
                console.error('Error adding book to Books:', insertError.message);
                return;
            }
            generatedBookId = newBook.book_id;
        } else {
            // book exists, use its ID
            generatedBookId = existingBook.book_id;
        }

        // insert into UserBooks
        const { error } = await supabase
            .from('UserBooks')
            .insert([{
                user_id: defaultUserId,
                book_id: generatedBookId,
                status: 'reading_list'
            }]);

        // update favorites state
        if (error) {
            console.error('Error adding to favorites:', error.message);
        } else {
            console.log('Added to UserBooks');
            setFavorites(prev => [...prev, {
                key: book.key,
                title: book.title,
                author: book.author,
                cover_i: book.cover_i,
                url: book.url,
                book_id: generatedBookId
            }]);
        }
    }

    const removeFromFavorites = async (bookToRemove_id) => {
        const defaultUserId = '550e8400-e29b-41d4-a716-446655440000';
        const {error} = await supabase
            .from('UserBooks')
            .delete()
            .eq('user_id', defaultUserId)
            .eq('book_id', bookToRemove_id)
            .eq('status', 'reading_list');
        if (error) {
            console.error('Error removing from favorites:', error.message);
        } else {
            console.log('Removed from UserBooks');
            setFavorites(prev => prev.filter(book => book.book_id !== bookToRemove_id));
        }
    } 

    const isFavorite = (key) => {
        return favorites.some(book => book.key === key);
    }

    const value = {
        searchQuery,
        setSearchQuery,
        books,
        loading,
        error,
        favorites,
        addToFavorites,
        isFavorite,
        removeFromFavorites
    };



    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );

};



