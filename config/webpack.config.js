const chalk = require('chalk');
const fs = require('fs');
var path = require('path');

const commonConfig = require('@ionic/app-scripts/config/webpack.config.js');

var env = process.env.IONIC_ENV;

commonConfig[env].resolve.alias = {
  "@app/env": path.resolve(environmentPath(env))
};

function environmentPath(env) {
  var filePath = './src/environments/environment' + (env === 'prod' ? '' : '.' + env) + '.ts';
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}
