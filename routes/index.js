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
		startDate : "2014/01/10 00:00",
		endDate : "2014/01/10 23:59"
}
/**
 * Condidates Data
 */
var candidates = {
		1700: {teamName : "Demo",
		       name     : "!*デモ*!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		1710: {teamName : "Guest",
		       name     : "鴇田 大岳",
		       title    : "About Rakuten Mart",
		       img      : "/images/butoukai/20140110/tokita.jpg"},
		1720: {teamName : "NSYS",
		       name     : "三浦 憲太郎",
		       title    : "一助になれば",
		       img      : "/images/butoukai/20140110/miura.jpg"},
		1730: {teamName : "LM",
		       name     : "長谷川 剛",
		       title    : "画像から夢を拾う",
		       img      : "/images/butoukai/20140110/hasegawa.jpg"},
		1740: {teamName : "COM",
		       name     : "杉浦 健治",
		       title    : "会社を辞める前に思い出して欲しいコト",
		       img      : "/images/butoukai/20140110/sugiura.jpg"},
		1750: {teamName : "ME",
		       name     : "木下 和俊",
		       title    : "駆逐してやる（JSを）",
		       img      : "/images/butoukai/20140110/kinoshita.jpg"},
		1760: {teamName : "TS",
		       name     : "道川 雅嘉",
		       title    : "Let's Smart!",
		       img      : "/images/butoukai/20140110/michikawa.jpg"},
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
