import React from 'react';
import { BookOpen, Shield, Clock, AlertTriangle } from 'lucide-react';

interface InstructionsProps {
  onStart: () => void;
  onPractice: () => void;
}

export function Instructions({ onStart, onPractice }: InstructionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-12 h-12 text-indigo-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Test Instructions
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-indigo-600" />
              Test Rules
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Each question has a specific time limit</li>
              <li>You cannot return to previous questions</li>
              <li>Switching tabs or windows is not allowed</li>
              <li>Copying question content is disabled</li>
              <li>Your progress is automatically saved</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-indigo-600" />
              Time Management
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Each question has its own timer</li>
              <li>Questions automatically submit when time runs out</li>
              <li>Total test duration depends on question count</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-indigo-600" />
              Important Notes
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Ensure stable internet connection</li>
              <li>Use a modern web browser</li>
              <li>Close unnecessary applications</li>
              <li>Find a quiet environment</li>
            </ul>
          </section>

          <div className="flex justify-center space-x-4 pt-6">
            <button
              onClick={onPractice}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Try Practice Test
            </button>
            <button
              onClick={onStart}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}