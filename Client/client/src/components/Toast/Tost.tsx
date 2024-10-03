// Notification.tsx
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`fixed top-4 right-4 p-4 text-white rounded ${bgColor}`}>
      {message}
    </div>
  );
};

export default Notification;
