var Hapi = require('hapi');
var db = require('level');

var server = Hapi.createServer('localhost', 8080, {
    cors: true
});

server.pack.register([
    {
        plugin: require("hapi-level"),
        options: {
            path: './db',
            config: {
                valueEncoding: 'json'
            }
        }
    },
    {
        plugin: require('hapi-swagger'),
        options: {
            basePath: 'http://localhost:8080',
            endpoint: '/docs',
            pathPrefixSize: 1
        }
    },
    {
        plugin: require("./plugins/user")
    }
], function() {
    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    })

})


