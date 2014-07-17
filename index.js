var Hapi = require('hapi');

var server = Hapi.createServer('localhost', 8080, {
    cors: true
});

server.pack.register(require('hapi-auth-bearer-token'), function(err){

    server.auth.strategy('default', 'bearer-access-token', 'required', {
        validateFunc: function(token, callback) {
            callback(null, token === "abcdef1234", { token: token })
        }
    })

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
                pathPrefixSize: 1,
                apiVersion: 1,
                auth: false
            }
        },
        {
            plugin: require("./plugins/user")
        },
        {
            plugin: require("./plugins/organisation")
        },
        {
            plugin: require("./plugins/documentation"),
            options: {
                basePath: 'http://localhost:8080',
                endpoint: '/docs',
                auth: false,
                alias: '/documentation'
            }
        }
    ], function() {
        server.start(function () {
            console.log('Server started at: ' + server.info.uri);
        })
    })

})


