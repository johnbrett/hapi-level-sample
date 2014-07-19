var Hapi = require('hapi');

var server = Hapi.createServer('localhost', process.env.PORT || 8080, {
    cors: true
});

server.pack.register([
        { plugin: require('hapi-auth-bearer-token') },
        {
            plugin: require("hapi-level"),
            options: {
                path: './db',
                config: {
                    valueEncoding: 'json'
                }
            }
        }
    ], function(err){

    server.auth.strategy('default', 'bearer-access-token', 'required', {
        validateFunc: function(token, callback) {
            var db = server.plugins['hapi-level'].db
            var users = db.sublevel('users')

            var response = []
            users.createReadStream()
                .on('data', function(data) {
                    if(data.value.access_token === token) {
                        callback(null, true, { token: token, user: data.value })
                    }
                })
                .on('end', function(data) {
                    callback(null, false, null)
                })
        }
    })

    server.pack.register([
        {
            plugin: require('hapi-swagger'),
            options: {
                basePath: server.info.uri,
                endpoint: '/docs',
                pathPrefixSize: 1,
                apiVersion: 1,
                auth: false
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
})