
import React from 'react';

const Header = () => {
  return (
    <header className="w-full gradient-header text-white py-8 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          Course Planner
        </h1>
        <p className="mt-3 text-lg md:text-xl text-white/90 font-light">
          Plan your academic journey with ease
        </p>
      </div>
    </header>
  );
};

export default Header;
