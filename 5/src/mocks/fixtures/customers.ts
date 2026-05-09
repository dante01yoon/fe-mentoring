import type { Customer } from '../../features/inbox/model/types';

const NAMES = [
  '김민준',
  '이서연',
  '박지호',
  '정유나',
  '최도윤',
  '강하린',
  '윤시우',
  '장수아',
  '한도현',
  '서지안',
  '문하은',
  '오시현',
  '신예린',
  '백지후',
  '조유준',
  '권수민',
  '황태오',
  '안도아',
  '홍지민',
  '유시안',
];

const TAG_POOL = ['vip', 'refund', 'urgent', 'payment', 'delivery', 'newbie'];

export const CUSTOMERS: Customer[] = Array.from({ length: 30 }, (_, idx) => {
  const id = `c_${String(idx + 1).padStart(3, '0')}`;
  const name = NAMES[idx % NAMES.length];
  const tags = idx % 3 === 0 ? [TAG_POOL[idx % TAG_POOL.length]] : [];
  return {
    id,
    name,
    email: `${id}@example.com`,
    phone: idx % 4 === 0 ? `010-1234-${String(1000 + idx).padStart(4, '0')}` : undefined,
    tags,
    memo:
      idx % 5 === 0
        ? '재방문 고객. 응대 톤은 정중하게 유지해주세요.'
        : undefined,
    createdAt: new Date(Date.UTC(2025, 0, 1 + idx, 9, 0, 0)).toISOString(),
  };
});

export function findCustomer(customerId: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === customerId);
}
