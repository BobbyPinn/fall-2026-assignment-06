import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NewArticlePage from './pages/NewArticlePage';
import EditArticlePage from './pages/EditArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArticleListPage />} />
        <Route path="/articles/new" element={<NewArticlePage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/articles/:id/edit" element={<EditArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}