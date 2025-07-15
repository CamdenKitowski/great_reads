import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from 'react';
import { BookContext } from '../contexts/BookContext';
import { AuthContext } from '../contexts/AuthContext';
import "../css/NavBar.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';


function NavBar() {

    // State for Bookshelf menu
    const [bookshelfAnchorEl, setBookshelfAnchorEl] = useState(null);
    const bookshelfOpen = Boolean(bookshelfAnchorEl);
    const { setSearchQuery } = useContext(BookContext);
    const { signOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleBookshelfClick = (event) => {
        setBookshelfAnchorEl(event.currentTarget);
    };
    const handleBookshelfClose = () => {
        setBookshelfAnchorEl(null);
    };

    // State for Profile menu
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const profileOpen = Boolean(profileAnchorEl);
    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };
    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    }

    function onSubmit(event) {
        event.preventDefault();
        const query = event.target.elements.search.value;
        setSearchQuery(query);
        event.target.reset();
    }

    const handleLogOut = async (e) => {
        try {
            const { error } = await signOut();
            if (error) {
                console.error("Sign out failed: ", error);
                return;
            }
            console.log('You logged out');
            navigate('/');
        } catch (err) {
            console.error("Sign out error: ", err.message);
        }
    }

    return (<div className="navbar">
        <div className='navbar-content'>
            <div className='navbar-brand'>
                <Link to="/home">Great Reads</Link>
            </div>
            <form onSubmit={onSubmit} className="search-form">
                <input
                    type="text"
                    name="search"
                    placeholder="Search for books..."
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
            <div className='navbar-links'>
                {/* Bookshelf Menu */}
                <Button
                    id="bookshelf-button"
                    aria-controls={bookshelfOpen ? 'bookshelf-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={bookshelfOpen ? 'true' : undefined}
                    onClick={handleBookshelfClick}
                >
                    Bookshelf
                </Button>
                <Menu
                    id="bookshelf-menu"
                    anchorEl={bookshelfAnchorEl}
                    open={bookshelfOpen}
                    onClose={handleBookshelfClose}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'bookshelf-button',
                        },
                    }}
                    disableScrollLock={true}

                >
                    <MenuItem component={Link} to="/bookshelf/wishlist" onClick={handleBookshelfClose}>
                        Wishlist
                    </MenuItem>
                    <MenuItem component={Link} to="/bookshelf/reading" onClick={handleBookshelfClose}>
                        Reading
                    </MenuItem>
                    <MenuItem component={Link} to="/bookshelf/done" onClick={handleBookshelfClose}>
                        Done
                    </MenuItem>
                </Menu>

                {/* Profile Menu */}
                <Button
                    id="profile-button"
                    aria-controls={profileOpen ? 'profile-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={profileOpen ? 'true' : undefined}
                    onClick={handleProfileClick}
                >
                    C
                </Button>
                <Menu
                    id="profile-menu"
                    anchorEl={profileAnchorEl}
                    open={profileOpen}
                    onClose={handleProfileClose}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'profile-button',
                        },
                    }}
                    disableScrollLock={true}
                >
                    <MenuItem component={Link} to="/home" onClick={handleProfileClose}>
                        Profile
                    </MenuItem>
                    <MenuItem component={Link} to="/home" onClick={handleProfileClose}>
                        Friends
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { handleLogOut(); handleProfileClose(); }}>
                        Log out
                    </MenuItem>
                </Menu>
            </div>
        </div>
    </div>
    );
}

export default NavBar