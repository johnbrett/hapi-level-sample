var Hapi = require('hapi');

var server = Hapi.createServer('localhost', process.env.PORT || 8080, {
    cors: true
});

server.pack.register([
    { plugin: require('hapi-auth-bearer-token') },
    { plugin: require('./plugins/authentication') },
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
            basePath: server.info.uri,
            endpoint: '/docs',
            pathPrefixSize: 1,
            apiVersion: 1,
            auth: false,
            payloadType: 'form'
        }
    },
    {
        plugin: require("./plugins/documentation"),
        options: {
            basePath: server.info.uri,
            endpoint: '/docs',
            auth: false,
            alias: '/documentation'
        }
    },
    { plugin: require("./plugins/user") },
    { plugin: require("./plugins/organisation") }
], function() {
    server.start(function () {
        console.log('Server started at: ' + server.info.uri);
    })
})