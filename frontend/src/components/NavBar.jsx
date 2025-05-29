import { Link } from 'react-router-dom';
import "../css/NavBar.css";

function NavBar() {
    return <nav className="navbar">
        <div className='navbar-brand'>
            <Link to="/">Great Reads</Link>
        </div>
        <div className='navbar-links'>
            <Link to="/" className="nav-link">User</Link>
        </div>
    </nav>
}

export default NavBar