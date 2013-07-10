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
	750:"Demo",
	760:"Xuebin Ma",
	770:"Miki Matsumoto",
	780:"Hirobumi Takahashi",
};

var textList = {
	750:"(DEMO)",
	760:"(DAD)",
	770:"(BDD)",
	780:"(DAD)",
};

var titleList = {
	750:"Demo",
	760:"Shared&nbsp;Jenkins",
	770:"Lone-wolf&nbsp;Jenkins",
	780:"Shared&nbsp;Bamboo",
};

var imgList = {
	750:"/big_data/20130710/images/demo.jpg",
	760:"/big_data/20130710/images/01_jenkins_shared.jpg",
	770:"/big_data/20130710/images/02_jenkins_lonewolf.jpg",
	780:"/big_data/20130710/images/03_bamboo_shared.jpg",
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
