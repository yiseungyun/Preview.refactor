# ✨ Preview

> 기존에 팀 프로젝트로 진행했던 Preview 서비스를 개인적으로 리팩토링한 레포지토리입니다. <br/>
> 리팩토링 작업물 정리는 README 아래 정리해두었습니다. 

<img width="100%" src="https://github.com/user-attachments/assets/4894268d-c31d-44d6-9e6c-9c37b86a4a99" />

<br/>

<div align="center">면접 연습을 하고 싶은데.. 🧐</div>
<div align="center">다른 사람과 함께 할 수 없을까? 👥</div>

<h3 align="center">✨ Preview에서 면접 연습 시작하자! ✨</h3>

<br/>

## 📣 핵심 기능

> WebRTC 기반으로 화상회의 기능을 구현해서 면접 스터디를 할 수 있습니다. 1~5명까지 스터디룸에 입장할 수 있게 설정하였고, 인원 수에 맞춰 Mesh 방식을 택해 클라이언트 간 p2p 통신을 할 수 있게 구현했습니다.

### 스터디룸 생성 

![세션_생성](https://github.com/user-attachments/assets/28cc675a-c052-4f9f-bcf6-22898381b933)

- 만들어둔 질문지/저장된 질문지 선택
- 스터디룸 이름 설정 및 인원 수 선택
- 스터디룸의 공개/비공개 여부 선택
- 세션을 생성하게 되면 자신의 비디오와 닉네임을 설정하고 입장

### 화상회의

https://github.com/user-attachments/assets/cd7965c1-3f89-4345-b882-43309c767546

- 1~5명까지 정해진 인원 수에 따라 화상회의
- 비디오/오디오 제어 가능
- 말하는 사람에게 테두리 효과
- 리액션 기능

### 면접 스터디

https://github.com/user-attachments/assets/4b10f315-7d5a-43b1-9467-9907d46a33ab


- 선택한 질문지를 통해 면접 스터디
- 질문을 하나씩 넘겨가며 돌아가며 답변할 수 있는 환경 제공
- 방장이 질문을 넘기고 이전 질문으로도 돌아갈 수 있게 설정

### 스터디 채널

https://github.com/user-attachments/assets/97b7f9fe-2886-477a-aeb0-fc5429675c74

- 스터디 채널 페이지에서 다른 사람이 만들어둔 스터디룸에 입장
- 입장 전 카메라 미리보기와 닉네임 설정을 통해 원하는대로 설정 후 입장

### 면접 질문지 생성 및 공유

- 원하는 카테고리에 따라 면접 질문지 생성 가능
- 면접 질문지 공유와 스크랩을 통해 다른 사람도 이용가능하게 설정
- 사용량에 따라 인기 질문지 확인 가능

<br/>

## 🧩 설계

<img width="100%" alt="시스템_아키텍처" src="https://github.com/user-attachments/assets/fcf80234-c3fe-4bdd-ae09-9c2214a5bfa6" />

<br/>

## 🛠 기술 스택

| Category | Stack                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Frontend | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Backend  | ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![TypeORM](https://img.shields.io/badge/TypeORM-E83524?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yNDEuMzUyIDI1LjcyN2wtNTQuOTQtMTkuMjhBMjcuNTE3IDI3LjUxNyAwIDAgMCAxNjcuMjE1IDRIMTA3LjE4YTI3LjQ4NCAyNy40ODQgMCAwIDAtMTkuMTk3IDIuNDQ3TDMzLjAzOCAyNS43MjdDMTguNDc3IDMyLjQxMyAxMCA0Ny40NTEgMTAgNjMuOTc3djkzLjU1NmMwIDIzLjcxIDEzLjA3IDQ1LjUyNiAzNC4wMjMgNTYuNTU3bDYzLjE5NyAzMy4xOTVjMTEuOTUgNi4yNzcgMjYuMDM3IDcuOTc0IDM5LjE1OCA0Ljc4NGw3Ni4wMTEtMTguNTRDMjQxLjg2NSAyMjYuOTc4IDI1NSAyMDguOTg4IDI1NSAxODguNDcyVjYzLjk3N2MwLTE2LjUyNi04LjQ3OC0zMS41NjQtMjMuMDM4LTM4LjI1Wm0tMjkuMDYgNjkuNzk2YTguMDY3IDguMDY3IDAgMCAxLTguNDc3IDEzLjY2OGwtOC40NzctNS4yNjJ2NjIuNTgzYTguMDY0IDguMDY0IDAgMCAxLTQuMDkyIDcuMDA4bC00OS45NjcgMjkuODk4Yy0yLjUwMyAxLjQ5Ny01LjU4NSAxLjUzMS04LjEyMS4wODlMODQuMTkgMTc0LjA1OGE4LjA2NSA4LjA2NSAwIDAgMS00LjA5NC03LjAwOFY5OC43MDhhOC4wNjQgOC4wNjQgMCAwIDEgMy45NDktNi45MjlsNDAuMzU1LTI1LjE1N2E4LjA2NCA4LjA2NCAwIDAgMSA4LjQzMS0uMDM0bDQwLjA5NSAyNC40ODRhOC4wNjQgOC4wNjQgMCAwIDEgNC4wOTMgNi45OTd2OS40NzJsOC40NzctNS4wOGE4LjA2NCA4LjA2NCAwIDAgMSA4LjQ3Ny0uMTI3bDE4LjMxNSAxMS4xODlaIi8+PC9zdmc+&logoColor=white) |
| Common   | ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Husky](https://img.shields.io/badge/Husky-000000?style=for-the-badge&logo=husky&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| DevOps   | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![NCP](https://img.shields.io/badge/Naver_Cloud-03C75A?style=for-the-badge&logo=naver&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| CI/CD    | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Etc      | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

<br/>   

## 리팩토링

### 전역 상태 도입과 커스텀 훅 개선
[블로그 글 보러가기](https://velog.io/@yiseungyun/%EC%A0%84%EC%97%AD-%EC%83%81%ED%83%9C-%EB%8F%84%EC%9E%85%EA%B3%BC-%EC%BB%A4%EC%8A%A4%ED%85%80-%ED%9B%85-%EA%B0%9C%EC%84%A0%ED%95%98%EA%B8%B0)

- 기존 화상회의 페이지에서 관리하는 상태를 props로 전달하다보니 각 컴포넌트는 수십개의 props를 전달받았고 이로 인해 컴포넌트 분리가 쉽지 않고 구조 파악도 어려웠다. 
- 전역 상태를 도입해 각 컴포넌트가 사용하는 상태만 구독하는 형식으로 변경하고 selector로 구독하게 하여 전체 상태를 구독하지 않게 했다. 
- WebRTC 연결 로직과 같은 복잡한 로직의 흐름 이해가 어려워 서비스 계층을 도입해 복잡한 로직을 해당 계층에서 처리하고 useRef로 관리되는 변수도 서비스 계층에서 관리하도록 수정했다. 여러 컴포넌트에서 필요한 상태라 싱글톤으로 구현해 WebRTC 매니저 인스턴스를 여러 곳에도 참조해도 같은 상태를 참조할 수 있게 했다. 

### Tab 컴포넌트를 재사용 가능한 컴포넌트로 만들기
[블로그 글 보러가기](https://velog.io/@yiseungyun/%EC%9E%AC%EC%82%AC%EC%9A%A9%ED%95%A0-%EC%88%98-%EC%9E%88%EA%B3%A0-%ED%8E%B8%EB%A6%AC%ED%95%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EC%9E%90)

- 기존 탭 컴포넌트가 사용되는 곳은 4군데였고, 하드 코딩으로 만들어졌었다. 그리고 탭 상태를 boolean으로 관리해서 탭 아이템이 2개로 제한되었다. 
- 4군데에서 재사용할 수 있고 가독성이 좋으면서 탭 상태 관리를 사용자는 알 필요 없이 간단하게 관리할 방법으로 합성 컴포넌트 개념과 Context API를 도입했다. 

### 로딩 화면에 대한 고민 (스켈레톤 UI)
[블로그 글 보러가기](https://velog.io/@yiseungyun/%EB%A1%9C%EB%94%A9-%ED%99%94%EB%A9%B4%EC%9D%84-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%B3%B4%EC%97%AC%EC%A4%84%EA%B9%8C)

- 일관된 로딩 처리가 되지 않아 컴포넌트에서 if (loading)으로 처리하거나 혹은 UI 코드 안에서 로딩 변수를 넣어서 관리했다. 일관되게 처리하고 컴포넌트 내부에서 로딩을 조건문으로 관리하지 않기 위해 Suspense로 처리하도록 했다.
- 로딩 UI는 로딩 스피너가 아닌 스켈레톤을 도입해서 사용자가 지연을 덜 느낄 수 있도록 했다. 이 과정에서 너무 빠르게 데이터가 로드될 때 스켈레톤 UI가 오히려 깜빡거려 사용자 경험이 좋지 않다는 것을 알게되어 지연 시간을 두고, 사용자의 네트워크 상황에 따라 유연하게 도입할 수 있는 네트워크 감지 훅을 추가했다.
- 스켈레톤 UI는 기존 컴포넌트 뼈대로 만드는 것이라 기존 컴포넌트가 변경되면 다시 변경해줘야하는 불편함과 만들 때마다 복붙하는 것이 번거로울거 같아 디자인 변경에도 좀 더 빠르게 개발할 수 있도록, 스켈레톤 UI 제너레이터 코드를 작성했다. 기존 컴포넌트에서 UI 코드를 가져와 데이터 부분을 비워주고 해당 부분을 회색으로 처리하게 했다. 

### react-icons을 제거하기
[블로그 글 보러가기](https://velog.io/@yiseungyun/%ED%8E%B8%ED%95%98%EB%8B%A4%EA%B3%A0-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EC%93%B0%EB%A9%B4-%EC%A0%80%EC%B2%98%EB%9F%BC-%EC%82%BD%EC%A7%88%ED%95%B4%EC%9A%94-feat.-react-icons)

- 아이콘을 편리하게 쓰기 위해 팀원과 채택한 라이브러리였는데 성능을 측정하니 해당 라이브러리가 차지하는 번들 사이즈가 매우 컸다. 아이콘 그룹별로 사용해서 더 컸고 제거하려고하니 아이콘을 사용하는 곳도 많고 비슷한 아이콘을 찾는 비용도 생각해야했다.
- 기존 아이콘 디자인을 유지하면서도 번들 사이즈를 줄이려 다른 방법도 생각해보고 all-files도 도입했지만 불편한 점이 많아 기존 쓰던 아이콘 리스트로 기존 아이콘만 컴포넌트로 새로 만들고 라이브러리를 제거했다.
- 라이브러리 제거 후 11점의 성능 점수가 향상되었고 기존 디자인을 유지하며 아이콘을 사용할 수 있었다. 이후 성능 점수가 낮아서 이를 해결하고자 폰트 preconnect, lodash 라이브러리 import 방식 변경 등을 통해 성능 점수를 처음 55점에서 91점으로 향상시킬 수 있었다.