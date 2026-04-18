// app/lesson/[textbookId]/[lessonId]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTextbook } from '@/hooks/useTextbook';
import { useProgressStore } from '@/store/progressStore';
import { VocabularyBlock } from '@/components/VocabularyBlock';
import { ExerciseBlock } from '@/components/ExerciseBlock';
import { DialogueBlock } from '@/components/DialogueBlock';
import { GrammarBlock } from '@/components/GrammarBlock';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const textbookId = params.textbookId as string;
  const lessonId = params.lessonId as string;
  
  const { textbook, loading, getLesson } = useTextbook(textbookId);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const markBlockComplete = useProgressStore((state) => state.markBlockComplete);
  
  const lesson = getLesson(lessonId);
  const blocks = lesson?.blocks || [];
  const currentBlock = blocks[currentBlockIndex];
  
  const handleNext = () => {
    if (currentBlock) {
      markBlockComplete(textbookId, lessonId, currentBlock.id);
    }
    
    if (currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    } else {
      // Lesson complete - go back to lessons list
      router.push(`/textbook/${textbookId}`);
    }
  };
  
  const handlePrevious = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
          <button
            onClick={() => router.push(`/textbook/${textbookId}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Textbook
          </button>
        </div>
      </div>
    );
  }
  
  const progress = (currentBlockIndex / blocks.length) * 100;
  
  const renderBlock = () => {
    if (!currentBlock) return null;
    
    switch (currentBlock.type) {
      case 'vocabulary':
        return currentBlock.content.vocabulary ? (
          <VocabularyBlock
            textbookId={textbookId}
            lessonId={lessonId}
            blockId={currentBlock.id}
            vocabulary={currentBlock.content.vocabulary}
          />
        ) : null;
        
      case 'exercise':
        return currentBlock.content.exercise ? (
          <ExerciseBlock
            textbookId={textbookId}
            lessonId={lessonId}
            blockId={currentBlock.id}
            instructions={currentBlock.content.exercise.instructions}
            questions={currentBlock.content.exercise.questions}
          />
        ) : null;
        
      case 'dialogue':
        return currentBlock.content.dialogue ? (
          <DialogueBlock
            context={currentBlock.content.dialogue.context}
            lines={currentBlock.content.dialogue.lines}
          />
        ) : null;
        
      case 'grammar':
        return currentBlock.content.grammar ? (
          <GrammarBlock grammar={currentBlock.content.grammar} />
        ) : null;
        
      case 'lesson':
        return (
          <div className="space-y-4">
            {currentBlock.content.title && (
              <h2 className="text-3xl font-bold text-gray-900">{currentBlock.content.title}</h2>
            )}
            {currentBlock.content.text && (
              <p className="text-gray-700 leading-relaxed">{currentBlock.content.text}</p>
            )}
            {currentBlock.content.objectives && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-blue-900 mb-2">🎯 Learning Objectives</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  {currentBlock.content.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Content type "{currentBlock.type}" not yet implemented</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-10">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/textbook/${textbookId}`)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to {textbook?.metadata.name}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Block {currentBlockIndex + 1} of {blocks.length}
          </p>
        </div>
        
        {/* Block Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {renderBlock()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentBlockIndex === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentBlockIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            {currentBlockIndex === blocks.length - 1 ? 'Finish Lesson' : 'Next'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}