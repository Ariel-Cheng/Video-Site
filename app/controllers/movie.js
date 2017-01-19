var Movie=require("../models/movie");
var Comment=require("../models/comment");
var _ = require("underscore");

//用来控制跟电影相关的请求

//详情页
//1、异步方式，让Movie和Comment各自去查，最后来一个结果的整合
//2、回调的方式，查到当前movie，拿到movieid后，再来查comment，里面这部电影下多有的comment
exports.detail = function(req, res){
    var id = req.params.id;
    Movie.findById(id,function(err,movie){
        if(err){
            console.log(err);
        };

        //找到这些电影，找到评论过这个电影的所有评论
        //对每条评论数据进行populate方法，它里面的from对应的objectid去user表里面查
        // 查完之后把name的值返回，来填充from字段
        //然后执行exct方法，回调方法里面传入err，和comments
        Comment
        .find({movie:id})
        .populate("from","name")
        .populate("reply.from","name")
        .populate("reply.to","name")
        .exec(function(err,comment){
            if(err){
                console.log(err);
            };
            res.render("pages/detail",{
                title:"imooc 详情页",
                movie:movie,
                comment:comment
            });
        });
    });
};

//后台录入页
exports.new = function(req, res) {
    res.render("pages/admin", {
        title: "imooc 后台录入页",
        movie: {
            title: "名字",
            doctor: "导演",
            country: "国家",
            year: 2016,
            poster: "海报",
            flash: "链接",
            summary: "简介",
            language: "语言"
        }
    });
};

//更新操作
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render("pages/admin", {
                title: "更新操作",
                movie: movie
            });
        });
    };
};

//后台录入存储
exports.save = function(req, res) {

    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== "undefined" && id !== "") {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/detail/" + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year
        });
        _movie.save(function(err, movie) {
            if (err) {
                console.log("新数据保存", err);
            }
            res.redirect("/detail/" + movie._id);
        });
    };
};

//列表页
exports.list = function(req, res) {
Movie.fetch(function(err, movies) {
    if (err) {
        console.log(err);
    }
    res.render("pages/list", {
        title: "imooc 列表页",
        movies: movies
    });
});
};

//列表页删除
exports.del = function(req, res) {
var id = req.query.id;
if (id) {
    Movie.remove({
        _id: id
    }, function(err, movie) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: 1
            });
        }
    });
}
};