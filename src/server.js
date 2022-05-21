import sirv from 'sirv';
import express from 'express';
import { json } from "body-parser";
// import cookieParser from "cookie-parser";
import compression from 'compression';
import * as sapper from '@sapper/server';
import { admin } from 'firebase-admin';

const { PORT, NODE_ENV, FIREBASE_API_KEY } = process.env;
const dev = NODE_ENV === 'development';

express()
	.use(
		json(),
		// cookieParser(),
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware(/*{
			session: async((req, res) => {
				let user = null;
				const sessionCookie = req.cookies.session || '';
				try {
					user = await admin.auth().verifySessionCookie(sessionCookie, true);
					return { user };
				} catch (error) {
					res.redirect('/error');
				}

			})
		}*/)
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
