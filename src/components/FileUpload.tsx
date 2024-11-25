import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onQuestionsLoaded: (questions: string) => void;
}

export function FileUpload({ onQuestionsLoaded }: FileUploadProps) {
  const [error, setError] = useState<string>('');

  const validateAikenFormat = (content: string): boolean => {
    const lines = content.trim().split('\n');
    let hasQuestion = false;
    let optionCount = 0;
    let hasAnswer = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '') continue;

      if (trimmedLine.match(/^[A-Z]\./) && hasQuestion) {
        optionCount++;
      } else if (trimmedLine.startsWith('ANSWER:') && optionCount > 1) {
        hasAnswer = true;
        hasQuestion = false;
        optionCount = 0;
      } else if (!trimmedLine.match(/^[A-Z]\./) && !trimmedLine.startsWith('ANSWER:')) {
        if (hasAnswer) {
          hasQuestion = true;
          optionCount = 0;
          hasAnswer = false;
        } else if (!hasQuestion) {
          hasQuestion = true;
        }
      }
    }

    return hasAnswer;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (validateAikenFormat(content)) {
        setError('');
        onQuestionsLoaded(content);
      } else {
        setError('Invalid Aiken format. Please check your file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mt-4 flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-indigo-50 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-indigo-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">TXT file in Aiken format</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".txt"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}