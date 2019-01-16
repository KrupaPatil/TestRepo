#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio'),
    revHash = require('rev-hash');

var rootDir = path.resolve(__dirname, '../');
var wwwRootDir = path.resolve(rootDir, 'www');
var buildDir = path.join(wwwRootDir, 'build');
var indexPath = path.join(wwwRootDir, 'index.html');

var cssPath = path.join(buildDir, 'main.css');
var cssFileHash = revHash(fs.readFileSync(cssPath));
var cssNewFileName = `main.${cssFileHash}.css`;
var cssNewPath = path.join(buildDir, cssNewFileName);
var cssNewRelativePath = path.join('build', cssNewFileName);

var jsPath = path.join(buildDir, 'main.js');
var jsFileHash = revHash(fs.readFileSync(jsPath));
var jsNewFileName = `main.${jsFileHash}.js`;
var jsNewPath = path.join(buildDir, jsNewFileName);
var jsNewRelativePath = path.join('build', jsNewFileName);

// rename main.css to main.[hash].css
fs.renameSync(cssPath, cssNewPath);

// rename main.js to main.[hash].js
fs.renameSync(jsPath, jsNewPath);

// update index.html to load main.[hash].css
$ = cheerio.load(fs.readFileSync(indexPath, 'utf-8'));

$('head link[href="build/main.css"]').attr('href', cssNewRelativePath);
$('body script[src="build/main.js"]').attr('src', jsNewRelativePath);

fs.writeFileSync(indexPath, $.html());
