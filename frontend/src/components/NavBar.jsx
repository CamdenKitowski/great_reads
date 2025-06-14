import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useContext } from 'react';
import { BookContext } from '../contexts/BookContext';
import "../css/NavBar.css";


function NavBar() {

    const { setSearchQuery } = useContext(BookContext);

    function onSubmit(event) {
        event.preventDefault();
        const query = event.target.elements.search.value;
        setSearchQuery(query);
        event.target.reset();
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
                <DropdownButton id="dropdown-basic-button" title="Bookshelf">
                    <Dropdown.Item as={Link} to="/bookshelf/wishlist">Wishlist</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/bookshelf/reading">Reading</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/bookshelf/done">Done</Dropdown.Item>
                </DropdownButton>

                <DropdownButton id="profile-dropdown" title="C">
                    <Dropdown.Item as={Link} to="/bookshelf">Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/home">Friends</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/home">Log out</Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    </div>
    );
}

export default NavBar