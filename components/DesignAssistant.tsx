import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User } from 'lucide-react';
import { chatWithDesignExpert } from '../services/geminiService';
import { Message } from '../types';

interface DesignAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const DesignAssistant: React.FC<DesignAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I\'m your AI Design Assistant. Ask me about UI patterns, color theory, or UX best practices.', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Call Gemini
    const responseText = await chatWithDesignExpert(userMsg.text, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-[71] pointer-events-none p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl h-[600px] rounded-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Design Assistant</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini 3 Flash</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                  <X size={20} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900 transition-colors">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0 mt-1">
                        <Bot size={14} />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 mt-1">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                    <div className="flex gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0 mt-1">
                            <Bot size={14} />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about design patterns..."
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none bg-white dark:bg-gray-800 dark:text-white shadow-sm"
                    rows={1}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="absolute right-2 top-2 p-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2">
                   AI can make mistakes. Design decisions should be verified by humans.
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DesignAssistant;