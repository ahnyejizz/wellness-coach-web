# Local User Storage

이 디렉터리는 로컬 개발 중 생성되는 사용자 데이터 파일을 위한 자리입니다.

- 실제 사용자 파일: `users.json`
- `users.json`은 `.gitignore`에 포함되어 Git에 올라가지 않습니다.
- 로컬 개발에서는 회원가입 정보가 여기에 저장됩니다.
- Vercel 배포에서는 이 경로 대신 `/tmp/motive-care-users.json`을 사용합니다.

주의:
- 이 저장 방식은 프로토타입용입니다.
- 실서비스 배포에서는 외부 DB로 교체하는 것이 안전합니다.
