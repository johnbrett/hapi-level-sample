var Joi = require('joi')
var _ = require('lodash')
var Calibrate = require('calibrate')

exports.register = function(plugin, options, next) {

    var db = plugin.plugins['hapi-level'].db.sublevel('users')

    var User = require('./User')(db)

    plugin.expose(User)

    plugin.route([
        {
            path: "/users",
            method: "GET",
            handler: function(request, reply) {
                User.find(request.query, function(err, users){
                  if(err) {
                    return Calibrate.error(err)
                  }

                  return reply(Calibrate.response(users, undefined))
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
                 if(err) {
                   return reply(Calibrate.response(undefined))
                 }

                 return reply(Calibrate.response(user, undefined))
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
                    if(err) {
                      return reply(Calibrate.response(undefined))
                    }

                    User.findById(id, function(err, user){
                        if(err) {
                          return reply(Calibrate.response(undefined))
                        }

                        return reply(Calibrate.response(user, undefined))
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
                    if(err) {
                      return reply(Calibrate.response(undefined))
                    }

                    return reply(Calibrate.response("User deleted succesfully", undefined))

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
    ])

    next()
}

exports.register.attributes = {
    pkg: {
        "name": "user",
        "version": "0.0.1",
        "description": "example users feature for sample Hapi app",
        "main": "index.js"
    }
}
