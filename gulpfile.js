var gulp = require("gulp")
var sass = require("gulp-sass")
var autoprefixer = require("gulp-autoprefixer")
var sourcemaps = require("gulp-sourcemaps")
var browserSync = require("browser-sync")
var useref = require("gulp-useref")
var uglify = require("gulp-uglify")
var gulpIf = require("gulp-if")
var cssnano = require("gulp-cssnano")
var rename = require("gulp-rename")
var imagemin = require("gulp-imagemin")
var cache = require("gulp-cache")
var del = require("del")
var runSequence = require("run-sequence")

var htmlmin = require("gulp-htmlmin")
var fs = require("fs")
var gutil = require("gulp-util")
var filter = require("gulp-filter")
var tap = require("gulp-tap")

// Development Tasks
// -----------------

// Start browserSync server
gulp.task("browserSync", function() {
	browserSync({
		server: {
			baseDir: "app",
		},
	})
})

gulp.task("sass", function() {
	return gulp
		.src("app/sass/**/*.scss") // Gets all files ending with .scss in app/scss and children dirs
		.pipe(sass()) // Passes it through a gulp-sass
		.pipe(gulp.dest("app/css")) // Outputs it in the css folder
		.pipe(
			browserSync.reload({
				// Reloading with Browser Sync
				stream: true,
			})
		)
})

// Watchers
gulp.task("watch", function() {
	gulp.watch("app/sass/**/*.scss", ["sass"])
	gulp.watch("app/*.html", browserSync.reload)
	gulp.watch("app/js/**/*.js", browserSync.reload)
})

// Optimization Tasks
// ------------------

// Optimizing HTML, CSS and JavaScript
gulp.task("useref", function() {
	return gulp
		.src("app/*.html")
		.pipe(useref())
		.pipe(gulpIf("*.js", uglify()))
		.pipe(gulpIf("*.css", cssnano()))
		.pipe(
			gulpIf(
				"*.html",
				htmlmin({ collapseWhitespace: true, removeComments: true })
			)
		)
		.pipe(gulp.dest("dist"))
})

// Optimizing Images
gulp.task("images", function() {
	return (gulp
			.src("app/img/**/*.+(png|jpg|jpeg|gif|svg)")
			// Caching images that ran through imagemin
			.pipe(
				cache(
					imagemin({
						interlaced: true,
					})
				)
			)
			.pipe(gulp.dest("dist/img")) )
})

gulp.task("copyOther", function() {
	return gulp.src("app/icons/*").pipe(gulp.dest("dist/icons"))
})

// Copying fonts
gulp.task("fonts", function() {
	return gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"))
})

// Cleaning
gulp.task("clean", function() {
	return del.sync("dist").then(function(cb) {
		return cache.clearAll(cb)
	})
})

gulp.task("clean:dist", function() {
	return del.sync(["dist/**/*", "!dist/images", "!dist/images/**/*"])
})

// Build Sequences
// ---------------

gulp.task("default", function(callback) {
	runSequence(["sass", "browserSync", "watch"], callback)
})

gulp.task("build", function(callback) {
	runSequence("clean:dist", "sass", ["useref", "fonts", "images"], callback)
})

gulp.task("themify", function() {
	generateTheme(gutil.env.color)
})

gulp.task("themifyAll", function() {
	var colorList = fs.readFileSync("colors.txt").toString().split("\n")
	colorList = colorList
	colorList.filter(color => color).reduce(function(promise, color, i) {
		return promise.then(() => generateTheme(color, i))
	}, Promise.resolve())
})

function generateTheme(color, themeNumber) {
	return new Promise(function(resolve, reject) {
		var colorValue = color //|| gutil.env.color || 'green';
		themeNumber = !themeNumber && themeNumber != 0 ? colorValue : themeNumber
		console.log("Generating Theme for ", colorValue)
		fs.writeFileSync(
			"app/sass/_settings.scss",
			"$primaryColor: " + colorValue + ";"
		)
		gulp
			.src("app/sass/**/*.scss") // Gets all files ending with .scss in app/scss and children dirs
			.pipe(sass()) // Passes it through a gulp-sass
			.pipe(gulp.dest("app/css")) // Outputs it in the css folder
			.on("end", function() {
				gulp
					.src("app/index.html")
					.pipe(useref())
					.pipe(gulpIf("*.css", cssnano()))
					.pipe(filter(["*", "**/*.css"]))
					.pipe(rename("custom." + themeNumber + ".css"))
					.pipe(gulp.dest("dist/css"))
					.on("end", function() {
						resolve()
						browserSync.reload({
							// Reloading with Browser Sync
							stream: true,
						})
					})
			})
	})
}
