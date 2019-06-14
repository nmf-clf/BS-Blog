const Router = require('express').Router;

const CategoryModel = require('../models/category.js');
const ArticleModel = require('../models/article.js');
const CommentModel = require('../models/comment.js');
const pagination = require('../util/pagination.js');
const getCommonData = require('../util/getCommonData.js');
const router = Router();



router.get("/",(req,res)=>{
  //console.log('radio') 
  ArticleModel.getPaginationArticles(req)
   .then(pageData=>{
      getCommonData()
      .then(data=>{
         res.render('main/register',{
            userInfo:req.userInfo,
            list:pageData.list,
            categories:data.categories,
            hotArticles:data.hotArticles,
         });            
      })
   })
 
})



module.exports = router;