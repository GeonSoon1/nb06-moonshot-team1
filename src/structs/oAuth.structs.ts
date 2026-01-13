import * as s from 'superstruct';

const email = s.refine(s.string(), 'Email', (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
const Name = s.refine(s.string(), 'Name', (value) => /^[A-Za-z0-9가-힣]{2,12}$/.test(value));
const password = s.refine(s.string(), 'Password', (value) => value.length >= 8 && value.length <= 16);

export const CreateUserBodyStruct = s.object({
  name: Name,
  email: email,
  password: password,
  profileImage: s.optional(s.nullable(s.string()))
});

export const LoginUserBodyStruct = s.object({
  email: email,
  password: password
});
