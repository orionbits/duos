// app/textbook/[textbookId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTextbook } from '@/hooks/useTextbook';
import { useProgressStore } from '@/store/progressStore';
import { CheckCircle, BookOpen, ArrowLeft } from 'lucide-react';

export default function TextbookPage() {
  const params = useParams();
  const router = useRouter();
  const textbookId = params.textbookId as string;
  
  const { textbook, loading } = useTextbook(textbookId);
  const getLessonProgress = useProgressStore((state) => state.getLessonProgress);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!textbook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Textbook not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Textbooks
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{textbook.metadata.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
              {textbook.metadata.cefr_level}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              {textbook.metadata.publisher}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
              {textbook.metadata.edition}
            </span>
          </div>
          <p className="text-gray-600">{textbook.metadata.main_topic}</p>
        </div>
        
        {/* Lessons List */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons</h2>
        <div className="space-y-3">
          {textbook.lessons.map((lesson) => {
            const progress = getLessonProgress(textbookId, lesson.id);
            
            return (
              <button
                key={lesson.id}
                onClick={() => router.push(`/lesson/${textbookId}/${lesson.id}`)}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-600" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">
                        {lesson.blocks.length} blocks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {progress === 100 && (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 rounded-full h-2 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 min-w-[45px]">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}