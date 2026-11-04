
import CommentsSection from '../components/CommentsSection';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteArticle, getArticle, type Article } from '../api/articles';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load the article when the page opens (or when the id in the URL changes)
  useEffect(() => {
    if (!id) return;
    getArticle(Number(id))
      .then(setArticle)
      .catch(() => setError('Article not found.'));
  }, [id]);

  async function handleDelete() {
    if (!article) return;
    try {
      await deleteArticle(article.articleId);
      navigate('/'); // go back to the list after deleting
    } catch {
      setError('Failed to delete article.');
    }
  }

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
        <Link to="/">← Back to list</Link>
      </div>
    );
  }

  if (!article) {
    return <div className="page">Loading…</div>;
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to list</Link>
      <h1>{article.title}</h1>
      <div className="article-body">
        <p>{article.contents}</p>
      </div>

      <div className="form-actions">
        <button onClick={() => navigate(`/articles/${article.articleId}/edit`)}>
          Edit
        </button>
        <button className="danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <CommentsSection articleId={article.articleId} />
    </div>
  );
}