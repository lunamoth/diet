# 💪 다이어트 챌린지 (Diet Challenge)

![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-Active-success)

**다이어트 챌린지**는 서버 없이 브라우저에서 동작하는 **데이터 기반 체중 관리 웹 애플리케이션**입니다.
단순한 체중 기록을 넘어, 다양한 차트와 통계 분석, 게이미피케이션(뱃지) 요소를 통해 사용자의 지속적인 동기 부여를 돕습니다.

모든 데이터는 브라우저의 **Local Storage**에 저장되므로 별도의 회원가입이 필요 없이 안전하게 사용할 수 있습니다.

## ✨ 주요 기능

### 1. 📊 강력한 데이터 시각화 (Chart.js 기반)
다양한 차트를 통해 체중 변화 추이를 다각도로 분석합니다.
- **메인 차트**: 체중 변화, BMI 구간(배경색), 7일 이동평균선(추세), 볼린저 밴드, 목표 체중선 표시.
- **고스트 러너 (Ghost Runner)**: 지난달의 기록과 이번 달의 기록을 겹쳐서 비교.
- **신호등 게이지**: 현재 BMI와 체지방률을 직관적인 게이지 형태로 표시.
- **고급 차트**: MACD 추세 지표, 캔들스틱(주간 변동), 히스토그램, 산점도(Scatter), 폭포수 차트(Waterfall), 레이더 차트(요일별 패턴) 등.
- **히트맵 (Heatmap)**: GitHub 잔디 심기 스타일의 연간 감량 강도 시각화.

### 2. 🧠 스마트 분석 및 인사이트
단순 기록을 넘어 데이터를 분석하여 조언을 제공합니다.
- **예상 완료일 예측**: 현재 감량 속도를 기반으로 목표 달성 시기(빠름/느림/평균) 예측.
- **TDEE 역산**: 기록된 체중 변화를 토대로 실제 대사량(TDEE) 추정.
- **정체기 탐지**: 정체기 여부를 판단하고 돌파를 위한 팁 제공.
- **요요 위험도 경고**: 급격한 감량이나 변동성을 분석하여 요요 위험 경고.
- **다이어트 성향 분석**: MBTI 스타일의 다이어트 성향 분석 (예: 롤러코스터형, 꾸준한 거북이형).

### 3. 🏆 동기 부여 시스템 (게이미피케이션)
- **업적 & 뱃지**: 특정 조건 달성 시 뱃지 획득 (예: '홀리데이 서바이버', '작심삼일 탈출', '주말의 지배자' 등 40여 종).
- **마일스톤**: 10kg 단위 앞자리 변경 시 기록 및 소요 시간 계산.
- **스프린트 랭킹**: 단기간 가장 많이 감량한 구간 Top 5 분석.

### 4. 🛠️ 사용자 편의 기능
- **다크 모드**: 눈이 편안한 다크 모드 지원 (테마 전환).
- **데이터 관리**: 
  - JSON 형식의 전체 데이터 백업 및 복원.
  - CSV 내보내기.
  - **WeightDrop** 앱(iOS) CSV 데이터 가져오기 지원.
- **인라인 수정**: 기록 목록에서 바로 체중 및 체지방 수정 가능.
- **반응형 디자인**: 모바일 및 데스크탑 환경 최적화.

## 🚀 시작하기 (설치 및 실행)

이 프로젝트는 별도의 백엔드 서버나 빌드 과정이 필요 없는 **정적 웹 사이트**입니다.

### 방법 1. 로컬 실행
1. 이 저장소를 클론(Clone)하거나 ZIP으로 다운로드합니다.
   ```bash
   git clone https://github.com/your-username/diet-challenge.git
   ```
2. 폴더 내의 `index.html` 파일을 더블 클릭하여 웹 브라우저(Chrome, Edge, Safari 등)에서 엽니다.

### 방법 2. GitHub Pages 배포
이 저장소를 포크(Fork)한 후 GitHub Pages 기능을 활성화하면 즉시 웹에서 사용할 수 있습니다.

## 💻 기술 스택

- **Core**: HTML5, CSS3 (CSS Variables), Vanilla JavaScript (ES6+)
- **Libraries**:
  - [Chart.js](https://www.chartjs.org/) (데이터 시각화)
  - [date-fns](https://date-fns.org/) (날짜 처리)
  - [chartjs-adapter-date-fns](https://github.com/chartjs/chartjs-adapter-date-fns) (Chart.js 날짜 어댑터)
- **Data Storage**: Browser LocalStorage

## 📂 프로젝트 구조

```
diet-challenge/
├── index.html          # UI 구조 및 레이아웃 (HTML + CSS)
├── diet_challenge.js   # 핵심 로직, 차트 렌더링, 데이터 처리 (JS)
└── README.md           # 프로젝트 설명서
```

## ⚙️ 설정 및 커스터마이징

`diet_challenge.js` 파일 상단의 `CONFIG` 객체를 수정하여 기준값을 변경할 수 있습니다.

```javascript
const CONFIG = {
    // 비만도 기준 설정 (대한비만학회 2020 기준)
    BMI: { 
        UNDER: 18.5, 
        NORMAL_END: 23, 
        PRE_OBESE_END: 25, 
        OBESE_1_END: 30, 
        OBESE_2_END: 35 
    },
    // 차트 색상 테마
    COLORS: { ... }
    // ...
};
```

## ⚠️ 데이터 프라이버시 및 주의사항

- **로컬 저장소 사용**: 모든 데이터는 사용자의 브라우저 내부에만 저장됩니다. 서버로 전송되지 않습니다.
- **데이터 유실 주의**: 브라우저 캐시 삭제, 시크릿 모드 사용 시 데이터가 사라질 수 있습니다. **설정 패널의 'JSON 백업' 기능을 주기적으로 이용해주세요.**
- **의학적 면책 조항**: 본 서비스에서 제공하는 지표와 예측은 통계적 추정치이며 전문적인 의학적 진단을 대체할 수 없습니다.

## 🤝 기여하기 (Contributing)

버그 제보, 기능 제안은 언제나 환영합니다!

## 📝 라이선스

이 프로젝트는 [MIT License](LICENSE)에 따라 배포됩니다. 자유롭게 수정하고 배포하실 수 있습니다.

---
Created with ❤️ for healthy life.
