/*jslint nomen: true */
/*jslint node:true */

"use strict";

var cheerio = require('cheerio');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var moment = require("moment");
var cdlibjs = require("cdlibjs");
var path = require('path');
var _ = require('lodash');
var S = require('string');
var prequest = require('prequest');

cdlibjs.rabbitMQ.server = cdlibjs.getRabbitMQAddress();

       prequest('http://backupreport.eu.mt.mtnet:8000/get/testEmails').then(function (body) {
            //console.log(body);
            return body;
        }).then(function (body) {
            _.forEach(body, function (val, key) {
                cdlibjs.msgEmail.from = "craig.david@mt.com";
                cdlibjs.msgEmail.smtpServer = "smtp.mt.com";
                cdlibjs.msgEmail.htmlData = "This is a test to " + key;
                cdlibjs.msgEmail.type = 'html';
                cdlibjs.msgEmail.subject = "Mettler Toledo Backup Control ";
                console.log(val);
                cdlibjs.msgEmail.to = val;
                cdlibjs.sendEMailToRabbit(cdlibjs.msgEmail);
                //console.log(cdlibjs.msgEmail);

    //addEmail("emailKey", val.name, val.email);

            });
            return body;
        }).then(function () {
            //fs.unlinkSync(replaceConfig.workingFile);
        }).catch(function (err) { // Any HTTP status >= 400 falls here
           console.log("Found an error");
           console.error('Failed.', err.statusCode, ' >= 400', err);
            //fs.unlinkSync(replaceConfig.workingFile);
        });

