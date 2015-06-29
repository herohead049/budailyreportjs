var cheerio = require('cheerio');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

fs.readFile('html/templateV2.html','utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    var s = cheerio.load(data);

    fs.readFile('html/2015_06_29_EU_Summary_Report.html',  "utf8",function read(err, srcdata) {
        if (err) {
            throw err;
        }
        //console.log(srcdata.toString());
    var s1 = cheerio.load(srcdata);
    var q = s1('body').html();
        console.log(q);

        s('div.backupreport').replaceWith(q);

var ss = s.html();

//console.log(ss.xml());
        writeFile("report.html",ss);

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






