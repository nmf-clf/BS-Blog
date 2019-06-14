const Router = require('express').Router;

const CategoryModel = require('../models/category.js');
const pagination = require('../util/pagination.js');

const router = Router();

//权限控制
router.use((req,res,next)=>{
	if(req.userInfo.isAdmin){
		next();
	}else{
		res.send('<h1>您没有权限！</h1>');
	}
})

//显示动漫分类管理页面
router.get("/",(req,res)=>{
   let options = {
        page:req.query.page,//需要显示的页码
        model:CategoryModel,//操作的数据模型
        query:{},//查询条件
        projection:'_id name order', //投影，
        sort:{order:1}//排序,
    }
    pagination(options)
    .then((data)=>{
        res.render('admin/user-category',{
            userInfo:req.userInfo,
            categories:data.docs,
            page:data.page,
            list:data.list,
            pages:data.pages,
            url:'/category'
        })
    })

   /*CategoryModel.find({})
   .then((categories)=>{
       res.render('admin/user-category',{
           userInfo:req.userInfo,
           categories:categories
       });
   })*/
  
})

//显示新增分类页面
router.get("/add",(req,res)=>{
   //res.send('admin');
   res.render('admin/user-category-ae',{
       userInfo:req.userInfo
   });
})

//添加请求
router.post("/add",(req,res)=>{
   console.log(req.body);
   let body = req.body;
    // console.log('body::',body)
    CategoryModel
    .findOne({name:body.name})
    .then((cate)=>{
      console.log('cate',cate)
        if(cate){//已经存在渲染错误页面
            //res.send('err');
            console.log('cates',cate)
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'新增分类失败,已有同名分类'
            })
        }else{
            new CategoryModel({//把数据插入到数据库
                name:body.name,
                order:body.order
            })
            .save()
            .then((newCate)=>{
                if(newCate){//插入成功,渲染成功页面
                    //res.send('ok');
                    res.render('admin/success',{
                        userInfo:req.userInfo,
                        message:'新增分类成功',
                        url:'/category'
                    })
                }
            })
            .catch((e)=>{//插入失败,渲染错误页面
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    message:'新增分类失败,数据库操作失败'
                })
            })
        }
    })
})

//显示编辑页面
router.get("/edit/:id",(req,res)=>{
    let id = req.params.id;
    CategoryModel.findById(id)
    .then((category)=>{
         res.render('admin/user-category-ae',{
            userInfo:req.userInfo,
            category:category
        }); 
    })
   
})
//处理修改请求
router.post("/edit",(req,res)=>{
  let body = req.body;
    CategoryModel.findById(body.id)
    .then((category)=>{
      if(category.name == body.name && category.order == body.order){
         res.render('admin/error',{
           userInfo:req.userInfo,
           message:'请修改数据再进行操作'
         })        
      }else{
        CategoryModel.findOne({name:body.name,_id:{$ne:body.id}})
        .then((newCategory)=>{
          if(newCategory){
            res.render('admin/error',{
              userInfo:req.userInfo,
              message:'修改分类失败,已有同名分类'
            })            
          }else{
            CategoryModel.update({_id:body.id},{name:body.name,order:body.order},(err,raw)=>{
              if(!err){
                res.render('admin/success',{
                  userInfo:req.userInfo,
                  message:'修改分类成功',
                  url:'/category'
                })          
              }else{
                res.render('admin/error',{
                  userInfo:req.userInfo,
                  message:'修改分类失败,数据库操作失败'
                })          
              }
            })          
          }
        })
      }
   })
})

//处理删除
router.get("/delete/:id",(req,res)=>{
    let id = req.params.id;
    
    CategoryModel.remove({_id:id},(err,raw)=>{
        if(!err){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'删除分类成功',
                url:'/category'
            })              
        }else{
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'删除分类失败,数据库操作失败'
            })              
        }       
    })

});


module.exports = router;