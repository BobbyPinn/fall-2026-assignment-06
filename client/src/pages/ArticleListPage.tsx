import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles, type Article } from '../api/articles';

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Runs when the page first loads, and again every time `search` changes
  useEffect(() => {
    setLoading(true);
    setError('');
    getArticles(search || undefined)
      .then(setArticles)
      .catch(() => setError('Could not load articles.'))
      .finally(() => setLoading(false));
  }, [search]);

  // Cut long contents down to a short preview
  function preview(text: string) {
    return text.length > 100 ? text.slice(0, 100) + '…' : text;
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Articles</h1>
        <button onClick={() => navigate('/articles/new')}>+ New Article</button>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Search by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="empty">No articles found.</p>
      )}

      <ul className="article-list">
        {articles.map((a) => (
          <li key={a.articleId} data-color={a.articleId % 6}>
            <Link to={`/articles/${a.articleId}`}>
              <h2>{a.title}</h2>
              <p>{preview(a.contents)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}