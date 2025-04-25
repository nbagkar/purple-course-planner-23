
import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm border-b border-primary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-medium tracking-tight text-primary">NYU Course Planner</h2>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground max-w-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Plan your academic journey at New York University
        </h1>
      </div>
    </header>
  );
};

export default Header;
