import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendWikiMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import Button from './Button';

const WikiBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Merhaba Skyblock oyuncusu! Ben AxionBot. Bana üretim tarifleri, ada komutları veya Void Coin kazanmanın en iyi yolları hakkında soru sorabilirsin!",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    // Add user message to UI
    const newUserMsg: ChatMessage = { role: 'user', text: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);

    // Format history for Gemini
    // Gemini expects: { role: 'user' | 'model', parts: [{ text: string }] }
    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Get response
    const responseText = await sendWikiMessage(userMessage, history);
    
    const newBotMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, newBotMsg]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="py-24 bg-void-900 flex justify-center px-4" id="wiki">
      <div className="w-full max-w-4xl bg-void-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[700px]">
        
        {/* Header */}
        <div className="bg-void-900/50 p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-axion-purple to-axion-cyan p-[2px]">
              <div className="w-full h-full rounded-full bg-void-900 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Axion Wiki Asistanı</h3>
              <p className="text-sm text-axion-cyan flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Yapay Zeka Destekli
              </p>
            </div>
          </div>
          <div className="hidden md:block text-xs text-gray-500">
            Powered by Gemini 2.5 Flash
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-700' : 'bg-axion-purple/20'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-axion-purple" />}
              </div>
              
              <div className={`rounded-2xl p-4 max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-axion-purple to-void-700 text-white rounded-tr-none' 
                  : 'bg-void-700 text-gray-200 rounded-tl-none border border-white/5'
              }`}>
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{msg.text}</p>
                <div className="mt-2 text-[10px] opacity-50 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-axion-purple/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-axion-purple" />
              </div>
              <div className="bg-void-700 rounded-2xl p-4 rounded-tl-none border border-white/5 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-axion-cyan animate-spin" />
                <span className="text-sm text-gray-400">Boşluğa danışılıyor...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-void-900/50 border-t border-white/10">
          <div className="relative flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Üretim, rütbeler veya komutlar hakkında sor..."
              disabled={loading}
              className="flex-1 bg-void-950 border border-void-600 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-axion-cyan transition-colors disabled:opacity-50"
            />
            <Button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              className="px-6 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-600">Yapay zeka hata yapabilir. Lütfen oyun içinde /help ile bilgileri doğrulayın.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiBot;