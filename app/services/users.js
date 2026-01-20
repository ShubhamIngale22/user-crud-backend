const users = require('../models/User');

module.exports = {
    getUser: (query, includePassword = false) => {
        let q = users.findOne(query);
        if (includePassword) {
            q = q.select('+password');
        }
        return q
            .then((data) => Promise.resolve(data))
            .catch((err) => Promise.reject(err));
    },

    allUser: () => {
        return users.find({}).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    },

    addUser: (data) => {
        let user= new users(data);
        return user.save().then((result) => {
            return Promise.resolve(result);
        }).catch((err) => {
            return Promise.reject(err);
        });
    },

    updateUser: (query, update) => {
        return users.findOneAndUpdate(query, update, {new: true}).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    },

    updateUserWithSave: (query, updateData) => {
        return users.findOne(query)
            .then((user) => {
                if (!user) {
                    return Promise.resolve(null);
                }

                // update fields dynamically
                Object.keys(updateData).forEach((key) => {
                    user[key] = updateData[key];
                });

                // this triggers pre("save")
                return user.save();
            })
            .then((savedUser) => {
                return Promise.resolve(savedUser);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },

    deleteUser: (query) => {
        return users.findOneAndDelete(query).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

}
