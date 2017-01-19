var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//用ObjectId作为字段的类型主键，也是为了实现关联文档的查询
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
    //当前要评论的电影是那一部，指向Movie模型
    //通过引用的方式存一个电影的id
    movie:{type:ObjectId,ref:"Movie"},
    //评论来自于谁
    from:{type:ObjectId,ref:"User"},
    //具体评论内容
    content:String,

    //一个主评论，下面很多针对这个主评论的小评论
    //评论：回复给谁？谁回复的？回复的内容
    reply:[{
        from:{type:ObjectId,ref:"User"},
        to:{type:ObjectId,ref:"User"},
        content:String,
    }],
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

CommentSchema.pre("save",function (next) {//每次在存储数据之前都会来调用这个方法（中间件）
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now();
    }else{
        this.meta.updateAt=Date.now();
    }
    next();
});

CommentSchema.statics = {//添加一个静态方法，静态方法从模型上去调用 
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

module.exports=CommentSchema;
















