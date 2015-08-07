/*jslint nomen: true */
/*jslint node:true */
/*jslint vars: true */
/*jslint es5: true */

/*eslint-env node */
/*eslint quotes: [2, "single"], curly: 2*/
/*eslint no-shadow: 0 */

'use strict';

var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var moment = require('moment');
var cdlibjs = require('cdlibjs');
//var path = require('path');
var _ = require('lodash');
var util = require('../budailyreportjs/lib/cdutils.js');

var emailReport = {
    template: 'html/template.html',
    emailList: 'conf/email.conf',
    srcFile: argv.f
};

var que = async.queue(function (e, callback) {
    cdlibjs.sendEmailHtml(e.email);
    //console.log('hello ' + task.name);
    callback();
}, 1);

function addToEmailQueue(eMsg) {
            que.push({email: eMsg}, function (err) {
            if (err) {
                console.log(err);
            }
                console.log('finished processing email', eMsg.to);
        });
}


//console.log(que);




fs.readFile(emailReport.template, 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    var s = cheerio.load(data);

    fs.readFile(emailReport.srcFile, 'utf8', function read(err, srcdata) {
        if (err) {
            throw err;
        }
        //console.log(srcdata.toString());
        var s1 = cheerio.load(srcdata),
            q = s1('body').html(),
            reportDateIndex = s1.html().indexOf('Date: '),
            reportDate = s1.html().substring(reportDateIndex, reportDateIndex + 20),
            rDate = moment(reportDate, 'MM/DD/YY HH:mm').format('DD-MMM-YYYY HH:mm');
        //console.log(reportDate);
        s('div.backupreport').replaceWith(q);
        s('div.reportdate').text(rDate);

        //var ss = s.html();


        que.drain = function() {
            console.log('all items have been processed');
        };
        var email = util.readEmailConf(emailReport.emailList);
        var toList = '';
        _.forEach(email.to, function (val) {
            toList = toList + val + ',';

        });

        console.log(toList.replace(/,\s*$/, ''));
        //process.exit();
        var tempMsgEmail = _.clone(cdlibjs, true);
        tempMsgEmail.from = email.from;
        //tempMsgEmail.smtpServer = email.smtpServer;
        tempMsgEmail.smtpServer = 'localhost';
        tempMsgEmail.htmlData = s.html();
        tempMsgEmail.type = 'html';
        tempMsgEmail.subject = email.subject + rDate;
        //console.log('Sending email to', val);
        tempMsgEmail.to = toList.replace(/,\s*$/, '');
        //cdlibjs.sendEmailHtml(tempMsgEmail);
        addToEmailQueue(tempMsgEmail);
    });
});




// add some items to the queue



