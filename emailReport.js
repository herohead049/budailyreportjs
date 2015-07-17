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

var emailReport = {
    template: 'html/templateV2.html',
    emailList: 'conf/email.conf',
    srcFile: argv.f
};

fs.readFile(emailReport.template, 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    var s = cheerio.load(data);

    fs.readFile(emailReport.srcFile, "utf8", function read(err, srcdata) {
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

        var ss = s.html();

        var email = util.readEmailConf(emailReport.emailList);
        _.forEach(email.to, function (val) {
            var tempMsgEmail = _.clone(cdlibjs, true);
            tempMsgEmail.from = email.from;
            tempMsgEmail.smtpServer = email.smtpServer;
            tempMsgEmail.htmlData = s.html();
            tempMsgEmail.type = 'html';
            tempMsgEmail.subject = email.subject + rDate;
            console.log("Sending email to", val);
            tempMsgEmail.to = val;
            cdlibjs.sendEmailHtml(tempMsgEmail);
        });
    });
});
