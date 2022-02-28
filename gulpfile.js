const {src, dest} = require('gulp');

function copyAssets() {
	src('nodes/**/*.{png,svg}')
		.pipe(dest('dist/nodes'))

	return src('credentials/**/*.{png,svg}')
		.pipe(dest('dist/credentials'));
}

exports.default = copyAssets;
