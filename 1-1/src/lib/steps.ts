export const STEPS = [
  { path: '/cart', label: '장바구니', index: 0 },
  { path: '/buyer', label: '구매자 정보', index: 1 },
  { path: '/shipping', label: '배송 정보', index: 2 },
  { path: '/payment', label: '결제 수단', index: 3 },
  { path: '/agreement', label: '약관 동의', index: 4 },
  { path: '/confirm', label: '주문 확인', index: 5 },
  { path: '/complete', label: '주문 완료', index: 6 },
] as const;

export type StepPath = (typeof STEPS)[number]['path'];

export function getStepByPath(path: string) {
  return STEPS.find((s) => s.path === path);
}

export function getStepByIndex(index: number) {
  return STEPS[index];
}
