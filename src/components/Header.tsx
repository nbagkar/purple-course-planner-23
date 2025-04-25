
import React from 'react';

const Header = () => {
  return (
    <header className="w-full nyu-gradient text-white py-6 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">NYU Course Planner</h1>
        <p className="mt-2 text-lg opacity-90">Plan your academic journey at New York University</p>
      </div>
    </header>
  );
};

export default Header;
