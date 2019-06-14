/*
options = {
	page:, //需要显示的页码
	model:,//操作的数据模型
    query:,//查询条件
    projection:,//投影
    sort:,//排序
    populate:[] //
}
*/

let pagination = (options)=>{
  //需要显示的页码
    return new Promise((resolve,reject)=>{
       
		let page = 1;
        
        if(!isNaN(parseInt(options.page))){
            page = parseInt(options.page);
        }

		if(page <=0){
			page = 1;
		}
	    //每页显示的条数
	    let limit = 3;
	    
	  
	    /*分页: 假设每页显示2条
	    limit(2)
	    skip()//跳过多少条

	    第一页跳过 0条
	    第二页跳过 2条
	    (page-1)*limit
	    */
	     options.model.countDocuments(options.query)
	    .then((count)=>{
	    	let pages = Math.ceil(count/limit);
	    	//console.log('0::',count);
	    	//console.log('1::',pages);
	    	if(page > pages){//如果page>pages 还是显示最后一页的内容
	    		page = pages;
	    	}
	        if(pages == 0){
	        	page = 1;
	        }
	        //用一个数组存储多少页
	        let list = [];
	        for(let i=1; i<=pages;i++){
	      	   list.push(i);
	        }

	    	let skip = (page-1)*limit

			let query = options.model.find(options.query,options.projection);
            if(options.populate){
                for(let i = 0;i<options.populate.length;i++){
                	query = query.populate(options.populate[i])
                }
            }
            query
			.sort(options.sort)
			.skip(skip)
			.limit(limit)
			.then((docs)=>{
				resolve({
			       docs:docs,
	               page:page*1,
				   list:list,
				   pages:pages
				})
			 })
	    })
    });
}

module.exports = pagination;