// version 1.0.0 - Final
import React, { useState, useEffect, useRef } from 'react';

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="bg-brand-bg text-brand-primary font-mono text-sm px-1.5 py-1 rounded-md">{children}</code>
);

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
    <div id={id} className="mb-12 scroll-mt-24">
        <h3 className="text-2xl font-bold text-brand-primary mb-4 border-b border-brand-border pb-2">{title}</h3>
        <div className="space-y-4 text-brand-text-light leading-relaxed text-base">
            {children}
        </div>
    </div>
);

const NavLink: React.FC<{ href: string; children: React.ReactNode; active: boolean; onClick: () => void }> = ({ href, children, active, onClick }) => (
    <a 
      href={href} 
      onClick={(e) => { e.preventDefault(); onClick(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-brand-bg hover:text-white'}`}
    >
        {children}
    </a>
);

const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'concepts', title: 'Core Concepts' },
    { id: 'modes', title: 'Local vs. AI Mode' },
    { id: 'configuration', title: 'Configuration' },
    { id: 'obfuscator', title: 'The Obfuscator' },
    { id: 'deobfuscator', title: 'The Deobfuscator' },
    { id: 'usecase', title: 'Practical Use Case' },
];

const Documentation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState('introduction');
    const [isScrollButtonVisible, setScrollButtonVisible] = useState(false);
    const scrollableContentRef = useRef<HTMLElement>(null);

    const handleScroll = () => {
        if (scrollableContentRef.current) {
            setScrollButtonVisible(scrollableContentRef.current.scrollTop > 300);
        }
    };

    const scrollToTop = () => {
        scrollableContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const contentElement = scrollableContentRef.current;
        contentElement?.addEventListener('scroll', handleScroll);
        return () => contentElement?.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-brand-surface rounded-lg border border-brand-border shadow-lg text-brand-text relative">
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                aria-label="Close Documentation"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="md:grid md:grid-cols-12">
                <aside className="md:col-span-3 lg:col-span-2 md:sticky md:top-0 p-6 border-r border-brand-border" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                     <h2 className="text-xl font-bold text-white mb-6">Documentation</h2>
                     <nav className="space-y-2">
                         {sections.map(section => (
                             <NavLink key={section.id} href={`#${section.id}`} active={activeSection === section.id} onClick={() => setActiveSection(section.id)}>
                                 {section.title}
                             </NavLink>
                         ))}
                     </nav>
                </aside>
                
                <main ref={scrollableContentRef} className="md:col-span-9 lg:col-span-10 p-8 md:p-12 overflow-y-auto" style={{maxHeight: '90vh'}}>
                    <Section id="introduction" title="Introduction">
                        <p>PowerShell ObDefuscator is a dual-purpose cybersecurity tool for penetration testers, red teamers, security researchers, and blue teamers. It provides an advanced <Code>Obfuscator</Code> to make legitimate scripts evasive and a powerful <Code>Deobfuscator</Code> to analyze and understand potentially malicious scripts.</p>
                    </Section>

                    <Section id="concepts" title="Core Concepts: The Art of Obfuscation">
                        <p>Obfuscation is the process of making code difficult for humans and automated security tools to understand, without changing its functionality. The goal is to bypass defenses like antivirus software and EDRs.</p>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li><strong>Lexical:</strong> Changes the appearance. Renaming <Code>$processToKill</Code> to <Code>$a_8fx2</Code> or splitting strings like <Code>"Invoke-" + "Expression"</Code>.</li>
                            <li><strong>Encoding:</strong> Hides code by representing it differently. The most common is Base64, but Hex, XOR, and others are also used.</li>
                            <li><strong>Semantic:</strong> Changes the commands used. Replacing <Code>Invoke-Expression</Code> with its alias <Code>IEX</Code>, or using .NET methods like <Code>[System.Diagnostics.Process]::Start()</Code> instead of the <Code>Start-Process</Code> cmdlet.</li>
                        </ul>
                    </Section>
                    
                    <Section id="modes" title="Local vs. AI Mode">
                        <p>The tool operates in two distinct modes, providing flexibility for different use cases and environments.</p>
                    </Section>

                    <Section id="configuration" title="Configuration">
                         <p>Configuration is handled entirely within the application by clicking the gear icon (⚙️). In AI Mode, you must provide a valid API key from OpenRouter to unlock the advanced models.</p>
                    </Section>

                    <Section id="obfuscator" title="The Obfuscator">
                        <p>The Obfuscator transforms your clean PowerShell scripts into difficult-to-analyze code. You have granular control over the process.</p>
                    </Section>

                    <Section id="deobfuscator" title="The Deobfuscator">
                        <p>The Deobfuscator is your analysis engine. It provides a detailed report to quickly understand what a suspicious script does.</p>
                    </Section>

                    <Section id="usecase" title="Practical Use Case">
                        <p className="font-bold">Scenario: A Red Teamer needs to run a reconnaissance script on a target, but the target has a modern EDR that blocks common PowerShell commands.</p>
                        <ol className="list-decimal list-inside space-y-2 mt-4">
                            <li><strong>Original Script:</strong> The Red Teamer starts with a simple script: <Code>Get-NetIPAddress | findstr IPv4</Code>.</li>
                            <li><strong>Obfuscation:</strong> They paste this into the Obfuscator, select <Code>AI Mode</Code>, level <Code>High</Code>. The AI might rewrite the script to use .NET methods, encode the string "IPv4" in Base64, and rename all variables.</li>
                            <li><strong>Blue Team Analysis:</strong> A Blue Teamer later finds this script. They paste it into the Deobfuscator. The Analysis Report immediately provides a summary ("This script enumerates IP addresses") and shows the deobfuscated code.</li>
                        </ol>
                    </Section>
                </main>
            </div>
            
            <button
                onClick={scrollToTop}
                className={`absolute bottom-8 right-8 bg-brand-secondary text-white p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-300 ${isScrollButtonVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Go to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Documentation;
