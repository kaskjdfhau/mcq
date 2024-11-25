export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'score' | 'streak' | 'completion' | 'speed';
    value: number;
  };
}

export interface Achievement {
  badgeId: string;
  earnedAt: number;
  progress: number;
}

export interface UserStats {
  totalTests: number;
  averageScore: number;
  streak: number;
  lastTestDate: number;
  achievements: Achievement[];
  totalTimeTaken: number;
  testsThisWeek: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  topic: string;
  hasLatex?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
}

export interface UserProgress {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeSpent: Record<string, number>;
  startTime: number;
  email: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  stats: UserStats;
}

export interface TestState {
  isStarted: boolean;
  isFinished: boolean;
  currentQuestion: number;
  timeRemaining: number;
}

export interface QuestionPool {
  easy: Question[];
  medium: Question[];
  hard: Question[];
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  badges: string[];
  streak: number;
  rank: number;
}