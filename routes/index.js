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
		startDate : "2014/11/07 11:00",
		endDate : "2014/11/07 20:00"
}
/**
 * Candidates Data
 */
var candidates = {
		2800: {teamName : "Demo",
		       name     : "!*デモ*!",
		       title    : "デモ投票用",
		       img      : "/images/butoukai/demo.jpg"},
		2810: {teamName : "New Grads",
		       name     : "石倉、野々山、早川",
		       title    : "新卒課題",
		       img      : "/images/2014NewGrads/2014NewGrads.png"},
/*
		2720: {teamName : "LM",
		       name     : "近藤 洋未",
		       title    : "ここが変だよ日本人",
		       img      : "/images/butoukai/20141107/kondo.jpg"},
		2730: {teamName : "TS",
		       name     : "村田 名美枝",
		       title    : "Lamp for Local",
		       img      : "/images/butoukai/20141107/murata.png"},
		2740: {teamName : "ME",
		       name     : "中岡 亜優",
		       title    : "File API",
		       img      : "/images/butoukai/20141107/nakaoka.jpg"},
		2750: {teamName : "NSYS",
		       name     : "西澤 健太郎",
		       title    : "NASばるな、NASねば成らぬ",
		       img      : "/images/butoukai/20141107/nishizawa.png"},
		2760: {teamName : "RESEARCH",
		       name     : "前田 達也",
		       title    : "",
		       img      : "/images/butoukai/20141107/.jpg"},
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

//----------------------------------------------------------------------------------------------
//
//  /result_winner
//
// ----------------------------------------------------------------------------------------------
exports.result_winner = function(req, res){
	//-------------------------------------------------------------
	// defines
	//-------------------------------------------------------------
	var img = "";
	var condidateIds = [];
	for(var condidateId in candidates) {
		condidateIds.push(condidateId);
	}

	//-------------------------------------------------------------
	// Get Mongodb Connection Object
	//-------------------------------------------------------------
	var db = appJS.getMongoConnection();
	var User = db.model('User');

	//-------------------------------------------------------------
	// Execute Query( select id from users)
	//-------------------------------------------------------------
	User.find({id:{$in:condidateIds}},function(err,docs){
		if(err){
			throw err;
		}

		var id = condidateIds[0];
		var p_result = 0;
		if(docs[0] != "" && docs[0] !== undefined){
			docs.forEach(function(user){
				console.log(user);
				var winner = new User(user);
				p_result = winner.price;
				id = winner.id;
			});
		}

		//-------------------------------------------------------------
		// Call view page
		//-------------------------------------------------------------
		res.render('result_winner', {
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
