/*jslint nomen: true */
/*jslint node:true */

"use strict";

var cdlib = require("cdlib");
var moment = require("moment-timezone");
var replace = require("replace");
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var shortid = require('shortid');
var _ = require('lodash');

function replaceInFile(searchFor, replaceTo, fileName) {

    replace({
        regex: searchFor,
        replacement: replaceTo,
        paths: [fileName],
        recursive: false,
        silent: true
    });
}

var replaceConfig = {
    region: "",
    timeZone: "",
    regionName: "",
    fileName: "",
    template: "D:/scripts/js/BUdailyReport/html/template.html",
    //template: "D:/owncloud/js/BUdailyReportjs/html/template.html",
    workingFile: "D:/scripts/js/BUdailyReport/html/working_" + shortid.generate() + ".html",
    //workingFile: "D:/owncloud/js/BUdailyReportjs/html/working_" + shortid.generate() + ".html",
    webDir: ''
};

replaceConfig.fileName = path.basename(argv.f);
replaceConfig.region = argv.r;

switch (replaceConfig.region) {
case 'EU':
    replaceConfig.regionName = 'EU Region';
    replaceConfig.timeZone = 'Europe/Zurich';
    replaceConfig.webDir = "http://backupreport.eu.mt.mtnet/EUreport/reportcard/" + replaceConfig.fileName;
    break;
case 'AP':
    replaceConfig.regionName = 'AP Region';
    replaceConfig.timeZone = 'Asia/Kuala_Lumpur';
    replaceConfig.webDir = "http://backupreport.eu.mt.mtnet/APreport/reportcard/" + replaceConfig.fileName;
    break;
case 'AM':
    replaceConfig.regionName = 'AM Region';
    replaceConfig.timeZone = 'America/New_York';
    replaceConfig.webDir = "http://backupreport.eu.mt.mtnet/AMreport/reportcard/" + replaceConfig.fileName;
    break;
}

function startReplace() {

    replaceInFile('<<reportdate>>', moment().tz(replaceConfig.timeZone), replaceConfig.workingFile);
    replaceInFile('<<directorytoLatest>>', replaceConfig.webDir, replaceConfig.workingFile);
    replaceInFile('<<region>>', replaceConfig.regionName, replaceConfig.workingFile);

    fs.readFile(replaceConfig.workingFile, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        cdlib.msgEmail.htmlData = data;
        cdlib.msgEmail.type = 'html';
        cdlib.msgEmail.subject = "Backup Report Card for - " + replaceConfig.regionName;
        var prequest = require('prequest');

        prequest('http://us01w-davidc:3000/get/emails').then(function (body) {
  console.log(body);
            //consoole.log(body);
            return body;
        }).then(function (body) {
            var timeout = 1;
            
            _.forEach(body, function (val, key) {
                console.log(val);
                cdlib.msgEmail.to = to;
                cdlib.msgEmail.route = 'email'
                cdlib.sendEMailToRabbit(msgEmail);

    //addEmail("emailKey", val.name, val.email);
                
            });
            //return;
        }).then(function () {
            fs.unlinkSync(replaceConfig.workingFile);
        }).catch(function (err) { // Any HTTP status >= 400 falls here
            console.error('Failed.', err.statusCode, ' >= 400');
            fs.unlinkSync(replaceConfig.workingFile);
        });
        
        
        
        //cdlib.msgEmail.sendToRabbit();
        //fs.unlinkSync(replaceConfig.workingFile);
    });

}

function copyFile(source, target, cb) {
    var cbCalled = false,
        rd = fs.createReadStream(source),
        wr = fs.createWriteStream(target);
    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
    rd.on("error", function (err) {
        done(err);
    });

    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
        done();
    });
    rd.pipe(wr);
}



copyFile(replaceConfig.template, replaceConfig.workingFile, function () {
    startReplace();
});
