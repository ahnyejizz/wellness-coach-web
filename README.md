# Motive Care

수면, 운동, 식단을 한 흐름으로 관리하는 개인 건강 코치 웹 입니다.  
현재 저장소는 두가지 배포 경로를 함께 지원하도록 정리되어 있습니다.

- `Vercel`: 로그인/회원가입이 포함된 전체 Next.js 앱 배포
- `GitHub Pages`: 소개용 정적 랜딩 페이지 배포

현재 주요 사용자 흐름:
- 회원가입 후 목표 체중, 수면 패턴, 운동 경험, 식단 스타일을 입력하는 온보딩을 거쳐 `/coach` 개인화 화면으로 이어집니다.

## Local Dev

```bash
nvm use
npm ci
npm run dev
```

- 권장 Node 버전: `20.20.2`
- 로컬 계정 데이터는 `data/users.json`에 저장됩니다.
- 건강 질문 기능을 쓰려면 `.env.local` 또는 배포 환경에 `OPENAI_API_KEY`가 필요합니다.
- `OPENAI_API_KEY`는 `https://platform.openai.com/overview`에서 발급 가능합니다.

## Health Q&A Feature

- `/coach` 대시보드에서 로그인 사용자 전용 건강 질문 위젯을 사용할 수 있습니다.
- OpenAI 호출은 `app/api/health-chat/route.ts`에서 처리하므로 API 키가 브라우저로 노출되지 않습니다.
- 추천 건강 Q&A 요약 카드는 `lib/health/content.ts`에 정적으로 정의되어 있어, 나중에 DB나 CMS 기반으로 바꾸기 쉽습니다.

필요한 환경 변수:

```bash
AUTH_SECRET="replace-with-a-random-secret-before-deploy"
OPENAI_API_KEY="replace-with-your-openai-api-key"
OPENAI_MODEL="gpt-4.1-mini"
```

## Auth Storage Note

- 로컬 개발 환경: `data/users.json`
- Vercel 환경: `/tmp/motive-care-users.json`

## Project Structure

- `app/`: Next.js 앱 라우트와 UI
- `app/coach/onboarding/`: 회원가입 직후 건강 온보딩 화면과 저장 액션
- `auth.ts`: Credentials 기반 인증 설정
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
