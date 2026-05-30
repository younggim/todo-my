'use client';

import * as React from 'react';
import { Send } from 'lucide-react';
import { philosophers, type Philosopher, type PhilosopherId } from '@/lib/personas';
import { extractMentionedIds, type DialogueEdgeData } from '@/lib/extract-concepts';
import type { ConceptNode } from '@/lib/concept-map-data';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  compact?: boolean;
  initialPhilosopherId?: PhilosopherId;
  /** 현재 선택된 개념 노드 (개념 지도에서 연동) */
  selectedNode?: ConceptNode | null;
  /** 응답 완료 후 언급된 개념 ID 목록 + 새 대화 간선 전달 */
  onMessageComplete?: (mentionedIds: string[], newEdges: DialogueEdgeData[]) => void;
};

export function PhilosopherChat({
  compact = false,
  initialPhilosopherId = 'kant',
  selectedNode,
  onMessageComplete,
}: Props) {
  const [selectedId, setSelectedId] = React.useState<PhilosopherId>(initialPhilosopherId);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const nodeContext = selectedNode
        ? {
            id: selectedNode.id,
            label: selectedNode.label,
            sublabel: selectedNode.sublabel,
            description: selectedNode.description,
          }
        : null;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          philosopherId: selectedId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          nodeContext,
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

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
            const { text: chunk } = JSON.parse(data) as { text: string };
            fullText += chunk;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m))
            );
          } catch {}
        }
      }

      // 응답 완료 후 개념 추출 및 콜백
      if (onMessageComplete && fullText) {
        const { generateDialogueEdges } = await import('@/lib/extract-concepts');
        const mentionedIds = extractMentionedIds(fullText);
        const newEdges = selectedNode
          ? generateDialogueEdges(selectedNode.id, mentionedIds, [], philosopher.emoji)
          : [];
        onMessageComplete(mentionedIds, newEdges);
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: '응답 생성 중 오류가 발생했습니다.' } : m
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
    <div className="flex h-full flex-col">
      {/* Philosopher selector */}
      <div className="border-b border-gray-200 bg-white p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">철학자 선택</p>
        <div className="flex flex-wrap gap-1.5">
          {philosophers.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePhilosopherChange(p.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all ${
                selectedId === p.id ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={selectedId === p.id ? { backgroundColor: p.color } : undefined}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Persona info + selected node badge */}
      <div
        className="border-b px-4 py-3"
        style={{ backgroundColor: philosopher.bgColor, borderColor: `${philosopher.color}33` }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{philosopher.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold" style={{ color: philosopher.color }}>
              {philosopher.nameEn}
            </p>
            <p className="text-xs text-gray-500">{philosopher.years}</p>
            {!compact && (
              <p className="mt-1 text-sm text-gray-600">{philosopher.description}</p>
            )}
          </div>
        </div>
        {/* Selected node context badge */}
        {selectedNode && (
          <div
            className="mt-2 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs"
            style={{ backgroundColor: `${philosopher.color}18`, color: philosopher.color }}
          >
            <span>🗺️</span>
            <span className="font-medium">{selectedNode.label}</span>
            <span className="text-gray-400">노드 선택됨 — 이 개념에 대해 질문하세요</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-400">
              {selectedNode
                ? `${philosopher.name}에게 "${selectedNode.label}"에 대해 질문해보세요`
                : `${philosopher.name}에게 철학적 질문을 던져보세요`}
            </p>
            <div className="space-y-2">
              {(selectedNode
                ? [`"${selectedNode.label}"이란 무엇인가요?`, `${selectedNode.label}과 의무의 관계는?`, `${selectedNode.label}에 대한 비판은?`]
                : philosopher.suggestedQuestions
              ).map((q, i) => (
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
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                msg.role === 'user' ? 'bg-gray-800 text-white' : 'text-white'
              }`}
              style={msg.role === 'assistant' ? { backgroundColor: philosopher.color } : undefined}
            >
              {msg.role === 'user' ? '나' : philosopher.emoji}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문하세요... (Enter로 전송)"
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
