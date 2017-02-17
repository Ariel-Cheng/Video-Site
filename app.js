var express = require("express");
var bodyParser = require('body-parser');//将表单中的提交的数据格式化
var path = require("path");
var session = require('express-session');
var mongoose = require("mongoose");
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var fs = require('fs');

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
	.readdirSync(path)
	.forEach(function(file){
		var newPath = path +'/'+file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()) {
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath);
			}
		}else if(stat.isDirectory()){
			walk(newPath)
		}
	})
};
walk(models_path);


var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);

app.set("views", "./app/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(require('connect-multiparty')());//专门来处理 表单设置了'enctype="multipart/form-data"'这种类型的表单提交过来的数据。
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	}),
	resave:false,
	saveUninitialized:true
}))
app.use(bodyParser.json());

//env是dev开发环境的话
var env = process.env.NODE_ENV || 'development'
if(env === 'development'){
	//设置 可以打印出错误信息
	app.set('showStackError',true);
	//中间件 传入配置参数 返回请求的类型 请求的url路径，请求建立的status状态值的情况
	app.use(logger(':method :url :status'));
  //页面上的源码不是压缩过的一行，希望可读性好一点
  app.locals.pretty = true;
  mongoose.set('debug',true);
}

require('./config/routes.js')(app);

app.listen(port);
app.locals.moment = require("moment");
console.log("服务成功启动－端口号：", port);
