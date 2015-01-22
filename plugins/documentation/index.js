exports.register = function(plugin, options, next) {

    plugin.path(__dirname)

    plugin.dependency('hapi-swagger', function(plugin, next){

        plugin.views({
            engines: { html: require('handlebars') },
            path: './public'
        })

        plugin.route([
            {
                method: 'GET',
                path: options.alias || 'documentation',
                config: {
                    handler: function(request, reply){
                        reply.view('index.html', {
                            title: 'D4H API Documentation',
                            markdown: '<p>More Info about the documentation will be posted here...</p>',
                            settings:{
                                basePath: options.basePath,
                                endpoint: options.endpoint
                            }
                        });
                    },
                    auth: options.auth || false
                }
            }
        ])

        next()
    })

    next()
}

exports.register.attributes = {
    pkg: {
        "name": "documentation",
        "version": "0.0.1",
        "description": "This is the documentation provider",
        "main": "index.js",
        "author": "John Brett",
        "license": "MIT"
    }
}