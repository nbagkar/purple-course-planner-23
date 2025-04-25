
import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-border/40 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Layers className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-semibold text-primary">NYU Course Planner</h2>
        </div>
        
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Plan your academic journey
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Streamline your course selection process at New York University
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
