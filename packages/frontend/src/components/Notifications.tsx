import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

const notifications: Notification[] = [];
const listeners: Array<(notifications: Notification[]) => void> = [];

export const notify = {
  success: (message: string, duration = 3000) => {
    addNotification({ type: 'success', message, duration });
  },
  error: (message: string, duration = 5000) => {
    addNotification({ type: 'error', message, duration });
  },
  info: (message: string, duration = 3000) => {
    addNotification({ type: 'info', message, duration });
  },
  warning: (message: string, duration = 4000) => {
    addNotification({ type: 'warning', message, duration });
  },
};

function addNotification(notification: Omit<Notification, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9);
  const newNotification = { ...notification, id };
  notifications.push(newNotification);
  notifyListeners();

  if (notification.duration) {
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration);
  }
}

function removeNotification(id: string) {
  const index = notifications.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.splice(index, 1);
    notifyListeners();
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener([...notifications]));
}

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    listeners.push(setItems);
    return () => {
      const index = listeners.indexOf(setItems);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2">
      {items.map((notification) => (
        <div
          key={notification.id}
          className={`${getColors(
            notification.type
          )} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
        >
          {getIcon(notification.type)}
          <span className="flex-1 text-sm">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="hover:bg-white/20 rounded p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
