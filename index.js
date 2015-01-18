var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({ host: 'localhost', port: 3000, router: { stripTrailingSlash: true }});

server.register([
    { register: require('hapi-auth-bearer-token') },
    { register: require('./plugins/authentication') },
    {
        register: require("hapi-level"),
        options: {
            path: './db',
            config: {
                valueEncoding: 'json'
            }
        }
    },
    {
        register: require('hapi-swagger'),
        options: {
            basePath: server.info.uri,
            endpoint: '/docs',
            pathPrefixSize: 1,
            apiVersion: 1,
            auth: false,
            payloadType: 'form',
            enableDocumentationPage: false
        }
    },
    {
        register: require("./plugins/documentation"),
        options: {
            basePath: server.info.uri,
            endpoint: '/docs',
            auth: false,
            alias: '/documentation'
        }
    },
    { register: require("./plugins/user") },
    { register: require("./plugins/organisation") }
], function() {
    server.start(function () {
        console.log('Server started at: ' + server.info.uri + ' with [' + Object.keys(server.plugins).join(', ') + '] enabled')
    })
})