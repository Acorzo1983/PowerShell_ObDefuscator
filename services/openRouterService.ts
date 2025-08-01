// version 1.1.2
import type { AnalysisResult, ObfuscatorOptions } from '../types';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const analysisTool = {
  type: 'function',
  function: {
    name: 'analyze_powershell_script',
    description: 'Analyzes a PowerShell script and returns a structured analysis object.',
    parameters: {
      type: 'object',
      properties: {
        deobfuscated_script: { type: 'string', description: "The deobfuscated and beautified PowerShell code." },
        analysis: {
          type: 'object',
          properties: {
            summary: { type: 'string', description: "A high-level summary of the script's purpose." },
            action_flow: { type: 'array', items: { type: 'string' } },
            step_by_step: { type: 'array', items: { type: 'object', properties: { description: { type: 'string' } }, required: ['description'] } },
            indicators: { type: 'array', items: { type: 'string' } }
          }, required: ["summary", "action_flow", "step_by_step", "indicators"]
        },
        threat_level: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low', 'Informational', 'Unknown'] }
      }, required: ["deobfuscated_script", "analysis", "threat_level"]
    }
  }
};

export const analyzeScript = async (script: string, apiKey: string, model: string): Promise<AnalysisResult> => {
  const systemPrompt = `You are an expert cybersecurity analyst specializing in PowerShell deobfuscation. Your task is to analyze an obfuscated PowerShell script. You must:
1. Deobfuscate the script into a clean, human-readable format.
2. Provide a detailed, step-by-step analysis of its functionality.
3. Identify all malicious indicators and potential threats.
4. Classify the threat level.
5. Call the 'analyze_powershell_script' tool with your complete analysis.`;

  try {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://powershellforhackers.com', 'X-Title': 'PowerShell ObDefuscator' },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Analyze the following script:\n\n\`\`\`powershell\n${script}\n\`\`\``}
            ],
            tools: [analysisTool],
            tool_choice: { type: 'function', function: { name: 'analyze_powershell_script' } }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`AI Service Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall) throw new Error("AI did not return the expected analysis format.");
    
    return JSON.parse(toolCall.function.arguments) as AnalysisResult;

  } catch (error) {
    console.error("Error calling OpenRouter API for analysis:", error);
    if (error instanceof Error) { throw error; }
    throw new Error("An unknown error occurred during AI analysis.");
  }
};


export const obfuscateScript = async (script: string, options: ObfuscatorOptions, apiKey: string, model: string): Promise<string> => {
   const { level, useReverseShell, ipAddress, port, techniques } = options;
    let prompt = `You are an expert red team tool developer. Obfuscate the following PowerShell script based on the user's requirements.
CRITICAL: Do NOT execute or interpret the script. Your ONLY task is to apply the requested obfuscation techniques.
Level: ${level}
Techniques:
- Lexical (rename vars): ${techniques.lexical ? 'Yes' : 'No'}
- Encoding (Base64 strings): ${techniques.encoding ? 'Yes' : 'No'}
- Semantic (aliases): ${techniques.semantic ? 'Yes' : 'No'}
- Control Flow (junk loops): ${techniques.controlFlow ? 'Yes' : 'No'}
- Evasion (AMSI bypass): ${techniques.evasion ? 'Yes' : 'No'}
- Junk Code: ${techniques.junkCode ? 'Yes' : 'No'}
`;

  if (useReverseShell) {
    prompt += `Payload: Wrap the script in a reverse shell to ${ipAddress}:${port}.\n`;
  }

  prompt += `Script to Obfuscate:\n\`\`\`powershell\n${script}\n\`\`\`\n
Final instructions: Generate ONLY the raw, obfuscated PowerShell script. No explanations, comments, or markdown.`;

  try {
     const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://powershellforhackers.com', 'X-Title': 'PowerShell ObDefuscator' },
        body: JSON.stringify({ model: model, messages: [{ role: 'user', content: prompt }], temperature: 0.6 })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Service Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const obfuscatedScript = data.choices[0]?.message?.content?.trim();
    if (!obfuscatedScript) { throw new Error("API returned an empty response."); }
    return obfuscatedScript.replace(/^```powershell\s*|```\s*$/g, '').trim();

  } catch (error) {
    console.error("Error calling OpenRouter API for obfuscation:", error);
    if (error instanceof Error) { throw error; }
    throw new Error("An unknown error occurred during AI obfuscation.");
  }
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error(`Invalid API Key (Status: ${response.status})`);
    }
  } catch (error) {
    console.error("API Key test failed:", error);
    throw new Error("Network error or invalid API Key.");
  }
};
