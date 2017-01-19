var mongoose = require("mongoose");
var MovieSchema=require("../schemas/movie");
var Movie=mongoose.model("Movie",MovieSchema);//创建model，并注册到mongoose里面。(Movie这里是否等同于获取一下model？待验证)

module.exports=Movie;