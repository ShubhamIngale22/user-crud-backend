const response = require("../utilities/api_handler");
const dealerInstallService=require("../services/dealer_installations");

module.exports = {
    dealerInstallationTable: (req, res) => {
        return dealerInstallService.totalDealerInstallations().then((data)=>{
            return res.json(response.JsonMsg(true, data, "Installations Data", 200));
        }).catch((err)=>{
            console.error(err);
            return res.json(response.JsonMsg(false, null , "Failed to fetch data", 500));
        })
    }
};
