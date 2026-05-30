import Anthropic from '@anthropic-ai/sdk';
import { type NextRequest } from 'next/server';
import { getPhilosopher, demoResponses, type PhilosopherId } from '@/lib/personas';

export async function POST(req: NextRequest) {
  const { messages, philosopherId } = (await req.json()) as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    philosopherId: PhilosopherId;
  };

  const philosopher = getPhilosopher(philosopherId);

  if (!process.env.ANTHROPIC_API_KEY) {
    const demo = demoResponses[philosopherId];
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Simulate streaming with chunks
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
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const anthropicStream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: philosopher.systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
