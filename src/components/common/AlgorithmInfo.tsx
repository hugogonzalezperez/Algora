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

export const AlgorithmInfo = memo(({ title, description, characteristics, applications, pseudocode, commonErrors }: AlgorithmInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="heading-1 mb-4 text-2xl">{title}</h2>
        <div className="w-full h-[2px] bg-carbon" />
      </div>
      <p className="text-[14px] leading-relaxed whitespace-pre-line text-justify text-carbon/90 font-mono tracking-tight">
        {description}
      </p>
      {characteristics.length > 0 && applications.length > 0 && (
        <div className="info-grid mt-2">
          <div className="card-box p-4">
            <h3 className="heading-2 text-[17px]">Characteristics</h3>
            <ul className="list-disc list-inside space-y-1 text-[14px] text-carbon/80 font-mono mt-2">
              {characteristics.slice(0, 4).map((char) => (
                <li key={char} className="leading-tight">{char}</li>
              ))}
            </ul>
          </div>
          <div className="card-box p-4">
            <h3 className="heading-2 text-[17px]">Applications</h3>
            <ul className="list-disc list-inside space-y-1 text-[14px] text-carbon/80 font-mono mt-2">
              {applications.slice(0, 4).map((app) => (
                <li key={app} className="leading-tight">{app}</li>
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
        </div>
      )}
      
      {commonErrors && commonErrors.length > 0 && (
        <div className="card-box p-4 mt-2">
          <h3 className="heading-2 text-[17px] text-carbon">Common Errors</h3>
          <ul className="space-y-2 mt-3">
            {commonErrors.map((err) => (
              <li key={err.name} className="flex items-start gap-4">
                <div className="shrink-0 pt-0.5">
                  <span className="font-black text-[11px] uppercase tracking-wider text-carbon bg-sepia border border-carbon/20 px-2 py-1 rounded shadow-sm min-w-[130px] block text-center">
                    {err.name}
                  </span>
                </div>
                <span className="text-carbon/80 font-mono text-[14px] leading-relaxed pt-0.5">{err.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
