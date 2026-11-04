const BASE = '/api';

export type Article = {
  articleId: number;
  title: string;
  contents: string;
};

export type Comment = {
  commentId: number;
  articleId: number;
  body: string;
};

// ── Articles ─────────────────────────────────────────────────────────────────

export async function getArticles(titleContains?: string): Promise<Article[]> {
  const params = titleContains
    ? `?title_contains=${encodeURIComponent(titleContains)}`
    : '';
  const res = await fetch(`${BASE}/articles${params}`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function getArticle(id: number): Promise<Article> {
  const res = await fetch(`${BASE}/articles/${id}`);
  if (!res.ok) throw new Error('Article not found');
  return res.json();
}

export async function createArticle(data: {
  title: string;
  contents: string;
}): Promise<Article> {
  const res = await fetch(`${BASE}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}

export async function updateArticle(
  id: number,
  data: { title: string; contents: string },
): Promise<Article> {
  const res = await fetch(`${BASE}/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update article');
  return res.json();
}

export async function deleteArticle(id: number): Promise<void> {
  const res = await fetch(`${BASE}/articles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete article');
}

// ── Comments ─────────────────────────────────────────────────────────────────

export async function getComments(articleId: number): Promise<Comment[]> {
  const res = await fetch(`${BASE}/articles/${articleId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function createComment(articleId: number, body: string): Promise<Comment> {
  const res = await fetch(`${BASE}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  return res.json();
}

export async function updateComment(
  articleId: number,
  commentId: number,
  body: string,
): Promise<Comment> {
  const res = await fetch(`${BASE}/articles/${articleId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}

export async function deleteComment(articleId: number, commentId: number): Promise<void> {
  const res = await fetch(`${BASE}/articles/${articleId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete comment');
}