import type { BootstrapResponse } from './types';

export const bootstrapData: BootstrapResponse = {
  cart: {
    items: [
      {
        id: 'item_1',
        name: '프리미엄 헤드셋',
        quantity: 1,
        unitPrice: 129_000,
      },
      {
        id: 'item_2',
        name: 'USB-C 케이블',
        quantity: 2,
        unitPrice: 12_000,
      },
    ],
    subtotal: 153_000,
    shippingFee: 3_000,
    currency: 'KRW',
  },
  paymentMethods: [
    { id: 'card', label: '카드', enabled: true },
    { id: 'virtual-account', label: '가상계좌', enabled: true },
    { id: 'easy-pay', label: '간편결제', enabled: true },
  ],
  agreements: [
    {
      id: 'terms-of-purchase',
      title: '주문 내용 확인 및 결제 동의',
      required: true,
    },
    {
      id: 'privacy-collection',
      title: '개인정보 수집 및 이용 동의',
      required: true,
    },
    {
      id: 'marketing',
      title: '마케팅 정보 수신 동의',
      required: false,
    },
  ],
};
