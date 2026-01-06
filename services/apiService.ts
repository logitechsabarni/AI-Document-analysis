import { ChatResponse, ContextResponse, Conversation, Goal, HistoryResponse, Message, MessageRole, GoalStatus } from '../types';
import { MOCK_USER_ID } from '../constants';

// --- API BASE URL ---
// Point to your new Flask backend (default for Flask is 5000)
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper function for making authenticated API requests.
 */
const apiRequest = async (endpoint: string, method: string, body?: any): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  // In a real app, you'd add authorization headers here
  // headers['Authorization'] = `Bearer ${getAuthToken()}`;

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API request failed for ${endpoint}: ${response.statusText}`);
  }

  return response.json();
};


/**
 * Makes a real API call to the backend /api/chat endpoint to get a Gemini response.
 * @param conversationId The ID of the current conversation.
 * @param message The user's message.
 * @param existingMessages All messages in the current conversation for context.
 * @param activeGoal The user's active goal for context.
 * @returns A ChatResponse from the backend.
 */
export const fetchChatResponse = async (
  conversationId: string,
  message: string,
  existingMessages: Message[],
  activeGoal?: Goal,
): Promise<ChatResponse> => {
  return apiRequest('/chat/', 'POST', {
    conversationId,
    userMessage: message,
    existingMessages,
    activeGoal,
  });
};

/**
 * Fetches conversation history for a user.
 * @param userId The ID of the user.
 * @returns A HistoryResponse from the backend.
 */
export const fetchHistory = async (userId: string): Promise<HistoryResponse> => {
  return apiRequest(`/history/${userId}`, 'GET');
};

/**
 * Fetches the active context (e.g., current goal) for a user.
 * @param userId The ID of the user.
 * @returns A ContextResponse from the backend.
 */
export const fetchContext = async (userId: string): Promise<ContextResponse> => {
  return apiRequest(`/context/${userId}`, 'GET');
};

/**
 * Creates a new conversation on the backend.
 * @param userId The ID of the user.
 * @param initialMessage The first message to start the conversation.
 * @returns The newly created conversation object.
 */
export const createNewConversation = async (userId: string, initialMessage: string): Promise<Conversation> => {
  const response = await apiRequest('/history/conversations', 'POST', { userId, initialMessage });
  return response.conversation; // Backend returns { "conversation": {...} }
};

/**
 * Updates an existing conversation's title.
 * @param conversationId The ID of the conversation to update.
 * @param newTitle The new title for the conversation.
 */
export const updateConversationTitleApi = async (conversationId: string, newTitle: string): Promise<void> => {
  await apiRequest(`/history/conversations/${conversationId}/title`, 'PUT', { newTitle });
};

/**
 * Updates an existing goal.
 * @param updatedGoal The goal object with updated properties.
 */
export const updateGoalApi = async (goal: Goal): Promise<Goal> => {
  // Assuming the backend endpoint for goals takes the full goal object for update/create
  const response = await apiRequest('/context/', 'POST', goal); // Using POST for general goal update/create
  return response.goal; // Backend returns { "goal": {...} }
};
