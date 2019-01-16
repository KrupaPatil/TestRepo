#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var rootDir = path.resolve(__dirname, '../');
var configPath = path.resolve(rootDir, 'config.xml');
var versionPath = path.resolve(rootDir, 'www/assets/version.txt');

var config = fs.readFileSync(configPath, 'utf8');
var versionSearchTerm = 'version="';
var versionStartPosition = config.indexOf(versionSearchTerm) + versionSearchTerm.length;
var versionEndPosition = config.indexOf('"', versionStartPosition);
var version = config.substring(versionStartPosition, versionEndPosition);

fs.writeFileSync(versionPath, version);
