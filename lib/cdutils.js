/*jslint nomen: true */
/*jslint node:true */

/*eslint-env node */
/*eslint quotes: [2, "single"], curly: 2*/
/*eslint no-shadow: 1 */

'use strict';

var fs = require('fs');
var chalk = require('chalk');
var moment = require('moment');
//var _ = require('lodash');



var c = {
    error: chalk.bold.red,
    success: chalk.bold.green,
    standard: chalk.bold.gray,
    disabled: chalk.underline.gray,
    fileSave: chalk.green,
    info: chalk.inverse.yellow
};

function writeFile(file, data) {
    //var fs = require('fs');
    fs.writeFile(file, data, function (err) {
        if (err) {
            return console.log(c.error(err));
        }
        //console.log("The file was saved!");
    });
}

function appendFile(file, data) {
    //var fs = require('fs');
    fs.appendFile(file, data, function (err) {
        if (err) {
            return console.log(c.error(err));
        }
        //console.log("The file was saved!");
    });
}

function appendFileSync(file, data) {
    //var fs = require('fs');
    var v = fs.appendFileSync(file, data);
    return v;
}

function writeConsole(processName, data) {
    console.log(chalk(moment().format(), processName, data));
}

function readFile(fileName) {
    var ret = fs.readFileSync(fileName);
    return ret.toString();
}


function readEmailConf(fileName) {
    var contents = JSON.parse(readFile(fileName));
    return contents;

}

exports.chalk = c;
exports.writeConsole = writeConsole;
exports.writeFile = writeFile;
exports.appendFile = appendFile;
exports.readFile = readFile;
exports.readEmailConf = readEmailConf;
