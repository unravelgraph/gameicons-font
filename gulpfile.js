
const fs = require('fs');
const minimatch = require('minimatch');

const gulp = require('gulp');
const unzip = require('gulp-unzip');
const rename = require('gulp-rename');
const download = require('gulp-download');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

const ghPages = require('gulp-gh-pages');

const BASE_URL = 'http://game-icons.net/archives/svg/zip/000000/transparent/game-icons.net.svg.zip';
const FONT_NAME = 'game-icons';

gulp.task('build:font', () => {
    const fileCounts = {};

    return download(BASE_URL)
        .pipe(unzip({
          filter: (entry) => minimatch(entry.path, '**/*.svg')
        }))
        .pipe(rename(path => {
          if(fileCounts[path.basename]) {
            fileCounts[path.basename] += 1;
            path.basename = `${path.basename}-${fileCounts[path.basename]}`;
          } else {
            fileCounts[path.basename] = 1;
          }
          return path;
        }))
        .pipe(iconfontCss({
            fontName: FONT_NAME,
            formats: ['ttf', 'eot', 'woff'],
            targetPath: 'game-icons.css',
            cssClass: 'game-icon'
        }))
        .pipe(iconfont({
            fontName: FONT_NAME,
            normalize: true
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
