const DealerInstallations = require("../models/DealerInstallations");

const top5DealerInstallationsQuery = () => {
    return DealerInstallations.aggregate([
        {
            $match: {
                dealerShopName: { $ne: null }
            }
        },
        {
            $group: {
                _id: "$dealerShopName",
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

module.exports = top5DealerInstallationsQuery;
