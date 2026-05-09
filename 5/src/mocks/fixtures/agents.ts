import type { Agent } from '../../features/inbox/model/types';

export const ME: Agent = {
  id: 'agent_001',
  name: 'Mentor Agent',
  role: 'operator',
};

export const AGENTS: Agent[] = [
  ME,
  { id: 'agent_002', name: 'Soyeon Kim', role: 'operator' },
  { id: 'agent_003', name: 'Jihoon Park', role: 'admin' },
  { id: 'agent_004', name: 'Mira Lee', role: 'viewer' },
];
