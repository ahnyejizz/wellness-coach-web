# Motive Care

**수면, 운동, 식단**을 하나의 흐름으로 연결해 관리하는 **개인 웰니스 코치 웹 서비스**입니다.  
<br />
이 프로젝트는 `Next.js App Router` 기반으로 구성되어 있고
<br />
로그인 상태에 따라 홈, 온보딩, 웰니스 플랜, 코치 대시보드, AI Chat 흐름이 자연스럽게 이어지도록 설계되어 있습니다.

---

## 목차

1. 프로젝트 소개
2. 실행 화면
3. 라우팅 구조
4. 폴더 및 파일명 명명 규칙
5. 현재 주요 폴더 구조
6. 인증 및 저장 구조
7. Local 환경 실행 스크립트
8. 개발 시 필요 환경 변수

---

## 1. 프로젝트 소개

### 프로젝트 목표

- `Next.js 16 App Router` 기반의 라우팅, 서버 컴포넌트, Route Handler, Server Action 흐름을 **실무형 구조**로 익히기
- `Tailwind CSS 4`를 활용해 **반응형 UI와 커스텀 디자인 시스템**을 빠르게 구성하기
- `Zustand persist` 기반으로 **웰니스 플랜 상태를 안정적으로 유지**하는 구조 설계하기
- `Gemini API`를 서버에서 안전하게 호출해 **AI Q&A 기능**을 **실제 서비스 플로우에 연결**하기

### 프로젝트 설명

- **수면, 운동, 식단**을 하나의 흐름으로 관리하는 **개인 맞춤형 웰니스 코치 웹 앱**입니다.
- 로그인 이후 `온보딩 → 웰니스 플랜 → 코치 대시보드 → AI Chat`으로 이어지는 사용자 흐름을 제공합니다.
- 메인 앱은 `Vercel`에 배포합니다.

### 프로젝트 기능

- 이메일/비밀번호 기반 회원가입·로그인과 Google, Kakao, Naver 소셜 로그인을 함께 지원합니다.
- `/onboarding`, `/plan`, `/coach`, `/ai-chat` 영역은 **인증 상태를 기준으로 보호**됩니다.
- 회원가입 직후, 온보딩 페이지에서 목표 체중, 수면 패턴, 운동 경험, 식단 스타일을 입력받아 **개인화 기준으로 저장**합니다.
- **온보딩 완료 여부에 따라 진입 경로를 분기**하고, 수정 모드에서는 기존 값을 다시 불러와 편집할 수 있습니다.
- 웰니스 플랜 페이지에서 **수면, 운동, 식단 우선순위를 전환**하고 **일일 브리핑 입력값과 함께 코칭 정보를 확인**할 수 있습니다.
- 코치 대시보드 페이지에서 **가입 시 입력한 프로필, 플랜 요약, 주간 리포트**를 한 화면에서 확인할 수 있습니다.
- AI Chat 페이지에서 **추천 질문, Q&A 요약 카드**와 함께 Gemini 기반 웰니스 답변을 받을 수 있습니다.
- AI 응답은 `app/api/ai-chat/route.ts`를 통해 서버에서 처리되어 API 키가 브라우저에 노출되지 않습니다.

### 서비스 링크

- 배포 URL: https://wellness-coach-web.vercel.app/
- GitHub: https://github.com/ahnyejizz/wellness-coach-web

---

## 2. 실행 화면

<br />

### 회원가입 `/signup`

![회원가입 화면](./public/readme/join/join.png)
기본 계정 정보를 입력한 뒤 온보딩 플로우로 넘어가도록 설계한 회원가입 화면입니다.
<br />
이름, 이메일, 비밀번호, 비밀번호 확인을 검증하며,
<br />
이메일 형식 오류나 비밀번호 조건 불일치 같은 유효성 검사 결과는 커스텀 알럿으로 안내합니다.

<br />

**유효성 검사 예시 1**
![회원가입 유효성 검사 화면](./public/readme/join/join-check.png)

<br />

**유효성 검사 예시 2**
![회원가입 유효성 검사 화면](./public/readme/join/join-check2.png)

<br />

**유효성 검사 예시 3**
![회원가입 유효성 검사 화면](./public/readme/join/join-check3.png)

<br />

**커스텀 알럿 안내**
![회원가입 커스텀 알럿 화면](./public/readme/join/join-check-alert.png)

---

### 로그인 `/login`

![로그인 화면](./public/readme/login/login.png)
이메일 로그인과 소셜 로그인 진입을 함께 제공하는 인증 시작 화면입니다.
<br />
Google, Kakao, Naver 소셜 로그인 버튼을 통해 동일한 인증 플로우로 진입할 수 있습니다.
<br />
마찬가지로 유효성 검사 결과는 커스텀 알럿으로 안내합니다.
<br />

**1. Google**
![SNS 로그인 화면](./public/readme/login/login-google.png)

<br />

**2. Kakao**
![SNS 로그인 화면](./public/readme/login/login-kakao.png)

<br />

**3. Naver**
![SNS 로그인 화면](./public/readme/login/login-naver.png)

<br />

**커스텀 알럿 안내**
![로그인 커스텀 알럿 화면](./public/readme/join/join-check-alert.png)

---

### 홈 `/`

**1. 비 로그인 상태**
![홈 화면](./public/readme/home/unauthenticated/home-unauthenticated.png)
![홈 화면](./public/readme/home/unauthenticated/home-unauthenticated2.png)
![홈 화면](./public/readme/home/unauthenticated/home-unauthenticated5.png)

---

**2-1. 로그인 상태 - 수면 플랜**
![홈 화면](./public/readme/home/sleep/home-sleep.png)
![홈 화면](./public/readme/home/sleep/home-sleep-brief.png)

---

**2-2. 로그인 상태 - 운동 플랜**
![홈 화면](./public/readme/home/exercise/home-exercise.png)
![홈 화면](./public/readme/home/exercise/home-exercise-brief.png)
![홈 화면](./public/readme/home/exercise/home-exercise2.png)

---

**2-3. 로그인 상태 - 식단 플랜**
![홈 화면](./public/readme/home/meal/home-meal.png)
![홈 화면](./public/readme/home/meal/home-meal-brief.png)

---

### 온보딩 `/onboarding`

**1. 온보딩 생성 화면**
![온보딩 생성 화면](./public/readme/onboarding/onboarding-create.png)
목표 체중, 수면 패턴, 운동 경험, 식단 스타일을 처음 저장하는 **신규 온보딩** 화면입니다.

---

**2. 온보딩 수정 화면**
![온보딩 수정 화면](./public/readme/onboarding/onboarding-update.png)
기존 사용자 데이터를 다시 불러와 개인화 기준을 수정할 수 있는 **온보딩 편집** 화면입니다.

---

### 웰니스 플랜 `/plan`

수면, 운동, 식단 **우선순위에 따라 상세 패널이 바뀌는 구조**입니다.

<br />

**1. 수면 플랜**

![수면 플랜 1](./public/readme/plan/plan-sleep.png)
**수면을 최우선 플랜으로 선택**했을 때의 보드 상태입니다.

<br />

![수면 플랜 2](./public/readme/plan/plan-sleep2.png)
총 수면 시간, 스크린 오프, 취침 준비 루틴 등 **수면 브리핑 지표**를 입력하는 브리핑 다이얼로그 입니다.

<br />

![수면 플랜 3](./public/readme/plan/plan-sleep3.png)
입력된 데이터를 바탕으로 **주간 패턴과 코치 노트가 반영된 보드 상태**입니다.

---

**2. 운동 플랜**

![운동 플랜 1](./public/readme/plan/plan-exercise.png)
**운동을 최우선 플랜으로 선택**했을 때의 보드 상태입니다.

<br />

![운동 플랜 2](./public/readme/plan/plan-exercise2.png)
주간 근력 횟수, 유산소 횟수, 활동 칼로리, 회복 상태 등 **운동 브리핑 지표**를 입력하는 브리핑 다이얼로그 입니다.

<br />

![운동 플랜 3](./public/readme/plan/plan-exercise3.png)
입력된 데이터를 바탕으로 **주간 패턴과 코치 노트가 반영된 보드 상태**입니다.

---

**3. 식단 플랜**

![식단 플랜 1](./public/readme/plan/plan-meal.png)
**식단을 최우선 플랜으로 선택**했을 때의 보드 상태입니다.

<br />

![식단 플랜 2](./public/readme/plan/plan-meal2.png)
단백질, 수분, 군것질 횟수, 야식 빈도 등 **식단 브리핑 지표**를 입력하는 브리핑 다이얼로그 입니다.

<br />

![식단 플랜 3](./public/readme/plan/plan-meal3.png)
입력된 데이터를 바탕으로 **주간 패턴과 코치 노트가 반영된 보드 상태**입니다.

---

### 코치 대시보드 `/coach`

**1. 수면 플랜**
![코치 대시보드 수면](./public/readme/coach/coach-sleep.png)

---

**2. 운동 플랜**
![코치 대시보드 운동](./public/readme/coach/coach-exercise.png)

---

**3. 식단 플랜**
![코치 대시보드 식단](./public/readme/coach/coach-meal.png)

---

### AI Chat `/ai-chat`

추천 질문, 대화 입력, 응답 결과 흐름입니다.
![AI Chat 1](./public/readme/ai-chat/ai-chat.png)
![AI Chat 1](./public/readme/ai-chat/ai-chat4.png)
![AI Chat 2](./public/readme/ai-chat/ai-chat2.png)
![AI Chat 3](./public/readme/ai-chat/ai-chat3.png)

- 추천 질문과 최근 흐름을 바탕으로 웰니스 상담을 시작할 수 있는 AI Chat 초기 화면입니다.
- Gemini 기반 답변과 요약 카드가 함께 표시되는 AI 웰니스 코칭 결과 화면입니다.

---

### 로그아웃

![로그아웃 화면](./public/readme/logout/logout.png)
로그아웃 액션 이후 현재 세션을 종료하고 다시 인증 화면으로 돌아갈 수 있는 상태입니다.

---

## 3. 라우팅 구조

현재 프로젝트는 `route entry`와 `실제 페이지 구현`을 분리하는 패턴을 사용합니다.

### Route Entry

- URL 엔트리는 `app/(route-entry)` 아래에 둡니다.
- 이 폴더는 Route Group 이라서 실제 URL에는 노출되지 않습니다.
- 예:
  - `app/(route-entry)/login/page.tsx` → `/login`
  - `app/(route-entry)/signup/page.tsx` → `/signup`
  - `app/(route-entry)/plan/page.tsx` → `/plan`
  - `app/(route-entry)/coach/page.tsx` → `/coach`
  - `app/(route-entry)/onboarding/page.tsx` → `/onboarding`
  - `app/(route-entry)/ai-chat/page.tsx` → `/ai-chat`

### 실제 구현

- 실제 UI와 로직은 `app/components/...` 아래에 둡니다.
- route entry 파일은 얇게 유지하고, 구현체만 연결합니다.

### 홈 `/`

- 서비스의 메인 랜딩 화면입니다.
- 로그인 전에는 서비스 소개와 대표 코칭 영역을 보여줍니다.
- 로그인 후에는 상단 네비게이션을 통해 `온보딩`, `웰니스 플랜`, `마이페이지`, `AI Chat`으로 이동할 수 있습니다.

### 온보딩 `/onboarding`

- 최초 사용자 또는 프로필을 다시 수정하려는 사용자가 진입하는 화면입니다.
- 입력 항목은 `목표 체중`, `수면 패턴`, `운동 경험`, `식단 스타일`입니다.
- 온보딩 완료 여부에 따라 일반 진입과 수정 모드를 구분합니다.
- 온보딩 링크는 공통 route helper를 통해 생성합니다.

### 웰니스 플랜 `/plan`

- 현재 플랜 우선순위와 세부 지표를 조정하는 화면입니다.
- `FocusBoard`, `FocusBoardPriority`, `DailySurveyPanel`, `DailySurveyDialog`를 중심으로 동작합니다.
- 수면/운동/식단 우선순위를 바꾸면 **관련 패널과 색상이 함께 반영**됩니다.
- 브리핑 지표 입력 팝업과 연결되는 실질적인 플랜 관리 화면입니다.

### 코치 대시보드 `/coach`

- 로그인 사용자의 마이페이지 성격을 갖는 화면입니다.
- 가입 시 입력한 웰니스 프로필 요약, 플랜 요약, 주간 리포트 등을 보여줍니다.

### AI Chat `/ai-chat`

- 웰니스 질문을 입력하고 Gemini 기반 답변을 받는 화면입니다.
- 추천 질문, 최근 질문, 웰니스 Q&A 요약 카드가 함께 제공됩니다.
- 서버 호출은 `/api/ai-chat` Route Handler를 통해 처리되며, API 키는 브라우저로 노출되지 않습니다.

---

## 4. 폴더 및 파일명 명명 규칙

### 기본 원칙

- 라우트 엔트리는 `Next.js` 규칙에 맞춰 반드시 `page.tsx`를 사용합니다.
- 실제 화면 구현 파일은 역할이 드러나도록 suffix를 붙입니다.
- 한 파일이 하나의 화면 단위 또는 역할 단위를 담당하도록 유지합니다.

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

### 알럿 단위

- 알럿 컴포넌트는 끝에 `-alert`를 붙입니다.
- 예:
  - `logout-alert.tsx`
  - `reset-confirm-alert.tsx`
  - `save-alert.tsx`

### 그 외 권장 규칙

- wrapper 성격은 `-wrapper`
- summary 성격은 `-summary`
- preview 성격은 `-preview`
- 공통 helper는 `utils/`
- 인증/도메인 저장소 로직은 `lib/`
- 서버 액션은 `app/actions/`
- 공통 색상 상수는 `app/constants/colors.ts`

---

## 5. 현재 주요 폴더 구조

```txt
app/
  (route-entry)/
    ai-chat/page.tsx
    coach/page.tsx
    login/page.tsx
    onboarding/page.tsx
    plan/page.tsx
    signup/page.tsx
  actions/...
  api/...
  components/
    ai-chat/...
    auth/...
    coach/...
    common/
      alert/...
      ...
    home/...
    onboarding/...
    plan/...
  constants/...
  stores/...

lib/
  ai-chat/
  auth/

utils/
  route-href.ts
```

---

## 6. 인증 및 저장 구조

### 인증

- 이메일/비밀번호 로그인
- Google 로그인
- Kakao 로그인
- Naver 로그인

인증 설정은 [auth.ts](/Users/dreamtree123/my-next-app/auth.ts)에서 관리합니다.

### 사용자 저장

- 로컬 개발 환경: `data/users.json`
- Vercel 배포 환경: `/tmp/motive-care-users.json`
- 온보딩 보정값: `httpOnly` 쿠키 기반 저장
- 플랜/브리핑 UI 상태: `Zustand persist` 기반 브라우저 저장소 사용
- 비밀번호는 평문 저장하지 않고 `node:crypto` 기반 해시로 저장

### AI Chat 관련 파일

- API Route: [app/api/ai-chat/route.ts](/Users/dreamtree123/my-next-app/app/api/ai-chat/route.ts)
- 서버 로직: [lib/ai-chat/assistant.ts](/Users/dreamtree123/my-next-app/lib/ai-chat/assistant.ts)
- 정적 요약/문구: [lib/ai-chat/content.ts](/Users/dreamtree123/my-next-app/lib/ai-chat/content.ts)

---

## 7. Local 환경 실행 스크립트

```bash
nvm use
npm ci
npm run dev
```

- 권장 Node 버전: `20.20.2`
- Next.js 16 기준 빌드 환경은 `Node >= 20.9.0` 이 필요합니다.
- `npm run dev`는 Webpack 기반 개발 서버이고, `npm run dev:turbo`로 Turbopack 개발 서버도 실행할 수 있습니다.
- AI Chat 개발을 위해선 `.env.local` 또는 배포 환경에 `GEMINI_API_KEY`가 필요합니다.

---

## 8. 개발 시 필요 환경 변수

```bash
AUTH_SECRET="replace-with-a-random-secret-before-deploy"

# https://console.cloud.google.com 에서 발급 가능!
AUTH_GOOGLE_ID="replace-with-your-google-client-id"
AUTH_GOOGLE_SECRET="replace-with-your-google-client-secret"

# https://developers.kakao.com/console/app 에서 발급 가능!
AUTH_KAKAO_ID="replace-with-your-kakao-rest-api-key"
AUTH_KAKAO_SECRET="replace-with-your-kakao-client-secret"

# https://developers.naver.com/apps/#/list 에서 발급 가능!
AUTH_NAVER_ID="replace-with-your-naver-client-id"
AUTH_NAVER_SECRET="replace-with-your-naver-client-secret"

# https://aistudio.google.com/app/api-keys 또는
# https://ai.google.dev/gemini-api/docs/api-key?hl=ko 에서 발급 가능!
GEMINI_API_KEY="replace-with-your-google-ai-studio-api-key"
GEMINI_MODEL="gemini-2.5-flash-lite"
```

소셜 로그인 준비:

- `Google`: **Google Cloud Console**에서 OAuth 클라이언트를 만들고 승인된 Redirect URI에 `/api/auth/callback/google` 추가
- `Kakao`: **Kakao Developers**에서 REST API 키와 Client Secret을 발급하고 Redirect URI에 `/api/auth/callback/kakao` 추가
- `Naver`: **Naver Developers**에서 Client ID/Secret을 발급하고 Callback URL에 `/api/auth/callback/naver` 추가
- 로컬 개발 기준 기본 주소가 `http://localhost:3000`이면 provider 콘솔에도 같은 기준으로 등록해야 합니다.

- Gemini API는 공식 문서 기준 free tier가 있으며, 모델별로 요청 한도가 다릅니다.
- 무료 키는 Google AI Studio에서 만들 수 있고, 사용량이 늘어나면 나중에 유료 티어로 전환할 수 있습니다.
- 앱 코드는 별도 SDK 설치 없이 서버 `fetch`로 Gemini REST API를 호출합니다.
