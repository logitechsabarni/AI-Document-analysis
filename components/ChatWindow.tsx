import React, { useEffect, useRef } from 'react';
import { Conversation } from '../types';
import Message from './Message';

interface ChatWindowProps {
  conversation: Conversation | null;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]); // Scroll when new messages arrive

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Start a new conversation or select one from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {conversation.messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p className="text-xl font-semibold mb-2">Welcome to your AI Assistant!</p>
          <p className="text-center">Ask me anything related to your goals or learning path.</p>
        </div>
      ) : (
        conversation.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}
      {isLoading && (
        <div className="flex items-start mb-4 justify-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-accent text-white font-bold mr-2">
            AI
          </div>
          <div className="p-3 max-w-[70%] bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-br-xl rounded-tl-xl shadow-md">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce-slow" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;