export type NodeType = 'center' | 'primary' | 'secondary' | 'excluded';

export type ConceptNode = {
  id: string;
  label: string;
  sublabel: string;
  cx: number;
  cy: number;
  type: NodeType;
  tier: 1 | 2 | 3;
  description: string;
};

export type ConceptEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  path: string;
  labelX: number;
  labelY: number;
  tier: 1 | 2 | 3;
};

export const conceptNodes: ConceptNode[] = [
  // Center (tier 1)
  {
    id: 'goodwill',
    label: '선의지',
    sublabel: 'der gute Wille',
    cx: 850,
    cy: 580,
    type: 'center',
    tier: 1,
    description:
      '이 세계 안에서 무제한적으로 선하다고 볼 수 있는 유일한 것. 도덕적 가치의 근원이며, 결과나 경향성과 무관하게 그 자체로 선하다. 칸트 도덕철학의 절대적 출발점.',
  },

  // Primary nodes (tier 1)
  {
    id: 'moral_value',
    label: '도덕적 가치',
    sublabel: 'sittlicher Wert',
    cx: 850,
    cy: 312,
    type: 'primary',
    tier: 1,
    description:
      '행위의 도덕적 가치는 선의지에서 비롯된다. 결과나 목적이 아닌 의무로부터의 행위만이 진정한 도덕적 가치를 갖는다.',
  },
  {
    id: 'duty',
    label: '의무',
    sublabel: 'Pflicht',
    cx: 1190,
    cy: 412,
    type: 'primary',
    tier: 1,
    description:
      '도덕 법칙에 대한 존경에서 비롯된 행위의 필연성. 선의지가 유한한 이성적 존재에게 나타나는 방식. 경향성에도 불구하고, 경향성 없이도 행위하게 하는 힘.',
  },
  {
    id: 'moral_law',
    label: '도덕 법칙',
    sublabel: 'Sittengesetz',
    cx: 1190,
    cy: 712,
    type: 'primary',
    tier: 1,
    description:
      '이성에서 도출되는 보편적·필연적 도덕 원리. "네 행위의 준칙이 동시에 보편적 자연법칙이 될 수 있도록 행위하라"는 정언명령으로 표현된다.',
  },
  {
    id: 'silent_negation',
    label: '침묵의 부정',
    sublabel: 'Negative Positings',
    cx: 460,
    cy: 712,
    type: 'primary',
    tier: 1,
    description:
      '선의지를 규정함으로써 침묵 속에서 배제되는 다른 가능성들. 한 개념의 정립이 다른 가능성들의 배제를 수반한다는 가추적 분석 개념. (D7 배제)',
  },
  {
    id: 'natural_gifts',
    label: '자연 천부',
    sublabel: 'Naturgaben',
    cx: 460,
    cy: 412,
    type: 'primary',
    tier: 1,
    description:
      '지성, 용기, 판단력 등 인간이 자연적으로 가지는 능력과 재능. 그것들 자체로는 선하지도 나쁘지도 않으며, 선의지가 없으면 오히려 해악의 도구가 될 수 있다.',
  },

  // Secondary nodes (tier 2)
  {
    id: 'unconditional_good',
    label: '무조건적 선',
    sublabel: 'unbedingt Gutes',
    cx: 575,
    cy: 180,
    type: 'secondary',
    tier: 2,
    description:
      '어떤 조건이나 결과와 무관하게 선한 것. 칸트에 따르면 선의지만이 이 자격을 갖는다. 다른 모든 선(건강, 행복, 지혜 등)은 조건부로만 선하다.',
  },
  {
    id: 'happiness',
    label: '행복',
    sublabel: 'Glückseligkeit',
    cx: 845,
    cy: 110,
    type: 'secondary',
    tier: 2,
    description:
      '인간이 자연적으로 추구하는 경험적 목적. 그 자체로 나쁘지는 않지만, 도덕적 가치의 원천이 될 수 없다. 선의지 없는 행복한 존재는 오히려 교만해질 수 있다.',
  },
  {
    id: 'willing',
    label: '의욕함',
    sublabel: 'Wollen',
    cx: 1105,
    cy: 180,
    type: 'secondary',
    tier: 2,
    description:
      '의지의 작용. 선의지의 의욕함은 결과와 무관하게 도덕적 가치를 갖는다. "보석처럼 빛나는" 선의지의 핵심은 바로 이 의욕함 자체에 있다.',
  },
  {
    id: 'respect',
    label: '존경',
    sublabel: 'Achtung',
    cx: 1460,
    cy: 280,
    type: 'secondary',
    tier: 2,
    description:
      '도덕 법칙에 대한 유일한 도덕적 감정. 경향성이 아닌 이성에서 비롯된다. 의무로부터의 행위가 갖는 특유한 감정적 반응.',
  },
  {
    id: 'maxim',
    label: '준칙',
    sublabel: 'Maxime',
    cx: 1460,
    cy: 370,
    type: 'secondary',
    tier: 2,
    description:
      '개인이 행위의 지침으로 삼는 주관적 원리. 정언명령의 보편화 공식에 의해 검증되어야 한다. 보편 법칙이 될 수 있는 준칙만이 도덕적이다.',
  },
  {
    id: 'intention',
    label: '의도',
    sublabel: 'Absicht',
    cx: 1460,
    cy: 460,
    type: 'secondary',
    tier: 2,
    description:
      '행위자가 행위를 통해 달성하려는 목적. 칸트에서 의도보다 준칙이 도덕성의 기준이 된다. 의도가 선하더라도 준칙이 보편화 불가능하면 도덕적이지 않을 수 있다.',
  },
  {
    id: 'inclination',
    label: '경향성',
    sublabel: 'Neigung',
    cx: 1460,
    cy: 550,
    type: 'secondary',
    tier: 2,
    description:
      '감각적 욕구와 충동. 의무와 대립되는 것으로, 도덕적 가치의 원천이 될 수 없다. 경향성에서 비롯된 행위는 합법적일 수 있지만 도덕적 가치를 갖지 않는다.',
  },
  {
    id: 'action',
    label: '행위',
    sublabel: 'Handlung',
    cx: 1460,
    cy: 690,
    type: 'secondary',
    tier: 2,
    description:
      '도덕 법칙의 외적 실천. 행위의 도덕성은 그 형식(준칙의 보편화 가능성)에 달려 있지, 결과나 내용에 달려 있지 않다.',
  },
  {
    id: 'will',
    label: '의지',
    sublabel: 'Wille',
    cx: 1460,
    cy: 780,
    type: 'secondary',
    tier: 2,
    description:
      '이성적 존재의 능력. 이성에 따라 행위하는 능력. 선의지는 완전히 이성에 의해 규정된 의지이며, 이것이 도덕의 최고 원리다.',
  },
  {
    id: 'necessity',
    label: '필연성',
    sublabel: 'Notwendigkeit',
    cx: 1460,
    cy: 870,
    type: 'secondary',
    tier: 2,
    description:
      '도덕 법칙이 갖는 특성. 경험적 조건에 의존하지 않는 선험적·보편적 필연성. 이것이 도덕 법칙을 자연 법칙과 구분하는 특징이다.',
  },
  {
    id: 'intellect',
    label: '지성',
    sublabel: 'Verstand',
    cx: 230,
    cy: 310,
    type: 'secondary',
    tier: 2,
    description:
      '자연 천부에 포함되는 인지 능력. 그 자체로는 선하지도 나쁘지도 않다. 선의지 없이는 교활함과 이기심의 도구가 될 수 있다.',
  },
  {
    id: 'courage',
    label: '용기',
    sublabel: 'Mut',
    cx: 230,
    cy: 410,
    type: 'secondary',
    tier: 2,
    description:
      '자연 천부에 포함되는 기질. 선의지 없이는 범죄자나 폭군의 위험한 특성이 된다. 용기가 선한 것은 오직 선의지가 그것을 인도할 때뿐이다.',
  },
  {
    id: 'judgment',
    label: '판단력',
    sublabel: 'Urteilskraft',
    cx: 230,
    cy: 510,
    type: 'secondary',
    tier: 2,
    description:
      '특수와 보편을 연결하는 능력. 선의지가 없으면 교활함(Schlauheit)으로 변질될 수 있다. 천부적 능력들은 선의지에 의해 비로소 도구적 선이 된다.',
  },

  // Excluded possibilities (tier 3 — D7 침묵의 부정)
  {
    id: 'good_as_happiness',
    label: '행복으로서의 선',
    sublabel: '(아리스토텔레스적)',
    cx: 137,
    cy: 902,
    type: 'excluded',
    tier: 3,
    description:
      '아리스토텔레스적 관점: 선을 행복(eudaimonia)으로 정의. 칸트는 행복이 경험적이고 조건부이므로 도덕의 무조건적 원리가 될 수 없다고 배제한다.',
  },
  {
    id: 'good_as_utility',
    label: '효용으로서의 선',
    sublabel: '(공리주의적)',
    cx: 339,
    cy: 902,
    type: 'excluded',
    tier: 3,
    description:
      '공리주의적 관점: 선을 최대 효용(최대 다수의 최대 행복)으로 정의. 칸트는 이를 결과주의적이고 경험적이라는 이유로 배제한다.',
  },
  {
    id: 'divine_command',
    label: '신의 명령',
    sublabel: '(신학적 자발주의)',
    cx: 541,
    cy: 902,
    type: 'excluded',
    tier: 3,
    description:
      '신학적 자발주의: 선을 신의 명령으로 정의. 칸트는 도덕의 자율성(Autonomie)을 강조하며 이를 배제한다. 외부의 명령에 따르는 것은 타율(Heteronomie)이다.',
  },
  {
    id: 'moral_sentiment',
    label: '도덕 감정',
    sublabel: '(Hume적)',
    cx: 137,
    cy: 1047,
    type: 'excluded',
    tier: 3,
    description:
      'Hume적 관점: 도덕을 감정(공감, 시인/부인의 정서)에 근거시킴. 칸트는 감정이 경험적이고 보편적이지 않으므로 도덕의 근거가 될 수 없다고 주장한다.',
  },
  {
    id: 'social_custom',
    label: '사회적 관습',
    sublabel: '(사회학적)',
    cx: 339,
    cy: 1047,
    type: 'excluded',
    tier: 3,
    description:
      '사회학적 관점: 도덕을 사회적 관습과 합의로 환원. 칸트는 선험적 도덕의 보편성과 필연성을 주장하며 이를 배제한다. 관습은 상대적이고 변화한다.',
  },
  {
    id: 'irrational_choice',
    label: '비합리적 선택',
    sublabel: '(실존주의적)',
    cx: 541,
    cy: 1047,
    type: 'excluded',
    tier: 3,
    description:
      '실존주의적 관점: 도덕을 비합리적 개인의 선택과 결단에 근거시킴. 칸트는 이성의 도덕적 역할을 강조하며 이를 배제한다.',
  },
];

export const conceptEdges: ConceptEdge[] = [
  // 선의지 → primary nodes
  {
    id: 'e-gw-mv',
    source: 'goodwill',
    target: 'moral_value',
    label: 'D9 규범',
    path: 'M 850,505 L 850,345',
    labelX: 850,
    labelY: 425,
    tier: 1,
  },
  {
    id: 'e-gw-duty',
    source: 'goodwill',
    target: 'duty',
    label: 'D3 정초',
    path: 'M 912,538 L 1100,412',
    labelX: 1010,
    labelY: 475,
    tier: 1,
  },
  {
    id: 'e-gw-ml',
    source: 'goodwill',
    target: 'moral_law',
    label: 'S2 친연성',
    path: 'M 916,615 L 1100,712',
    labelX: 1010,
    labelY: 665,
    tier: 1,
  },
  {
    id: 'e-gw-sn',
    source: 'goodwill',
    target: 'silent_negation',
    label: 'D7 배제',
    path: 'M 781,610 L 550,712',
    labelX: 666,
    labelY: 665,
    tier: 1,
  },
  {
    id: 'e-gw-ng',
    source: 'goodwill',
    target: 'natural_gifts',
    label: 'D4 조건',
    path: 'M 784,543 L 550,412',
    labelX: 668,
    labelY: 478,
    tier: 1,
  },

  // 도덕적 가치 → secondary
  {
    id: 'e-mv-ug',
    source: 'moral_value',
    target: 'unconditional_good',
    label: 'S2 친연성',
    path: 'M 780,282 L 605,210',
    labelX: 693,
    labelY: 250,
    tier: 2,
  },
  {
    id: 'e-mv-hap',
    source: 'moral_value',
    target: 'happiness',
    label: 'S3 대립',
    path: 'M 850,280 L 845,140',
    labelX: 848,
    labelY: 214,
    tier: 2,
  },
  {
    id: 'e-mv-will',
    source: 'moral_value',
    target: 'willing',
    label: 'D2 구성',
    path: 'M 920,282 L 1085,210',
    labelX: 1002,
    labelY: 250,
    tier: 2,
  },

  // 의무 → secondary
  {
    id: 'e-duty-resp',
    source: 'duty',
    target: 'respect',
    label: 'D5 매개',
    path: 'M 1280,395 L 1380,280',
    labelX: 1330,
    labelY: 342,
    tier: 2,
  },
  {
    id: 'e-duty-max',
    source: 'duty',
    target: 'maxim',
    label: 'D3 정초',
    path: 'M 1280,405 L 1380,370',
    labelX: 1330,
    labelY: 392,
    tier: 2,
  },
  {
    id: 'e-duty-int',
    source: 'duty',
    target: 'intention',
    label: 'S3 대립',
    path: 'M 1280,425 L 1380,460',
    labelX: 1330,
    labelY: 447,
    tier: 2,
  },
  {
    id: 'e-duty-incl',
    source: 'duty',
    target: 'inclination',
    label: 'D6 변증법',
    path: 'M 1280,440 L 1380,550',
    labelX: 1330,
    labelY: 498,
    tier: 2,
  },

  // 도덕 법칙 → secondary
  {
    id: 'e-ml-act',
    source: 'moral_law',
    target: 'action',
    label: 'D9 규범',
    path: 'M 1280,700 L 1380,690',
    labelX: 1330,
    labelY: 685,
    tier: 2,
  },
  {
    id: 'e-ml-will',
    source: 'moral_law',
    target: 'will',
    label: 'D2 구성',
    path: 'M 1280,715 L 1380,780',
    labelX: 1330,
    labelY: 752,
    tier: 2,
  },
  {
    id: 'e-ml-nec',
    source: 'moral_law',
    target: 'necessity',
    label: 'D4 조건',
    path: 'M 1280,730 L 1380,870',
    labelX: 1330,
    labelY: 804,
    tier: 2,
  },

  // 자연 천부 → secondary
  {
    id: 'e-ng-int',
    source: 'natural_gifts',
    target: 'intellect',
    label: 'D2 포함',
    path: 'M 370,400 L 310,310',
    labelX: 340,
    labelY: 359,
    tier: 2,
  },
  {
    id: 'e-ng-cou',
    source: 'natural_gifts',
    target: 'courage',
    label: 'D2 포함',
    path: 'M 370,415 L 310,410',
    labelX: 340,
    labelY: 417,
    tier: 2,
  },
  {
    id: 'e-ng-jud',
    source: 'natural_gifts',
    target: 'judgment',
    label: 'D2 포함',
    path: 'M 370,430 L 310,510',
    labelX: 340,
    labelY: 474,
    tier: 2,
  },

  // 침묵의 부정 → excluded (tier 3)
  {
    id: 'e-sn-gh',
    source: 'silent_negation',
    target: 'good_as_happiness',
    label: 'N1 배제',
    path: 'M 400,745 L 137,870',
    labelX: 255,
    labelY: 818,
    tier: 3,
  },
  {
    id: 'e-sn-gu',
    source: 'silent_negation',
    target: 'good_as_utility',
    label: 'N2 배제',
    path: 'M 440,745 L 340,870',
    labelX: 385,
    labelY: 818,
    tier: 3,
  },
  {
    id: 'e-sn-dc',
    source: 'silent_negation',
    target: 'divine_command',
    label: 'N3 배제',
    path: 'M 480,745 L 542,870',
    labelX: 515,
    labelY: 818,
    tier: 3,
  },
  {
    id: 'e-gh-ms',
    source: 'good_as_happiness',
    target: 'moral_sentiment',
    label: 'N4 배제',
    path: 'M 137,935 L 137,1015',
    labelX: 137,
    labelY: 979,
    tier: 3,
  },
  {
    id: 'e-gu-sc',
    source: 'good_as_utility',
    target: 'social_custom',
    label: 'N5 배제',
    path: 'M 340,935 L 340,1015',
    labelX: 340,
    labelY: 979,
    tier: 3,
  },
  {
    id: 'e-dc-ic',
    source: 'divine_command',
    target: 'irrational_choice',
    label: 'N6 배제',
    path: 'M 542,935 L 542,1015',
    labelX: 542,
    labelY: 979,
    tier: 3,
  },
];
