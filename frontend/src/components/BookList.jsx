import BookCard from './BookCard';
import './BookList.css';

// Shown while books are loading
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-cover" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line skeleton-line--long" />
        <div className="skeleton skeleton-line skeleton-line--short" />
        <div className="skeleton skeleton-badge" />
      </div>
    </div>
  );
}

// Shown when the filtered list is empty
function EmptyState({ hasFilters }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">📚</span>
      {hasFilters ? (
        <>
          <h3>No books match those filters</h3>
          <p>Try changing or clearing your filters.</p>
        </>
      ) : (
        <>
          <h3>Your shelf is empty</h3>
          <p>Add your first book to get started.</p>
        </>
      )}
    </div>
  );
}

export default function BookList({ books, isLoading, onRefresh }) {
  if (isLoading) {
    return (
      <div className="book-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return <EmptyState hasFilters={false} />;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.book_id} book={book} onRefresh={onRefresh} />
      ))}
    </div>
  );
}