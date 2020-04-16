'use strict'
console.log(111111111111111111111111);
const loaderUtils = require('loader-utils');

module.exports = function(content) {
	this.cacheable(true);
	const options = loaderUtils.getOptions(this);

	if(options && !options.isHttpStg) {
		return content.replace(/\/\*\s*only-for-stg-start\s*\*\/[\s\S]*\/\*\s*only-for-stg-end\s*\*\//gi, '');
	} else {
		return content.replace(/\/\*\s*only-for-prd-start\s*\*\/[\s\S]*\/\*\s*only-for-prd-end\s*\*\//gi, '');
	}
}