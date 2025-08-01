// version 1.0.1
export interface Model {
    id: string;
    name: string;
    isFree: boolean;
    supportsAnalysis: boolean;
}

export interface AppSettings {
    mode: 'local' | 'ai';
    apiKey: string;
    obfuscatorModel: string;
    deobfuscatorModel: string;
    persistKey: boolean;
}

export interface ObfuscatorOptions {
    level: 'Low' | 'Medium' | 'High' | 'Insane';
    useReverseShell: boolean;
    ipAddress: string;
    port: string;
    techniques: {
        lexical: boolean;
        encoding: boolean;
        semantic: boolean;
        controlFlow: boolean;
        evasion: boolean;
        junkCode: boolean;
    };
}

export interface AnalysisResult {
    deobfuscated_script: string;
    analysis: {
        summary: string;
        step_by_step: { description: string; line_numbers?: number[] }[];
        indicators: string[];
        action_flow: string[];
    };
    threat_level: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational' | 'Unknown' | string;
}
