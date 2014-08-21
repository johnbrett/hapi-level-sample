var Joi = require('joi')

exports.register = function (plugin, options, next) {

    plugin.dependency('hapi-level')
    plugin.dependency('user')

    var Organisation = require('./Organisation')(plugin)

    plugin.route([
        {
            path: "/organisations",
            method: "GET",
            handler: function(request, reply) {
                Organisation.find(null, function(orgs){
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
                description: "Retrieve a list of organisations"
            }
        },
        {
            path: "/organisations/{id}",
            method: "GET",
            handler: function(request, reply) {
                Organisation.findById(request.params.id, function(organisation, org_users) {
                    reply({
                        id: organisation.id,
                        name: organisation.name,
                        users: org_users
                    })
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
                Organisation.create(request.payload.id, request.payload, function(organisation) {
                    reply({
                       statusCode: 200,
                       data: organisation
                    })
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