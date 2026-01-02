export const STATUS = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  done: 'DONE'
};

// YYYY-MM-DD를 Date로 (단순 처리)
export function toStartOfDay(dateStr) {
  // UTC 기준으로 자정 , t : time 날짜와 시간의 구분, z : zulu time (utc기준임을 나타냄)
  return new Date(`${dateStr}T00:00:00.000Z`);
}
export function toEndOfDay(dateStr) {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

export function dateParts(d) {
  return {
    //getUTC는 js 표준 내장객체인 date의 메서드임
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1, //date 객체에서 월은 0부터 시작이라 +1
    day: d.getUTCDate()
  };
}
