import React from 'react';
import { CheckCircle, XCircle, RotateCcw, Download } from 'lucide-react';
import { Question, UserProgress } from '../types';
import { Achievements } from './Achievements';
import { Leaderboard } from './Leaderboard';

interface ResultsProps {
  questions: Question[];
  progress: UserProgress;
  onRetake: () => void;
}

export function Results({ questions, progress, onRetake }: ResultsProps) {
  const correctAnswers = questions.filter(
    (q) => progress.answers[q.id] === q.correctAnswer
  ).length;

  const percentage = Math.round((correctAnswers / questions.length) * 100);

  // Ensure stats and achievements are properly initialized
  const stats = progress.stats || {
    totalTests: 0,
    averageScore: 0,
    streak: 0,
    lastTestDate: 0,
    achievements: [],
    totalTimeTaken: 0,
    testsThisWeek: 0,
  };

  const downloadResults = () => {
    const results = {
      name: progress.name,
      email: progress.email,
      score: `${correctAnswers}/${questions.length} (${percentage}%)`,
      timeSpent: Object.values(progress.timeSpent).reduce((a, b) => a + b, 0),
      answers: questions.map((q) => ({
        question: q.text,
        selectedAnswer: q.options[progress.answers[q.id]],
        correctAnswer: q.options[q.correctAnswer],
        isCorrect: progress.answers[q.id] === q.correctAnswer,
      })),
      stats,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Test Results
            </h1>

            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {percentage}%
              </div>
              <p className="text-xl text-gray-600">
                You got {correctAnswers} out of {questions.length} questions correct
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {progress.answers[question.id] === question.correctAnswer ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-2">
                        {index + 1}. {question.text}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer:{' '}
                        {question.options[progress.answers[question.id]]}
                      </p>
                      {progress.answers[question.id] !== question.correctAnswer && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onRetake}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Test</span>
              </button>
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Download Results</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Achievements stats={stats} />
          <Leaderboard
            entries={[
              {
                name: progress.name,
                score: percentage,
                badges: stats.achievements.map(a => a.badgeId),
                streak: stats.streak,
                rank: 1
              }
            ]}
            currentUserRank={1}
          />
        </div>
      </div>
    </div>
  );
}