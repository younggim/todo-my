import Anthropic from '@anthropic-ai/sdk';
import { type NextRequest } from 'next/server';
import { getPhilosopher, demoResponses, type PhilosopherId } from '@/lib/personas';

type NodeContext = {
  id: string;
  label: string;
  sublabel: string;
  description: string;
  connectedLabels?: string[];
};

function buildSystemPrompt(basePrompt: string, nodeContext?: NodeContext | null): string {
  if (!nodeContext) return basePrompt;

  const connected =
    nodeContext.connectedLabels?.length
      ? `\n연결된 개념들: ${nodeContext.connectedLabels.join(', ')}`
      : '';

  return (
    basePrompt +
    `\n\n[현재 선택된 개념 노드]\n개념: ${nodeContext.label} (${nodeContext.sublabel})\n설명: ${nodeContext.description}${connected}\n\n위 개념을 중심으로 응답하되, 개념 지도의 다른 개념들(선의지, 의무, 도덕 법칙, 침묵의 부정, 자연 천부, 도덕적 가치, 경향성 등)과의 관계를 자연스럽게 언급하십시오.`
  );
}

export async function POST(req: NextRequest) {
  const { messages, philosopherId, nodeContext } = (await req.json()) as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    philosopherId: PhilosopherId;
    nodeContext?: NodeContext | null;
  };

  const philosopher = getPhilosopher(philosopherId);
  const systemPrompt = buildSystemPrompt(philosopher.systemPrompt, nodeContext);

  if (!process.env.ANTHROPIC_API_KEY) {
    const demo = demoResponses[philosopherId];
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = demo.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          await new Promise((r) => setTimeout(r, 30));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const anthropicStream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  });
}
