import React, { useMemo, useState } from 'react';

// Retro code viewer card with tab-style header, line numbers, and copy button.
// Props:
// - title: string (tab title)
// - language: string (footer label)
// - code: string (source code to display)
// - className: optional extra class names
export default function CodeCard({ title = 'Snippet', language = 'Text', code = '', className = '' }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => (code ? code.replace(/\r\n/g, '\n').split('\n') : []), [code]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className={`border border-ink bg-paper ${className}`}>
      {/* Header with faux tab */}
      <div className="border-b border-ink bg-ink text-paper px-2 py-1">
        <div className="inline-flex items-center gap-2">
          <div className="px-2 py-0.5 bg-paper text-ink border border-ink font-mono text-xs select-none">
            {title}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex text-ink bg-white m-2 border border-ink overflow-auto" style={{ maxHeight: 260 }}>
        {/* Line numbers */}
        <div className="bg-paper border-r border-ink text-muted text-xs font-mono py-2 px-2 select-none sticky left-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-4 h-4 text-right">
              {i + 1}
            </div>
          ))}
        </div>
        {/* Code */}
        <pre className="font-mono text-[12px] leading-4 py-2 px-3 whitespace-pre">
{code}
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-ink bg-paper px-2 py-1">
        <span className="font-mono text-xs text-ink/90">{language}</span>
        <button onClick={onCopy} className="font-mono text-xs px-2 py-0.5 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
