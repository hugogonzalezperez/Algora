import { useState } from 'react';
import { PathfindingPage } from './pages/PathfindingPage';
import { SortingPage } from './pages/SortingPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'path' | 'sort'>('path');

  return (
    <div className="min-h-screen bg-crema text-carbon font-mono">
      {/* Header Minimalista */}
      <nav className="border-b border-sepia px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="font-bold text-lg tracking-tighter">Algora</span>
          <div className="flex gap-4 text-sm font-medium">
            <button
              onClick={() => setCurrentPage('path')}
              className={`${currentPage === 'path' ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-opacity`}
            >
              Pathfinding
            </button>
            <button
              onClick={() => setCurrentPage('sort')}
              className={`${currentPage === 'sort' ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-opacity`}
            >
              Sorting
            </button>
          </div>
        </div>
      </nav>

      {/* Renderizado Condicional de Páginas */}
      <main className="p-0">
        {currentPage === 'path' ? <PathfindingPage /> : <SortingPage />}
      </main>
    </div>
  );
}