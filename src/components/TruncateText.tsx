import React from 'react';

interface TruncateTextProps {
  message: React.ReactNode;
  maxLength?: number;
}

export const TruncateText: React.FC<TruncateTextProps> = ({
  message,
  maxLength = 100,
}) => {
  if (!message) return null;

  if (typeof message !== 'string') {
    return <>{message}</>;
  }

  if (message.length <= maxLength) {
    return <>{message}</>;
  }

  return <span title={message}>{message.substring(0, maxLength)}...</span>;
};
