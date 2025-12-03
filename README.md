# 📍 PNU-WPlace (부산대 픽셀 지도 프로젝트)

부산대학교 캠퍼스를 **실제 지도 위에 10×10픽셀 그리드**로 나누고,  
학생들이 그 위에 **색을 칠하며 완성해 나가는 집단 캔버스 프로젝트**입니다.

WPlace처럼 복잡한 SNS 기능 없이,  

> **“지도 → 클릭 → 색칠 → 저장 → 다른 사람의 칸은 닉네임 표시”**  

이 단일 흐름을 최대로 아름답게 구현하는 것을 목표로 합니다.

---

## ✨ Features (현재 구현된 기능)

- ✔ **실제 부산대 지도(OpenStreetMap 기반)**
- ✔ **부산대 구역 내로 드래그/확대 범위 제한**
- ✔ **10px × 10px 격자(Leaflet world pixel 기반)**
- ✔ **셀 클릭 → 선택한 셀 강조 표시**
- ✔ **색 선택 UI & 색칠**
- ✔ **이미 칠해진 셀은 닉네임 팝업**
- ✔ **줌/드래그 시 픽셀이 지도를 따라 움직임**

현재 버전은 **프론트엔드 데모 단일 HTML로만 동작**하며,  
데이터는 **브라우저 메모리에 임시 저장**됩니다.

---

## 🚀 Upcoming (곧 구현 예정)

- 🔑 **로그인 / 회원가입**
- 🗄 **PostgreSQL 연동 (cells / users 테이블)**
- 🔄 **서버-클라이언트 간 셀 정보 fetch/POST**
- 🏷 **본인 셀 수정 권한**
- 🎨 **지도 테마 선택 (light/dark/minimal)**

---

## 📂 Project Structure

pnu-wplace/
├─ client/
│ ├─ public/
│ │ ├─ index.html # 데모가 바로 돌아가는 파일
│ │ └─ styles.css
│ └─ src/
│ ├─ main.js # 엔트리 포인트
│ ├─ map.js # 지도/셀 좌표 변환 로직
│ ├─ cells.js # 셀 상태 관리(메모리→DB로 대체 가능)
│ └─ ui/
│ ├─ colorPicker.js
│ └─ selection.js
│
├─ server/ # 백엔드 (추후 구현)
│ ├─ app.js
│ ├─ routes/
│ ├─ controllers/
│ ├─ models/
│ ├─ middleware/
│ └─ db/
│ ├─ pool.js
│ └─ migrations/
│ ├─ 001_init.sql # users, cells 테이블 생성
│ └─ 002_seed.sql
│
├─ README.md
├─ package.json
└─ .env.example




## 🔧 기술 스택

- **Leaflet.js** – 지도 및 좌표 변환
- **OpenStreetMap / Carto Light Tile** – 기본 지도 타일
- **Vanilla JS + ES Module** – 간단하고 가벼운 구조
- **PostgreSQL (추가 예정)** – 셀 저장
- **Node.js + Express (추가 예정)** – API 서버
- **JWT (추가 예정)** – 인증/로그인

---

## 🎯 설계 철학

- 지도 위에 픽셀을 그리는 것 자체가 컨텐츠다.  
- 기능을 최소화하면서도 직관성과 감성을 최대화할 것.  
- 추후 학우들이 확장하기 쉬운 구조.  
- 후배 개발자도 이해 가능한 분리된 모듈 구조.  

---

## ✨ Screenshot (추가 예정)

- 지도 + 10px 그리드 칠해진 모습  
- 선택된 셀 강조 UI  
- 색 선택 화면  

---

## 🤝 Contributing

PR, Issue 모두 환영합니다.

---

## 📄 License

MIT License.

---

## 📬 Contact

 
400poi@pusan.ac.kr
