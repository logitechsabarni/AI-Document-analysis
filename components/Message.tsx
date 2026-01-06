import React from 'react';
import { Message as MessageType, MessageRole } from '../types';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const messageClasses = isUser
    ? 'bg-primary text-white self-end rounded-bl-xl rounded-tr-xl'
    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start rounded-br-xl rounded-tl-xl';
  const avatarClasses = isUser
    ? 'order-2 ml-2'
    : 'order-1 mr-2';

  return (
    <div className={`flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent text-white font-bold ${avatarClasses}`}>
          AI
        </div>
      )}
      <div className={`p-3 max-w-[70%] shadow-md ${messageClasses}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      {isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-500 text-white font-bold ${avatarClasses}`}>
          You
        </div>
      )}
    </div>
  );
};

export default Message;