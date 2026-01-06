import React from 'react';
import { Conversation, User } from '../types';
import Button from './Button';

interface SidebarProps {
  user: User | null;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversationId: string | null) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  conversations,
  activeConversation,
  onSelectConversation,
  onNewChat,
  isLoading,
}) => {
  return (
    <div className="hidden md:flex flex-col w-80 bg-gray-50 dark:bg-dark-blue-800 border-r border-gray-200 dark:border-gray-700 p-4 h-full fixed left-0 top-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Conversations</h2>
        <Button variant="primary" onClick={onNewChat} disabled={isLoading} className="text-sm py-1 px-3">
          + New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {conversations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No conversations yet.</p>
        ) : (
          <ul>
            {conversations.map((conv) => (
              <li key={conv.id} className="mb-2">
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className={`block w-full text-left p-3 rounded-lg transition-colors duration-200
                    ${activeConversation?.id === conv.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100'
                    }`}
                  disabled={isLoading}
                >
                  <h3 className="font-semibold text-sm truncate">{conv.title}</h3>
                  <p className={`text-xs mt-1 ${activeConversation?.id === conv.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-300'}`}>
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-primary dark:text-blue-200 font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Please log in.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;