const 
	gulp = require("gulp"),
	M = {
		// fs           : require("fs"),
		browsersync  : require("browser-sync").create(),
		del          : require("del"),
		sass         : require("gulp-sass")(require('sass')),
		autoprefixer : require("gulp-autoprefixer"),
		sourcemaps   : require("gulp-sourcemaps"),
		rename       : require("gulp-rename"),
		incl         : require("gulp-h-include"),
	};

const
	SRC   = "src/",
	DST   = "build/",
	H_DST = "./";

const isDev = true;

const 
	build = gulp.parallel(html, css, images, fonts),
	defTask = gulp.series(
		clean, 
		build, 
		gulp.parallel(watch, browserSync),
	);

module.exports = {
	browserSync,
	html,
	css,
	images,
	fonts,
	watch,
	clean,
	build,
	default: defTask,
}

function browserSync(params) {
	M.browsersync.init({
		server: {
			baseDir: `./`+H_DST,
			port:    3000,
			notify:  false
		}
	});
}

function html() {
	return gulp.src(
		[SRC+"/html/**/*.html", "!"+SRC+"**/_*.html"], 
		{base: SRC+"/html"}
	)
		.pipe(M.incl())
		.pipe(gulp.dest(H_DST+""))
		.pipe(M.browsersync.stream());
}

function css() {
	return gulp.src(SRC+"css/style.scss", {"allowEmpty": true})
		.pipe(M.sourcemaps.init())
		.pipe(
			M.sass({
				outputstyle: "extended"
			})
		)
		.pipe(M.sourcemaps.write())
		.pipe(gulp.dest(DST+"css/"))
		.pipe(
			M.autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(
			M.rename({
				extname: ".min.css"
			})
		)
		.pipe(M.sourcemaps.write())
		.pipe(gulp.dest(DST+"css/"))
		.pipe(M.browsersync.stream());
}

function cS_CSS() {
	return gulp.src("contentSection/**/*.scss", {"allowEmpty": true})
		.pipe(M.sourcemaps.init())
		.pipe(
			M.sass({
				outputstyle: "extended"
			})
		)
		.pipe(M.sourcemaps.write())
		.pipe(gulp.dest("contentSection/"))
		.pipe(
			M.autoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(M.sourcemaps.write())
		.pipe(gulp.dest("contentSection/"))
		.pipe(M.browsersync.stream());
}

function cSJs() {
	return gulp.src("contentsSection/**/*.js")
		.pipe(M.browsersync.stream());
}

function images() {
	return gulp.src(SRC+"img/**/*.{jpg,png,svg,ico,M.webp}")
		.pipe(gulp.dest(DST+"img/"))
		.pipe(gulp.src(SRC+"img/**/*.{jpg,png,svg,ico,M.webp}"))
		.pipe(gulp.dest(DST+"img/"))
		.pipe(M.browsersync.stream());
}

function fonts() {
	return gulp.src(SRC+"fonts/**/*.{ttf,eot,otf,woff,woff2,svg,svgs}")
		.pipe(gulp.dest(DST+"fonts/"));
}

function watch() {
	gulp.watch([SRC+"**/*.html"   ], html  );
	gulp.watch([SRC+"css/**/*.*"  ], css   );
	// gulp.watch([SRC+"js/**/*.js"  ], js    );
	gulp.watch(["contentSection/**/*.js"  ], cSJs);
	gulp.watch(["contentSection/**/*.scss"  ], cS_CSS);
	gulp.watch([SRC+"img/**/*.*"  ], images);
	gulp.watch([SRC+"fonts/**/*.*"], fonts );
}

function clean () {
	return Promise.allSettled([
		M.del(DST+"css/"),
		M.del(DST+"fonts/"),
		M.del(DST+"img/"),
		M.del(H_DST+"*.html"),
	]);
}



