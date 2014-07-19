var Joi = require('joi')
var _ = require('lodash')

exports.register = function(plugin, options, next) {

    var hapi = plugin.hapi
    var db = plugin.plugins['hapi-level'].db

    var User = require('./User')(db)

    plugin.expose({users: User.users})

    plugin.route([
        {
            path: "/users",
            method: "GET",
            handler: function(request, reply) {
                User.find(request.query, function(users){
                    reply({
                        statusCode: 200,
                        data: users
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
        },
        {
            path: "/users/{id}",
            method: "GET",
            handler: function(request, reply) {
                User.findById(request.params.id, function(user){
                    reply({
                        statusCode: 200,
                        data: user
                    })
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
                User.create(request.query.id, request.query, function(id){ 
                    
                    User.findById(id, function(user){
                        reply({
                            statusCode: 200,
                            data: user
                        })
                    })
                })
            },
            config: {
                validate: {
                    query: {
                        id: Joi.number().integer().required().description("User's ID"),
                        name: Joi.string().required().description("User's name"),
                        organisation: Joi.string().required().description("User's organisation"),
                        access_token: Joi.string().required().description("User's login token")
                    }
                },
                auth: false,
                tags: ['api'],
                description: "Create a user"
            }
        },
        {
            path: "/users/{id}",
            method: "DELETE",
            handler: function(request, reply) {
                User.delete(request.params.id, function(result){
                    if(result === true){
                        reply({
                            statusCode: 200,
                            message: "User deleted succesfully"
                        })
                    } else {
                        reply(result)
                    }
                })
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
    pkg: {
        "name": "user",
        "version": "0.0.1",
        "description": "example users feature for sample Hapi app",
        "main": "index.js"
    }
};