const CategoryModel = require('../models/category.js');
const ArticleModel = require('../models/article.js');
//const path = require('path');
//const fs = require('fs');
/*获取前台共通数据*/
let getCommonData = ()=>{
  //需要显示的页码
    return new Promise((resolve,reject)=>{
       CategoryModel.find({},'_id name')
		.sort({order:1})
		.then(categories=>{
			ArticleModel.find({},'_id title click')
			.sort({click:-1})
			.limit(10)
			.then(hotArticles=>{
				//let filePath = path.normalize(__dirname + '/../site-info.json');
				
					resolve({
						categories:categories,
						hotArticles:hotArticles,
					})
				
			})
		})
		
    });
}

module.exports = getCommonData;