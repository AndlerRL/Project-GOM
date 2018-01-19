var model= require('./model'),
Schema= model.Schema,
Objectid= Schema.ObjectId;

var userSchema= new Schema({
    name: String,
    user: {
        type: String,
        unique: true
    },
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    passwordConfirm: String,
    active: {
        type: Boolean,
        default: true,
        required: true
    },
    lastUpdateBy: {
        type: String,
        required: true,
        default: 'System'
    },
    lastUpdateDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true
    },
    _parent: Objectid,
    twitter: Schema.Types.Mixed,
    // facebook: Schema.Types.Mixed,
});

var User= model.model('User', userSchema, 'user_session');

/*
db.user_session.createIndex({
    lastUpdateDate: 1, email_1: 1, email: 1
    }, {
        partialFilterExpression: {
            'email_1': { $eq: null }
        }
});
*/

module.exports= User;