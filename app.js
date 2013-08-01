// ----------------------------------------------------------------------------------------------
//
//  requires
//
// ----------------------------------------------------------------------------------------------
var express = require('express')
  , routes  = require('./routes')
  , http    = require('http');
var app = express(); 
//var app = module.exports = express.createServer();


// ----------------------------------------------------------------------------------------------
//
//  Configration
//
// ----------------------------------------------------------------------------------------------
app.configure(function(){
	app.set('port', process.env.VCAP_APP_PORT || 80);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

//app.configure('development', function(){
//	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//});

app.configure('production', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
//app.get('/app', routes.app);
app.get('/detail/', routes.detail);
app.get('/list/', routes.list);
app.get('/search/', routes.search);

/**
 * Create serve.
 *
 */
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// ----------------------------------------------------------------------------------------------
//
//  define  :  Create Mongo Connection
//
// ----------------------------------------------------------------------------------------------
var mongoose = require('mongoose');
var Schema     = mongoose.Schema;

var UserSchema = new Schema({
	id: { type: String, unique: true },
	price: Number
});

mongoose.model('User', UserSchema);

var db = mongoose.createConnection('mongodb://localhost/gcup_db');
var User = db.model('User');


// ----------------------------------------------------------------------------------------------
//
// method  :  MongoDB Connection getMethod
//
// ----------------------------------------------------------------------------------------------
exports.getMongoConnection = function() {
	console.log(" ---------------- call  getMongoConnection  ------------------------- ");
	return db;
}


// ----------------------------------------------------------------------------------------------
//
// action    :   Socket actions (/detail)
//
// ----------------------------------------------------------------------------------------------

	var io = require('socket.io').listen(server);
	io.sockets.on('connection', function (socket) {

		//----------------------------------------------------------------------------------
		// call "price.add" from client side
		//----------------------------------------------------------------------------------
		socket.on('price.add', function(price_data) {
console.log(price_data.id);
					//-------------------------------------------------------------
					// Get data from client send data
					//-------------------------------------------------------------
					var id = price_data.id
					var price = price_data.selectmenu1;
					if(id == "" || id === undefined ){
						id = "10"
					}

			//-------------------------------------------------------------
			// Execute Query( update id  users)
			// ex  :  db.gcup_db.update({"id":"10"},{$inc :{"price":500 } } );
			//-------------------------------------------------------------
			User.update({id:id},{$inc :{price:price}},{upsert:true, multi:true},function(err){
					if(err){
						console.log(err);
					}

					//-------------------------------------------------------------
					// Execute Query( select id from users)
					// ex  :  db.gcup_db.find({"id":"10"} );
					//-------------------------------------------------------------
					User.find({id:id},function(err,docs){
						if(err){
							throw err;
						}

					var p_result;
					if(docs[0] == "" || docs[0] === undefined ){
						p_result = 0;
					}else{
						p_result = docs[0].price;
					}

					//-------------------------------------------------------------
					//  Send price data to client
					//-------------------------------------------------------------
					socket.emit('price.push', {
						id:id,
						count:p_result
					});


					//-------------------------------------------------------------
					//  Send price data to broadcast
					//-------------------------------------------------------------
					socket.broadcast.emit('price.push', {
						id:id,
						count:p_result
					});

				});

			});

		});


		//----------------------------------------------------------------------------------
		// call "data.add" from client side
		//----------------------------------------------------------------------------------
		socket.on('data.add', function(data) {
			socket.emit('data.add', data);
			socket.broadcast.emit('data.add', data);
		});


		//----------------------------------------------------------------------------------
		// call "disconnect" from client side
		//----------------------------------------------------------------------------------
		socket.on('disconnect', function() {
			delete socket.id;
		});

	});


// ----------------------------------------------------------------------------------------------
//
// daemonモジュール読み込み
//
// ----------------------------------------------------------------------------------------------
// Node.jsをデーモン化する
// fsで開いたファイルにNode.jsのログが出力される。
/*
var daemon = require('daemon');
fs = require('fs');
fs.open('/var/log/node.log', 'w+', function (err, fd) {
	// デーモン化開始
	daemon.start(fd);
	// プロセスIDを指定ファイルに書き出す
	daemon.lock('/tmp/node.pid');
});
*/

