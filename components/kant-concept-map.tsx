'use client';

import * as React from 'react';
import { conceptNodes, conceptEdges, type ConceptNode } from '@/lib/concept-map-data';

const COLORS = {
  center: { fill: '#AA2E26', stroke: '#8C2822', text: '#FFFFFF' },
  primary: { fill: '#DD524C', stroke: '#AA2E26', text: '#FFFFFF' },
  secondary: { fill: '#F6CFD3', stroke: '#CF364C', text: '#92243B' },
  excluded: { fill: '#F6CCCB', stroke: '#CA3A31', text: '#8C2822' },
  edge: '#8C2822',
  label: { bg: '#8C2822', text: '#FFFFFF' },
};

type Props = {
  onNodeSelect?: (node: ConceptNode | null) => void;
  selectedNodeId?: string | null;
};

export function KantConceptMap({ onNodeSelect, selectedNodeId: externalSelected }: Props) {
  const [internalSelected, setInternalSelected] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [visibleTiers, setVisibleTiers] = React.useState<Set<number>>(new Set([1, 2, 3]));

  const selectedId = externalSelected !== undefined ? externalSelected : internalSelected;

  const toggleTier = (tier: number) => {
    if (tier === 1) return; // tier 1 is always visible
    setVisibleTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const isNodeVisible = (node: ConceptNode) =>
    node.tier === 1 || visibleTiers.has(node.tier);

  const isEdgeVisible = (edge: (typeof conceptEdges)[0]) => {
    const src = conceptNodes.find((n) => n.id === edge.source);
    const tgt = conceptNodes.find((n) => n.id === edge.target);
    return (
      src && tgt && isNodeVisible(src) && isNodeVisible(tgt)
    );
  };

  const handleNodeClick = (node: ConceptNode) => {
    const newId = internalSelected === node.id ? null : node.id;
    setInternalSelected(newId);
    onNodeSelect?.(newId ? node : null);
  };

  const isHighlighted = (id: string) => {
    if (!selectedId) return true;
    if (id === selectedId) return true;
    return conceptEdges.some(
      (e) => (e.source === selectedId && e.target === id) || (e.target === selectedId && e.source === id)
    );
  };

  const isEdgeHighlighted = (edge: (typeof conceptEdges)[0]) => {
    if (!selectedId) return true;
    return edge.source === selectedId || edge.target === selectedId;
  };

  const stats = React.useMemo(() => {
    const visibleNodes = conceptNodes.filter(isNodeVisible);
    const visibleEdges = conceptEdges.filter(isEdgeVisible);
    const dEdges = visibleEdges.filter((e) => e.label.startsWith('D'));
    const sEdges = visibleEdges.filter((e) => e.label.startsWith('S'));
    return { nodes: visibleNodes.length, dEdges: dEdges.length, sEdges: sEdges.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleTiers]);

  return (
    <div className="flex h-full flex-col">
      {/* Controls bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">레이어</span>
          {[1, 2, 3].map((tier) => {
            const labels = ['', '핵심', '2차', '배제'];
            const active = tier === 1 || visibleTiers.has(tier);
            return (
              <button
                key={tier}
                onClick={() => toggleTier(tier)}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-[#8C2822] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                } ${tier === 1 ? 'cursor-default' : ''}`}
              >
                L{tier} {labels[tier]}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>개념 {stats.nodes}</span>
          <span>결정관계 {stats.dEdges}</span>
          <span>의미관계 {stats.sEdges}</span>
        </div>
      </div>

      {/* SVG Map */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <svg
          viewBox="0 0 1700 1160"
          className="h-full w-full min-h-[600px]"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={COLORS.edge} />
            </marker>
            <marker
              id="arrow-dim"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#ccc" />
            </marker>
          </defs>

          {/* Title */}
          <text x="850" y="35" textAnchor="middle" fill="#8C2822" fontSize="15" fontWeight="700">
            칸트 『도덕형이상학 정초』 1부 — 개념 지도
          </text>
          <text x="850" y="55" textAnchor="middle" fill="#4B4B4B" fontSize="10">
            결정 관계 D1–D9 + 의미적 관계 S1–S5 적용
          </text>

          {/* Edges */}
          {conceptEdges.filter(isEdgeVisible).map((edge) => {
            const highlighted = isEdgeHighlighted(edge);
            const color = highlighted ? COLORS.edge : '#d1d5db';
            const markerUrl = highlighted ? 'url(#arrow)' : 'url(#arrow-dim)';
            return (
              <g key={edge.id} style={{ transition: 'opacity 0.2s' }}>
                <path
                  d={edge.path}
                  fill="none"
                  stroke={color}
                  strokeWidth={highlighted ? 2 : 1.5}
                  strokeLinecap="round"
                  markerEnd={markerUrl}
                />
                {/* Edge label */}
                {highlighted && (
                  <g>
                    <rect
                      x={edge.labelX - 36}
                      y={edge.labelY - 10}
                      width={72}
                      height={20}
                      fill={COLORS.label.bg}
                      rx={4}
                    />
                    <text
                      x={edge.labelX}
                      y={edge.labelY + 4}
                      textAnchor="middle"
                      fill={COLORS.label.text}
                      fontSize={9}
                      fontWeight="500"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {conceptNodes.filter(isNodeVisible).map((node) => {
            const highlighted = isHighlighted(node.id);
            const isSelected = node.id === selectedId;
            const isHovered = node.id === hoveredId;
            const colors = COLORS[node.type];
            const opacity = highlighted ? 1 : 0.35;

            if (node.type === 'center') {
              return (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer', opacity, transition: 'opacity 0.2s' }}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ellipse
                    cx={node.cx}
                    cy={node.cy}
                    rx={75}
                    ry={75}
                    fill={colors.fill}
                    stroke={isSelected || isHovered ? '#fff' : colors.stroke}
                    strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
                    style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(140,40,34,0.6))' : undefined }}
                  />
                  <text
                    x={node.cx}
                    y={node.cy - 5}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize={13}
                    fontWeight="700"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.cx}
                    y={node.cy + 12}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize={9}
                    fontStyle="italic"
                  >
                    {node.sublabel}
                  </text>
                </g>
              );
            }

            const w = node.type === 'excluded' ? 175 : 180;
            const h = node.type === 'excluded' ? 65 : 65;
            const rx2 = 10;

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer', opacity, transition: 'opacity 0.2s' }}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <rect
                  x={node.cx - w / 2}
                  y={node.cy - h / 2}
                  width={w}
                  height={h}
                  rx={rx2}
                  ry={rx2}
                  fill={colors.fill}
                  stroke={isSelected || isHovered ? '#fff' : colors.stroke}
                  strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 2}
                  style={{ filter: isSelected ? 'drop-shadow(0 0 6px rgba(140,40,34,0.5))' : undefined }}
                />
                <text
                  x={node.cx}
                  y={node.cy - 5}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={node.type === 'primary' ? 12 : 11}
                  fontWeight={node.type === 'primary' ? 600 : 500}
                >
                  {node.label}
                </text>
                <text
                  x={node.cx}
                  y={node.cy + 12}
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize={9}
                  fontStyle="italic"
                >
                  {node.sublabel}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform="translate(1000, 990)">
            <rect x="0" y="0" width="660" height="150" fill="#fff" stroke="#AA2E26" strokeWidth="1.5" rx="8" />
            <text x="330" y="22" textAnchor="middle" fill="#8C2822" fontSize="11" fontWeight="700">
              범례 — 관계 유형
            </text>
            <text x="20" y="50" fill="#8C2822" fontSize="9" fontWeight="700">결정 관계 (D)</text>
            {[
              ['D3 정초', 'A가 B의 형이상학적 토대', 0],
              ['D4 조건', 'A가 B의 가능 조건', 75],
              ['D7 배제', '침묵 속의 배제 (가추)', 150],
              ['D9 규범', 'A가 B의 당위를 결정', 225],
            ].map(([tag, desc, xOff]) => (
              <g key={tag as string} transform={`translate(${20 + (xOff as number)}, 60)`}>
                <rect x="0" y="0" width="60" height="18" fill="#8C2822" rx="3" />
                <text x="30" y="13" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="500">{tag}</text>
                <text x="0" y="30" fill="#4B4B4B" fontSize="8">{desc}</text>
              </g>
            ))}
            <text x="20" y="110" fill="#8C2822" fontSize="9" fontWeight="700">의미적 관계 (S)</text>
            {[
              ['S2 친연성', '주제적 친연성', 0],
              ['S3 대립', '개념적 대립쌍', 75],
            ].map(([tag, desc, xOff]) => (
              <g key={tag as string} transform={`translate(${20 + (xOff as number)}, 118)`}>
                <rect x="0" y="0" width="60" height="18" fill="#8C2822" rx="3" />
                <text x="30" y="13" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="500">{tag}</text>
                <text x="0" y="30" fill="#4B4B4B" fontSize="8">{desc}</text>
              </g>
            ))}
            <text x="380" y="50" fill="#8C2822" fontSize="9" fontWeight="700">노드 유형</text>
            <ellipse cx="397" cy="72" rx="12" ry="12" fill="#AA2E26" />
            <text x="415" y="76" fill="#4B4B4B" fontSize="8">중심 개념</text>
            <rect x="380" y="85" width="16" height="16" fill="#DD524C" rx="2" />
            <text x="402" y="97" fill="#4B4B4B" fontSize="8">1차 범주</text>
            <rect x="380" y="105" width="16" height="16" fill="#F6CFD3" stroke="#CF364C" rx="2" />
            <text x="402" y="117" fill="#4B4B4B" fontSize="8">2차 개념</text>
            <rect x="440" y="85" width="16" height="16" fill="#F6CCCB" stroke="#CA3A31" rx="2" />
            <text x="462" y="97" fill="#4B4B4B" fontSize="8">D7 배제된 가능성</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
