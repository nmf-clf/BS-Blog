const Router = require('express').Router;

const UserModel = require('../models/user.js');
const CommentModel = require('../models/comment.js')
const pagination = require('../util/pagination.js');
const hmac = require('../util/hmac.js')
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

const router = Router();

//权限控制
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>您没有权限！</h1>');
	}
})

//显示妖尾首页
router.get("/",(req,res)=>{
   //res.send('admin');
   res.render('admin/index',{
   	   userInfo:req.userInfo
   });
})

//显示后台用户信息管理
router.get('/users',(req,res)=>{
	//获取所有用户的信息,分配给模板

	//需要显示的页码
	//let page = req.query.page || 1;
	//if(page <=0 ){
	//	page = 1;
	//}
    //每页显示的条数
    //let limit = 2;
    
  
    /*分页: 假设每页显示2条
    limit(2)
    skip()//跳过多少条

    第一页跳过 0条
    第二页跳过 2条
    (page-1)*limit
    */
     /*UserModel.estimatedDocumentCount({})
    .then((count)=>{
    	let pages = Math.ceil(count/limit);
    	if(page > pages){//如果page>pages 还是显示最后一页的内容
    		page = pages;
    	}
        //用一个数组存储多少页
        let list = [];
        for(let i=1; i<=pages;i++){
      	   list.push(i);
        }
    	let skip = (page-1)*limit
		UserModel.find({},'_id username isAdmin')
		.skip(skip)
		.limit(limit)
		.then((users)=>{
			//console.log(users);
			res.render('admin/user-manage',{
				userInfo:req.userInfo,
				users:users,
				page:page*1,
				list:list
			});
		 })
    })*/
    /*UserModel.find()
    .then((users)=>{
        console.log(users)
    })*/
    let options = {
        page:req.query.page,//需要显示的页码
        model:UserModel,//操作的数据模型
        query:{},//查询条件
        projection:'_id username isAdmin age sex', //投影，
        sort:{_id:1}//排序,
    }
    pagination(options)
    .then((data)=>{
        //console.log("111::",data.docs)
        res.render('admin/user-manage',{
            userInfo:req.userInfo,
            users:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:'/admin/users'
        })
    })
})

//处理图片上传
router.post('/uploadImages',upload.single('upload'),(req,res)=>{
    let path = "/uploads/"+req.file.filename;
    res.json({
        uploaded:true,
        url:path
    })
})

//用户评论管理列表
router.get('/comments',(req,res)=>{
    CommentModel.getPaginationComments(req)
    .then(data=>{
        res.render('admin/user-comment',{
            userInfo:req.userInfo,
            comments:data.docs,
            page:data.page,
            pages:data.pages,
            list:data.list,
            url:'/admin/comments'
        })
    })
})

//删除评论
router.get("/comment/delete/:id",(req,res)=>{
    let id = req.params.id;
    CommentModel.remove({_id:id},(err,raw)=>{
        if(!err){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'删除评论成功',
                url:'/admin/comments'
            })              
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'删除评论失败,数据库操作失败'
            })              
        }       
    })

});

//显示修改密码页面
router.get('/repassword',(req,res)=>{
    res.render('admin/repassword',{
        userInfo:req.userInfo
    })
})

//修改密码请求处理
router.post('/repassword',(req,res)=>{
    UserModel.update({_id:req.userInfo._id},{
        password:hmac(req.body.password)
    })
    .then(raw=>{
        req.session.destroy();
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'更新密码成功',
            url:'/'
        })          
    })
})



module.exports = router;