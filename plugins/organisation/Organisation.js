module.exports = function(plugin) {

    var Organisation = {}
    
    var hapi = plugin.hapi
    var db = plugin.plugins['hapi-level'].db
    var users = plugin.plugins['user'].users
    var organisations = db.sublevel('organisations')

    Organisation.find = function(filters, callback) {
        var orgs = []
        organisations.createReadStream()
            .on('data', function(data) {
                orgs.push(data.value)
            })
            .on('error', function(err) {
                callback(err, null)
            })
            .on('end', function(data) {
                callback(null, orgs)
            })
    }

    Organisation.findById = function(id, callback) {
        var org_users = []
        organisations.get(id, function(err, organisation) {
            if(err) {
                callback(hapi.error.notFound('Organisation resource does not exist'), null)
            } else {
                users.createReadStream()
                    .on('data', function(data) {
                        if (data.value.organisation === organisation.name) {
                            org_users.push(data.value.name)
                        }
                    })
                    .on('error', function(err) {
                        callback(err, null)
                    })
                    .on('end', function(data) {
                        callback(null, {
                            id: organisation.id,
                            name: organisation.name,
                            user: org_users
                        })
                    })
            }
        })  
    }

    Organisation.create = function(organisation_id, organisation, callback) {
        organisations.put(organisation_id, organisation, function(err) {
            if(err){
                callback(hapi.error.internal("There was a problem creating the user."), null)
            } else {
                Organisation.findById(organisation_id, function(data) {
                  callback(null, data)
                })
            }
        })
    }

    return Organisation
}