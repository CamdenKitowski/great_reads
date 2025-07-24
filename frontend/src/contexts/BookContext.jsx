import { createContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useContext } from 'react';
import defaultBookCover from '../images/great_reads_dummy.png';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {

    const { user } = useContext(AuthContext);
    const [books, setBooks] = useState([]); // for queries 
    const [userBooks, setUserBooks] = useState({}); // for status 
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { API_BASE_URL } = useContext(AuthContext);

    // Get books details from query
    const searchBooks = async (query) => {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://openlibrary.org/search.json?q=title:${encodedQuery}+OR+author:${encodedQuery}`);
        const data = await response.json();
        const books = data.docs.slice(0, 20).map((doc) => ({
            openLibraryKey: doc.key,
            title: doc.title,
            author: doc.author_name ? doc.author_name[0] : "Unknown Author",
            cover_i: doc.cover_i,
            url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : defaultBookCover,

        }));
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

    // fetch books -- this is for tracking status
    useEffect(() => {
        const fetchUserBooks = async () => {
            if (!user) {
                setUserBooks({});
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/user-books?user_id=${user.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Transform array to map
                const userBooksMap = {};
                data.forEach((item) => {
                    if (item.openLibraryKey) {
                        // maps key to status
                        userBooksMap[item.openLibraryKey] = item.status;
                    }
                });
                setUserBooks(userBooksMap);
                setError(null);
            } catch (err) {
                console.error("Error fetching user books:", err.message);
                setUserBooks({});
                setError("Failed to fetch user books. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserBooks();
    }, [user]);

    // Set book status
    const setBookStatus = async (book, status) => {
        if (!user) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/set-book-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    book: book,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Set ${book.title} to ${status} in database`);
            setUserBooks((prev) => ({
                ...prev,
                [book.openLibraryKey]: status,
            }));
        } catch (err) {
            console.error(`Error adding book to ${status}:`, err.message);
        }
    };

    // Delete book
    const deleteUserBook = async (book) => {
        if (!user) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/delete-user-book`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    book_id: book.book_id,
                    openLibraryKey: book.openLibraryKey,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Removed ${book.title} in database`);
            setUserBooks((prev) => {
                const updated = { ...prev };
                delete updated[book.openLibraryKey];
                return updated;
            });
        } catch (err) {
            console.error(`Error removing ${book.title}:`, err.message);
        }
    };

    const getBookStatus = (openLibraryKey) => userBooks[openLibraryKey] || [];

    const value = {
        searchQuery,
        setSearchQuery,
        books,
        loading,
        error,
        setBookStatus,
        deleteUserBook,
        getBookStatus,
        userBooks,
        API_BASE_URL
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );

};



