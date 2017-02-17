var Movie = require("../models/movie");
var Category = require('../models/category');
//负责和首页进行交互
exports.index = function(req, res) {
    console.log('user in session: ');
    console.log(req.session.user);

    Category
    .find({})
    .populate({path:'movies',options:{limit:5}})
    .exec(function(err,categories){
        if (err) {
            console.log(err);
        }
        res.render("pages/index", {
            title: "iKan 首页",
            categories: categories
        });
    })
}

//search page
//分辨是搜索类型还是分类类型，公用一个模板文件
//如果没有catId,我就认为是一个搜索框提交过来的请求,通过电影的名字来查，Movie
exports.search = function(req, res) {

    var catId = req.query.cat;//拿到分类

    // get是把参数数据队列加到提交表单的ACTION属性所指的URL中，值和表单内各个字段一一对应，在URL中可以看到。
    //post是通过HTTP post机制，将表单内各个字段与其内容放置在HTML HEADER内一起传送到ACTION属性所指的URL地址。用户看不到这个过程。
    //对于get方式，服务器端用Request.QueryString获取变量的值，对于post方式，服务器端用Request.Form获取提交的数据。
    var q = req.query.q;//拿到搜索框请求的参数。
    var page = parseInt(req.query.p,10)||0;//拿到分页,默认给个0的值
    var count = 2//每一页有多少数据，设置为一个常量
    var index = page * count;

    if(catId){
      Category
      .find({_id: catId})
      .populate({
        path:'movies',
        select: 'title poster'
        //options:{limit:2,skip:index}//限制它每一次查询的个数，以及从那一条数据开始查，跳到索引的位置开始查询
      })
      .exec(function(err,categories){
          if (err) {
              console.log(err);
          }
          var category = categories[0] || {};
          var movies = category.movies || [];
          var results = movies.slice(index,index+count);

          res.render("pages/results", {
              title: "iKan 结果列表页面",
              query: 'cat='+catId,
              keyword: category.name,
              currentPage: (page+1),//一共有多少页。当前是第几页
              totalPage:Math.ceil(movies.length/count),//全部的page,Math.ceil取整,向上舍入
              movies: results
          });
      })
    }else{
      Movie
      .find({title: new RegExp(q+ '.*','i')})
      .exec(function(err,movies){//执行回调
        if (err) {
            console.log(err);
        }
        var results = movies.slice(index,index+count);

        res.render("pages/results", {
            title: "iKan 结果列表页面",
            query: 'q='+q,
            keyword: q,
            currentPage: (page+1),//一共有多少页。当前是第几页
            totalPage:Math.ceil(movies.length/count),//全部的page,Math.ceil取整,向上舍入
            movies: results
        });
    })
  }
}
