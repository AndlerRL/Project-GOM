var User= require('../models/user'),
fs= require('fs'),
uniqid= require('uniqid');
var chalk = require('chalk'),
    warnings = chalk.bold.bgRed.whiteBright,
    adv = chalk.gray.bgWhite,
    notf = chalk.bgBlue.yellow;


exports.registry= (req, res, next)=> {
    var user= new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        user: req.body.user,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    if (user.password == user.passwordConfirm) {
        user.save((err, user) => {
            if (!err) {
                res.status(201);
                next();
            } else {
                res.status(400);
                res.send(notf('Something wrong happened when creating user...'));
            }
        });
    } else {
        res.send({message: 'Password does not match. Refreshing site...'});
        console.log(chalk.warnings('Password does not match. Refreshing...'));
        res.redirect('/registry');
        (()=> {
            $("#msgError").text('<p>Password does not match... Try again, buddy.</p>');
        });
    } 
}

exports.loadImg= (req, res, next)=> {
    try {
        var imgPath= '',
        galleryPath= __dirname + '/../public/gallery/',
        extension= '.' + req.files.inpUpload.originalFilename.split('.')[1];
        imgPath= galleryPath + uniqid() + extension;
        tmpFile= req.files.inpUpload.path;

        var writeStream= fs.createWriteStream(imgPath);
        var readStream= fs.createReadStream(tmpFile);
        readStream.pipe(writeStream);
        res.status(201);
        next();        
    } catch (err) {
        res.status(400);
        res.send('An error occur at time to load file: ' + err);
    }
};

