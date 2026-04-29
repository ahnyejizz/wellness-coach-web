# Motive Care

수면, 운동, 식단을 한 흐름으로 관리하는 개인 웰니스 코치 웹 입니다.  
현재 저장소는 두가지 배포 경로를 함께 지원하도록 정리되어 있습니다.

- `Vercel`: 로그인/회원가입이 포함된 전체 Next.js 앱 배포
- `GitHub Pages`: 소개용 정적 랜딩 페이지 배포

현재 주요 사용자 흐름:

- 회원가입 후 목표 체중, 수면 패턴, 운동 경험, 식단 스타일을 입력하는 온보딩을 거쳐 `/coach` 개인화 화면으로 이어집니다.
- Google, Kakao, Naver 소셜 로그인과 이메일 기반 계정 로그인을 모두 지원합니다.

## Local Dev

```bash
nvm use
npm ci
npm run dev
```

- 권장 Node 버전: `20.20.2`
- 로컬 계정 데이터는 `data/users.json`에 저장됩니다.
- 소셜 로그인으로 처음 들어온 사용자도 같은 저장소에 자동 등록되고, 온보딩 전이라면 `/coach/onboarding`으로 이어집니다.
- 웰니스 질문 기능을 쓰려면 `.env.local` 또는 배포 환경에 `GEMINI_API_KEY`가 필요합니다.
- `GEMINI_API_KEY`는 Google AI Studio(`https://aistudio.google.com/app/apikey`)에서 무료로 발급받아 테스트할 수 있습니다.

## Health Q&A Feature

- `/coach` 대시보드에서 로그인 사용자 전용 웰니스 질문 위젯을 사용할 수 있습니다.
- Gemini 호출은 `app/api/health-chat/route.ts`에서 처리하므로 API 키가 브라우저로 노출되지 않습니다.
- 추천 웰니스 Q&A 요약 카드는 `lib/health/content.ts`에 정적으로 정의되어 있어, 나중에 DB나 CMS 기반으로 바꾸기 쉽습니다.

필요한 환경 변수:

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

## Auth Storage Note

- 로컬 개발 환경: `data/users.json`
- Vercel 환경: `/tmp/motive-care-users.json`

## Project Structure

- `app/`: Next.js 앱 라우트와 UI
- `app/coach/onboarding/`: 회원가입 직후 웰니스 온보딩 화면과 저장 액션
- `auth.ts`: Credentials + Google/Kakao/Naver 인증 설정
- `lib/auth/user-store.ts`: 로컬 사용자 저장소
- `github-pages/`: GitHub Pages용 정적 랜딩 페이지
- `.github/workflows/deploy-pages.yml`: GitHub Pages 배포 워크플로우

## Useful Commands

```bash
npm run lint
npm run build -- --webpack
```

## References

- Next.js Deploying: https://nextjs.org/docs/app/getting-started/deploying
- Next.js Static Exports: https://nextjs.org/docs/app/guides/static-exports
- GitHub Pages Custom Workflows: https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- Vercel Next.js: https://vercel.com/frameworks/nextjs
- Gemini API Quickstart: https://ai.google.dev/gemini-api/docs/quickstart
- Gemini API Pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini API Keys: https://ai.google.dev/tutorials/setup?hl=ko
