import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage, chatWithGemini } from './geminiApi';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await chatWithGemini(input);
      const aiMessage: ChatMessage = { role: 'ai', content: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error chatting with Elly:', error);
      const errorMessage: ChatMessage = { role: 'ai', content: error.message || 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-2xl font-bold">Elly AI Service</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-sm p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <div className="flex items-center mb-2">
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 mr-2" />
                  ) : (
                    <Bot className="w-5 h-5 mr-2" />
                  )}
                  <span className="font-semibold">
                    {message.role === 'user' ? 'Siz' : 'Elly'}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className="bg-white p-4 border-t border-purple-200">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-2 border border-purple-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Düşünüyor...</span>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;