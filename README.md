# FE Mentoring Assignment Scaffolds

이 저장소는 프런트엔드 멘토링 과제용 템플릿을 **빠르게 생성(scaffold)** 하고, 기본 구조를 **검증(verify)** 하며, 협업을 위한 GitHub 템플릿을 표준화하기 위한 목적의 모노 리포지토리입니다.

## Preset Matrix

| Preset | Template Path | 대상 | 핵심 특징 |
| --- | --- | --- | --- |
| `react` | `templates/react-assignment/` | React 과제 | 컴포넌트 기반 구조, React 친화 템플릿 |
| `vanilla` | `templates/vanilla-assignment/` | Vanilla JS 과제 | 번들러 의존 최소화, 순수 JS 기반 템플릿 |

## Scaffold 사용법

> pnpm 환경을 기준으로 합니다.

```bash
pnpm install
pnpm run scaffold
```

특정 preset만 실행하려면:

```bash
pnpm run scaffold:react
pnpm run scaffold:vanilla
```

## Verify 사용법

scaffold 결과와 필수 폴더/파일 구성을 점검하려면:

```bash
pnpm run verify:scaffold
```

## GitHub Template 사용법

- 이슈 템플릿: `.github/ISSUE_TEMPLATE/` 내 템플릿을 통해 버그/기능 요청 이슈를 생성합니다.
- PR 템플릿: `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md`를 기본 PR 본문으로 사용합니다.
- 워크플로우: `.github/workflows/ci.yml`에서 기본 CI 검증을 수행합니다.

## Contribution

기여 절차와 규칙은 아래 문서를 확인해 주세요.

- [CONTRIBUTING 가이드](docs/CONTRIBUTING.md)
