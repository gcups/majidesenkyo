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
			if(data.name == "蜈ｼ蟶ｸ" ){
				userImg = "kanetsunesan.jpg";
			}else if(data.name == "蟆剰･ｿ" ){
				userImg = "konitan.jpg";
			}else if(data.name == "譚ｾ蠍" ){
				userImg = "matwu-.jpg";
			}else if(data.name == "蟆ｾ蟠" ){
				userImg = "osaki.jpg";
			}else if(data.name == "豼ｱ驥" ){
				userImg = "hamanosan.jpg";
			}else if(data.name == "螟ｧ遏ｳ" ){
				userImg = "ooishisan.jpg";
			}else if(data.name == "遏｢荳" ){
				userImg = "yashita.jpg";
			}

			// adjustment date format and write HTML
			var date = yyyy + "/" + mm + "/" + dd + " " + hh + ":" + ss ;
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
			$('#sum').html(push_price_data.count);
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
