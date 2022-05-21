import admin from 'firebase-admin';

export default async(req, res, next) => {
    const { session: sessionCookie }  = req.cookies;

    try {
        const user = await admin.auth().verifySessionCookie(sessionCookie);
        return user && user.user_id ? next() : res.redirect('/login');
    } catch (error) {
        res.redirect('/login');
    }

}