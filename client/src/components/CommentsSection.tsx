import { useEffect, useState, type FormEvent } from 'react';
import { createComment, getComments, type Comment } from '../api/articles';

// This component receives the article's id from the page it's placed in
export default function CommentsSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the "add a comment" form
  const [newBody, setNewBody] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load this article's comments
  useEffect(() => {
    getComments(articleId)
      .then(setComments)
      .catch(() => setError('Could not load comments.'))
      .finally(() => setLoading(false));
  }, [articleId]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();

    // Validation: don't allow an empty comment
    if (!newBody.trim()) {
      setFormError('Comment cannot be empty.');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      const created = await createComment(articleId, newBody);
      setComments([...comments, created]); // add it to the end of the list
      setNewBody(''); // clear the textarea
    } catch {
      setFormError('Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  }

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

      <form onSubmit={handleAdd} className="comment-form">
        {formError && <p className="error">{formError}</p>}
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="Write a comment…"
          rows={3}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting…' : 'Add Comment'}
        </button>
      </form>
    </section>
  );
}