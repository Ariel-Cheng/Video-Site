var Comment = require("../models/comment");

//comment
exports.save = function(req, res) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;
    
    //判断是否是回复，有没有cid，是评论就不是要new一个comment了
    if(_comment.cid){
        Comment.findById(_comment.cid,function(err,comment){
            var reply = {
                from:_comment.from,
                to:_comment.tid,
                content:_comment.content
            }

            //然后往找到的这个reply数组里面push这个reply
            comment.reply.push(reply);
            comment.save(function(err,comment){
                if(err){
                    console.log(err);
                };
                res.redirect('/detail/'+movieId);
            })
        })
    }else{
        var comment = new Comment(_comment);

        comment.save(function(err,comment){
            if(err){
                console.log(err);
           };
            res.redirect('/detail/'+movieId);
        });   
    }



};
