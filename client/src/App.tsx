import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NewArticlePage from './pages/NewArticlePage';
import EditArticlePage from './pages/EditArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <Link to="/">
          <span>diy</span> <span>single page</span> <span>article</span>
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/new" element={<NewArticlePage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/articles/:id/edit" element={<EditArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer>
        Inspired by{' '}
        <a
          href="https://www.diymobileaudio.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          diymobileaudio.com
        </a>
      </footer>
    </BrowserRouter>
  );
}