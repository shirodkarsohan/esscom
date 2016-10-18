var express = require('express');
var nodemailer = require("nodemailer");
var multer  = require('multer')
var smtpTransport = require("nodemailer-smtp-transport")
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'./')));
//app.use(express.static(path.join(__dirname,'downloads')));

app.use('/', routes);
app.use('/users', users);

var upload = multer({ dest: 'uploads/' });
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var transporter = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : "sohan.gec@gmail.com",
        pass : "gmail21051995."
    }
}));
var file;

/* app.get('/download',function(req,res){
	console.log("Download request for "+req.query.file);

	res.download('downloads/'+req.query.file,function(err){
		if( err ){
			console.log("Download failed");
		} 
		else{
			console.log("No error while downloading");
		}
	});
}); */
app.post('/upload',upload.single('file'),function(req,res){
	console.log("Uploading file.. in /post");
	console.log(req.file);
	
	file = req.file;
	res.send("Success");
});
app.post('/send',function(req,res){
	console.log("On server received query to send email");
    console.log("Request body is...");
	console.log(req.body);
	
	if( file == null ){
		var mailOptions={
			from: 'sohan.gec@gmail.com',
			to : 'sohan.gec@gmail.com',
			subject : 'EssCom Query',
			text : "Name: "+req.body.name+"\nContact: "+req.body.phone+"\nEmail: "+req.body.email+"\nBusiness: "+req.body.business+"\n\n\n\nQuery:\n\n"+req.body.query
		}
	}
	else{
		var mailOptions={
			from: 'sohan.gec@gmail.com',
			to : 'sohan.gec@gmail.com',
			subject : 'EssCom Query',
			text : "Name: "+req.body.name+"\nContact: "+req.body.phone+"\nEmail: "+req.body.email+"\nBusiness: "+req.body.business+"\n\n\n\nQuery:\n\n"+req.body.query,
			attachments: [
			{   // utf-8 string as an attachment
				filename: file.originalname,
				path: file.path,
				contentType : file.mimetype
			}]
		}
	}
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            res.send("error");
        }
        else{
			file = null;
            res.send("sent");
         }
    }); 
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.listen(3000, function () {
  console.log('Express Server listening on port 3000!');
});

module.exports = app;
