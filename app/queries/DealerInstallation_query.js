const DealerInstallations = require("../models/DealerInstallations");
const moment = require("moment");

const dealerInstallationsQuery = () => {

    const yesterdayStart = moment().subtract(1, "day").startOf("day").toDate();
    const yesterdayEnd   = moment().subtract(1, "day").endOf("day").toDate();

    const lastMonthStart = moment().subtract(1, "month").startOf("month").toDate();
    const lastMonthEnd   = moment().subtract(1, "month").endOf("month").toDate();

    const lastYearStart = moment().subtract(1, "year").startOf("year").toDate();
    const lastYearEnd   = moment().subtract(1, "year").endOf("year").toDate();

    return DealerInstallations.aggregate([
        {
            $facet: {
                yesterday: [
                    {
                        $match: {
                            installationDate: {
                                $gte: yesterdayStart,
                                $lte: yesterdayEnd
                            }
                        }
                    },
                    { $count: "count" }
                ],

                lastMonth: [
                    {
                        $match: {
                            installationDate: {
                                $gte: lastMonthStart,
                                $lte: lastMonthEnd
                            }
                        }
                    },
                    { $count: "count" }
                ],

                lastYear: [
                    {
                        $match: {
                            installationDate: {
                                $gte: lastYearStart,
                                $lte: lastYearEnd
                            }
                        }
                    },
                    { $count: "count" }
                ]
            }
        }
    ]);
};

module.exports = dealerInstallationsQuery;
