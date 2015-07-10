/*jslint nomen: true */
/*jslint node:true */

"use strict";


var util = require('../budailyreportjs/lib/cdutils.js');
var _ = require('lodash');
/**
var email = {
    emailList: [{to: "Craig David", email: "craig.david@mt.com"},
                {to: "Craig Gmail", email: "herohead@gmail.com"}],
    from: "Backup Reports", email: "dpa@mt.com"

};
**/


var email = util.readEmailConf('test/testemail.conf');
console.log(email.to);

/**

var email = JSON.parse(util.readFile('test/email.conf'));

_.forEach(email.emailToList, function (key, val) {
    console.log(key.email);
});

var emailFrom = email.emailFrom.email;
console.log(emailFrom);

**/
