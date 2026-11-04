import { useEffect, useState, type FormEvent } from 'react';
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
  type Comment,
} from '../api/articles';

// This component receives the article's id from the page it's placed in
export default function CommentsSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the "add a comment" form
  const [newBody, setNewBody] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State for editing a comment
  const [editingId, setEditingId] = useState<number | null>(null); // which comment is being edited
  const [editBody, setEditBody] = useState('');
  const [editError, setEditError] = useState('');

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

  // Open the edit form for one comment, filled with its current text
  function startEdit(comment: Comment) {
    setEditingId(comment.commentId);
    setEditBody(comment.body);
    setEditError('');
  }

  // Close the edit form without saving
  function cancelEdit() {
    setEditingId(null);
    setEditBody('');
    setEditError('');
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (editingId === null) return;

    if (!editBody.trim()) {
      setEditError('Comment cannot be empty.');
      return;
    }

    try {
      const updated = await updateComment(articleId, editingId, editBody);
      // Swap the old comment for the updated one, keep all the others
      setComments(
        comments.map((c) => (c.commentId === updated.commentId ? updated : c)),
      );
      cancelEdit(); // close the form
    } catch {
      setEditError('Failed to update comment.');
    }
  }

    async function handleDelete(commentId: number) {
    try {
     await deleteComment(articleId, commentId);
      // Keep every comment except the one we deleted
    setComments(comments.filter((c) => c.commentId !== commentId));
    } catch {
      setError('Failed to delete comment.');
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
            {editingId === c.commentId ? (
              // Edit mode for this comment
              <form onSubmit={handleSave} className="comment-form">
                {editError && <p className="error">{editError}</p>}
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={3}
                />
                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Normal read view
              <>
                <p>{c.body}</p>
             <div className="form-actions">
                  <button onClick={() => startEdit(c)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(c.commentId)}>
                    Delete
                  </button>
                </div>
              </>
            )}
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