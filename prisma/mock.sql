INSERT INTO "User" (email, name, "passwordHash", "createdAt", "updatedAt")
VALUES
  ('user1@test.com', 'user1', 'password1', now(), now()),
  ('user2@test.com', 'user2', 'password2', now(), now()),
  ('user3@test.com', 'user3', 'password3', now(), now()),
  ('user4@test.com', 'user4', 'password4', now(), now()),
  ('user5@test.com', 'user5', 'password5', now(), now()),
  ('user6@test.com', 'user6', 'password6', now(), now()),
  ('user7@test.com', 'user7', 'password7', now(), now());

INSERT INTO "Project" (name, description, "ownerId", "createdAt", "updatedAt")
VALUES
  ('사워도우빵 만들기', '천연효모로 건강한 빵 같이 만들어요', 1, now(), now()),
  ('근육질몸 만들기', '매일 30분 투자하여 6개월 내 근육질 되기', 1, now(), now()),
  ('집수리 하기', '외관은 오래되었어도 내부는 새집처럼!', 2, now(), now()),
  ('Javascript 완전정복', '자바스크립트 사용법과 적용 마스터하기 ', 3, now(), now());


INSERT INTO "ProjectMember" ("projectId", "memberId", role, "createdAt", "updatedAt")
VALUES
  (1, 1, 'OWNER', now(), now()),
  (2, 1, 'OWNER', now(), now()),
  (3, 2, 'OWNER', now(), now()), 
  (4, 3, 'OWNER', now(), now());

INSERT INTO "Task" ("title", description, "startDate", "endDate", "projectId", "taskCreatorId", "assigneeProjectMemberId", "createdAt", "updatedAt")
VALUES
('천연효모 기르기', '식물을 키우듯 정성스럽게 키운 천연효모가 좋은 빵을 만들어요', '2026-01-01', '2026-01-31', 1, 1, 1, now(), now()),
('깜빠뉴 굽기', '사워도우로 만드는 대표적인 하드 빵', '2026-01-15', '2026-02-28', 1, 1, 1, now(), now()),
('걷기 생활화', '승강기 대신 계단 오르기, 수킬로 단거리는 교통수단 자제하기 등', '2025-12-25', '2026-06-30', 2, 1, 1, now(), now()),
('벽지 바르기', '반려동물이 찢거나 세월의 때가 묻은 벽지 쉽게 교체할 수 있어요', '2026-01-01', '2026-02-28', 3, 2, 2, now(), now()),
('자바스크립트 문법: 데이터 타입', 'JS의 대표적인 데이터 타입에 대하여 공부해요', '2026-01-01', '2026-01-10', 4, 3, 3, now(), now()),
('자바스크립트 문법: 반복문', 'for, while 등 반복문에 대하여 공부해요', '2026-01-11', '2026-01-20', 4, 3, 3, now(), now()),
('바케트 굽기', '사워도우로 만드는 대표적인 하드 빵 두번쨰 도전!', '2026-03-01', '2026-03-31', 1, 1, 1, now(), now()),
('에어로빅 운동하기', '일주일에 2-3회 20분 이상 에어로빅 운동 추가합시다', '2026-01-15', '2026-06-30', 2, 1, 1, now(), now()),
('근력 운동 하기', '일주일에 2-3회 30분 이상 근력 운동 추가합시다', '2026-02-15', '2026-06-30', 2, 1, 1, now(), now()),
('매일 운동하기', '걷기, 에어로빅 운동, 근력 운동 중 한가지는 매일 1회 꼭 하기', '2026-03-15', '2026-06-30', 2, 1, 1, now(), now());


psql postgresql://apple:0000@localhost:5432/moonshot

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