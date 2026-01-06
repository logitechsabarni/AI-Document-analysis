// Data Models (Frontend representation, mirroring hypothetical Firestore schemas)

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user-specific data as needed
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO 8601 string
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  messages: Message[]; // In a real app, this might be fetched separately or paginated
}

export enum GoalStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
}

export interface Task {
  id: string;
  goalId: string;
  description: string;
  status: GoalStatus;
  dueDate?: string; // ISO 8601 string
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: GoalStatus;
  roadmap?: string[]; // Steps or a high-level plan
  progressSummary?: string;
  tasks?: Task[]; // In a real app, fetched separately
  createdAt: string;
  updatedAt: string;
}

// API Responses (Mocked)
export interface ChatResponse {
  message: Message;
  contextUpdate?: Goal; // Optional update to the active goal/context
}

export interface HistoryResponse {
  conversations: Conversation[];
}

export interface ContextResponse {
  activeGoal?: Goal;
}

// Global context for authentication and app state
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface AppContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  activeGoal: Goal | null;
  setActiveGoal: (goal: Goal | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  addMessage: (message: Message) => void;
  updateConversationTitle: (conversationId: string, newTitle: string) => void;
  updateGoal: (goal: Goal) => void;
  handleNewConversation: (initialMessage: string) => Promise<void>;
  simulateChatResponse: (
    conversationId: string,
    userMessage: string,
    isInitial?: boolean,
  ) => Promise<void>;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  icon?: string; // Tailwind class for icon, e.g., '🚀' or '💡'
}
