var User = require("../models/user");
//控制跟用户相关的请求
//showSignin
exports.showSignin = function(req, res) {
    res.render('pages/signin', {
        title: '登陆页面'
    })
}

//showSignup
exports.showSignup = function(req, res) {
    res.render('pages/signup', {
        title: '注册页面'
    })
}

//sign up
exports.signup = function(req, res) {
    var _user = req.body.user;
    //通过req.param('user')也可以拿到这个_user对象,下面三种表达式的封装，但有优先级，最好分开。
    //路由为/user/signup/:userid 路由中的变量 req.params.userid
    //路由为/user/signup/1111?userid=1112 路由中的查询字符串 req.query.userid
    //通过ajax异步提交过来的，在ajaxpost的body中，通过req.body.userid


    //mongoose db中有重复的key会报错，所以注册相同的名字会报错，加一层判断逻辑,避免数据库报错
    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        //已经有，不需要注册，重定向登陆页面，没有生成新的数据
        if (user) {
            return res.redirect('/signin');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    })
}

//sign in
exports.signin = function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            console.log(err);
        }

        //用户不存在，重定向到注册页面
        if (!user) {
            return res.redirect('/signup');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err);
            }

            if (isMatch) {
                req.session.user = user;
                return res.redirect('/');
            } else {
                //密码不对，仍然重定向到当前页面，继续登陆
                return res.redirect('/signin');
            }
        })
    })
}


//logout
exports.logout = function(req, res) {
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');
}

//userlist page
exports.list = function(req, res) {
    User.fetch(function(err, users) {
        if (err) {
            console.log(err);
        }
        res.render("pages/userlist", {
            title: "iKan 用户列表页",
            users: users
        });
    });
}

//中间件放到文件代码的最后
//midware for user

//signin midware 登陆中间件
//next是当先流程走完的下一个流程
exports.signinRequired = function(req, res,next) {
    var user = req.session.user;
    if(!user){
        return res.redirect('/signin');
    }
    next();
}

//admin midware 用户权限中间件
exports.adminRequired = function(req,res,next){
    var user = req.session.user;
    //经过上面的登陆中间件走到这一步，一定是已经登陆了
    if(user.role <= 10){
        return res.redirect('/signin');
    }
    next();
}
