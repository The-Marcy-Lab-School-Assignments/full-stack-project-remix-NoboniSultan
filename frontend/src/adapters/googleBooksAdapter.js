const BASE = 'https://openlibrary.org';

export const searchBooks = async (query, maxResults = 20) => {
  if (!query.trim()) return [];

  const res = await fetch(
    `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}&fields=key,title,author_name,subject,cover_i,first_sentence`
  );
  const data = await res.json();
  if (!data.docs) return [];

  return data.docs.map((doc) => {
    const cover = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null;

    return {
      googleId: doc.key,
      title: doc.title || 'Unknown Title',
      author: doc.author_name?.[0] || 'Unknown Author',
      genre: doc.subject?.[0] || '',
      description: doc.first_sentence?.value || doc.first_sentence || '',
      cover,
    };
  });
};