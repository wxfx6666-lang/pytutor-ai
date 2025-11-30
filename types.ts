
export type LessonCategory = 'concept' | 'project';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LessonTopic {
  id: string;
  title: string;
  description: string;
  promptTopic: string;
  category: LessonCategory;
  difficulty?: Difficulty;
}

export interface Chapter {
  id: string;
  title: string;
  topics: LessonTopic[];
}

export interface Module {
  id: string;
  title: string;
  icon: React.ReactNode;
  topics?: LessonTopic[];    // For flat lists (e.g., Projects)
  chapters?: Chapter[];      // For nested lists (e.g., Basics)
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum TabView {
  LESSON = 'LESSON',
  CODE = 'CODE',
}

export interface CodeFeedback {
  correct: boolean;
  output: string;
  suggestion: string;
}

// Persistence Types
export interface TopicProgress {
  topicId: string;
  code: string;
  chatHistory: ChatMessage[];
  lastModified: number;
}

export interface UserData {
  username: string;
  lastActiveModuleId: string;
  lastActiveTopicId: string;
  progress: Record<string, TopicProgress>; // Map topicId to progress
}
