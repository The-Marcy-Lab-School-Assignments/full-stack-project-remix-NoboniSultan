import './FilterBar.css';

export default function FilterBar({ statusFilter, genreFilter, genres, onStatusChange, onGenreChange }) {
    return (
        <div className="filter-bar">
            <div className="form-group filter-group">
                <label htmlFor="status-filter">Status</label>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                </select>
            </div>

            <div className="form-group filter-group">
                <label htmlFor="genre-filter">Genre</label>
                <select
                    id="genre-filter"
                    value={genreFilter}
                    onChange={(e) => onGenreChange(e.target.value)}
                >
                    {genres.map((g) => (
                        <option key={g} value={g}>
                            {g === 'all' ? 'All Genres' : g}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}