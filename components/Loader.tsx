// version 0.1.6
import React from 'react';

const Loader: React.FC = () => {
  // The outer box with background and border has been removed.
  // This component is now just the spinner and text, for use inside other containers.
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-brand-primary border-dashed rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 10v-3m3 3h.01M7 17h.01" />
            </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-300 mt-6">Analyzing Script...</h3>
      <p className="text-brand-text-light mt-2 text-center">The AI is deobfuscating and assessing the code. <br/> This may take a moment.</p>
    </div>
  );
};

export default Loader;
