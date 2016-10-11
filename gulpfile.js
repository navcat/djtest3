var yargs = require('yargs').argv;
var gulp = require('gulp'),
    chokidar = require('chokidar'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    cssminify = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),

    path = require('path'),

    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean');

// cache = require('gulp-cache'),
// livereload = require('gulp-livereload');


// 构建后的目标地址
var dist = path.join(__dirname, 'assets'),
    option = { base: 'static' };

/**
 * 处理CSS文件
 * @param  {[glob]} path [src路径]
 */
function taskCss(path) {
    return gulp.src(path)
        .pipe(sass({ style: 'expanded' }).on('error', function(e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        // 解析sass到当前目录下对应的css
        .pipe(gulp.dest(function(file){
            return __dirname;
        }))
        // 更改目录
        .pipe(rename(function(path) {
            path.dirname = path.dirname.split('static')[1];
        }))
        .pipe(gulp.dest(dist))
        .pipe(cssminify())
        // 重新命名
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist))
        .pipe(notify({ message: 'Styles task complete' }));
}

/**
 * 处理JS文件
 * @param  {[glob]} path [src路径]
 *
 * todo 将scss/css分别存放
 */
function taskJs(path) {
    return gulp.src(path)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        // .pipe(concat('main.js'))
        // 更换目录
        .pipe(rename(function(path) {
            path.dirname = path.dirname.split('static')[1];
        }))
        .pipe(gulp.dest(dist))
        .pipe(uglify().on('error', function(e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(rename({ suffix: '.min' })) //rename压缩后的文件名
        .pipe(gulp.dest(dist))
        .pipe(notify({ message: 'Js task complete' }));
}

/**
 * 处理图片文件
 * @param  {[glob]} path [src路径]
 */
function taskImages(path) {
    return gulp.src(path)
        // .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }).on('error', function(e){
        //     console.log(e.message);
        //     this.emit('end');
        // }))
        // 更换目录
        .pipe(rename(function(path) {
            path.dirname = path.dirname.split('static')[1];
        }))
        .pipe(gulp.dest(dist))
        .pipe(notify({ message: 'Images task complete' }));
}

/**
 * 复制其他文件
 * @param  {[glob]} path [src路径]
 */
function taskFileTransfer(path) {
    return gulp.src(path)
        // 更换目录
        .pipe(rename(function(path) {
            path.dirname = path.dirname.split('static')[1];
        }))
        .pipe(gulp.dest(dist))
        .pipe(notify({ message: 'File transfer task complete' }));
}

// 压缩并处理CSS文件
gulp.task('styles', function() {
    return taskCss('./**/static/**/*.scss');
});

// 压缩并处理js相关文件
gulp.task('scripts', function() {
    return taskJs('./**/static/**/*.js');
});

// 压缩并处理图片文件
gulp.task('images', function() {
    return taskImages('./**/static/**/img/**/*');
});

// 清除目标文件夹中的内容
gulp.task('clean', function() {
    // read: false不会去读取文件
    return gulp.src('assets/*', { read: false })
        .pipe(clean())
        .pipe(notify({ message: 'Assets clean task complete' }));
});

// 复制非图片/JS/CSS文件到目标文件夹
gulp.task('transfer', function() {
    return taskFileTransfer('./**/static/**/common/**/*');
});


// release 整个项目
gulp.task('release', ['clean', 'styles', 'scripts', 'images', 'transfer'], function() {
    notify({ message: 'Project release complete' });
});


// watch
gulp.task('watch', function() {

    // 1，sass处理
    gulp.watch('./**/static/**/*.scss', function(event) {
        console.log('>>>>> scss ' + event.path + ' was ' + event.type + ', running tasks...');
        taskCss(event.path);
    });

    // 2，js处理
    gulp.watch('./**/static/**/*.js', function(event) {
        console.log('>>>>> js ' + event.path + ' was ' + event.type + ', running tasks...');
        taskJs(event.path);
    });

    // 3，图片处理
    gulp.watch('./**/static/**/img/**/*', function(event) {
        console.log('>>>>> img ' + event.path + ' was ' + event.type + ', running tasks...');
        taskImages(event.path);
    });

    // 4，其他文件处理
    gulp.watch('./**/static/**/common/**/*', function(event) {
        console.log('>>>>> file ' + event.path + ' was ' + event.type + ', running tasks...');
        taskFileTransfer(event.path);
    });

});



// 启动server
gulp.task('server', function() {
    var app = express();
    var port = yargs.p || yargs.port || 8080;
    app.use(express.static(dist));
    app.listen(port, function() {
        port = port === 80 ? '' : ':' + port;
        var url = 'http://127.0.0.1' + port;
        console.log(url);
    });
});


// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -c: 清除目标文件夹的所有内容
//  -p: 服务器启动端口，默认8080
gulp.task('default', function() {
    if (yargs.s) {
        gulp.start('release');
    } else {
        gulp.start('watch');
    }
    if (yargs.s) {
        gulp.start('server');
    }
});
