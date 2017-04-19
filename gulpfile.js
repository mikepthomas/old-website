/* 
 * Copyright (c) 2016, Mike Thomas
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'inject']
});
var tsProject = plugins.typescript.createProject("tsconfig.json");

gulp.task('css', function () {
    var injectGlobalFiles = gulp.src('src/sass/global/*.scss', {read: false});
    var injectAppFiles = gulp.src('src/sass/styles/*.scss', {read: false});

    function transformFilepath(filepath) {
        return '@import "' + filepath + '";';
    }

    var injectGlobalOptions = {
        transform: transformFilepath,
        starttag: '// inject:global',
        endtag: '// endinject',
        addRootSlash: false
    };

    var injectAppOptions = {
        transform: transformFilepath,
        starttag: '// inject:app',
        endtag: '// endinject',
        addRootSlash: false
    };

    return gulp.src('src/sass/main.scss')
            .pipe(wiredep())
            .pipe(plugins.inject(injectGlobalFiles, injectGlobalOptions))
            .pipe(plugins.inject(injectAppFiles, injectAppOptions))
            .pipe(plugins.sass())
            .pipe(plugins.autoprefixer())
            .pipe(gulp.dest('css'))
            .pipe(plugins.rename({suffix: '.min'}))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.cleanCss())
            .pipe(plugins.sourcemaps.write('.', {
                includeContent: false,
                sourceRoot: '.',
                mapSources: function (sourcePath) {
                    return sourcePath.replace('.min', '');
                }
            }))
            .pipe(gulp.dest('css'));
});

gulp.task('docs', function (cb) {
    var config = require('./jsdoc.json');
    gulp.src(['README.md', 'js/**/*.js'], {read: false})
        .pipe(plugins.jsdoc3(config, cb));
});

gulp.task('js', function () {
    var tsResult = tsProject.src()
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject());

    return tsResult.js
        .pipe(gulp.dest('js'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: '../src/js',
            mapSources: function (sourcePath) {
                return sourcePath.replace('.min', '');
            }
        }))
        .pipe(gulp.dest('js'));
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.scss', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('default', ['css', 'js'], function () {
    var injectFiles = gulp.src('css/*.min.css');

    var injectOptions = {
        addRootSlash: false
    };

    return gulp.src('index.html')
            .pipe(plugins.inject(injectFiles, injectOptions))
            .pipe(gulp.dest('.'));
});
