
import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-white/50 backdrop-blur-md border-b border-purple-100/20 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Layers className="h-10 w-10 text-primary" />
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NYU Course Planner
          </h2>
        </div>
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4 leading-tight">
            Plan your academic journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Streamline your course selection process at New York University with our modern planning tools
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
