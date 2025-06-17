import { createContext, useState, useEffect } from "react";
import supabase from "../config/supabaseClient";
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
            url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` :  defaultBookCover,

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

    // this is for tracking status
    useEffect(() => {
        const fetchUserBooks = async () => {
            if (!user) {
                setUserBooks({});
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from("UserBooks")
                .select("Books (key), status")
                .eq("user_id", user.id);

            if (error) {
                console.error("Error fetching user books: ", error.message);
                setUserBooks({});
            } else {
                const map = {};
                data.forEach((item) => {
                    const key = item.Books.key;
                    map[key] = item.status;
                });
                setUserBooks(map);
            }
            setLoading(false);
        };
        fetchUserBooks();
    }, [user]);


    const setBookStatus = async (book, status) => {
        if (!user) return;

        let generatedBookId;

        const { data: existingBook, error: checkError } = await supabase
            .from('Books')
            .select('book_id')
            .eq('key', book.openLibraryKey)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking book in Books:', checkError.message);
            return;
        }

        if (!existingBook) {
            const { data: newBook, error: insertError } = await supabase
                .from('Books')
                .insert([{
                    key: book.openLibraryKey,
                    title: book.title,
                    author: book.author,
                    cover_i: book.cover_i
                }])
                .select('book_id')
                .single();
            if (insertError) {
                console.error('Error adding book to Books:', insertError.message);
                return;
            }
            generatedBookId = newBook.book_id;
        } else {
            generatedBookId = existingBook.book_id;
        }

        const { data, error } = await supabase
            .from('UserBooks')
            .upsert({
                user_id: user.id,
                book_id: generatedBookId,
                status: status
            }, {
                onConflict: ['user_id', 'book_id']
            })
            .select('user_book_id')
            .single();

        if (error) {
            console.error(`Error adding book to ${status}:`, error.message);
        } else {
            console.log(`Set ${book.title} to ${status} in database`);
            setUserBooks((prev) => ({
                ...prev,
                [book.openLibraryKey]: status
            }));
        }
    };


    const deleteUserBook = async (book) => {
        if (!user) return;

        const { data: bookData, error: fetchError } = await supabase
            .from('UserBooks')
            .delete()
            .eq('user_id', user.id)
            .eq('book_id', book.book_id)

        if (fetchError) {
            console.log(`Error removing ${book.title} `, fetchError.message);
            return
        } else {
            console.log(`Removed ${book.title} in database`);
            setUserBooks((prev) => {
                const updated = { ...prev };
                delete updated[book.openLibraryKey];
                return updated;
            });
        }
    }

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
        userBooks
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );

};



