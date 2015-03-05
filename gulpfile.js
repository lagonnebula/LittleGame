var gulp        = require('gulp'),
    less        = require('gulp-less'),
    minify      = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    plumber     = require('gulp-plumber'),
    jshint      = require('gulp-jshint'),
    notify      = require('gulp-notify'),
    connect     = require('gulp-connect');

gulp.task('default',['watch']);
gulp.task('webserver', function(){
   connect.server({
       root         :   "dist"
   });
});

var path = {
    'src'   :   {
        'less'  :   './src/less/',
        'js'    :   './src/js/',
        'img'   :   './src/img/',
        'vendor':   './src/components/'
    },
    'dist'  :   {
        'css'   :   './dist/assets/css/',
        'js'    :   './dist/assets/js/',
        'vendor':   './dist/libs/'
    }
}

gulp.task('buildcss', function(){
    gulp.src(path.src.less+'**/*.less')
        .pipe(plumber())
        .pipe(concat("index.css"))
        .pipe(less({
            paths: [path.dist.css]
        }))
        .pipe(gulp.dest(path.dist.css))
        .pipe(notify({ message: 'Finished building css'}));
});

gulp.task('buildjs', function(){
    gulp.src(path.src.js+'**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //.pipe(concat("game.min.js"))
        //.pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
        .pipe(notify({ message: 'Finished minifying JavaScript'}));
});

gulp.task('watch', function() {
    gulp.watch(path.src.less+'**/*.less', ['buildcss']);
    gulp.watch(path.src.js+'**/*.js', ['buildjs']);
});