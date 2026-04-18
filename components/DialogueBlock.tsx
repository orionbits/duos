// components/DialogueBlock.tsx
'use client';

import { useState } from 'react';
import { DialogueLine } from '@/types/textbook';
import { Volume2 } from 'lucide-react';

interface DialogueBlockProps {
  context?: string;
  lines: DialogueLine[];
}

export function DialogueBlock({ context, lines }: DialogueBlockProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  
  // Simple audio placeholder - integrate Howler.js in production
  const playAudio = (text: string) => {
    // Use Web Speech API as fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">💬 Dialogue</h3>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showTranslation ? 'Hide' : 'Show'} Translations
        </button>
      </div>
      
      {context && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
          📖 {context}
        </div>
      )}
      
      <div className="space-y-3">
        {lines.map((line, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
            <div className="flex items-start gap-3">
              <span className="font-semibold text-blue-600 min-w-[80px]">{line.speaker}:</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-gray-800">{line.german}</p>
                  <button
                    onClick={() => playAudio(line.german)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Listen"
                  >
                    <Volume2 size={16} className="text-gray-500" />
                  </button>
                </div>
                {showTranslation && (
                  <p className="text-sm text-gray-500 mt-1">({line.translation})</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}