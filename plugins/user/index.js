var Joi = require('joi')
var _ = require('lodash')
var Calibrate = require('calibrate')

exports.register = function(plugin, options, next) {

    plugin.dependency('hapi-level')

    var User = require('./User')(plugin)

    plugin.expose({users: User.users})

    plugin.route([
        {
            path: "/users",
            method: "GET",
            handler: function(request, reply) {
                User.find(request.query, function(err, users){
                    reply(Calibrate(err, users, null))
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
                User.findById(request.params.id, function(err, user){
                    reply(Calibrate(err, user, null))
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
                User.create(request.payload.id, request.payload, function(err, id){ 
                    User.findById(id, function(err, user){
                        reply(Calibrate(err, user, null))
                    })
                })
            },
            config: {
                validate: {
                    payload: {
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
                User.delete(request.params.id, function(err, result){
                    reply(Calibrate(err, "User deleted succesfully", null))
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