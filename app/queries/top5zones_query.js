const DealerInstallations = require("../models/DealerInstallations");

const top5zonesQuery = () => {
    return DealerInstallations.aggregate([
        {
            $match: {
                zone: { $ne: null }
            }
        },
        {
            $group: {
                _id: "$zone",
                count: { $sum: 1 }
            },
        },
        {
            $sort: {count:-1}
        },
        {
            $limit:5
        },
        {
            $project: {
                _id: 0,
                zone: "$_id",
                count: 1
            }
        }
    ])
}
module.exports = top5zonesQuery;
