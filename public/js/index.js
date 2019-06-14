(function($){
     var $login = $('#login');
     var $register = $('#register');
     var $userInfo = $('#user-info');

     $('#go-register').on('click',function(){
     	$login.hide();
     	$register.show();
     })
      $('#go-login').on('click',function(){
     	$register.hide();
     	$login.show();
     })

     //前台用户注册处理
      //验证规则
	     var usernameReg = /^[a-z][a-z|0-9|_]{2,9}$/i;
	     var passwordReg = /^\w{3,10}$/;
	     var ageReg = /^([0-9]|[0-9]{2}|100)$/;
     $('#sub-register').on("click",function(){
     	 //获取元素
     	 var username = $register.find("[name='username']").val();
     	 //console.log(username);
     	 var password = $register.find("[name='password']").val();
     	 var age = $register.find("[name='age']").val();
     	 var radios = $register.find("[name='people']");
     	 var sex = '';
         //console.log('radios:::',radios);
     	 for(var i=0;i<radios.length;i++){
     	 	 if(radios[i].checked == true){
     	 	 	i++;
     	 	 	//console.log(radios[--i].value)
     	 	 	sex = radios[--i].value;
     	 	 }
     	 }
         //console.log(sex);
       
     	 //console.log("1::",username)
     	 //console.log("2::",age)
     	 //console.log("3::",password)
     	 //console.log("4::",sex);

		 var repassword = $register.find("[name='repassword']").val();
         var errMsg = ''; //存储错误信息
		 //验证
		  //用户名 以字母开头包含数字字母下划线的3-10个字符
		 if(!usernameReg.test(username)){
			errMsg = '用户名以字母开头包含数字字母下划线的3-10个字符'
		 }
		 //密码 3-10字符
		 else if(!passwordReg.test(password)){
			errMsg = '密码为3-10个字符'
		 }
		 //年龄 为数字且大于等于0
		 else if (!ageReg.test(age)){
            errMsg = '年龄格式不正确，应为0-100的纯数字'
		 }
		 //密码不一致
		 else if(password != repassword){
			errMsg = '两次密码不一致'
		 }

		 if(errMsg){//验证不通过
			//显示错误信息
			$register.find('.err').html(errMsg);
			return;
		 }else{
			$register.find('.err').html('');
			//发送数据到后端(ajax)
			$.ajax({
				url:"/user/register",
				data:{
					username:username,
					password:password,
					age:age,
					sex:sex
				},
				type:'post',
				dataType:'json'
			})
			.done(function(result){
				//console.log(result);
				if (result.code === 0){
					//注册成功
					 $('#go-login').trigger('click')
				}else{
                     $register.find('.err').html(result.message);
				}
			 })
			 .fail(function(err){  //ajax请求失败
				console.log(err);
			 })
		  }	        
     })


     //前台用户登录处理
     $('#sub-login').on('click',function(){
		//获取数据
		var username = $login.find("[name='username']").val();
		var password = $login.find("[name='password']").val();

		var errMsg = '';
		var $err = $login.find('.err');
		//验证
		//用户名:以字母开头包含数字字母和下划线,3-10个字符
		if(!usernameReg.test(username)){
			errMsg = '用户名以字母开头包含数字字母和下划线,3-10个字符'
		}
		//密码:3-10个字符
		else if(!passwordReg.test(password)){
			errMsg = '密码为3-10个字符'
		}

		if(errMsg){//验证不通过
			//显示错误信息
			$err.html(errMsg)
			return;
		}else{
			$err.html('')
			//发送数据到后端(ajax)
			$.ajax({
				url:"/user/login",
				data:{
					username:username,
					password:password
				},
				type:'post',
				dataType:'json'
			})
			.done(function(result){
				console.log(result);
				if(result.code === 0){//登录成功
					
					/*$login.hide();
					$userInfo.find('span').html(result.data.username)
					$userInfo.show(); */
					
					//刷新当前页面(首页)
					//window.location.reload();
					window.location.href = "/";
				}else{
					$err.html(result.message)
				}
			})
			.fail(function(err){
				console.log(err);
			})
		}			
	})
     
	//用户退出
	$('#logout').on('click',function(){
		$.ajax({
			url:"/user/logout",
			dataType:'json',
			type:'get'
		})
		.done(function(result){
			if(result.code == 0){
				window.location.reload();
			}
		})
		.fail(function(err){
			console.log(err)
		})		
	});

 //发送文章列表的请求
 var $articlePage = $('#article-page');
 //console.log('111::',$articlePage);
 $articlePage.on('get-data',function(e,result){
 	//console.log('aaa')
 	//console.log(result);
 	createArticleList(result.data.docs);
 	if(result.data.pages>1){
      createList($articlePage,result.data.list,result.data.page);
    }else{
	   $articlePage.find('.pagination').html('');
	}
 });

 $articlePage.pagination();

//额外两个处理  用户登录和 视频播放
$('#yonghudenglu').on('click',function(){
	console.log('aaa');
	//alert('aaa')

	
});

//视频播放

/*$('#sp1').on('click',function(){
	alert('1');
})
*/

 /*
 $('#page').on('click','a',function(){
 	 //获取 a 标签
 	 //console.log(this); 
 	 //发送ajax向后台请求数据
     
     var page = 1;
     //let page = $(this).html();
     var $this = $(this);
     var currentPage = $('#page').find('.active a').html();
     var label = $this.attr('aria-label')
     //console.log(currentPage);
     if(label == 'Previous'){//上一页
          page = currentPage - 1;
     }else if(label == 'Next'){//下一页
          page = currentPage*1 + 1
     }else{
         page = $(this).html();
     }
     
     var query = 'page=' + page;
     var category = $('#cate-id').val();
     if(category){
     	query += "&category=" + category;
     }

 	 $.ajax({
 	 	url:'/articles?'+query,
 	 	type:'get',
 	 	dataType:'json'
 	 })
 	 .done(function(result){
         //console.log(result)
         if(result.code == 0 ){
              createArticleList(result.data.docs);
              createList(result.data.list,result.data.page);
              //console.log('11::',result.data.docs);
              //console.log('22::',result.data.list);
              //console.log('33::',result.data.page);
         }
 	 })
 	 .fail(function(){

 	 })
 })
 */

  function createArticleList(articles){
      var html = '';
      for(var i =0;i<articles.length;i++){
      	var createdAt = moment(articles[i].createdAt).format('YYYY年MM月DD日 HH:mm:ss ');
		 html += `<div class="panel panel-default content-item">
			        <div class="panel-heading">
			          <h3 class="panel-title">
			            <a href="/view/${ articles[i]._id }" target="_blank">${ articles[i].title }</a>
			          </h3>
			        </div>
			        <div class="panel-body">
			          ${ articles[i].intro }
			        </div>
			         <div class="panel-footer">
			            <span class="glyphicon glyphicon-user"></span>
			            <span class="content-footer-text text-muted">
			              ${ articles[i].user.username }
			            </span>
			            <span class="glyphicon glyphicon-th-list"></span>
			            <span class="content-footer-text text-muted">
			              ${ articles[i].category.name }
			            </span>
			            <span class="glyphicon glyphicon-time"></span>
			            <span class="content-footer-text text-muted">
			              ${ createdAt }
			            </span>
			            <span class="glyphicon glyphicon-eye-open"></span>
			            <span class="content-footer-text text-muted">
			            <em>
			              ${ articles[i].click }
			            </em>人已阅读</span>
			         </div>
			    </div>`
      }
      $('#article-list').html(html);
  }
  function createList($page,list,page){
  	var html = `<li>
				      <a href="javascript:;" aria-label="Previous">
				        <span aria-hidden="true">上一页</span>
				      </a>
			    </li>`

	    for(i in list){
	    	if(list[i] == page){
	    		html += `<li class="active"><a href="javascript:;">${list[i]}</a></li>`;
	    	}else{
	    		html += `<li><a href="javascript:;">${list[i]}</a></li>`
	    	}
	    }

	 	html += `<li>
			      <a href="javascript:;" aria-label="Next">
			        <span aria-hidden="true">下一页</span>
			      </a>
			    </li>`
		
		//$('#page .pagination').html(html);
		$page.find('.pagination').html(html)
  }

//发布评论
	//var $commentPage = $('#comment-page');
    var $commentPage = $('#comment-page');
	$('#comment-btn').on('click',function(){
		var articleId = $('#article-id').val();
		var commentContent = $('#comment-content').val();

		if(commentContent.trim() == ''){
			$('.err').html('评论内容不能为空');
			return false;
		}else{
			$('.err').html('')
		}

		$.ajax({
			url:'/comment/add',
			type:'post',
			dataType:'json',
			data:{id:articleId,content:commentContent}
		})
		/*.done(function(result){
			// console.log(result);
			if(result.code == 0){
				//1.渲染评论列表
				buildCommentList(result.data.docs)
				//2.渲染分页
				if(result.data.pages > 1){
					buildPage($commentPage,result.data.list,result.data.page)	
				}else{
	 				$commentPage.find('.pagination').html('');
	 			}
				$('#comment-content').val('')
			}
		})*/
		.done(function(result){
			//console.log(result);
			if(result.code == 0){
				//1.渲染评论列表
				createCommentList(result.data.docs)
				//2.渲染分页
				if(result.data.pages>1){
                   createList($commentPage,result.data.list,result.data.page);
				}
				
				$('#comment-content').val('');
			}
		})
		.fail(function(err){
			console.log(err)
		})
	});

	//构建评论列表
	function createCommentList(comments){
		var html = '';
		for(var i=0;i<comments.length;i++){
			var createdAt = moment(comments[i].createdAt).format('YYYY年MM月DD日 HH:mm:ss ');
			html += `<div class="panel panel-default">
				        <div class="panel-heading">${ comments[i].user.username } 发表于 ${ createdAt }</div>
				        <div class="panel-body">
				         ${ comments[i].content }
				        </div>
				      </div>`
		}
		$('#comment-list').html(html);
	}
	//var $commentPage = $('#comment-page');
	 //console.log($commentPage);
	 $commentPage.on('get-data',function(e,result){
	 	console.log('aaa')
	 	//console.log(result);
	 	if(result.data.pages>1){
	 	  createCommentList(result.data.docs)
	    }
	    createList($commentPage,result.data.list,result.data.page);
	 });

	 $commentPage.pagination();
    



})(jQuery);