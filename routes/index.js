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
	810:"Guest",
	820:"COM",
	830:"ME",
	840:"TS",
	850:"NSYS",
	860:"LM",
};

var textList = {
	810:"Yuki Tanaka",
	820:"Kawasaki Aoi<br>Izumi Chiyuki<br>Otsuka Reina",
	830:"Nozomi Yamawaki<br>Keiko Saito",
	840:"Namie Murata",
	850:"Kanako Nakai",
	860:"Wen Ting",
};

var titleList = {
	810:"RIT introduction",
	820:"だって女の子なんだもん",
	830:"Infoseek Single Sign On",
	840:"不動産と負荷試験",
	850:"nsys-dba 近況報告",
	860:"ブランド座談",
};

var imgList = {
	810:"/images/butoukai/20130705/tanaka.jpg",
	820:"/images/butoukai/20130705/kawasaki.jpg",
	830:"/images/butoukai/20130705/yamawaki_saito.jpg",
	840:"/images/butoukai/20130705/murata.jpg",
	850:"/images/butoukai/20130705/nakai.jpg",
	860:"/images/butoukai/20130705/wen.jpg",
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
