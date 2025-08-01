// version 0.1.3 - Footer
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 text-center border-t border-brand-border mt-12">
      <div className="mb-4">
        <p className="text-xs text-brand-text-light max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> This tool is created for educational and learning purposes only. The creators take no responsibility for any malicious use of this tool or its output. Always ensure you have explicit, authorized permission before executing any scripts on a target system.
        </p>
      </div>
      <p className="text-sm text-brand-text-light">
        Created with{' '}
        <span role="img" aria-label="love" className="text-brand-secondary">
          ❤️
        </span>{' '}
        by{' '}
        <a
          href="https://x.com/I_Am_Jakoby"
          target="_blank"
          rel="noopener noreferrer"
          // --- CAMBIO PRINCIPAL AQUÍ ---
          className="font-semibold text-brand-secondary hover:opacity-80 transition-opacity"
        >
          @I_Am_Jakoby
        </a>{' '}
        &{' '}
        <a
          href="https://x.com/yz9yt"
          target="_blank"
          rel="noopener noreferrer"
          // --- CAMBIO PRINCIPAL AQUÍ ---
          className="font-semibold text-brand-secondary hover:opacity-80 transition-opacity"
        >
          @yz9yt
        </a>
      </p>
    </footer>
  );
};

export default Footer;
