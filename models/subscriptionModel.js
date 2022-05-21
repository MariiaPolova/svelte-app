var mongoose = require('mongoose');

const Schema = mongoose.Schema;


var schema = new Schema({
    accountCode: {
        type: String,
    },
    requestUuid: {
        type: String,
    },
    songId: {
        type: Number,
        default: 0 
    },
    songName: {
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
    orderId: {
        type: Number,
        default: 0
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
    status: {
        type: Number,
        default: 0
    },
});

var SongsSubscription = mongoose.model('SongsSubscription', schema, 'SongsSubscriptions');

module.exports = { SongsSubscription };