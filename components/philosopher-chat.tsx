'use client';

import * as React from 'react';
import { Send, Bot, User } from 'lucide-react';
import { philosophers, type Philosopher, type PhilosopherId } from '@/lib/personas';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  compact?: boolean;
  initialPhilosopherId?: PhilosopherId;
};

export function PhilosopherChat({ compact = false, initialPhilosopherId = 'kant' }: Props) {
  const [selectedId, setSelectedId] = React.useState<PhilosopherId>(initialPhilosopherId);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const philosopher = philosophers.find((p) => p.id === selectedId)!;

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePhilosopherChange = (id: PhilosopherId) => {
    setSelectedId(id);
    setMessages([]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          philosopherId: selectedId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const { text } = JSON.parse(data) as { text: string };
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + text } : m
              )
            );
          } catch {}
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: '응답 생성 중 오류가 발생했습니다.' }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-full flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Philosopher selector */}
      <div className="border-b border-gray-200 bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          철학자 선택
        </p>
        <div className={`flex flex-wrap gap-1.5 ${compact ? '' : 'gap-2'}`}>
          {philosophers.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePhilosopherChange(p.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all ${
                selectedId === p.id
                  ? 'text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                selectedId === p.id
                  ? { backgroundColor: p.color }
                  : undefined
              }
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Persona info */}
      <div
        className="border-b px-4 py-3"
        style={{ backgroundColor: philosopher.bgColor, borderColor: `${philosopher.color}33` }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{philosopher.emoji}</span>
          <div>
            <p className="font-semibold" style={{ color: philosopher.color }}>
              {philosopher.nameEn}
            </p>
            <p className="text-xs text-gray-500">{philosopher.years}</p>
            {!compact && (
              <p className="mt-1 text-sm text-gray-600">{philosopher.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-400">
              {philosopher.name}에게 철학적 질문을 던져보세요
            </p>
            <div className="space-y-2">
              {philosopher.suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                msg.role === 'user'
                  ? 'bg-gray-800 text-white'
                  : 'text-white'
              }`}
              style={
                msg.role === 'assistant'
                  ? { backgroundColor: philosopher.color }
                  : undefined
              }
            >
              {msg.role === 'user' ? <User size={14} /> : philosopher.emoji}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'rounded-tr-sm bg-gray-800 text-white'
                  : 'rounded-tl-sm bg-gray-50 text-gray-800'
              }`}
            >
              {msg.content || (
                <span className="inline-flex gap-1">
                  <span className="animate-bounce text-gray-400">●</span>
                  <span className="animate-bounce text-gray-400 [animation-delay:0.1s]">●</span>
                  <span className="animate-bounce text-gray-400 [animation-delay:0.2s]">●</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-gray-400">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="철학자에게 질문하세요... (Enter로 전송)"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: philosopher.color }}
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
