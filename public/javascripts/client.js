$(function(){
	var domain = location.hostname;
	var socket = io.connect(domain);
	socket.on('connect', function() {
		console.log('connected cliant.js')
		// data
		socket.on('data.add', function (data) {
			console.log(data.name);
			console.log(data.message);
			var yyyy = new Date().getFullYear();
			var mm = new Date().getMonth();
			var dd = new Date().getDay();
			var hh = new Date().getHours();
			var ss = new Date().getMinutes();

			// UserImage
			var userImg = "noimage.gif";
			if(data.name == "兼常" ){
				userImg = "kanetsunesan.jpg";
			}else if(data.name == "小西" ){
				userImg = "konitan.jpg";
			}else if(data.name == "松嶋" ){
				userImg = "matwu-.jpg";
			}else if(data.name == "尾崎" ){
				userImg = "osaki.jpg";
			}else if(data.name == "濱野" ){
				userImg = "hamanosan.jpg";
			}else if(data.name == "大石" ){
				userImg = "ooishisan.jpg";
			}else if(data.name == "矢下" ){
				userImg = "yashita.jpg";
			}

			// adjustment date format and write HTML
			var date = yyyy + "/" + (mm < 10 ? "0" + mm : mm) + "/" + (dd < 10 ? "0" + dd : dd) + " " + hh + ":" + (ss < 10 ? "0" + ss : ss);
			$('#list').prepend($('<dt><img id="img" src="/images/' + userImg + '" height="50"><font color="blue" size="5"> ' + data.name + '</font>' + date + '</dt><div class="bubble"><dd class="body">' + data.message + '</dd></div><br><br><br>'));
		});
	});

	//----------------------------------------------------------------------------------
	// call "price.push" from server side
	//----------------------------------------------------------------------------------
	socket.on('price.push', function (push_price_data) {

		// Check current page id and server's push id
		var current_id = $('#id').val();
		if(current_id == push_price_data.id){
			$('#id').attr('value',push_price_data.id);
			$('#sum').html((new Number(push_price_data.count)).toLocaleString('ja'));
		}
	});

	//----------------------------------------------------------------------------------
	// onClick event ( chat button )
	//----------------------------------------------------------------------------------
	$('#form_socket').submit(function() {
		// send data to server
		socket.emit('data.add', {
			name:$('#name').val(),
			message:$('#message').val()
		});
		// clear current message text area
		document.getElementById("message").value="";
		return false;
	});


	//----------------------------------------------------------------------------------
	// onClick event ( price button )
	//----------------------------------------------------------------------------------
	$('#form_price').submit(function() {
		// send data to server
		socket.emit('price.add', {
			id:$('#id').val(),
			selectmenu1:$('#selectmenu1').val()
		});
		return false;
	});

});
