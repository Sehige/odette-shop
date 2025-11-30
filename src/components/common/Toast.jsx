import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500'
    }
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 pr-12 max-w-md`}>
        <div className="flex items-center gap-3">
          <Icon className={`${style.iconColor} flex-shrink-0`} size={24} />
          <p className={`${style.text} text-sm font-medium`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 ${style.text} hover:opacity-70 transition`}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
