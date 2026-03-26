import type { AlgorithmMetadata } from '../algorithms/solvers';
import { AlgorithmCode } from '../../sorting/components/AlgorithmCode'; // Reusing code component

interface PathfindingAlgorithmInfoProps {
  metadata: AlgorithmMetadata;
}

export const PathfindingAlgorithmInfo = ({ metadata }: PathfindingAlgorithmInfoProps) => {
  if (!metadata) return null;

  return (
    <div className="p-8 space-y-10">
      <section className="space-y-4">
        <header className="border-b border-carbon/10 pb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter text-carbon">{metadata.name}</h2>
        </header>
        <p className="text-sm text-carbon/70 leading-relaxed font-medium">
          {metadata.description}
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-carbon/40">Technical Characteristics</h3>
        <div className="space-y-4">
          {metadata.characteristics.map((char, index) => (
            <div key={index} className="flex gap-4 group">
              <span className="text-[10px] font-black text-carbon/20 mt-1">0{index + 1}</span>
              <p className="text-xs font-bold text-carbon/80 leading-snug group-hover:text-carbon transition-colors">
                {char}
              </p>
            </div>
          ))}
        </div>
      </section>

      {metadata.pseudocode && (
        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-carbon/40">Logic Visualization (Pseudocode)</h3>
          <div className="bg-carbon p-6 shadow-2xl">
            <AlgorithmCode code={metadata.pseudocode.split('\n')} activeLine={-1} />
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-carbon/40">Common Applications</h3>
        <div className="grid grid-cols-1 gap-3">
          {metadata.applications.map((app, index) => (
            <div key={index} className="px-4 py-3 bg-white border border-carbon/10 text-[10px] font-black uppercase tracking-wider text-carbon shadow-sm">
              {app}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
PathfindingAlgorithmInfo.displayName = 'PathfindingAlgorithmInfo';
