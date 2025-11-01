
import React from 'react';

interface MessageDisplayProps {
  message: string | null;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-black bg-opacity-70 text-white text-center p-4 rounded-lg shadow-lg z-30 animate-[fade-in-out_4s_ease-in-out]">
      <p className="text-xl italic">{message}</p>
    </div>
  );
};

export default MessageDisplay;
