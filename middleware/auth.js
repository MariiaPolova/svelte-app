var admin = require('firebase-admin');
const { ErrorHandler } = require('../config/errorHandler')

// const initFirebaseAuth = () => {
//     admin.initializeApp({
//         credential: admin.credential.applicationDefault(),
//         databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
//       });
// }

const verifyUser = (req, res, next) => {
    try {
        // idToken comes from the client app
        const { idToken } = req.body;
        admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            let uid = decodedToken.uid;
            req.firebaseUuid = uid;
            if(!verifyDomain(decodedToken.email)) {
                next(new ErrorHandler(403, 'Not allowed with current domain'));
            }
            next();
        }).catch((error) => {
            next(new ErrorHandler(401, error.message))
        });
    } catch (error) {
        next(new ErrorHandler(401, error.message))
    }
  
}

const verifyDomain = (email) => {
    return email.endsWith(`@${process.env.WARM_EMAIL_DOMAIN}`)
}

module.exports = {
    verifyUser
};