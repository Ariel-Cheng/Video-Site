var Movie = require("../models/movie");
var Category = require('../models/category');
//负责和首页进行交互
exports.index = function(req, res) {
    console.log('user in session: ');
    console.log(req.session.user);

    Category
    .find({})
    .populate({path:'movies'},options:{limit:5})
    .exec(function(err,categories){
        if (err) {
            console.log(err);
        }
        res.render("pages/index", {
            title: "imooc 首页",
            categories: categories
        });
    })
}