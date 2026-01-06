import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ContextPanel from './components/ContextPanel';
import SuggestedPrompts from './components/SuggestedPrompts';
import {
  User,
  Conversation,
  Message,
  MessageRole,
  Goal,
} from './types';
// Import MOCK_USER_ID, MOCK_USER_NAME, MOCK_USER_EMAIL from constants.ts where they are defined
import {
  MOCK_USER_ID,
  MOCK_USER_NAME,
  MOCK_USER_EMAIL,
  SUGGESTED_PROMPTS
} from './constants';
import {
  fetchChatResponse,
  fetchHistory,
  fetchContext,
  createNewConversation,
  updateConversationTitleApi,
  updateGoalApi,
} from './services/apiService';

// Mock Auth Context for demonstration
const mockUser: User = {
  id: MOCK_USER_ID,
  name: MOCK_USER_NAME,
  email: MOCK_USER_EMAIL,
};

const App: React.FC = () => {
  const [user] = useState<User | null>(mockUser); // Simulate logged-in user
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadInitialData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const historyRes = await fetchHistory(user.id);
      setConversations(historyRes.conversations);
      if (historyRes.conversations.length > 0) {
        // Load the most recent conversation if available
        const mostRecent = historyRes.conversations.reduce((prev, current) =>
          new Date(prev.updatedAt) > new Date(current.updatedAt) ? prev : current
        );
        setActiveConversation(mostRecent);
      } else {
        setActiveConversation(null);
      }

      const contextRes = await fetchContext(user.id);
      setActiveGoal(contextRes.activeGoal || null);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      // Handle error gracefully in UI
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const addMessage = useCallback((message: Message) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === message.conversationId
          ? { ...conv, messages: [...conv.messages, message], updatedAt: new Date().toISOString() }
          : conv
      )
    );
    setActiveConversation((prev) =>
      prev?.id === message.conversationId
        ? { ...prev, messages: [...prev.messages, message], updatedAt: new Date().toISOString() }
        : prev
    );
  }, []);

  const updateConversationTitle = useCallback((conversationId: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() } : conv
      )
    );
    setActiveConversation((prev) =>
      prev?.id === conversationId
        ? { ...prev, title: newTitle, updatedAt: new Date().toISOString() }
        : prev
    );
    // Optionally call backend to persist
    updateConversationTitleApi(conversationId, newTitle).catch(console.error);
  }, []);

  const updateGoal = useCallback((goal: Goal) => {
    setActiveGoal(goal);
    // Call backend to persist
    updateGoalApi(goal).catch(console.error); // Pass the entire goal object
  }, []);

  const simulateChatResponse = useCallback(
    async (conversationId: string, userMessage: string, isInitial: boolean = false) => {
      if (!user) return;

      setIsLoading(true);
      const currentUserMessage: Message = {
        id: `msg-${conversationId}-${Date.now()}-user`,
        conversationId: conversationId,
        role: MessageRole.USER,
        content: userMessage,
        timestamp: new Date().toISOString(),
      };

      addMessage(currentUserMessage);

      try {
        const response = await fetchChatResponse(
          user.id, // Pass userId
          conversationId,
          userMessage,
          activeConversation?.messages || [],
          activeGoal || undefined
        );

        addMessage(response.message);

        if (response.contextUpdate) {
          updateGoal(response.contextUpdate);
        }

        // If it's the first message and the conversation title is still generic, update it
        if (isInitial && activeConversation?.title.startsWith('New Chat -')) {
          const suggestedTitle = userMessage.substring(0, 30);
          updateConversationTitle(conversationId, suggestedTitle);
        }
      } catch (error) {
        console.error('Error fetching chat response:', error);
        // Add an error message to the chat
        addMessage({
          id: `msg-${conversationId}-${Date.now()}-error`,
          conversationId: conversationId,
          role: MessageRole.ASSISTANT,
          content: 'Oops! Something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, activeConversation, activeGoal, addMessage, updateConversationTitle, updateGoal]
  );

  const handleNewConversation = useCallback(
    async (initialMessage: string = '') => {
      if (!user) return;
      setIsLoading(true);
      try {
        const newConv = await createNewConversation(user.id, initialMessage);
        setConversations((prev) => [...prev, newConv]);
        setActiveConversation(newConv);
        // If there was no initial message, the backend will provide a welcome message.
        // If there was an initial message, simulateChatResponse will send it and add AI's response.
        if (initialMessage) {
          await simulateChatResponse(newConv.id, initialMessage, true);
        }
      } catch (error) {
        console.error('Failed to create new conversation:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [user, simulateChatResponse]
  );

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!user) return;

      if (!activeConversation) {
        // If no active conversation, create a new one with this message
        await handleNewConversation(message);
      } else {
        await simulateChatResponse(activeConversation.id, message);
      }
    },
    [user, activeConversation, handleNewConversation, simulateChatResponse]
  );

  const handleSelectConversation = useCallback(
    (conversationId: string | null) => {
      if (!conversationId) {
        setActiveConversation(null);
        return;
      }
      const selected = conversations.find((conv) => conv.id === conversationId);
      if (selected) {
        setActiveConversation(selected);
      }
    },
    [conversations]
  );

  const handlePromptSelect = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  return (
    <div className="flex h-full bg-gray-100 dark:bg-dark-blue-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        user={user}
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={handleSelectConversation}
        onNewChat={() => handleNewConversation()}
        isLoading={isLoading}
      />
      <main className="flex flex-col flex-1 h-full ml-0 md:ml-80 mr-0 lg:mr-80">
        <div className="flex-1 overflow-y-auto flex flex-col p-4 md:p-6 mb-20"> {/* Add margin-bottom for fixed input */}
          <ChatWindow conversation={activeConversation} isLoading={isLoading} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-20 w-full md:pl-80 lg:pr-80">
          <SuggestedPrompts
            prompts={SUGGESTED_PROMPTS}
            onPromptSelect={handlePromptSelect}
            isLoading={isLoading}
          />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
      <ContextPanel
        activeGoal={activeGoal}
        onUpdateGoal={updateGoal}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;