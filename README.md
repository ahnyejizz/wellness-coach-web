# Motive Care

수면, 운동, 식단을 한 흐름으로 관리하는 개인 건강 코치 웹앱입니다.  
현재 저장소는 두 가지 배포 경로를 함께 지원하도록 정리되어 있습니다.

- `Vercel`: 로그인/회원가입이 포함된 전체 Next.js 앱 배포
- `GitHub Pages`: 소개용 정적 랜딩 페이지 배포

## Local Dev

```bash
nvm use
npm ci
npm run dev
```

- 권장 Node 버전: `20.20.2`
- 로컬 계정 데이터는 `data/users.json`에 저장됩니다.

## Auth Storage Note

현재 회원가입/로그인 저장 방식은 초기 프로토타입용입니다.

- 로컬 개발 환경: `data/users.json`
- Vercel 환경: `/tmp/motive-care-users.json`

중요:
- Vercel의 `/tmp` 저장소는 영구 저장소가 아닙니다.
- 그래서 지금 구성은 "배포 데모" 용도로는 괜찮지만, 실제 서비스용 계정 저장에는 적합하지 않습니다.
- 실서비스로 가려면 Supabase, Neon, PostgreSQL, PlanetScale 같은 외부 DB로 바꾸는 것을 권장합니다.

## Deploy To Vercel

현재 Next.js 앱 전체를 배포하는 기본 경로입니다.

1. 이 저장소를 GitHub에 push 합니다.
2. Vercel에서 `Add New Project`를 누르고 이 저장소를 import 합니다.
3. Framework Preset은 `Next.js`로 두고 배포합니다.
4. Environment Variables에 아래 값을 넣습니다.

```bash
AUTH_SECRET=replace-with-a-long-random-secret
```

5. 배포가 끝나면 Vercel이 발급한 URL에서 전체 앱을 사용합니다.

권장:
- 회원가입/로그인 데이터를 실제로 보존하려면 DB 연결 전환이 필요합니다.
- 현재 구조는 데모에서는 동작하지만, Vercel 재배포/스케일링 시 가입 데이터가 유지되지 않을 수 있습니다.

## Deploy To GitHub Pages

GitHub Pages 버전은 정적 소개 사이트만 배포합니다.  
로그인, 회원가입, API, 세션 기능은 포함되지 않습니다.

이미 아래 파일이 준비되어 있습니다.

- 정적 사이트 소스: `github-pages/`
- GitHub Actions 워크플로우: `.github/workflows/deploy-pages.yml`

설정 방법:

1. 저장소를 GitHub에 push 합니다.
2. GitHub 저장소 `Settings -> Pages`로 이동합니다.
3. Build and deployment의 `Source`를 `GitHub Actions`로 바꿉니다.
4. `main` 브랜치에 push 하면 Pages 배포가 자동 실행됩니다.

예상 주소:

```text
https://ahnyejizz.github.io/wellness-coach-web/
```

## Project Structure

- `app/`: Next.js 앱 라우트와 UI
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
