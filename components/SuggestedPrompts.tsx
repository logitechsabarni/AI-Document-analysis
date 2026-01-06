import React from 'react';
import { SuggestedPrompt } from '../types';
import Button from './Button';

interface SuggestedPromptsProps {
  prompts: SuggestedPrompt[];
  onPromptSelect: (prompt: string) => void;
  isLoading: boolean;
}

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ prompts, onPromptSelect, isLoading }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 justify-center md:justify-start">
      {prompts.map((prompt) => (
        <Button
          key={prompt.id}
          variant="outline"
          size="sm"
          onClick={() => onPromptSelect(prompt.text)}
          disabled={isLoading}
          className="flex items-center space-x-1 whitespace-nowrap"
        >
          {prompt.icon && <span className="text-lg">{prompt.icon}</span>}
          <span>{prompt.text}</span>
        </Button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;