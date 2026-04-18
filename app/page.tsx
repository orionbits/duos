// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore';
import { BookOpen, Trophy, Languages, Download, Upload, Trash2 } from 'lucide-react';

interface TextbookManifest {
  id: string;
  name: string;
  cefr_level: string;
  cover_image?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [textbooks, setTextbooks] = useState<TextbookManifest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const { exportProgress, importProgress, clearProgress, progress } = useProgressStore();
  
  // Load available textbooks from manifest
  useEffect(() => {
    async function loadManifest() {
      try {
        const response = await fetch('/manifest.json');
        if (response.ok) {
          const data = await response.json();
          setTextbooks(data.textbooks || []);
        } else {
          // Demo data for development
          setTextbooks([
            { id: 'netzwerk_a1', name: 'Netzwerk neu A1', cefr_level: 'A1' },
            { id: 'netzwerk_a2', name: 'Netzwerk neu A2', cefr_level: 'A2' },
            { id: 'begegnungen_a1', name: 'Begegnungen A1', cefr_level: 'A1' },
          ]);
        }
      } catch (error) {
        console.error('Failed to load manifest:', error);
        setTextbooks([
          { id: 'sample', name: 'Sample Textbook', cefr_level: 'A1' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    loadManifest();
  }, []);
  
  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `german-workbook-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importProgress(content);
        alert('Progress imported successfully!');
        setShowImport(false);
      };
      reader.readAsText(file);
    }
  };
  
  const getTotalProgress = () => {
    const allProgress = Object.values(progress.textbooks);
    if (allProgress.length === 0) return 0;
    
    let totalLessons = 0;
    let completedLessons = 0;
    
    allProgress.forEach((textbook) => {
      Object.values(textbook.lessons).forEach((lesson) => {
        totalLessons++;
        if (lesson.completed) completedLessons++;
      });
    });
    
    return totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;
  };
  
  const getTotalVocabularyKnown = () => {
    let known = 0;
    let total = 0;
    
    Object.values(progress.textbooks).forEach((textbook) => {
      const vocab = textbook.vocabulary;
      known += Object.values(vocab).filter((v) => v.known).length;
      total += Object.keys(vocab).length;
    });
    
    return { known, total };
  };
  
  const vocabStats = getTotalVocabularyKnown();
  const totalProgress = getTotalProgress();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            German Workbook
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your digital German textbook. Track progress, check answers, and learn offline.
          </p>
        </div>
        
        {/* Progress Dashboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Your Progress
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Overall Progress</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 rounded-full h-3 transition-all"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
                <span className="font-semibold text-gray-900">{Math.round(totalProgress)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Vocabulary Known</p>
              <p className="text-2xl font-bold text-gray-900">
                {vocabStats.known} / {vocabStats.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Textbooks Started</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(progress.textbooks).length}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Export Progress
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload size={18} />
              Import Progress
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure? This will clear ALL your progress.')) {
                  clearProgress();
                  window.location.reload();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={18} />
              Clear All Progress
            </button>
          </div>
          
          {showImport && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          )}
        </div>
        
        {/* Available Textbooks */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Languages className="text-blue-600" />
          Available Textbooks
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {textbooks.map((book) => (
            <button
              key={book.id}
              onClick={() => router.push(`/textbook/${book.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <BookOpen size={32} className="text-blue-600 group-hover:text-blue-700" />
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {book.cefr_level}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{book.name}</h3>
              <p className="text-sm text-gray-500">Click to start learning →</p>
            </button>
          ))}
        </div>
        
        {/* Features Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-center">Features</h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">✓</div>
              <p className="text-sm text-gray-600">Instant exercise feedback</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📚</div>
              <p className="text-sm text-gray-600">Track vocabulary</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📤</div>
              <p className="text-sm text-gray-600">Export/Import progress</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📱</div>
              <p className="text-sm text-gray-600">Works offline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}