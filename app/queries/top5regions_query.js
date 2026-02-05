const DealerInstallations = require("../models/DealerInstallations");

const top5regionsQuery = () => {
    return DealerInstallations.aggregate([
        {
            $match: {
                regionName: { $ne: null }
            }
        },
        {
            $group: {
                _id: "$regionName",
                count: { $sum: 1 }
            },
        },
        {
            $sort: {count:-1}
        },
        {
            $limit:5
        }

    ])
}

module.exports = top5regionsQuery;
