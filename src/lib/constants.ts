import dotenv from 'dotenv';

dotenv.config();

// console.log(process.env.PORT);
// console.log(process.env.NODE_ENV);

const NODE_ENV = (process.env.NODE_ENV || 'development') as 'development' | 'production';
const PORT = process.env.PORT || 3000;
const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

export { NODE_ENV, PORT, ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
