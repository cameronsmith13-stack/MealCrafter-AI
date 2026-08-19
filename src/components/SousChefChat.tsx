import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, ChefHat, MessageSquare, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import type { MealDetail, ChatMessage } from '../types';

interface SousChefChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentMeal?: MealDetail | null;
}

export const SousChefChat: React.FC<SousChefChatProps> = ({
  isOpen,
  onClose,
  currentMeal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: currentMeal
        ? `Bonjour! I'm Chef Remy, your AI Sous Chef. I'm ready to help you cook **${currentMeal.title}**. Need substitutions, cooking technique tips, timing help, or heat adjustments? Ask me anything!`
        : `Bonjour! I'm Chef Remy, your personal culinary assistant. Ask me anything about recipes, cooking hacks, ingredient substitutes, or meal planning!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when meal changes
  useEffect(() => {
    if (currentMeal) {
      setMessages([
        {
          id: `welcome-${currentMeal.id}`,
          role: 'assistant',
          content: `Bonjour! I'm Chef Remy, your AI Sous Chef. I'm ready to help you cook **${currentMeal.title}**. Need substitutions, cooking technique tips, timing help, or heat adjustments? Ask me anything!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentMeal?.id]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = currentMeal
    ? [
        `How do I make this less spicy?`,
        `Can I cook this in an air fryer?`,
        `What can I substitute for the main sauce/spices?`,
        `What side dish or beverage goes best with this?`,
        `How do I meal prep and store leftovers?`,
      ]
    : [
        `What can I cook with chicken and rice?`,
        `How do I make chicken breast super juicy?`,
        `Give me a quick 15-minute high protein dinner.`,
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/meals/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          recipeContext: currentMeal
            ? {
                title: currentMeal.title,
                cuisine: currentMeal.cuisine,
                ingredients: currentMeal.ingredients,
                spiceLevel: currentMeal.spiceLevel,
                healthInsight: currentMeal.healthInsight,
              }
            : null,
          history: messages.slice(-6),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from AI Sous Chef');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "I'm right here in your kitchen! What else can I assist with?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Pardon! I ran into a kitchen snag: ${err.message || 'Please try asking again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-slideLeft">
        {/* Chat Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-sm">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span>Chef Remy</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {currentMeal ? `Guiding: ${currentMeal.title}` : 'AI Culinary Assistant'}
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChefHat className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-white rounded-br-none shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none border border-stone-200/80 dark:border-stone-700/60'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <span
                  className={`block text-[9px] mt-1.5 ${
                    msg.role === 'user' ? 'text-white/70 text-right' : 'text-stone-400 text-left'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-stone-400 italic">
              <div className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-3.5 h-3.5 animate-bounce" />
              </div>
              <span>Chef Remy is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-stone-200/60 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
            Quick Questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-600 dark:text-stone-300 hover:text-amber-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors text-left truncate max-w-full"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Chef Remy anything about cooking..."
            className="flex-1 px-3.5 py-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || !inputValue.trim()}
            className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};
