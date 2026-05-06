# Motive Care

수면, 운동, 식단을 하나의 흐름으로 연결해 관리하는 개인 웰니스 코치 웹 서비스입니다.  
이 프로젝트는 `Next.js App Router` 기반으로 구성되어 있고, 로그인 상태에 따라 홈, 온보딩, 웰니스 플랜, 코치 대시보드, AI Chat 흐름이 자연스럽게 이어지도록 설계되어 있습니다.

## 프로젝트 소개

### 홈 `/`
- 서비스의 메인 랜딩 화면입니다.
- 로그인 전에는 서비스 소개와 대표 코칭 영역을 보여줍니다.
- 로그인 후에는 상단 네비게이션을 통해 `온보딩`, `웰니스 플랜`, `마이페이지`, `AI Chat`으로 이동할 수 있습니다.
- 홈의 주요 소개 영역은 `HomeLandingSection` 계열 컴포넌트로 관리합니다.

### 온보딩 `/coach/onboarding`
- 최초 사용자 또는 프로필을 다시 수정하려는 사용자가 진입하는 화면입니다.
- 입력 항목은 `목표 체중`, `수면 패턴`, `운동 경험`, `식단 스타일`입니다.
- 온보딩 완료 여부에 따라 일반 진입과 수정 모드를 구분합니다.
- 온보딩 링크는 공통 route helper를 통해 생성합니다.

### 웰니스 플랜 `/plan`
- 현재 플랜 우선순위와 세부 지표를 조정하는 화면입니다.
- `FocusBoard`, `FocusBoardPriority`, `DailySurveyPanel`, `DailySurveyDialog`를 중심으로 동작합니다.
- 수면/운동/식단 우선순위를 바꾸면 관련 패널과 색상이 함께 반영됩니다.
- 브리핑 지표 입력 팝업과 연결되는 실질적인 플랜 관리 화면입니다.

### 코치 대시보드 `/coach`
- 로그인 사용자의 마이페이지 성격을 갖는 화면입니다.
- 가입 시 입력한 웰니스 프로필 요약, 플랜 요약, 주간 리포트 등을 보여줍니다.
- 온보딩 수정 진입점과 홈 복귀, 로그아웃 액션을 함께 제공합니다.

### AI Chat `/ai-chat`
- 웰니스 질문을 입력하고 Gemini 기반 답변을 받는 화면입니다.
- 추천 질문, 최근 질문, 웰니스 Q&A 요약 카드가 함께 제공됩니다.
- 서버 호출은 `/api/ai-chat` Route Handler를 통해 처리되며, API 키는 브라우저로 노출되지 않습니다.

## 라우팅 구조

현재 프로젝트는 `route entry`와 `실제 페이지 구현`을 분리하는 패턴을 사용합니다.

### Route Entry
- URL 엔트리는 `app/(route-entry)` 아래에 둡니다.
- 이 폴더는 Route Group 이라서 실제 URL에는 노출되지 않습니다.
- 예:
  - `app/(route-entry)/login/page.tsx` → `/login`
  - `app/(route-entry)/signup/page.tsx` → `/signup`
  - `app/(route-entry)/plan/page.tsx` → `/plan`
  - `app/(route-entry)/coach/page.tsx` → `/coach`
  - `app/(route-entry)/ai-chat/page.tsx` → `/ai-chat`

### 실제 구현
- 실제 UI와 로직은 `app/components/...` 아래에 둡니다.
- route entry 파일은 얇게 유지하고, 구현체만 연결합니다.

## 폴더 및 파일명 명명 규칙

### 기본 원칙
- 라우트 엔트리는 `Next.js` 규칙에 맞춰 반드시 `page.tsx`를 사용합니다.
- 실제 화면 구현 파일은 역할이 드러나도록 suffix를 붙입니다.
- 한 파일이 하나의 화면 단위 또는 하나의 역할 단위를 담당하도록 유지합니다.

### 라우트 엔트리 규칙
- route entry 파일은 `app/(route-entry)/.../page.tsx` 형태를 사용합니다.
- 이 파일은 가능한 한 얇게 유지하고, 실제 구현 컴포넌트를 export 또는 render만 합니다.

### 페이지 단위
- 실제 페이지 구현 파일은 끝에 `-page`를 붙입니다.
- 예:
  - `login-page.tsx`
  - `signup-page.tsx`
  - `plan-page.tsx`
  - `ai-chat-page.tsx`
  - `onboarding-page.tsx`

### 패널 단위
- 패널 컴포넌트는 끝에 `-panel`을 붙입니다.
- 예:
  - `ai-chat-panel.tsx`
  - `ai-chat-summary-panel.tsx`
  - `daily-survey-panel.tsx`

### 다이얼로그 단위
- 다이얼로그 컴포넌트는 끝에 `-dialog`를 붙입니다.
- 예:
  - `daily-survey-dialog.tsx`
  - `logout-alert.tsx`
  - `reset-confirm-alert.tsx`
  - `save-alert.tsx`

### 그 외 권장 규칙
- wrapper 성격은 `-wrapper`
- summary 성격은 `-summary`
- preview 성격은 `-preview`
- 공통 helper는 `utils/`
- 인증/도메인 저장소 로직은 `lib/`
- 공통 색상 상수는 `app/constants/colors.ts`

## 현재 주요 폴더 구조

```txt
app/
  (route-entry)/
    ai-chat/page.tsx
    coach/page.tsx
    coach/onboarding/page.tsx
    login/page.tsx
    plan/page.tsx
    signup/page.tsx
  api/
    ai-chat/route.ts
    auth/[...nextauth]/route.ts
  components/
    ai-chat/
    auth/
    coach/
    common/
    home/
    plan/
  constants/
    colors.ts
  stores/
    wellness-store.ts

lib/
  ai-chat/
  auth/

utils/
  route-href.ts
```

## 인증 및 저장 구조

### 인증
- 이메일/비밀번호 로그인
- Google 로그인
- Kakao 로그인
- Naver 로그인

인증 설정은 [auth.ts](/Users/dreamtree123/my-next-app/auth.ts)에서 관리합니다.

### 사용자 저장
- 로컬 개발 환경: `data/users.json`
- 온보딩 보정값 및 계정별 일부 상태: 쿠키 / 서버 저장소 기반

### AI Chat 관련 파일
- API Route: [app/api/ai-chat/route.ts](/Users/dreamtree123/my-next-app/app/api/ai-chat/route.ts)
- 서버 로직: [lib/ai-chat/assistant.ts](/Users/dreamtree123/my-next-app/lib/ai-chat/assistant.ts)
- 정적 요약/문구: [lib/ai-chat/content.ts](/Users/dreamtree123/my-next-app/lib/ai-chat/content.ts)

## Local Dev

```bash
nvm use
npm ci
npm run dev
```

- 권장 Node 버전: `20.20.2`
- Next.js 16 기준 빌드 환경은 `Node >= 20.9.0` 이 필요합니다.
- 웰니스 질문 기능을 쓰려면 `.env.local` 또는 배포 환경에 `GEMINI_API_KEY`가 필요합니다.

## 환경 변수

```bash
AUTH_SECRET="replace-with-a-random-secret-before-deploy"

AUTH_GOOGLE_ID="replace-with-your-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-your-google-client-secret"

AUTH_KAKAO_ID="replace-with-your-kakao-rest-api-key"
AUTH_KAKAO_SECRET="replace-with-your-kakao-client-secret"

AUTH_NAVER_ID="replace-with-your-naver-client-id"
AUTH_NAVER_SECRET="replace-with-your-naver-client-secret"

GEMINI_API_KEY="replace-with-your-google-ai-studio-api-key"
GEMINI_MODEL="gemini-2.5-flash-lite"
```

소셜 로그인 준비:

- `Google`: Google Cloud Console에서 OAuth 클라이언트를 만들고 승인된 Redirect URI에 `/api/auth/callback/google` 추가
- `Kakao`: Kakao Developers에서 REST API 키와 Client Secret을 발급하고 Redirect URI에 `/api/auth/callback/kakao` 추가
- `Naver`: Naver Developers에서 Client ID/Secret을 발급하고 Callback URL에 `/api/auth/callback/naver` 추가
- 로컬 개발 기준 기본 주소가 `http://localhost:3000`이면 provider 콘솔에도 같은 기준으로 등록해야 합니다.

무료 테스트 참고:

- Gemini API는 공식 문서 기준 free tier가 있으며, 모델별로 요청 한도가 다릅니다.
- 무료 키는 Google AI Studio에서 만들 수 있고, 사용량이 늘어나면 나중에 유료 티어로 전환할 수 있습니다.
- 앱 코드는 별도 SDK 설치 없이 서버 `fetch`로 Gemini REST API를 호출합니다.
## Useful Commands

```bash
npm run dev
npm run build
npx eslint app lib utils auth.ts proxy.ts
```

## References

- Next.js Deploying: https://nextjs.org/docs/app/getting-started/deploying
- Next.js Static Exports: https://nextjs.org/docs/app/guides/static-exports
- GitHub Pages Custom Workflows: https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Vercel Next.js: https://vercel.com/frameworks/nextjs
- Gemini API Quickstart: https://ai.google.dev/gemini-api/docs/quickstart
- Gemini API Pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini API Keys: https://ai.google.dev/tutorials/setup?hl=ko
