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
    },

    top5regionsTable: (req, res) => {

        return dealerInstallService.top5regions().then((data)=>{
            return res.json(response.JsonMsg(true,data, "Dealer Installations Data for top 5 regions", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    },

    top5DealerInstallationsTable: (req, res) => {

        return dealerInstallService.top5DealerInstallations().then((data)=>{
            return res.json(response.JsonMsg(true,data, "Dealer Installations Data for top 5 regions", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    },

    top5MakeModelTable: (req, res) => {

        return dealerInstallService.top5MakeModel().then((data)=>{
            return res.json(response.JsonMsg(true,data, "Dealer Installations Data for top 5 regions", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    },

    top5ZonesTable: (req, res) => {

        return dealerInstallService.top5Zones().then((data)=>{
            return res.json(response.JsonMsg(true,data, "Dealer Installations Data for top 5 zones", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    }

}
