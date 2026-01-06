import { ChatResponse, ContextResponse, Conversation, Goal, HistoryResponse, Message, MessageRole, GoalStatus } from '../types';
// Import MOCK_USER_ID from constants.ts where it is defined
import { MOCK_USER_ID } from '../constants';

// Utility function to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    userId: MOCK_USER_ID,
    title: 'Learning React Basics',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    messages: [
      {
        id: 'msg-1-1',
        conversationId: 'conv-1',
        role: MessageRole.USER,
        content: 'I want to learn React. Where should I start?',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'msg-1-2',
        conversationId: 'conv-1',
        role: MessageRole.ASSISTANT,
        content: 'Great! To start with React, you should first understand JavaScript fundamentals, especially ES6 features like arrow functions, destructuring, and `const`/`let`. Then, dive into React\'s core concepts: components, props, state, and hooks. Would you like a roadmap?',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
    ],
  },
  {
    id: 'conv-2',
    userId: MOCK_USER_ID,
    title: 'Project Management Help',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    messages: [
      {
        id: 'msg-2-1',
        conversationId: 'conv-2',
        role: MessageRole.USER,
        content: 'How do I estimate tasks for a software project?',
        timestamp: new Date(Date.now() - 7100000).toISOString(),
      },
      {
        id: 'msg-2-2',
        conversationId: 'conv-2',
        role: MessageRole.ASSISTANT,
        content: 'Task estimation involves breaking down work, using techniques like Scrum poker, and considering past project data. Always add a buffer! What kind of project are you working on?',
        timestamp: new Date(Date.now() - 7000000).toISOString(),
      },
    ],
  },
];

const mockActiveGoal: Goal = {
  id: 'goal-react-learning',
  userId: MOCK_USER_ID,
  title: 'Master React Development',
  description: 'Become proficient in building complex web applications with React, including state management, routing, and API integration.',
  status: GoalStatus.IN_PROGRESS,
  roadmap: [
    'Week 1: JavaScript ES6 & Modern Syntax',
    'Week 2: React Fundamentals (Components, Props, State)',
    'Week 3: React Hooks (useState, useEffect, useContext)',
    'Week 4: Advanced Hooks (useReducer, useCallback, useMemo, useRef)',
    'Week 5: React Router for Navigation',
    'Week 6: State Management (Context API, Redux/Zustand)',
    'Week 7: API Integration (Fetching & Displaying Data)',
    'Week 8: Form Handling & Validation',
    'Week 9: Testing React Applications (Jest, React Testing Library)',
    'Week 10: Performance Optimization & Best Practices',
  ],
  progressSummary: 'Currently in Week 3, understanding `useEffect` for data fetching.',
  tasks: [
    {
      id: 'task-1',
      goalId: 'goal-react-learning',
      description: 'Complete JS ES6 module',
      status: GoalStatus.COMPLETED,
      dueDate: '2024-07-20T23:59:59Z',
      createdAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 3600000).toISOString(),
    },
    {
      id: 'task-2',
      goalId: 'goal-react-learning',
      description: 'Build a simple component with props and state',
      status: GoalStatus.IN_PROGRESS,
      dueDate: '2024-07-27T23:59:59Z',
      createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    },
    {
      id: 'task-3',
      goalId: 'goal-react-learning',
      description: 'Implement a custom hook',
      status: GoalStatus.NOT_STARTED,
      dueDate: '2024-08-03T23:59:59Z',
      createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    },
  ],
  createdAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
};

/**
 * Mocks a chat API call.
 * @param conversationId The ID of the current conversation.
 * @param message The user's message.
 * @param existingMessages All messages in the current conversation for context.
 * @param activeGoal The user's active goal for context.
 * @returns A mocked ChatResponse.
 */
export const fetchChatResponse = async (
  conversationId: string,
  message: string,
  existingMessages: Message[],
  activeGoal?: Goal,
): Promise<ChatResponse> => {
  await delay(1000 + Math.random() * 1000); // Simulate network latency

  const newAssistantMessage: Message = {
    id: `msg-${conversationId}-${Date.now()}`,
    conversationId: conversationId,
    role: MessageRole.ASSISTANT,
    content: 'Default AI response.',
    timestamp: new Date().toISOString(),
  };

  let assistantContent = `I received your message: "${message}".`;
  let updatedGoal: Goal | undefined = undefined;

  // Simulate intent detection and context-aware responses
  if (message.toLowerCase().includes('roadmap')) {
    assistantContent = 'Generating a comprehensive roadmap for you... Please specify the topic you want a roadmap for. For example: "Generate a roadmap for learning full-stack web development."';
  } else if (message.toLowerCase().includes('explain')) {
    assistantContent = 'Please tell me which concept you\'d like me to explain. For example: "Explain the concept of React Hooks."';
  } else if (message.toLowerCase().includes('interview prep')) {
    assistantContent = 'I can help you prepare for an interview. What role are you targeting, and what areas do you want to focus on?';
  } else if (message.toLowerCase().includes('react hooks') && activeGoal?.title.includes('React')) {
    assistantContent = 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They allow you to use state and other React features without writing a class. The most common ones are `useState` for state management and `useEffect` for side effects. Did you want to know more about a specific hook?';
  } else if (message.toLowerCase().includes('how is my progress') && activeGoal) {
    assistantContent = `Based on your goal "${activeGoal.title}", your current progress is: ${activeGoal.progressSummary || 'No summary available.'} You have ${activeGoal.tasks?.filter(t => t.status === GoalStatus.IN_PROGRESS).length} tasks in progress and ${activeGoal.tasks?.filter(t => t.status === GoalStatus.COMPLETED).length} completed tasks.`;
  } else if (message.toLowerCase().includes('update my progress') && activeGoal) {
    assistantContent = `Sure, what would you like to update about your progress for "${activeGoal.title}"? For example, "I just completed the 'Build a simple component' task."`;
    // Simulate updating a goal
    updatedGoal = {
      ...activeGoal,
      progressSummary: `Updated on ${new Date().toLocaleDateString()}. ${message}`,
      updatedAt: new Date().toISOString(),
    };
  } else if (message.toLowerCase().includes('create a new goal')) {
    assistantContent = 'I can help you set up a new goal. What is the title and description for your new goal?';
  } else {
    assistantContent = `Hello! I'm your context-aware AI assistant. How can I help you today?
    ${activeGoal ? `Your current active goal is "${activeGoal.title}".` : 'You don\'t have an active goal right now.'}
    Let me know if you want to update your goal, generate a roadmap, or explain a concept!`;
  }

  newAssistantMessage.content = assistantContent;

  return { message: newAssistantMessage, contextUpdate: updatedGoal };
};

/**
 * Mocks fetching conversation history for a user.
 * @param userId The ID of the user.
 * @returns A mocked HistoryResponse.
 */
export const fetchHistory = async (userId: string): Promise<HistoryResponse> => {
  await delay(500); // Simulate network latency
  // Filter mock conversations by userId if implemented
  return { conversations: mockConversations.filter(conv => conv.userId === userId) };
};

/**
 * Mocks fetching the active context (e.g., current goal) for a user.
 * @param userId The ID of the user.
 * @returns A mocked ContextResponse.
 */
export const fetchContext = async (userId: string): Promise<ContextResponse> => {
  await delay(300); // Simulate network latency
  // Return mockActiveGoal if it belongs to the userId
  return { activeGoal: mockActiveGoal.userId === userId ? mockActiveGoal : undefined };
};

/**
 * Mocks creating a new conversation on the backend.
 * @param userId The ID of the user.
 * @param initialMessage The first message to start the conversation.
 * @returns The newly created conversation object.
 */
export const createNewConversation = async (userId: string, initialMessage: string): Promise<Conversation> => {
  await delay(700);
  const newConversationId = `conv-${Date.now()}`;
  const now = new Date().toISOString();
  const newConversation: Conversation = {
    id: newConversationId,
    userId: userId,
    title: `New Chat - ${initialMessage.substring(0, 20)}...`,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  mockConversations.push(newConversation); // Add to mock data
  return newConversation;
};

/**
 * Mocks updating an existing conversation's title.
 * @param conversationId The ID of the conversation to update.
 * @param newTitle The new title for the conversation.
 */
export const updateConversationTitleApi = async (conversationId: string, newTitle: string): Promise<void> => {
  await delay(300);
  const conversationIndex = mockConversations.findIndex(c => c.id === conversationId);
  if (conversationIndex !== -1) {
    mockConversations[conversationIndex].title = newTitle;
    mockConversations[conversationIndex].updatedAt = new Date().toISOString();
  }
};

/**
 * Mocks updating an existing goal.
 * @param updatedGoal The goal object with updated properties.
 */
export const updateGoalApi = async (goal: Goal): Promise<Goal> => {
  await delay(500);
  if (mockActiveGoal.id === goal.id) {
    Object.assign(mockActiveGoal, goal);
    mockActiveGoal.updatedAt = new Date().toISOString();
  }
  return mockActiveGoal;
};