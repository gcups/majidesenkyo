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
		startDate : "2015/03/06 11:00",
		endDate : "2015/03/06 20:00"
}
/**
 * Candidates Data
 */
var candidates = {
		3100: {teamName : "Demo",
		       name     : "!*デモ*!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		3110: {teamName : "COM",
		       name     : "皆川 かほり",
		       title    : "おもいでの西新宿",
		       img      : "/images/butoukai/20150306/minagawa.jpg"},
		3120: {teamName : "RS",
		       name     : "谷 幸夫",
		       title    : "Research-Agile Introduction Report",
		       img      : "/images/butoukai/20150306/tani.jpg"},
		3130: {teamName : "ME",
		       name     : "中村 圭吾",
		       title    : "一人エンジニアリングのススメ～みん調編～",
		       img      : "/images/butoukai/20150306/nakamura.png"},
		3140: {teamName : "TS",
		       name     : "平井 一馬",
		       title    : "ブラウザでプレゼン",
		       img      : "/images/butoukai/20150306/hirai.jpg"},
		3150: {teamName : "LM",
		       name     : "野口 亮",
		       title    : "カナダでプレゼンの準備してたらカフェラテこぼした",
		       img      : "/images/butoukai/20150306/noguchi.jpg"},
/*
		2960: {teamName : "TS",
		       name     : "川原 英明",
		       title    : "アジャイルクエストⅢ　そして伝説へ…",
		       img      : "/images/butoukai/20150109/kawahara.jpg"},
*/
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
