import React, { useState } from 'react';
import Button from './Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700 flex items-center fixed bottom-0 left-0 right-0 z-10 w-full md:pl-80 md:pr-80">
      <textarea
        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100 resize-none max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
        rows={1}
        disabled={isLoading}
      />
      <Button
        type="submit"
        className="ml-3 px-6 py-2"
        disabled={!input.trim() || isLoading}
      >
        Send
      </Button>
    </form>
  );
};

export default ChatInput;