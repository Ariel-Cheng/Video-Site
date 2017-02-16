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
exports.search = function(req, res) {

    var catId = req.query.cat;//拿到分类
    var page = parseInt(req.query.p,10);//拿到分页
    var count = 2//每一页有多少数据，设置为一个常量
    var index = page * count;

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
}
