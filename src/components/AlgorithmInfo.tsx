import { memo } from 'react';

interface AlgorithmInfoProps {
  title: string;
  description: React.ReactNode;
  characteristics: string[];
  applications: string[];
  pseudocode?: string;
  pseudocodeLegend?: Record<string, string>;
}

export const AlgorithmInfo = memo(({ title, description, characteristics, applications, pseudocode, pseudocodeLegend }: AlgorithmInfoProps) => {
  return (
    <div className="space-y-6">
      <h2 className="heading-1">{title}</h2>
      <p className="text-body whitespace-pre-line text-justify">
        {description}
      </p>
      {characteristics.length > 0 && applications.length > 0 && (
        <div className="info-grid">
          <div className="card-box">
            <h3 className="heading-2">Characteristics</h3>
            <ul className="list-bullets">
              {characteristics.map((char) => (
                <li key={char}>{char}</li>
              ))}
            </ul>
          </div>
          <div className="card-box">
            <h3 className="heading-2">Applications</h3>
            <ul className="list-bullets">
              {applications.map((app) => (
                <li key={app}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {pseudocode && (
        <div className="card-box pt-4">
          <h3 className="heading-2">Pseudocode</h3>
          <pre className="bg-carbon text-crema p-4 overflow-x-auto text-sm font-mono border border-carbon tracking-tight leading-relaxed shadow-sm">
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
    </div>
  );
});
