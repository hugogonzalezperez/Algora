interface NavbarProps {
  currentPage: string;
  onPageChange: (page: any) => void;
  pages: any;
}

export const Navbar = ({ currentPage, onPageChange, pages }: NavbarProps) => {
  return (
    <nav className="border-b border-sepia px-8 py-4 flex justify-between items-center bg-crema">
      <div className="flex items-center gap-10">
        <span className="font-bold text-3xl tracking-tighter">Algora</span>
        <div className="flex gap-6 text-sm font-bold">
          <button
            onClick={() => onPageChange(pages.PATH)}
            className={`relative py-1 border-0 ${currentPage === pages.PATH ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all uppercase group bg-transparent cursor-pointer`}
          >
            Pathfinding
            <div className={`absolute -bottom-1 left-0 w-full h-[2px] bg-carbon transition-all duration-300 origin-left ${currentPage === pages.PATH ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-100'}`} />
          </button>
          <button
            onClick={() => onPageChange(pages.SORT)}
            className={`relative py-1 border-0 ${currentPage === pages.SORT ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all uppercase group bg-transparent cursor-pointer`}
          >
            Sorting
            <div className={`absolute -bottom-1 left-0 w-full h-[2px] bg-carbon transition-all duration-300 origin-left ${currentPage === pages.SORT ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-100'}`} />
          </button>
          <button
            onClick={() => onPageChange(pages.DATA)}
            className={`relative py-1 border-0 ${currentPage === pages.DATA ? 'opacity-100' : 'opacity-40'} hover:opacity-100 transition-all uppercase group bg-transparent cursor-pointer`}
          >
            Data Structures
            <div className={`absolute -bottom-1 left-0 w-full h-[2px] bg-carbon transition-all duration-300 origin-left ${currentPage === pages.DATA ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-100'}`} />
          </button>
        </div>
      </div>
    </nav>
  );
};
