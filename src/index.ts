import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
const main = async () => {
	await createConnection();

	const schema = await buildSchema({
		resolvers: [ RegisterResolver ]
	});
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }: any) => ({ req })
	});
	const app = Express();

	const RedisStore = connectRedis(session);
	const sessionOption: session.SessionOptions = {
		store: new RedisStore({
			client: redis as any
		}),
		name: 'qid',
		secret: 'asdfghjkl123131',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
		}
	};

	app.use(session(sessionOption));
	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000'
		})
	);
	apolloServer.applyMiddleware({ app });
	app.listen(4000, () => {
		console.log('Listening at http://localhost:4000/graphql');
	});
};

main();
