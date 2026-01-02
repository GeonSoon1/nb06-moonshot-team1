import crypto from 'crypto';

//AES (Advanced Encryption Standard): 전 세계적으로 가장 많이 사용되는 표준 암호화 방식
// AES: 대표적인 대칭키 암호 알고리즘
// 256: 키 길이가 256비트(=32바이트)
// GCM: “암호화 + 위변조 검증”을 같이 해주는 모드
// → 누가 암호문을 조금이라도 바꾸면 복호화가 실패하게 만들어 줌
function getKey() {
  const b64 = process.env.GOOGLE_TOKEN_ENC_KEY;
  if (!b64) throw new Error('Missing GOOGLE_TOKEN_ENC_KEY');
  const key = Buffer.from(b64, 'base64'); //실제 암호화에 쓸 수 있는 바이트배열로 변환
  if (key.length !== 32) throw new Error('GOOGLE_TOKEN_ENC_KEY must be 32 bytes');
  return key;
}
//plain은 암호화할 "평문", 여기서는 토큰 문자열
export function encryptToken(plain) {
  if (!plain) return null;
  const key = getKey();
  const iv = crypto.randomBytes(12);
  // IV(Initialization Vector, 초기화 벡터)의 길이를 12바이트로 쓰겠다는 설정
  //gcm 모드에서는 iv는 매번 다른 iv가 사실상 필수, 같은 키로 같은 평문을 여러 번 암호화할 때 IV까지 같으면 위험
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  //암호화 기계, 인자값은(알고리즘, 키, iv), 이 알고리즘으로 키와 iv로 암호화할 준비
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  //Buffer = “바이트(0~255 숫자)의 배열”
  //Node.js에서 파일, 네트워크, 암호화처럼 텍스트가 아니라 ‘진짜 데이터(바이너리)’를 다룰 때 쓰는 타입.
  //concat은 여러 buffer를 하나로 이어붙이는 함수, 암호문 조각 2개를 이어붙여 하나를 만듦.
  //utf8은 문자열을 바이트로 바꾸는 인코딩 방식, 사람 눈은 글자인데 컴퓨터는 바이트만 알아서 어떤 규칙을로 바꿀지 필요한데
  //그 규칙이 utf-8임, 영어 알파벳은 보통 1바이트, 한글이나 이모지는 2~4바이트
  const tag = cipher.getAuthTag();
  //gcm의 중요한 기능으로 인증태그를 가져옴,
  //이tag는 암호문이 변조되지 않았음을 검증하는 checksum(데이터 전송이나 저장 시 발생한 오류를 감지하기 위한 간단한 기술)
  //나중에 복호화를 할 때 iv + cipher + tag가 셋 다 있어야 성공함
  return `${iv.toString('base64')}.${tag.toString('base64')}.${ciphertext.toString('base64')}`;
}
// DB에 저장하려면 바이트(Buffer)를 그대로 저장하기 불편하니까,
// iv, tag, ciphertext를 각각 base64 문자열로 변환,
// 그리고 .로 이어붙여서 한 칸에 저장하기 좋은 문자열을 만들어 반환.

export function decryptToken(payload) {
  if (!payload) return null;

  const [ivB64, tagB64, ctB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !ctB64) throw new Error('Invalid encrypted token format');
  const key = getKey();
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const ciphertext = Buffer.from(ctB64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
