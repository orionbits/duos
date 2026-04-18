// store/progressStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProgress, ExerciseAttempt, VocabularyProgress } from '@/types/progress';

const CURRENT_VERSION = 2;

interface ProgressStore {
  progress: UserProgress;
  markBlockComplete: (textbookId: string, lessonId: string, blockId: string) => void;
  saveExerciseAttempt: (
    textbookId: string,
    lessonId: string,
    blockId: string,
    questionId: string,
    attempt: ExerciseAttempt
  ) => void;
  markVocabularyKnown: (textbookId: string, wordId: string, known: boolean) => void;
  getLessonProgress: (textbookId: string, lessonId: string) => number;
  getVocabularyStats: (textbookId: string) => { known: number; total: number };
  exportProgress: () => string;
  importProgress: (data: string) => void;
  clearProgress: (textbookId?: string) => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {
        version: CURRENT_VERSION,
        lastUpdated: Date.now(),
        textbooks: {},
      },

      markBlockComplete: (textbookId, lessonId, blockId) => {
        set((state) => {
          const newProgress = { ...state.progress };
          
          if (!newProgress.textbooks[textbookId]) {
            newProgress.textbooks[textbookId] = { lessons: {}, vocabulary: {} };
          }
          
          if (!newProgress.textbooks[textbookId].lessons[lessonId]) {
            newProgress.textbooks[textbookId].lessons[lessonId] = {
              blocks: {},
              completed: false,
              lastAccessed: Date.now(),
            };
          }
          
          newProgress.textbooks[textbookId].lessons[lessonId].blocks[blockId] = {
            completed: true,
            lastViewed: Date.now(),
          };
          
          // Check if all blocks in lesson are complete
          // This would need access to the textbook data - we'll handle this in a helper
          
          newProgress.lastUpdated = Date.now();
          return { progress: newProgress };
        });
      },

      saveExerciseAttempt: (textbookId, lessonId, blockId, questionId, attempt) => {
        set((state) => {
          const newProgress = { ...state.progress };
          
          if (!newProgress.textbooks[textbookId]?.lessons[lessonId]?.blocks[blockId]) {
            // Initialize the block if it doesn't exist
            const blockProgress = {
              completed: attempt.correct,
              lastViewed: Date.now(),
              exerciseAttempts: {},
            };
            
            if (!newProgress.textbooks[textbookId]) {
              newProgress.textbooks[textbookId] = { lessons: {}, vocabulary: {} };
            }
            if (!newProgress.textbooks[textbookId].lessons[lessonId]) {
              newProgress.textbooks[textbookId].lessons[lessonId] = {
                blocks: {},
                completed: false,
                lastAccessed: Date.now(),
              };
            }
            
            newProgress.textbooks[textbookId].lessons[lessonId].blocks[blockId] = blockProgress;
          }
          
          const block = newProgress.textbooks[textbookId].lessons[lessonId].blocks[blockId];
          if (!block.exerciseAttempts) {
            block.exerciseAttempts = {};
          }
          
          block.exerciseAttempts[questionId] = attempt;
          
          // Auto-mark block complete if all questions correct
          // This would need to know total questions - handled by component
          
          newProgress.lastUpdated = Date.now();
          return { progress: newProgress };
        });
      },

      markVocabularyKnown: (textbookId, wordId, known) => {
        set((state) => {
          const newProgress = { ...state.progress };
          
          if (!newProgress.textbooks[textbookId]) {
            newProgress.textbooks[textbookId] = { lessons: {}, vocabulary: {} };
          }
          
          const existing = newProgress.textbooks[textbookId].vocabulary[wordId];
          newProgress.textbooks[textbookId].vocabulary[wordId] = {
            known,
            reviewedAt: Date.now(),
            timesReviewed: (existing?.timesReviewed || 0) + 1,
          };
          
          newProgress.lastUpdated = Date.now();
          return { progress: newProgress };
        });
      },

      getLessonProgress: (textbookId, lessonId) => {
        const state = get();
        const lesson = state.progress.textbooks[textbookId]?.lessons[lessonId];
        if (!lesson) return 0;
        
        const blocks = Object.values(lesson.blocks);
        if (blocks.length === 0) return 0;
        
        const completed = blocks.filter((b) => b.completed).length;
        return (completed / blocks.length) * 100;
      },

      getVocabularyStats: (textbookId) => {
        const state = get();
        const vocab = state.progress.textbooks[textbookId]?.vocabulary || {};
        const known = Object.values(vocab).filter((v) => v.known).length;
        return { known, total: Object.keys(vocab).length };
      },

      exportProgress: () => {
        return JSON.stringify(get().progress, null, 2);
      },

      importProgress: (data) => {
        try {
          const imported = JSON.parse(data);
          if (imported.version === CURRENT_VERSION || imported.version === 1) {
            set({ progress: imported });
          } else {
            console.error('Incompatible version');
          }
        } catch (e) {
          console.error('Failed to import progress', e);
        }
      },

      clearProgress: (textbookId) => {
        if (textbookId) {
          set((state) => {
            const newProgress = { ...state.progress };
            delete newProgress.textbooks[textbookId];
            newProgress.lastUpdated = Date.now();
            return { progress: newProgress };
          });
        } else {
          set({
            progress: {
              version: CURRENT_VERSION,
              lastUpdated: Date.now(),
              textbooks: {},
            },
          });
        }
      },
    }),
    {
      name: 'german-workbook-progress',
      version: CURRENT_VERSION,
    }
  )
);