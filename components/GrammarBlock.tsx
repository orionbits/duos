// components/GrammarBlock.tsx
'use client';

import { GrammarRule } from '@/types/textbook';

interface GrammarBlockProps {
  grammar: GrammarRule;
}

export function GrammarBlock({ grammar }: GrammarBlockProps) {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-xl font-bold text-purple-900 mb-2">📚 {grammar.concept}</h3>
        <div className="bg-white rounded-lg p-3 mb-3">
          <code className="text-lg font-mono text-purple-700">{grammar.pattern}</code>
        </div>
        <p className="text-gray-700">{grammar.explanation}</p>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Examples:</h4>
        {grammar.examples.map((example, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-gray-800 font-medium">{example.german}</p>
            <p className="text-sm text-gray-500 mt-1">{example.english}</p>
          </div>
        ))}
      </div>
      
      {grammar.exceptions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800">⚠️ Exception:</p>
          <p className="text-sm text-yellow-700">{grammar.exceptions}</p>
        </div>
      )}
      
      {grammar.summary && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800">📝 Summary:</p>
          <p className="text-sm text-green-700">{grammar.summary}</p>
        </div>
      )}
    </div>
  );
}