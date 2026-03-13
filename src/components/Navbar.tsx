import { useState } from 'react';
import logo from '../assets/Logo1.svg';
import logoIcon from '../assets/logoIcon.svg';
import diagram from '../assets/diagram.svg';
import './Navbar.scss';

export default function Navbar() {
  const [activeModule, setActiveModule] = useState('Module 1');
  const [isOpen, setIsOpen] = useState(true); 

  const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5'];

  return (
    <aside 
      className={`relative h-screen bg-[#3E3E3E] flex flex-col shadow-xl select-none transition-all duration-300 z-40 ${
        isOpen ? 'w-[280px]' : 'w-[150px]'
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden whitespace-nowrap">
        
        <div className={`pt-16 flex z-10 shrink-0 transition-all duration-300 ${isOpen ? 'px-12 justify-start' : 'px-0 justify-center'}`}>
          <img 
            src={isOpen ? logo : logoIcon} 
            alt="Iris Logo" 
            className={`transition-all duration-300 ${isOpen ? 'w-32' : 'w-10'} h-auto`} 
          />
        </div>

        <nav className={`mt-20 flex flex-col gap-8 z-10 ${isOpen ? 'px-12' : 'px-0 items-center'}`}>
          {modules.map((mod, index) => {
            const isActive = activeModule === mod;
            return (
              <button
                key={mod}
                onClick={() => setActiveModule(mod)}
                className={`flex items-center gap-4 transition-all  duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#9ca3af] hover:text-gray-200 hover:translate-x-2'
                }`}
              >
                <svg 
                  className={`w-7 h-7 shrink-0 ${isActive ? 'text-white' : 'text-[#9ca3af]'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>

                <span className={`${isActive ? 'text-[28px] font-bold tracking-wide' : 'text-[20px]'}`}>
                  {isOpen ? mod : (index + 1)}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none flex justify-center">
          <img 
            src={diagram} 
            alt="Background diagram" 
            className="w-full h-auto object-cover opacity-50" 
          />
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-50 cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        <svg 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180 hover:rotate-0' : 'rotate-0 hover:rotate-180'}`}
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

    </aside>
  );
}