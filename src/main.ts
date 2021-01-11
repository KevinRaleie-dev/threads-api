import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { connection } from './database/database';
import connectRedis from 'connect-redis';
import { AppContext } from './utils/context';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';

const PORT: number = 4000;

const redisStore = connectRedis(session);
const redis = new Redis()

async function main() {

  connection(); // ORM connection to the database

  const app = express();

  app.set('trust-proxy', 1);

  app.use(
    session({
    store: new redisStore({client: redis, disableTouch: true}),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
      sameSite: 'lax',
      secure: false //TODO: process.env.NODE_ENV === 'development' ? false : true, // setting it to true enables it to be used with https
    },
    secret: 'superSecretCookie',
    saveUninitialized: false,
    resave: false,
    name: 'cid' // TODO: change the name of the cookie later and add to .env

  }))
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[
        HelloResolver,
        UserResolver
      ],
      validate: false
    }),
    context: ({req, res}): AppContext => ({req, res})
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${apolloServer.graphqlPath}`);
  })

}

main();