var Joi = require('joi')
var _ = require('lodash')
var users = require('./users')

exports.register = function(plugin, options, next) {

    var hapi = plugin.hapi
    var db = plugin.plugins['hapi-level'].db

    plugin.route([
        {
            path: "/users",
            method: "GET",
            handler: function(request, reply) {
                var users = []
                db.createReadStream()
                    .on('data', function(data) {
                        if (typeof request.query.name === "undefined" || data.value.indexOf(request.query.name) >= 0) {
                            users.push({
                                id: data.key,
                                name: data.value
                            })
                        }
                    })
                    .on('end', function(data) {
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
                db.get(request.params.id, function(err, value) {
                    if(err){
                        reply(hapi.error.notFound("The user with that ID does not exist, or may alredy have been deleted."))
                    } else {
                        reply({
                            statusCode: 200,
                            data: {
                                id: request.params.id,
                                name: value
                            }
                        })
                    }
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
                db.put(request.query.id, request.query.name, function(err) {
                    if(err){
                        reply(hapi.error.notFound("The user with that ID does not exist, or may alredy have been deleted."))
                    } else {
                        db.get(request.query.id, function(err, value) {
                            reply({
                                statusCode: 200,
                                data: {
                                    id: request.query.id,
                                    name: value
                                }
                            })
                        })
                    }
                })
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
                db.get(request.params.id, function(err, value){
                    if(err){
                        reply(hapi.error.notFound("The user with that ID does not exist, or may alredy have been deleted."))
                    } else {
                        db.del(request.params.id, function(err){
                            if(err){
                                reply(hapi.error.internal("Failed to delete user."))
                            } else {
                                reply({
                                    statusCode: 200,
                                    message: "User deleted succesfully"
                                })
                            }
                        })
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
        "name": "users",
        "version": "0.0.1",
        "description": "example users feature for sample Hapi app",
        "main": "index.js"
    }
};