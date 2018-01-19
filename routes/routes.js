var user= require('../controllers/user'),
fs= require('fs'),
swig= require('swig');
var chalk = require('chalk'),
    warnings = chalk.bold.bgRed.whiteBright,
    adv = chalk.gray.bgWhite,
    notf = chalk.bgBlue.yellow;

// Rasteando ip_address

var express = require('express');
var app = express();

var os = require('os');
var ifaces = os.networkInterfaces();
var listen_addr = null;

app.set('trust proxy', true);

// Terminando de rastear ip...

var routes= (app)=> {
    app.get('/error', (req, res)=> {
        swig.renderFile(__dirname + '/../views/error.html');
    });

    app.get('/', (req, res)=> {
        res.render('index');
        console.log(warnings('::Incoming Connection::'));
        console.log(adv('remoteAddress method: ') + req.connection.remoteAddress);
        console.log(adv('req.ips (x-forwarded-for) header method: ') + req.ips);
    });

    app.get('/login', (req, res)=> {
        res.render('login');
        console.log(warnings('::Incoming Connection::'));
        console.log(adv('remoteAddress method: ') + req.connection.remoteAddress);
        console.log(adv('req.ips (x-forwarded-for) header method: ') + req.ips);
    });
    
    app.get('/registry', (req, res)=> {
        res.render('registry');
        console.log(warnings('::Incoming Connection::'));
        console.log(adv('remoteAddress method: ') + req.connection.remoteAddress);
        console.log(adv('req.ips (x-forwarded-for) header method: ') + req.ips);
    });
    
    app.get('/gallery', (req, res) => {
        var imgs= [];
        fs.readdir(__dirname + '/../public/gallery/', (err, files)=> {
            if (!err) {
                for (var i= 0; i < files.length; i++) {
                    imgs.push('/gallery/' + files[i]);
                }
            } else { console.log(err); }
        });

        swig.renderFile(__dirname + '/../views/gallery.html', {
            user: req.session.passport.user.name,
            imgs: imgs
        },
        (err, output)=> {
            if (err) { throw err; }
            res.send(output);
            res.end();
        });

        console.log(warnings('::Incoming Connection::'));
        console.log(adv('remoteAddress method: ') + req.connection.remoteAddress);
        console.log(adv('req.ips (x-forwarded-for) header method: ') + req.ips);
    });
    
    app.get('/editor', (req, res) => {
        console.log(warnings('::Incoming Connection::'));
        console.log(adv('remoteAddress method: ') + req.connection.remoteAddress);
        console.log(adv('req.ips (x-forwarded-for) header method: ') + req.ips);
    });

    app.get('/upload', (req, res)=> {
        swig.renderFile(__dirname + '/../views/upload.html', {
            user: req.session.passport.user.name
        },
        (err, output)=> {
            if (err) { throw err; }
            res.send(output);
            res.end();
        });

        console.log(warnings('::Incoming Connection::'));
        console.log(adv('remoteAddress method: ') + req.connection.remoteAddress);
        console.log(adv('req.ips (x-forwarded-for) header method: ') + req.ips);
    });

    app.post('/upload', user.loadImg, (req, res)=> {
        res.redirect('gallery');
    })

    app.post('/editor', (req, res) => {
        swig.renderFile(__dirname + '/../views/editor.html', {
            idImg: req.body.idImg,
            user: req.session.passport.user.name
        },
        (err, output)=> {
            if (err) { throw err; }
            res.send(output);
            res.end();
        });
    });

    app.post('/registry', user.registry, (req, res) => {
        res.redirect('login');
    });

    Object.keys(ifaces).forEach((ifname) => {
        var alias = 0;

        ifaces[ifname].forEach((iface) => {
            if ('IPv4' !== iface.family || iface.internal !== false) { return; }
            if (alias >= 1) {
                listen_addr = iface.address;
                console.log(chalk.yellow('Listening on ' + ifname + alias, iface.address + ':' + '8000'));
            } else {
                listen_addr = iface.address;
                console.log(chalk.yellow('Listening on ' + iface.address + ':' + '8000'));
            }

            alias++
        });
    });
};

module.exports= routes;