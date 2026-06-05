import { useState } from 'react';
import { fetchCreateBook } from '../adapters/bookAdapters';
import './BookForm.css';

// Builds an Open Library cover URL from the book title.
// Stored in the DB at creation time so it never needs re-fetching.
const buildCoverUrl = (title) => {
  if (!title) return '';
  const encoded = encodeURIComponent(title.trim());
  return `https://covers.openlibrary.org/b/title/${encoded}-L.jpg`;
};

export default function AddBookForm({ onBookAdded, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'want-to-read',
    rating: '',
    notes: '',
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
      const cover_url = buildCoverUrl(form.title);
      await fetchCreateBook({
        ...form,
        rating: form.rating ? Number(form.rating) : null,
        cover_url,
      });
      onBookAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="book-form-container">
      <div className="book-form-header">
        <h2>Add a Book</h2>
        <button className="form-close-btn" onClick={onCancel} aria-label="Close">✕</button>
      </div>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="add-title">Title *</label>
          <input id="add-title" name="title" type="text" value={form.title}
            onChange={handleChange} placeholder="e.g. Dune" required autoFocus />
        </div>

        <div className="form-group">
          <label htmlFor="add-author">Author *</label>
          <input id="add-author" name="author" type="text" value={form.author}
            onChange={handleChange} placeholder="e.g. Frank Herbert" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="add-genre">Genre</label>
            <input id="add-genre" name="genre" type="text" value={form.genre}
              onChange={handleChange} placeholder="e.g. Sci-Fi" />
          </div>

          <div className="form-group">
            <label htmlFor="add-status">Status</label>
            <select id="add-status" name="status" value={form.status} onChange={handleChange}>
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="add-rating">Rating (1–5)</label>
          <select id="add-rating" name="rating" value={form.rating} onChange={handleChange}>
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{'★'.repeat(n)}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="add-notes">Notes</label>
          <textarea id="add-notes" name="notes" value={form.notes}
            onChange={handleChange} placeholder="Your thoughts…" rows={3} />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary form-submit-btn" disabled={isLoading}>
            {isLoading ? 'Adding…' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
}