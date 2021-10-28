const { src, dest } = require("gulp");
const fs = require('fs');
const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const scss = require('gulp-sass')(require('sass'));
const group_media = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const del = require("del");
// const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const clean_css = require("gulp-clean-css");
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');

const webpack = require('webpack-stream');
const gulpif = require('gulp-if');

const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const pugLintStylish = require('puglint-stylish'); // стилизация ошибок

const webp = require('imagemin-webp');
const webpcss = require("gulp-webpcss");
const webphtml = require('gulp-webp-html');

const fonter = require('gulp-fonter');

const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const project_name = require("path").basename(__dirname);
const src_folder = "#src";

const path = {
  build: {
    html: project_name + "/",
    js: project_name + "/js/",
    css: project_name + "/css/",
    images: project_name + "/img/",
    fonts: project_name + "/fonts/"
  },
  src: {
    favicon: src_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
    pug2html: src_folder + "/",
    sprite: src_folder + "/img/",
    html: [src_folder + "/*.html", "!" + src_folder + "/_*.html"],
    jsentry: src_folder + "/js/script.js",
    js: src_folder + "/js/*.js",
    jstomin: src_folder + "/js/js-to-min/*.js",
    jstominout: src_folder + "/js/js-to-min/output/",
    css: src_folder + "/scss/style.scss",
    images: [src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
    imageswebp: src_folder + "/img/**/*.{jpg,png}",
    imagessvg: [src_folder + "/img/**/*.{svg,ico}", "**/favicon.*"],
    fonts: src_folder + "/fonts/*.ttf",
    pug: src_folder + "/pug/*.pug",
  },
  watch: {
    html: src_folder + "/**/*.html",
    js: src_folder + "/js/*.js",
    css: src_folder + "/scss/**/*.scss",
    images: src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    pug: src_folder + "/pug/**/*.pug"
  },
  clean: "./" + project_name + "/"
};

const isDev = true; // ставим в false когда нужен будет финальный проект (в true создается sourcemap, и файл не сильно ужат)
const isProd = !isDev;
let webConfig = {
  output: {
    filename: 'script.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }]
  },
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'none'
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./" + project_name + "/"
    },
    notify: false,
    port: 3000,
  });
}

function pugLinterControl() { // проверяет на ошибки pug файлы
  return src(path.src.pug, {})
    .pipe(pugLinter({
      reporter: pugLintStylish,
      silenceOnSuccess: true,
      failAfterError: true
    }));
}

function pug2html() { // конвертит .pug в .html
  return src(path.src.pug, {})
    .pipe(plumber())
    .pipe(pug({
      pretty: true // не в одну строку, а как привычно
    }))
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css, {})
    // .pipe(plumber())
    .pipe(
      scss({
        outputStyle: "expanded"
      })
    )
      // ошибка "Cannot read property '0' of null" вылазит если в названии файла картинки есть пробел, или тег IMG пустой (даже в комментах)
    .pipe(webpcss({
      webpClass: "",
      noWebpClass: "._no-webp"  //webpcss идет вначале, иначе он добавляется в конце и не поменять некоторые св-ва
    }))
    .pipe(plumber())
    .pipe(group_media())
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(dest(path.build.css))
    .pipe(gulpif(isProd, clean_css({
      level: 2
    })))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.jsentry, {})
    .pipe(webpack(webConfig)) // минификатор, sourcemap(development) встроен по-умолчанию в webpack
    .pipe(dest(path.build.js))
    .pipe(src([src_folder + "/js/**/*.js", "!" + src_folder + "/js/script.js"]))
    .pipe(newer(path.build.js))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
	return src(path.src.imageswebp)
		.pipe(newer(path.build.images))
		// .pipe(
		// 	imagemin([
		// 		webp({
		// 			quality: 85
		// 		})
		// 	])
		// )
		.pipe(
			rename({
				extname: ".webp"
			})
		)
		.pipe(dest(path.build.images))
		.pipe(src(path.src.images))
		.pipe(newer(path.build.images))
		// .pipe(
		// 	imagemin({
		// 		progressive: true,
		// 		svgoPlugins: [{ removeViewBox: false }],
		// 		interlaced: true,
		// 		optimizationLevel: 3 // 0 to 7
		// 	})
		// )
		.pipe(dest(path.build.images));
}

// запускаем вручную

// task для создания спрайта из svg
// запускаем gulp и в соседнем окне вводим gulp svgSprite
// есть example для подключения спрайта
gulp.task('svgSprite', function () {
  return gulp.src('./' + src_folder + '/iconsprite/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../icons/icons.svg", // sprite filename
          example: true // образец подключения смотрим код html в папке stack
        }
      }
    }))
    .pipe(dest(path.src.sprite));
});
function favicon() {
  return src(path.src.favicon)
    .pipe(newer(path.build.html))
    .pipe(plumber())
    .pipe(
      rename({
        extname: ".ico"
      })
    )
    .pipe(dest(path.build.html));
}
function fonts() {
  src(path.src.fonts)
    .pipe(newer(path.build.fonts))
    .pipe(plumber())
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(newer(path.build.fonts))
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream());
}

function fonts_otf() {
  return src('./' + src_folder + '/fonts/*.otf')
    .pipe(plumber())
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(gulp.dest('./' + src_folder + '/fonts/')); // выкидывает готовые файлы ttf в корень #src! сразу в fonts не получается
}

function fontstyle() {
  let file_content = fs.readFileSync(src_folder + '/scss/fonts.scss');
  if (file_content == '') {
    fs.writeFile(src_folder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(src_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    });
  }
}
function jstomin() {
	return src(path.src.jstomin, {})
    .pipe(uglify())
    .pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.src.jstominout));
}

function cb() {}

function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch([path.watch.pug], pugLinterControl);
  gulp.watch([path.watch.pug], pug2html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
}
let build = gulp.series(clean,  gulp.parallel(pugLinterControl, pug2html, images, css, js, favicon, fonts), fontstyle); // fontstyle обязательно в gulp.series в конце
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.pugLinterControl = pugLinterControl;
exports.pug2html = pug2html;
exports.css = css;
exports.js = js;
exports.jstomin = jstomin;
exports.favicon = favicon;
exports.fonts_otf = fonts_otf;
exports.fontstyle = fontstyle;
exports.fonts = fonts;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;