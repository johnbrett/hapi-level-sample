var Joi = require('joi')
var Calibrate = require('calibrate')

exports.register = function (plugin, options, next) {

    var user = plugin.plugins['user']
    var db = plugin.plugins['hapi-level'].db.sublevel('organisations')

    var Organisation = require('./Organisation')(db, user)

    plugin.expose(Organisation)

    plugin.route([
        {
            path: "/organisations",
            method: "GET",
            handler: function(request, reply) {
                Organisation.find(null, function(err, orgs){
                    if(err) {
                      return reply(Calibrate.response(undefined))
                    }

                    return reply(Calibrate(orgs, undefined))
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
                description: "Retrieve a list of organisations"
            }
        },
        {
            path: "/organisations/{id}",
            method: "GET",
            handler: function(request, reply) {
                Organisation.findById(request.params.id, function(err, organisation) {
                  if(err) {
                    return reply(Calibrate.response(undefined))
                  }

                  return reply(Calibrate.response(organisation))
                })
            },
            config: {
                validate: {
                    params: {
                        id: Joi.number().required()
                    },
                    query: {
                        name: Joi.string().description("Filter by user's name")
                    }
                },
                tags: ['api'],
                description: "Retrieve a list of organisations"
            }
        },
        {
            path: "/organisations",
            method: "POST",
            handler: function(request, reply) {
                Organisation.create(request.payload.id, request.payload, function(err, organisation) {
                    if(err) {
                      return Calibrate.response(null)
                    }

                    return reply(Calibrate.response(organisation, undefined))
                })
            },
            config: {
                validate: {
                    params: false,
                    payload: {
                        "id": Joi.number(),
                        "name": Joi.string()
                    }
                },
                tags: ['api'],
                description: "Create an organisation"
            }
        }
    ])

    next()
}

exports.register.attributes = {
    pkg: {
        "name": "organisation",
        "version": "0.0.1",
        "description": "example organisation feature for sample Hapi app",
        "main": "index.js"
    }
}
