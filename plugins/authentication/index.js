exports.register = function(plugin, options, next) {

    var auth_scheme = process.env.AUTH || 'optional'
    
    plugin.register({ register: require('hapi-auth-bearer-token') }, function(err) {

        plugin.auth.strategy('default', 'bearer-access-token', auth_scheme, {
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

        next()
    })
}

exports.register.attributes = {
    pkg: {
        "name": "authentication",
        "description": "This is the authentication provider",
        "main": "index.js",
        "author": "John Brett",
        "license": "MIT"
    }
}