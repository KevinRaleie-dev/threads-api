/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { AppContext } from '../types/context';
import { MiddlewareFn, NextFn } from 'type-graphql';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAuth: MiddlewareFn<AppContext> = ({ context }, next: NextFn): Promise<any> => {
  if (!context.req.session.userId) {
    throw new Error('You are not authenticated to perform this action.');
  }

  return next();
};

export const isAuthenticated: MiddlewareFn<AppContext> = ({ context }, next): Promise<any> => {
  const auth = context.req.headers['authorization'];

  if (!auth) {
    throw new Error('You are not authorized to perform this action.');
  }

  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN as string);

    context.payload = payload as any;
  } catch (error) {
    throw new Error(error.message);
  }

  return next();
};
