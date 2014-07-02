var Joi = require('joi')
var _ = require('lodash')
var users = require('./users')

exports.register = function(plugin, options, next) {
    plugin.route([
        {
            path: "/users",
            method: "GET",
            handler: function(request, reply) {
                if(request.query.name){
                    users = _.filter(users, function(user) {
                        return user.name.indexOf(request.query.name) > -1;
                    })
                    reply({
                        statusCode: 200,
                        data: users
                    })
                } else {
                    reply({
                        statusCode: 200,
                        data: users
                    });
                }
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
        },
        {
            path: "/users/{id}",
            method: "GET",
            handler: function(request, reply) {
                reply({
                    statusCode: 200,
                    data: users[request.params.id]
                })
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
        },
        {
            path: "/users",
            method: "POST",
            handler: function(request, reply) {
                if(!users[request.query.id]) {
                    users[request.query.id] = {
                        id: request.query.id,
                        name: request.query.name
                    }
                    reply({
                        statusCode: 200,
                        data: users[request.query.id]
                    })
                } else {
                    reply({
                        statusCode: 400,
                        error: "ID already in use",
                        message: "Try again with a different ID"
                    })
                }
            },
            config: {
                validate: {
                    query: {
                        id: Joi.number().integer().required().description("User's ID"),
                        name: Joi.string().required().description("User's name")
                    }
                },
                tags: ['api'],
                description: "Create a user"
            }
        },
        {
            path: "/users/{id}",
            method: "DELETE",
            handler: function(request, reply) {
                if(users[request.params.id]) {
                    delete users[request.params.id]
                    reply({
                        statusCode: 200,
                        message: "User deleted succesfully"
                    })
                } else {
                    reply({
                        statusCode: 400,
                        message: "The user with that ID does not exist, or may alredy have been deleted."
                    })
                }
            },
            config: {
                validate: {
                    params: {
                        id: Joi.number().integer().required().description("User's ID")
                    }
                },
                tags: ['api'],
                description: "Delete a user"
            }
        }
    ]);
    next();
};

exports.register.attributes = {
    pkg: require("./package.json")
};