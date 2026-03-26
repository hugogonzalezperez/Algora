import { memo } from 'react';

interface AlgorithmInfoProps {
  title: string;
  description: React.ReactNode;
  characteristics: string[];
  applications: string[];
  pseudocode?: string;
  pseudocodeLegend?: Record<string, string>;
  commonErrors?: { name: string, description: string }[];
}

export const AlgorithmInfo = memo(({ title, description, characteristics, applications, pseudocode, pseudocodeLegend, commonErrors }: AlgorithmInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="heading-1 mb-4">{title}</h2>
        <div className="w-full h-[2px] bg-carbon" />
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line text-justify text-carbon/90 font-mono tracking-tight">
        {description}
      </p>
      {characteristics.length > 0 && applications.length > 0 && (
        <div className="info-grid mt-2">
          <div className="card-box p-4">
            <h3 className="heading-2 text-base">Characteristics</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-carbon/80 font-mono mt-2">
              {characteristics.map((char) => (
                <li key={char}>{char}</li>
              ))}
            </ul>
          </div>
          <div className="card-box p-4">
            <h3 className="heading-2 text-base">Applications</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-carbon/80 font-mono mt-2">
              {applications.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {pseudocode && (
        <div className="card-box p-4">
          <h3 className="heading-2 text-base mb-2">Pseudocode</h3>
          <pre className="bg-carbon text-crema p-3 overflow-x-auto text-[13px] font-mono border border-carbon tracking-tight leading-relaxed shadow-sm">
            <code>{pseudocode}</code>
          </pre>
          
          {pseudocodeLegend && Object.keys(pseudocodeLegend).length > 0 && (
            <div className="mt-4 pt-4 border-t border-carbon/20">
              <h4 className="text-sm font-bold text-carbon mb-2 uppercase tracking-wider">Variable Legend:</h4>
              <ul className="text-sm space-y-1.5 text-carbon/80 font-mono text-justify">
                {Object.entries(pseudocodeLegend).map(([variable, explanation]) => (
                  <li key={variable}>
                    <strong className="text-carbon">{variable}</strong>: {explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {commonErrors && commonErrors.length > 0 && (
        <div className="card-box p-4 mt-2">
          <h3 className="heading-2 text-base text-error">Common Errors</h3>
          <ul className="space-y-2 mt-3">
            {commonErrors.map((err) => (
              <li key={err.name} className="text-[13px] leading-snug">
                <span className="font-black text-[11px] uppercase tracking-wider text-error bg-error/10 px-1.5 py-0.5 rounded border border-error/20 mr-2">{err.name}</span>
                <span className="text-carbon/80 font-mono">{err.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
