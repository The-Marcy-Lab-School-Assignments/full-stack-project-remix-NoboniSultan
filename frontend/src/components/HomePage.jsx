import { useState, useEffect, useRef } from 'react';
import { searchBooks } from '../adapters/googleBooksAdapter';
import { fetchCreateBook } from '../adapters/bookAdapters';
import './HomePage.css';

const GENRES = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
    'Mystery', 'Biography', 'History', 'Science', 'Self-Help'];

export default function HomePage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBook, setSelected] = useState(null);
    const [activeGenre, setGenre] = useState('');
    const [sidebarOpen, setSidebar] = useState(true);
    const [addedIds, setAddedIds] = useState(new Set());
    const debounceRef = useRef(null);

    // Debounced search — fires 500ms after user stops typing
    useEffect(() => {
        if (!query && !activeGenre) { setResults([]); return; }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            const searchTerm = activeGenre ? `subject:${activeGenre} ${query}` : query;
            const books = await searchBooks(searchTerm || `subject:${activeGenre}`);
            setResults(books);
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [query, activeGenre]);

    const handleAdd = async (book) => {
        await fetchCreateBook({
            title: book.title,
            author: book.author,
            genre: book.genre,
            status: 'want-to-read',
            cover_url: book.cover,
        });
        setAddedIds((prev) => new Set(prev).add(book.googleId));
    };

    return (
        <div className="home-page">
            {/* Search bar */}
            <div className="home-hero">
                <h2 className="home-title">Discover your next read</h2>
                <div className="search-bar-wrapper">
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search by title, author, or topic…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {isLoading && <span className="search-spinner" />}
                </div>
            </div>

            <div className="home-body">
                {/* Genre sidebar */}
                <aside className={`genre-sidebar ${sidebarOpen ? '' : 'genre-sidebar--collapsed'}`}>
                    <button className="sidebar-toggle" onClick={() => setSidebar((o) => !o)}>
                        {sidebarOpen ? '‹ Hide' : '›'}
                    </button>
                    {sidebarOpen && (
                        <>
                            <p className="sidebar-label">Browse by genre</p>
                            <ul className="genre-list">
                                <li>
                                    <button
                                        className={`genre-btn ${!activeGenre ? 'genre-btn--active' : ''}`}
                                        onClick={() => setGenre('')}
                                    >All</button>
                                </li>
                                {GENRES.map((g) => (
                                    <li key={g}>
                                        <button
                                            className={`genre-btn ${activeGenre === g ? 'genre-btn--active' : ''}`}
                                            onClick={() => setGenre(g)}
                                        >{g}</button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </aside>

                {/* Results grid */}
                <main className="results-grid">
                    {!isLoading && results.length === 0 && (
                        <div className="home-empty">
                            <p>Search for a book or pick a genre to get started.</p>
                        </div>
                    )}
                    {results.map((book) => (
                        <div
                            key={book.googleId}
                            className="result-card"
                            onClick={() => setSelected(book)}
                        >
                            <div className="result-cover-wrapper">
                                <img
                                    src={book.cover || '/placeholder-cover.svg'}
                                    alt={book.title}
                                    onError={(e) => { e.target.src = '/placeholder-cover.svg'; }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="result-info">
                                <p className="result-title">{book.title}</p>
                                <p className="result-author">{book.author}</p>
                            </div>
                        </div>
                    ))}
                </main>
            </div>

            {/* Expanded book detail — glass panel */}
            {selectedBook && (
                <div className="detail-overlay" onClick={() => setSelected(null)}>
                    <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
                        <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
                        <div className="detail-inner">
                            <img
                                className="detail-cover"
                                src={selectedBook.cover || '/placeholder-cover.svg'}
                                alt={selectedBook.title}
                                onError={(e) => { e.target.src = '/placeholder-cover.svg'; }}
                            />
                            <div className="detail-meta">
                                <h2>{selectedBook.title}</h2>
                                <p className="detail-author">{selectedBook.author}</p>
                                {selectedBook.genre && <p className="detail-genre">{selectedBook.genre}</p>}
                                <p className="detail-desc">{selectedBook.description || 'No description available.'}</p>
                                <button
                                    className="btn-primary detail-add-btn"
                                    onClick={() => handleAdd(selectedBook)}
                                    disabled={addedIds.has(selectedBook.googleId)}
                                >
                                    {addedIds.has(selectedBook.googleId) ? '✓ Added to shelf' : '+ Add to My Shelf'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}