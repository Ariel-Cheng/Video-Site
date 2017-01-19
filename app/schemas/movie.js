var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var MovieSchema = new mongoose.Schema({
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	category:{
        type:ObjectId,
        ref:'Category'
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

MovieSchema.pre("save",function (next) {//每次在存储数据之前都会来调用这个方法（中间件）
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	next();
});

MovieSchema.statics = {//添加一个静态方法，静态方法从模型上去调用 
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

module.exports=MovieSchema;
















