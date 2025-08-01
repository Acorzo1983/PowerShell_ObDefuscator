// version 0.1.6
import React from 'react';
import Loader from './Loader';
import { AnalysisResult } from '../types';

type OutputProps = string | Partial<AnalysisResult> | { error?: string };

interface AnalysisOutputProps {
  output: OutputProps;
  isLoading: boolean;
}

const renderOutput = (output: OutputProps) => {
    if (!output) return '';
    if (typeof output === 'string') {
        return output;
    }
    if ("error" in output && output.error) {
        return <span className="text-red-400">{output.error}</span>;
    }
    if ("deobfuscated_script" in output && output.deobfuscated_script) {
        return output.deobfuscated_script;
    }
    return JSON.stringify(output, null, 2);
};

const AnalysisOutput: React.FC<AnalysisOutputProps> = ({ output, isLoading }) => {
  const title = 'Analysis Output';
  const placeholderText = 'The generated script or analysis will appear here...';

  const textToCopy = (): string => {
    if (!output) return '';
    if (typeof output === 'string') return output;
    if ("deobfuscated_script" in output && output.deobfuscated_script) return output.deobfuscated_script;
    if ("error" in output && output.error) return output.error;
    return JSON.stringify(output, null, 2);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy());
  };

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-brand-text">{title}</h3>
        {output && !isLoading && (
          <div className="flex space-x-4">
            <button onClick={handleCopy} className="text-sm text-brand-text-light hover:text-white">Copy</button>
          </div>
        )}
      </div>

      {/* --- MAIN CHANGE IS HERE --- */}
      {/* This container will now show EITHER the Loader OR the output text */}
      <div className="flex-grow bg-brand-bg text-brand-text-light font-mono text-sm p-4 rounded-md border border-brand-border w-full">
        {isLoading ? (
          <Loader />
        ) : (
          <pre className="whitespace-pre-wrap break-all h-full">
            <code>
              {renderOutput(output) || placeholderText}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default AnalysisOutput;
