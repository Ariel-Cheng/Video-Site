var mongoose = require("mongoose");
var UserSchema=require("../schemas/user");
var User=mongoose.model("User",UserSchema);//创建model，并注册到mongoose里面。(Movie这里是否等同于获取一下model？待验证)

module.exports=User;