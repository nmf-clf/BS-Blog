(function($){
	$('#logout').on('click',function(){
		$.ajax({
			url:"/user/logout",
			dataType:'json',
			type:'get'
		})
		.done(function(result){
			if(result.code == 0){
				//console.log('aaa')
				//window.location.reload();
				window.location.href = "/";
			}
		})
		.fail(function(err){
			console.log(err)
		})		
	});
})(jQuery)