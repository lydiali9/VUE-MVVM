'use strict'

const loaderUtils = require('loader-utils');
const swig = require('swig');

module.exports = function(content) {
	this.cacheable && this.cacheable();
	var optsObj = loaderUtils.getOptions(this);
	content = resolve(this, optsObj);

	return prepareResult(content, optsObj);
}

function prepareResult(content, opts) {
	if(opts && opts.raw) return content;
	if(typeof content === 'string' && content.indexOf('module.exports') === 0) return  content;
	return 'module.exports = ' + JSON.stringify(content) + ';';
}

function resolve(context, optsObj) {
	var tpl, result;
	try {
		tpl = swig.compileFile(context.resourcePath);
		result = tpl(optsObj);
	} catch(e) {
		plugin.emitError('Could not resolve swig template. Cause: ' + e);
		return '';
	}

	return result;
}