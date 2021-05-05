import 'dotenv/config';
import { User } from '@entities/User';
import jwt from 'jsonwebtoken';

const createAccessToken = (user: User): string => {
  const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN as string, {
    expiresIn: '30d',
  });

  return token;
};

const createRefreshToken = (user: User): string => {
  const token = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: '30d',
  });

  return token;
};

export { createAccessToken, createRefreshToken };
