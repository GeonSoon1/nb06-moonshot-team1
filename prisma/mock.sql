INSERT INTO "User" (email, name, "passwordHashed", "createdAt", "updatedAt")
VALUES
  ('user1@test.com', 'user1', '$2b$10$0eu.QBUY5ZCQGWX.oO8MAeks0MHBSXer9J94NcZUSa2o7hl60qFjy', now(), now()),
  ('user2@test.com', 'user2', '$2b$10$bUslXtF2adOHqVQQBiQi2.pBhNLX2Nmdzoy7L9aTeu8SnAqC.tKyq', now(), now()),
  ('user3@test.com', 'user3', '$2b$10$wrrtxSZIe/jVDV.dfovZHuXhb.VLsCJp73WH9N7bNm0NlExISM/oK', now(), now()),
  ('user4@test.com', 'user4', '$2b$10$BEPbUEt0iyggByK2rlGDbumECBnNsUa3/kPGh0K/8BLk7PDaq3.Le', now(), now()),
  ('user5@test.com', 'user5', '$2b$10$PtRyuogMz.c57PFws5vBfOLWPgR.S.evR3EeLchS6Bdv/psoSNmLO', now(), now()),
  ('user6@test.com', 'user6', '$2b$10$jSm5kuKo9QA.jqnKCI.guup49xDx6gj9gRSj9T.Vw91NCwA8CNxZO', now(), now()),
  ('user7@test.com', 'user7', '$2b$10$i/zy07XVMaISTdavrOTekOOuzVVRpyhbo2hwZqAQ1Sxncgcb49qQ.', now(), now()),
  ('user8@test.com', 'user8', '$2b$10$KhuEOtTmZVgo6xbI0qPLL.UO/dIzzJ7T6pA/HuWbUmfy35e44ed3W', now(), now()),
  ('user9@test.com', 'user9', '$2b$10$f0oBVLIPPAA1zHhyvsha3eP91iDtetCguX2MlEtwluPF4knJAl5Qm', now(), now());

INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
VALUES
  ('사워도우빵 만들기', '천연효모로 건강한 빵 같이 만들어요', 1, now(), now()),
  ('근육질몸 만들기', '매일 30분 투자하여 6개월 내 근육질 되기', 2, now(), now()),
  ('집수리 하기', '외관은 오래되었어도 내부는 새집처럼!', 3, now(), now()),
  ('Javascript 완전정복', '자바스크립트 사용법과 적용 마스터하기 ', 4, now(), now()),
  ('프리즈마 완전정복', '같이 열심히 하면 됩니다', 4, now(), now());


INSERT INTO "Invitation" ("id", "status", "projectId", "inviteeUserId", "createdAt", "respondedAt")
VALUES
('19710cff-de59-4d33-9a82-eef8b3b8cf37', 'ACCEPTED', 4, 7, '2026-01-12 09:35:53.935', '2026-01-12 09:36:13.467'),
('25680523-d79d-4a6e-a31f-b7543e870000', 'ACCEPTED', 4, 1, '2026-01-12 09:36:28.861', '2026-01-12 09:36:39.732'),
('d9cf30bb-e769-4964-b294-57f1e3f99827', 'PENDING', 4, 8, '2026-01-12 09:36:51.359', null),
('44667ff2-0d2e-4157-b807-ac2852d3a46c', 'REJECTED', 4, 3, '2026-01-12 09:37:00.553', '2026-01-12 09:37:47.427');

INSERT INTO "ProjectMember" ("projectId", "memberId", "invitationId", role, "createdAt", "updatedAt")
VALUES
  (1, 1, null, 'OWNER', now(), now()),
  (2, 2, null, 'OWNER', now(), now()),
  (3, 3, null, 'OWNER', now(), now()), 
  (4, 4, null, 'OWNER', now(), now()),
  (5, 4, null, 'OWNER', now(), now()),
  (4, 7, '19710cff-de59-4d33-9a82-eef8b3b8cf37', 'MEMBER', '2026-01-12 09:36:13.468', '2026-01-12 09:36:13.468'),
  (4, 1, '25680523-d79d-4a6e-a31f-b7543e870000', 'MEMBER', '2026-01-12 09:36:39.732', '2026-01-12 09:36:39.732');


INSERT INTO "Task" ("title", description, "status", "startDate", "endDate", "projectId", "taskCreatorId", "assigneeProjectMemberId", "createdAt", "updatedAt")
VALUES
('천연효모 기르기', '식물을 키우듯 정성스럽게 키운 천연효모가 좋은 빵을 만들어요', 'IN_PROGRESS', '2026-01-01', '2026-01-31', 1, 1, 1, now(), now()),
('깜빠뉴 굽기', '사워도우로 만드는 대표적인 하드 빵', 'IN_PROGRESS', '2026-01-15', '2026-02-28', 1, 1, 1, now(), now()),
('걷기 생활화', '승강기 대신 계단 오르기, 수킬로 단거리는 교통수단 자제하기 등', 'IN_PROGRESS', '2025-12-25', '2026-06-30', 2, 2, 2, now(), now()),
('벽지 바르기', '반려동물이 찢거나 세월의 때가 묻은 벽지 쉽게 교체할 수 있어요', 'IN_PROGRESS', '2026-01-01', '2026-02-28', 3, 3, 3, now(), now()),
('바케트 굽기', '사워도우로 만드는 대표적인 하드 빵 두번쨰 도전!', 'TODO', '2026-03-01', '2026-03-31', 1, 1, 1, now(), now()),
('에어로빅 운동하기', '일주일에 2-3회 20분 이상 에어로빅 운동 추가합시다', 'TODO', '2026-01-15', '2026-06-30', 2, 2, 2, now(), now()),
('근력 운동 하기', '일주일에 2-3회 30분 이상 근력 운동 추가합시다', 'TODO', '2026-02-15', '2026-06-30', 2, 2, 2, now(), now()),
('매일 운동하기', '걷기, 에어로빅 운동, 근력 운동 중 한가지는 매일 1회 꼭 하기', 'TODO', '2026-03-15', '2026-06-30', 2, 2, 2, now(), now()),
('데이터 타입', 'JS의 대표적인 데이터 타입에 대하여 공부해요', 'DONE', '2026-01-01', '2026-01-05', 4, 4, 4, now(), now()),
('원시 타입', 'number, string, boolean, null, undefined', 'DONE', '2026-01-02', '2026-01-10', 4, 4, 4, now(), now()),
('참조 타입', 'object, array, function', 'DONE', '2026-01-02', '2026-01-15', 4, 4, 4, now(), now()),
('타입 변환', '암시적, 명시적 타입 변환', 'DONE', '2026-01-02', '2026-01-20', 4, 4, 4, now(), now()),
('연산자', '산술, 비교, 논리 연산자', 'DONE', '2026-01-03', '2026-01-25', 4, 4, 4, now(), now()),
('조건문', 'if, else, switch', 'DONE', '2026-01-04', '2026-01-30', 4, 4, 4, now(), now()),
('반복문 기초', 'for, while, do-while', 'DONE', '2026-01-04', '2026-02-04', 4, 4, 4, now(), now()),
('반복문 심화', 'break, continue, 중첩 반복문', 'DONE', '2026-01-05', '2026-02-09', 4, 4, 4, now(), now()),
('함수 선언', '함수 선언식과 표현식', 'DONE', '2026-01-06', '2026-02-14', 4, 4, 4, now(), now()),
('함수 인자', '매개변수, 기본값, rest', 'DONE', '2026-01-06', '2026-02-19', 4, 4, 4, now(), now()),
('화살표 함수', 'arrow function 문법과 this', 'DONE', '2026-01-07', '2026-02-24', 4, 4, 4, now(), now()),
('배열 기초', '배열 생성과 접근', 'DONE', '2026-02-25','2026-01-08', 4, 4, 4, now(), now()),
('배열 메서드', 'map, filter, reduce', 'DONE', '2026-01-08', '2026-03-06', 4, 4, 4, now(), now()),
('객체 기초', '객체 리터럴과 속성 접근', 'DONE', '2026-01-09', '2026-03-11', 4, 4, 4, now(), now()),
('객체 메서드', 'this와 메서드 호출', 'IN_PROGRESS', '2026-01-10', '2026-03-16', 4, 4, 4, now(), now()),
('스코프', '전역, 함수, 블록 스코프', 'IN_PROGRESS', '2026-01-11', '2026-03-21', 4, 4, 4, now(), now()),
('클로저', '클로저 동작 원리', 'IN_PROGRESS', '2026-01-12', '2026-03-26', 4, 4, 4, now(), now()),
('비동기 기초', '콜백과 이벤트 루프', 'IN_PROGRESS', '2026-01-13', '2026-03-31', 4, 4, 4, now(), now()),
('Promise', 'then, catch, finally', 'IN_PROGRESS', '2026-01-13', '2026-04-05', 4, 4, 4, now(), now()),
('async/await', '비동기 흐름 제어', 'IN_PROGRESS', '2026-01-13', '2026-04-10', 4, 4, 4, now(), now()),
('에러 처리', 'try/catch, throw', 'IN_PROGRESS', '2026-01-14', '2026-04-15', 4, 4, 4, now(), now()),
('모듈 시스템', 'import/export', 'IN_PROGRESS', '2026-01-15', '2026-04-20', 4, 4, 4, now(), now()),
('클래스', 'class와 constructor', 'IN_PROGRESS', '2026-01-16', '2026-04-25', 4, 4, 4, now(), now()),
('상속과 프로토타입', 'extends, prototype 체인', 'IN_PROGRESS', '2026-01-17', '2026-04-30', 4, 4, 4, now(), now()),
('DOM 기초', 'document, querySelector', 'TODO', '2026-01-18', '2026-05-05', 4, 4, 4, now(), now()),
('DOM 이벤트', 'addEventListener와 이벤트 객체 이해', 'TODO', '2026-01-20', '2026-05-10', 4, 4, 4, now(), now()),
('폼 처리', '폼 submit, validation, input 다루기', 'TODO', '2026-01-22', '2026-05-15', 4, 4, 4, now(), now()),
('Fetch API', 'HTTP 요청, 응답 처리, JSON 파싱', 'TODO', '2026-01-25', '2026-05-20', 4, 4, 4, now(), now()),
('비동기 UI 패턴', '로딩/에러/성공 상태 처리 패턴', 'TODO', '2026-01-27', '2026-05-25', 4, 4, 4, now(), now()),
('로컬 스토리지', 'localStorage/sessionStorage로 상태 저장', 'TODO', '2026-01-30', '2026-05-30', 4, 4, 4, now(), now());


INSERT INTO "SubTask" ("title", "status", "taskId", "createdAt", "updatedAt")
VALUES
('변수와 상수 이해하기', 'DONE', 9, now(), now()),
('자료형: 숫자, 문자, 불린', 'DONE', 10, now(), now()),
('자료형 변환', 'DONE', 12, now(), now()),
('null과 undefined', 'DONE', 10, now(), now()),
('객체: 프로퍼티, key, value, 메소드', 'DONE', 22, now(), now()),
('반복문: for', 'DONE', 15, now(), now()),
('반복문: while과 do while', 'DONE', 15, now(), now()),
('반복문: break와 continue', 'DONE', 16, now(), now()),
('숫자 타입 연산 연습', 'DONE', 10, now(), now()),
('문자열 메서드 사용하기', 'DONE', 10, now(), now()),
('불린과 조건식 만들기', 'DONE', 10, now(), now()),
('배열과 객체 차이 이해', 'IN_PROGRESS', 11, now(), now()),
('함수 타입 사용하기', 'IN_PROGRESS', 11, now(), now()),
('암시적 타입 변환 예제', 'DONE', 12, now(), now()),
('명시적 타입 변환 예제', 'DONE', 12, now(), now()),
('산술 연산자 실습', 'DONE', 13, now(), now()),
('비교 연산자 실습', 'DONE', 13, now(), now()),
('논리 연산자 실습', 'DONE', 13, now(), now()),
('조건문 if 실습', 'DONE', 14, now(), now()),
('조건문 else if 실습', 'DONE', 14, now(), now()),
('switch 문 사용하기', 'DONE', 14, now(), now()),
('중첩 반복문 실습', 'DONE', 16, now(), now()),
('함수 선언식 만들기', 'DONE', 17, now(), now()),
('함수 표현식 만들기', 'DONE', 17, now(), now()),
('기본 매개변수 사용하기', 'DONE', 18, now(), now()),
('rest 파라미터 사용하기', 'IN_PROGRESS', 18, now(), now()),
('this와 화살표 함수 차이', 'IN_PROGRESS', 19, now(), now()),
('배열 생성 연습', 'DONE', 20, now(), now()),
('배열 인덱스로 접근하기', 'DONE', 20, now(), now()),
('map으로 데이터 변환', 'DONE', 21, now(), now()),
('filter로 데이터 거르기', 'DONE', 21, now(), now()),
('reduce로 합계 계산', 'DONE', 21, now(), now()),
('객체 프로퍼티 읽기', 'DONE', 22, now(), now()),
('객체 메서드 호출하기', 'IN_PROGRESS', 22, now(), now()),
('전역 스코프와 지역 스코프', 'IN_PROGRESS', 23, now(), now()),
('블록 스코프 실습', 'IN_PROGRESS', 23, now(), now()),
('클로저 예제 만들기', 'TODO', 24, now(), now()),
('콜백 함수 만들기', 'IN_PROGRESS', 25, now(), now()),
('이벤트 루프 흐름 그려보기', 'TODO', 25, now(), now()),
('Promise 생성하기', 'IN_PROGRESS', 26, now(), now()),
('then과 catch 체이닝', 'TODO', 26, now(), now()),
('async 함수 만들기', 'IN_PROGRESS', 27, now(), now()),
('await로 비동기 처리', 'IN_PROGRESS', 27, now(), now()),
('try/catch로 에러 처리', 'IN_PROGRESS', 28, now(), now()),
('모듈 export 해보기', 'TODO', 29, now(), now()),
('import로 불러오기', 'IN_PROGRESS', 29, now(), now()),
('class 정의하기', 'IN_PROGRESS', 30, now(), now()),
('constructor 사용하기', 'IN_PROGRESS', 30, now(), now()),
('extends로 상속 구현', 'IN_PROGRESS', 31, now(), now()),
('prototype 체인 이해', 'TODO', 31, now(), now()),
('querySelector 사용', 'TODO', 32, now(), now()),
('DOM 요소 조작하기', 'TODO', 32, now(), now()),
('이벤트 리스너 등록', 'TODO', 33, now(), now()),
('이벤트 객체 사용', 'TODO', 33, now(), now()),
('폼 입력값 읽기', 'TODO', 34, now(), now()),
('폼 유효성 검사', 'TODO', 34, now(), now()),
('fetch로 API 호출', 'TODO', 35, now(), now()),
('JSON 응답 처리', 'TODO', 35, now(), now()),
('로딩 상태 표시', 'TODO', 36, now(), now()),
('에러 상태 처리', 'TODO', 36, now(), now()),
('localStorage 저장', 'TODO', 38, now(), now()),
('sessionStorage 사용', 'TODO', 38, now(), now());

INSERT INTO "Comment" ("content", "taskId", "projectId", "authorId", "createdAt", "updatedAt")
VALUES
('값의 재할당 여부가 변수와 상수를 갈라요', 9, 4, 4, now(), now()),
('!null과 !undefine 값 당장 알면 꽤 고수', 10, 4, 4, now(), now()),
('typeof 함수로 자료형 알아봐요~', 12, 4, 4, now(), now()),
('Number(babo) = +babo 일까요?', 12, 4, 4, now(), now()),
('i++와 ++i 차이?', 15, 4, 4, now(), now()),
('변수의 스코프는 중괄호 안', 24, 4, 4, now(), now()),
('배열은 0번부터 시작하는 거 잊지 마세요', 20, 4, 4, now(), now()),
('map은 원본 배열을 안 바꿔서 안전함', 21, 4, 4, now(), now()),
('reduce는 처음에 진짜 헷갈림', 21, 4, 4, now(), now()),
('객체 프로퍼티 접근은 점이랑 대괄호 둘 다 됨', 22, 4, 4, now(), now()),
('this는 호출한 주체에 따라 달라짐', 22, 4, 4, now(), now()),
('전역 변수 남용하면 디버깅 지옥', 23, 4, 4, now(), now()),
('let과 const는 블록 스코프', 23, 4, 4, now(), now()),
('클로저는 함수 안에 함수', 24, 4, 4, now(), now()),
('외부 변수 기억하는 게 핵심', 24, 4, 4, now(), now()),
('콜백 지옥 피하려면 Promise', 25, 4, 4, now(), now()),
('이벤트 루프는 큐를 돌림', 25, 4, 4, now(), now()),
('then은 성공, catch는 실패', 26, 4, 4, now(), now()),
('finally는 무조건 실행', 26, 4, 4, now(), now()),
('await는 Promise가 끝날 때까지 대기', 27, 4, 4, now(), now()),
('async 함수는 항상 Promise 반환', 27, 4, 4, now(), now()),
('에러 던질 땐 throw 사용', 28, 4, 4, now(), now()),
('export default랑 named export 헷갈림', 29, 4, 4, now(), now()),
('import {} 문법 꼭 기억', 29, 4, 4, now(), now()),
('constructor는 객체 초기화', 30, 4, 4, now(), now()),
('new 키워드 안 쓰면 망함', 30, 4, 4, now(), now()),
('상속하면 메서드 재사용 가능', 31, 4, 4, now(), now()),
('querySelector는 CSS 셀렉터 씀', 32, 4, 4, now(), now()),
('DOM은 화면이랑 연결됨', 32, 4, 4, now(), now()),
('이벤트 버블링 조심', 33, 4, 4, now(), now()),
('form submit하면 새로고침 됨', 34, 4, 4, now(), now()),
('preventDefault 필수', 34, 4, 4, now(), now()),
('fetch는 기본이 GET', 35, 4, 4, now(), now()),
('response.json()으로 파싱', 35, 4, 4, now(), now()),
('로딩 중엔 스피너 보여주기', 36, 4, 4, now(), now()),
('에러 UI도 꼭 필요', 36, 4, 4, now(), now()),
('localStorage는 문자열만 저장됨', 37, 4, 4, now(), now()),
('JSON.stringify 안 하면 깨짐', 37, 4, 4, now(), now());


INSERT INTO "Tag" ("name") 
VALUES
('베이킹'), ('사워도우'),
('운동'), ('건강습관'),
('DIY'), ('JS'), ('코드잇'),
('초급'), ('중급'), ('고급'),
('기초문법'), ('자료형'), ('연산자'),
('조건문'), ('반복문'), ('함수'),
('배열'), ('객체'), ('스코프'),
('비동기'), ('에러핸들링'), ('모듈'), ('클래스'),
('프로토타입'), ('DOM'), ('폼'),
('네트워크'), ('상태관리'), ('저장소');

INSERT INTO "TaskTag" ("taskId","tagId")
VALUES
-- 1~8 생활/취미
(1,1),(1,2),                 -- 천연효모: 베이킹, 사워도우
(2,1),(2,2),                 -- 깜빠뉴: 베이킹, 사워도우
(3,3),(3,4),                 -- 걷기: 운동, 건강습관
(4,5),                       -- 벽지: DIY
(5,1),(5,2),                 -- 바게트: 베이킹, 사워도우
(6,3),(6,4),                 -- 에어로빅: 운동, 건강습관
(7,3),(7,4),                 -- 근력: 운동, 건강습관
(8,3),(8,4),                 -- 매일 운동: 운동, 건강습관

-- 9~38 JS 커리큘럼 (JS+주제 중심, 코드잇/난이도는 섞어서 다양성)
(9,6),(9,7),(9,12),          -- 데이터 타입: JS, 코드잇, 자료형
(10,6),(10,8),(10,12),       -- 원시 타입: JS, 초급, 자료형
(11,6),(11,8),(11,18),       -- 참조 타입: JS, 초급, 객체
(12,6),(12,7),(12,11),       -- 타입 변환: JS, 코드잇, 기초문법

(13,6),(13,8),(13,13),       -- 연산자: JS, 초급, 연산자
(14,6),(14,14),              -- 조건문: JS, 조건문 (2개만)
(15,6),(15,8),(15,15),       -- 반복문 기초: JS, 초급, 반복문
(16,6),(16,9),(16,15),       -- 반복문 심화: JS, 중급, 반복문

(17,6),(17,16),              -- 함수 선언: JS, 함수
(18,6),(18,9),(18,16),       -- 함수 인자: JS, 중급, 함수
(19,6),(19,7),(19,16),       -- 화살표 함수: JS, 코드잇, 함수

(20,6),(20,8),(20,17),       -- 배열 기초: JS, 초급, 배열
(21,6),(21,9),(21,17),       -- 배열 메서드: JS, 중급, 배열

(22,6),(22,7),(22,18),       -- 객체 기초: JS, 코드잇, 객체
(23,6),(23,9),(23,18),       -- 객체 메서드: JS, 중급, 객체

(24,6),(24,19),              -- 스코프: JS, 스코프
(25,6),(25,10),(25,19),      -- 클로저: JS, 고급, 스코프

(26,6),(26,9),(26,20),       -- 비동기 기초: JS, 중급, 비동기
(27,6),(27,7),(27,20),       -- Promise: JS, 코드잇, 비동기
(28,6),(28,9),(28,20),       -- async/await: JS, 중급, 비동기

(29,6),(29,9),(29,21),       -- 에러 처리: JS, 중급, 에러핸들링
(30,6),(30,7),(30,22),       -- 모듈 시스템: JS, 코드잇, 모듈

(31,6),(31,9),(31,23),       -- 클래스: JS, 중급, 클래스
(32,6),(32,10),(32,24),      -- 상속과 프로토타입: JS, 고급, 프로토타입

(33,6),(33,9),(33,25),       -- DOM 기초: JS, 중급, DOM
(34,6),(34,7),(34,25),       -- DOM 이벤트: JS, 코드잇, DOM

(35,6),(35,9),(35,26),       -- 폼 처리: JS, 중급, 폼
(36,6),(36,9),(36,27),       -- Fetch API: JS, 중급, 네트워크
(37,6),(37,10),(37,28),      -- 비동기 UI 패턴: JS, 고급, 상태관리
(38,6),(38,9),(38,29);       -- 로컬 스토리지: JS, 중급, 저장소


/*----------------------------------------------------------------------------------

psql postgresql://postgres:password@localhost:5432/moonshot

TRUNCATE TABLE "TaskTag"; -- 테이블 내용 비우기

-- 테이블 모두 지우기 (마이그레이션 필요)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DELETE FROM "Invitation" WHERE id = 1;  -- 아이디가 1인 로우 제거

UPDATE "Invitation" SET "status" = 'PENDING' WHERE id = 3;


INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
VALUES
  ('프리즈마 완전정복', '같이 열심히 하면 됩니다', 8, now(), now());

INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
VALUES
  (3, 3, 'OWNER', now(), now());

  */