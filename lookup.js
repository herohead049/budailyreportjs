var redis = require("redis"),
    cdlib = require('cdlib');

var redisConf = {
    //server: cdlib.getRedisAddress(),
    server: "localhost",
    port: 6379
};

var emailList = [
    {email: 'craig.david@mt.com'
    },
    {email: 'herohead@gmail.com'
    }
]



client = redis.createClient(redisConf.port,redisConf.server);


client.on("error", function (err) {
        console.log("Error " + err);
    });

console.log(redisConf.server);

client.set("foo_rand000000000000", JSON.stringify(emailList));

client.get("foo_rand000000000000", function (err, reply) {
        console.log(reply.toString()); // Will print `OK`
        console.log(JSON.parse(reply)[0].email);
    });

client.get(new Buffer("foo_rand000000000000"), function (err, reply) {
        console.log(reply.toString()); // Will print `<Buffer 4f 4b>`
    });


//client.del("foo_rand000000000000", function (err, reply) {
//        console.log(reply.toString()); // Will print `OK`
//    });

//client.end();
