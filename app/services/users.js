const users = require('../models/User');

module.exports = {
    getUser: (query) => {
        return users.findOne(query).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    },

    allUser: () => {
        return users.find({}).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    },

    addUser: (data) => {
        let user = new users(data);
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

    deleteUser: (query) => {
        return users.findOneAndDelete(query).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }




}
