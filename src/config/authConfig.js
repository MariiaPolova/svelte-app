/** The Auth0 configuration */
export default {
	authRequired: false,
	auth0Logout: true,
	baseURL:'http://localhost:3000',

	// these parameters are not secret. You find these in your application on Auth0
	clientID: process.env.AUTH0_CLIENT_ID,
	// This is actually called "domain" in the Auth0 admin; prepend "https://"
	issuerBaseURL: process.env.AUTH0_CLIENT_DOMAIN,

	// this one is. it must never be included in the client bundle.
	// set it to a long, random string.
	secret: process.env.AUTH0_CLIENT_SECRET
};