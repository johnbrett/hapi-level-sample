const Hapi = require('hapi')
const Vision = require('vision')
const Blipp = require('blipp')
const Inert = require('inert')

const server = new Hapi.Server()

server.connection({ port: 3000, router: { stripTrailingSlash: true } })

server.register([
    Vision,
    Inert,
    Blipp,
    //{ register: require('./plugins/authentication') },
    {
        register: require("hapi-level"),
        options: {
            path: './db',
            config: {
                valueEncoding: 'json'
            }
        }
    },
    {
        register: require('hapi-swagger'),
        options: {
            pathPrefixSize: 1,
            payloadType: 'form',
            enableDocumentationPage: true
        }
    }/*,
    {
        register: require("./plugins/documentation"),
        options: {
            basePath: server.info.uri,
            endpoint: '/docs',
            auth: false,
            alias: '/documentation'
        }
    }*/,
    { register: require("./plugins/user") },
    { register: require("./plugins/organisation") }
], (err) => {

    if(err) { throw err; }

    server.start((err) => {

        if(err) { throw err; }
        console.log(`Server started at: ${server.info.uri} with [${Object.keys(server.plugins).join(', ')}] enabled`)
    })
})