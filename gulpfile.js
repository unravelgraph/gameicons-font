
const fs = require('fs');

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

const ghPages = require('gulp-gh-pages');

const FONT_NAME = 'game-icons';

gulp.task('build:font', () => {
    return gulp.src(['./icons/**/*.svg'])
        .pipe(iconfontCss({
            fontName: FONT_NAME,
            formats: ['ttf', 'eot', 'woff'],
            targetPath: 'game-icons.css'
        }))
        .pipe(iconfont({
            fontName: FONT_NAME
        }))
        .on('glyphs', (glyphs) => {
            fs.writeFile('./test/data/glyphs.json', JSON.stringify(glyphs));
        })
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('test/css/'));
});

gulp.task('deploy', () => {
    return gulp.src('./test/**/*')
        .pipe(ghPages());
});