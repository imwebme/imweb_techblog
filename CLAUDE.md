# 아임웹 테크: 작업 규칙

Notion 기반 정적 블로그 (Next.js 14 정적 export → GitHub Pages).
프로젝트 개요·구조·운영은 [README.md](./README.md) · [STRUCTURE.md](./STRUCTURE.md) · [DEPLOY.md](./DEPLOY.md) · [REQUIREMENTS.md](./REQUIREMENTS.md) 참고.

## 문서화 규칙 (필수)

**모든 코드/기능 변경은 반드시 관련 문서에 반영한다.**

- 기능·동작·구조가 바뀌면 그 변경을 담은 커밋에 **README.md 와 STRUCTURE.md 갱신을 포함**한다.
  - README: 핵심 특징 / 사용법 / 디자인 커스터마이징 등 사용자 관점 변화
  - STRUCTURE: 기술 스택 / 디렉터리 구조 / 컴포넌트 / 디자인 시스템 / 알려진 한계 등 구조 관점 변화
- 새 파일·컴포넌트·라이브러리 추가, 디렉터리 구조 변경 → STRUCTURE 의 디렉터리 트리 갱신.
- 더 이상 사실이 아닌 내용(해결된 한계, 바뀐 동작)은 **stale 표현을 정정**한다.
- 문서가 코드와 항상 일치하도록 유지한다.
