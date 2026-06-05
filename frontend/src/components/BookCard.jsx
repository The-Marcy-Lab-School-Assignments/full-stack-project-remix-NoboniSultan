import { useState } from 'react';
import { fetchDeleteBook } from '../adapters/bookAdapters';
import EditBookForm from './EditBookForm';
import './BookCard.css';

// Maps status values to human-readable labels and CSS class suffixes
const STATUS_LABELS = {
    'want-to-read': 'Want to Read',
    'reading': 'Reading',
    'finished': 'Finished',
};

// Renders filled/empty star characters for a rating 1–5
function StarRating({ rating }) {
    if (!rating) return null;
    return (
        <div className="book-rating" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < rating ? 'star star--filled' : 'star'}>
                    {i < rating ? '★' : '☆'}
                </span>
            ))}
        </div>
    );
}

export default function BookCard({ book, onRefresh }) {
    const [showEdit, setShowEdit] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!confirm(`Remove "${book.title}" from your shelf?`)) return;
        setIsDeleting(true);
        setError('');
        try {
            await fetchDeleteBook(book.book_id);
            onRefresh();
        } catch (err) {
            setError(err.message);
            setIsDeleting(false);
        }
    };

    const statusClass = `status-badge status-${book.status}`;

    return (
        <>
            <article className="book-card">
                {/* Cover image */}
                <div className="book-card-cover-wrapper">
                    <img
                        className="book-card-cover"
                        src={book.cover_url || '/placeholder-cover.png'}
                        alt={`Cover of ${book.title}`}
                        onError={(e) => {
                            e.target.src = '/placeholder-cover.png';
                        }}
                        loading="lazy"
                    />
                    <span className={statusClass}>{STATUS_LABELS[book.status]}</span>
                </div>

                {/* Info */}
                <div className="book-card-body">
                    <h3 className="book-title" title={book.title}>{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    {book.genre && <p className="book-genre">{book.genre}</p>}
                    <StarRating rating={book.rating} />
                    {error && <p className="book-card-error">{error}</p>}
                </div>

                {/* Actions */}
                <div className="book-card-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => setShowEdit(true)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn-danger"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? '…' : 'Delete'}
                    </button>
                </div>
            </article>

            {/* Edit modal */}
            {showEdit && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowEdit(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <EditBookForm
                            book={book}
                            onBookUpdated={() => {
                                setShowEdit(false);
                                onRefresh();
                            }}
                            onCancel={() => setShowEdit(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}