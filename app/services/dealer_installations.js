const dealerInstallationsQuery=require("../queries/DealerInstallation_query");
const zoneDealerInstallationsQuery=require("../queries/zone_dealer_installation_query");
const dealerInstallationsLineQuery=require("../queries/dealerInstallation_line_query");
const moment=require("moment");

module.exports= {
    totalDealerInstallations: () => {
        return dealerInstallationsQuery().then(result => {
            const r = result[0] || {};
            return {
                yesterday: r.yesterday?.[0]?.count || 0,
                lastMonth: r.lastMonth?.[0]?.count || 0,
                lastYear: r.lastYear?.[0]?.count || 0
            }
        });
    },

    ZoneDealerInstallations: (type = "monthly") => {

        let startDate, endDate;

        if (type === "yearly") {
            startDate = moment().subtract(1, "year").startOf("year").toDate();
            endDate   = moment().subtract(1, "year").endOf("year").toDate();
        } else {
            startDate = moment().subtract(1, "month").startOf("month").toDate();
            endDate   = moment().subtract(1, "month").endOf("month").toDate();
        }
        return zoneDealerInstallationsQuery(startDate, endDate)
            .then(result => result);
    },

    DealerInstallationsLine: (type) => {

        let startDate;
        let format;

        if (type === "1year") {
            startDate = moment().subtract(1, "year").toDate();
            format= "%Y-%m";
        } else if (type === "30days") {
            startDate = moment().subtract(30, "days").toDate();
            format= "%Y-%m-%d";
        }else{
            startDate = moment().subtract(7, "day").toDate();
            format= "%Y-%m-%d";
        }
        return dealerInstallationsLineQuery(startDate,format)
            .then(result => result);
    }
}


