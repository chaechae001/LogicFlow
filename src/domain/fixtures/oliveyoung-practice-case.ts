import type { PracticeCase } from "../schemas";

export const OLIVEYOUNG_PRACTICE_CASE_ID = "practice-oliveyoung-o2o-001";

export const oliveyoungPracticeCase = {
  id: OLIVEYOUNG_PRACTICE_CASE_ID,
  title: "오프라인 상품 체험을 앱 구매 여정으로 연결하는 올리브영 O2O 서비스 개선",
  companyContext:
    "올리브영의 오프라인 매장과 모바일 앱을 오가는 고객 여정을 다루는 가상 실무 연습 맥락",
  role: "올리브영 서비스 기획자 또는 데이터 기반 Product Manager",
  domain: "O2O 리테일",
  problemPattern: "오프라인 체험과 앱 구매 검토 여정의 연결 단절 가능성",
  difficulty: "intermediate",
  expectedMinutes: 90,
  businessContext:
    "올리브영 고객은 오프라인 매장에서 상품을 직접 체험하고, 앱에서는 상품 정보·리뷰·재고·혜택·구매 기능을 이용할 수 있다. 그러나 오프라인 경험을 앱에서 이어가는 과정에는 여러 단계가 존재한다.",
  knownFacts: [
    "연습 전제: 고객은 오프라인 매장에서 상품을 직접 체험할 수 있다.",
    "연습 전제: 앱에서는 상품 정보·리뷰·재고·혜택·구매 기능을 이용할 수 있다.",
  ],
  unknowns: [
    "매장에서 체험한 상품을 앱에서 다시 찾는 과정에 실제로 어느 정도의 어려움이 있는가",
    "어느 고객 여정 단계에서 이탈이나 반복 탐색이 발생하는가",
    "상품 식별, 정보 연결, 혜택 비교, 구매 필요성 중 어떤 요인의 영향이 큰가",
    "어떤 개선안이 사용자 가치와 실행 가능성을 함께 만족하는가",
  ],
  taskRequest:
    "오프라인 매장에서 상품을 체험한 고객이 앱에서 해당 상품과 옵션을 다시 찾고, 리뷰·혜택·재고·배송 정보를 확인해 구매 결정을 이어가는 과정의 단절 가능성을 정의한다. 원인 가설, 필요한 데이터, 검증 방법, 우선 개선안과 Action Plan을 제안한다.",
  primaryFramework: "Customer Journey Map",
  supportingFrameworks: [
    "MECE Issue Tree",
    "Hypothesis–Metric Matrix",
    "Weighted Decision Matrix",
    "SCQA + Minto Pyramid",
  ],
  sourceNote:
    "공개 정보와 연습용 가정을 바탕으로 구성한 가상 현업형 Practice Case다. 올리브영 내부 데이터나 실제 고객 행동을 확인한 결과가 아니며, 미검증 주장은 가설로 다뤄야 한다.",
} satisfies PracticeCase;
