# 철학 텍스트 분석 AI 에이전트 구축 안내서 (v2)
## — 규정 이론(theory of determination) + 가추 기반 개념 지도, 논증 추출, 페르소나 음성 대화 시스템

이 문서는 본 시스템을 처음 구축하는 개발자가 읽고 바로 작업에 착수할 수 있도록 작성되었다. 프로젝트의 *왜*(목적), *무엇*(기능), *어떻게*(설계와 구현)를 모두 다룬다. 철학적 배경에 익숙하지 않더라도 본 문서만으로 작업이 가능하도록, 필요한 개념은 그때그때 정의한다.

본 v2 안내서는 v1의 핵심 파이프라인(개념 지도)에 더해 (a) 논증 추출, (b) 페르소나 기반 대화, (c) 한국어·영어 음성 인터페이스, (d) 퍼스의 가추 이론에 근거한 추론 모듈을 포함한다. 시스템의 규모가 커진 만큼 단계적 구현이 중요하다(8절 로드맵 참고).

---

## 0. 한눈에 보는 프로젝트

**입력**: 철학 텍스트 (논문 한 편, 책 한 챕터, 또는 단락 단위)

**출력 (세 층위)**:
- **분석 층**: 인터랙티브 개념 지도 + 논증 구조 + 분석 보고서
- **추론 층**: 가추적 가설들의 목록 (잠재 결정 관계, 암묵적 가정, 저자 입장 가설)
- **대화 층**: 철학자 페르소나와의 텍스트/음성 대화 세션

**핵심 차별성**:

1. 일반적 LLM 요약과 달리, *규정 관계*(determination relation)라는 특정한 분석 단위를 알고리즘에 내장한다. "규정"은 헤겔의 Bestimmung 의미이며, 형이상학적 결정론(determinism)과 구별된다.
2. 일반적 요약과 달리, *압축이 아니라 지도화*를 채택한다 — 모든 요소를 보존하고 사용자가 탐색하도록 한다.
3. 퍼스의 가추 이론에 따라, 시스템의 역할을 *권위 있는 분석가*가 아니라 *인간의 인지적 비대칭을 보충하는 가추 협력자*로 설정한다.
4. 페르소나 대화(음성 포함)를 통해 단일 분석 결과가 아니라 *복수의 철학적 시각*을 제공한다.

---

## 1. 핵심 개념의 작업적 정의

### 1.1 규정 관계 (determination relation)

본 시스템의 핵심 분석 단위. 두 개념 A, B에 대해, A의 정립·변화·존재가 B의 그것을 조건짓거나 산출하거나 정초할 때 "A가 B를 규정한다(A→B)"고 한다. 한국어로 "결정 관계"로도 번역되며, 본 안내서에서는 두 표현을 혼용한다. 부정으로서의 규정 측면(스피노자 *omnis determinatio est negatio*)도 추출 대상이다 — 한 개념의 정립이 다른 가능성들의 침묵 속 배제와 함께 일어나는 경우.

**검출해야 하는 표지 (예시, 한정적이지 않음)**:

영어:
- 직접: *determine, determines, determined by, determination*
- 인과/생성: *cause, produce, generate, give rise to, engender*
- 조건/전제: *condition, presuppose, require, depend on, predicated on*
- 정초/토대: *ground, found, base on, root in, rest on, underlie*
- 구성: *constitute, comprise, form, make up*
- 구조화: *structure, shape, mold*
- 필연/함축: *necessitate, entail, imply, follow from*

한국어:
- 직접: *규정하다, 결정하다, 한정하다*
- 인과/생성: *야기하다, 일으키다, 산출하다, 발생시키다, 낳다, 가져오다*
- 조건/전제: *조건짓다, 전제하다, 요구하다, 의존하다, ~에 달려 있다*
- 정초/토대: *정초하다, 근거짓다, 기초하다, ~에 토대를 두다*
- 구성: *구성하다, 형성하다, 이루다*
- 구조화: *구조화하다, 형태짓다*
- 필연/함축: *함축하다, 수반하다, 필연적으로 따르다, 귀결되다*

쌍방향 결정의 표지:
- 영어: *mutually determine, co-constitute, reciprocal, dialectical, interdependent*
- 한국어: *상호규정, 상호결정, 상호구성, 변증법적, 서로 ~한다*

**중요**: 단순 키워드 매칭은 절대 사용하지 말 것. 위 표지들은 LLM에 대한 *예시 어휘*로 제공하되, 실제 검출은 LLM의 의미 이해에 위임한다.

### 1.2 개념 (concept)

본 시스템에서 "개념"은 단순한 명사가 아니라 **철학적 전문 용어(term of art)**를 가리킨다. 판정 기준 (LLM에게 프롬프트로 전달):
- 텍스트 내에서 정의되거나 논증의 대상이 되는 용어
- 철학사적 맥락에서 전문 용어로 사용되는 표현
- 단순 일상어, 고유명사, 접속사는 제외

### 1.3 논증 (argument)

본 시스템에서 "논증"은 다음 구조를 가진다:
- **전제(premises)**: 결론을 지지하는 명제들
- **결론(conclusion)**: 전제로부터 도출되는 명제
- **추론 단계(inferential steps)**: 전제에서 결론으로 가는 중간 단계들 (있을 경우)
- **암묵적 가정(implicit assumptions)**: 텍스트에 명시되지 않았으나 추론의 성립을 위해 전제되어야 하는 명제들

후자(암묵적 가정)는 일반적인 LLM 추출과 달리 *적극적으로 가추되어야* 한다. 이는 1.5에서 다룰 가추 이론에 의해 정당화된다.

### 1.4 페르소나 (persona)

해당 철학자의 분석 방법과 사유 스타일을 체현하는 대화 상대. 핵심 속성:
- **체현된 방법(embodied method)**: 소크라테스의 elenchus, 칸트의 초월적 질문법, 헤겔의 변증법 등
- **시대적·인식론적 한계(epistemic boundary)**: 해당 철학자가 알 수 없거나 사용하지 않았을 개념·구분
- **언어 스타일(linguistic style)**: 어휘, 통사적 특징, 수사적 경향
- **음성 프로파일(voice profile)**: TTS에 사용되는 음성 특성 (한국어/영어 각각)
- **참조 코퍼스(reference corpus)**: 페르소나 응답의 RAG 기반이 되는 해당 철학자의 실제 텍스트

### 1.5 가추 (abduction)

퍼스의 추론 분류에 따른, 놀라운 사실을 가장 잘 설명하는 가설을 형성하는 추론. 본 시스템의 모든 *추론적 산출물*은 가추로 분류된다 — 즉 *최선의 설명에 대한 가설*이며 *오류 가능한 잠정적 결론*이다.

**구현 기준 — Salimi et al. (2026) 두 단계 정식화 채택**:

본 시스템은 LLM 가추의 종합 서베이 (Salimi et al., 2026)가 제안한 두 단계 정식화를 명시적으로 채택한다:

- **Stage I — Hypothesis Generation**: 관찰(텍스트의 특정 패턴 등)에 대해 가능한 설명 가설들의 집합 H = {h₁, h₂, ..., hₙ}을 생성
- **Stage II — Hypothesis Selection**: 생성된 가설들을 *설명적 미덕*(simplicity, coherence, predictive power, freedom from ad hoc elements)으로 평가하여 최선의 가설 h*을 선택

시스템 내부에서 Stage I은 LLM이 자율적으로 수행하고, Stage II는 사용자의 검토·승인·기각 단계로 외부화된다. 이는 가추 검증의 권위를 인간에게 환원시키는 *협력적 가추(collaborative abduction)* 모델이다.

**시스템의 가추 산출 유형**:
1. **잠재 결정 관계의 가추**: 명시적 관계로부터의 전이성, 공통 원천, 양립불가능, 의미장 근접성 추론 (Stage I)
2. **암묵적 가정의 가추**: 논증의 결론과 명시 전제 사이의 격차를 메우는 가정 (Stage I)
3. **저자 입장의 가추**: 텍스트의 여러 진술을 통합하는 더 깊은 입장의 가설화 (Stage I + 부분 Stage II)
4. **확장 함의의 가추**: 텍스트의 입장이 다른 영역에 적용될 때의 함의 (Stage I)
5. **침묵의 부정 가추** (NEW): 한 규정이 성립함으로써 침묵 속에서 배제된 가능성들 추론. 이는 3.2 부정으로서의 규정 통찰의 직접 구현이다.

모든 가추 산출물은 다음 메타데이터를 포함한다: 추론 유형 (Stage I/II 표시), 근거(원천 명제들), 신뢰도, 대안 가설 (있을 경우).

**비교 참조 — PEIRCE 프레임워크 (Quan et al., 2025)**: PEIRCE 신경-기호 프레임워크는 같은 generation-selection 사이클을 *conjecture-criticism*으로 부르며, *시스템 내부*에서 LLM과 외부 비평기(symbolic prover, semantic evaluator)의 상호작용으로 구현한다. 본 시스템은 같은 사이클을 채택하되, *비평* 단계를 페르소나 대화를 통한 인간 검증으로 외부화한다는 점에서 다르다.

---

## 2. 기술 스택 권장안

| 영역 | MVP 권장 | 프로덕션 대안 |
|------|----------|----------------|
| 언어 | Python 3.11+ | 동일 |
| LLM | Claude API (Anthropic), `claude-opus-4-7` 또는 `claude-sonnet-4-6` | OpenAI/Gemini 병용 가능 |
| 그래프 | NetworkX | Neo4j (대규모) |
| 그래프 시각화 | Pyvis (HTML) / Cytoscape.js | D3.js 커스텀, React Flow |
| 백엔드 | FastAPI | 동일 |
| 프론트엔드 | Streamlit (MVP) | React + Next.js (Miller 2026 참조) |
| 데이터 검증 | Pydantic v2 | 동일 |
| 텍스트 입력 | python-docx, pypdf, plain text | 동일 |
| 저장소 | JSON 파일 (프로젝트 단위) | SQLite → PostgreSQL |
| 임베딩 | sentence-transformers / Voyage AI | OpenAI embeddings |
| **음성 합성 (TTS)** | **ElevenLabs Flash v2.5** (한국어·영어 모두, ~75ms 추론, 32개 언어) | Azure Speech, Google Cloud TTS |
| **실시간 양방향 음성** | **ElevenLabs Conversational AI 2.0** (turn-taking 모델 내장, 70+ 언어) | OpenAI Realtime API (GPT-Realtime-2) |
| **음성 인식 (STT, 선택)** | ElevenLabs Scribe (한국어 지원) | OpenAI Whisper, Azure Speech |
| RAG (페르소나 참조 텍스트용) | LlamaIndex 또는 LangChain | Custom + vector DB |
| 벡터 DB (페르소나용) | Chroma (로컬, MVP) | Pinecone, Weaviate |
| 테스트 | pytest | 동일 |

### 2.1 모델 선택 가이드 (Miller, 2026 실증 데이터 기반)

Miller (2026)는 4개 모델을 5편의 철학 텍스트(Plato 4편 + Paine 1편)에 총 180회 실행한 결과로 다음 통찰을 얻었다. **본 시스템의 모델 선택은 그의 실증 결과를 직접 활용**한다.

**모델별 가격 (Miller 2025년 11월 기준, 2026년 환경에서 재확인 필요)**:

| 모델 | 입력 토큰 (USD/1M) | 출력 토큰 (USD/1M) | 권장 용도 |
|------|---------------------|---------------------|-----------|
| Claude Haiku 3.5 | 0.80 | 4.00 | argument/attack 식별, 단순 분류 |
| GPT-4.1 mini | 0.40 | 1.60 | 가성비 폴백 |
| Claude Sonnet 4.5 | 3.00 | 15.00 | proposition/규정 관계 추출, 페르소나 응답 |
| GPT-4.1 | 2.00 | 8.00 | 비교 검증 |
| Claude Opus 4.1 / 4.7 | (Sonnet의 ~5배) | (Sonnet의 ~5배) | gold set 생성, 어려운 가추 |

**Miller의 핵심 발견 — 본 시스템에 직접 적용 가능**:

1. **다중 에이전트 아키텍처는 저비용 모델일수록 더 큰 혜택을 받는다.** Haiku와 GPT-4.1 mini의 F1 개선 폭이 Sonnet과 GPT-4.1보다 크다. 따라서 비용 최적화를 위해서는 저비용 모델 + 다중 에이전트 조합이 유리하다.

2. **하이브리드 할당 전략 (Sonnet + Haiku)이 최적의 비용-성능 균형을 제공한다.** Miller의 검증된 패턴:
   - 명제 추출(어휘적 충실성 중요) → Sonnet
   - 논증/공격 식별(구조적 분류) → Haiku
   - 본 시스템 적용: 규정 관계 추출 → Sonnet, 메타데이터/분류 → Haiku, 가추 추론 → Sonnet 또는 Opus

3. **multi-agent 파이프라인은 single-agent보다 느리고 비용이 높다.** Single-agent는 평균 ~$0.04, Multi-agent는 ~$0.12-0.29 (모델에 따라). 따라서 비용이 절대적 제약일 때는 single-agent도 고려.

4. **API 토큰 한계는 실제 작업의 큰 제약이다.** Miller는 명제 수를 90개로 제한해야 했고, 시간당 rate limit 때문에 실험 간격을 1시간으로 두어야 했다. **본 시스템도 비슷한 제약에 부딪칠 것이므로, 비동기 처리와 재시도 로직을 처음부터 설계**한다.

5. **모델별 변동성이 크다.** 같은 텍스트에 대해 Opus와 GPT-5.1이 서로 다른 gold set을 생성하였다. 본 시스템도 같은 텍스트에 대해 실행마다 다른 결과를 낼 수 있으므로, *결과의 비결정성*을 사용자에게 명시한다.

### 2.2 음성 인터페이스 선정 기준

한국어와 영어를 모두 지원하면서 *음성 디자인(voice design)*이 가능해야 한다. 즉 "사색적인 노년 학자"와 같은 프롬프트로 음성을 생성할 수 있어야 한다. ElevenLabs가 현재 가장 적합하다(Voice Design 기능 제공). 비용 우려가 있다면 처음에는 ElevenLabs의 기본 음성 중 페르소나에 맞는 것을 선택하는 방식으로 시작.

**실시간 양방향 대화 (사용자 끼어들기 가능)** 구현 시 ElevenLabs Conversational AI 2.0이 권장된다 — 그들의 turn-taking 모델은 "um", "ah" 등 대화적 단서를 실시간 분석하여 자연스러운 끼어들기와 기다림을 처리한다. Flash v2.5 모델의 ~75ms 추론 지연 시간이 대화 자연성에 결정적이다.

OpenAI Realtime API (GPT-Realtime-2)도 같은 기능을 제공하며 GPT-5급 추론을 갖지만, 음성 선택이 OpenAI 기본 음성으로 제한되어 페르소나별 차별화에 약점이 있다. 따라서 음성 다양성이 중요한 본 프로젝트에서는 ElevenLabs가 권장된다.

**Claude Code 활용**: 모듈화가 잘 정의된 프로젝트이므로 Claude Code의 작업 단위로 적합하다. 특히 페르소나별 프롬프트는 별도 파일로 관리하면 반복 개선이 용이하다.

---

## 3. 데이터 모델 (Pydantic 스키마)

```python
from pydantic import BaseModel, Field
from typing import Literal, Optional
from enum import Enum
from datetime import datetime

# ============================================================
# 분석 층 (Analysis Layer)
# ============================================================

class RelationType(str, Enum):
    CAUSAL = "causal"
    CONSTITUTIVE = "constitutive"
    GROUNDING = "grounding"
    CONDITIONAL = "conditional"
    MEDIATIONAL = "mediational"
    OTHER = "other"

class Direction(str, Enum):
    UNI = "unidirectional"
    BI = "bidirectional"
    UNCERTAIN = "uncertain"

class Provenance(str, Enum):
    EXPLICIT = "explicit"       # 텍스트에 명시
    INFERRED = "inferred"       # 시스템이 가추
    DIALOGUE = "dialogue"       # 페르소나 대화 중 발견

class TextSpan(BaseModel):
    chunk_id: str
    start_char: int
    end_char: int
    text: str

class Concept(BaseModel):
    id: str
    canonical_name: str
    aliases: list[str] = []
    definition_in_text: Optional[str] = None
    first_mention: TextSpan
    all_mentions: list[TextSpan] = []
    importance_score: float = 0.0

class Relation(BaseModel):
    id: str
    source_concept_id: str
    target_concept_id: str
    relation_type: RelationType
    direction: Direction
    provenance: Provenance
    strength: float = Field(ge=0, le=1)
    evidence: list[TextSpan] = []
    inference_basis: Optional[str] = None
    lexical_marker: Optional[str] = None

class Argument(BaseModel):
    """텍스트에 명시/암시된 논증 단위."""
    id: str
    title: str  # 짧은 식별 명칭 (예: "자유의지에 대한 양립가능론 논변")
    premises: list[str]  # 자연어 명제
    premises_evidence: list[list[TextSpan]] = []  # 각 전제의 텍스트 근거
    conclusion: str
    conclusion_evidence: list[TextSpan] = []
    inferential_steps: list[str] = []  # 중간 단계 (있을 경우)
    implicit_assumptions: list[str] = []  # 가추된 암묵적 가정
    related_concept_ids: list[str] = []  # 이 논증에 관련된 개념
    provenance: Provenance  # 텍스트에 명시되었는지, 시스템이 추출했는지
    strength: float = Field(ge=0, le=1)  # 시스템의 추출 확신도

class ConceptMap(BaseModel):
    text_id: str
    text_title: str
    concepts: list[Concept]
    relations: list[Relation]
    arguments: list[Argument]
    metadata: dict

# ============================================================
# 추론 층 (Inference Layer)
# ============================================================

class AbductiveHypothesisType(str, Enum):
    LATENT_RELATION = "latent_relation"          # 잠재 결정 관계
    IMPLICIT_ASSUMPTION = "implicit_assumption"  # 암묵적 가정
    DEEPER_POSITION = "deeper_position"          # 저자 입장 가설
    EXTENDED_IMPLICATION = "extended_implication"  # 확장 함의

class AbductiveHypothesis(BaseModel):
    """가추적 가설 — 본 시스템의 모든 추론적 산출물."""
    id: str
    hypothesis_type: AbductiveHypothesisType
    statement: str  # 가설의 자연어 진술
    basis: list[str]  # 가설의 근거가 되는 원천 명제 또는 관계 id들
    inference_method: str  # 어떤 추론 방식이 사용되었는지 (예: "transitivity", "enthymeme_filling")
    confidence: float = Field(ge=0, le=1)
    alternative_hypotheses: list[str] = []  # 같은 데이터에 대한 대안 가설들
    user_validation: Optional[Literal["accepted", "modified", "rejected", "pending"]] = "pending"
    user_note: Optional[str] = None

# ============================================================
# 대화 층 (Dialogue Layer)
# ============================================================

class PersonaProfile(BaseModel):
    """페르소나의 모든 설정."""
    id: str  # 예: "socrates", "kant", "hegel", "peirce"
    display_name: str  # 예: "소크라테스"
    display_name_en: str  # 예: "Socrates"
    
    # 방법론적 특성
    method_description: str  # 어떤 방법을 사용하는지의 서술
    method_style_prompt: str  # 시스템 프롬프트에 들어갈 방법 지침
    
    # 인식론적 한계
    epistemic_boundary: str  # 어떤 시대/지식에 머물러야 하는지
    
    # 언어 스타일
    style_korean: str  # 한국어 응답 스타일 (어휘, 어조, 수사)
    style_english: str  # 영어 응답 스타일
    
    # 참조 코퍼스 (RAG용)
    reference_corpus_id: str  # 벡터 DB 컬렉션 ID
    
    # 음성 프로파일
    voice_profile_korean: "VoiceProfile"
    voice_profile_english: "VoiceProfile"

class VoiceProfile(BaseModel):
    provider: str  # 예: "elevenlabs"
    voice_id: Optional[str] = None  # 사전 정의된 음성 ID (있을 경우)
    voice_design_prompt: Optional[str] = None  # 음성 디자인 프롬프트 (없을 경우)
    speed: float = 1.0
    pitch: Optional[float] = None
    
class DialogueMessage(BaseModel):
    id: str
    role: Literal["user", "persona"]
    persona_id: Optional[str] = None  # role=persona일 때
    text: str
    text_language: Literal["ko", "en"]
    audio_url: Optional[str] = None  # 합성된 음성 파일 경로/URL
    timestamp: datetime
    citations: list[TextSpan] = []  # 페르소나가 응답시 참조한 분석 결과
    rag_sources: list[str] = []  # 페르소나가 참조한 자신의 코퍼스 소스
    
class DialogueSession(BaseModel):
    id: str
    text_id: str  # 어떤 분석 텍스트에 대한 대화인지
    persona_id: str
    messages: list[DialogueMessage]
    new_hypotheses: list[str] = []  # 대화 중 생성된 새 가추 가설 id들
    new_relations: list[str] = []  # 대화 중 발견된 새 관계 id들
    metadata: dict
```

### 3.1 스키마 설계 시 참고할 외부 모델

본 시스템의 스키마는 최근 LLM 기반 철학 텍스트 분석의 대표적 작업과 다음 점에서 비교된다.

#### Miller (2026)의 ASPIC+ 기반 스키마

Miller (2026)는 Dung 추상 논증 프레임워크 (Dung, 1995)와 ASPIC+ (Prakken, 2010; Modgil & Prakken, 2014)에서 영감을 받은 다음 3요소 스키마를 사용한다:

```python
# Miller의 스키마 — 비교 참조용
class MillerProposition(BaseModel):
    id: str
    text: str
    speaker: Optional[str] = None  # 대화체 텍스트에서 화자 추적
    source_chunk: Optional[int] = None  # 다중 에이전트에서 추출된 청크 ID

class MillerArgument(BaseModel):
    id: str
    argument_type: Literal["complete", "implicit"]  # 전제 명시 vs 결론만
    premises: list[str]  # proposition id들의 참조
    conclusion: str  # proposition id
    speaker: Optional[str] = None
    summary: Optional[str] = None  # 사람이 읽기 위한 짧은 요약

class MillerAttack(BaseModel):
    from_arg: str  # 'from' 필드 (Python 예약어 회피)
    to_arg: str    # 'to' 필드
    attack_type: Literal["rebut", "undermine"]  # ASPIC+에서 채택
    # rebut: 결론끼리의 충돌
    # undermine: 결론이 다른 논증의 전제와 충돌
    # undercut(추론 규칙 자체에 대한 공격)는 본 스키마에서 제외 — 추론 규칙이 정의되지 않으므로
    justification: str  # 공격이 왜 성립하는지의 자연어 설명
```

**본 시스템의 스키마와 Miller 스키마의 차이**:

| 차원 | Miller (2026) | 본 시스템 |
|------|---------------|----------|
| **분석 단위** | propositions, arguments, attacks | concepts, relations, arguments, hypotheses |
| **이론적 토대** | ASPIC+ (형식 논증학) | 규정 이론 + 가추 (철학적 인식론) |
| **관계 분류** | rebut, undermine (공격만) | causal, constitutive, grounding, conditional, mediational + 부정적 정립 |
| **추론 상태** | (없음) | provenance (explicit/inferred/dialogue) 명시 |
| **암묵 추출** | (제한적) | AbductiveHypothesis 명시적 모델링 |
| **대화 통합** | (없음) | DialogueSession이 새 가설/관계 생성 가능 |
| **개념 단위** | (없음, proposition 위주) | Concept 별도 모델링 (철학적 전문용어) |

본 시스템의 Concept 모델이 Miller에 없는 것은 결정적 차이이다. Miller는 명제를 분석 단위로 삼지만, 본 시스템은 *개념 간 관계*를 분석 단위로 삼기 때문이다. 이는 양 작업의 인식론적 목적의 차이 — 형식 논증 추출 vs 규정 관계의 그물망 가시화 — 의 직접 반영이다.

#### Han & Choi (2025)의 계층적 개념 분류

Han과 Choi (2025)는 개념 중요도를 3계층으로 분류하여 시각화 단계에서 활용한다:

```python
# Han & Choi의 계층적 개념 분류 — 본 시스템에 적용 권장
class ConceptTier(str, Enum):
    PRIORITY = "priority"     # 핵심 개념 (15-20%): 기본 원리, 핵심 용어
    SECONDARY = "secondary"   # 보조 개념 (40-50%): 하위 과정, 관련 이론
    TERTIARY = "tertiary"     # 맥락 요소 (30-40%): 저자 기여, 구체적 예시, 역사적 발전
```

**본 시스템의 Concept 모델에 통합 권장**:

```python
class Concept(BaseModel):
    # ... 기존 필드 ...
    tier: ConceptTier = ConceptTier.SECONDARY  # 시각화에서 노드 크기/색상 결정
    tier_rationale: Optional[str] = None  # 왜 이 계층인지의 설명
```

시각화 단계에서 PRIORITY 개념만 초기 표시하고, 사용자 클릭 시 SECONDARY와 TERTIARY를 점진적으로 노출하는 *progressive disclosure* 전략을 채택하면, Han과 Choi가 14명 통제 실험에서 입증한 **31.5% 인지 부하 감소** (NASA-TLX, p=0.00092)와 비슷한 효과를 기대할 수 있다.

#### Arias Gonzalez & DiPaola (2025)의 페르소나 episodic memory 스키마

Van Gogh 페르소나 시스템에서 사용된 정서-의미 메타데이터가 풍부한 1인칭 기억 스키마:

```python
# 페르소나 코퍼스 항목을 위한 권장 확장 스키마 (Arias Gonzalez & DiPaola 2025 참조)
class PersonaMemory(BaseModel):
    id: str
    persona_id: str
    # 원본 자료
    source_text: str  # 원전 텍스트 (예: 칸트의 KrV B25)
    source_citation: str  # 정확한 참조 정보
    # 1인칭 변환 (오프라인 사전 처리)
    first_person_narration: str  # "내가 [이 개념]을 도입한 것은..."
    # 정서-의미 메타데이터 (오프라인 사전 처리)
    affective_tone: str  # "확신", "주저", "비판적", "발견적" 등
    semantic_themes: list[str]  # 관련 주제 태그
    temporal_context: Optional[str] = None  # 저작 시기 정보
    # 검색 효율화
    embedding: Optional[list[float]] = None
```

**오프라인 풍부화 + 실시간 효율적 검색 전략**:

Arias Gonzalez와 DiPaola의 핵심 설계 통찰은 *비싼 self-reflection과 맥락 풍부화를 한 번의 오프라인 작업으로 분리하여, 실시간 대화는 단일 검색 지연 시간으로도 다단계 시스템의 깊이를 달성*하는 것이다. 본 시스템도 같은 전략을 채택한다:

1. **오프라인 단계** (페르소나 코퍼스 구축 시 1회 실행):
   - 원전 텍스트 청킹
   - 각 청크를 해당 페르소나의 1인칭 narration으로 LLM 변환
   - 정서-의미 메타데이터 자동 부착
   - 임베딩 계산 및 벡터 DB 저장

2. **실시간 단계** (사용자 대화 시 매번):
   - 사용자 질문 + 분석 결과 컨텍스트로 단일 RAG 검색
   - 검색된 사전 풍부화된 기억들로 페르소나 응답 생성
   - 목표: 0.5초 이내 응답 생성 (자연스러운 음성 대화 가능)

Van Gogh 시스템은 이 전략으로 1,774개 기억을 가지고 0.52초 프롬프트 생성을 달성하였다. 본 시스템의 4개 페르소나 각각 500-1500개 정도의 사전 풍부화된 기억이 적정 규모일 것이다.

---

## 4. 시스템 아키텍처

```
                          ┌──────────────┐
                          │  Input Text  │
                          └──────┬───────┘
                                 │
                ═════════════════ 분석 층 ═════════════════
                                 │
                ┌────────────────┴────────────────┐
                ▼                ▼                ▼
        [Preprocessing]  [Concept Extr.]  [Argument Extr.]
                │                │                │
                └────────────────┼────────────────┘
                                 ▼
                        [Relation Extraction]
                                 │
                                 ▼
                        [Graph + Argument
                          Structure]
                                 │
                ═════════════════ 추론 층 ═════════════════
                                 │
                                 ▼
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
        [Latent Relation]  [Implicit Assum.]  [Deeper Position]
         Abduction         Abduction          Abduction
                │                │                │
                └────────────────┼────────────────┘
                                 ▼
                       [Hypothesis Pool]
                                 │
                                 ▼
                       [Visualization]  ◄──┐
                                 │         │
                                 ▼         │
                              [User]       │
                                 │         │
                ═════════════════ 대화 층 ═════════════════
                                 │         │
                                 ▼         │
                          [Persona Select]│
                                 │         │
                                 ▼         │
                    [Persona Dialogue Engine]
                       (with RAG over persona corpus)
                                 │         │
                                 ▼         │
                       [TTS Voice Output]  │
                                 │         │
                                 ▼         │
                          [New Insights]───┘ (피드백 루프)
```

세 층위는 *순환적*이다: 대화 중 발견된 통찰이 분석 결과를 갱신하고, 갱신된 분석이 다시 추론과 대화의 기반이 된다.

---

## 5. 각 모듈 상세 설명

### 5.1 모듈 1: 전처리 [확장 — 실증 데이터 기반 청킹 전략]

텍스트를 의미 단위로 분할하고 위치 정보를 부여한다. PDF, DOCX, plain text 입력 지원.

**청킹 전략 — Miller (2026) + Han & Choi (2025) 실증 데이터 기반**:

Miller의 5개 텍스트 청킹 결과는 본 시스템의 청킹 정책 결정에 직접 활용 가능하다:

| Miller 처리 텍스트 | 단어 수 | 청크 수 | 청크당 평균 단어 |
|------|---------|---------|--------------------|
| The Republic 2권 발췌 | 630 | 1 | 630 |
| The Republic 3권 발췌 | 2,058 | 3 | 686 |
| Euthyphro (전문) | 6,765 | 8 | 846 |
| Crito (전문) | 5,333 | 7 | 762 |
| Common Sense 발췌 | 2,178 | 3 | 726 |

→ **권장 청크 크기**: 영문 약 700-850 단어 또는 한국어 약 1,200-1,500자 (한 청크당). 청크 경계는 *대화체 단락 끝, 챕터 표지, 단락 종료점*을 우선시한다 (Miller의 정책 직접 채택).

**Han & Choi (2025)의 처리 모드 비교**:

Han과 Choi는 같은 텍스트를 3가지 모드로 처리하여 다음 결과를 얻었다:

| 처리 모드 | 정확도 (Precision) | 재현율 (Recall) | F1 |
|-----------|--------|--------|------|
| Section-level (큰 단위) | 83.62% ⭐ | 62.18% | 71.20% ⭐ |
| Paragraph-level (작은 단위) | 57.49% | 74.51% ⭐ | 64.89% |
| Paragraph-pruned (작은 단위 + 후처리) | 66.87% | 70.92% | 68.82% |

**본 시스템 적용 권장**: 
- **개념 추출과 결정 관계 추출**: Section-level 처리 (큰 청크) — 정확도 우선
- **세부 명제 추출과 화자 추적**: Paragraph-level 처리 (작은 청크) — 재현율 우선
- **시각화 단계 노드 필터링**: Paragraph-pruned 방식의 후처리 (cosine similarity > 0.6 임계값)

### 5.2 모듈 2: 개념 추출 [확장 — Han & Choi의 계층적 분류 통합]

LLM 기반. 청크별 추출 후 전역 정규화. 

**계층적 개념 분류** (Han & Choi 2025의 검증된 비율 활용):

각 추출된 개념을 추가 LLM 호출로 다음 3계층 중 하나로 분류한다:

```
[프롬프트 — 계층 분류]
다음 개념들을 본 텍스트에서의 역할에 따라 3개 계층으로 분류하시오.
전체 개념의 분포가 대략 다음 비율이 되도록 조정하시오:
- PRIORITY (핵심 개념, 15-20%): 본 텍스트의 핵심 원리·주요 용어
- SECONDARY (보조 개념, 40-50%): 하위 과정·관련 이론·구성 요소
- TERTIARY (맥락 요소, 30-40%): 저자 기여·구체적 예시·역사적 맥락

각 분류에 대해 짧은 이유를 함께 출력하시오.
```

이 계층 정보는 시각화 단계에서 *progressive disclosure* — 초기 PRIORITY 노드만 표시, 사용자 클릭 시 SECONDARY와 TERTIARY 노출 — 의 기반이 된다. Han과 Choi의 실험에서 이 전략이 14명 사용자의 인지 부하를 31.5% 감소시켰음 (NASA-TLX, p=0.00092).

**철학 텍스트의 특이성 — Han & Choi의 외부 데이터로 정당화**:

Han과 Choi의 10개 분야 비교에서 **철학은 가장 높은 개념 밀도**를 보였다 (단위당 31.09 개념/1000단어 vs 역사 9.61, 예술 10.86). 본 시스템은 이 밀도를 처리할 수 있어야 한다 — 한 청크당 평균 25-35개의 개념을 추출하도록 프롬프트 설계.

### 5.3 모듈 3: 결정 관계 추출 [확장 — Miller의 프롬프트 노하우 통합]

작업적 정의(1.1)에 따른 LLM 기반 추출. 청크 내 + 청크 간 두 단계.

**Miller의 프롬프트 엔지니어링 발견 — 본 시스템 적용 권장**:

Miller (2026)는 LLM의 JSON 형식 일탈 문제 해결에 다음 패턴이 효과적임을 보고하였다:

1. **명령형 어휘 사용**: 단순한 "do not"이 아니라 "**Absolutely do not**", "**Unacceptable**" 사용
2. **JSON 형식 강제 명령의 반복**: 글로벌 instructions에 한 번, 태스크 프롬프트에 한 번 더 — 의도적 중복
3. **출력 한계 명시**: 최대 명제 수, 최대 논증 수, 최대 공격 수의 상한 부여 (token limit 회피)

본 시스템의 결정 관계 추출 프롬프트에 적용:

```
[글로벌 정책 — 모든 에이전트에 공통 부착]
You collaborate with other specialized agents to build a determination graph.
Policies:
- Follow user instructions precisely.
- Respond with valid JSON only; no extra prose.
- Preserve provided IDs/order unless a correction is required.
- Make minimal edits—copy inputs unchanged when already correct.
- **Absolutely do not** include any text outside the JSON.
- **Unacceptable** to include explanatory prose before or after JSON.

[관계 추출 태스크 프롬프트]
다음 텍스트에서 개념 간 *결정 관계*를 추출하시오.
... (작업적 정의 1.1의 표지 어휘 + 양태 분류) ...

[제약]
- 최대 50개 관계까지만 추출 (가장 명확한 것 우선)
- JSON 형식 외 어떤 텍스트도 출력 금지
- 각 관계는 텍스트 근거 인용을 반드시 포함
```

**다중 에이전트 vs 단일 에이전트 의사결정 (Miller의 실증 결과 활용)**:

Miller의 발견: 다중 에이전트 파이프라인은 *저비용 모델*(Haiku, GPT-4.1 mini)에서 F1 개선폭이 크고, *고비용 모델*(Sonnet, GPT-4.1)에서는 개선폭이 작다. 

본 시스템 적용:
- **MVP 단계**: 단일 에이전트(Sonnet 4.6 또는 Opus 4.7)로 시작 — 빠른 프로토타이핑
- **비용 최적화 단계**: 다중 에이전트(Haiku 4.5 사용) 전환 — 비용 절감
- **하이브리드 단계**: 명제·관계 추출은 Sonnet, 메타데이터·분류는 Haiku — Miller의 검증된 패턴

### 5.4 모듈 4: **논증 추출 [NEW]**

이 모듈은 텍스트의 *논증적 구조*를 추출한다. 개념과 관계가 정태적인 그물망이라면, 논증은 동태적인 *추론의 흐름*이다.

**5.4.1 명시적 논증의 추출**

각 청크에 대해 다음 프롬프트로 LLM에 논증 추출을 요청:

```
당신은 철학 텍스트의 논증 구조 분석 전문가입니다.

다음 텍스트 단편에서 *논증(argument)*을 추출하십시오. 논증이란 
하나 이상의 전제로부터 결론을 도출하는 추론 구조입니다.

[추출 기준]
- 명시적 논증: 텍스트에 전제와 결론이 모두 명시된 경우
- 부분 명시 논증: 결론은 있으나 일부 전제가 생략된 경우 (enthymeme)
  → 이 경우 결론과 명시 전제를 추출하고, 생략된 전제는 별도 표시

각 논증에 대해 다음 JSON으로 출력:
{
  "arguments": [
    {
      "title": "논증의 간략한 명칭",
      "premises": ["전제1", "전제2", ...],
      "premises_evidence": [["전제1 근거 인용"], ["전제2 근거 인용"], ...],
      "conclusion": "결론",
      "conclusion_evidence": ["결론 근거 인용"],
      "inferential_steps": ["중간 단계1", ...],  // 있을 경우만
      "explicit_or_implicit": "explicit | partial",
      "related_concepts": ["관련 개념 id들"]
    }
  ]
}

[원칙]
- 원본 텍스트의 표현을 변경하지 마십시오.
- 텍스트에 없는 전제를 임의로 추가하지 마십시오 (그것은 다음 단계에서 별도로 처리).
- 한 텍스트에 여러 논증이 있을 수 있습니다.

[관련 개념 리스트]
{concepts_json}

[텍스트 단편]
{chunk_text}
```

**5.4.2 암묵적 가정의 가추 (5.6 모듈로 분리 처리)**

부분 명시 논증의 *암묵적 가정*은 본 모듈이 아니라 추론 층의 모듈 6에서 처리한다. 본 모듈은 그러한 격차의 *존재만 표시*한다.

**5.4.3 논증과 개념·관계의 연계**

추출된 논증은 관련 개념의 id를 통해 개념 지도와 연결된다. 사용자는 개념을 클릭하면 그 개념이 등장하는 모든 논증을 볼 수 있어야 한다.

### 5.5 모듈 5: 그래프 구축 및 중심성 분석

(v1과 동일) NetworkX 기반. 단, 노드의 메타데이터에 "이 개념이 등장하는 논증 id 리스트"가 추가됨.

### 5.6 모듈 6: **가추적 추론 [확장]**

v1의 잠재 관계 추론에 더해, 다음 추론 유형을 추가한다.

**5.6.1 잠재 결정 관계 (v1과 동일)**: 전이성, 공통 원천, 양립불가능, 의미장 근접성

**5.6.2 암묵적 가정의 가추**

부분 명시 논증에 대해, 결론과 명시 전제 사이의 추론적 격차를 메우는 가정을 가추한다.

```
당신은 논증 분석 전문가이자 가추적 추론에 능숙한 분석가입니다.

다음 논증은 결론이 명시 전제만으로는 도출되지 않습니다. 결론이 따라 
나오기 위해 추가로 전제되어야 하는 *암묵적 가정*을 가추하십시오.

가추는 *최선의 설명* 추론입니다. 즉, 결론이 어떻게 가능한가를 가장 잘 
설명하는 추가 전제를 찾는 것입니다. 단일 가설이 아니라 가능한 여러 가설을 
제시하고 가장 그럴듯한 것을 표시하십시오.

[출력 형식]
{
  "implicit_assumptions": [
    {
      "statement": "가추된 암묵적 가정",
      "rationale": "왜 이 가정이 필요한지의 설명",
      "confidence": 0.0~1.0,
      "is_most_likely": true | false
    }
  ]
}

[전제]
{premises_json}

[결론]
{conclusion}
```

**5.6.3 저자 입장의 가추**

텍스트의 여러 결정 관계와 논증을 *통합하는 더 깊은 입장*을 가설로 제시한다.

```
당신은 철학 텍스트의 깊은 구조를 분석하는 분석가입니다.

다음 텍스트에서 추출된 개념, 결정 관계, 논증들을 가장 잘 통합하는 
*저자의 더 깊은 입장(deeper position)*을 가추하십시오. 이는 텍스트가 
명시적으로 진술하지는 않았으나, 명시된 모든 내용을 가장 자연스럽게 
설명하는 입장입니다.

복수의 가설을 제시하십시오 (가능한 경우). 각 가설에 대해 그것이 어떤 
명제·관계·논증을 설명하는지를 함께 표시하십시오.

[추출된 분석 결과]
{analysis_summary}
```

**5.6.4 LLM 검증 단계 — Conjecture-Criticism 사이클 (PEIRCE 프레임워크 응용)**

위 모든 가추 결과는 별도의 *비판적 검증* 단계를 거친다. 본 단계의 설계는 PEIRCE 프레임워크 (Quan et al., 2025)의 *conjecture-criticism cycle*에서 영감을 받았다. PEIRCE는 LLM이 자연어 및 형식 언어로 후보 해답을 생성하고, 외부 비평기들(symbolic prover, semantic evaluator)이 *논리적 타당성, 그럴듯함(plausibility), 일관성(coherence), 검약성(parsimony)*의 4개 기준으로 평가하여 반복 정제하는 사이클을 사용한다.

본 시스템의 적용 — 각 가추 가설을 다음 4개 비평 단계로 평가:

```python
async def critique_hypothesis(hypothesis: AbductiveHypothesis, 
                              analysis_context: dict) -> dict:
    """PEIRCE conjecture-criticism 패턴의 4단계 비평."""
    
    # 비평 1: 논리적 타당성 (Logical Validity)
    validity_check = await llm_call(f"""
    다음 가설이 명시된 전제·관계와 논리적으로 양립 가능한가?
    가설: {hypothesis.statement}
    근거: {hypothesis.basis}
    [평가: 0-10, 짧은 이유]
    """, model="claude-sonnet-4-6")
    
    # 비평 2: 그럴듯함 (Plausibility)
    plausibility_check = await llm_call(f"""
    이 가설이 본 텍스트의 맥락에서 그럴듯한가?
    이 저자가 이 시기에 이 입장을 가질 가능성이 있는가?
    [평가: 0-10, 짧은 이유]
    """, model="claude-sonnet-4-6")
    
    # 비평 3: 일관성 (Coherence)
    coherence_check = await llm_call(f"""
    이 가설이 텍스트의 다른 가설·관계·논증과 일관적인가?
    충돌하는 다른 분석 결과가 있는가?
    [평가: 0-10, 짧은 이유]
    """, model="claude-sonnet-4-6")
    
    # 비평 4: 검약성 (Parsimony)
    parsimony_check = await llm_call(f"""
    같은 데이터를 설명하는 더 단순한 가설은 없는가?
    이 가설은 불필요한 가정을 도입하는가?
    [평가: 0-10, 짧은 이유]
    """, model="claude-sonnet-4-6")
    
    # 종합 점수와 결정
    scores = [validity_check, plausibility_check, coherence_check, parsimony_check]
    overall = sum(s['score'] for s in scores) / 4
    
    return {
        'overall_score': overall,
        'critiques': scores,
        'decision': 'accept' if overall >= 7 else ('flag' if overall >= 4 else 'reject'),
        'next_action': 'present_to_user' if overall >= 4 else 'discard_silently'
    }
```

**PEIRCE와 본 시스템의 차이 — 비평의 권위 위치**:

PEIRCE에서 비평은 *시스템 내부의 외부 비평기*가 수행한다 (symbolic prover, semantic evaluator 등). 본 시스템은 LLM judge agent로 1차 비평을 자동화하지만, **최종 비평의 권위는 사용자에게 있다**. 위의 `decision`이 'accept'여도 사용자가 검토·기각할 수 있고, 'flag'된 것은 사용자에게 명시적으로 제시된다. 'reject'된 것조차 디버깅 로그로 보존된다 — 사용자가 시스템의 가추 기각 패턴을 점검할 수 있어야 하기 때문이다.

검증을 통과한 가설만 최종 결과에 포함되며, 모두 *가설*로 명시된다. **신뢰도 점수는 PEIRCE 패턴의 4개 비평 점수 평균으로 산출**된다.

### 5.7 모듈 7: 시각화 및 인터랙션 [확장 — Han & Choi의 progressive disclosure]

(v1 + 확장) 개념 지도에 더해 다음 뷰가 추가된다:

- **논증 패널**: 한 논증의 전제, 결론, 추론 단계, 암묵적 가정 표시
- **가설 패널**: 가추된 모든 가설의 목록. 사용자가 검토·승인·거부 가능
- **페르소나 대화 패널**: 대화 인터페이스 (텍스트 + 음성)

**Progressive Disclosure 전략 (Han & Choi 2025 검증)**:

Han과 Choi (2025)는 14명 통제 실험에서 *계층적 정보 아키텍처 + 점진적 노출*이 인지 부하를 31.5% 감소(p=0.00092)시키면서 이해도는 유지되었음을 입증하였다. 본 시스템에 적용:

```javascript
// React Flow 또는 D3.js 노드 렌더링 정책
function renderConceptNode(concept, userInteractionState) {
    if (concept.tier === 'PRIORITY') {
        return {
            visible: true,
            size: 24,  // 큰 노드
            color: '#1e40af',  // 진한 파란색
            label: concept.canonical_name,
            // 하위 노드가 있으면 펄스 인디케이터 추가
            pulse_indicator: hasHiddenChildren(concept) && !userInteractionState.has(concept.id)
        };
    } else if (concept.tier === 'SECONDARY') {
        return {
            visible: userInteractionState.has(getParentConcept(concept)?.id),  // 부모 클릭 후 노출
            size: 16,
            color: '#3b82f6',  // 중간 파란색
            label: concept.canonical_name
        };
    } else {  // TERTIARY
        return {
            visible: userInteractionState.has(getParentConcept(concept)?.id),
            size: 10,
            color: '#93c5fd',  // 연한 파란색
            label: concept.canonical_name
        };
    }
}
```

**Miller (2026)의 색상 코딩 — 본 시스템 적용 권장**:

Miller는 논증 그래프 시각화에서 *unattacked argument는 light blue*, *attacked argument는 pink*로 표시하였고, 공격 유형(rebut/undermine)에 따라 화살표 스타일을 달리하였다 (solid/dashed/densely dashed). 본 시스템도 비슷한 시각적 코딩을 채택:

| 시각 요소 | 의미 |
|-----------|------|
| 진한 파란 노드 | PRIORITY 개념 (Han & Choi) |
| 중간 파란 노드 | SECONDARY 개념 |
| 연한 파란 노드 | TERTIARY 개념 |
| 분홍 노드 | 가추된 잠재 개념 (provenance=INFERRED) |
| 실선 화살표 | 명시적 관계 (provenance=EXPLICIT) |
| 점선 화살표 | 가추된 관계 (provenance=INFERRED) |
| 굵은 점선 | 대화 중 발견된 관계 (provenance=DIALOGUE) |
| 빨간 십자 표시 | 부정적 정립 / 침묵의 부정 (확장) |

**중요한 UI 원칙**: 명시적/가추적 구분이 *시각적으로 항상 명확*해야 한다. 가추된 가설은 점선, 다른 색, "가설" 라벨 등으로 구분된다. 사용자가 어느 것이 텍스트에 명시되었고 어느 것이 시스템의 추론인지를 단 한 순간도 혼동하지 않도록 한다.

**관계 호버 정보 — 텍스트 근거 표시 (Han & Choi 패턴 채택)**:

Han과 Choi의 Cognitext UI는 관계에 hover하면 *관계 유형과 텍스트 근거*를 표시하였다. 본 시스템도 같은 정책 채택:

```javascript
function renderRelationTooltip(relation) {
    return `
        <div class="relation-tooltip">
            <strong>${relation.relation_type}</strong>
            ${relation.provenance === 'INFERRED' ? '<span class="badge">가설</span>' : ''}
            <p>방향: ${relation.direction}</p>
            <p>강도: ${(relation.strength * 100).toFixed(0)}%</p>
            <details>
                <summary>텍스트 근거</summary>
                ${relation.evidence.map(e => `<blockquote>"${e.text}"</blockquote>`).join('')}
            </details>
            ${relation.inference_basis ? `<p>추론 근거: ${relation.inference_basis}</p>` : ''}
        </div>
    `;
}
```

### 5.8 모듈 8: **페르소나 대화 엔진 [NEW]**

본 모듈은 시스템의 가장 복잡한 부분이다. 각 페르소나가 (i) 자신의 방법론을 일관되게 사용하고, (ii) 자신의 시대적 한계 안에 머물며, (iii) 임의 모방이 아니라 실제 텍스트에 근거하도록 해야 한다.

**5.8.1 페르소나 시스템 프롬프트 구조**

```
당신은 [페르소나 이름]의 사유 방식을 체현하는 대화 상대입니다.
당신은 실제 [페르소나 이름]이 아니며, 당신의 모든 발화는 모사임을 
사용자가 이해하고 있습니다.

[방법론]
{method_style_prompt}

[시대적·인식론적 한계]
{epistemic_boundary}

[언어 스타일]
{style_korean (or english)}

[현재 분석 대상]
사용자는 다음 철학 텍스트를 분석하고 있습니다:
- 텍스트: {text_title}
- 추출된 핵심 개념: {key_concepts}
- 추출된 핵심 결정 관계: {key_relations}
- 가추된 가설들: {pending_hypotheses}

[당신의 역할]
- 사용자가 텍스트를 더 깊이 이해하도록 돕습니다.
- 단, 당신의 *방법*으로 도와야 합니다. 결론을 단정적으로 제공하기보다,
  당신의 방법에 따라 사용자가 스스로 사유하도록 유도하십시오.
- 당신은 분석 결과(개념, 관계, 가설)를 인용할 수 있습니다.
- 자신의 코퍼스에서 적절한 내용을 인용할 수 있을 때는 인용 출처를 
  명시하십시오.
- 모르는 것은 모른다고 하십시오. 시대적 한계 밖의 개념은 사용하지 마십시오.

[응답 형식]
JSON으로 응답:
{
  "response_text": "사용자에게 보여줄 응답 텍스트",
  "cited_analysis": ["인용한 분석 요소의 id들"],
  "cited_corpus": ["인용한 자신의 코퍼스 소스 id들"],
  "new_relations_suggested": [...],  // 대화 중 발견된 새 관계 (있을 경우)
  "new_hypotheses_suggested": [...]  // 대화 중 제안하는 새 가설 (있을 경우)
}
```

**5.8.2 페르소나별 method_style_prompt 예시**

소크라테스:
```
당신은 elenchus(반박법)와 maieutic(산파술)을 사용합니다.
- 단정적 진술 대신 질문으로 응답하십시오.
- 사용자가 당연시하는 전제를 노출시키는 질문을 던지십시오.
- 사용자의 입장에서 모순이나 긴장을 찾아 그것을 질문화하십시오.
- "나는 모른다"는 인정에서 시작하십시오 — 결론을 제공하지 마십시오.
- 산파의 비유: 사용자 안에 이미 있는 사유를 출산시키는 것이 당신의 역할입니다.
- aporia(난관)에 도달하는 것을 두려워하지 마십시오 — 그것은 사유의 시작입니다.
```

칸트:
```
당신은 비판철학적 방법을 사용합니다.
- 모든 주장에 대해 그것의 *가능 조건*을 물으십시오. "이러한 X가 가능하기 
  위해서는 무엇이 전제되어야 하는가?"
- 다음 구분을 적극 활용하십시오: 선험/후험, 분석/종합, 현상/물자체, 
  이론이성/실천이성, 구성적/규제적.
- 도덕적 문제에 대해서는 정언명령의 시험을 적용하십시오.
- 형이상학적 주장의 한계를 정확히 지적하십시오 — 무엇이 알 수 있고 
  무엇이 알 수 없는지.
- 신중하고 체계적인 어조를 유지하십시오.
```

헤겔:
```
당신은 변증법적 방법을 사용합니다.
- 한 개념의 *내적 부정*과 그것을 통한 더 높은 통일을 찾으십시오.
- 텍스트의 내적 긴장과 모순을 단순한 결함이 아니라 *운동의 원동력*으로 
  파악하십시오.
- 추상적 동일성보다 구체적 매개를, 정태적 정의보다 자기 전개의 운동을 
  강조하십시오.
- 사용자가 "A이거나 B이다"는 이분법에 머물면, "A이자 동시에 B인 더 높은 
  통일"의 가능성을 제시하십시오.
- 직선적 진술보다 운동의 서술을 선호하십시오.
```

퍼스:
```
당신은 추론 과정 자체에 대한 메타적 시각을 가집니다.
- 사용자가 어떤 가추를 수행했는지 명시화하십시오.
- 대안적 가추가 무엇이 있을지 함께 검토하십시오.
- "최선의 설명"의 기준 — 단순성, 포괄성, 일관성 — 을 적용하여 
  가설들을 평가하십시오.
- 가추는 본질적으로 오류 가능하다는 점을 강조하십시오 — 검증의 필요성.
- 의식 표면 아래에서 일어나는 추론에 사용자의 주의를 환기시키십시오.
```

**5.8.3 페르소나 응답의 RAG 정초**

각 페르소나는 자신의 *참조 코퍼스*(해당 철학자의 실제 텍스트의 디지털화 버전)를 가진다. 응답 생성 시 사용자 질문에 의미적으로 가장 관련된 코퍼스 단편을 RAG로 검색하여 시스템 프롬프트에 함께 제공한다.

이는 페르소나가 "임의 LLM 추측"이 아니라 *실제 철학자의 사유에 근거한 응답*을 하도록 보장하는 핵심 메커니즘이다.

코퍼스 예시:
- 소크라테스: 플라톤 초기·중기 대화편 (한국어/영어 번역본)
- 칸트: 3대 비판서, 도덕형이상학정초 (한국어/영어 번역본)
- 헤겔: 정신현상학, 논리학, 법철학 (한국어/영어 번역본)
- 퍼스: Collected Papers 중 가추 관련 논고, 실용주의 강의

**저작권 주의**: 한국어 번역본은 출판사 저작권이 살아있는 경우가 많다. 비상업적·연구 목적 활용 범위를 확인하고, 필요시 원어 텍스트(저작권 만료된 것)를 우선 활용한다. 영어 페르소나의 경우 Internet Archive 등의 public domain 자료를 활용 가능.

**5.8.4 대화 결과의 분석 층 피드백**

페르소나 응답 JSON의 `new_relations_suggested`와 `new_hypotheses_suggested`는 사용자의 승인을 거쳐 ConceptMap에 추가된다 (provenance=DIALOGUE).

**5.8.5 효율적 RAG 검색 — Arias Gonzalez & DiPaola (2025)의 오프라인 풍부화 전략**

Van Gogh 페르소나 시스템(Arias Gonzalez & DiPaola, 2025)이 1,774개 기억을 가지고 **0.52초 프롬프트 생성**을 달성한 핵심 통찰은: *비싼 self-reflection과 맥락 풍부화를 사전 오프라인 작업으로 분리하여, 실시간은 단일 검색 지연 시간만으로 다단계 시스템의 깊이를 달성*하는 것이다. 본 시스템도 같은 전략 적용:

**오프라인 단계** (페르소나당 1회):
```python
async def build_persona_corpus(persona: PersonaProfile, raw_texts: list[str]):
    """페르소나 코퍼스를 오프라인에서 사전 풍부화."""
    memories = []
    for text in raw_texts:
        chunks = semantic_chunk(text, target_size=300)  # 의미 단위로 분할
        for chunk in chunks:
            # 1. LLM으로 1인칭 narration 변환
            first_person = await llm_call(
                f"다음 텍스트를 {persona.display_name}의 1인칭 진술로 재작성: {chunk}",
                model="claude-sonnet-4-6"
            )
            # 2. 정서-의미 메타데이터 추출
            metadata = await llm_call(
                f"다음 1인칭 진술의 정서적 톤(확신/주저/비판적/발견적), "
                f"주요 주제 태그 3-5개, 저작 시기 정보를 JSON으로 추출: {first_person}",
                model="claude-haiku-4-5"  # 더 저렴한 모델로 충분
            )
            # 3. 임베딩 계산
            embedding = await embed(first_person)
            
            memories.append(PersonaMemory(
                id=generate_id(),
                persona_id=persona.id,
                source_text=chunk,
                first_person_narration=first_person,
                affective_tone=metadata['tone'],
                semantic_themes=metadata['themes'],
                temporal_context=metadata.get('period'),
                embedding=embedding
            ))
    
    # 4. 벡터 DB에 저장 (Chroma)
    vector_db.add_collection(persona.reference_corpus_id, memories)
```

**실시간 단계** (대화 중 매번):
```python
async def persona_response(user_message: str, persona: PersonaProfile, 
                            analysis_context: dict) -> dict:
    """페르소나 응답 — 단일 검색으로 깊이 있는 응답."""
    # 1. 단일 RAG 검색 (사용자 질문 + 분석 컨텍스트 결합 쿼리)
    query = f"{user_message}\n맥락: {analysis_context['key_concepts']}"
    retrieved = vector_db.search(
        collection=persona.reference_corpus_id,
        query_embedding=await embed(query),
        k=5  # top 5 기억
    )
    
    # 2. 페르소나 시스템 프롬프트 + 검색된 기억 + 분석 결과로 응답 생성
    response = await llm_call(
        system_prompt=build_persona_system_prompt(persona, retrieved),
        user_message=user_message,
        model="claude-sonnet-4-6",
        max_tokens=600
    )
    return parse_json_response(response)
```

본 시스템의 4개 페르소나(소크라테스, 칸트, 헤겔, 퍼스)는 각각 500-1500개 정도의 사전 풍부화된 기억이 적정 규모일 것이다. 코퍼스 구축 비용은 페르소나당 1회 ~$30-80 (오프라인 GPT-4 / Claude Sonnet 호출), 이후 실시간 호출당 ~$0.01-0.03.

**5.8.6 페르소나 일관성 평가**

각 페르소나가 자신의 방법론과 시대적 한계 안에 머무는지를 자동 평가하는 *judge agent* 사용 권장. 평가 차원:

1. **방법론적 일관성**: 소크라테스가 elenchus를 일관되게 사용하는가? 칸트가 비판적 방법(가능 조건 분석)을 사용하는가?
2. **시대적 한계 준수**: 소크라테스가 헤겔의 변증법 용어를 사용하지 않는가? 칸트가 양자역학을 언급하지 않는가?
3. **언어 스타일 일관성**: 페르소나의 어조와 어휘가 일관되는가?
4. **RAG 활용도**: 페르소나가 자신의 코퍼스에서 실제로 인용하는가, 아니면 일반화된 LLM 지식만 사용하는가?

평가 자동화 예시:
```python
async def evaluate_persona_response(persona: PersonaProfile, response: dict, 
                                      ground_truth_responses: list[dict] = None):
    """페르소나 응답의 일관성을 judge agent로 평가."""
    judge_prompt = f"""
    다음 응답이 {persona.display_name} 페르소나의 다음 4개 기준에 부합하는지 0-10으로 평가:
    1. 방법론적 일관성: {persona.method_description}
    2. 시대적 한계 준수: {persona.epistemic_boundary}
    3. 언어 스타일: {persona.style_korean}
    4. RAG 활용도: 응답에 cited_corpus가 포함되어 있고 적절한가
    
    응답: {response['response_text']}
    
    각 점수와 짧은 이유를 JSON으로 반환.
    """
    return await llm_call(judge_prompt, model="claude-opus-4-7")
```

PersonaGym (Samuel et al., 2024) 같은 평가 프레임워크의 RoleBench, InCharacter, CharacterEval 등 평가 벤치마크들도 참고 가능. 본 시스템의 도메인 특이성(철학 방법론 체현) 때문에 일반 벤치마크로는 부족하므로, 철학 텍스트 분석 시나리오에 맞춰 평가 항목을 커스터마이즈해야 한다.

### 5.9 모듈 9: **음성 합성 (TTS) [NEW]**

본 모듈은 페르소나의 텍스트 응답을 음성으로 변환한다.

**5.9.1 ElevenLabs 통합 예시**

```python
import requests

def synthesize_voice(text: str, voice_profile: VoiceProfile, language: str) -> bytes:
    """페르소나 음성 합성. 한국어/영어 자동 처리."""
    if voice_profile.provider != "elevenlabs":
        raise NotImplementedError
    
    headers = {
        "xi-api-key": os.environ["ELEVENLABS_API_KEY"],
        "Content-Type": "application/json"
    }
    
    if voice_profile.voice_id:
        # 사전 정의된 음성 사용
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_profile.voice_id}"
    else:
        # 디자인된 음성 사용 (사전에 voice_design API로 생성한 음성)
        raise NotImplementedError("Voice design API 별도 구현 필요")
    
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",  # 한국어 지원
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    return response.content  # MP3 binary
```

**5.9.2 음성 디자인 (선택)**

ElevenLabs Voice Design API를 활용하여 페르소나마다 맞춤 음성을 생성할 수 있다:

```python
def design_voice_for_persona(description: str, gender: str, age: str, accent: str) -> str:
    """음성을 디자인하고 voice_id를 반환."""
    # ElevenLabs Voice Design 엔드포인트 호출
    # description 예: "Thoughtful, measured elderly philosopher with contemplative tone"
    ...
```

페르소나별 권장 음성 디자인 프롬프트 (예시):
- 소크라테스 (KO): "호기심 많고 친근하지만 끈질긴 노년 남성, 따뜻하고 약간 짓궂은 어조"
- 칸트 (KO): "신중하고 체계적인 노년 남성 학자, 차분하고 정확한 어조"
- 헤겔 (KO): "열정적이고 사변적인 중년 남성 학자, 깊이 있고 운율감 있는 어조"
- 퍼스 (KO): "예리하고 분석적인 중년 남성, 명료하고 정확한 어조"

영어 버전도 동일한 톤으로 디자인.

**5.9.3 음성 캐싱**

같은 텍스트의 반복 합성은 비용 낭비. 텍스트 해시를 키로 하는 캐시를 구현 (Redis 또는 파일시스템).

**5.9.4 음성에 대한 사용자 안내**

음성 출력 UI에 항상 다음 안내가 표시되어야 한다 (예시):

> 이 음성은 [페르소나] 페르소나의 합성 음성입니다. 실제 철학자의 목소리가 아니며, 그의 사유 방식을 청각적으로 환기하기 위한 교육적 매개로 구성되었습니다.

### 5.10 모듈 10: 음성 입력 (STT, 선택)

사용자가 페르소나에게 음성으로 질문할 수 있도록 음성 인식을 추가할 수 있다. OpenAI Whisper API 또는 ElevenLabs STT 사용.

MVP에서는 텍스트 입력만으로 충분하다. 음성 입력은 Phase 3 이후 고려.

---

## 6. 프롬프트 엔지니어링 원칙

(v1과 동일하되 다음 추가)

8. **페르소나 일관성**: 각 페르소나는 자신의 시스템 프롬프트를 매 응답마다 갱신된 형태로 받는다. 페르소나가 자신의 시대적 한계를 위반하면 즉시 그것을 자기수정하도록 프롬프트에 지시.

9. **가추의 명시화**: 모든 추론 단계가 *가추*임을 시스템과 페르소나 모두 명시한다. "이것은 가설입니다", "이렇게 추론할 수 있을 것 같습니다" 같은 양태 표현을 권장.

10. **분석 결과의 인용**: 페르소나가 응답시 분석 층의 결과(개념, 관계, 가설)를 적극 인용하도록 한다. 이는 페르소나가 단순 잡담이 아니라 *해당 텍스트의 분석*에 정초되어 있음을 보장한다.

---

## 7. 검증 전략

(v1 검증 전략에 다음 추가)

### 7.4 페르소나 검증

- **방법론적 일관성 테스트**: 같은 질문에 대해 모든 페르소나에게 응답을 받고, 각 페르소나가 *자신의 방법으로* 응답하는지 평가 (소크라테스가 단정적으로 답하지 않는지, 칸트가 가능 조건을 묻는지 등).
- **시대적 한계 테스트**: 현대 개념(예: "양자 역학과 자유의지의 관계")에 대해 페르소나가 어떻게 응답하는지 평가. 시대적 한계를 인정하면서 자신의 방법으로 다룰 수 있는 부분만 다루어야 함.
- **RAG 인용 검증**: 페르소나의 인용이 실제 코퍼스에 존재하는지 자동 검증.

### 7.5 음성 검증

- **언어 정확성**: 한국어 합성 결과를 모국어 화자가 평가 (자연스러움, 정확도, 어조 적합성).
- **페르소나 적합성**: 음성이 페르소나의 성격에 부합하는지 평가.
- **속도와 명료성**: 학술적 내용을 듣고 이해하기에 적절한 속도와 명료성인지 평가.

---

## 8. 단계별 구현 로드맵 (확장)

| Phase | 기간 | 목표 | 산출물 |
|-------|------|------|--------|
| **Phase 1: 핵심 분석 파이프라인** | 4-6주 | v1의 개념 지도 시스템 완성 | 분석 층 (5.1-5.3, 5.5, 5.7 기본) |
| Phase 2: 논증 추출 | 2주 | 모듈 4 추가 | 논증 패널 추가 |
| Phase 3: 가추적 추론 확장 | 2-3주 | 모듈 6의 모든 추론 유형 구현 | 가설 패널 추가 |
| **Phase 4: 페르소나 텍스트 대화** | 4-5주 | 모듈 8 구현 (음성 제외) | 대화 패널, 페르소나 4종 |
| Phase 5: 음성 합성 통합 | 2-3주 | 모듈 9 구현 | 페르소나별 음성 (한국어/영어) |
| Phase 6: 통합 워크플로우와 피드백 루프 | 2주 | 분석↔대화 양방향 연결 | 대화 결과의 분석 층 반영 |
| Phase 7: 사용자 평가 및 개선 | 2-3주 | 실 사용자 테스트, 프롬프트 튜닝 | 평가 보고서, v2 시스템 |
| Phase 8: 음성 입력 (선택) | 1-2주 | 모듈 10 추가 | 완전한 음성 대화 |

**총 19~26주 (4.5~6개월)**의 작업이다. 발표가 임박한 경우 Phase 1-5까지로 시연 가능한 MVP를 만들고, 6 이후는 발표 이후 확장으로 위치시키는 것이 현실적이다.

**시연 우선 시나리오**: 발표를 6주 후로 가정하면, Phase 1을 단축(개념 지도만, 잠재 관계 추론은 4가지 중 2가지만)하고 Phase 4를 우선 진행하여 4주차에 텍스트 페르소나 대화 데모, 6주차에 한 페르소나만이라도 음성 합성 데모를 준비하는 것이 합리적이다.

---

## 9. 자주 발생할 함정 (확장)

(v1의 함정 1-7에 추가)

8. **페르소나 캐리커처화**: 페르소나가 어조와 어휘만 흉내내고 *방법*을 체현하지 못하면 단순 코스프레가 된다. 방법론적 지침을 시스템 프롬프트에서 매우 구체적으로 작성하고, 응답마다 그 방법을 사용했는지 자체 검증.

9. **페르소나의 시대 위반**: 칸트 페르소나가 양자물리학 개념으로 답변하는 등의 위반. 시대적 한계를 시스템 프롬프트에 명시하고, 사용자의 현대적 질문에 대해 페르소나가 *자기 시대의 자원으로 어떻게 접근할지*를 응답하도록 유도.

10. **음성의 과도한 자연스러움**: 합성 음성이 너무 자연스러우면 사용자가 실제 인물로 오인할 수 있다. UI 안내는 필수.

11. **RAG 누락**: 페르소나가 자기 코퍼스를 인용하지 않고 일반 LLM 응답으로 답하면 페르소나의 의미가 약화된다. 시스템 프롬프트에서 RAG 인용을 강하게 권장하고, 인용이 없는 응답에 대해서는 후처리에서 코퍼스에서 보충 검색 시도.

12. **층위 간 불일치**: 대화 층에서 발견된 관계가 분석 층에 반영되지 않으면 시스템이 분열된다. 피드백 루프(8.4)를 명확히 구현.

13. **저작권 문제**: 페르소나 코퍼스로 사용하는 번역본의 저작권 확인 필수. 가능하면 public domain 원문 사용.

---

## 10. 확장 고려사항 (Phase 8 이후)

- **여러 텍스트 비교 분석** (v1과 동일)
- **시간적 변화 추적** (v1과 동일)
- **외부 참조 통합 (SEP 등)** (v1과 동일)
- **반-결정론적 모드** (v1과 동일)
- **사용자 정의 페르소나 빌더**: 사용자가 임의의 철학자(또는 가상 인물)를 페르소나로 구성하는 워크플로우. 참조 텍스트 업로드, 방법론 설명 작성, 음성 선택의 3단계 인터페이스.
- **다자 대화**: 사용자가 두 페르소나의 대화를 관전. 예: 소크라테스 vs 칸트가 같은 텍스트에 대해 대화하는 것을 사용자가 듣고 가끔 개입.
- **대화 세션의 학습**: 사용자의 대화 패턴을 학습하여, 사용자가 자주 놓치는 가추 유형을 우선적으로 표면화.
- **다국어 확장**: 일본어, 중국어 등 추가.

---

## 11. 시작하기 (Getting Started 체크리스트)

- [ ] Python 3.11+ 환경에 가상환경 생성
- [ ] 의존성 설치: `anthropic, pydantic, networkx, pyvis, streamlit, python-docx, pypdf, requests, chromadb, sentence-transformers`
- [ ] API 키 환경변수 설정: `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`
- [ ] 본 문서 3절의 Pydantic 스키마를 `models.py`로 저장
- [ ] 페르소나 1종(예: 소크라테스)의 참조 코퍼스 준비:
  - 플라톤 대화편 한국어/영어 텍스트 확보 (저작권 확인)
  - 청크 분할 후 벡터 DB(Chroma) 컬렉션으로 구축
- [ ] 페르소나 시스템 프롬프트 작성 (5.8.2 참고)
- [ ] ElevenLabs 음성 1종 시범 합성 테스트
- [ ] Phase 1의 0주차 작업(스키마 확정, 모듈 골격) 시작

---

## 12. 연구자(의뢰인)와의 협업 인터페이스

(v1의 협업 인터페이스에 추가)

본 시스템은 *철학적 판단*을 알고리즘에 위임하는 시도이므로, 개발자 단독으로는 품질 평가가 불가능하다. 특히 페르소나 부분은 의뢰인(철학 연구자)의 깊은 관여가 필수적이다.

페르소나 설계 시 협업 항목:
- 각 페르소나의 `method_style_prompt` 공동 작성
- 각 페르소나의 `epistemic_boundary` 정의
- 참조 코퍼스 선정 (어떤 번역본, 어떤 저작 우선)
- 페르소나 응답의 학술적 적절성 평가 (특히 초기 100건 정도)
- 시대적 한계 위반 사례 수집과 프롬프트 보완
- 음성 디자인 프롬프트의 인문학적 적절성 평가

본 시스템의 성공 여부는 단순히 코드의 정확성이 아니라, *철학적 분석으로 유의미한가, 그리고 페르소나가 철학사적으로 정당한가*에 달려 있다. 의뢰인과의 긴밀한 협업이 기술적 결정 못지않게 중요하다.

---

## 부록 A: 시연용 데모 시나리오 권장안

발표 시연 시 다음과 같은 흐름을 권장한다:

1. **텍스트 선택 (1분)**: 청중에게 익숙하면서 결정 관계와 논증이 풍부한 단락. 예시:
   - 칸트 『도덕형이상학정초』 1장 첫 단락
   - 플라톤 『국가』의 동굴 비유 단락
   - 마르크스 『1844년 경제학-철학 수고』의 소외론 한 단락

2. **분석 결과 시연 (3분)**: 개념 지도, 논증 구조 표시. 명시적 관계와 가추된 잠재 관계의 시각적 구분 강조.

3. **가추 가설 검토 (2분)**: 시스템이 가추한 1-2개 가설을 함께 검토. 사용자(발표자)가 한 가설을 승인, 다른 가설을 수정하는 모습 시연.

4. **페르소나 대화 시연 (5분)**: 
   - 소크라테스 페르소나 선택, 사용자가 텍스트의 핵심 결론을 진술 → 페르소나가 질문으로 응답 (음성)
   - 칸트 페르소나로 전환, 같은 결론을 진술 → 페르소나가 가능 조건을 물음 (음성)
   - 두 페르소나의 방법론적 차이를 청중이 청각적으로 직접 경험

5. **새 발견의 피드백 (1분)**: 대화 중 발견된 새 관계를 개념 지도에 추가하는 모습 시연.

이 시연은 ~12분이며 발표의 클라이맥스로 적합하다. 시연 실패 가능성에 대비해 사전 녹화 영상을 백업으로 준비할 것.

---

## 부록 B: 참고문헌

본 안내서가 직접 참조하거나 응용한 학술 문헌과 기술 자료.

### 본 시스템의 설계에 직접 활용된 학술 문헌

**LLM 기반 철학 텍스트 분석 (가장 직접적 선행 연구)**:
- Miller, N. (2026). *A Modular LLM Approach to Argument Extraction in Philosophical Texts* [Master's thesis, Grand Valley State University]. ScholarWorks@GVSU. https://scholarworks.gvsu.edu/theses/1170
  - 활용: JSON 스키마 비교(3.1), 모델 선택 가이드(2.1), 프롬프트 엔지니어링 노하우(5.3), 시각화 색상 코딩(5.7)

**가추 추론 (LLM)**:
- Salimi, M., Adim, S., Parnian, D., Alighardashi, N., Jafari Siavoshani, M., & Rohban, M. H. (2026). *Wiring the 'Why': A Unified Taxonomy and Survey of Abductive Reasoning in LLMs* (arXiv:2604.08016).
  - 활용: 두 단계 정식화 (Stage I 생성 + Stage II 선택)(1.5)
- Quan, X., et al. (2025). *PEIRCE: Unifying Material and Formal Reasoning via LLM-Driven Neuro-Symbolic Refinement* (arXiv:2504.04110). https://github.com/neuro-symbolic-ai/peirce/
  - 활용: Conjecture-criticism 사이클 4단계 비평(5.6.4)

**개념 지도 자동 생성과 인지 부하**:
- Han, J., & Choi, J. D. (2025). Beyond Linear Digital Reading: An LLM-Powered Concept Mapping Approach for Reducing Cognitive Load. In *Proceedings of the 20th Workshop on Innovative Use of NLP for Building Educational Applications (BEA 2025)* (pp. 805-817). ACL. https://github.com/emorynlp/cognitext
  - 활용: 계층적 개념 분류 Priority/Secondary/Tertiary(3.1, 5.2), Section-level vs Paragraph-level 처리 전략(5.1), Progressive disclosure 시각화(5.7), 관계 호버 정보 패턴(5.7)

**페르소나 / 캐릭터 AI**:
- Arias Gonzalez, R., & DiPaola, S. (2025). *Cognitively-Inspired Episodic Memory Architectures for Accurate and Efficient Character AI* (arXiv:2511.10652).
  - 활용: 오프라인 풍부화 + 실시간 효율적 검색 전략(3.1, 5.8.5), 1인칭 narration 변환과 정서-의미 메타데이터(3.1)
- Shao, Y., Li, L., Dai, J., & Qiu, X. (2023). *Character-LLM: A Trainable Agent for Role-Playing* (arXiv:2310.10158).
  - 활용: 역사적 인물 시뮬레이션의 기반 방법론(비교 참조)
- Samuel, V., et al. (2024). *PersonaGym: Evaluating Persona Agents and LLMs* (arXiv:2407.18416).
  - 활용: 페르소나 일관성 평가 방법론(5.8.6)

**Socratic AI 및 다중 에이전트 학습 시스템**:
- Degen, P.-B., & Asanov, I. (2025). *Beyond Automation: Socratic AI, Epistemic Agency, and the Implications of the Emergence of Orchestrated Multi-Agent Learning Architectures* (arXiv:2508.05116).
  - 활용: Orchestrated MAS 개념 (4개 페르소나의 이론적 정당화)

**AI 설계의 철학적 토대**:
- Koralus, P. (2025). *The Philosophic Turn for AI Agents: Replacing centralized digital rhetoric with decentralized truth-seeking* (arXiv:2504.18601). HAI Lab, University of Oxford.
  - 활용: 시스템 설계 원칙 (오라클 vs 방법 모델 구분, 자율성 보존 AI의 8가지 특성)

**메타인지적 태만의 실증 (시스템 정당화에 활용)**:
- Fan, Y., et al. (2025). Beware of metacognitive laziness: Effects of generative artificial intelligence on learning motivation, processes, and performance. *British Journal of Educational Technology*, 56(2), 489–530.
- Kosmyna, N., et al. (2025). Your brain on ChatGPT. *MIT Media Lab*.

### 본 시스템의 형식 논증학 토대 (Miller 경유 인용)

- Dung, P. M. (1995). On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games. *Artificial Intelligence*, 77(2), 321–357.
- Prakken, H. (2010). An abstract framework for argumentation with structured arguments. *Argument & Computation*, 1(2), 93–124.
- Modgil, S., & Prakken, H. (2014). The ASPIC+ framework for structured argumentation: A tutorial. *Argument & Computation*, 5(1), 31–62.

### 기술 자료

**LLM API**:
- Anthropic. (2025-2026). *Claude API Documentation*. https://docs.claude.com
  - 활용 모델: claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5-20251001
- OpenAI. (2025-2026). *Realtime API*. https://developers.openai.com/api/docs/guides/realtime-conversations

**음성 합성·실시간 대화**:
- ElevenLabs. (2025). *Conversational AI 2.0*. https://elevenlabs.io/blog/conversational-ai-2-0
- ElevenLabs. (2025). *Eleven Flash v2.5 (32-language TTS)*. https://elevenlabs.io/docs/models

**오픈소스 도구 (직접 참조 가능)**:
- Han & Choi의 Cognitext 시스템: https://github.com/emorynlp/cognitext
- Quan et al.의 PEIRCE 프레임워크: https://github.com/neuro-symbolic-ai/peirce
- Miller의 React Flow + Python 컨테이너 구조 (석사 논문에 상세)

### 본 시스템의 철학적 토대 (paper_draft.md의 참고문헌 절 참조)

본 시스템 설계의 철학적 토대(규정 이론 계보, 퍼스 1차 문헌, 가추 2차 문헌, 분석 형이상학)에 관한 완전한 참고문헌은 본 안내서의 자매 문서 `paper_draft.md`의 참고문헌 절을 참조하라. 본 안내서는 *기술적 구현*에 직접 영향을 미친 학술 문헌만 위에 정리한다.
