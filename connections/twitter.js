var passport= require('passport'),
passportTwitter= require('passport-twitter'),
TwitterStrategy= passportTwitter.Strategy;

var User= require('../models/user');

var twitterConnection= (app)=> {
    passport.use(
        new TwitterStrategy({
            consumerKey: 'QodwuCsUfuWTpJTbH7Aa1O5Tl',
            consumerSecret: 'EL3v7e7RHkTDr961Hx00UsmZK8vLPJeGluRjSyOL2YaGOoNQff',
            callbackURL: 'http://127.0.0.1:8000/auth/twitter/callback'
        },
        (token, tokenSecret, profile, done)=> {
            User.findOne({
                'twitter.id': profile.id
            },
            (err, user)=> {
                if (err) { return done(err); }
                if (!user) { var user= new User({
                    username: profile.username,
                    twitter: profile
                });
                var data= JSON.stringify(eval("(" + profile._raw + ")"));
                user.name= JSON.parse(data).name;
                
                user.save((err, user)=> {
                    if (err) { done(err, null); return; }
                    done(null, user);
                });
            } else { return done(err, user); }
            });
        })
    );

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/gallery',
        failureRedirect: '/error'
    }));
};

module.exports= twitterConnection;