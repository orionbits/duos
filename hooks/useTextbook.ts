// hooks/useTextbook.ts
import { useState, useEffect } from 'react';
import { Textbook, Lesson, ContentBlock } from '@/types/textbook';

export function useTextbook(textbookId: string) {
  const [textbook, setTextbook] = useState<Textbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTextbook() {
      try {
        setLoading(true);
        // In production, this would load from /public/textbooks/
        const response = await fetch(`/textbooks/${textbookId}.json`);
        if (!response.ok) throw new Error('Failed to load textbook');
        const data = await response.json();
        setTextbook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (textbookId) {
      loadTextbook();
    }
  }, [textbookId]);

  const getLesson = (lessonId: string): Lesson | undefined => {
    return textbook?.lessons.find((l) => l.id === lessonId);
  };

  const getBlock = (lessonId: string, blockId: string): ContentBlock | undefined => {
    const lesson = getLesson(lessonId);
    return lesson?.blocks.find((b) => b.id === blockId);
  };

  return { textbook, loading, error, getLesson, getBlock };
}