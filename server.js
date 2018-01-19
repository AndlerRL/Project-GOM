(function () {

    var express= require('express');
    var app= express();

    var server= require('http').createServer(app);
    var io= require('socket.io')(server);
    var redis= require('redis');
    var session= require('express-session');
    var RedisStore= require('connect-redis')(session);
    var passport= require('passport');
    var flash= require('connect-flash');
    var logger= require('morgan');
    var cookieParser= require('cookie-parser');
    var bodyParser= require('body-parser');
    var path= require('path');
    var _= require('lodash');
    var swig= require('swig');
    var multipart= require('connect-multiparty');
    var chalk = require('chalk'),
        warnings = chalk.bold.bgRed.whiteBright,
        adv = chalk.gray.bgWhite,
        notf = chalk.bgBlue.yellow;

    var users= [];

    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');

    app.set('view cache', false);       // Será necesario eliminarlo si quiero que el
    swig.setDefaults({ cache: false }); // usuario permanezca en línea o cambiar a true?

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
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

    passport.serializeUser((user, done)=> {
        console.log(adv('Serialize: ' + user));
        done(null, user);
    });

    passport.deserializeUser((obj, done)=> {
        console.log(adv('Deseralize: ' + obj));
        done(null, obj);
    });

    var routes= require('./routes/routes');
    var local= require('./connections/local');
    var twitter= require('./connections/twitter');
    // var facebook= require('./connections/facebook');

    routes(app, swig);   local(app);   twitter(app);   // facebook(app);

    io.sockets.on('connection', (socket)=> {
        console.log(notf('an user sign in... '));

        socket.on('disconnect', ()=> {
            console.log(notf('an user sign out... '));
        });

        socket.on('draw', (e)=> {
           io.sockets.emit('move', e);
        });
    });

    var port= Number(process.env.PORT || 8000);

    server.listen(port, ()=> {
        console.log(chalk.yellow('Running server at PORT:' + port));
        console.log(notf('Note: if an incoming IP address beginds with 192.168, it is a subnet address'));
    });
}());