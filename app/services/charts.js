const ExcelRow = require("../models/ExcelRow");

const aggregateTop5 = (uploadId, mongoField) => {
    let q = ExcelRow.aggregate([
        { $match: { uploadId } },
        {
            $group: {
                _id: `$${mongoField}`,
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    return q
        .then(data => Promise.resolve(data))
        .catch(err => Promise.reject(err));
};

module.exports = {
    getTop5Dealers: (uploadId) =>
        aggregateTop5(uploadId, "data.dealerShopName"),

    getTop5Zones: (uploadId) =>
        aggregateTop5(uploadId, "data.zone"),

    getTop5Regions: (uploadId) =>
        aggregateTop5(uploadId, "data.regionName"),
};
