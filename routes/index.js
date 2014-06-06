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
		startDate : "2014/06/06 12:00",
		endDate : "2014/06/06 19:30"
}
/**
 * Condidates Data
 */
var candidates = {
		2200: {teamName : "Demo",
		       name     : "!*デモ*!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		2210: {teamName : "COM",
		       name     : "八巻 裕之",
		       title    : "最近スゴイなと思ったこと",
		       img      : "/images/butoukai/20140606/yamaki.jpg"},
		2220: {teamName : "NSYS",
		       name     : "清水 裕平",
		       title    : "Racoon2 の紹介",
		       img      : "/images/butoukai/20140606/shimizu_yuhei.jpg"},
		2230: {teamName : "Research",
		       name     : "椛澤 嘉弘",
		       title    : "新卒とテストと自動化",
		       img      : "/images/butoukai/20140606/kabasawa.jpg"},
		2240: {teamName : "ME",
		       name     : "当麻 真悟",
		       title    : "ぱむちょむ　あぽろじゃいず",
		       img      : "/images/butoukai/20140606/toma.jpg"},
		2250: {teamName : "TS",
		       name     : "下地 玄継",
		       title    : "ひ・み・つ♪",
		       img      : "/images/butoukai/20140606/shimoji.png"},
		2260: {teamName : "LM",
		       name     : "盧 迪",
		       title    : "Cross Culture",
		       img      : "/images/butoukai/20140606/lu.jpg"},
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
