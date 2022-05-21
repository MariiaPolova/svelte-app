const auth = require('../middleware/auth');
const got = require('got');
const {getRecurlyNewClient} = require('../config/paymentGatewayClient.js')

exports.verifyAuthUser = (req, res, next) => {
    try {
        res.status(200).send();
    } catch (error) {
        res.status(error.status || 500).json({errors: {message: error.message}});
    }
}

exports.getInfoByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        console.log('email', email)
        const user = await got(`${process.env.AUTH0_IDENTIFIER}/users-by-email`, 
        {
            searchParams: {
                email
            },
            headers: {
                'Authorization' : `Bearer ${process.env.AUTH0_TOKEN}`
              },
            responseType: 'json', 
            resolveBodyOnly: true
        });

        console.log(user);
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
}

exports.getMusicInfoByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;
        const client = getRecurlyNewClient();
        const accounts = client.listAccounts({limit: 10, email})
        const account = await accounts.first();
        res.status(200).send(account);
    } catch (error) {
        console.log(error);
    }
}
