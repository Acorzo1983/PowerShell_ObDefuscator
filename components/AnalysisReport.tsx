// version 1.1.0
import React from 'react';
import { AnalysisResult } from '../types';
import ThreatLevelBadge from './ThreatLevelBadge';

interface AnalysisReportProps {
  result: Partial<AnalysisResult>;
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold uppercase text-brand-secondary mb-3 tracking-wider">{title}</h3>
    {children}
  </div>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-secondary mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ActionFlow: React.FC<{ actions: string[] }> = ({ actions }) => (
    <div className="flex items-center space-x-2 flex-wrap">
        {actions.map((action, index) => (
            <React.Fragment key={index}>
                <span className="bg-brand-bg text-brand-primary font-bold text-sm px-3 py-1 rounded">{action}</span>
                {index < actions.length - 1 && <span className="text-brand-text-light font-bold">→</span>}
            </React.Fragment>
        ))}
    </div>
);

const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  if (!result?.analysis) {
    return <p className="text-brand-text-light p-4">Analysis data is not available.</p>;
  }

  return (
    <div className="bg-brand-surface rounded-lg border border-brand-border p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold text-brand-text">Analysis Report</h2>
        {result.threat_level && <ThreatLevelBadge level={result.threat_level} />}
      </div>

      <ReportSection title="Summary">
        <p className="text-brand-text-light text-sm">{result.analysis.summary}</p>
      </ReportSection>

      {result.analysis.action_flow && result.analysis.action_flow.length > 0 && (
          <ReportSection title="Action Flow">
              <ActionFlow actions={result.analysis.action_flow} />
          </ReportSection>
      )}
      
      <ReportSection title="Deobfuscated Script">
        <pre className="bg-brand-bg p-4 rounded-md text-sm text-brand-text-light whitespace-pre-wrap break-all h-48 resize-y overflow-auto">
          <code>{result.deobfuscated_script || '// Could not deobfuscate script.'}</code>
        </pre>
      </ReportSection>

      <ReportSection title="Malicious Indicators">
        <ul className="space-y-3 text-sm text-brand-text-light">
          {result.analysis.indicators?.map((indicator, index) => (
            <li key={index} className="flex items-start">
              <WarningIcon />
              <span>{indicator}</span>
            </li>
          ))}
        </ul>
      </ReportSection>
      
      <ReportSection title="Step-by-step Execution Analysis">
        <ul className="space-y-2 text-sm text-brand-text-light list-decimal list-inside">
          {result.analysis.step_by_step?.map((step, index) => (
            <li key={index}>{step.description}</li>
          ))}
        </ul>
      </ReportSection>
    </div>
  );
};

export default AnalysisReport;
