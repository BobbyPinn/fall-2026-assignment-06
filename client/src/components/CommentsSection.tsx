import { useEffect, useState } from 'react';
import { getComments, type Comment } from '../api/articles';

// This component receives the article's id from the page it's placed in
export default function CommentsSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load this article's comments
  useEffect(() => {
    getComments(articleId)
      .then(setComments)
      .catch(() => setError('Could not load comments.'))
      .finally(() => setLoading(false));
  }, [articleId]);

  return (
    <section className="comments">
      <h2>Comments</h2>

      {loading && <p>Loading comments…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && comments.length === 0 && (
        <p className="empty">No comments yet.</p>
      )}

      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.commentId}>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}