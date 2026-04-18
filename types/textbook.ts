// types/textbook.ts
export interface TextbookMetadata {
  id: string;
  name: string;
  cefr_level: 'A1' | 'A2' | 'B1' | 'B2';
  publisher: string;
  edition: string;
  main_topic: string;
  language: 'German' | 'English' | 'mixed';
  cover_image?: string;
}

export interface MediaAttachment {
  type: 'audio' | 'image';
  url: string;
  caption?: string;
}

export interface AIAnnotations {
  difficulty?: number;
  keywords?: string[];
  prerequisites?: string[];
}

export interface VocabularyItem {
  id: string;
  german: string;
  meaning: string;
  gender?: 'der' | 'die' | 'das';
  plural?: string;
  part_of_speech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'other';
  example?: string;
  example_translation?: string;
  notes?: string;
}

export interface GrammarRule {
  concept: string;
  pattern: string;
  explanation: string;
  examples: Array<{
    german: string;
    english: string;
  }>;
  exceptions?: string;
  summary?: string;
}

export interface DialogueLine {
  speaker: string;
  german: string;
  translation: string;
}

export interface ExerciseQuestion {
  id: string;
  text: string;
  type: 'fill-blank' | 'multiple-choice' | 'matching' | 'true-false';
  correct_answer: string | string[] | Record<string, string>;
  options?: string[];
  hint?: string;
  explanation?: string;
}

export interface ContentBlock {
  id: string;
  type: 'lesson' | 'vocabulary' | 'grammar' | 'dialogue' | 'exercise' | 'reading' | 'listening' | 'pronunciation' | 'culture' | 'review';
  tags?: string[];
  media?: MediaAttachment[];
  ai_annotations?: AIAnnotations;
  content: {
    title?: string;
    text?: string;
    objectives?: string[];
    vocabulary?: VocabularyItem[];
    grammar?: GrammarRule;
    dialogue?: {
      context?: string;
      lines: DialogueLine[];
    };
    exercise?: {
      instructions: string;
      questions: ExerciseQuestion[];
    };
    reading?: {
      text: string;
      glossary?: Array<{ word: string; meaning: string }>;
      questions?: string[];
    };
    listening?: {
      transcript: string;
      questions: string[];
    };
    pronunciation?: {
      sound: string;
      description: string;
      examples: string[];
    };
    culture?: {
      title: string;
      content: string;
      fun_facts?: string[];
    };
    review?: {
      summary: string;
      self_check_questions: string[];
    };
  };
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  blocks: ContentBlock[];
}

export interface Textbook {
  metadata: TextbookMetadata;
  lessons: Lesson[];
}

// types/progress.ts
export interface ExerciseAttempt {
  questionId: string;
  answer: string | string[] | Record<string, string>;
  correct: boolean;
  attempts: number;
  timestamp: number;
}

export interface BlockProgress {
  completed: boolean;
  lastViewed: number;
  exerciseAttempts?: Record<string, ExerciseAttempt>;
}

export interface VocabularyProgress {
  known: boolean;
  reviewedAt?: number;
  timesReviewed: number;
}

export interface LessonProgress {
  blocks: Record<string, BlockProgress>;
  completed: boolean;
  lastAccessed: number;
}

export interface UserProgress {
  version: number;
  lastUpdated: number;
  textbooks: Record<string, {
    lessons: Record<string, LessonProgress>;
    vocabulary: Record<string, VocabularyProgress>;
  }>;
}