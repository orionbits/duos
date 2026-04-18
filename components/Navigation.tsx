// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Library, Home } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <BookOpen className="text-blue-600" />
            <span>German Workbook</span>
          </Link>
          
          <div className="flex gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/vocabulary"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/vocabulary') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Library size={18} />
              <span className="hidden sm:inline">Vocabulary</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}