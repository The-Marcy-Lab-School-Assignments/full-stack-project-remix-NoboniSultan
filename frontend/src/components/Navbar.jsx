// Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar({ currentUser, onLogout }) {
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <Link to="/" className="navbar-logo">বই</Link>
            <div className="navbar-links">
                <Link to="/" className={pathname === '/' ? 'nav-link nav-link--active' : 'nav-link'}>
                    Discover
                </Link>
                <Link to="/books" className={pathname === '/books' ? 'nav-link nav-link--active' : 'nav-link'}>
                    My Shelf
                </Link>
            </div>
            <div className="navbar-right">
                <ThemeToggle />
                <span className="navbar-user">{currentUser.username}</span>
                <button className="btn-secondary navbar-logout" onClick={onLogout}>Log Out</button>
            </div>
        </nav>
    );
}