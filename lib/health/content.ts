export type HealthQuestionSummary = {
  id: string;
  category: string;
  question: string;
  summary: string;
  actionTip: string;
  seekCare: string;
};

export const suggestedHealthQuestions = [
  "최근 잠이 얕고 자주 깨는데, 생활 루틴을 어떻게 조정하면 좋을까요?",
  "운동 후 다음 날 피로가 오래 가요. 강도 조절 기준이 있을까요?",
  "저녁마다 군것질이 늘어나는데 식단을 어떻게 안정화하면 좋을까요?",
  "앉아 있는 시간이 긴데 허리와 어깨 부담을 줄이는 습관이 궁금해요.",
] as const;

export const healthQuestionSummaries: HealthQuestionSummary[] = [
  {
    id: "sleep-rhythm",
    category: "수면",
    question: "잠드는 시간보다 중요한 건 무엇인가요?",
    summary:
      "취침 시간 자체보다 기상 시간을 일정하게 지키는 것이 수면 리듬을 안정시키는 데 더 직접적으로 도움이 됩니다.",
    actionTip:
      "주중과 주말의 기상 시간 차이를 1시간 안쪽으로 맞추고, 잠들기 2시간 전에는 카페인과 강한 빛 노출을 줄여보세요.",
    seekCare:
      "코골이, 숨 막힘, 아침 두통, 주간 졸림이 함께 있으면 수면무호흡 평가가 필요할 수 있습니다.",
  },
  {
    id: "exercise-recovery",
    category: "운동 회복",
    question: "운동 강도는 어떻게 조절하면 좋을까요?",
    summary:
      "피로가 누적된 날에는 운동을 완전히 끊기보다 강도나 볼륨을 낮춰 회복 여지를 남기는 편이 지속성에 유리합니다.",
    actionTip:
      "평소 대비 컨디션이 떨어지는 날은 무게를 10~20% 줄이거나, 고강도 대신 가벼운 걷기와 스트레칭으로 대체해보세요.",
    seekCare:
      "흉통, 어지럼, 호흡곤란, 비정상적인 심계항진이 운동 중 동반되면 즉시 중단하고 진료를 받아야 합니다.",
  },
  {
    id: "diet-stability",
    category: "식단",
    question: "야식이나 간식이 반복될 때 먼저 볼 것은 무엇인가요?",
    summary:
      "의지 부족보다 낮 시간 식사 구성의 불균형이 원인인 경우가 많아서, 단백질과 섬유질이 부족하면 밤에 허기가 커지기 쉽습니다.",
    actionTip:
      "아침이나 점심에 단백질과 포만감 있는 식품을 보강하고, 저녁 직전 공복이 길어지지 않게 작은 간식을 미리 배치해보세요.",
    seekCare:
      "급격한 체중 변화, 반복적인 폭식, 섭식 후 죄책감이 크다면 전문가 상담이 도움이 될 수 있습니다.",
  },
  {
    id: "desk-posture",
    category: "생활 습관",
    question: "오래 앉아 있을 때 가장 먼저 바꿀 습관은 무엇인가요?",
    summary:
      "완벽한 자세를 오래 유지하려 하기보다, 같은 자세를 오래 두지 않도록 자주 움직이는 것이 통증 예방에 더 현실적입니다.",
    actionTip:
      "45~60분마다 2~3분 정도 일어나 걷고, 화면 높이와 의자 깊이를 조정해 목이 앞으로 빠지는 시간을 줄여보세요.",
    seekCare:
      "저림, 근력 저하, 밤에 깨는 통증, 외상 이후 통증이 있으면 일반적인 생활 교정보다 진료가 우선입니다.",
  },
];

export const healthAssistantDisclaimer =
  "이 답변은 일반적인 건강 정보이며, 진단이나 처방을 대신하지 않습니다. 흉통, 호흡곤란, 의식 저하, 심한 통증, 급격한 악화가 있으면 즉시 응급 진료를 받으세요.";
