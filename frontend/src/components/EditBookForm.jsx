import { useState } from 'react';
import { fetchUpdateBook } from '../adapters/bookAdapters';
import './BookForm.css';

export default function EditBookForm({ book, onBookUpdated, onCancel }) {
    const [form, setForm] = useState({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        status: book.status || 'want-to-read',
        rating: book.rating != null ? String(book.rating) : '',
        notes: book.notes || '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await fetchUpdateBook(book.book_id, {
                ...form,
                rating: form.rating ? Number(form.rating) : null,
            });
            onBookUpdated();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="book-form-container">
            <div className="book-form-header">
                <h2>Edit Book</h2>
                <button className="form-close-btn" onClick={onCancel} aria-label="Close">✕</button>
            </div>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <form onSubmit={handleSubmit} className="book-form">
                <div className="form-group">
                    <label htmlFor="edit-title">Title *</label>
                    <input id="edit-title" name="title" type="text" value={form.title}
                        onChange={handleChange} required autoFocus />
                </div>

                <div className="form-group">
                    <label htmlFor="edit-author">Author *</label>
                    <input id="edit-author" name="author" type="text" value={form.author}
                        onChange={handleChange} required />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="edit-genre">Genre</label>
                        <input id="edit-genre" name="genre" type="text" value={form.genre}
                            onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-status">Status</label>
                        <select id="edit-status" name="status" value={form.status} onChange={handleChange}>
                            <option value="want-to-read">Want to Read</option>
                            <option value="reading">Reading</option>
                            <option value="finished">Finished</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="edit-rating">Rating (1–5)</label>
                    <select id="edit-rating" name="rating" value={form.rating} onChange={handleChange}>
                        <option value="">No rating</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>{'★'.repeat(n)}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="edit-notes">Notes</label>
                    <textarea id="edit-notes" name="notes" value={form.notes}
                        onChange={handleChange} rows={3} />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn-primary form-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}