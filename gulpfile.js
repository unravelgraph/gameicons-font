
const fs = require('fs');
const minimatch = require('minimatch');

const gulp = require('gulp');
const unzip = require('gulp-unzip');
const rename = require('gulp-rename');
const raster = require('gulp-raster');
const download = require('gulp-download');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

const ghPages = require('gulp-gh-pages');

const BASE_URL = 'http://game-icons.net/archives/svg/zip/000000/transparent/game-icons.net.svg.zip';
const FONT_NAME = 'game-icons';

const unzipOptions = {
  filter: (entry) => minimatch(entry.path, '**/*.svg')
};

const fileCounts = {};

const renamePredicate = (extname) => (path) => {
  path.dirname = '';
  path.extname = `.${extname}`;
  if(fileCounts[path.basename]) {
    fileCounts[path.basename] += 1;
    path.basename = `${path.basename}-${fileCounts[path.basename]}`;
  } else {
    fileCounts[path.basename] = 1;
  }
  return path;
};

gulp.task('build:images', () => {
    return download(BASE_URL)
        .pipe(unzip(unzipOptions))
        .pipe(raster())
        .pipe(rename(renamePredicate('png')))
        .pipe(gulp.dest('test/png/'));
});

gulp.task('build:font', () => {

    return download(BASE_URL)
        .pipe(unzip(unzipOptions))
        .pipe(rename(renamePredicate('svg')))
        .pipe(gulp.dest('test/svg/'))
        .pipe(iconfontCss({
            fontName: FONT_NAME,
            formats: ['ttf', 'eot', 'woff'],
            targetPath: 'game-icons.css',
            cssClass: 'game-icon'
        }))
        .pipe(iconfont({
            fontName: FONT_NAME,
            startUnicode: 0xFF000,
            normalize: true
        }))
        .on('glyphs', (glyphs) => {
            fs.writeFile('./test/data/glyphs.json', JSON.stringify(glyphs));
        })
        .pipe(gulp.dest('dist/'))
        .pipe(gulp.dest('test/css/'));
});

gulp.task('deploy', () => {

    const opts = {};
    console.log('HERELLASDFAD', !!process.env.GH_TOKEN)
    if(process.env.GH_TOKEN) {
        opts.remoteUrl = `https://${process.env.GH_TOKEN}@github.com/seiyria/gameicons-font.git`;
    }

    return gulp.src('./test/**/*')
        .pipe(ghPages(opts));
});
