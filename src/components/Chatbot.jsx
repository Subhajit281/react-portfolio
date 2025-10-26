import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { RiChatSmileAiLine } from "react-icons/ri";
import { IoIosSend } from "react-icons/io";

import { skillsData, experienceData } from '../portfolioData';

// Helper function to format the data for the AI
function formatPortfolioData(skills, experiences) {
  // ... (keep this function exactly the same)
  let context = "This is information about Subhajit Sarkar's skills and experience:\n\n";
  context += "## Skills:\n";
  skills.forEach(category => {
    context += `- ${category.title}: ${category.skills.map(s => s.name).join(', ')}\n`;
  });
  context += "\n## Experience:\n";
  experiences.forEach(exp => {
    context += `- Title: ${exp.title} at ${exp.company} (${exp.date})\n`;
    context += `  Description: ${exp.description}\n`;
    if (exp.skills && exp.skills.length > 0) {
      context += `  Key Skills Used: ${exp.skills.join(', ')}\n`;
    }
    context += "\n";
  });
  return context;
}


const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  // ✨ UPDATED handleSend function for HF OpenAI-compatible endpoint ✨
  const handleSend = async (retries = 3, delay = 1000) => {
    if (inputValue.trim() === '') return;

    const userMessageText = inputValue;
    const userMessage = { sender: 'user', text: userMessageText };
    // Maintain previous messages for context (optional but better for conversation)
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputValue('');
    setIsLoading(true);
    scrollToBottom();

    // --- Hugging Face API Call (OpenAI compatible) ---
    const hfToken = import.meta.env.VITE_HF_API_TOKEN;
    // 1. Use the correct API URL you found
    const apiUrl = "https://router.huggingface.co/v1/chat/completions"; // Updated URL

    const portfolioContext = formatPortfolioData(skillsData, experienceData);
    const systemPrompt = `You are a helpful chatbot on Subhajit Sarkar's portfolio website. Answer questions based *only* on the provided Skills and Experience information. Be concise and friendly. If the question is unrelated, politely decline. Context:\n${portfolioContext}`;

    // 2. Construct the payload in OpenAI's chat completions format
    const payload = {
      model: "inclusionAI/Ling-1T:featherless-ai", // Specify the model being used
      messages: [
        { "role": "system", "content": systemPrompt },
        // Include previous messages for better conversational context (optional)
        // ...currentMessages.slice(-4).map(msg => ({ // Example: send last 4 messages
        //     role: msg.sender === 'user' ? 'user' : 'assistant',
        //     content: msg.text
        // })),
        { "role": "user", "content": userMessageText } // Add the latest user message
      ],
      // Optional parameters
      // temperature: 0.7,
      // max_tokens: 150,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("HF API Error Response:", response);
        if (response.status === 503 && retries > 0) {
           console.warn(`Model might be loading. Retrying in ${delay / 1000}s... (${retries} retries left)`);
           await new Promise(resolve => setTimeout(resolve, delay));
           return handleSend(retries - 1, delay * 2);
        }
        if (response.status === 429 && retries > 0) {
            console.warn(`Throttled. Retrying in ${delay / 1000}s... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return handleSend(retries - 1, delay * 2);
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // 3. Parse the result according to OpenAI's chat completions format
      const aiText = result.choices?.[0]?.message?.content || "Sorry, I couldn't get a valid response.";
      
      const aiResponse = { sender: 'ai', text: aiText.trim() };
      setMessages(prev => [...prev, aiResponse]); // Use functional update

    } catch (error) {
      console.error("Failed to fetch from Hugging Face API:", error);
      const errorResponse = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorResponse]); // Use functional update
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
    // --- End Hugging Face API Call ---
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  // --- Rest of your component's return statement (UI) remains unchanged ---
  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-25 right-8 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <RiChatSmileAiLine size={0} />: <RiChatSmileAiLine size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 w-80 sm:w-96 h-[500px] bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-700"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 p-4 text-white font-semibold text-lg flex justify-between items-center flex-shrink-0">
              Ask about my Skills!
              <button onClick={toggleChat} className="text-white hover:text-gray-200">
                 <FaTimes />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex justify-start">
                  <span className="bg-gray-700 text-white rounded-lg px-3 py-2 max-w-[80%] text-sm">
                    Hi there! How can I help you learn about Subhajit's skills or experience?
                  </span>
              </div>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'} text-white rounded-lg px-3 py-2 max-w-[80%] text-sm leading-relaxed`}>
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
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 disabled:bg-gray-500 disabled:cursor-not-allowed"
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

