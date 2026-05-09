import { Navigate, Route, Routes } from 'react-router-dom';
import { ConsoleLayout } from './layouts/ConsoleLayout';
import InboxPage from '../pages/InboxPage';
import SettingsPage from '../pages/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<ConsoleLayout />}>
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/inbox" replace />} />
    </Routes>
  );
}
