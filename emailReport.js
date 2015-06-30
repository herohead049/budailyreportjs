var cheerio = require('cheerio');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var moment = require("moment");
var cdlib = require("cdlibjs");
var path = require('path');
var _ = require('lodash');

cdlib.rabbitMQ.server = cdlib.getRabbitMQAddress();

//var srcFile = path.basename(argv.f);
var srcFile = argv.f;

fs.readFile('html/templateV2.html','utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    var s = cheerio.load(data);

    fs.readFile(srcFile, "utf8",function read(err, srcdata) {
        if (err) {
            throw err;
        }
        //console.log(srcdata.toString());
    var s1 = cheerio.load(srcdata);
    var q = s1('body').html();

        s('div.backupreport').replaceWith(q);

        var reportDateIndex = s.html().indexOf('Date: ');
        var reportDate = s.html().substring(reportDateIndex,reportDateIndex + 19);

       var rDate = moment(reportDate, "MM/DD/YY HH:mm").format("DD-MMM-YYYY HH:mm");

        s('div.reportdate').text(rDate);

var ss = s.html();

//console.log(ss.xml());
        //writeFile("report.html",ss);
        cdlib.msgEmail.from = "craig.david@mt.com";
        cdlib.msgEmail.smtpServer = "smtp.mt.com";
        cdlib.msgEmail.htmlData = s.html();
        cdlib.msgEmail.type = 'html';
        cdlib.msgEmail.subject = "Mettler Toledo Backup Control " + rDate;
        //cdlib.msgEmail.to = "craig.david@mt.com"
          var prequest = require('prequest');
        prequest('http://us01w-davidc:3000/get/emails').then(function (body) {
            console.log(body);
            return body;
        }).then(function (body) {
            _.forEach(body, function (val, key) {
                console.log(val);
                cdlib.msgEmail.to = val;
                cdlib.sendEMailToRabbit(cdlib.msgEmail);
                //console.log(cdlib.msgEmail);

    //addEmail("emailKey", val.name, val.email);

            });
            return body;
        }).then(function () {
            //fs.unlinkSync(replaceConfig.workingFile);
        }).catch(function (err) { // Any HTTP status >= 400 falls here
            console.error('Failed.', err.statusCode, ' >= 400');
            //fs.unlinkSync(replaceConfig.workingFile);
        });
        //cdlib.sendEMailToRabbit(cdlib.msgEmail);
});



});

function writeFile (file, data) {
 var fs = require('fs');
fs.writeFile(file, data,  "utf8",  function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});


}






