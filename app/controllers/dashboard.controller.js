const response = require("../utilities/api_handler");
const dealerInstallService=require("../services/dealer_installations");
const chartFormatter = require("../utilities/chartFormatter");

module.exports = {
    dealerInstallationTable: (req, res) => {
        return dealerInstallService.totalDealerInstallations().then((data)=>{
            return res.json(response.JsonMsg(true, data, "Dealer Installations Data", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    },

    zoneDealerInstallationsPie: (req, res) => {
        const type=req.query.type;

        return dealerInstallService.ZoneDealerInstallations(type).then((data)=>{
            return res.json(response.JsonMsg(true, data, "Zone-wise Installations Data", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    },

    DealerInstallationsLineChart: (req, res) => {
        const type=req.query.type || "7days";

        return dealerInstallService.DealerInstallationsLine(type).then((data)=>{

            const LineChartData=chartFormatter.lineChart(data);

            return res.json(response.JsonMsg(true,LineChartData, "Dealer Installations Data for Line-Chart", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    }
}
