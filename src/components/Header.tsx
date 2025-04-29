import React from 'react';
import { Layers } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-nyu-purple to-purple-400 shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">NYU Altbert</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
