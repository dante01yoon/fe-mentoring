import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
