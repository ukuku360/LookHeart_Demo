import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { sendConsultationQuery } from '../../services/aiConsultationService';
import { cn } from '../../lib/utils';

export default function AIConsultationModal({ isOpen, onClose, dailyData }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '안녕하세요! 저는 AI 건강 비서입니다. 오늘 측정된 데이터를 바탕으로 건강 상태에 대해 궁금한 점을 답변해 드릴게요. 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const SUGGESTED_QUESTIONS = [
    "오늘 심박수가 왜 높았나요?",
    "부정맥이 감지되었나요?",
    "오늘 전반적인 건강 상태는 어때요?"
  ];

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        text: "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-sm h-[600px] flex flex-col shadow-2xl overflow-hidden relative border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
              <Sparkles size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-tight">AI 건강 상담</span>
              <span className="text-blue-100 text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Beta Version
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
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
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.sender === 'user' ? "bg-indigo-500 text-white" : "bg-white border border-gray-100 text-blue-500"
              )}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={16} />}
              </div>

              {/* Bubble */}
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.sender === 'user' 
                  ? "bg-indigo-500 text-white rounded-tr-none" 
                  : "bg-white border border-gray-100 text-gray-700 rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] animate-pulse">
               <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0">
                 <Bot size={16} className="text-blue-500" />
               </div>
               <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions & Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          {/* Suggestions - Only show if not typing and last message is from AI */}
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

          {/* Input Field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="건강 상담 질문을 입력하세요..."
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
    </div>
  );
}
