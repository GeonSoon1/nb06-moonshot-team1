-- INSERT INTO "User" (email, name, "passwordHashed", "createdAt", "updatedAt")
-- VALUES
--   ('user1@test.com', 'user1', '$2b$10$0eu.QBUY5ZCQGWX.oO8MAeks0MHBSXer9J94NcZUSa2o7hl60qFjy', now(), now()),
--   ('user2@test.com', 'user2', '$2b$10$bUslXtF2adOHqVQQBiQi2.pBhNLX2Nmdzoy7L9aTeu8SnAqC.tKyq', now(), now()),
--   ('user3@test.com', 'user3', '$2b$10$wrrtxSZIe/jVDV.dfovZHuXhb.VLsCJp73WH9N7bNm0NlExISM/oK', now(), now()),
--   ('user4@test.com', 'user4', '$2b$10$BEPbUEt0iyggByK2rlGDbumECBnNsUa3/kPGh0K/8BLk7PDaq3.Le', now(), now()),
--   ('user5@test.com', 'user5', '$2b$10$PtRyuogMz.c57PFws5vBfOLWPgR.S.evR3EeLchS6Bdv/psoSNmLO', now(), now()),
--   ('user6@test.com', 'user6', '$2b$10$jSm5kuKo9QA.jqnKCI.guup49xDx6gj9gRSj9T.Vw91NCwA8CNxZO', now(), now()),
--   ('user7@test.com', 'user7', '$2b$10$i/zy07XVMaISTdavrOTekOOuzVVRpyhbo2hwZqAQ1Sxncgcb49qQ.', now(), now()),
--   ('user8@test.com', 'user8', '$2b$10$KhuEOtTmZVgo6xbI0qPLL.UO/dIzzJ7T6pA/HuWbUmfy35e44ed3W', now(), now()),
--   ('user9@test.com', 'user9', '$2b$10$f0oBVLIPPAA1zHhyvsha3eP91iDtetCguX2MlEtwluPF4knJAl5Qm', now(), now());

-- INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
-- VALUES
--   ('사워도우빵 만들기', '천연효모로 건강한 빵 같이 만들어요', 1, now(), now()),
--   ('근육질몸 만들기', '매일 30분 투자하여 6개월 내 근육질 되기', 2, now(), now()),
--   ('집수리 하기', '외관은 오래되었어도 내부는 새집처럼!', 3, now(), now()),
--   ('Javascript 완전정복', '자바스크립트 사용법과 적용 마스터하기 ', 4, now(), now()),
--   ('프리즈마 완전정복', '같이 열심히 하면 됩니다', 8, now(), now());;


-- INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
-- VALUES
--   (1, 1, 'OWNER', now(), now()),
--   (2, 2, 'OWNER', now(), now()),
--   (3, 3, 'OWNER', now(), now()), 
--   (4, 4, 'OWNER', now(), now()),
--   (5, 8, 'OWNER', now(), now());;

-- INSERT INTO "Task" ("title", description, "startDate", "endDate", "projectId", "taskCreatorId", "assigneeProjectMemberId", "createdAt", "updatedAt")
-- VALUES
-- ('천연효모 기르기', '식물을 키우듯 정성스럽게 키운 천연효모가 좋은 빵을 만들어요', '2026-01-01', '2026-01-31', 1, 1, 1, now(), now()),
-- ('깜빠뉴 굽기', '사워도우로 만드는 대표적인 하드 빵', '2026-01-15', '2026-02-28', 1, 1, 1, now(), now()),
-- ('걷기 생활화', '승강기 대신 계단 오르기, 수킬로 단거리는 교통수단 자제하기 등', '2025-12-25', '2026-06-30', 2, 2, 2, now(), now()),
-- ('벽지 바르기', '반려동물이 찢거나 세월의 때가 묻은 벽지 쉽게 교체할 수 있어요', '2026-01-01', '2026-02-28', 3, 3, 3, now(), now()),
-- ('자바스크립트 문법: 데이터 타입', 'JS의 대표적인 데이터 타입에 대하여 공부해요', '2026-01-01', '2026-01-10', 4, 4, 4, now(), now()),
-- ('자바스크립트 문법: 반복문', 'for, while 등 반복문에 대하여 공부해요', '2026-01-11', '2026-01-20', 4, 4, 4, now(), now()),
-- ('바케트 굽기', '사워도우로 만드는 대표적인 하드 빵 두번쨰 도전!', '2026-03-01', '2026-03-31', 1, 1, 1, now(), now()),
-- ('에어로빅 운동하기', '일주일에 2-3회 20분 이상 에어로빅 운동 추가합시다', '2026-01-15', '2026-06-30', 2, 2, 2, now(), now()),
-- ('근력 운동 하기', '일주일에 2-3회 30분 이상 근력 운동 추가합시다', '2026-02-15', '2026-06-30', 2, 2, 2, now(), now()),
-- ('매일 운동하기', '걷기, 에어로빅 운동, 근력 운동 중 한가지는 매일 1회 꼭 하기', '2026-03-15', '2026-06-30', 2, 2, 2, now(), now());


-- psql postgresql://postgres:password@localhost:5432/moonshot

-- INSERT INTO "User" (email, name, "passwordHashed", "createdAt", "updatedAt")
-- VALUES
--   ('user1@test.com', 'user1', '$2b$10$0eu.QBUY5ZCQGWX.oO8MAeks0MHBSXer9J94NcZUSa2o7hl60qFjy', now(), now()),
--   ('user2@test.com', 'user2', '$2b$10$bUslXtF2adOHqVQQBiQi2.pBhNLX2Nmdzoy7L9aTeu8SnAqC.tKyq', now(), now()),
--   ('user3@test.com', 'user3', '$2b$10$wrrtxSZIe/jVDV.dfovZHuXhb.VLsCJp73WH9N7bNm0NlExISM/oK', now(), now()),
--   ('user4@test.com', 'user4', '$2b$10$BEPbUEt0iyggByK2rlGDbumECBnNsUa3/kPGh0K/8BLk7PDaq3.Le', now(), now()),
--   ('user5@test.com', 'user5', '$2b$10$PtRyuogMz.c57PFws5vBfOLWPgR.S.evR3EeLchS6Bdv/psoSNmLO', now(), now()),
--   ('user6@test.com', 'user6', '$2b$10$jSm5kuKo9QA.jqnKCI.guup49xDx6gj9gRSj9T.Vw91NCwA8CNxZO', now(), now()),
--   ('user7@test.com', 'user7', '$2b$10$i/zy07XVMaISTdavrOTekOOuzVVRpyhbo2hwZqAQ1Sxncgcb49qQ.', now(), now()),
--   ('user8@test.com', 'user8', '$2b$10$KhuEOtTmZVgo6xbI0qPLL.UO/dIzzJ7T6pA/HuWbUmfy35e44ed3W', now(), now()),
--   ('user9@test.com', 'user9', '$2b$10$f0oBVLIPPAA1zHhyvsha3eP91iDtetCguX2MlEtwluPF4knJAl5Qm', now(), now());

-- INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
-- VALUES
--   ('사워도우빵 만들기', '천연효모로 건강한 빵 같이 만들어요', 1, now(), now()),
--   ('근육질몸 만들기', '매일 30분 투자하여 6개월 내 근육질 되기', 2, now(), now()),
--   ('집수리 하기', '외관은 오래되었어도 내부는 새집처럼!', 3, now(), now()),
--   ('Javascript 완전정복', '자바스크립트 사용법과 적용 마스터하기 ', 4, now(), now()),
--   ('프리즈마 완전정복', '같이 열심히 하면 됩니다', 8, now(), now());;


-- INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
-- VALUES
--   (1, 1, 'OWNER', now(), now()),
--   (2, 2, 'OWNER', now(), now()),
--   (3, 3, 'OWNER', now(), now()), 
--   (4, 4, 'OWNER', now(), now()),
--   (5, 8, 'OWNER', now(), now());

-- INSERT INTO "Task" ("title", description, "startDate", "endDate", "projectId", "taskCreatorId", "assigneeProjectMemberId", "createdAt", "updatedAt")
-- VALUES
-- ('천연효모 기르기', '식물을 키우듯 정성스럽게 키운 천연효모가 좋은 빵을 만들어요', '2026-01-01', '2026-01-31', 1, 1, 1, now(), now()),
-- ('깜빠뉴 굽기', '사워도우로 만드는 대표적인 하드 빵', '2026-01-15', '2026-02-28', 1, 1, 1, now(), now()),
-- ('걷기 생활화', '승강기 대신 계단 오르기, 수킬로 단거리는 교통수단 자제하기 등', '2025-12-25', '2026-06-30', 2, 2, 2, now(), now()),
-- ('벽지 바르기', '반려동물이 찢거나 세월의 때가 묻은 벽지 쉽게 교체할 수 있어요', '2026-01-01', '2026-02-28', 3, 3, 3, now(), now()),
-- ('자바스크립트 문법: 데이터 타입', 'JS의 대표적인 데이터 타입에 대하여 공부해요', '2026-01-01', '2026-01-10', 4, 4, 4, now(), now()),
-- ('자바스크립트 문법: 반복문', 'for, while 등 반복문에 대하여 공부해요', '2026-01-11', '2026-01-20', 4, 4, 4, now(), now()),
-- ('바케트 굽기', '사워도우로 만드는 대표적인 하드 빵 두번쨰 도전!', '2026-03-01', '2026-03-31', 1, 1, 1, now(), now()),
-- ('에어로빅 운동하기', '일주일에 2-3회 20분 이상 에어로빅 운동 추가합시다', '2026-01-15', '2026-06-30', 2, 2, 2, now(), now()),
-- ('근력 운동 하기', '일주일에 2-3회 30분 이상 근력 운동 추가합시다', '2026-02-15', '2026-06-30', 2, 2, 2, now(), now()),
-- ('매일 운동하기', '걷기, 에어로빅 운동, 근력 운동 중 한가지는 매일 1회 꼭 하기', '2026-03-15', '2026-06-30', 2, 2, 2, now(), now());

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- DELETE FROM "Invitation" WHERE id = 1;  -- 아이디가 1인 로우 제거

-- UPDATE "Invitation" SET "status" = 'PENDING' WHERE id = 3;


-- INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
-- VALUES
--   ('프리즈마 완전정복', '같이 열심히 하면 됩니다', 8, now(), now());

-- INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
-- VALUES
--   (3, 3, 'OWNER', now(), now());


-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- DELETE FROM "Invitation" WHERE id = 1;  -- 아이디가 1인 로우 제거

-- UPDATE "Invitation" SET "status" = 'PENDING' WHERE id = 3;


-- INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
-- VALUES
--   ('프리즈마 완전정복', '같이 열심히 하면 됩니다', 8, now(), now());

-- INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
-- VALUES
--   (3, 3, 'OWNER', now(), now());





psql postgresql://postgres:postgres@localhost:5432/moonshot_frontend_backend

-- 1. 유저 데이터 (비밀번호: password1)
-- INSERT INTO "User" (id, email, name, "passwordHashed", "createdAt", "updatedAt")
-- VALUES
--   (1, 'user1@test.com', 'user1', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (2, 'user2@test.com', 'user2', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (3, 'user3@test.com', 'user3', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (4, 'user4@test.com', 'user4', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (5, 'user5@test.com', 'user5', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (6, 'user6@test.com', 'user6', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (7, 'user7@test.com', 'user7', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (8, 'user8@test.com', 'user8', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now()),
--   (9, 'user9@test.com', 'user9', '$2b$10$K3PWqBv.eIOyHstdIXz/murAsO2fPTrqdq/pWtU5n1YGv6eXVgjsy', now(), now());

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


-- 2. 프로젝트 데이터 (User 1이 대부분의 프로젝트 소유자)
INSERT INTO "Project" (id, name, description, "ownerId", "createdAt", "updatedAt")
VALUES
  (1, '사워도우빵 만들기', '천연효모로 건강한 빵 같이 만들어요', 1, now(), now()),
  (2, '근육질몸 만들기', '매일 30분 투자하여 6개월 내 근육질 되기', 2, now(), now()),
  (3, '집수리 하기', '외관은 오래되었어도 내부는 새집처럼!', 3, now(), now()),
  (4, 'Javascript 완전정복', '자바스크립트 마스터하기', 1, now(), now()),
  (5, '프리즈마 완전정복', '함께 공부하는 백엔드 스터디', 8, now(), now()),
  (6, '유럽 배낭여행 계획', '2026년 여름, 30일간의 유럽 일주를 위한 상세 계획', 1, now(), now()),
  (7, '스마트 홈 인테리어', '거실부터 침실까지 스마트 기기로 편리한 집 만들기', 1, now(), now());

-- 3. 프로젝트 멤버 데이터 (회원 명부)
INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
VALUES
  (1, 1, 'OWNER', now(), now()), (1, 2, 'MEMBER', now(), now()), (1, 3, 'MEMBER', now(), now()),
  (2, 2, 'OWNER', now(), now()), (2, 1, 'MEMBER', now(), now()),
  (3, 3, 'OWNER', now(), now()), 
  (4, 1, 'OWNER', now(), now()), (4, 4, 'MEMBER', now(), now()),
  (5, 8, 'OWNER', now(), now()), (5, 1, 'MEMBER', now(), now()),
  (6, 1, 'OWNER', now(), now()), (6, 2, 'MEMBER', now(), now()), (6, 5, 'MEMBER', now(), now()),
  (7, 1, 'OWNER', now(), now()), (7, 6, 'MEMBER', now(), now());

-- 4. 할 일 데이터 (총 22개, 상태 골고루 배치)
INSERT INTO "Task" (id, "title", description, "startDate", "endDate", "projectId", "taskCreatorId", "assigneeProjectMemberId", "status", "createdAt", "updatedAt")
VALUES
  -- 1번 프로젝트
  (1, '천연효모 기르기', '정성껏 키워요', '2026-01-01', '2026-01-31', 1, 1, 1, 'DONE', now(), now()),
  (2, '깜빠뉴 굽기', '하드 빵 도전', '2026-01-15', '2026-02-28', 1, 1, 1, 'IN_PROGRESS', now(), now()),
  (3, '바게트 굽기', '두 번째 도전!', '2026-03-01', '2026-03-31', 1, 1, 2, 'TODO', now(), now()),
  -- 2번 프로젝트
  (4, '걷기 생활화', '승강기 대신 계단', '2025-12-25', '2026-06-30', 2, 2, 2, 'DONE', now(), now()),
  (5, '에어로빅', '주 3회 실시', '2026-01-15', '2026-06-30', 2, 2, 1, 'TODO', now(), now()),
  (6, '근력 운동', '단백질 섭취 필수', '2026-02-15', '2026-06-30', 2, 2, 2, 'IN_PROGRESS', now(), now()),
  -- 4번 프로젝트
  (7, '데이터 타입 학습', 'JS 기초', '2026-01-01', '2026-01-10', 4, 1, 1, 'DONE', now(), now()),
  (8, '반복문 정복', 'for, while', '2026-01-11', '2026-01-20', 4, 1, 4, 'IN_PROGRESS', now(), now()),
  (9, '클로저 이해하기', '심화 문법', '2026-01-21', '2026-01-30', 4, 1, 1, 'TODO', now(), now()),
  -- 6번 프로젝트 (배낭여행)
  (10, '항공권 예약', '최저가 검색', '2026-01-01', '2026-01-05', 6, 1, 1, 'DONE', now(), now()),
  (11, '유레일 패스 구매', '루트 확정 후 결제', '2026-01-10', '2026-01-15', 6, 1, 2, 'DONE', now(), now()),
  (12, '파리 숙소 예약', '에어비앤비', '2026-01-15', '2026-01-20', 6, 1, 5, 'IN_PROGRESS', now(), now()),
  (13, '런던 뮤지컬 예매', '라이온킹 위주', '2026-02-01', '2026-02-05', 6, 1, 1, 'TODO', now(), now()),
  (14, '스위스 패러글라이딩', '날씨 확인 필수', '2026-05-10', '2026-05-12', 6, 1, 2, 'TODO', now(), now()),
  (15, '로마 맛집 리스트', '피자, 파스타', '2026-06-01', '2026-06-10', 6, 1, 1, 'TODO', now(), now()),
  -- 7번 프로젝트 (인테리어)
  (16, '거실 조명 교체', '스마트 전구', '2026-01-01', '2026-01-10', 7, 1, 1, 'DONE', now(), now()),
  (17, '스마트 스피커 설정', '구글 홈 허브', '2026-01-11', '2026-01-15', 7, 1, 6, 'IN_PROGRESS', now(), now()),
  (18, '자동 온도 조절기', '네스트 설치', '2026-01-20', '2026-01-25', 7, 1, 6, 'TODO', now(), now()),
  (19, '보안 카메라 세팅', 'CCTV 연동', '2026-02-01', '2026-02-10', 7, 1, 1, 'TODO', now(), now());

-- 5. 하위 할 일 데이터 (체크리스트 시연용)
INSERT INTO "SubTask" ("title", "status", "taskId", "createdAt", "updatedAt")
VALUES
  ('여권 만료일 확인', 'DONE', 10, now(), now()),
  ('카드 해외결제 한도 확인', 'DONE', 10, now(), now()),
  ('비행기 기내식 신청', 'TODO', 10, now(), now()),
  ('국가별 기차 시간표 확인', 'DONE', 11, now(), now()),
  ('와이파이 도시락 예약', 'TODO', 11, now(), now()),
  ('기존 전구 제거', 'DONE', 16, now(), now()),
  ('모바일 앱 연동', 'TODO', 16, now(), now());

-- 6. 댓글 데이터 (대화 느낌 강조)
INSERT INTO "Comment" ("content", "taskId", "projectId", "authorId", "createdAt", "updatedAt")
VALUES
  ('항공권 결제 끝났습니다!', 10, 6, 1, now(), now()),
  ('패스 가격 올랐으니 빨리 사야겠어요.', 11, 6, 2, now(), now()),
  ('숙소 후보 리스트 보냈으니 확인해주세요.', 12, 6, 5, now(), now()),
  ('전구 색깔은 전구색이 좋겠죠?', 16, 7, 6, now(), now()),
  ('네, 따뜻한 느낌으로 가시죠.', 16, 7, 1, now(), now());


-- 7. 태그 데이터
INSERT INTO "Tag" (id, name)
VALUES
  (1, '요리'), (2, '취미'), (3, '건강'), (4, '개발'), (5, '중요'), (6, '여행'), (7, '쇼핑'), (8, '인테리어');


-- 8. 태그 연결 (TaskTag)
INSERT INTO "TaskTag" ("taskId", "tagId")
VALUES
  (1, 1), (1, 2), (2, 1), (7, 4), (10, 6), (10, 5), (12, 6), (16, 8), (16, 5);