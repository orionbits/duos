// app/vocabulary/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore';
import { Search, Filter, Download, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface VocabularyWord {
  id: string;
  german: string;
  meaning: string;
  textbookId: string;
  textbookName: string;
  lessonTitle: string;
  gender?: string;
  part_of_speech: string;
}

export default function VocabularyPage() {
  const router = useRouter();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [filter, setFilter] = useState<'all' | 'known' | 'unknown'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { progress, markVocabularyKnown } = useProgressStore();
  
  useEffect(() => {
    async function loadAllVocabulary() {
      try {
        // Load manifest to get all textbooks
        const manifestRes = await fetch('/manifest.json');
        const manifest = await manifestRes.json();
        const allWords: VocabularyWord[] = [];
        
        for (const textbook of manifest.textbooks || []) {
          try {
            const textbookRes = await fetch(`/textbooks/${textbook.id}.json`);
            const textbookData = await textbookRes.json();
            
            for (const lesson of textbookData.lessons) {
              for (const block of lesson.blocks) {
                if (block.type === 'vocabulary' && block.content.vocabulary) {
                  for (const word of block.content.vocabulary) {
                    allWords.push({
                      id: word.id,
                      german: word.german,
                      meaning: word.meaning,
                      textbookId: textbook.id,
                      textbookName: textbook.name,
                      lessonTitle: lesson.title,
                      gender: word.gender,
                      part_of_speech: word.part_of_speech,
                    });
                  }
                }
              }
            }
          } catch (e) {
            console.error(`Failed to load ${textbook.id}`, e);
          }
        }
        
        setWords(allWords);
      } catch (error) {
        console.error('Failed to load vocabulary:', error);
        // Demo data
        setWords([
          { id: '1', german: 'Hallo', meaning: 'Hello', textbookId: 'demo', textbookName: 'Demo', lessonTitle: 'Lesson 1', part_of_speech: 'phrase' },
          { id: '2', german: 'Tschüss', meaning: 'Goodbye', textbookId: 'demo', textbookName: 'Demo', lessonTitle: 'Lesson 1', part_of_speech: 'phrase' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    loadAllVocabulary();
  }, []);
  
  const getWordStatus = (wordId: string) => {
    for (const textbookProgress of Object.values(progress.textbooks)) {
      if (textbookProgress.vocabulary[wordId]) {
        return textbookProgress.vocabulary[wordId].known;
      }
    }
    return false;
  };
  
  const filteredWords = words.filter((word) => {
    const isKnown = getWordStatus(word.id);
    if (filter === 'known' && !isKnown) return false;
    if (filter === 'unknown' && isKnown) return false;
    if (search && !word.german.toLowerCase().includes(search.toLowerCase()) && 
        !word.meaning.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  
  const knownCount = words.filter((w) => getWordStatus(w.id)).length;
  
  const handleExport = () => {
    const knownWords = words.filter((w) => getWordStatus(w.id));
    const exportData = knownWords.map((w) => ({
      german: w.german,
      meaning: w.meaning,
      gender: w.gender,
      part_of_speech: w.part_of_speech,
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `known-vocabulary-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📖 Vocabulary Hub</h1>
          <p className="text-gray-600">
            {knownCount} of {words.length} words known ({Math.round((knownCount / words.length) * 100)}%)
          </p>
        </div>
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search words..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('known')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'known' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Known
              </button>
              <button
                onClick={() => setFilter('unknown')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unknown' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unknown
              </button>
            </div>
            
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Export Known
            </button>
          </div>
        </div>
        
        {/* Word List */}
        <div className="space-y-2">
          {filteredWords.map((word) => {
            const isKnown = getWordStatus(word.id);
            
            return (
              <div
                key={word.id}
                className={`bg-white border rounded-lg p-4 transition-all ${
                  isKnown ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      {word.gender && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          word.gender === 'der' ? 'bg-blue-100 text-blue-700' :
                          word.gender === 'die' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {word.gender}
                        </span>
                      )}
                      <span className="font-semibold text-gray-900">{word.german}</span>
                      <span className="text-sm text-gray-500">→ {word.meaning}</span>
                      <span className="text-xs text-gray-400 capitalize">{word.part_of_speech}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {word.textbookName} • {word.lessonTitle}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => markVocabularyKnown(word.textbookId, word.id, !isKnown)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      isKnown
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isKnown ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {isKnown ? 'Known' : 'Mark known'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredWords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No vocabulary words found</p>
          </div>
        )}
      </div>
    </div>
  );
}