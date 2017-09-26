'use strict';

var gulp        = require('gulp'),
    data        = require('gulp-data'),
    twig        = require('gulp-twig'),
    rigger      = require('gulp-rigger'),
    sass        = require('gulp-sass'),
    cssmin      = require('gulp-minify-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    spritesmith = require('gulp.spritesmith'),
    plumber     = require('gulp-plumber'),
    prefixer    = require('gulp-autoprefixer'),

    browserSync = require("browser-sync"),
    reload = browserSync.reload;


var _GLOBAL_PATHS = {
    build  : 'app-public/',
    source : 'app-source/'
}

var config = {
    server: {
        baseDir: _GLOBAL_PATHS.build
    },
    tunnel: true,
    host: 'localhost',
    port: 8080,
};

var CONFIG = {
    ASSETS : _GLOBAL_PATHS.build + 'Assets/',
};

var PATHS = {
    BUILD : {
        maps   : 'maps',
        js     : CONFIG.ASSETS + 'scripts',
        css    : CONFIG.ASSETS + 'styles',
        fonts  : CONFIG.ASSETS + 'fonts',
        images : CONFIG.ASSETS + 'images',
        html   : _GLOBAL_PATHS.build
    },

    SOURCE : {
        js     : [
            _GLOBAL_PATHS.source + 'app-scripts/app.js'
            ],
        css    : [
            _GLOBAL_PATHS.source + 'app-stylesheets/app.scss'
            ],
        fonts  : _GLOBAL_PATHS.source + 'app-fonts/**/*.*',
        images : _GLOBAL_PATHS.source + 'app-images/**/*.*',
        sprite : _GLOBAL_PATHS.source + 'app-sprite/*.*',
        html   : _GLOBAL_PATHS.source + 'app-html/**/*.html',
        twig   : _GLOBAL_PATHS.source + 'app-twig/*.twig',
    },

    WATCH : {
        js     : _GLOBAL_PATHS.source + 'app-scripts/**/*.js',
        css    : _GLOBAL_PATHS.source + 'app-stylesheets/**/*.scss',
        fonts  : _GLOBAL_PATHS.source + 'app-fonts/**/*.*',
        images : _GLOBAL_PATHS.source + 'app-images/**/*.*',
        sprite : _GLOBAL_PATHS.source + 'app-sprite/**/*.*',
        html   : _GLOBAL_PATHS.source + 'app-html/**/*.html',
        twig   : _GLOBAL_PATHS.source + 'app-twig/**/*.twig',
    }
};

/* ------------------------------------------------------------ */

/* Build javascripts */
gulp.task('js:build', function () {
    gulp.src(PATHS.SOURCE.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write(PATHS.BUILD.maps))
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATHS.BUILD.js))
        .pipe(reload({stream: true}))
});

/* Build styles */
gulp.task('styles:build', function () {
    gulp.src(PATHS.SOURCE.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write(PATHS.BUILD.maps))
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATHS.BUILD.css))
        .pipe(reload({stream: true}))
});

/* Build images */
gulp.task('image:build', function () {
    gulp.src(PATHS.SOURCE.images)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATHS.BUILD.images))
        .pipe(reload({stream: true}))
});

/* Build sprites */
gulp.task('sprite:build', function() {
    var spriteData =
        gulp.src(PATHS.SOURCE.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                padding: 20,
                imgPath: '../images/',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }))

    spriteData.img.pipe(gulp.dest(PATHS.BUILD.images));
    spriteData.css.pipe(gulp.dest(_GLOBAL_PATHS.source + 'app-stylesheets'));
});

/* Copy fonts  */
gulp.task('fonts:build', function() {
    gulp.src(PATHS.SOURCE.fonts)
        .pipe(gulp.dest(PATHS.BUILD.fonts))
        .pipe(reload({stream: true}))
});

/* Html build */
gulp.task('html:build', function () {
    gulp.src(PATHS.SOURCE.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(plumber.stop())
        .pipe(gulp.dest(PATHS.BUILD.html))
        .pipe(reload({stream: true}))
});

gulp.task('twig:build', function () {
    gulp.src(PATHS.SOURCE.twig)
        .pipe(twig())
        .pipe(gulp.dest(PATHS.BUILD.html));
});

/* Start Browsersync server */
gulp.task('server', function () {
    browserSync(config);
});

/* Full build */
gulp.task('build', [
    'js:build',
    'image:build',
    'sprite:build',
    'styles:build',
    'fonts:build',
    'html:build',
    'twig:build'
]);

gulp.task('watch', function(){
    watch([PATHS.WATCH.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([PATHS.WATCH.images], function(event, cb) {
        gulp.start('image:build');
    });
    watch([PATHS.WATCH.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });
    watch([PATHS.WATCH.css], function(event, cb) {
        gulp.start('styles:build');
    });
    watch([PATHS.WATCH.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([PATHS.WATCH.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([PATHS.WATCH.twig], function(event, cb) {
        gulp.start('twig:build');
    });
});

gulp.task('default', ['build', 'watch']);