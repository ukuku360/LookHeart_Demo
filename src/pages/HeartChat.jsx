import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { sendConsultationQuery } from '../services/aiConsultationService';
import { cn } from '../lib/utils';
import { mockData } from '../data/mockData';
import { APP_CONFIG } from '../config/appConfig';

export default function HeartChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '안녕하세요! 저는 하트챗 AI 비서입니다. 오늘 심장 건강에 대해 궁금한 점을 물어보세요.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Use fixed mock data for beta
  const today = APP_CONFIG.TODAY;
  const dailyData = mockData.dailyStats[today];

  const SUGGESTED_QUESTIONS = [
    "오늘 심박수가 왜 높았나요?",
    "부정맥이 감지되었나요?",
    "스트레스 지수 알려줘"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Force immediate scroll without animation for performance if chat is long
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Get AI response
      const response = await sendConsultationQuery(text, dailyData);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        timestamp: new Date(),
        relatedData: response.relatedData
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "죄송합니다. 오류가 발생했습니다.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 pt-2 animate-fade-in relative z-0">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3 bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-2 rounded-xl shadow-blue-200 shadow-lg">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
           <h1 className="text-xl font-bold text-gray-800">하트챗</h1>
           <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full">Beta AI Service</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mb-1 self-end",
              msg.sender === 'user' ? "bg-indigo-500 text-white" : "bg-white border border-gray-100 text-blue-500"
            )}>
              {msg.sender === 'user' ? <User size={14} /> : <Bot size={16} />}
            </div>

            {/* Bubble */}
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
              msg.sender === 'user' 
                ? "bg-indigo-500 text-white rounded-br-none" 
                : "bg-white border border-gray-100 text-gray-700 rounded-bl-none"
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%] animate-pulse">
             <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 self-end mb-1">
               <Bot size={16} className="text-blue-500" />
             </div>
             <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 sticky bottom-[76px] z-10 safe-area-bottom">
         {/* Suggestions */}
         {!isTyping && messages[messages.length - 1]?.sender === 'ai' && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

        <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="질문을 입력하세요..."
              className="flex-1 bg-gray-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm active:scale-95"
            >
              {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
      </div>
    </div>
  );
}
