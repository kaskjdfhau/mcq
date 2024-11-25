import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Question as QuestionType } from '../types';
import { useTimer } from '../hooks/useTimer';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: number) => void;
  onTimeout: () => void;
  questionNumber: number;
  totalQuestions: number;
  showInstantFeedback?: boolean;
}

export function Question({
  question,
  onAnswer,
  onTimeout,
  questionNumber,
  totalQuestions,
  showInstantFeedback = false,
}: QuestionProps) {
  const { timeRemaining, formatTime } = useTimer(question.timeLimit, onTimeout);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    if (showInstantFeedback) {
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        onAnswer(index);
      }, 2000);
    } else {
      onAnswer(index);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 select-none">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className={`text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span className="text-lg font-semibold text-indigo-600">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="mb-8 question-content">
          {question.hasImage && question.imageUrl && (
            <div className="mb-4">
              <img
                src={question.imageUrl}
                alt="Question"
                className="max-w-full h-auto rounded-lg pointer-events-none"
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />
            </div>
          )}
          
          <div className="text-xl font-semibold text-gray-800 mb-6">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {question.text}
            </ReactMarkdown>
          </div>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border transition duration-200 ${
                  showFeedback
                    ? index === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : index === selectedAnswer
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                    : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className="font-medium text-gray-700"
                  >
                    {option}
                  </ReactMarkdown>
                  {showFeedback && (
                    <div className="flex-shrink-0 ml-4">
                      {index === question.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : index === selectedAnswer ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          Topic: {question.topic}
        </div>

        {showFeedback && selectedAnswer !== null && (
          <div className={`mt-4 p-4 rounded-lg ${
            selectedAnswer === question.correctAnswer
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex items-center">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              <span>
                {selectedAnswer === question.correctAnswer
                  ? 'Correct! Well done!'
                  : `Incorrect. The correct answer was: ${question.options[question.correctAnswer]}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}