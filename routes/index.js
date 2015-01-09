// ----------------------------------------------------------------------------------------------
//
//  requires
//
// ----------------------------------------------------------------------------------------------
var serviceTop = require('./services/top.js');
var viewIndex = require('./views/index.js');
var appJS = require('../app.js');


// ----------------------------------------------------------------------------------------------
//
//  defines
//
// ----------------------------------------------------------------------------------------------
/**
 * Android Application config
 */
var clientApplicationConfigs = {
		/**
		 * Room ID
		 * 1: NewSD1 Shinsaichi Budokai（新サ一武道会）
		 * 2: Allows LT
		 */
		roomId : 1,
		startDate : "2015/01/09 11:00",
		endDate : "2015/01/09 20:00"
}
/**
 * Candidates Data
 */
var candidates = {
		2900: {teamName : "Demo",
		       name     : "!*デモ*!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		2910: {teamName : "LM",
		       name     : "木村 正宏",
		       title    : "二重派遣ついに海外に行く",
		       img      : "/images/butoukai/20150109/kimura.gif"},
		2920: {teamName : "COM",
		       name     : "泉 千幸",
		       title    : "ずんずんずんずんしゅわー　～ポンコツいずみの大冒険～",
		       img      : "/images/butoukai/20150109/izumi.jpg"},
		2930: {teamName : "ME",
		       name     : "小西 雄三",
		       title    : "P2P UDP Hole Punching",
		       img      : "/images/butoukai/20150109/konishi.jpg"},
		2940: {teamName : "NSYS",
		       name     : "樫原 沙季",
		       title    : "むるんが",
		       img      : "/images/butoukai/20150109/kashihara.jpg"},
		2950: {teamName : "RESEARCH",
		       name     : "前田 達也",
		       title    : "サーフィンとGD",
		       img      : "/images/butoukai/20150109/maeda.jpg"},
		2960: {teamName : "TS",
		       name     : "川原 英明",
		       title    : "アジャイルクエストⅢ　そして伝説へ…",
		       img      : "/images/butoukai/20150109/kawahara.jpg"},
}

// ----------------------------------------------------------------------------------------------
//
//  /index
//
// ----------------------------------------------------------------------------------------------
exports.index = function(req, res){
	var contextTop = {};
	var resultTop = serviceTop.doTop(contextTop);

	var viewContext = {};
	viewIndex.do(req, res, viewContext);
};


// ----------------------------------------------------------------------------------------------
//
//  /list
//
// ----------------------------------------------------------------------------------------------
exports.list = function(req, res){
	res.render('partials/list', {
		candidates: candidates
	});
}


// ----------------------------------------------------------------------------------------------
//
//  /search
//
// ----------------------------------------------------------------------------------------------
exports.search = function(req, res){
	res.render('search');
}


// ----------------------------------------------------------------------------------------------
//
//  /detail
//
// ----------------------------------------------------------------------------------------------
exports.detail = function(req, res){

	//-------------------------------------------------------------
	// defines
	//-------------------------------------------------------------
	var img = "";
	var id = req.param("id");
	if(id == "" || id === undefined ){
		id = "10"
	}

	//-------------------------------------------------------------
	// Get Mongodb Connection Object
	//-------------------------------------------------------------
	var db = appJS.getMongoConnection();
	var User = db.model('User');

	//-------------------------------------------------------------
	// Execute Query( select id from users)
	//-------------------------------------------------------------
	User.find({id:id},function(err,docs){
		if(err){
			throw err;
		}

		var p_result;

		if(docs[0] == "" || docs[0] === undefined ){
			p_result = 0;
		}else{
			p_result = new User(docs[0]).price;
		}

		//-------------------------------------------------------------
		// Call view page
		//-------------------------------------------------------------
		res.render('detail', {
			teamName:    candidates[id]["teamName"],
			title:   candidates[id]["title"],
			name:    candidates[id]["name"],
			get_img: candidates[id]["img"],
			get_price: p_result,
			get_id: id
		});
	});
};


// ----------------------------------------------------------------------------------------------
//
//  /api_10_userlist_show
//
// ----------------------------------------------------------------------------------------------
exports.api_10_userlist_show = function(req, res){
	var result = {
		status: {
			code: 200,
			messages: null,
			version: "1.0"
		},
		items: []
	};
	for(var id in candidates) {
		result["items"].push({
			userId    : id,
			roomId    : clientApplicationConfigs["roomId"],
			startDate : clientApplicationConfigs["startDate"],
			endDate   : clientApplicationConfigs["endDate"],
			name      : candidates[id]["name"],
			group     : candidates[id]["team"],
			title     : candidates[id]["title"],
			imageUrl  : "http://gcups.c.node-ninja.com" + candidates[id]["img"],
		});
	}
	res.charset = 'utf-8';
	res.contentType('application/json');
	res.end(JSON.stringify(result));
}

// ----------------------------------------------------------------------------------------------
//
//  Advirtise
//
// ----------------------------------------------------------------------------------------------
exports.ad_lm_sports_club = function(req, res){
	res.render('ad');
}
