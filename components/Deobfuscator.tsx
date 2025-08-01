// version 0.2.5
import React from 'react';
import ScriptInput from './ScriptInput';
import AnalysisOutput from './AnalysisOutput';
import Loader from './Loader';
import AnalysisReport from './AnalysisReport';
import { AppSettings, AnalysisResult } from '../types';
import { analysisModels, obfuscationModels } from '../services/models'; // Import both lists
import { localAnalyzeScript } from '../services/localPowershell';
import { analyzeScript as aiAnalyzeScript } from '../services/openRouterService';

interface DeobfuscatorProps {
    appSettings: AppSettings;
}

const Deobfuscator: React.FC<DeobfuscatorProps> = ({ appSettings }) => {
    const [inputScript, setInputScript] = React.useState('');
    const [output, setOutput] = React.useState<Partial<AnalysisResult> | { error: string } | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showWarning, setShowWarning] = React.useState(false); // State to control the warning dialog

    const handleDeobfuscate = async (forceContinue = false) => {
        // --- NEW COMPATIBILITY CHECK LOGIC ---
        if (appSettings.mode === 'ai' && !forceContinue) {
            const allModels = [...analysisModels, ...obfuscationModels];
            const selectedModelInfo = allModels.find(m => m.id === appSettings.deobfuscatorModel);

            if (selectedModelInfo && !selectedModelInfo.supportsAnalysis) {
                setShowWarning(true);
                return;
            }
        }
        
        setShowWarning(false);
        setIsLoading(true);
        setOutput(null);
        
        try {
            let result;
            if (appSettings.mode === 'local') {
                result = await localAnalyzeScript(inputScript);
            } else {
                if (!appSettings.apiKey) throw new Error("API Key is missing. Please set it in Settings.");
                result = await aiAnalyzeScript(inputScript, appSettings.apiKey, appSettings.deobfuscatorModel);
            }
            setOutput(result);
        } catch (error: any) {
            setOutput({ error: `Analysis Failed: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const renderOutput = () => {
        if (isLoading) return <Loader />;
        if (output) {
            if ('error' in output) return <AnalysisOutput output={output} isLoading={false} />;
            return <AnalysisReport result={output} />;
        }
        return <AnalysisOutput output="" isLoading={false} />;
    };

    const WarningDialog = () => (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg z-10">
            <div className="bg-brand-surface p-6 rounded-lg shadow-lg border border-yellow-500 max-w-sm text-center">
                <h4 className="font-bold text-lg text-brand-text">Compatibility Warning</h4>
                <p className="text-sm text-brand-text-light my-3">
                    This model is not optimized for analysis and may produce poor results or fail. For best results, please select a model from the "Deobfuscator Model" list in the settings.
                </p>
                <div className="flex justify-center space-x-4">
                    <button onClick={() => setShowWarning(false)} className="px-6 py-2 bg-brand-border text-brand-text font-semibold rounded-lg hover:bg-gray-600">
                        Cancel
                    </button>
                    <button onClick={() => handleDeobfuscate(true)} className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:opacity-90">
                        Continue Anyway
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 relative">
            {showWarning && <WarningDialog />}
            <ScriptInput 
                value={inputScript}
                onChange={setInputScript}
                onProcess={() => handleDeobfuscate()}
                isLoading={isLoading}
                mode="deobfuscate"
            />
            {renderOutput()}
        </div>
    );
};

export default Deobfuscator;
