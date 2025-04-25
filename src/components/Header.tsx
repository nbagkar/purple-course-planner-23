
import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-primary/20 border-b border-primary/30 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-medium tracking-wide text-primary">NYU Course Planner</h2>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground max-w-3xl">
          Plan your academic journey at New York University
        </h1>
      </div>
    </header>
  );
};

export default Header;
