import type { Member } from '../../features/kanban/model/types';

export const ME: Member = {
  id: 'mem_001',
  name: 'Dante Yoon',
  role: 'frontend',
};

export const MEMBERS: Member[] = [
  ME,
  { id: 'mem_002', name: 'Mina Park', role: 'pm' },
  { id: 'mem_003', name: 'Jisoo Han', role: 'designer' },
  { id: 'mem_004', name: 'Ethan Kim', role: 'backend' },
  { id: 'mem_005', name: 'Noah Lee', role: 'qa' },
];
