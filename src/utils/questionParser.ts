import { Question, QuestionPool } from '../types';

export function parseAikenFormat(text: string): Question[] {
  const lines = text.trim().split('\n');
  const questions: Question[] = [];
  let currentQuestion: Partial<Question> = {};
  let options: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    if (line.startsWith('ANSWER:')) {
      const answer = line.replace('ANSWER:', '').trim();
      currentQuestion.correctAnswer = options.findIndex(
        opt => opt.startsWith(answer + '.')
      );
      
      // Default values for new fields
      currentQuestion.difficulty = 'medium';
      currentQuestion.timeLimit = 60;
      currentQuestion.topic = 'general';
      currentQuestion.hasLatex = currentQuestion.text?.includes('$') || currentQuestion.text?.includes('\\(');
      currentQuestion.hasImage = currentQuestion.text?.includes('![');
      
      if (currentQuestion.text && options.length > 0) {
        // Extract image URL if present
        const imageMatch = currentQuestion.text.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
          currentQuestion.imageUrl = imageMatch[1];
          currentQuestion.text = currentQuestion.text.replace(/!\[.*?\]\((.*?)\)/, '').trim();
        }

        questions.push({
          id: crypto.randomUUID(),
          text: currentQuestion.text,
          options,
          correctAnswer: currentQuestion.correctAnswer!,
          difficulty: currentQuestion.difficulty,
          timeLimit: currentQuestion.timeLimit,
          topic: currentQuestion.topic,
          hasLatex: currentQuestion.hasLatex,
          hasImage: currentQuestion.hasImage,
          imageUrl: currentQuestion.imageUrl,
        });
      }
      currentQuestion = {};
      options = [];
    } else if (line.startsWith('DIFFICULTY:')) {
      currentQuestion.difficulty = line.replace('DIFFICULTY:', '').trim().toLowerCase() as 'easy' | 'medium' | 'hard';
    } else if (line.startsWith('TIME:')) {
      currentQuestion.timeLimit = parseInt(line.replace('TIME:', '').trim(), 10);
    } else if (line.startsWith('TOPIC:')) {
      currentQuestion.topic = line.replace('TOPIC:', '').trim();
    } else if (line.match(/^[A-Z]\./)) {
      options.push(line);
    } else {
      currentQuestion.text = line;
    }
  }

  return questions;
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createQuestionPool(questions: Question[]): QuestionPool {
  return questions.reduce(
    (pool, question) => {
      pool[question.difficulty].push(question);
      return pool;
    },
    { easy: [], medium: [], hard: [] } as QuestionPool
  );
}

export function getAdaptiveQuestions(
  pool: QuestionPool,
  currentDifficulty: 'easy' | 'medium' | 'hard',
  score: number,
  count: number
): Question[] {
  let nextDifficulty = currentDifficulty;

  // Adjust difficulty based on score
  if (score >= 0.8) {
    nextDifficulty = currentDifficulty === 'easy' ? 'medium' : 'hard';
  } else if (score <= 0.4) {
    nextDifficulty = currentDifficulty === 'hard' ? 'medium' : 'easy';
  }

  const questions = [...pool[nextDifficulty]];
  return shuffleArray(questions).slice(0, count);
}