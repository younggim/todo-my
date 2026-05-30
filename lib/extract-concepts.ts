import { conceptNodes, conceptEdges } from './concept-map-data';

export type DialogueEdgeData = {
  id: string;
  source: string;
  target: string;
  label: string;
  philosopherEmoji: string;
  timestamp: number;
};

/** 응답 텍스트에서 언급된 개념 노드 ID 추출 */
export function extractMentionedIds(text: string): string[] {
  return conceptNodes.filter((node) => text.includes(node.label)).map((node) => node.id);
}

/** 선택된 노드와 직접 연결 여부 확인 */
export function isDirectlyConnected(sourceId: string, targetId: string): boolean {
  return conceptEdges.some(
    (e) =>
      (e.source === sourceId && e.target === targetId) ||
      (e.target === sourceId && e.source === targetId)
  );
}

/** 대화에서 발견된 새 연결(기존 간선에 없는) 생성 */
export function generateDialogueEdges(
  selectedNodeId: string,
  mentionedIds: string[],
  existingDialogueEdges: DialogueEdgeData[],
  philosopherEmoji: string
): DialogueEdgeData[] {
  const existingPairs = new Set(
    existingDialogueEdges.map((e) => `${e.source}|${e.target}`)
  );

  return mentionedIds
    .filter(
      (id) =>
        id !== selectedNodeId &&
        !isDirectlyConnected(selectedNodeId, id) &&
        !existingPairs.has(`${selectedNodeId}|${id}`) &&
        !existingPairs.has(`${id}|${selectedNodeId}`)
    )
    .map((id) => ({
      id: `dlg-${selectedNodeId}-${id}-${Date.now()}`,
      source: selectedNodeId,
      target: id,
      label: '대화 연결',
      philosopherEmoji,
      timestamp: Date.now(),
    }));
}

/** 선택 노드에 연결된 개념 레이블 목록 */
export function getConnectedLabels(nodeId: string): string[] {
  const connectedIds = conceptEdges
    .filter((e) => e.source === nodeId || e.target === nodeId)
    .map((e) => (e.source === nodeId ? e.target : e.source));

  return conceptNodes
    .filter((n) => connectedIds.includes(n.id))
    .map((n) => n.label);
}
