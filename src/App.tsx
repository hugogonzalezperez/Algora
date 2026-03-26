import { useState } from 'react';
import { PathfindingPage } from './pages/PathfindingPage';
import { SortingPage } from './pages/SortingPage';
import { DataStructuresPage } from './pages/DataStructuresPage';

const PAGES = { PATH: 'path', SORT: 'sort', DATA: 'data' } as const;
type Page = typeof PAGES[keyof typeof PAGES];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(PAGES.DATA);

  return (
    <div className={`bg-crema text-carbon font-mono flex flex-col ${currentPage === PAGES.DATA ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Header Minimalista - Unified for both pages */}
      <nav className="border-b border-sepia px-8 py-4 flex justify-between items-center bg-crema shrink-0">
        <div className="flex items-center gap-10">
          <span className="font-bold text-3xl tracking-tighter cursor-pointer" onClick={() => setCurrentPage(PAGES.DATA)}>Algora</span>
          <div className="flex gap-6 text-sm font-bold">
            <button
              onClick={() => setCurrentPage(PAGES.PATH)}
              className={`relative py-1 border-0 ${currentPage === PAGES.PATH ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all uppercase group bg-transparent cursor-pointer`}
            >
              Pathfinding
              <div className={`absolute -bottom-1 left-0 w-full h-[2px] bg-carbon transition-all duration-300 origin-left ${currentPage === PAGES.PATH ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-100'}`} />
            </button>
            <button
              onClick={() => setCurrentPage(PAGES.SORT)}
              className={`relative py-1 border-0 ${currentPage === PAGES.SORT ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all uppercase group bg-transparent cursor-pointer`}
            >
              Sorting
              <div className={`absolute -bottom-1 left-0 w-full h-[2px] bg-carbon transition-all duration-300 origin-left ${currentPage === PAGES.SORT ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-100'}`} />
            </button>
            <button
              onClick={() => setCurrentPage(PAGES.DATA)}
              className={`relative py-1 border-0 ${currentPage === PAGES.DATA ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all uppercase group bg-transparent cursor-pointer`}
            >
              Data Structures
              <div className={`absolute -bottom-1 left-0 w-full h-[2px] bg-carbon transition-all duration-300 origin-left ${currentPage === PAGES.DATA ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-100'}`} />
            </button>
          </div>
        </div>
      </nav>

      <main className={`flex-1 bg-crema ${currentPage === PAGES.DATA ? 'overflow-hidden' : ''}`}>
        {currentPage === PAGES.PATH && <PathfindingPage />}
        {currentPage === PAGES.SORT && <SortingPage />}
        {currentPage === PAGES.DATA && <DataStructuresPage />}
      </main>
    </div>
  );
}