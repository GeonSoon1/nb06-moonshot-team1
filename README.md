# 프로젝트 Moonshot
[팀 협업 문서 링크 (예: Notion)](https://notion.so/moonshot-team-collaboration)

## 팀원 구성 및 업무 분담
* **박건순** ([Github](https://github.com/)) - **태스크 및 파일 시스템**: 고성능 태스크 엔진, Multer 기반 비동기 파일 업로드, 필터링 검색
* **최민수** ([Github](https://github.com/)) - **인증 및 유저 도메인**: JWT 보안 인증, 구글 OAuth, 유저 프로필 관리
* **이지민** ([Github](https://github.com/)) - **프로젝트 및 하위 할 일**: 프로젝트 CRUD 엔진, 5개 생성 제한 로직, 하위 할 일 체크리스트
* **이현우** ([Github](https://github.com/)) - **댓글 및 태그 시스템**: 할 일 기반 실시간 소통 API, N:M 관계 태그 로직 구현
* **정수영** ([Github](https://github.com/)) - **멤버십 및 권한 제어**: 초대 워크플로우 설계, 역할 기반 권한(RBAC) 미들웨어 구축

## 프로젝트 소개
* **프로젝트 일정 관리 서비스**
* **프로젝트 기간**: 2025.12.19 ~ 2026.01.14

## 기술 스택
* **Backend**: Node.js (Express v5), **TypeScript**
* **Database**: **PostgreSQL**
* **ORM**: **Prisma ORM**
* **Validation**: **Superstruct**
* **Authentication**: **JWT (Access/Refresh Token Rotation)**, **Google OAuth 2.0**
* **File Processing**: **Multer**

---

## 팀원별 구현 기능 상세
### **박건순 (태스크 엔진 및 파일 시스템)**
* **고성능 할 일(Task) 관리**
  - 할 일 생성 시 생성자 자동 담당자 지정 및 복합 외래키 참조 설계
  - 이름순, 생성순, 기한임박순 정렬 및 담당자/상태별 다중 필터링 구현
  - 페이지네이션 및 키워드 검색 기능을 포함한 목록 조회 최적화
* **비동기 파일 업로드 시스템**
  - **Multer** 기반의 2단계 업로드(Two-step Upload) 방식을 통한 서버 부하 분산
  - 이미지 및 문서 파일 등 리소스 성격에 따른 MIME 타입 필터링 적용

### **최민수 (인증 및 유저 관리)**
* **보안 인증 및 세션 시스템**
  - JWT 기반 **Token 기반 인증** 및 Access/Refresh Token Rotation 도입
  - 일반 이메일 및 **구글 소셜 로그인**을 통한 회원가입/로그인 통합 구현
  - 비밀번호 저장 시 `bcryptjs` 단방향 해싱을 통한 보안 강화
* **유저 정보 관리**
  - 비밀번호 인증 기반 개인정보(닉네임, 프로필 이미지 등) 수정 API
  - 참여 중인 모든 프로젝트 및 할 일 목록 통합 대시보드 API

### **이지민 (프로젝트 및 하위 할 일)**
* **프로젝트 관리 엔진**
  - 프로젝트별 멤버 수 및 상태별 할 일 개수 실시간 집계 조회
  - 유저당 **최대 5개 프로젝트 생성 제한** 비즈니스 로직 구현
  - 소유자 권한 기반 프로젝트 수정/삭제 및 멤버 대상 이메일 알림 연동 준비
* **세분화된 작업 관리 (SubTask)**
  - 메인 할 일 내 하위 체크리스트 생성 및 삭제

### **이현우 (댓글 및 태그 시스템)**
* **할 일 기반 커뮤니케이션**
  - 프로젝트 참여 멤버 전용 댓글 등록 및 수정/삭제 권한 검증
  - 작성자 정보(이름, 프로필 이미지)를 포함한 평탄화된 데이터 응답
* **유연한 태그 시스템**
  - **TaskTag** 중간 테이블을 통한 N:M 다대다 관계 모델링
  - 기존 태그 재사용 및 신규 생성을 위한 **connectOrCreate** 최적화 쿼리 적용

### **정수영 (멤버십 및 권한 제어)**
* **정교한 멤버 초대 워크플로우**
  - UUID 기반 고유 초대 링크 발급 및 수락/거절 상태 관리(Pending/Accepted/Rejected)
  - 멤버 목록 내 초대 대기 상태 실시간 확인 및 소유자 권한의 초대 취소/멤버 제외
* **역할 기반 접근 제어(RBAC)**
  - 리소스 계층(SubTask -> Task -> Project)을 역추적하는 **resolveProjectId** 로직 개발
  - `projectOwner`, `projectMember` 등 도메인별 전용 인가 미들웨어 구축

---

## 심화 설계 및 최적화 요소

### **1. 데이터베이스 최적화 및 무결성 확보**
* **Cascading Delete**: 유저 탈퇴나 프로젝트 삭제 시, 연관된 모든 태스크, 댓글, 멤버십 정보가 원자적으로 삭제되도록 설계하여 고아 데이터 발생 방지.
* **Transaction Management**: 
  - 프로젝트 생성 시 소유자의 멤버 자동 등록 과정을 단일 트랜잭션으로 처리.
  - 초대 수락 시 상태 변경과 멤버십 생성을 원자적으로 처리하여 데이터 불일치 차단.
* **복합키 설계**: `ProjectMember`(`projectId`, `memberId`) 및 `TaskTag`에 복합 기본키를 적용하여 물리적 중복 데이터 유입 방지.

### **2. 코드 구조 및 예외 처리 개선**
* **Layered Architecture**: Router - Controller - Service - Repository의 4계층 분리를 통해 유지보수성과 테스트 용이성 극대화.
* **Custom Error System**: `BaseError`를 상속받은 `NotFoundError`, `ForbiddenError` 등을 구현하여 HTTP 상태 코드와 에러 메시지를 규격화.
* **Global Error Handling**: Express 5의 비동기 에러 자동 전파 기능을 활용, `globalErrorHandler`에서 모든 예외를 중앙 집중식으로 처리.

---

## 파일 구조
```text
src
 ┣ controllers   # HTTP 요청 해석 및 DTO 매핑
 ┣ services      # 핵심 비즈니스 로직 및 트랜잭션 관리
 ┣ repositories  # DB 추상화 (Prisma Query 전담)
 ┣ routers       # URL 매핑 및 미들웨어 체이닝
 ┣ middlewares   # 인증(Auth), 권한(RBAC), 전역 에러 핸들러
 ┣ structs       # 데이터 유효성 검증 설계도 (Superstruct)
 ┣ types         # TypeScript 인터페이스 및 전역 타입
 ┣ lib           # 공통 라이브러리 및 유틸리티
 ┗ app.ts        # 서버 설정 및 미들웨어 파이프라인

## API 명세서
[SwaggerUI]

## 프로젝트 회고록 
[발표자료]
