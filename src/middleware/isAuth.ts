import { AppContext } from '../types/context';
import { MiddlewareFn, NextFn } from 'type-graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAuth: MiddlewareFn<AppContext> = ({ context }, next: NextFn): Promise<any> => {
  if (!context.req.session.userId) {
    throw new Error('You are not authenticated to perform this action.');
  }

  return next();
};
