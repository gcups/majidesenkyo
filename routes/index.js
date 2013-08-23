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
		roomId : 2
}
/**
 * Condidates Data
 */
var candidates = {
		1200: {teamName : "",
		       name     : "デモ",
		       title    : "デモ投票",
		       img      : "/images/butoukai/demo.jpg"},
		1210: {teamName : "",
		       name     : "長谷川 剛",
		       title    : "どうだったの？ネット選挙",
		       img      : "/allows/20130823_lt/1_hasegawa.jpg"},
		1220: {teamName : "",
		       name     : "新倉 直明",
		       title    : "社会人として必要な知識持ってますか？",
		       img      : "/allows/20130823_lt/2_nikura.jpg"},
		1230: {teamName : "",
		       name     : "大森 翔太",
		       title    : "窓8はそんなに悪くない",
		       img      : "/allows/20130823_lt/3_omori.png"},
		1240: {teamName : "",
		       name     : "宮崎 剛太",
		       title    : "「夏休み 自由研究」 6年2組 みやざきごうた",
		       img      : "/allows/20130823_lt/4_miyazaki.jpg"},
		1250: {teamName : "",
		       name     : "青木 健浩",
		       title    : "FlashAirで遊ぼう ～ 夏休みの自由研究",
		       img      : "/allows/20130823_lt/5_aoki.png"},
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
			team:    candidates[id]["teamName"],
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
			userId   : id,
			roomId   : clientApplicationConfigs["roomId"],
			name     : candidates[id]["name"],
			group    : candidates[id]["team"],
			title    : candidates[id]["title"],
			imageUrl : "http://gcups.c.node-ninja.com" + candidates[id]["img"],
		});
	}
	res.charset = 'utf-8';
	res.contentType('application/json');
	res.end(JSON.stringify(result));
}
