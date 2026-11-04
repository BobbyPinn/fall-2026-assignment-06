import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getArticle, updateArticle } from '../api/articles';

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Load the article and fill in the form fields
  useEffect(() => {
    if (!id) return;
    getArticle(Number(id))
      .then((article) => {
        setTitle(article.title);
        setContents(article.contents);
      })
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validation: don't allow blank fields
    if (!title.trim() || !contents.trim()) {
      setError('Title and contents are both required.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await updateArticle(Number(id), { title, contents });
      navigate(`/articles/${id}`); // back to the updated article
    } catch {
      setError('Failed to update article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="page">Loading…</div>;
  }

  return (
    <div className="page">
      <Link to={`/articles/${id}`} className="back-link">← Back to article</Link>
      <h1>Edit Article</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="article-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Contents
          <textarea
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={8}
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <Link to={`/articles/${id}`}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}