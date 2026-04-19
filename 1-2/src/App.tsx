import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CartPage from './pages/CartPage';
import BuyerPage from './pages/BuyerPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import AgreementPage from './pages/AgreementPage';
import ConfirmPage from './pages/ConfirmPage';
import CompletePage from './pages/CompletePage';
import PaymentHostedPage from './pages/PaymentHostedPage';
import PaymentResultPage from './pages/PaymentResultPage';

export default function App() {
  return (
    <BrowserRouter>
      {/*
       * TODO: 멘티가 구현할 것
       * - Step Guard 래퍼 (진입 조건 미충족 시 리다이렉트)
       * - 각 Route를 Guard로 감싸기
       *
       * 2회차 추가 route:
       * - /payment-hosted : mock 외부 결제창 (Layout 없이 단독)
       * - /payment-result : hosted redirect 결과 복원 페이지 (Layout 없이 단독)
       */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/buyer" element={<BuyerPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/agreement" element={<AgreementPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/complete" element={<CompletePage />} />
        </Route>

        {/* hosted flow — Layout 없음 */}
        <Route path="/payment-hosted" element={<PaymentHostedPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />

        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
