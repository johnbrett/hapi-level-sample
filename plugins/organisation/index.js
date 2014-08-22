var Joi = require('joi')
var Calibrate = require('calibrate')

exports.register = function (plugin, options, next) {

    plugin.dependency('hapi-level')
    plugin.dependency('user')

    var Organisation = require('./Organisation')(plugin)

    plugin.route([
        {
            path: "/organisations",
            method: "GET",
            handler: function(request, reply) {
                Organisation.find(null, function(err, orgs){
                    reply(Calibrate(err, orgs, null))
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
                    reply(Calibrate(err, organisation))
                })
            },
            config: {
                validate: {
                    params: {
                        id: Joi.number()
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
                    reply(Calibrate(err, organisation, null))
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