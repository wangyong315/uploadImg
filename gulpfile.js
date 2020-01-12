// var gulp = require('gulp')
// var browserSync = require('browser-sync')
// var reload = browserSync.reload

// gulp.task('serve', function () {
//   browserSync({
//     server: {
//       baseDir: 'app',
//       tunnel: true
//     },
//   })
//   gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
// })

var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function () {
  return gulp.src("app/orgin/index.js")// ES6 源码存放的路径 为 src 。**/*.js 表示 src 下面的所以 js
    .pipe(babel()) 
    .pipe(gulp.dest("app/scripts")); //转换成 ES5 存放的路径
});