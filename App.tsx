// version 1.1.0
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Deobfuscator from './components/Deobfuscator';
import Obfuscator from './components/Obfuscator';
import Examples from './components/Examples';
import Footer from './components/Footer';
import Documentation from './components/Documentation';
import SettingsModal from './components/SettingsModal';
import BackToTopButton from './components/BackToTopButton';
import type { AppSettings } from './types';

const DeobfuscatorIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> );
const ObfuscatorIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg> );
const ExamplesIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /> </svg> );

const tabs = [
    { id: 'obfuscator', label: 'Obfuscator', icon: <ObfuscatorIcon /> },
    { id: 'deobfuscator', label: 'Deobfuscator', icon: <DeobfuscatorIcon /> },
    { id: 'examples', label: 'Examples', icon: <ExamplesIcon /> }
];

const defaultSettings: AppSettings = {
    mode: 'local',
    apiKey: '',
    obfuscatorModel: 'meta-llama/llama-3-70b-instruct',
    deobfuscatorModel: 'anthropic/claude-3.5-sonnet',
    persistKey: false,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('obfuscator');
  const [showDocs, setShowDocs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultSettings);
  const [scriptToLoad, setScriptToLoad] = useState('');

  useEffect(() => {
    try {
      const persistedSettings = localStorage.getItem('appSettings');
      if (persistedSettings) {
        setAppSettings(JSON.parse(persistedSettings));
      }
    } catch (error) {
        console.error("Could not load settings, defaulting.", error);
        setAppSettings(defaultSettings);
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    try {
      if (newSettings.persistKey) {
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
      } else {
        localStorage.removeItem('appSettings');
      }
    } catch (error) {
        console.error("Could not save settings.", error);
    }
    setShowSettings(false);
  };

  const handleToggleDocs = () => setShowDocs(prev => !prev);
  const handleToggleSettings = () => setShowSettings(prev => !prev);

  const handleLoadScriptInObfuscator = (script: string) => {
      setScriptToLoad(script);
      setActiveTab('obfuscator');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col">
      <Header 
        onToggleDocumentation={handleToggleDocs}
        onToggleSettings={handleToggleSettings} 
        appSettings={appSettings} 
      />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {showDocs ? (
          <Documentation onClose={handleToggleDocs} />
        ) : (
          <>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            {activeTab === 'obfuscator' && <Obfuscator appSettings={appSettings} scriptToLoad={scriptToLoad} />}
            {activeTab === 'deobfuscator' && <Deobfuscator appSettings={appSettings} />}
            {activeTab === 'examples' && <Examples onLoadScript={handleLoadScriptInObfuscator} />}
          </>
        )}
      </main>
      <Footer />
      {showSettings && (
        <SettingsModal 
            currentSettings={appSettings}
            onSave={handleSaveSettings}
            onClose={handleToggleSettings}
        />
      )}
      <BackToTopButton />
    </div>
  );
}
