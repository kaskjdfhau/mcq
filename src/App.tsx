import React, { useState, useEffect } from 'react';
import { Registration } from './components/Registration';
import { Question } from './components/Question';
import { Results } from './components/Results';
import { Instructions } from './components/Instructions';
import { ThemeSelector } from './components/ThemeSelector';
import { useTabFocus } from './hooks/useTabFocus';
import { useTheme } from './hooks/useTheme';
import { Question as QuestionType, UserProgress, UserStats } from './types';
import { parseAikenFormat, shuffleArray } from './utils/questionParser';

const sampleQuestions = `What is the value of $\\pi$ (rounded to 2 decimal places)?
A. 3.14
B. 3.12
C. 3.16
D. 3.18
ANSWER: A
DIFFICULTY: medium
TIME: 60
TOPIC: Mathematics

Calculate the derivative of $f(x) = x^2 + 2x + 1$
A. $f'(x) = 2x + 1$
B. $f'(x) = x^2 + 2$
C. $f'(x) = 2x + 2$
D. $f'(x) = 2x^2 + 2$
ANSWER: C
DIFFICULTY: hard
TIME: 90
TOPIC: Calculus

![Diagram of a cell](https://images.unsplash.com/photo-1594904351111-a072f80b1a71)
Which part of the cell is responsible for protein synthesis?
A. Nucleus
B. Mitochondria
C. Ribosome
D. Golgi Apparatus
ANSWER: C
DIFFICULTY: medium
TIME: 45
TOPIC: Biology`;

const initialStats: UserStats = {
  totalTests: 0,
  averageScore: 0,
  streak: 0,
  lastTestDate: 0,
  achievements: [],
  totalTimeTaken: 0,
  testsThisWeek: 0,
};

function App() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [warnings, setWarnings] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const { theme, setTheme, customTheme, setCustomTheme } = useTheme();
  const maxWarnings = 3;

  // Prevent right-click context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextMenu', handleContextMenu);
    return () => document.removeEventListener('contextMenu', handleContextMenu);
  }, []);

  // Prevent copy/paste
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handleCopy);
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handleCopy);
    };
  }, []);

  useEffect(() => {
    const parsedQuestions = parseAikenFormat(sampleQuestions);
    setQuestions(shuffleArray(parsedQuestions));
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem('testProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    if (progress) {
      localStorage.setItem('testProgress', JSON.stringify(progress));
    }
  }, [progress]);

  const handleStart = (name: string, email: string) => {
    const savedStats = localStorage.getItem('userStats');
    const stats: UserStats = savedStats ? JSON.parse(savedStats) : initialStats;

    // Update streak
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (now - stats.lastTestDate <= oneDayMs) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastTestDate = now;

    setProgress({
      currentQuestionIndex: 0,
      answers: {},
      timeSpent: {},
      startTime: now,
      name,
      email,
      difficulty: 'medium',
      score: 0,
      stats,
    });
    setShowInstructions(false);
  };

  const handleQuestionsLoaded = (questionsText: string) => {
    const parsedQuestions = parseAikenFormat(questionsText);
    setQuestions(shuffleArray(parsedQuestions));
  };

  const handleAnswer = (answer: number) => {
    if (!progress) return;

    const currentQuestion = questions[progress.currentQuestionIndex];
    setProgress((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: { ...prev.answers, [currentQuestion.id]: answer },
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeSpent: {
          ...prev.timeSpent,
          [currentQuestion.id]: Date.now() - prev.startTime,
        },
      };
    });
  };

  const handleTimeout = () => {
    if (!progress) return;
    handleAnswer(-1);
  };

  const handleTabChange = (hidden: boolean) => {
    if (hidden && progress && !isTestComplete()) {
      setWarnings((prev) => {
        const newWarnings = prev + 1;
        if (newWarnings >= maxWarnings) {
          handleTestComplete();
        }
        return newWarnings;
      });
    }
  };

  useTabFocus(handleTabChange);

  const isTestComplete = () => {
    return progress && progress.currentQuestionIndex >= questions.length;
  };

  const handleTestComplete = () => {
    if (!progress) return;

    // Calculate final score and update stats
    const correctAnswers = questions.filter(
      (q) => progress.answers[q.id] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const totalTime = Object.values(progress.timeSpent).reduce((a, b) => a + b, 0);

    const updatedStats: UserStats = {
      ...progress.stats,
      totalTests: progress.stats.totalTests + 1,
      averageScore: Math.round(
        (progress.stats.averageScore * progress.stats.totalTests + score) /
          (progress.stats.totalTests + 1)
      ),
      totalTimeTaken: progress.stats.totalTimeTaken + totalTime,
      testsThisWeek: progress.stats.testsThisWeek + 1,
    };

    setProgress((prev) => prev ? { ...prev, score, stats: updatedStats } : null);
    localStorage.setItem('userStats', JSON.stringify(updatedStats));
  };

  const handleRetake = () => {
    setProgress(null);
    setWarnings(0);
    setQuestions(shuffleArray(questions));
    setShowInstructions(true);
  };

  if (showInstructions) {
    return (
      <>
        <ThemeSelector
          theme={theme}
          onThemeChange={setTheme}
          onCustomThemeChange={setCustomTheme}
        />
        <Instructions
          onStart={() => setShowInstructions(false)}
          onPractice={() => {
            setQuestions(shuffleArray(questions.slice(0, 3)));
            setShowInstructions(false);
          }}
        />
      </>
    );
  }

  if (!progress) {
    return (
      <>
        <ThemeSelector
          theme={theme}
          onThemeChange={setTheme}
          onCustomThemeChange={setCustomTheme}
        />
        <Registration
          onStart={handleStart}
          onQuestionsLoaded={handleQuestionsLoaded}
        />
      </>
    );
  }

  if (isTestComplete()) {
    return (
      <>
        <ThemeSelector
          theme={theme}
          onThemeChange={setTheme}
          onCustomThemeChange={setCustomTheme}
        />
        <Results
          questions={questions}
          progress={progress}
          onRetake={handleRetake}
        />
      </>
    );
  }

  const currentQuestion = questions[progress.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      {warnings > 0 && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Warning: Tab switching detected ({warnings}/{maxWarnings})
        </div>
      )}
      <ThemeSelector
        theme={theme}
        onThemeChange={setTheme}
        onCustomThemeChange={setCustomTheme}
      />
      <Question
        question={currentQuestion}
        onAnswer={handleAnswer}
        onTimeout={handleTimeout}
        questionNumber={progress.currentQuestionIndex + 1}
        totalQuestions={questions.length}
        showInstantFeedback={true}
      />
    </div>
  );
}

export default App;