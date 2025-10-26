import React, { useState, useEffect, useRef } from 'react'; // Added useEffect and useRef
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa'; // Kept FaPaperPlane
import { RiChatSmileAiLine } from "react-icons/ri"; // Your chosen icon
import { IoIosSend } from "react-icons/io"; // Your chosen send icon

// 1. Import your portfolio data
import { skillsData, experienceData } from '../portfolioData';

// 2. Helper function to format the data for the AI
function formatPortfolioData(skills, experiences) {
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
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Function to scroll message area to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll whenever messages change

  const toggleChat = () => setIsOpen(!isOpen);

  // 3. ✨ UPDATED handleSend function with Gemini API call ✨
  const handleSend = async (retries = 3, delay = 1000) => {
    if (inputValue.trim() === '') return;

    const userMessageText = inputValue;
    const userMessage = { sender: 'user', text: userMessageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    scrollToBottom(); // Scroll after adding user message

    // --- Gemini API Call ---
    const apiKey = ""; // Leave blank - Canvas will provide it
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const portfolioContext = formatPortfolioData(skillsData, experienceData);
    const systemPrompt = `You are a helpful chatbot on Subhajit Sarkar's portfolio website. Answer questions based *only* on the provided Skills and Experience information. Be concise and friendly. If the question is unrelated to Subhajit's skills or experience, politely state that you cannot answer. Context:\n${portfolioContext}`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: userMessageText }]
      }],
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error("API Error Response:", response);
        if (response.status === 429 && retries > 0) {
            console.warn(`Throttled. Retrying in ${delay / 1000}s... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return handleSend(retries - 1, delay * 2); // Exponential backoff
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      const aiResponse = { sender: 'ai', text: aiText };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Failed to fetch from Gemini API:", error);
      const errorResponse = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorResponse]);
       if (retries > 0 && error.message.includes('API Error: 429')) {
           console.warn(`Caught fetch error possibly due to throttling. Retrying in ${delay / 1000}s...`);
           await new Promise(resolve => setTimeout(resolve, delay));
           return handleSend(retries - 1, delay * 2); // Exponential backoff
       }
    } finally {
      setIsLoading(false);
      scrollToBottom(); // Scroll after adding AI message or error
    }
    // --- End Gemini API Call ---
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) { // Prevent sending while loading
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-25 right-8 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50" // Preserved your class
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <RiChatSmileAiLine size={0} />: <RiChatSmileAiLine size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-8 w-80 sm:w-96 h-[500px] bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-700" // Preserved sm:w-96
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-indigo-700 p-4 text-white font-semibold text-lg flex justify-between items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
              Ask about my Skills!
              <button onClick={toggleChat} className="text-white hover:text-gray-200">
                 <FaTimes />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* AI Greeting */}
              <div className="flex justify-start">
                  <span className="bg-gray-700 text-white rounded-lg px-3 py-2 max-w-[80%] text-sm"> {/* Added text-sm */}
                    Hi there! How can I help you learn about Subhajit's skills or experience?
                  </span>
              </div>
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'} text-white rounded-lg px-3 py-2 max-w-[80%] text-sm leading-relaxed`}> {/* Added text-sm, leading-relaxed */}
                    {msg.text}
                  </span>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <motion.span
                       className="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm" // Added text-sm
                       initial={{ opacity: 0.5 }}
                       animate={{ opacity: [0.5, 1, 0.5] }}
                       transition={{ duration: 1, repeat: Infinity }}
                    >
                      Thinking...
                    </motion.span>
                 </div>
              )}
              <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-700 flex items-center gap-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" // Added text-sm
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()} // Call default handleSend
                disabled={isLoading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 disabled:bg-gray-500 disabled:cursor-not-allowed" // Preserved your classes
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

