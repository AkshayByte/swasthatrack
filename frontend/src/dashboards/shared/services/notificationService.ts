import { toast } from 'sonner';

export interface NotificationConfig {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  show(config: NotificationConfig) {
    const { title, description, type = 'info', duration = 5000, action } = config;

    switch (type) {
      case 'success':
        toast.success(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
      case 'error':
        toast.error(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
      case 'warning':
        toast.warning(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
        break;
      default:
        toast.info(title, {
          description,
          duration,
          action: action ? {
            label: action.label,
            onClick: action.onClick,
          } : undefined,
        });
    }
  }

  success(title: string, description?: string) {
    this.show({ title, description, type: 'success' });
  }

  error(title: string, description?: string) {
    this.show({ title, description, type: 'error' });
  }

  warning(title: string, description?: string) {
    this.show({ title, description, type: 'warning' });
  }

  info(title: string, description?: string) {
    this.show({ title, description, type: 'info' });
  }
}

export const notificationService = new NotificationService();
export default notificationService;

