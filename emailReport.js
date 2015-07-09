/*jslint nomen: true */
/*jslint node:true */
/*jslint vars: true */
/*jslint es5: true */


"use strict";

var cheerio = require('cheerio');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var moment = require("moment");
var cdlibjs = require("cdlibjs");
var path = require('path');
var _ = require('lodash');
var util = require('../budailyreportjs/lib/cdutils.js');

var emailList = JSON.parse(util.readFile('test/email.conf'));

cdlibjs.rabbitMQ.server = cdlibjs.getRabbitMQAddress();

//var srcFile = path.basename(argv.f);
var srcFile = argv.f;

fs.readFile('html/templateV2.html', 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    var s = cheerio.load(data);

    fs.readFile(srcFile, "utf8", function read(err, srcdata) {
        if (err) {
            throw err;
        }
        //console.log(srcdata.toString());
        var s1 = cheerio.load(srcdata),
            q = s1('body').html(),
            reportDateIndex = s1.html().indexOf('Date: '),
            reportDate = s1.html().substring(reportDateIndex, reportDateIndex + 20),
            rDate = moment(reportDate, "MM/DD/YY HH:mm").format("DD-MMM-YYYY HH:mm");
        //console.log(reportDate);
        s('div.backupreport').replaceWith(q);
        s('div.reportdate').text(rDate);

        var ss = s.html(),
            prequest = require('prequest');

//console.log(ss.xml());
        //writeFile("report.html",ss);


        prequest('http://backupreport.eu.mt.mtnet:8000/get/emails').then(function (body) {
            //console.log(body);
            return body;
        }).then(function (body) {
            _.forEach(body, function (val, key) {
                var tempMsgEmail = _.clone(cdlibjs, true);


                tempMsgEmail.from = "craig.david@mt.com";
                tempMsgEmail.smtpServer = "smtp.mt.com";
                tempMsgEmail.htmlData = s.html();
                tempMsgEmail.type = 'html';
                tempMsgEmail.subject = "Mettler Toledo Backup Control " + rDate;
                console.log(val);
                tempMsgEmail.to = val;
                cdlibjs.sendEmailHtml(tempMsgEmail);

                //cdlibjs.sendEMailToRabbit(cdlibjs.msgEmail);
                //console.log(cdlibjs.msgEmail);

    //addEmail("emailKey", val.name, val.email);

            });
            return body;
        }).then(function () {
            //fs.unlinkSync(replaceConfig.workingFile);
        }).catch(function (err) { // Any HTTP status >= 400 falls here
            console.error('Failed.', err.statusCode, ' >= 400');
            //fs.unlinkSync(replaceConfig.workingFile);
        });
        //cdlibjs.sendEMailToRabbit(cdlibjs.msgEmail);
    });
});

function writeFile(file, data) {
    var fs = require('fs');
    fs.writeFile(file, data,  "utf8",  function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}






