var mongoose = require("mongoose");
var CategorySchema=require("../schemas/category");
var Category=mongoose.model("Category",CategorySchema);//创建model，并注册到mongoose里面。(Movie这里是否等同于获取一下model？待验证)

module.exports=Category;