var Movie=require("../models/movie");
var Comment=require("../models/comment");
var Category=require("../models/category");
var _ = require("underscore");
//增加系统级别的用来读取文件的模块,以及路径的模块
var fs = require('fs');
var path = require('path');

//用来控制跟电影相关的请求

//详情页
//1、异步方式，让Movie和Comment各自去查，最后来一个结果的整合
//2、回调的方式，查到当前movie，拿到movieid后，再来查comment，里面这部电影下多有的comment
exports.detail = function(req, res){
    var id = req.params.id;
    Movie.update({_id:id},{$inc:{pv:1}},function(err){
      if(err){
        console.log(err);
      }
    });

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
                title:"iKan 详情页",
                movie:movie,
                comment:comment
            });
        });
    });
};

//后台录入页
exports.new = function(req, res) {
  Category.find({},function(err,categories){
    res.render("pages/admin", {
      title: "iKan 后台录入页",
      categories: categories,
      movie: {}
    });
  })
};

//更新操作
exports.update = function(req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
          Category.find({},function(err,categories){
            res.render("pages/admin", {
                title: "更新操作",
                movie: movie,
                categories:categories
            });
          })
        });
    };
};

//admin poster
exports.savePoster = function(req,res,next){
  var posterData = req.files.uploadPoster;//通过表单上的name值拿到file
  var filePath = posterData.path;//拿到路径
  var originalFilename = posterData.originalFilename;//拿原始的名字，来做判断，因为上传一张图片。肯定是有图片的文字的，所以判断是否上传成功。

  //如果说名字存在，就认为有图片传过来了，然后通过fs.readfile来读取这个图片路径里面的二进制数据，
  //然后拿到具体海报的数据，拿到以后声明一个时间戳，用来命名这个新的图片的名字，然后去拿它的type
  //通过split取到type的值，可能是一个png，jpg，然后拿poster给他一个名字，存起来，新的服务器的一个文件及里
  //通过path.join()生成一个服务器存储的地址。然后写入这份文件。把写入成功的文件名挂到request上。
  //如果没有文件名，没有上穿，直接进入next(),走到下一个流程，route里的。
  if(originalFilename){
    fs.readFile(filePath,function(err,data){
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp+'.'+type;
      var newPath = path.join(__dirname,'../../','/public/upload/'+poster);

      fs.writeFile(newPath,data,function(err){
        req.poster = poster;
        next();
      })
    })
  }else{
    next();
  }
}

//后台录入存储
//首先看是否海报上传，如果上传的话就把文件存起来，如果没有的话，就按照原有的逻辑。
//查看req.poster有没有，有的话就证明上一个流程里上传了一个新的文件。就来重写原有的movieObj里的poster的地址。

exports.save = function(req, res) {

    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(req.poster){
      movieObj.poster = req.poster;
    }
    if (id) {
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
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;
        _movie.save(function(err, movie) {
            if (err) {
                console.log("新数据保存", err);
            }
            if(categoryId){
              Category.findById(categoryId,function(err,category){
                category.movies.push(movie._id);
                category.save(function(err,category){
                  res.redirect("/detail/" + movie._id);
                })
              })
            }else if (categoryName) {
              var category = new Category({
                name: categoryName,
                movies: [movie._id]
              })
              category.save(function(err,category){
                movie.category = category._id;
                movie.save(function(err,movie){
                    res.redirect("/detail/" + movie._id);
                })
              })
            }

        });
    };
};

//列表页
exports.list = function(req, res) {
  Movie
  .find({})
  .populate({path:'category',options:{limit:5}})
  .exec(function(err,movies){
      if(err){
          console.log(err);
      };
      res.render("pages/list", {
          title: "iKan 列表页",
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
