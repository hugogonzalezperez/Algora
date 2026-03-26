import { memo } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface UnderlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const UnderlineButton = memo(({ label, ...props }: UnderlineButtonProps) => (
  <button 
    {...props} 
    className="btn-outline relative group transition-all disabled:opacity-20 disabled:cursor-default"
  >
    {label}
    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-carbon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
  </button>
));
