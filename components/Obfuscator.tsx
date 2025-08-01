// version 0.2.7
import React, { useState, useEffect } from 'react';
import ScriptInput from './ScriptInput';
import AnalysisOutput from './AnalysisOutput';
import { AppSettings, ObfuscatorOptions, AnalysisResult } from '../types';
import { localObfuscateScript } from '../services/localPowershell';
import { obfuscateScript as aiObfuscateScript } from '../services/openRouterService';

interface ObfuscatorProps {
    appSettings: AppSettings;
    scriptToLoad: string;
}

// Helper component for technique checkboxes with descriptions
const TechniqueCheckbox: React.FC<{ label: string; description: string; checked: boolean; onChange: () => void; disabled?: boolean }> = ({ label, description, checked, onChange, disabled }) => (
    <div className={`relative ${disabled ? 'opacity-50' : ''}`}>
        <label 
            className={`flex items-center space-x-3 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
            title={disabled ? 'This technique is only available in AI Mode' : description}
        >
            <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
                className="h-5 w-5 rounded bg-brand-bg border-brand-border text-brand-primary focus:ring-brand-primary" />
            <span className="text-sm font-medium">{label}</span>
        </label>
    </div>
);


const Obfuscator: React.FC<ObfuscatorProps> = ({ appSettings, scriptToLoad }) => {
    const [inputScript, setInputScript] = useState('');
    const [output, setOutput] = useState<string | { error: string }>('');
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<ObfuscatorOptions>({
        level: 'High',
        useReverseShell: false,
        ipAddress: '127.0.0.1',
        port: '4444',
        techniques: {
            lexical: true,
            encoding: true,
            semantic: true,
            controlFlow: false,
            evasion: false,
            junkCode: true,
        },
    });

    useEffect(() => {
        if (scriptToLoad) {
            setInputScript(scriptToLoad);
        }
    }, [scriptToLoad]);

    const handleObfuscate = async () => {
        setIsLoading(true);
        setOutput('');
        try {
            let result;
            if (appSettings.mode === 'local') {
                result = await localObfuscateScript(inputScript, options);
            } else {
                if (!appSettings.apiKey) throw new Error("API Key is missing. Please set it in Settings.");
                result = await aiObfuscateScript(inputScript, options, appSettings.apiKey, appSettings.obfuscatorModel);
            }
            setOutput(result);
        } catch (error: any) {
            setOutput({ error: `Obfuscation Failed: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionChange = (option: keyof ObfuscatorOptions, value: any) => {
        setOptions(prev => ({ ...prev, [option]: value }));
    };

    const handleTechniqueChange = (technique: keyof ObfuscatorOptions['techniques']) => {
        setOptions(prev => ({
            ...prev,
            techniques: { ...prev.techniques, [technique]: !prev.techniques[technique] }
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
            <div className="lg:col-span-3 flex flex-col gap-8">
                <ScriptInput 
                    value={inputScript}
                    onChange={setInputScript}
                    onProcess={handleObfuscate}
                    isLoading={isLoading}
                    mode="obfuscate"
                />
                
                <div className="bg-brand-surface rounded-lg border border-brand-border p-6">
                    <h3 className="text-lg font-bold text-brand-text mb-4">Obfuscation Options</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-light mb-2">Obfuscation Level</label>
                            <div className="flex space-x-2">
                                {['Low', 'Medium', 'High', 'Insane'].map(level => {
                                    const isInsaneAndDisabled = level === 'Insane' && appSettings.mode !== 'ai';
                                    return (
                                        <div 
                                            key={level} 
                                            className="flex-1" 
                                            title={isInsaneAndDisabled ? 'Requires AI Mode' : ''}
                                        >
                                            <button 
                                                onClick={() => handleOptionChange('level', level as ObfuscatorOptions['level'])}
                                                disabled={isInsaneAndDisabled}
                                                className={`w-full py-2 text-sm font-bold rounded-md transition-colors ${
                                                    options.level === level 
                                                        ? 'bg-brand-secondary text-white' 
                                                        : 'bg-brand-bg hover:bg-brand-border'
                                                } ${
                                                    isInsaneAndDisabled 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : ''
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-brand-text-light">Enable Reverse Shell Payload</span>
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={options.useReverseShell} onChange={() => handleOptionChange('useReverseShell', !options.useReverseShell)} />
                                    <div className="block bg-brand-bg w-14 h-8 rounded-full border border-brand-border"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${options.useReverseShell ? 'transform translate-x-6 bg-brand-primary' : ''}`}></div>
                                </div>
                            </label>
                            {options.useReverseShell && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <input type="text" value={options.ipAddress} onChange={(e) => handleOptionChange('ipAddress', e.target.value)} placeholder="IP Address" className="p-2 bg-brand-bg border border-brand-border rounded-md text-sm" />
                                    <input type="text" value={options.port} onChange={(e) => handleOptionChange('port', e.target.value)} placeholder="Port" className="p-2 bg-brand-bg border border-brand-border rounded-md text-sm" />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-brand-text-light mb-3">Techniques</label>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <TechniqueCheckbox label="Lexical" description="Rename variables, split strings." checked={options.techniques.lexical} onChange={() => handleTechniqueChange('lexical')} />
                                <TechniqueCheckbox label="Encoding" description="Encode strings with Base64, etc." checked={options.techniques.encoding} onChange={() => handleTechniqueChange('encoding')} />
                                <TechniqueCheckbox label="Semantic" description="Use command aliases, alternative .NET calls." checked={options.techniques.semantic} onChange={() => handleTechniqueChange('semantic')} />
                                <TechniqueCheckbox label="Junk Code" description="Add useless variables and dead code." checked={options.techniques.junkCode} onChange={() => handleTechniqueChange('junkCode')} />
                                <TechniqueCheckbox label="Control Flow" description="Add fake conditional blocks and junk loops." checked={options.techniques.controlFlow} onChange={() => handleTechniqueChange('controlFlow')} disabled={appSettings.mode !== 'ai'} />
                                <TechniqueCheckbox label="Evasion" description="Attempt to bypass AMSI or other security products." checked={options.techniques.evasion} onChange={() => handleTechniqueChange('evasion')} disabled={appSettings.mode !== 'ai'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <AnalysisOutput output={output} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default Obfuscator;
