import { Link } from 'react-router-dom';
import "../css/NavBar.css";

function NavBar() {
    
    function onClick() {
        alert("clicked");
    }
    
    return <div className="navbar">
        <div className='navbar-brand'>
            <Link to="/">Great Reads</Link>
        </div>
        <form onSubmit={onClick} className="search-form">
            <input
                type="text"
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
}

export default NavBar