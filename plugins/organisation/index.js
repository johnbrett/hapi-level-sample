var Joi = require('joi')

exports.register = function (plugin, options, next) {

    var users;

    plugin.dependency('user')

    var db = plugin.plugins['hapi-level'].db
    var users = plugin.plugins['user'].users
    var organisations = db.sublevel('organisations')

    // users.pre(function(value, add){
    //     console.log(value)
    //     add({
    //         key: value.organisation,
    //         value: value.value,
    //         type: 'put',
    //         prefix: organisations
    //     })
    // })

    plugin.route([
        {
            path: "/organisations",
            method: "GET",
            handler: function(request, reply) {
                var orgs = []
                organisations.createReadStream()
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
                description: "Retrieve a list of organisations"
            }
        },
        {
            path: "/organisations/{id}",
            method: "GET",
            handler: function(request, reply) {

                organisations.get(request.params.id, function(err, organisation) {
                    var org_users = []
                    users.createReadStream()
                        .on('data', function(data) {
                            if (data.value.organisation === organisation.name) {
                                org_users.push(data.value.name)
                            }
                        })
                        .on('end', function(data) {
                            reply({
                                id: organisation.id,
                                name: organisation.name,
                                users: org_users
                            })
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
                organisations.put(request.payload.id, request.payload, function(err) {
                    if(err){
                        reply(Hapi.error.internal("There was a problem creating the user."))
                    } else {
                        organisations.get(request.payload.id, function(err, value) {
                            reply(value)
                        })
                    }
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