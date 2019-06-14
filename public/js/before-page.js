(function($){
  $.fn.extend({
  	pagination:function(){
  		//console.log(this);
  		var self = this;
  		this.on('click','a',function(){
		     //let page = $(this).html();
		     var $this = $(this);
		     var page = 1;
		     var currentPage =self.find('.active a').html();
		     var label = $this.attr('aria-label')
		     //console.log(currentPage);
		     if(label == 'Previous'){//上一页
		          page = currentPage - 1;
		     }else if(label == 'Next'){//下一页
		          page = currentPage*1 + 1
		     }else{
		         page = $(this).html();
		     }
		     
		     var query = self.data('url')+'?page='+page;
		     //var category = $('#cate-id').val();
		     var id = self.data('id');

		     if(id){
		     	query += "&id=" + id;
		     }

		 	 $.ajax({
		 	 	url:query,
		 	 	type:'get',
		 	 	dataType:'json'
		 	 })
		 	 .done(function(result){
		         //console.log(result)
		         if(result.code == 0 ){
		         	//console.log('11:')
		         	self.trigger('get-data',[result])
		              //createArticleList(result.data.docs);
		              //createList(result.data.list,result.data.page);
		         }
		 	 })
		 	 .fail(function(err){
                console.log(err)
		 	 })
		 })
  	}
  })
})(jQuery)