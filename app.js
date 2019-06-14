//项目入口文件
const express = require('express');
const swig = require('swig');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Cookies = require('cookies');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);

//1.启动数据库
mongoose.connect('mongodb://localhost:27017/yaowei',{ useNewUrlParser: true });

const db = mongoose.connection;

db.on('error',(err)=>{
	throw err
});

db.once('open',()=>{
	console.log('DB connected....');
});

//生成app
const app = express();

//2.配置模板
swig.setDefaults({
  cache: false
});
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

//3.配置静态资源
app.use(express.static('public'));
//!设置cookies中间件，必须加在路由前面
app.use(session({
    //设置cookie名称
    name:'yyid',
    //用它来对session cookie签名，防止篡改
    secret:'gfdhhhjjj',
    //强制保存session即使它并没有变化
    resave: true,
    //强制将未初始化的session存储
    saveUninitialized: true, 
    //如果为true,则每次请求都更新cookie的过期时间
    rolling:true,
    //cookie过期时间 1天
    cookie:{maxAge:1000*60*60*24},    
    //设置session存储在数据库中
    store:new MongoStore({ mongooseConnection: mongoose.connection })   
}))
app.use((req,res,next)=>{
	//console.log(req.session);
	req.userInfo = req.session.userInfo || {};
	next();
});

//4.添加处理post请求的中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//处理路由
app.use("/",require('./routes/index.js'));
app.use("/user",require('./routes/user.js'));
app.use("/admin",require('./routes/admin.js'));
app.use("/category",require('./routes/category.js'));
app.use("/article",require('./routes/article.js'));
app.use("/comment",require('./routes/comment.js'));
app.use("/resource",require('./routes/resource.js'));
app.use("/home",require('./routes/home.js'));
app.use("/radio",require('./routes/radio.js'));
app.use("/register",require('./routes/register.js'));

app.listen(3000,()=>{
	console.log('server is running at 127.0.0.1:3000');
})



/*app.use((req,res,next)=>{
    req.cookies = new Cookies(req,res);
    //console.log(req.cookies.get('userInfo'));

    req.userInfo = {};

    let userInfo = req.cookies.get('userInfo');

    if(userInfo){
        try{ //parse容易出错 做容错处理 转化不了对象就空对象
            req.userInfo = JSON.parse(userInfo);
        }catch(e){
        }
    }
    next();
});*/



