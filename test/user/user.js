//需要用到一些便于测试用的模块
var crypto = require('crypto');//对于随机字符串的生成 crypto
var bcrypt = require('bcryptjs');//对于密码加密的bcrypt

//获取随机字符串,用来测试user的时候名字，生成一个长度为16的字符串
function getRandomString(len){
  if(!len) len = 16;
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex');
}

var should = require('should');
//引入入口文件
var app = require('../../app');
var mongoose = require('mongoose');
//var User = require('../../app/models/user')
var User = mongoose.model('User');

var user;
//测试用例
//描述一个单元测试开始
describe('<Unit Test',function(){//descript可以嵌套，就是说一个测试模块里可以有子的测试模块，所以可以分组
    //首先测试关于User的模型,before,after,在测试用例运行之前要干的一些事情，比如预定义好一些变量等等
    //测试从done的调用开始

    //对于用户模型相关的单元测试
    describe('Model User:',function(){
          before(function(done){
            user = {
              name: getRandomString(),
              password: 'password'
            };
            done();
          })

        //save之前，确定这个用户名在数据库里是不存在的
        //一个it就代表一个测试用例,只要跑通一个it里面所定义的这些比对这些任务，就说明跑通啦~
        //分的单元，可以狭义的理解为这个it，代表测试的某一个功能点，或者是某一种类型的功能点
        describe('Before Method save',function(){
          it('should begin without test user',function(done){
            User.find({name: user.name},function(err,users){
              users.should.have.length(0);

              done();
            })
          })
        })

        //测试用户save的时候没有问题
        describe('User save',function(){
            it('should save without problems',function(done){
                var _user = new User(user);
                _user.save(function(err){
                    should.not.exist(err);
                    _user.remove(function(err){
                        should.not.exist(err);
                        done();
                    })
                })
            })

            it('should password be hashed correctly',function(done){
                var password = user.password;
                var _user = new User(user);

                _user.save(function(err){

                    should.not.exist(err);
                    _user.password.should.not.have.length(0);
                    bcrypt.compare(password,_user.password,function(err,isMatch){
                        should.not.exist(err);
                        isMatch.should.equal(true)

                        _user.remove(function(err){
                            should.not.exist(err);
                            done();
                        })
                    })
                })
            })

            //权限单元测试 默认是0
            it('should have default role 0',function(done){
                var _user = new User(user);

                _user.save(function(err){
                    _user.role.should.equal(0);

                    _user.remove(function(err){
                            should.not.exist(err);
                            done();
                    })
                })
            })

            it('should fail to save an existing user',function(done){
                var _user1 = new User(user);
                _user1.save(function(err){
                    should.not.exist(err);

                    var _user2 = new User(user);
                    _user2.save(function(err){
                        should.exist(err);

                        _user1.remove(function(err){
                          if(!err){
                            _user2.remove(function(err){
                                done();
                              })
                          }
                        })
                    })
                });
            })

        })

        after(function(done){
          //clear user info
          done();
        })
  })
})
