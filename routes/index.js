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
var teamList = {
	610:"Guest",
	620:"TS",
	630:"NSYS",
	640:"COM",
	650:"LM",
	660:"ME",
};

var textList = {
	610:"大貝 滝あさん",
	620:"趙 紫剣さん",
	630:"関戸 卓さん",
	640:"市原 大介さん<br>鱒渕 勝幸さん",
	650:"Rishab Mahajanさん",
	660:"小西 雄三さん",
};

var titleList = {
	610:"リサーチのサービスとシステムの紹介（仮）",
	620:"並行処理について（仮）",
	630:"<span style=\"text-decoration: line-through\">ハッカーと走者</span><br>ハッカーと歩者",
	640:"パズドラの話（仮）",
	650:"If you don't OpenSource, You are writing SHIT",
	660:"パンドラの箱<br>　～禁断の箱を開けた時～",
};

var imgList = {
	610:"/images/butoukai/20130607/ogai.png",
	620:"/images/butoukai/20130607/zhao.png",
	630:"/images/butoukai/20130607/sekido.jpg",
	640:"/images/butoukai/20130607/ichihara.jpg",
	650:"/images/butoukai/20130607/rish.jpg",
	660:"/images/butoukai/20130607/konishi.jpg",
};


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
		img:   imgList,
		team:  teamList,
		title: titleList,
		text:  textList
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
			team:    teamList[id],
			title:   titleList[id],
			text:    textList[id],
			get_img: imgList[id],
			get_price: p_result,
			get_id: id
		});
	});
};
