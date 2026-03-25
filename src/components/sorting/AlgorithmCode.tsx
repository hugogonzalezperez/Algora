
import React from 'react';

interface AlgorithmCodeProps {
  code: string[];
  activeLine: number;
}

export const AlgorithmCode: React.FC<AlgorithmCodeProps> = ({ code, activeLine }) => {
  // Dynamically scale down font and padding to fit long algorithms without scrolling
  let fontSize = 'text-[15px]';
  let lineHeight = 'leading-relaxed';
  let paddingY = 'py-0.5';

  if (code.length > 25) {
    fontSize = 'text-[13px]';
    lineHeight = 'leading-tight';
    paddingY = 'py-0';
  } else if (code.length >= 15) {
    fontSize = 'text-[15px]';
    lineHeight = 'leading-tight';
    paddingY = 'py-[1px]';
  }

  return (
    <div className={`font-mono ${fontSize} ${lineHeight} select-none py-1`}>
      <div className="flex flex-col">
        {code.map((line, idx) => (
          <div
            key={idx}
            className={`px-4 ${paddingY} transition-all duration-75 ${
              activeLine === idx 
                ? 'bg-sepia text-carbon font-bold' 
                : 'text-crema/60'
            }`}
          >
            <span className="whitespace-pre">
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
