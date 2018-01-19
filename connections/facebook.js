var passport= require('passport'),
passportFacebook= require('passport-facebook'),
FacebookStrategy= passportFacebook.Strategy;

var User= require('../models/user');

var facebookConnection= (app)=> {
    passport.use(new FacebookStrategy({
        clientID: '162496234385018',
        clientSecret: 'fcdb3bae5657ce389ff29aba0ceb631a',
        callbackURL: 'http://localhost:8000/login/auth/facebook/callback'
    },
    (token, tokenSecret, profile, done)=> {
        User.findOne({
            'facebook.id': profile.id
        },
        (err, user) => {
            if (err) { return done(err, user); }
            if (!user) {
                var user= new User({
                    username: profile.username,
                    facebook: profile
                });

                var data= JSON.stringify(eval("(" + profile._raw + ")"));
                user.name= JSON.parse(data).name;

                user.save((err, user)=> {
                    if (err) { done(err, null); return; }
                    done(null, user);
                });
            } else { return done(err, user); }
        });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/gallery',
        failureRedirect: '/error'
    }));
};

module.exports= facebookConnection;