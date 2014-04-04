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
		startDate : "2014/04/04 00:00",
		endDate : "2014/04/04 23:59"
}
/**
 * Condidates Data
 */
var candidates = {
		2000: {teamName : "Demo",
		       name     : "!*デモ*!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		2010: {teamName : "Guest",
		       name     : "涌井 雅俊",
		       title    : "思い出にふける",
		       img      : "/images/butoukai/20140404/wakui.jpg"},
		2020: {teamName : "NSYS",
		       name     : "川俣 彰裕",
		       title    : "Kawamata dark side - To get 1st on Budoukai -",
		       img      : "/images/butoukai/20140404/kawamata.jpg"},
		2030: {teamName : "LM",
		       name     : "福田 健仁",
		       title    : "イリュージョン",
		       img      : "/images/butoukai/20140404/amano.jpg"},
		2040: {teamName : "ME",
		       name     : "小西 雄三",
		       title    : "プロジェクトＸ～挑戦者たち～",
		       img      : "/images/butoukai/20140404/konishi.jpg"},
		2050: {teamName : "COM",
		       name     : "佐伯 亮",
		       title    : "愛すべき運用について",
		       img      : "/images/butoukai/20140404/saeki.jpg"},
		2060: {teamName : "TS",
		       name     : "赤穂 真幸",
		       title    : "CGI and beyond",
		       img      : "/images/butoukai/20140404/ako.jpg"},
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
