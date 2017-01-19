var Index = require("../app/controllers/index");
var Movie = require("../app/controllers/movie");
var User = require("../app/controllers/user");
var Comment = require("../app/controllers/comment");



module.exports = function(app) {
    //pre handle user   预处理
    app.use(function(req, res, next) {
        var _user = req.session.user || 0;
        app.locals.user = _user;
        return next();
    })


    //index
    //index page 首页
    app.get("/", Index.index);


    //user
    //sign up注册
    app.post('/user/signup', User.signup);
    //sign in 登陆
    app.post('/user/signin', User.signin);
    //专门的注册页面
    app.get('/signup', User.showSignup);
    //专门的登陆页面
    app.get('/signin', User.showSignin)
        //logout 登出
    app.get('/logout', User.logout);
    //userlist page
    //中间件就是在这里传多个参数都可以
    //user.signinReauired 你要访问我这个userlist，首先要求你是登陆的
    //user.adminRequired 再次我需要你是管理员的权限，否则就不让你访问这个userlist
    app.get("/admin/user/list", User.signinRequired, User.adminRequired, User.list);


    //movie
    //movie detail详情页
    app.get("/detail/:id", Movie.detail);
    //admin new page
    app.get("/admin/movie/new", User.signinRequired, User.adminRequired, Movie.new);
    //更新操作
    app.get("/admin/movie/update/:id", User.signinRequired, User.adminRequired, Movie.update);
    //后台录入存储
    app.post("/admin/movie", User.signinRequired, User.adminRequired, Movie.save);
    app.get("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.list);
    app.delete("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.del);

    //comment
    app.post('/user/comment', User.signinRequired, Comment.save);

}