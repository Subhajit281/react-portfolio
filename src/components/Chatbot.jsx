import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { RiChatSmileAiLine } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';

import { skillsData, experienceData } from '../portfolioData';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_URL ="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MODEL = 'inclusionAI/Ling-1T:featherless-ai';
const MAX_HISTORY_MESSAGES = 10; // last N conversation messages sent for context
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000; // 1s -> 2s -> 4s
const RETRYABLE_STATUS_CODES = new Set([429, 503]);

const INITIAL_MESSAGE = {
  id: 'welcome-message',
  sender: 'ai',
  text: "Hi there! How can I help you learn about Subhajit's skills or experience?",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a readable context block describing skills & experience. */
function formatPortfolioData(skills, experiences) {
  let context = "This is information about Subhajit Sarkar's skills and experience:\n\n";

  context += '## Skills:\n';
  skills.forEach((category) => {
    context += `- ${category.title}: ${category.skills.map((s) => s.name).join(', ')}\n`;
  });

  context += '\n## Experience:\n';
  experiences.forEach((exp) => {
    context += `- Title: ${exp.title} at ${exp.company} (${exp.date})\n`;
    context += `  Description: ${exp.description}\n`;
    if (exp.skills && exp.skills.length > 0) {
      context += `  Key Skills Used: ${exp.skills.join(', ')}\n`;
    }
    context += '\n';
  });

  return context;
}

/** Builds the system prompt that scopes the assistant to portfolio topics only. */
function buildSystemPrompt() {
  const portfolioContext = formatPortfolioData(skillsData, experienceData);

  return `You are the AI assistant for Subhajit Sarkar's portfolio website.

You may only answer questions about:
- projects
- skills
- technologies
- education
- work experience
- achievements

Never invent information that isn't in the context below. If asked something
unrelated to the portfolio, politely reply that you are designed only to
answer questions about Subhajit's portfolio.

Context:
${portfolioContext}`;
}

/** Generates a reasonably unique id for a chat message. */
function generateMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Converts our internal message shape into OpenAI-style chat messages. */
function toApiMessages(uiMessages) {
  return uiMessages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }));
}

/** Simple sleep helper for backoff delays. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Maps an HTTP status code to a friendly, user-facing error message. */
function friendlyErrorForStatus(status) {
  switch (status) {
    case 401:
    case 403:
      return "Sorry, I'm not authorized to respond right now. Please let Subhajit know.";
    case 404:
      return "Sorry, the assistant service couldn't be found. Please try again later.";
    case 429:
      return "I'm getting a lot of requests right now. Please try again in a moment.";
    case 500:
      return 'Something went wrong on the server. Please try again shortly.';
    case 503:
      return 'The assistant is warming up. Please try again in a few seconds.';
    default:
      return "Sorry, I'm having trouble connecting right now.";
  }
}

/**
 * Calls the Hugging Face chat-completions endpoint with retry + exponential
 * backoff on transient failures (429, 503, network errors).
 *
 * @param {Array<{role: string, content: string}>} apiMessages
 * @returns {Promise<string>} the assistant's reply text
 */
async function fetchAIResponse(apiMessages) {
  const hfToken = import.meta.env.VITE_HF_API_TOKEN;

  if (!hfToken) {
    // Caller is responsible for surfacing this as a chat message.
    throw new ConfigError('Missing API key.');
  }

  const payload = {
    model: MODEL,
    messages: apiMessages,
  };

  let attempt = 0;
  let lastError = null;

  while (attempt <= MAX_RETRIES) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const bodyText = await safeReadBody(response);
        console.error(
          `HF API error (status ${response.status}):`,
          bodyText || '<empty body>'
        );

        if (RETRYABLE_STATUS_CODES.has(response.status) && attempt < MAX_RETRIES) {
          await sleep(BASE_RETRY_DELAY_MS * 2 ** attempt);
          attempt += 1;
          continue;
        }

        throw new ApiError(friendlyErrorForStatus(response.status), response.status);
      }

      const result = await response.json();
      const aiText = result?.choices?.[0]?.message?.content;

      if (!aiText) {
        console.error('HF API returned an unexpected payload shape:', result);
        throw new ApiError("Sorry, I couldn't get a valid response.");
      }

      return aiText.trim();
    } catch (error) {
      // Config/API errors we've already classified should propagate immediately.
      if (error instanceof ConfigError || error instanceof ApiError) {
        throw error;
      }

      // Anything else here is a network-level failure (fetch throws on network errors).
      console.error('Network error while calling HF API:', error);
      lastError = error;

      if (attempt < MAX_RETRIES) {
        await sleep(BASE_RETRY_DELAY_MS * 2 ** attempt);
        attempt += 1;
        continue;
      }

      throw new ApiError("Sorry, I'm having trouble connecting right now.");
    }
  }

  // Should be unreachable, but keep a safe fallback.
  throw new ApiError("Sorry, I'm having trouble connecting right now.", null, lastError);
}

async function safeReadBody(response) {
  try {
    return await response.text();
  } catch {
    return null;
  }
}

class ConfigError extends Error {}
class ApiError extends Error {
  constructor(message, status = null, cause = null) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: generateMessageId(), sender, text }]);
  };

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === '' || isLoading) return;

    const userMessage = { id: generateMessageId(), sender: 'user', text: trimmedInput };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt();
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...toApiMessages(nextMessages),
      ];

      const aiText = await fetchAIResponse(apiMessages);
      appendMessage('ai', aiText);
    } catch (error) {
      if (error instanceof ConfigError) {
        appendMessage('ai', 'Configuration error: Missing API key.');
      } else if (error instanceof ApiError) {
        appendMessage('ai', error.message);
      } else {
        console.error('Unexpected error sending message:', error);
        appendMessage('ai', "Sorry, I'm having trouble connecting right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter inserts a newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-25 right-8 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <RiChatSmileAiLine size={0} /> : <RiChatSmileAiLine size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 w-88 sm:w-96 h-[540px] bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-700"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 p-4 text-white font-semibold text-lg flex justify-between items-center flex-shrink-0">
              Ask about my Skills!
              <button onClick={toggleChat} className="text-white hover:text-gray-200" aria-label="Close chat">
                <FaTimes />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <span
                    className={`${
                      msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'
                    } text-white rounded-lg px-3 py-2 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <motion.span
                    className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Thinking...
                  </motion.span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-700 flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || inputValue.trim() === ''}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 disabled:bg-gray-500 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <IoIosSend size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
