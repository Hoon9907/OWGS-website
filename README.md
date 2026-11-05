# OWGS 홈페이지 (리디자인)

별도 설치나 빌드 없이 사용하는 HTML 사이트입니다. `index.html`을 열거나, VS Code에서 **Open with Live Server**로 확인할 수 있습니다.

기존 대행사 버전의 `youth.html`, `campus.html`은 `index.html`로 합쳤습니다.

## 페이지 구성

| 페이지 | 내용 |
| --- | --- |
| `index.html` 대회 개요 | KV · 참가 신청 · 대회 일정 요약 · 대회 안내 · 상금 · 공식 중계 · 다른 페이지 바로가기, 오시는 길(팝업) |
| `schedule.html` 대진표·경기 일정 | YOUTH / CAMPUS 탭 → 대진표 이미지, 경기 스케줄 이미지 |
| `teams.html` 참가 팀 | YOUTH / CAMPUS 탭 → 참가 팀 이미지 |
| `events.html` 이벤트 | 이벤트 이미지 |

- 공통 헤더·푸터는 각 HTML에 직접 들어 있습니다. 메뉴를 바꾸면 HTML 4개에 동일하게 적용하세요.
- 탭은 주소로 바로 열 수 있습니다: `schedule.html?tournament=campus`, `teams.html?tournament=youth`

### 대진표·참가 팀·이벤트 이미지 넣기

지금은 'COMING SOON' 자리 표시만 있습니다. 각 HTML에 **이미지 넣는 방법** 주석과 복사해서 쓸 코드가 있습니다.

1. 이미지를 `assets/images/schedule/`, `teams/`, `events/` 폴더에 넣습니다. 권장 가로 1920px 이상.
2. 해당 탭의 `<div class="media-frame media-empty"> … </div>`를 주석의 코드로 바꿉니다.
3. `<img>`의 `width`, `height`에 실제 이미지 크기를, `alt`에 이미지 내용을 적습니다.

대진표는 `media-scroll`을 쓰면 모바일에서 글자가 너무 작아지지 않도록 좌우 스크롤로 보여 주고, '원본 크게 보기' 링크로 원본을 열 수 있습니다.

## 자주 수정하는 곳

| 수정할 내용 | 파일 |
| --- | --- |
| 신청·규정·중계 주소, 모집 기간 | `assets/js/tournament-config.js` |
| 개요 문구·일정·상금 | `index.html` |
| 대진표·참가 팀·이벤트 | `schedule.html`, `teams.html`, `events.html` |
| 색상·글꼴·간격 | `assets/css/styles.css` 맨 위 `:root` |

### 신청·규정·중계 링크

`assets/js/tournament-config.js`

- `tournaments.youth` / `tournaments.campus`
  - `applicationUrl`: 참가 신청 주소
  - `rulesUrl`: 규정집 주소
  - `registrationOpensAt` / `registrationClosesAt`: 모집 시작 / 마감 시각 (마감은 `2026-11-16T00:00:00+09:00` = 11월 15일까지)
  - `applicationPreviewEnabled`: `true`이면 모집 전에도 신청 페이지 확인 가능
- `channels.youtube`, `channels.chzzk`, `channels.soop`: 공식 중계 주소 (YOUTH·CAMPUS 공통 채널 하나)

주소가 비어 있으면 버튼은 '공개 예정' 또는 '준비 중'으로 표시됩니다.

### 일정 진행 표시

일정 카드는 한국 시간 기준으로 **종료 → 진행 중 → 다음 일정** 순서로 자동 강조됩니다. 날짜를 바꾸면 화면 문구와 함께 각 카드의 `data-stage-start`, `data-stage-end`(YYYY-MM-DD, 종료일 포함)도 수정하세요.

## 이미지

| 이미지 | 위치 | 출처 |
| --- | --- | --- |
| KV | `assets/images/kv/owgs-kv.webp`, `owgs-kv.png` | `OWGS_KV.psd` 합성 이미지 그대로 (수정 금지) |
| 대회 로고 | `assets/images/logo/*.svg` | BI 가이드 AI 파일 벡터 그대로 |
| 현장 지도 | `assets/images/venue-map.png` | 기존 사이트 |
| 치지직 / SOOP 로고 | `assets/images/channels/` | 기존 사이트 |

> KV 이미지 안의 로고는 PSD 원본 그대로라 흐릿한 비트맵입니다. 그래서 같은 위치·크기에 벡터 로고(`owgs-vertical.svg`)를 겹쳐 선명하게 보이게 했습니다(`.kv-logo`). 위치·크기 값은 PSD 로고 레이어에서 잰 값이므로 바꾸지 마세요.

### 파비콘 · 공유 미리보기 이미지

| 파일 | 용도 |
| --- | --- |
| `assets/images/favicon/favicon.svg`, `favicon-32.png` | 브라우저 탭 아이콘 (BI 가이드 심볼마크) |
| `assets/images/favicon/apple-touch-icon.png` | 아이폰 홈 화면 아이콘 (180×180) |
| `assets/images/og/owgs-og.jpg` | 카카오톡·SNS 링크 미리보기 (1200×630, KV 원본 + 좌우 검은 여백) |

**배포 후 꼭 할 일:** 각 HTML `<head>`의 `og:url`, `og:image`를 실제 도메인을 포함한 전체 주소로 바꾸세요. 상대 경로로는 카카오톡 등에서 이미지가 뜨지 않습니다. 바꾼 뒤 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시를 초기화하면 바로 반영됩니다.

### 대회 로고 (SVG, 어두운 배경용)

`OW_GrassRoots_BI_Guide_Outline.ai`의 다크 배경 시그니처(7·8페이지)에서 배경만 제외하고 그대로 추출했습니다. 브랜드 가이드의 금지 사항(각도·간격·비율·컬러 변형, 외곽선 사용)에 따라 로고 파일 자체는 수정하지 마세요.

| 파일 | 용도 |
| --- | --- |
| `assets/images/logo/owgs-horizontal.svg` | 메인 가로형 (헤더·푸터) |
| `assets/images/logo/owgs-vertical.svg` | 메인 세로형 |
| `assets/images/logo/owgs-youth-vertical.svg`, `owgs-campus-vertical.svg` | 리그 세로형 (참가 신청 카드) |

### 브랜드 컬러 (BI 가이드 Main Color)

| 구분 | 단색 | 그라데이션 |
| --- | --- | --- |
| 메인 | `#EF6414` | `#EFA020` → `#EF6414` |
| YOUTH | `#12E079` | `#12E079` → `#DCE53B` |
| CAMPUS | `#CE1BFF` | `#CE1BFF` → `#FF508A` |
| 공통 다크 | `#333E48` | |

## 글꼴

- 한글 본문: Pretendard (jsDelivr CDN)
- 숫자·영문 제목: Saira Condensed (Google Fonts)

BI 가이드의 전용 서체는 Industria Sans이지만 웹폰트 라이선스가 없어 비슷한 무료 서체로 대체했습니다. 웹폰트를 확보하면 `styles.css`의 `--font-display`만 바꾸면 됩니다.

배포 환경에서 외부 CDN을 쓸 수 없으면 글꼴 파일을 내려받아 `assets/fonts`에 두고 `index.html`의 글꼴 `<link>`를 바꾸세요.
