(function($){
	
	$('#category-add-btn').on('click',function(){
		var cateName = $('[name="name"]').val()
		if(cateName.trim() == ''){
		  //console.log('aa');
		 $('.err').html('分类名称不能为空')	
		 return false;
		}
		$('.err').html('')
	});
	
})(jQuery);