var passport= require('passport'),
passportLocal= require('passport-local'),
LocalStrategy= passportLocal.Strategy;

var User= require('../models/user');
var localConnection= (app)=> {
    passport.use('user', new LocalStrategy({
        usernameField: 'user',
        passwordField: 'password'
    },
    (username, password, done)=> {
        console.log('User: '+ username);
        console.log('Password: ' + password);
       User.findOne({user: username}, (err, user)=> {
           console.log('[ERROR]: ' + err);
           if (err) { return done(err); }
           if (!user) { return done(null, false, {
               message: '[ERROR] Incorrect Username.'
            }); } else { if (user.password != password) {
                return done(null, false, {
                    message: '[ERROR] Incorrect Password.'
                });
            } else { return done(null, user); } }
       });
    }));

    app.post('/login', passport.authenticate('user', {
        successRedirect: '/gallery',
        failureRedirect: '/error',
        failureFlash: '[ERROR] Wrong User or Password.'
    }));
};

module.exports= localConnection;