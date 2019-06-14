const Router = require('express').Router;
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const router = Router();

//添加评论
router.post("/add",(req,res)=>{ //从前台public index.js注册处接受到的是post请求
	let body = req.body;
	new CommentModel({
		article:body.id,
		user:req.userInfo._id,
		content:body.content
	})
	.save()
	.then(comment=>{
		CommentModel.getPaginationComments(req,{article:body.id})
		.then(data=>{
			res.json({
				code:0,
				data:data
			});			
		})
	})
})

router.get('/list',(req,res)=>{
    let article = req.query.id;
       let query = {};
       if(article){
        query.article = article;
       }
       CommentModel.getPaginationComments(req,query)
       .then((data)=>{ //把数据发送给前台
           res.json({
              code:0,
              data:data
           })
       })
})




module.exports = router;