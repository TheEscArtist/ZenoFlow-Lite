export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  subTasks: SubTask[];
  isExpanded?: boolean; // For showing subtasks
}

export enum FilterType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export type VoiceActionType = 'ADD' | 'TOGGLE' | 'DELETE' | 'NONE';

export interface VoiceCommandResult {
  action: VoiceActionType;
  text?: string; // For ADD
  targetId?: string; // For TOGGLE/DELETE
  feedback: string; // Message to show user
}