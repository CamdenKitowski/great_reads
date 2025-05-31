import { createContext, useState, useEffect } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {

    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get books details from query
    const searchBooks = async (query) => {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`http://openlibrary.org/search.json?q=title:${encodedQuery}+OR+author:${encodedQuery}`);
        const data = await response.json();
        const books = data.docs.slice(0,20).map((doc) => ({
            id: doc.key,
            title: doc.title,
            author: doc.author_name ? doc.author_name[0] : "Unknown Author",
            url: `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
        }));
        console.log("Books fetched:", books);
        return books;
    };

    useEffect(() =>{
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

    return (
        <BookContext.Provider value={{ searchQuery, setSearchQuery, books, loading, error }}>
            {children}
        </BookContext.Provider>
    );

};



