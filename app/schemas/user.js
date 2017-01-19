var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;//默认加盐算法的计算复杂度，越复杂解密越困难
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password: String,
    //0 : normal user
    //1 : verified user
    //2 : professional user
    //>10 : admin
    //>50 : super admin
    role:{
        type:Number,
        default:0//默认就是一个普通用户
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

//用户存储的时候对密码进行加密和加盐
UserSchema.pre("save",function (next) {//每次在存储数据之前都会来调用这个方法（中间件）
    var user = this;

    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err);//将错误带入下一个流程

        bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
});

//实例方法：通过实例来调用
UserSchema.methods = {
    comparePassword:function(_password,cb){
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err){
                return cb(err);
            }
            cb(null,isMatch);
        })
    }
}

//静态方法:通过模型来调用
UserSchema.statics = {//添加一个静态方法，静态方法从模型上去调用 
    fetch:function(cb){
        return this
        .find({})
        .sort("meta.updateAt")
        .exec(cb)
    },
    findById:function(id,cb){
        return this
        .findOne({_id:id})
        .exec(cb)
    }
}

module.exports=UserSchema;
















