export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastActive: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'Basics' | 'FileSystem' | 'Permissions' | 'Networking' | 'Admin';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  content: LessonContent[];
}

export interface LessonContent {
  type: 'text' | 'code' | 'quiz';
  value: string | QuizData;
}

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TerminalLine {
  type: 'input' | 'output' | 'error';
  content: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}
