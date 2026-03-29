export type PortfolioProject = {
  id: string;
  title: string;
  subtitle: string;
  category: "Service" | "AI" | "Data" | "Community";
  tags: string[];
  pdfPath: string;
  thumbnailPath: string;
  githubUrl?: string;
  challenge: string;
  solution: string;
  completionCertificate?: {
    path: string;
  };
};

export const PORTFOLIO_MARQUEE_WORDS = [
  "AI",
  "PROBLEM SOLVE",
  "DEVELOP",
  "RPA",
  "PYTHON",
] as const;

export const PORTFOLIO_FILTERS = ["All", "Service", "AI", "Data", "Community"] as const;

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "mentos",
    title: "멘토스",
    subtitle: "멘토 커뮤니티 웹사이트 · 서비스 기획 & 바이브 코딩 프로젝트",
    category: "Service",
    tags: ["Community", "Planning", "Web"],
    pdfPath: "/assets/portfolio/items/mentos.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/mentos.jpg",
    githubUrl: "https://github.com/Jaegwae/mentor-forum/tree/main/mentor-forum-react",
    challenge:
      "멘토와 참여자 간 상호작용이 흩어지지 않도록, 커뮤니티 경험과 운영 흐름을 하나의 웹 서비스 안에서 설계해야 했습니다.",
    solution:
      "서비스 기획 단계에서 핵심 사용자 시나리오를 먼저 정의하고, 바이브 코딩 방식으로 주요 기능을 빠르게 구현하며 화면과 기능을 반복 개선했습니다.",
  },
  {
    id: "plimo",
    title: "Plimo",
    subtitle: "AI 감정분석 기반 음악 추천 서비스",
    category: "AI",
    tags: ["NLP", "Recommendation", "Web"],
    pdfPath: "/assets/portfolio/items/plimo.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/plimo.jpg",
    githubUrl: "https://github.com/Jaegwae/Plimo",
    challenge:
      "사용자의 감정 상태를 텍스트에서 정밀하게 파악하고, 실시간에 가까운 응답 속도로 개인화된 음악 추천을 제공해야 했습니다.",
    solution:
      "KLUE-RoBERTa 기반 감정분류 모델을 고도화하고 자체 음악 DB를 구축해 추천 파이프라인을 안정화했습니다. EC2 GPU 환경으로 성능 병목을 개선했습니다.",
  },
  {
    id: "height-prediction-model",
    title: "높이 예측 모델",
    subtitle: "위성 이미지 기반 굴뚝 탐지·높이 추정",
    category: "AI",
    tags: ["YOLOv11x", "ResNet-50", "CV"],
    pdfPath: "/assets/portfolio/items/height-prediction-model.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/height-prediction-model.jpg",
    challenge:
      "대기오염 배출원 모니터링에서 수작업 식별의 한계를 줄이고, 탐지부터 높이 추정까지 자동화된 분석 흐름이 필요했습니다.",
    solution:
      "탐지 모델과 회귀 모델을 결합한 2단계 아키텍처를 설계하여 고정밀 탐지와 높이 추정을 구현했습니다.",
    completionCertificate: {
      path: "/assets/portfolio/certificates/height-prediction-camp-certificate.jpg",
    },
  },
  {
    id: "guro-fusion-center",
    title: "구로창의융합교육장",
    subtitle: "운영 및 서비스 개선 프로젝트",
    category: "Service",
    tags: ["Operations", "Automation", "UX"],
    pdfPath: "/assets/portfolio/items/guro-fusion-center.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/guro-fusion-center.jpg",
    githubUrl: "https://github.com/Jaegwae/mentor-forum",
    challenge:
      "현장 운영 과정의 반복 업무와 정보 비대칭으로 인해 대응 속도와 운영 안정성이 떨어지는 문제가 있었습니다.",
    solution:
      "업무 흐름을 재정의하고 자동화 가능한 단계로 구조화해 운영 효율과 관리 편의성을 개선했습니다.",
  },
  {
    id: "seoul-futurelab",
    title: "서울 퓨처랩",
    subtitle: "현장 운영 자동화 및 데이터 관리",
    category: "Service",
    tags: ["Spreadsheet", "Apps Script", "Python"],
    pdfPath: "/assets/portfolio/items/seoul-futurelab.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/seoul-futurelab.jpg",
    challenge:
      "교구와 기자재 관리, 출석 확인이 수작업 중심으로 운영되어 누락과 지연, 반복 공수가 누적되는 상황이었습니다.",
    solution:
      "폼과 시트 기반 데이터 관리 체계와 자동화 스크립트를 구축해 운영팀의 반복 업무를 줄이고 실시간 가시성을 확보했습니다.",
  },
  {
    id: "music-market-analysis",
    title: "음반 시장 수요공급 분석",
    subtitle: "시장 진입 전략을 위한 데이터 분석",
    category: "Data",
    tags: ["Data Analysis", "Market", "Strategy"],
    pdfPath: "/assets/portfolio/items/music-market-analysis.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/music-market-analysis.jpg",
    challenge:
      "시장 진입 시점과 포지셔닝을 결정하기 위해 수요·공급 구조를 정량적으로 해석할 수 있는 분석 프레임이 필요했습니다.",
    solution:
      "시장 데이터 지표를 정리하고 시각화 기반 인사이트를 도출해 진입 관점의 의사결정 근거를 제시했습니다.",
  },
  {
    id: "highton",
    title: "하이톤",
    subtitle: "고등학생 해커톤 운영 경험",
    category: "Community",
    tags: ["Hackathon", "Leadership", "Planning"],
    pdfPath: "/assets/portfolio/items/highton.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/highton.jpg",
    challenge:
      "고등학생 중심 해커톤을 지속적으로 운영하기 위해 후원, 장소, 운영 구조를 안정화해야 했습니다.",
    solution:
      "운영 프로세스를 체계화하고 회차별 개선을 반복해 행사 지속성과 참여 경험을 강화했습니다.",
  },
  {
    id: "ai-collector-review-system",
    title: "AI+지역전문가 콜렉터블 검수",
    subtitle: "하이브리드 검수 워크플로우 설계",
    category: "AI",
    tags: ["AI Workflow", "Quality", "Platform"],
    pdfPath: "/assets/portfolio/items/ai-collector-review-system.pdf",
    thumbnailPath: "/assets/portfolio/thumbs/ai-collector-review-system.jpg",
    challenge:
      "검수 속도와 품질을 동시에 확보하기 위해 AI 자동 판단과 전문가 검수의 역할 분리가 필요했습니다.",
    solution:
      "AI 1차 분류와 전문가 2차 검수를 결합한 하이브리드 파이프라인을 설계해 정확도와 처리 효율을 함께 개선했습니다.",
  },
];
