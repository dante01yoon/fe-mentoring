import type { BoardLabel } from '../../features/kanban/model/types';

export const LABELS: BoardLabel[] = [
  { id: 'lbl_frontend', name: 'Frontend', color: '#2563eb' },
  { id: 'lbl_api', name: 'API', color: '#059669' },
  { id: 'lbl_ux', name: 'UX', color: '#d97706' },
  { id: 'lbl_bug', name: 'Bug', color: '#dc2626' },
  { id: 'lbl_growth', name: 'Growth', color: '#7c3aed' },
];
