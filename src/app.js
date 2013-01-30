/*!
 * robe-and-wizard-hat
 * Copyright(c) 2012 Jeremy Williams
 * MIT Licensed
 */

/*
 * node application configures starts and controls the node server application
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , io =   require('socket.io')
  , connect = require('connect')
  , _ = require('underscore')
  , cookie = require('express/node_modules/cookie')
  , nconf = require('nconf');
var Session = require('connect').middleware.session.Session;
var app = express();
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();
//require the configuration and include the nconf properties
require('./configuration');
var secretPhrase = nconf.get('SecretPhrase');

app.configure('all', configureApp);
function configureApp() {
    app.set('port', nconf.get('PORT'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(secretPhrase));
    app.use(express.session({cookie: {httpOnly: "true"},
        store: sessionStore,
        secret: secretPhrase
    }));
    app.use(app.router);
    // use the less from bootstrap that is pulled down from jamjs
    // a copy of the style.less and variables less are included in src/less
    app.use(require('less-middleware')({
        dest: __dirname + '/public/css',
        src: __dirname + '/src/less',
        paths: __dirname + '/public/js/libs/bootstrap/less',
        prefix: '/css',
        compress: false }));
    app.use(express.static(path.join(__dirname, 'public')));    
}

app.configure('development', function(){
  app.use(express.errorHandler());
});
// when the index is called check for an existing session and do any
// needed session work here
app.get('/', function(req, res){
    //setting a random value just for demo remove this
    if(!req.session.myval)
        req.session.myval = Math.floor(Math.random()*1000);
    res.render('index', {title:nconf.get('ApplicationTitle')});
});

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
// start socket.io listener
var sio = io.listen(httpServer);

// this sync's up the socket code for a good description of what's happening here refer to
// http://www.danielbaulig.de/socket-ioexpress/ this code is slightly different to handle the current
// version of express
sio.set('authorization', function (data, accept) {
    console.log('socket authorization function ');
    if (data.headers.cookie) {
        data.cookie = connect.utils.parseSignedCookies(cookie.parse(decodeURIComponent(data.headers.cookie)), secretPhrase);
        data.sessionID = data.cookie['connect.sid'];
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session){
            if(session){
                session = new express.session.Session({sessionStore: sessionStore, sessionID: data.sessionID}, session);
            }
            if(err || !session){
               return accept(err, false);
            }else{
                data.session = new Session(data, session);
                return accept(null, true);
            }
        })
    } else {
        accept('No cookie transmitted.', false);
    }
});
sio.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    //handle a ping request, get some values from the session emit a response example code remove
    socket.on('ping', function(){
        hs.session.reload( function () {
            hs.session.touch().save();
            socket.emit('serverResponse', {ResponseType: "PING",
                                           Connections : _.keys(sio.connected).length,
                                           ResponseTime:new Date().getTime(),
                                           Message: "Random Memory Store number : " + hs.session.myval});
        });
    });
    // handle logout requests from the client  example code remove
    socket.on('logout', function(){
        hs.session.destroy();
        socket.disconnect();
    });
});