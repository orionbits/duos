// components/VocabularyBlock.tsx
'use client';

import { useState } from 'react';
import { VocabularyItem } from '@/types/textbook';
import { useProgressStore } from '@/store/progressStore';
import { CheckCircle, Eye, Volume2 } from 'lucide-react';

interface VocabularyBlockProps {
  textbookId: string;
  lessonId: string;
  blockId: string;
  vocabulary: VocabularyItem[];
}

export function VocabularyBlock({ textbookId, lessonId, blockId, vocabulary }: VocabularyBlockProps) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const markKnown = useProgressStore((state) => state.markVocabularyKnown);
  const vocabProgress = useProgressStore((state) => state.progress.textbooks[textbookId]?.vocabulary || {});

  const toggleReveal = (wordId: string) => {
    setRevealed((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
  };

  const handleMarkKnown = (wordId: string, known: boolean) => {
    markKnown(textbookId, wordId, known);
  };

  const getGenderColor = (gender?: string) => {
    switch (gender) {
      case 'der': return 'text-blue-600 bg-blue-50';
      case 'die': return 'text-red-600 bg-red-50';
      case 'das': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Vocabulary</h3>
      <div className="grid gap-4">
        {vocabulary.map((item) => {
          const isKnown = vocabProgress[item.id]?.known || false;
          
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-4 transition-all ${
                isKnown ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {item.gender && (
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getGenderColor(item.gender)}`}>
                        {item.gender}
                      </span>
                    )}
                    <span className="text-xl font-semibold text-gray-900">{item.german}</span>
                    {item.plural && (
                      <span className="text-sm text-gray-500">
                        Plural: {item.plural}
                      </span>
                    )}
                    <span className="text-sm text-gray-400 capitalize">{item.part_of_speech}</span>
                  </div>
                  
                  {revealed[item.id] ? (
                    <div className="mt-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Meaning:</span> {item.meaning}
                      </p>
                      {item.example && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600">"{item.example}"</p>
                          {item.example_translation && (
                            <p className="text-gray-500">({item.example_translation})</p>
                          )}
                        </div>
                      )}
                      {item.notes && (
                        <p className="mt-1 text-sm text-amber-600">📝 {item.notes}</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Eye size={16} />
                      Reveal meaning
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => handleMarkKnown(item.id, !isKnown)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    isKnown
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle size={16} />
                  {isKnown ? 'Known' : 'Mark known'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}