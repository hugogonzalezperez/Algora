import { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — no blur, just a light dimming */}
      <div
        className="absolute inset-0 bg-carbon/20 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content — no outer box, children bring their own border */}
      <div className="relative max-w-lg w-full">
        {children}
      </div>
    </div>
  );
};
