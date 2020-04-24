'use strict';

module.exports = {
	'/emp': {
		target: 'http://localhost:8080',
		changeOrigin: true,
		secure: false,
		pathRewrite: {
			'^/emp': 'emp'
		}
	}
}