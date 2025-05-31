import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { BookContext } from '../contexts/BookContext';
import "../css/NavBar.css";

function NavBar() {
    
    const { setSearchQuery } = useContext(BookContext);

    function onSubmit(event) {
        event.preventDefault();
        const query = event.target.elements.search.value;
        setSearchQuery(query);
    }
    
    return (<div className="navbar">
        <div className='navbar-brand'>
            <Link to="/">Great Reads</Link>
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
            <Link to="/" className="nav-link">My Reading List</Link>
        </div>
    </div>
    );
}

export default NavBar