var Hapi = require('hapi');

var server = Hapi.createServer('localhost', 8080, {
    cors: true
});

server.pack.register([
    {
        plugin: require("./plugins/user")
    },
    {
        plugin: require('hapi-swagger'),
        options: {
            basePath: 'http://localhost:8080',
            endpoint: '/docs',
            pathPrefixSize: 1
        }
    }
], function() {
    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    })
})


