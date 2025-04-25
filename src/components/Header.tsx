
import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-b border-primary/20 py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-medium tracking-tight text-primary">NYU Course Planner</h2>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground max-w-3xl mx-auto bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Plan your academic journey at New York University
        </h1>
      </div>
    </header>
  );
};

export default Header;
