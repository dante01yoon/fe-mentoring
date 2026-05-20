import { Navigate, Route, Routes } from 'react-router-dom';
import { BoardLayout } from './layouts/BoardLayout';
import BoardPage from '../pages/BoardPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<BoardLayout />}>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/" element={<Navigate replace to="/board" />} />
      </Route>
    </Routes>
  );
}
