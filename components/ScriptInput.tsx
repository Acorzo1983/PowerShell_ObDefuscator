// version 1.1.0
import React from 'react';
import Spinner from './Spinner';

interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
  onProcess: () => void;
  isLoading: boolean;
  mode: 'obfuscate' | 'deobfuscate';
}

const ScriptInput: React.FC<ScriptInputProps> = ({ value, onChange, onProcess, isLoading, mode }) => {
  const title = mode === 'obfuscate' ? 'Clean PowerShell Script' : 'Obfuscated PowerShell Script';
  const buttonText = mode === 'obfuscate' ? 'Obfuscate' : 'Deobfuscate & Analyze';
  const placeholderText = mode === 'obfuscate' 
    ? 'Paste your clean PowerShell script here...'
    : 'Paste your obfuscated PowerShell script here...';

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-brand-text">{title}</h3>
        <button onClick={() => onChange('')} className="text-sm text-brand-text-light hover:text-white">
          Clear
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholderText}
        className="flex-grow bg-brand-bg text-brand-text-light font-mono text-sm p-4 rounded-md border border-brand-border focus:ring-2 focus:ring-brand-primary focus:outline-none w-full"
        spellCheck="false"
      />
      <button
        onClick={onProcess}
        disabled={isLoading || !value}
        className="mt-6 w-full bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
      >
        {isLoading ? <Spinner /> : buttonText}
      </button>
    </div>
  );
};

export default ScriptInput;
