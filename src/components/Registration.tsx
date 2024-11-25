import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface RegistrationProps {
  onStart: (name: string, email: string) => void;
  onQuestionsLoaded: (questions: string) => void;
}

export function Registration({ onStart, onQuestionsLoaded }: RegistrationProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    onStart(name, email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome to the MCQ Test
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Upload Custom Questions
            </h2>
            <FileUpload onQuestionsLoaded={onQuestionsLoaded} />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Start Test
          </button>
        </form>
      </div>
    </div>
  );
}