  var Category = require("../models/category");

//后台录入页
exports.new = function(req, res) {
    res.render("pages/category_admin", {
        title: "iKan 后台分类录入页",
        category: {}
    });
};

//后台录入存储
exports.save = function(req, res) {

    var _category = req.body.category;

    var category = new Category(_category);
    category.save(function(err, movie) {
            if (err) {
                console.log("新数据保存", err);
            }
            res.redirect("/admin/categorylist");
    });
};

//categorylist page
exports.list = function(req, res) {
    Category.fetch(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.render("pages/categorylist", {
            title: "iKan 分类列表页",
            categories: categories
        });
    });
}
