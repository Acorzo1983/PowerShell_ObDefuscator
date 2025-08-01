// version 1.1.2
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { analysisModels, obfuscationModels } from '../services/models';
import { testApiKey } from '../services/openRouterService';
import Spinner from './Spinner';

interface SettingsModalProps {
  currentSettings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
  const [config, setConfig] = useState<AppSettings>(currentSettings);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');

  const handleApiKeyChange = (apiKey: string) => {
    setConfig({ ...config, apiKey });
    setTestResult(null);
    setTestMessage('');
  };

  const handleTestKey = async () => {
    if (!config.apiKey) return;
    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');
    try {
      await testApiKey(config.apiKey);
      setTestResult('success');
      setTestMessage('API Key is valid!');
    } catch (error: any) {
      setTestResult('error');
      setTestMessage(error.message || 'Failed to validate key.');
    } finally {
      setIsTesting(false);
    }
  };
  
  const isSaveDisabled = config.mode === 'ai' && testResult !== 'success';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-brand-surface/80 text-brand-text rounded-lg shadow-xl p-8 w-full max-w-lg border border-brand-border">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button onClick={onClose} className="text-brand-text-light hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-brand-text-light">Mode</label>
            <div className="flex rounded-lg bg-brand-bg p-1">
              <button onClick={() => setConfig({ ...config, mode: 'local' })} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${config.mode === 'local' ? 'bg-gray-500 text-white' : 'text-brand-text-light hover:bg-brand-border'}`}>
                Local (Offline)
              </button>
              <button onClick={() => setConfig({ ...config, mode: 'ai' })} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${config.mode === 'ai' ? 'bg-brand-primary text-white' : 'text-brand-text-light hover:bg-brand-border'}`}>
                AI (Online)
              </button>
            </div>
          </div>

          {config.mode === 'ai' && (
            <div className="space-y-4 border-t border-brand-border pt-6">
                <div>
                    <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-brand-text-light">OpenRouter API Key</label>
                    <div className="relative">
                        <input
                            type="password" id="apiKey" value={config.apiKey}
                            onChange={(e) => handleApiKeyChange(e.target.value)}
                            className="w-full p-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-brand-primary focus:border-brand-primary pr-24"
                            placeholder="sk-or-..."
                        />
                        <button 
                            onClick={handleTestKey}
                            disabled={!config.apiKey || isTesting}
                            className="absolute top-1/2 right-1.5 -translate-y-1/2 bg-brand-primary text-white px-3 py-1.5 text-xs font-bold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isTesting ? <Spinner /> : 'Test Key'}
                        </button>
                    </div>
                    {testMessage && (
                        <p className={`text-xs mt-2 ${testResult === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {testMessage}
                        </p>
                    )}
                </div>
              
                <div>
                    <label className="flex items-center mt-2"><input type="checkbox" checked={config.persistKey ?? false} onChange={(e) => setConfig({ ...config, persistKey: e.target.checked })} className="w-4 h-4 text-brand-primary bg-brand-bg border-brand-border rounded focus:ring-brand-primary" />
                    <span className="ml-2 text-sm text-brand-text-light">Persist API Key in browser storage</span></label>
                </div>

                <div>
                    <label htmlFor="obfuscatorModel" className="block mb-2 text-sm font-medium text-brand-text-light">Obfuscator Model</label>
                    <select id="obfuscatorModel" value={config.obfuscatorModel} onChange={(e) => setConfig({ ...config, obfuscatorModel: e.target.value })} className="w-full p-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-brand-primary focus:border-brand-primary">
                        {obfuscationModels.map(model => (<option key={model.id} value={model.id}>{model.name}</option>))}
                    </select>
                </div>
              
                <div>
                    <label htmlFor="deobfuscatorModel" className="block mb-2 text-sm font-medium text-brand-text-light">Deobfuscator Model</label>
                    <select id="deobfuscatorModel" value={config.deobfuscatorModel} onChange={(e) => setConfig({ ...config, deobfuscatorModel: e.target.value })} className="w-full p-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-brand-primary focus:border-brand-primary">
                        {analysisModels.map(model => (<option key={model.id} value={model.id}>{model.name}</option>))}
                    </select>
                </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2 bg-brand-border hover:bg-gray-600 rounded-lg">Cancel</button>
          <button onClick={() => onSave(config)} disabled={isSaveDisabled} className="px-6 py-2 bg-brand-secondary hover:opacity-90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
