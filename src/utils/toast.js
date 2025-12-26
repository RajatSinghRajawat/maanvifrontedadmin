import { notification } from 'antd';

export const toast = {
  success: (message, description = '') => {
    notification.success({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  },
  error: (message, description = '') => {
    notification.error({
      message,
      description,
      placement: 'topRight',
      duration: 4,
    });
  },
  warning: (message, description = '') => {
    notification.warning({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  },
  info: (message, description = '') => {
    notification.info({
      message,
      description,
      placement: 'topRight',
      duration: 3,
    });
  },
};


