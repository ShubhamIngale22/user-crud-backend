const DealerInstallations = require("../models/DealerInstallations");

const dealerInstallationsLineQuery = (startDate, format) => {
    return DealerInstallations.aggregate([
        {
            $match: {
                installationDate: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: format,
                        date: "$installationDate"
                    }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
};

module.exports = dealerInstallationsLineQuery;
