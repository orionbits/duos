// components/ExerciseBlock.tsx
'use client';

import { useState } from 'react';
import { ExerciseQuestion } from '@/types/textbook';
import { useProgressStore } from '@/store/progressStore';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface ExerciseBlockProps {
  textbookId: string;
  lessonId: string;
  blockId: string;
  instructions: string;
  questions: ExerciseQuestion[];
}

export function ExerciseBlock({ textbookId, lessonId, blockId, instructions, questions }: ExerciseBlockProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; showHint: boolean }>>({});
  const saveAttempt = useProgressStore((state) => state.saveExerciseAttempt);
  const existingAttempts = useProgressStore(
    (state) => state.progress.textbooks[textbookId]?.lessons[lessonId]?.blocks[blockId]?.exerciseAttempts
  );

  const checkAnswer = (question: ExerciseQuestion, userAnswer: string) => {
    let isCorrect = false;
    
    switch (question.type) {
      case 'fill-blank':
        isCorrect = userAnswer.toLowerCase().trim() === (question.correct_answer as string).toLowerCase().trim();
        break;
      case 'multiple-choice':
        isCorrect = userAnswer === question.correct_answer;
        break;
      case 'true-false':
        isCorrect = userAnswer === question.correct_answer;
        break;
      case 'matching':
        // Simplified - in production, handle more complex matching
        isCorrect = userAnswer === JSON.stringify(question.correct_answer);
        break;
    }
    
    const attempt = {
      questionId: question.id,
      answer: userAnswer,
      correct: isCorrect,
      attempts: (existingAttempts?.[question.id]?.attempts || 0) + 1,
      timestamp: Date.now(),
    };
    
    saveAttempt(textbookId, lessonId, blockId, question.id, attempt);
    
    setFeedback((prev) => ({
      ...prev,
      [question.id]: { correct: isCorrect, showHint: false },
    }));
    
    return isCorrect;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (question: ExerciseQuestion) => {
    const answer = answers[question.id];
    if (answer) {
      checkAnswer(question, answer);
    }
  };

  const getExistingFeedback = (questionId: string) => {
    const attempt = existingAttempts?.[questionId];
    if (attempt && !feedback[questionId]) {
      return { correct: attempt.correct, showHint: false };
    }
    return feedback[questionId];
  };

  const renderQuestion = (question: ExerciseQuestion) => {
    const fb = getExistingFeedback(question.id);
    const isCorrect = fb?.correct;
    const showHint = fb?.showHint;
    
    return (
      <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="font-medium text-gray-900 mb-3">{question.text}</p>
        
        {question.type === 'fill-blank' && (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your answer..."
            disabled={isCorrect}
          />
        )}
        
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={isCorrect}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {question.type === 'true-false' && (
          <div className="flex gap-4">
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={isCorrect}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {!isCorrect && answers[question.id] && (
          <div className="mt-3">
            <button
              onClick={() => setFeedback((prev) => ({ ...prev, [question.id]: { correct: false, showHint: true } }))}
              className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
            >
              <Lightbulb size={16} />
              Show hint
            </button>
          </div>
        )}
        
        {showHint && question.hint && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            💡 {question.hint}
          </div>
        )}
        
        {isCorrect && (
          <div className="mt-3 flex items-center gap-2 text-green-600">
            <CheckCircle size={18} />
            <span>Correct!</span>
            {question.explanation && (
              <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
            )}
          </div>
        )}
        
        {!isCorrect && answers[question.id] && !showHint && (
          <button
            onClick={() => handleSubmit(question)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Answer
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Exercise</h3>
        <p className="text-blue-800">{instructions}</p>
      </div>
      
      <div className="space-y-4">
        {questions.map(renderQuestion)}
      </div>
    </div>
  );
}