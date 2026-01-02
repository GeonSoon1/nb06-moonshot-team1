import bcrypt from 'bcrypt';

for (let i = 1; i < 10; i++) {
  const password = 'password' + String(i);
  console.log('');
  console.log(password);
  console.log(await bcrypt.hash(password, 10));
}
