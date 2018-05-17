(function () {

    const express = require('express'),
        app = express(),

        server = require('http').createServer(app),
        io = require('socket.io')(server),
        redis = require('redis'),
        session = require('express-session'),
        RedisStore = require('connect-redis')(session),
        passport = require('passport'),
        flash = require('connect-flash'),
        logger = require('morgan'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        path = require('path'),
        _ = require('lodash'),
        swig = require('swig'),
        multipart = require('connect-multiparty'),
        chalk = require('chalk'),
        warnings = chalk.bold.bgRed.whiteBright,
        adv = chalk.gray.bgWhite,
        notf = chalk.bgBlue.yellow;

    const users = [];

    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');

    app.set('view cache', false);       // Será necesario eliminarlo si quiero que el
    swig.setDefaults({ cache: false }); // usuario permanezca en línea o cambiar a true?

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(session({
        store: new RedisStore({}),
        secret: 'Final App with NodeJS and components',
        resave: true,
        saveUninitialized: true,
    }));

    app.use(multipart());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    passport.serializeUser((user, done) => {
        console.log(adv('Serialize: ' + user));
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        console.log(adv('Deseralize: ' + obj));
        done(null, obj);
    });

    routes = require('./routes/routes'),
        local = require('./connections/local'),
        twitter = require('./connections/twitter'),
        facebook = require('./connections/facebook'),

        routes(app, swig); local(app); twitter(app); facebook(app);

    io.sockets.on('connection', (socket) => {
        console.log(notf('an user sign in... '));

        socket.on('disconnect', () => {
            console.log(notf('an user sign out... '));
        });

        socket.on('draw', (e) => {
            io.sockets.emit('move', e);
        });
    });

    port = Number(process.env.PORT || 3030),

        server.listen(port, () => {
            console.log(chalk.yellow('Running server at PORT:' + port));
            console.log(notf('Note: if an incoming IP address beginds with 192.168, it is a subnet address'));
        });
}());