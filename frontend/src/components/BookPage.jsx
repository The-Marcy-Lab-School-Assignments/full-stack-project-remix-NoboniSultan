import { useState, useEffect } from 'react';
import { fetchBooks } from '../adapters/bookAdapters';
import BookList from './BookList';
import AddBookForm from './AddBookForm';
import FilterBar from './FilterBar';
import './BookPage.css';

export default function BookPage({ currentUser, onLogout }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  const loadBooks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const genres = ['all', ...new Set(books.map((b) => b.genre).filter(Boolean))];

  const filteredBooks = books.filter((book) => {
    const matchStatus = statusFilter === 'all' || book.status === statusFilter;
    const matchGenre = genreFilter === 'all' || book.genre === genreFilter;
    return matchStatus && matchGenre;
  });

  return (
    <div className="book-page">
      {/* ── Header ── */}
      <header className="book-page-header">
        <div className="header-left">
          <h1 className="header-logo">বই</h1>
          <p className="header-greeting">
            Hello, <span>{currentUser.username}</span>
          </p>
        </div>
        <div className="header-right">
          <button className="btn-secondary" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      {/* ── Add Book Modal ── */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <AddBookForm
              onBookAdded={() => {
                setShowAddForm(false);
                loadBooks();
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="book-page-main">
        <div className="books-toolbar">
          <div className="books-count">
            {isLoading ? '' : `${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''}`}
          </div>
          <FilterBar
            statusFilter={statusFilter}
            genreFilter={genreFilter}
            genres={genres}
            onStatusChange={setStatusFilter}
            onGenreChange={setGenreFilter}
          />
        </div>

        {error && <p className="page-error" role="alert">{error}</p>}

        <BookList
          books={filteredBooks}
          isLoading={isLoading}
          onRefresh={loadBooks}
        />
      </main>

      {/* ── Floating Add Button ── */}
      <button
        className="fab"
        onClick={() => setShowAddForm(true)}
        aria-label="Add a book"
      >
        <img src="/book-pic.png" alt="" />
      </button>
    </div>
  );
}