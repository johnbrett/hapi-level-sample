var Joi = require('joi')

exports.register = function (plugin, options, next) {

    var users;

    plugin.dependency('user', function(plugin, next) {

        users = plugin.plugins.user.users;

        users.registerIndex('organisation', function (key, value, emit) {
            if (value.organisation) {
                emit(value.organisation)
            }
        })
        next();
    });

    plugin.route([
        {
            path: "/organisations",
            method: "GET",
            handler: function(request, reply) {
                var orgs = []
                users.createIndexedStream('organisation', request.query.name)
                    .on('data', function(data) {
                        orgs.push(data.value)
                    })
                    .on('end', function(data) {
                        reply({
                            statusCode: 200,
                            data: orgs
                        })
                    })
            },
            config: {
                validate: {
                    params: false,
                    query: {
                        name: Joi.string().description("Filter by user's name")
                    }
                },
                tags: ['api'],
                description: "Retrieve a list of users"
            }
        }
    ])

    next();
};

exports.register.attributes = {
    pkg: {
        "name": "organisation",
        "version": "0.0.1",
        "description": "example organisation feature for sample Hapi app",
        "main": "index.js"
    }
};