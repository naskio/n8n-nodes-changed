const {src, dest} = require('gulp');

function copyAssets() {
	return src('nodes/**/*.{png,svg}')
		.pipe(dest('dist/nodes'));
}

exports.default = copyAssets;
