var Joi = require('joi')
var users = require('./users')

exports.register = function(plugin, options, next) {
    plugin.route([
        {
            path: "/users",
            method: "GET",
            handler: function(request, reply) {
                reply(users);
            },
            config: {
                validate: {
                    params: false
                },
                tags: ['api'],
                description: "Retrieve a list of users"
            }
        },
        {
            path: "/users/{id}",
            method: "GET",
            handler: function(request, reply) {
                reply(users[request.params.id])
            },
            config: {
                validate: {
                    params: {
                        id: Joi.number().integer().required()
                    }
                },
                tags: ['api'],
                description: "Retrieve a user by their ID"
            }
        }
    ]);
    next();
};

exports.register.attributes = {
    pkg: require("./package.json")
};