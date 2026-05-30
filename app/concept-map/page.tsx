
'use client';

import * as React from 'react';
import { KantConceptMap } from '@/components/kant-concept-map';
import { PhilosopherChat } from '@/components/philosopher-chat';
import { conceptNodes, conceptEdges, type ConceptNode } from '@/lib/concept-map-data';

export default function ConceptMapPage() {
  const [selectedNode, setSelectedNode] = React.useState<ConceptNode | null>(null);
  const [showChat, setShowChat] = React.useState(true);

  return (
    <main className="flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">
      {/* Left info panel */}
      <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">
        {/* Panel header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold text-[#8C2822]">
            칸트 『도덕형이상학 정초』
          </p>
          <p className="mt-0.5 text-xs text-gray-500">1부 첫 단락 — 선의지 중심 개념 지도</p>
        </div>

        {/* Demo notice */}
        <div className="mx-3 mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 border border-amber-200">
          <p className="font-semibold">샘플 지도 표시 중</p>
          <p className="mt-1 leading-relaxed">
            칸트 도덕형이상학 정초 1부의 분석 결과입니다. 개념 노드를 클릭하면 상세 설명을 확인할 수 있습니다.
          </p>
        </div>

        {/* Node description */}
        {selectedNode ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="rounded-lg border border-[#AA2E2640] bg-[#fdf5f4] p-4">
              <p className="text-sm font-bold text-[#8C2822]">{selectedNode.label}</p>
              <p className="text-xs italic text-gray-500">{selectedNode.sublabel}</p>
              <p className="mt-3 text-xs leading-relaxed text-gray-700">
                {selectedNode.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                    selectedNode.type === 'center'
                      ? 'bg-[#AA2E26]'
                      : selectedNode.type === 'primary'
                      ? 'bg-[#DD524C]'
                      : selectedNode.type === 'secondary'
                      ? 'bg-[#CF364C]'
                      : 'bg-[#CA3A31]'
                  }`}
                >
                  {selectedNode.type === 'center'
                    ? '중심 개념'
                    : selectedNode.type === 'primary'
                    ? '1차 범주'
                    : selectedNode.type === 'secondary'
                    ? '2차 개념'
                    : 'D7 배제'}
                </span>
                <span className="text-xs text-gray-400">L{selectedNode.tier}</span>
              </div>
            </div>

            {/* Related nodes */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-gray-500">연결된 개념</p>
              <div className="space-y-1.5">
                {conceptNodes
                  .filter((n) => {
                    if (n.id === selectedNode.id) return false;
                    return conceptEdges.some(
                      (e) =>
                        (e.source === selectedNode.id && e.target === n.id) ||
                        (e.target === selectedNode.id && e.source === n.id)
                    );
                  })
                  .map((n) => (
                    <button
                      key={n.id}
                      onClick={() => setSelectedNode(n)}
                      className="flex w-full items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            n.type === 'center'
                              ? '#AA2E26'
                              : n.type === 'primary'
                              ? '#DD524C'
                              : '#CF364C',
                        }}
                      />
                      {n.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-gray-400 text-center mt-4">
              개념 노드를 클릭하면<br />상세 설명이 표시됩니다
            </p>

            {/* Node list */}
            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold text-gray-500 mb-2">전체 개념 목록</p>
              {conceptNodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        n.type === 'center'
                          ? '#AA2E26'
                          : n.type === 'primary'
                          ? '#DD524C'
                          : n.type === 'secondary'
                          ? '#CF364C'
                          : '#CA3A31',
                    }}
                  />
                  <span className={n.type === 'excluded' ? 'text-gray-400' : ''}>{n.label}</span>
                  <span className="ml-auto text-gray-300 text-[10px]">L{n.tier}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Map */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <KantConceptMap
          onNodeSelect={setSelectedNode}
          selectedNodeId={selectedNode?.id ?? null}
        />
      </div>

      {/* Right chat panel */}
      {showChat && (
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-[#8C2822]">페르소나 대화</p>
            <button
              onClick={() => setShowChat(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              닫기
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PhilosopherChat compact initialPhilosopherId="kant" />
          </div>
        </aside>
      )}

      {/* Open chat button when closed */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#8C2822] px-4 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-[#AA2E26] transition-colors"
        >
          💬 철학자 대화
        </button>
      )}
    </main>
  );
}
