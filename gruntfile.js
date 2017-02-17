module.exports = function(grunt){
    grunt.initConfig({
        watch:{
            ejs:{
                files:['views/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/js/**','models/**/*.js','schemas/**/*.js'],
                //tasks:['jshint'],
                options:{
                    livereload:true
                }
            }
        },

        nodemon:{
            dev:{
                options:{
                    files:'app.js',
                    args:[],
                    ignoredFiles:['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedFolders:['./'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname
                }
            }
        },

        mochaTest: {
          options: {
            reporter: 'spec'
          },
          src: ['test/**/*.js']
        },

        less: {
          development: {
            options:{
              compress:true,//压缩的程度
              yuicompress:true,//什么样的压缩方式
              optimization: 2
            },
            files: {
              'public/build/index.css':'public/less/index.less'
            }
          }
        },

        uglify: {
          development: {
            files: {
              'public/build/admin.min.js':'public/js/admin.js',
              'public/build/detail.min.js':'public/js/detail.js',
            }
          }
        },

        concurrent:{
            tasks:['nodemon','watch','less','uglify'],
            options:{
                logConcurrentOutput:true
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-less');//less编译
    grunt.loadNpmTasks('grunt-contrib-uglify');//压缩

    grunt.option('force',true);
    grunt.registerTask('default',['concurrent']);
    grunt.registerTask('test',['mochaTest']);
}
