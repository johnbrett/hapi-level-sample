module.exports = function(organisations, user) {

    var Organisation = {}

    var users = user.users
    
    Organisation.find = function(filters, callback) {
        var orgs = []
        organisations.createReadStream()
            .on('data', function(data) {
                orgs.push(data.value)
            })
            .on('error', function(err) {
                callback(err.message, null)
            })
            .on('end', function(data) {
                callback(null, orgs)
            })
    }

    Organisation.findById = function(id, callback) {
        var org_users = []
        organisations.get(id, function(err, organisation) {
            if(err) {
                callback(null, null)
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
                            users: org_users
                        })
                    })
            }
        })  
    }

    Organisation.create = function(organisation_id, organisation, callback) {
        organisations.put(organisation_id, organisation, function(err) {
            if(err){
                callback("There was a problem creating the organisation", null)
            } else {
                Organisation.findById(organisation_id, function(err, data) {
                  callback(null, data)
                })
            }
        })
    }

    return Organisation
}