import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import { AppContext } from './types/context';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from '@resolvers/hello-resolver';
import { AuthResolver } from './resolvers/auth-resolver';
import { MeResolver } from './resolvers/me-resolver';
import { UserResolver } from './resolvers/user-resolver';
import { ItemResolver } from './resolvers/item-resolver';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, COOKIE_SECRET } from './utils/constants';

const PORT = 4000;

const redisStore = connectRedis(session);
const redis = new Redis();

async function main() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:8080',
      credentials: true,
    }),
  );
  app.set('trust-proxy', 1);

  app.use(
    session({
      store: new redisStore({ client: redis, disableTouch: true }),
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        sameSite: 'lax',
        secure: false, // set to true in prod
      },
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      name: COOKIE_NAME,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, AuthResolver, MeResolver, UserResolver, ItemResolver],
      validate: false,
    }),
    context: ({ req, res }): AppContext => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  createConnection()
    .then(() => {
      console.log('Creating databse connection...');
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
      });
    })
    .catch((err) => console.log(err));
}

main();
