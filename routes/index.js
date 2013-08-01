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
	920:"ME",
	930:"NSYS",
	940:"COM",
	950:"TS",
	960:"LM",
};

var textList = {
	920:"当麻 真悟",
	930:"佐藤 寛貴",
	940:"松嶋 克仁",
	950:"大西 信寛",
	960:"田浦 康一",
};

var titleList = {
	920:"INTRO NEKO",
	930:"NSYS 戻ってきたお<br>（´・ω・｀）<br>-僕はNSYS命ですよ （棒）-",
	940:"マジで総選挙<br>Androidネイティブアプリ",
	950:"安西先生、<br>エルミートやばいです",
	960:"進撃の巨人<br>(attack on taulin)",
};

var imgList = {
	920:"/images/butoukai/20130802/toma.jpg",
	930:"/images/butoukai/20130802/sato.gif",
	940:"/images/butoukai/20130802/matsushima.jpg",
	950:"/images/butoukai/20130802/onishi.jpg",
	960:"/images/butoukai/20130802/taura.jpg",
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
