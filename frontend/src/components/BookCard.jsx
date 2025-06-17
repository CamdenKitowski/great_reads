import "../css/BookCard.css";
import { Link } from "react-router-dom";
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useContext } from 'react';
import { BookContext } from '../contexts/BookContext';


function BookCard({ book }) {

    const [bookCardAnchorEl, setbookCardAnchorEl] = useState(null);
    const bookCardOpen = Boolean(bookCardAnchorEl);
    const { setBookStatus, deleteUserBook, getBookStatus } = useContext(BookContext);

    const currentStatus = getBookStatus(book.openLibraryKey);

    const handleBookCardClick = (event) => {
        setbookCardAnchorEl(event.currentTarget);
    };
    const handleBookCardClose = (action) => {
        if (action === 'delete') {
            const confirmDelete = window.confirm('Are you sure you want to remove this book from your bookshelf?');
            if (confirmDelete) {
                deleteUserBook(book);
            }
        } else if (action) {
            setBookStatus(book, action); // For status updates like 'wishlist', 'reading', 'done'
        }
        setbookCardAnchorEl(null);
    };

    const shortenTitleByWords = (title, maxWords) => {
        const words = title.split(' ');
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return title;
    };


    const notesLink = book.user_book_id ? `/notes/${book.user_book_id}` : null;


    return (
        <div className="book-card">
            <div className="book-poster">
                <img src={book.url} alt={book.title} />
                <div className="book-overlay">
                    <Button
                        id="bookcard-button"
                        aria-controls={bookCardOpen ? 'bookcard-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={bookCardOpen ? 'true' : undefined}
                        onClick={handleBookCardClick}
                    >
                        Move to Bookshelf
                    </Button>
                    <Menu
                        id="bookcard-menu"
                        anchorEl={bookCardAnchorEl}
                        open={bookCardOpen}
                        onClose={handleBookCardClose}
                        slotProps={{
                            list: {
                                'aria-labelledby': 'bookcard-button',
                            },
                        }}
                        disableScrollLock={true}
                    >
                        <MenuItem
                            onClick={() => handleBookCardClose('wishlist')}
                            disabled={currentStatus === 'wishlist'}
                        >
                            Wishlist
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleBookCardClose('reading')}
                            disabled={currentStatus === 'reading'}
                        >
                            Reading
                        </MenuItem>
                        <MenuItem onClick={() =>
                            handleBookCardClose('done')}
                            disabled={currentStatus === 'done'}
                        >
                            Done
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => handleBookCardClose('delete')}>
                            Delete
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <div className="book-details">
                <div className="book-info">
                    <h3 title={book.title}>{shortenTitleByWords(book.title, 8)}</h3>
                    <p>{book.author}</p>
                </div>
                <div className="book-notes">
                    {notesLink ? (
                        <Link to={notesLink} state={{ book }}>Notes</Link>
                    ) : (
                        <span></span>
                    )}

                </div>
            </div>
        </div>
    );
}

export default BookCard;