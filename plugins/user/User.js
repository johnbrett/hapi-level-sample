module.exports = function(plugin) {

    var User = {}

    var hapi = plugin.hapi
    var db = plugin.plugins['hapi-level'].db
    var users = db.sublevel('users')

    User.users = users

    User.find = function(filters, callback) {

        var response = []
        users.createReadStream()
            .on('data', function(data) {
                if (typeof filters.name === "undefined" || data.value.name.indexOf(filters.name) >= 0) {
                    response.push(data.value)
                }
            })
            .on('error', function(err) {
                return callback(err, null)
            })
            .on('end', function(data) {
                return callback(null, response)
            })
    }

    User.findById = function(user_id, callback) {
        users.get(user_id, function(err, value) {
            if(err){
                return callback(hapi.error.notFound("The user with that ID does not exist, or may alredy have been deleted."), null)
            } else {
                return callback(null, value);
            }
        })
    }

    User.create = function(id, user, callback) {
       users.put(id, user, function(err) {
            if(err){
                return callback(hapi.error.internal("There was a problem creating the user."), null)
            } else {
                return callback(null, id)
            }
        })
    }

    User.delete = function(id, callback) {
        users.get(id, function(err, value){
            if(err){
                callback(hapi.error.notFound("The user with that ID does not exist, or may alredy have been deleted."), null)
            } else {
                users.del(id, function(err){
                    if(err) {
                        return callback(hapi.error.internal("There was an error deleting the user."), null)
                    } else {
                        return callback(null, "User deleted successfully")
                    }
                })
            }
        })
    }

    return User
}
