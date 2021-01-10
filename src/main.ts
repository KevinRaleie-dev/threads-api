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

// const PORT: number = 4000;

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
      secure: process.env.NODE_ENV === 'development' ? false : true, // setting it to true enables it to be used with https
    },
    secret: process.env.COOKIE_SECRET!,
    saveUninitialized: false,
    resave: false,
    name: process.env.COOKIE_NAME // TODO: change the name of the cookie later

  }))
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers:[
        HelloResolver
      ],
      validate: false
    }),
    context: ({req, res}): AppContext => ({req, res})
  });

  apolloServer.applyMiddleware({ app });

  app.listen(Number(process.env.PORT), () => {
    console.log(`Server is running on http://localhost:${Number(process.env.PORT)}${apolloServer.graphqlPath}`);
  })

}

main();