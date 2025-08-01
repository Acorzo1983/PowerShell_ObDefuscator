// version 1.1.1
import React from 'react';
import { AppSettings } from '../types';
import { analysisModels, obfuscationModels } from '../services/models';

interface HeaderProps {
    onToggleDocumentation: () => void;
    onToggleSettings: () => void;
    appSettings: AppSettings;
}

const SkullIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5c-3.39 0-6.16 2.34-6.83 5.43a.75.75 0 00.74.82h12.18a.75.75 0 00.74-.82C18.16 6.84 15.39 4.5 12 4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v2.25m0 0c-1.14.63-2.25 1.5-2.25 1.5s.13 1.12.63 2.13m1.62-3.63c1.14.63 2.25 1.5 2.25 1.5s-.13 1.12-.63 2.13m-1.62-3.63v2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.17 9.84a.75.75 0 011.06 0l1.6 1.6a.75.75 0 11-1.06 1.06l-1.6-1.6a.75.75 0 010-1.06zM17.17 9.84a.75.75 0 011.06 0l1.6 1.6a.75.75 0 11-1.06 1.06l-1.6-1.6a.75.75 0 010-1.06z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.05.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613.438-.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onToggleDocumentation, onToggleSettings, appSettings }) => {
    return (
        <header className="bg-brand-surface border-b border-brand-border p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <SkullIcon />
                <h1 className="text-xl font-bold text-brand-text">PowerShell ObDefuscator</h1>
                <span className="text-xs text-brand-primary font-mono tracking-widest">[AI POWERED]</span>
            </div>
            <div className="flex items-center space-x-4">
                {/* --- MAIN CHANGE HERE --- */}
                {/* This logic now correctly checks the app's current mode before displaying the status. */}
                <span className="text-xs bg-brand-bg border border-brand-border px-3 py-1 rounded-full">
                    {appSettings.mode === 'ai' 
                        ? `AI: ${appSettings.obfuscatorModel.split('/')[1] || appSettings.obfuscatorModel}` 
                        : 'Local Mode'
                    }
                </span>
                
                <button onClick={onToggleSettings} className="text-brand-text-light hover:text-white" aria-label="Settings">
                    <SettingsIcon />
                </button>
                <button onClick={onToggleDocumentation} className="text-brand-text-light hover:text-white" aria-label="Documentation">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </button>
                <a href="https://powershellforhackers.com/" target="_blank" rel="noopener noreferrer" className="text-brand-text-light hover:text-white" aria-label="Project Home">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </a>
            </div>
        </header>
    );
};

export default Header;
