import { memo } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

const variantIcons = {
  info: Info,
  warning: AlertCircle,
  error: XCircle,
  success: CheckCircle,
};

export const Alert = memo(({
  variant = 'info',
  title,
  description,
  onClose,
  className = '',
}: AlertProps) => {
  const Icon = variantIcons[variant];

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <Icon className="alert-icon" />
      <div className="flex-1">
        {title && <span className="alert-title">{title}</span>}
        {description && <p className="alert-description">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-0.5 hover:opacity-70 transition-opacity p-0.5"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';
