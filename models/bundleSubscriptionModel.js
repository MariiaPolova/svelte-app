var mongoose = require('mongoose');

const Schema = mongoose.Schema;


var schema = new Schema({
    accountCode: {
        type: String,
    },
    requestUuid: {
        type: String,
    },
    plan: {
        type: String,
        default: ''
    },
    subscriptionUuid: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    created: {
        type: Date
    },
    updated: {
        type: Date
    },
    dnaOrders: [{
        orderId: String
    }],
});

var BundleSongsSubscription = mongoose.model('BundleSongsSubscription', schema, 'BundleSubscriptions');

module.exports = { BundleSongsSubscription };
