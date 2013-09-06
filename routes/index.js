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
		startDate : "2013/09/06 12:00",
		endDate : "2013/09/06 23:59"
}
/**
 * Condidates Data
 */
var candidates = {
		1300: {teamName : "Demo",
		       name     : "!デモ!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		1310: {teamName : "Guest",
		       name     : "松江 宏樹",
		       title    : "ハッカソンのすすめ",
		       img      : "/images/butoukai/20130906/matsue.png"},
		1320: {teamName : "COM",
		       name     : "小松 真",
		       title    : "アプリのレビュー解析",
		       img      : "/images/butoukai/20130906/komatsu.jpg"},
		1330: {teamName : "ME",
		       name     : "紙谷 知弘",
		       title    : "ぱいぱい。",
		       img      : "/images/butoukai/20130906/kamitani.jpg"},
		1340: {teamName : "NSYS",
		       name     : "齋藤 淳",
		       title    : "Introduction of Oracle Exadata Platform",
		       img      : "/images/butoukai/20130906/saito.jpg"},
		1350: {teamName : "LM",
		       name     : "及部 敬雄",
		       title    : "Confluenceを救う会",
		       img      : "/images/butoukai/20130906/oyobe.jpg"},
		1360: {teamName : "TS",
		       name     : "川原 英明",
		       title    : "30周年だからこそ、あの事を語ろう！<br>～素晴らしきムダ知識～",
		       img      : "/images/butoukai/20130906/kawahara.jpg"},
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
