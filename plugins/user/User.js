module.exports = function(users) {

    var User = {}

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
           return callback(err, value)
        })
    }

    User.create = function(id, user, callback) {
       users.put(id, user, function(err) {
            if(err){
                return callback("There was a problem creating the user.", undefined)
            } else {
                return callback(undefined, id)
            }
        })
    }

    User.delete = function(id, callback) {
        users.get(id, function(err, value){
            if(err){
                return callback(err)
            } else {
                users.del(id, function(err){
                    if(err) {
                        return callback(err, undefined)
                    } else {
                        return callback(undefined, "User deleted successfully")
                    }
                })
            }
        })
    }

    return User
}
