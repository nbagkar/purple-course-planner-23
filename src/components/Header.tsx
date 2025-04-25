
import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/0ec13942-3519-42c0-b16a-9d5e618618fc.png')] opacity-10 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80"></div>
      
      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-8 w-8 text-sky-400" />
          <h2 className="text-xl font-medium tracking-wide text-sky-400">Course Planner</h2>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl">
          Plan Your Academic Journey with Precision
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
          Streamline your course selection process and stay on track with your degree requirements
        </p>
      </div>
    </header>
  );
};

export default Header;
