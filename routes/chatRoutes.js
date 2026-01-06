const express = require('express');
const { GoogleGenAI } = require('@google/genai'); // Use require for Node.js backend

const router = express.Router();

// Initialize GoogleGenAI outside the route handler for efficiency
// The API key must be obtained exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System Instruction base for Gemini
const BASE_SYSTEM_INSTRUCTION = `You are a highly intelligent and helpful AI assistant dedicated to assisting users with their learning goals, project management, and general knowledge within the domain of software development, engineering, and personal productivity.
Focus your responses on practical advice, explanations, roadmaps, and task breakdowns relevant to software development, engineering, project management, and learning strategies. Avoid discussing unrelated topics or giving personal opinions.
Provide clear, concise, and actionable responses. Use markdown for formatting lists, code snippets, and emphasis. If a user asks for a roadmap or plan, provide it in a step-by-step list format.`;

// POST /api/chat
router.post('/chat', async (req, res) => {
  const { conversationId, userMessage, existingMessages, activeGoal } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'User message is required.' });
  }
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
  }

  let fullSystemInstruction = BASE_SYSTEM_INSTRUCTION;
  let contents = [];

  // 1. Context Injection: Active Goal
  if (activeGoal) {
    fullSystemInstruction += `\n\nCurrent active goal context:
Title: ${activeGoal.title}
Description: ${activeGoal.description}
Status: ${activeGoal.status}
Roadmap:
${activeGoal.roadmap && activeGoal.roadmap.length > 0 ? activeGoal.roadmap.map(step => `- ${step}`).join('\n') : 'No roadmap defined.'}
Progress Summary: ${activeGoal.progressSummary || 'No summary available.'}
`;
  }

  // 2. Context Injection: Conversation History
  if (existingMessages && existingMessages.length > 0) {
    fullSystemInstruction += `\n\nConversation history:\n`;
    existingMessages.forEach(msg => {
      // Limit history to last few turns to manage token usage
      if (contents.length < 10) { // Keep last 10 parts for history
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
      }
    });
  }

  // Add the current user message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    // Model selection: 'gemini-3-flash-preview' for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents, // Use array of parts directly
      config: {
        systemInstruction: fullSystemInstruction,
      },
    });

    const assistantContent = response.text || 'No response from AI.';

    // Simulate contextUpdate if the AI suggests it (for demonstration, keeping this logic client-side for now)
    let contextUpdate = undefined;
    if (userMessage.toLowerCase().includes('update my progress') && activeGoal) {
      contextUpdate = {
        ...activeGoal,
        progressSummary: `Updated on ${new Date().toLocaleDateString()}. ${assistantContent.substring(0, 100)}...`, // Placeholder update
        updatedAt: new Date().toISOString(),
      };
    }

    const newAssistantMessage = {
      id: `msg-${conversationId}-${Date.now()}-ai`,
      conversationId: conversationId,
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString(),
    };

    res.json({
      message: newAssistantMessage,
      contextUpdate: contextUpdate, // Send back potential context update
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error.response && error.response.data && error.response.data.error) {
      res.status(error.response.status).json({ error: error.response.data.error.message });
    } else {
      res.status(500).json({ error: 'Failed to get response from AI.' });
    }
  }
});

module.exports = router;
