import { PhilosopherChat } from '@/components/philosopher-chat';
import { philosophers } from '@/lib/personas';

export default function PhiloAgentPage() {
  return (
    <main className="flex h-[calc(100vh-56px)] flex-col overflow-hidden bg-[#f8f4f0]">
      {/* Page header */}
      <div className="border-b border-[#d4c4c0] bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-[#5c1a16]">철학자 대화</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          철학자를 선택하고 그의 방법론으로 대화하세요. 각 철학자는 자신의 시대적 한계와 사유 방식을 유지합니다.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Philosopher overview sidebar */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-[#d4c4c0] bg-white p-4 lg:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            철학자 소개
          </p>
          <div className="space-y-3">
            {philosophers.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border p-3"
                style={{ borderColor: `${p.color}40`, backgroundColor: p.bgColor }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: p.color }}>
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">{p.years}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{p.description}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat panel */}
        <div className="flex-1 overflow-hidden">
          <PhilosopherChat />
        </div>
      </div>
    </main>
  );
}
