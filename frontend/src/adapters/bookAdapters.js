const BASE = '/api/books';

export const fetchBooks = async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch books.');
    return res.json();
};

export const fetchCreateBook = async (bookData) => {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create book.');
    return data;
};

export const fetchUpdateBook = async (id, bookData) => {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update book.');
    return data;
};

export const fetchDeleteBook = async (id) => {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete book.');
    return data;
};