const mongoose = require('mongoose');
const subscription = mongoose.model('SongsSubscription');
const bundleSubscription = mongoose.model('BundleSongsSubscription');

exports.getByAccountCode = async (req, res) => {
    try {
        const { accountCode } = req.query;
        const subscriptions = await subscription.find({accountCode}).lean();
        if(subscriptions) {
            return res.status(200).send(subscriptions);
        } else {
            res.status(400).send(`returned object ${subscriptions}`);
        };
    } 
    catch (error) {
        console.log('error',error)
        return res.status(400).send(error);
    }
};

exports.getBundleByAccountCode = async (req, res) => {
    try {
        const { accountCode } = req.query;
        const bundleSubscriptions = await bundleSubscription.find({accountCode}).lean();
        if(bundleSubscriptions) {
            return res.status(200).send(bundleSubscriptions.map(bundleSub => ({...bundleSub, status: 5})));
        } else {
            res.status(400).send(`returned object ${bundleSubscriptions}`);
        }
    }
    catch (error) {
        console.log('error',error)
        return res.status(400).send(error);
    }
};
