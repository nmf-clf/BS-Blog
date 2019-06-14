const Router = require('express').Router;

const CategoryModel = require('../models/category.js');
const ArticleModel = require('../models/article.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const getCommonData = require('../util/getCommonData.js');

const router = Router();

//显示首页
router.get("/",(req,res)=>{
   //console.log(req.cookies.get('userInfo'));
   //console.log(req.userInfo);
  /* CategoryModel.find({},'_id name')
   .sort({order:1})
   .then((categories)=>{ //获取分类
       ArticleModel.getPaginationArticles(req)
       .then((data)=>{//获取首页的文章列表
           ArticleModel.find({},'_id title click')
           .sort({click:-1})
           .limit(10)
           .then((hotArticles)=>{
                res.render('main/index',{
                     userInfo:req.userInfo,
                     articles:data.docs,
                     page:data.page,
                     list:data.list,
                     pages:data.pages,
                     categories:categories,
                     hotArticles:hotArticles,
                     url:'/articles'
                 })
           })

           
       })
   })*/
   ArticleModel.getPaginationArticles(req)
   .then(pageData=>{
      getCommonData()
      .then(data=>{
         res.render('main/index',{
            userInfo:req.userInfo,
            articles:pageData.docs,
            page:pageData.page,
            list:pageData.list,
            pages:pageData.pages,
            categories:data.categories,
            hotArticles:data.hotArticles,
            url:'/articles'
         });            
      })
   })
 
})

//ajax请求获取文章列表的分页数据
router.get("/articles",(req,res)=>{
   /*let options = {
           page:req.query.page,//需要显示的页码
           model:ArticleModel,//操作的数据模型
           query:{},//查询条件
           projection:'-__v', //投影，
           sort:{_id:-1},//排序,
           populate:[{path:'category',select:'name'},{path:'user',select:'username'}]

       }
       pagination(options)*/
       let category = req.query.id;
       let query = {};
       if(category){
        query.category = category;
       }
       ArticleModel.getPaginationArticles(req,query)
       .then((data)=>{ //把数据发送给前台
           res.json({
              code:0,
              data:data
           })
       })
});

//显示详情页面
router.get("/view/:id",(req,res)=>{
   let id = req.params.id;
   //console.log(id);
   /*ArticleModel.update({_id:id},{$inc:{click:1}})
   .then((raw)=>{
      ArticleModel.findById(id)
      .then((article)=>{
          console.log(article)
      })
   })*/

   /*ArticleModel.findByIdAndUpdate(id,{$inc:{click:1}},{new:true})
   .populate('category','name')
   .then((article)=>{
      CategoryModel.find({},'_id name')
      .sort({order:1})
      .then((categories)=>{ //获取分类
            ArticleModel.find({},'_id title click')
            .sort({click:-1})
            .limit(10)
            .then((hotArticles)=>{
                res.render('main/detail',{
                  userInfo:req.userInfo,
                   article:article,
                   categories:categories,
                   hotArticles:hotArticles
                })
             })
      })
   })*/
   ArticleModel.findByIdAndUpdate(id,{$inc:{click:1}},{new:true})
   .populate('category','name')
   .then(article=>{
      getCommonData()
      .then(data=>{
        CommentModel.getPaginationComments(req,{article:id})
         .then(pageData=>{
            res.render('main/detail',{
                userInfo:req.userInfo,
                article:article,
                categories:data.categories,
                hotArticles:data.hotArticles,
                comments:pageData.docs,
                page:pageData.page,
                list:pageData.list,
                pages:pageData.pages,
                category:article.category._id.toString()
             })
         })
         
      })
   })

})

//显示分类列表页面
router.get("/list/:id",(req,res)=>{
   let id = req.params.id;
   ArticleModel.getPaginationArticles(req,{category:id})
   .then(pageData=>{
      getCommonData()
      .then(data=>{
         res.render('main/list',{
            userInfo:req.userInfo,
            articles:pageData.docs,
            page:pageData.page,
            list:pageData.list,
            pages:pageData.pages,
            categories:data.categories,
            hotArticles:data.hotArticles,
            category:id,
            //site:data.site,
            url:'/articles'
         });   

      })
   })

})

//显示视频资料页面
/*router.get("/radio",(req,res)=>{
    console.log('aa')
    res.render('main/radio',{
           
    })
})
*/

module.exports = router;