# Sangheon.log

AI와 음성 기술에 관한 개인 학습 기록입니다.

- 사이트: <https://qwer55252.github.io/tech-blog/>
- 프레임워크: Astro
- 배포: GitHub Pages + GitHub Actions
- 콘텐츠: Markdown / MDX

## 새 글 작성

`src/content/blog/_draft-template.md`를 복사해 새 Markdown 파일을 만듭니다.

```yaml
---
title: '글 제목'
description: '글에 대한 한 문장 설명'
pubDate: '2026-09-03'
tags: ['Speech', 'Learning']
series: '시리즈 이름' # 선택
draft: true
---
```

작성 중에는 `draft: true`, 공개할 때는 `draft: false`로 변경합니다.

## 로컬 실행

Node.js 22.12 이상이 필요합니다.

```bash
npm install
npm run dev
```

GitHub Pages 경로와 동일하게 로컬에서도 다음 주소로 확인합니다.

<http://localhost:4321/tech-blog/>

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 사이트를 자동으로 빌드하여 GitHub Pages에 배포합니다.
